package com.shodh.contest.seeder;

import com.shodh.contest.entity.Contest;
import com.shodh.contest.entity.Problem;
import com.shodh.contest.entity.TestCase;
import com.shodh.contest.enums.Difficulty;
import com.shodh.contest.repository.ContestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    
    private final ContestRepository contestRepository;
    
    @Override
    public void run(String... args) {
        if (contestRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }
        
        log.info("Seeding database with sample contest...");
        
        Contest contest = new Contest();
        contest.setName("Spring Code Sprint 2025");
        contest.setDescription("Welcome to the Spring Code Sprint! Solve algorithmic problems and climb the leaderboard.");
        contest.setStartTime(LocalDateTime.now().minusHours(1));
        contest.setEndTime(LocalDateTime.now().plusHours(3));
        
        // Problem 1: Two Sum
        Problem twoSum = createTwoSumProblem(contest);
        contest.getProblems().add(twoSum);
        
        // Problem 2: Reverse String
        Problem reverseString = createReverseStringProblem(contest);
        contest.getProblems().add(reverseString);
        
        // Problem 3: Valid Parentheses
        Problem validParentheses = createValidParenthesesProblem(contest);
        contest.getProblems().add(validParentheses);
        
        contestRepository.save(contest);
        
        log.info("Database seeded successfully!");
        log.info("Contest ID: {}", contest.getId());
        log.info("Contest Name: {}", contest.getName());
    }
    
    private Problem createTwoSumProblem(Contest contest) {
        Problem problem = new Problem();
        problem.setTitle("Two Sum");
        problem.setDescription("""
            Given an array of integers and a target, return indices of two numbers that add up to target.
            
            Input Format:
            First line: space-separated integers (the array)
            Second line: target integer
            
            Output Format:
            Two space-separated indices (0-indexed)
            
            Example:
            Input:
            2 7 11 15
            9
            
            Output:
            0 1
            """);
        problem.setDifficulty(Difficulty.EASY);
        problem.setTimeLimit(2000);
        problem.setMemoryLimit(256);
        problem.setPoints(100);
        problem.setContest(contest);
        
        // Test cases
        problem.getTestCases().add(createTestCase(problem, "2 7 11 15\n9", "0 1", true));
        problem.getTestCases().add(createTestCase(problem, "3 2 4\n6", "1 2", true));
        problem.getTestCases().add(createTestCase(problem, "1 5 3 7 9\n12", "2 4", false));
        problem.getTestCases().add(createTestCase(problem, "10 20 30 40\n50", "1 2", false));
        
        return problem;
    }
    
    private Problem createReverseStringProblem(Contest contest) {
        Problem problem = new Problem();
        problem.setTitle("Reverse String");
        problem.setDescription("""
            Write a program that reverses a given string.
            
            Input Format:
            A single line containing a string (no spaces)
            
            Output Format:
            The reversed string
            
            Example:
            Input:
            hello
            
            Output:
            olleh
            """);
        problem.setDifficulty(Difficulty.EASY);
        problem.setTimeLimit(2000);
        problem.setMemoryLimit(256);
        problem.setPoints(100);
        problem.setContest(contest);
        
        // Test cases
        problem.getTestCases().add(createTestCase(problem, "hello", "olleh", true));
        problem.getTestCases().add(createTestCase(problem, "world", "dlrow", true));
        problem.getTestCases().add(createTestCase(problem, "racecar", "racecar", false));
        problem.getTestCases().add(createTestCase(problem, "programming", "gnimmargorp", false));
        problem.getTestCases().add(createTestCase(problem, "a", "a", false));
        
        return problem;
    }
    
    private Problem createValidParenthesesProblem(Contest contest) {
        Problem problem = new Problem();
        problem.setTitle("Valid Parentheses");
        problem.setDescription("""
            Given a string containing '(', ')', '{', '}', '[' and ']', determine if it's valid.
            
            Rules:
            - Open brackets must be closed by same type
            - Open brackets must be closed in correct order
            
            Input Format:
            A single line containing the string
            
            Output Format:
            Print 'true' if valid, 'false' otherwise
            
            Example:
            Input:
            ()[]{}
            
            Output:
            true
            """);
        problem.setDifficulty(Difficulty.MEDIUM);
        problem.setTimeLimit(2000);
        problem.setMemoryLimit(256);
        problem.setPoints(200);
        problem.setContest(contest);
        
        // Test cases
        problem.getTestCases().add(createTestCase(problem, "()", "true", true));
        problem.getTestCases().add(createTestCase(problem, "()[]{}", "true", true));
        problem.getTestCases().add(createTestCase(problem, "(]", "false", false));
        problem.getTestCases().add(createTestCase(problem, "([)]", "false", false));
        problem.getTestCases().add(createTestCase(problem, "{[]}", "true", false));
        problem.getTestCases().add(createTestCase(problem, "((()))", "true", false));
        
        return problem;
    }
    
    private TestCase createTestCase(Problem problem, String input, String output, boolean isSample) {
        TestCase testCase = new TestCase();
        testCase.setInput(input);
        testCase.setExpectedOutput(output);
        testCase.setIsSample(isSample);
        testCase.setProblem(problem);
        return testCase;
    }
}
