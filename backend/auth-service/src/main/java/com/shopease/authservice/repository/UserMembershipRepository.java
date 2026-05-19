package com.shopease.authservice.repository;

import com.shopease.authservice.entity.MembershipStatus;
import com.shopease.authservice.entity.UserMembershipEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserMembershipRepository extends JpaRepository<UserMembershipEntity, Long> {

    Optional<UserMembershipEntity> findTopByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<UserMembershipEntity> findFirstByUserIdAndStatusOrderByUpdatedAtDesc(Long userId, MembershipStatus status);
}
