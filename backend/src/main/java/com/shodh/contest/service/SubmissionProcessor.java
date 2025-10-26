package com.shodh.contest.service;

import com.shodh.contest.entity.Problem;
import com.shodh.contest.entity.Submission;
import com.shodh.contest.entity.TestCase;
import com.shodh.contest.entity.User;
import com.shodh.contest.enums.SubmissionStatus;
import com.shodh.contest.repository.ProblemRepository;
import com.shodh.contest.repository.SubmissionRepository;
import com.shodh.contest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubmissionProcessor {
    
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final JudgeService judgeService;
    
    @Async("taskExecutor")
    @Transactional
    public CompletableFuture<Void> processSubmission(UUID submissionId) {
        Submission submission = null;
        
        try {
            // Fetch submission
            submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
            
            // Update status to RUNNING
            submission.setStatus(SubmissionStatus.RUNNING);
            submissionRepository.save(submission);
            
            // Fetch problem and test cases
            Problem problem = problemRepository.findById(submission.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));
            
            int passedTests = 0;
            int totalTests = problem.getTestCases().size();
            int maxExecutionTime = 0;
            
            submission.setTestCasesTotal(totalTests);
            
            // Run each test case
            for (TestCase testCase : problem.getTestCases()) {
                JudgeService.JudgeResult result = judgeService.executeCode(
                    submission.getCode(),
                    submission.getLanguage(),
                    testCase.getInput(),
                    problem.getTimeLimit(),
                    problem.getMemoryLimit()
                );
                
                maxExecutionTime = Math.max(maxExecutionTime, result.getExecutionTime());
                
                // Check for execution errors
                if (!result.isSuccess()) {
                    if ("TLE".equals(result.getResultType())) {
                        submission.setStatus(SubmissionStatus.TLE);
                        submission.setVerdict("Time Limit Exceeded on test case " + (passedTests + 1));
                    } else if ("RUNTIME_ERROR".equals(result.getResultType())) {
                        submission.setStatus(SubmissionStatus.RUNTIME_ERROR);
                        submission.setVerdict("Runtime Error: " + result.getError());
                    } else {
                        submission.setStatus(SubmissionStatus.RUNTIME_ERROR);
                        submission.setVerdict("System Error: " + result.getError());
                    }
                    submission.setTestCasesPassed(passedTests);
                    submission.setExecutionTime(maxExecutionTime);
                    break;
                }
                
                // Compare output
                String actualOutput = result.getOutput().trim();
                String expectedOutput = testCase.getExpectedOutput().trim();
                
                if (actualOutput.equals(expectedOutput)) {
                    passedTests++;
                } else {
                    submission.setStatus(SubmissionStatus.WRONG_ANSWER);
                    submission.setVerdict("Wrong Answer on test case " + (passedTests + 1));
                    submission.setTestCasesPassed(passedTests);
                    submission.setExecutionTime(maxExecutionTime);
                    break;
                }
            }
            
            // If all tests passed
            if (passedTests == totalTests) {
                submission.setStatus(SubmissionStatus.ACCEPTED);
                submission.setVerdict("Accepted! All test cases passed.");
                submission.setTestCasesPassed(passedTests);
                submission.setExecutionTime(maxExecutionTime);
                
                // Update user score
                updateUserScore(submission.getUsername(), submission.getContestId(), 
                    submission.getProblemId(), problem.getPoints());
            }
            
        } catch (Exception e) {
            log.error("Error processing submission", e);
            if (submission != null) {
                submission.setStatus(SubmissionStatus.RUNTIME_ERROR);
                submission.setVerdict("System Error: " + e.getMessage());
            }
        } finally {
            if (submission != null) {
                submissionRepository.save(submission);
            }
        }
        
        return CompletableFuture.completedFuture(null);
    }
    
    private void updateUserScore(String username, UUID contestId, UUID problemId, Integer points) {
        // Find or create user
        User user = userRepository.findByUsernameAndContestId(username, contestId)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setUsername(username);
                newUser.setContestId(contestId);
                newUser.setTotalScore(0);
                newUser.setProblemsSolved(0);
                return newUser;
            });
        
        // Check if this problem was already solved
        boolean alreadySolved = submissionRepository.existsByUsernameAndProblemIdAndStatus(
            username, problemId, SubmissionStatus.ACCEPTED);
        
        if (!alreadySolved) {
            user.setTotalScore(user.getTotalScore() + points);
            user.setProblemsSolved(user.getProblemsSolved() + 1);
        }
        
        user.setLastSubmissionTime(LocalDateTime.now());
        userRepository.save(user);
    }
}
