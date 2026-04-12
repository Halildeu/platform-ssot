package com.example.permission.outbox;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TupleSyncOutboxRepository extends JpaRepository<TupleSyncOutboxEntry, Long> {

    @Query("SELECT e FROM TupleSyncOutboxEntry e WHERE e.status = 'PENDING' ORDER BY e.createdAt ASC")
    List<TupleSyncOutboxEntry> findPendingEntries();
}
