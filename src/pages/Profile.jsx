import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEdit,
  FaTimes,
  FaCheck,
  FaBox,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaCamera,
  FaPhone,
  FaCalendarAlt,
  FaVenusMars,
  FaHome,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaLock,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { getLoggedInUser, getUserProfile, logoutUser, updateUserProfile } from '../services/api';
import '../styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [loggedInUser] = useState(() => getLoggedInUser());

  const [activeSection, setActiveSection] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: loggedInUser?.name || 'User',
    email: loggedInUser?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });

  const [formData, setFormData] = useState(profileData);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    alternatePhone: '',
    landmark: '',
  });
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const persistUserNameInSession = (name) => {
    try {
      const currentUser = getLoggedInUser();
      if (!currentUser) {
        return;
      }
      window.localStorage.setItem('shopease_user', JSON.stringify({ ...currentUser, name }));
      window.dispatchEvent(new Event('authStateChanged'));
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await getUserProfile(loggedInUser.id);
        const mappedProfile = {
          name: data?.name || loggedInUser?.name || 'User',
          email: data?.email || loggedInUser?.email || '',
          phone: data?.phone || '',
          dateOfBirth: data?.dateOfBirth || '',
          gender: data?.gender || '',
          address: data?.address || '',
        };

        setProfileData(mappedProfile);
        setFormData(mappedProfile);
        setAddresses(Array.isArray(data?.addresses) ? data.addresses : []);
        setImagePreview(data?.profileImage || null);
        if (mappedProfile.name) {
          persistUserNameInSession(mappedProfile.name);
        }
      } catch (error) {
        const message = error?.response?.data?.message || 'Unable to load profile details';
        toast.error(message);
      }
    };

    loadProfile();
  }, [loggedInUser?.id, navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!loggedInUser?.id) {
      toast.error('User session not found. Please login again.');
      return;
    }

    if (formData.phone && !formData.phone.match(/^\d{10}$/)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        profileImage: imagePreview,
        addresses,
      };
      const saved = await updateUserProfile(loggedInUser.id, payload);
      const updatedProfile = {
        name: saved?.name || formData.name,
        email: saved?.email || formData.email,
        phone: saved?.phone || '',
        dateOfBirth: saved?.dateOfBirth || '',
        gender: saved?.gender || '',
        address: saved?.address || '',
      };

      setProfileData(updatedProfile);
      setFormData(updatedProfile);
      setAddresses(Array.isArray(saved?.addresses) ? saved.addresses : []);
      setImagePreview(saved?.profileImage || imagePreview || null);
      setIsEditingProfile(false);
      persistUserNameInSession(updatedProfile.name);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to save profile';
      toast.error(message);
    }
  };

  const handleCancelEdit = () => {
    setFormData(profileData);
    setIsEditingProfile(false);
  };

  const handleSavePassword = () => {
    if (!passwordData.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    toast.success('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
    // TODO: API call to change password
  };

  const handleLogout = () => {
    logoutUser();
    window.dispatchEvent(new Event('authStateChanged'));
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'orders', label: 'Orders', icon: FaBox },
    { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt },
    { id: 'payments', label: 'Payments', icon: FaCreditCard },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const handleAddAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async () => {
    if (!loggedInUser?.id) {
      toast.error('User session not found. Please login again.');
      return;
    }

    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode || !newAddress.phone) {
      toast.error('Please fill in all address fields');
      return;
    }
    if (!newAddress.pincode.match(/^\d{6}$/)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    if (!newAddress.phone.match(/^\d{10}$/)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const nextAddresses = [...addresses, { ...newAddress, id: Date.now() }];
    // optimistic UI update
    setAddresses(nextAddresses);
    setNewAddress({ street: '', city: '', state: '', pincode: '', phone: '', alternatePhone: '', landmark: '' });
    setShowAddAddressForm(false);

    try {
      const saved = await updateUserProfile(loggedInUser.id, {
        name: profileData.name,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        address: profileData.address,
        addresses: nextAddresses,
      });

      // replace with authoritative server data when available
      setAddresses(Array.isArray(saved?.addresses) ? saved.addresses : nextAddresses);
      toast.success('Address added successfully!');
    } catch (error) {
      // revert optimistic update on failure
      setAddresses(addresses);
      const message = error?.response?.data?.message || 'Failed to save address';
      toast.error(message);
    }
  };

  const handleRemoveAddress = async (addressId) => {
    if (!loggedInUser?.id) {
      toast.error('User session not found. Please login again.');
      return;
    }

    try {
      const nextAddresses = addresses.filter((addr) => addr.id !== addressId);
      const saved = await updateUserProfile(loggedInUser.id, {
        name: profileData.name,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        address: profileData.address,
        addresses: nextAddresses,
      });

      setAddresses(Array.isArray(saved?.addresses) ? saved.addresses : nextAddresses);
      toast.success('Address removed successfully!');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to remove address';
      toast.error(message);
    }
  };

  const handleEditAddress = (addressId) => {
    const addressToEdit = addresses.find((addr) => addr.id === addressId);
    if (addressToEdit) {
      setNewAddress(addressToEdit);
      setEditingAddressId(addressId);
      setShowAddAddressForm(true);
    }
  };

  const handleUpdateAddress = async () => {
    if (!loggedInUser?.id) {
      toast.error('User session not found. Please login again.');
      return;
    }

    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode || !newAddress.phone) {
      toast.error('Please fill in all required address fields');
      return;
    }
    if (!newAddress.pincode.match(/^\d{6}$/)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    if (!newAddress.phone.match(/^\d{10}$/)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const prev = addresses;
    const nextAddresses = addresses.map((addr) =>
      addr.id === editingAddressId ? { ...newAddress, id: editingAddressId } : addr
    );

    // optimistic update
    setAddresses(nextAddresses);
    setNewAddress({ street: '', city: '', state: '', pincode: '', phone: '', alternatePhone: '', landmark: '' });
    setEditingAddressId(null);
    setShowAddAddressForm(false);

    try {
      const saved = await updateUserProfile(loggedInUser.id, {
        name: profileData.name,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        address: profileData.address,
        addresses: nextAddresses,
      });

      setAddresses(Array.isArray(saved?.addresses) ? saved.addresses : nextAddresses);
      toast.success('Address updated successfully!');
    } catch (error) {
      // revert on failure
      setAddresses(prev);
      const message = error?.response?.data?.message || 'Failed to update address';
      toast.error(message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = String(reader.result || '');
      const approxSizeInMb = result.length / (1024 * 1024);

      if (approxSizeInMb > 4.5) {
        toast.error('Image is too large to store locally. Please choose a smaller image.');
        return;
      }

      setImagePreview(result);
      setProfileImage(file);

      if (loggedInUser?.id) {
        try {
          await updateUserProfile(loggedInUser.id, {
            name: formData.name,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            address: formData.address,
            profileImage: result,
            addresses,
          });
        } catch (error) {
          const message = error?.response?.data?.message || 'Failed to save profile image';
          toast.error(message);
          return;
        }
      }

      toast.success('Profile image saved successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="se-profile-page">
      <TopNavbar />

      <main className="se-profile-main">
        {/* Profile Header */}
        <div className="se-profile-header">
          <div className="se-profile-header-content">
            <div className="se-profile-avatar-section">
              <div className="se-profile-avatar-large" style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {!imagePreview && <FaUser />}
              </div>
              <button className="se-avatar-upload-btn" title="Upload photo" onClick={handleUploadClick}>
                <FaCamera />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                aria-label="Upload profile image"
              />
            </div>
            <div className="se-profile-header-info">
              <h1>{profileData.name}</h1>
              <p>{profileData.email}</p>
              <span className="se-member-since">Member since today</span>
            </div>
            <button className="se-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        <div className="se-profile-container">
          {/* Sidebar Navigation */}
          <aside className="se-profile-sidebar">
            <nav className="se-profile-nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`se-profile-nav-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon className="se-nav-icon" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <section className="se-profile-content">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="se-profile-section">
                <div className="se-section-header">
                  <h2>Personal Information</h2>
                  {!isEditingProfile && (
                    <button
                      className="se-edit-btn"
                      onClick={() => (setFormData(profileData), setIsEditingProfile(true))}
                    >
                      <FaEdit /> Edit
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="se-profile-info-display">
                    <div className="se-info-card">
                      <label>Full Name</label>
                      <p>{profileData.name || '-'}</p>
                    </div>
                    <div className="se-info-card">
                      <label>Email</label>
                      <p>{profileData.email || '-'}</p>
                    </div>
                    <div className="se-info-card">
                      <label>Phone Number</label>
                      <p>{profileData.phone || 'Not added'}</p>
                    </div>
                    <div className="se-info-card">
                      <label>Date of Birth</label>
                      <p>{profileData.dateOfBirth || 'Not added'}</p>
                    </div>
                    <div className="se-info-card">
                      <label>Gender</label>
                      <p>{profileData.gender || 'Not added'}</p>
                    </div>
                    <div className="se-info-card se-full-width">
                      <label>Address</label>
                      <p>{profileData.address || 'No address added'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="se-profile-form">
                    <div className="se-form-grid">
                      <div className="se-form-group">
                        <label>
                          <FaPhone /> Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleProfileChange}
                          placeholder="Enter 10-digit phone number"
                        />
                      </div>

                      <div className="se-form-group">
                        <label>
                          <FaCalendarAlt /> Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleProfileChange}
                        />
                      </div>

                      <div className="se-form-group">
                        <label>
                          <FaVenusMars /> Gender
                        </label>
                        <select name="gender" value={formData.gender} onChange={handleProfileChange}>
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    <div className="se-form-group se-full-width">
                      <label>
                        <FaHome /> Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleProfileChange}
                        placeholder="Enter your complete address"
                        rows="3"
                      />
                    </div>

                    <div className="se-form-actions">
                      <button className="se-btn-primary" onClick={handleSaveProfile}>
                        <FaCheck /> Save Changes
                      </button>
                      <button className="se-btn-secondary" onClick={handleCancelEdit}>
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Section */}
            {activeSection === 'orders' && (
              <div className="se-profile-section">
                <div className="se-section-header">
                  <h2>My Orders</h2>
                </div>
                <div className="se-empty-state">
                  <FaBox />
                  <p>No orders yet</p>
                  <p className="se-empty-subtext">Start shopping to see your orders here</p>
                </div>
              </div>
            )}

            {/* Addresses Section */}
            {activeSection === 'addresses' && (
              <div className="se-profile-section">
                <div className="se-section-header">
                  <h2>Saved Addresses</h2>
                  {!showAddAddressForm && (
                    <button
                      className="se-edit-btn"
                      onClick={() => setShowAddAddressForm(true)}
                    >
                      <FaCheck /> Add Address
                    </button>
                  )}
                </div>

                {showAddAddressForm ? (
                  <div className="se-profile-form">
                    <div className="se-form-grid">
                      <div className="se-form-group se-full-width">
                        <label>
                          <FaHome /> Street Address
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={newAddress.street}
                          onChange={handleAddAddressChange}
                          placeholder="Enter street address"
                        />
                      </div>

                      <div className="se-form-group">
                        <label>City</label>
                        <input
                          type="text"
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddAddressChange}
                          placeholder="Enter city"
                        />
                      </div>

                      <div className="se-form-group">
                        <label>State</label>
                        <input
                          type="text"
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddAddressChange}
                          placeholder="Enter state"
                        />
                      </div>

                      <div className="se-form-group">
                        <label>Pincode</label>
                        <input
                          type="tel"
                          name="pincode"
                          value={newAddress.pincode}
                          onChange={handleAddAddressChange}
                          placeholder="Enter 6-digit pincode"
                        />
                      </div>

                      <div className="se-form-group">
                        <label>
                          <FaPhone /> Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleAddAddressChange}
                          placeholder="Enter 10-digit phone number"
                        />
                      </div>

                      <div className="se-form-group">
                        <label>
                          <FaPhone /> Alternate Mobile No.
                        </label>
                        <input
                          type="tel"
                          name="alternatePhone"
                          value={newAddress.alternatePhone}
                          onChange={handleAddAddressChange}
                          placeholder="Enter 10-digit alternate phone (optional)"
                        />
                      </div>

                      <div className="se-form-group se-full-width">
                        <label>
                          <FaMapMarkerAlt /> Landmark
                        </label>
                        <input
                          type="text"
                          name="landmark"
                          value={newAddress.landmark}
                          onChange={handleAddAddressChange}
                          placeholder="E.g., Near Park, Behind School (optional)"
                        />
                      </div>
                    </div>

                    <div className="se-form-actions">
                      <button className="se-btn-primary" onClick={editingAddressId ? handleUpdateAddress : handleAddAddress}>
                        <FaCheck /> {editingAddressId ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        className="se-btn-secondary"
                        onClick={() => {
                          setShowAddAddressForm(false);
                          setNewAddress({ street: '', city: '', state: '', pincode: '', phone: '', alternatePhone: '', landmark: '' });
                          setEditingAddressId(null);
                        }}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : addresses.length > 0 ? (
                  <div className="se-addresses-list">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="se-address-card">
                          <div className="se-address-content">
                            <p className="se-address-street"><strong>{addr.street}</strong></p>
                            <p className="se-address-city">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="se-address-phone">
                              <FaPhone /> {addr.phone || 'Not added'}
                            </p>
                            <p className="se-address-phone">
                              <FaPhone /> Alt: {addr.alternatePhone || 'Not added'}
                            </p>
                            <p className="se-address-landmark">
                              <FaMapMarkerAlt /> {addr.landmark || 'Not added'}
                            </p>
                          </div>
                        <div className="se-address-actions">
                          <button
                            className="se-btn-primary"
                            onClick={() => handleEditAddress(addr.id)}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="se-btn-danger"
                            onClick={() => handleRemoveAddress(addr.id)}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                          >
                            <FaTimes /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="se-empty-state">
                    <FaMapMarkerAlt />
                    <p>No addresses saved</p>
                    <p className="se-empty-subtext">Add an address for faster checkout</p>
                  </div>
                )}
              </div>
            )}

            {/* Payments Section */}
            {activeSection === 'payments' && (
              <div className="se-profile-section">
                <div className="se-section-header">
                  <h2>Payment Methods</h2>
                </div>
                <div className="se-empty-state">
                  <FaCreditCard />
                  <p>No payment methods saved</p>
                  <p className="se-empty-subtext">Add a payment method for convenient checkout</p>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="se-profile-section">
                <div className="se-section-header">
                  <h2>Notification Preferences</h2>
                </div>
                <div className="se-notification-settings">
                  <div className="se-notification-item">
                    <div className="se-notification-info">
                      <h4>Email Notifications</h4>
                      <p>Receive updates about orders and promotions</p>
                    </div>
                    <label className="se-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span />
                    </label>
                  </div>

                  <div className="se-notification-item">
                    <div className="se-notification-info">
                      <h4>SMS Notifications</h4>
                      <p>Get important order updates via SMS</p>
                    </div>
                    <label className="se-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span />
                    </label>
                  </div>

                  <div className="se-notification-item">
                    <div className="se-notification-info">
                      <h4>Push Notifications</h4>
                      <p>Receive push notifications for deals and offers</p>
                    </div>
                    <label className="se-toggle-switch">
                      <input type="checkbox" />
                      <span />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="se-profile-section">
                <div className="se-section-header">
                  <h2>Account Settings</h2>
                </div>

                {!showPasswordForm ? (
                  <div className="se-settings-list">
                    <div className="se-settings-item">
                      <div className="se-settings-info">
                        <FaLock className="se-settings-icon" />
                        <div>
                          <h4>Change Password</h4>
                          <p>Update your password to keep your account secure</p>
                        </div>
                      </div>
                      <button className="se-btn-secondary" onClick={() => setShowPasswordForm(true)}>
                        Change
                      </button>
                    </div>

                    <div className="se-settings-item">
                      <div className="se-settings-info">
                        <FaBell className="se-settings-icon" />
                        <div>
                          <h4>Two-Factor Authentication</h4>
                          <p>Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button className="se-btn-secondary">Enable</button>
                    </div>

                    <div className="se-settings-item">
                      <div className="se-settings-info">
                        <FaArrowLeft className="se-settings-icon" />
                        <div>
                          <h4>Delete Account</h4>
                          <p>Permanently delete your account and all data</p>
                        </div>
                      </div>
                      <button className="se-btn-danger">Delete</button>
                    </div>
                  </div>
                ) : (
                  <div className="se-password-form-container">
                    <button
                      className="se-back-btn"
                      onClick={() => setShowPasswordForm(false)}
                    >
                      <FaArrowLeft /> Back
                    </button>

                    <div className="se-password-form">
                      <h3>Change Your Password</h3>

                      <div className="se-form-group">
                        <label>Current Password</label>
                        <div className="se-password-input">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="se-password-toggle"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="se-form-group">
                        <label>New Password</label>
                        <div className="se-password-input">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password (min 8 characters)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="se-password-toggle"
                          >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="se-form-group">
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Re-enter new password"
                        />
                      </div>

                      <div className="se-form-actions">
                        <button className="se-btn-primary" onClick={handleSavePassword}>
                          <FaCheck /> Update Password
                        </button>
                        <button
                          className="se-btn-secondary"
                          onClick={() => setShowPasswordForm(false)}
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
