package com.shodh.contest.entity;

import com.shodh.contest.enums.Language;
import com.shodh.contest.enums.SubmissionStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "submissions")
public class Submission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status = SubmissionStatus.PENDING;
    
    @Column(name = "execution_time")
    private Integer executionTime;
    
    @Column(name = "memory_used")
    private Integer memoryUsed;
    
    @Column(name = "test_cases_passed")
    private Integer testCasesPassed = 0;
    
    @Column(name = "test_cases_total")
    private Integer testCasesTotal = 0;
    
    @Column(length = 1000)
    private String verdict;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(nullable = false)
    private String username;
    
    @Column(name = "problem_id", nullable = false)
    private UUID problemId;
    
    @Column(name = "contest_id", nullable = false)
    private UUID contestId;
}
