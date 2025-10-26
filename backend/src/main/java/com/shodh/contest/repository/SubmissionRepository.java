package com.shodh.contest.repository;

import com.shodh.contest.entity.Submission;
import com.shodh.contest.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    boolean existsByUsernameAndProblemIdAndStatus(String username, UUID problemId, SubmissionStatus status);
}
