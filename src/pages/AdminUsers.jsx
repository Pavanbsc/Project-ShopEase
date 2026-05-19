import { useEffect, useState } from 'react';
import { getAdminUsers, getUserProfile } from '../services/api';
import '../styles/admin.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAdminUsers()
      .then((data) => {
        if (!mounted) return;
        // ensure array of users
        const list = Array.isArray(data) ? data : [];
        setUsers(list);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load users');
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return String(u.name || '').toLowerCase().includes(q) || String(u.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="users-panel">
      <div className="users-toolbar">
        <div>
          <h2 style={{ margin: 0 }}>Users</h2>
          <div style={{ color: 'var(--muted)', marginTop: 6 }}>All registered users (minimal details)</div>
        </div>
        <div className="users-search">
          <input placeholder="Search by name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="users-table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: 120 }}>Role</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={async () => {
                            setDetailsError(null);
                            setLoadingDetails(true);
                            try {
                              const profile = await getUserProfile(u.id);
                              setSelected(profile);
                            } catch (err) {
                              console.error(err);
                              setDetailsError('Unable to load user details');
                            } finally {
                              setLoadingDetails(false);
                            }
                          }}
                        >
                          View
                        </button>
                      </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 18, color: 'var(--muted)' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {loadingDetails ? (
              <div>Loading details...</div>
            ) : detailsError ? (
              <div style={{ color: 'red' }}>{detailsError}</div>
            ) : (
              <>
                <h3>{selected.name}</h3>
                <div className="meta">User ID: {selected.id} — {selected.role}</div>
                <dl>
                  <dt>Email</dt>
                  <dd>{selected.email}</dd>
                  <dt>Phone</dt>
                  <dd>{selected.phone || '—'}</dd>
                  <dt>Date of birth</dt>
                  <dd>{selected.dateOfBirth || '—'}</dd>
                  <dt>Gender</dt>
                  <dd>{selected.gender || '—'}</dd>
                  <dt>Address</dt>
                  <dd>{selected.address || '—'}</dd>
                </dl>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="close-btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
