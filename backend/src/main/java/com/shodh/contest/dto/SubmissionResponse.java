package com.shodh.contest.dto;

import com.shodh.contest.enums.SubmissionStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SubmissionResponse {
    private UUID id;
    private SubmissionStatus status;
    private Integer executionTime;
    private Integer memoryUsed;
    private Integer testCasesPassed;
    private Integer testCasesTotal;
    private String verdict;
    private LocalDateTime submittedAt;
}
