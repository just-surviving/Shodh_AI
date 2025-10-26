package com.shodh.contest.controller;

import com.shodh.contest.dto.*;
import com.shodh.contest.entity.Submission;
import com.shodh.contest.repository.SubmissionRepository;
import com.shodh.contest.service.ContestService;
import com.shodh.contest.service.LeaderboardService;
import com.shodh.contest.service.SubmissionProcessor;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ContestController {
    
    private final ContestService contestService;
    private final LeaderboardService leaderboardService;
    private final SubmissionRepository submissionRepository;
    private final SubmissionProcessor submissionProcessor;
    
    @GetMapping("/contests/{contestId}")
    public ResponseEntity<?> getContest(@PathVariable UUID contestId) {
        try {
            ContestResponse contest = contestService.getContestWithProblems(contestId);
            return ResponseEntity.ok(contest);
        } catch (Exception e) {
            log.error("Error fetching contest", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/submissions")
    public ResponseEntity<?> submitCode(@Valid @RequestBody SubmissionRequest request) {
        try {
            // Create submission
            Submission submission = new Submission();
            submission.setCode(request.getCode());
            submission.setLanguage(request.getLanguage());
            submission.setUsername(request.getUsername());
            submission.setProblemId(request.getProblemId());
            submission.setContestId(request.getContestId());
            submission.setSubmittedAt(LocalDateTime.now());
            
            submission = submissionRepository.save(submission);
            
            // Process asynchronously
            submissionProcessor.processSubmission(submission.getId());
            
            return ResponseEntity.ok(Map.of(
                "submissionId", submission.getId(),
                "message", "Submission queued for processing"
            ));
        } catch (Exception e) {
            log.error("Error submitting code", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/submissions/{submissionId}")
    public ResponseEntity<?> getSubmissionStatus(@PathVariable UUID submissionId) {
        try {
            Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
            
            SubmissionResponse response = new SubmissionResponse();
            response.setId(submission.getId());
            response.setStatus(submission.getStatus());
            response.setExecutionTime(submission.getExecutionTime());
            response.setMemoryUsed(submission.getMemoryUsed());
            response.setTestCasesPassed(submission.getTestCasesPassed());
            response.setTestCasesTotal(submission.getTestCasesTotal());
            response.setVerdict(submission.getVerdict());
            response.setSubmittedAt(submission.getSubmittedAt());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching submission status", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/contests/{contestId}/leaderboard")
    public ResponseEntity<?> getLeaderboard(@PathVariable UUID contestId) {
        try {
            List<LeaderboardEntry> leaderboard = leaderboardService.getLeaderboard(contestId);
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            log.error("Error fetching leaderboard", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}
