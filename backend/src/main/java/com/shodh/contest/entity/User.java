package com.shodh.contest.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"username", "contest_id"})
})
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String username;
    
    @Column(name = "contest_id", nullable = false)
    private UUID contestId;
    
    @Column(name = "total_score")
    private Integer totalScore = 0;
    
    @Column(name = "problems_solved")
    private Integer problemsSolved = 0;
    
    @Column(name = "last_submission_time")
    private LocalDateTime lastSubmissionTime;
    
    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;
}
