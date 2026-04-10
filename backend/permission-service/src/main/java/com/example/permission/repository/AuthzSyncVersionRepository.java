package com.example.permission.repository;

import com.example.permission.model.AuthzSyncVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthzSyncVersionRepository extends JpaRepository<AuthzSyncVersion, Integer> {

    @Modifying
    @Query("UPDATE AuthzSyncVersion v SET v.version = v.version + 1, v.updatedAt = CURRENT_TIMESTAMP WHERE v.id = 1")
    int incrementVersion();
}
