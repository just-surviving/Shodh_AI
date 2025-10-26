package com.shodh.contest.service;

import com.shodh.contest.dto.ContestResponse;
import com.shodh.contest.dto.ProblemDTO;
import com.shodh.contest.dto.TestCaseDTO;
import com.shodh.contest.entity.Contest;
import com.shodh.contest.entity.Problem;
import com.shodh.contest.entity.TestCase;
import com.shodh.contest.repository.ContestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContestService {
    
    private final ContestRepository contestRepository;
    
    @Transactional(readOnly = true)
    public ContestResponse getContestWithProblems(UUID contestId) {
        Contest contest = contestRepository.findById(contestId)
            .orElseThrow(() -> new RuntimeException("Contest not found"));
        
        ContestResponse response = new ContestResponse();
        response.setId(contest.getId());
        response.setName(contest.getName());
        response.setDescription(contest.getDescription());
        response.setStartTime(contest.getStartTime());
        response.setEndTime(contest.getEndTime());
        
        List<ProblemDTO> problemDTOs = contest.getProblems().stream()
            .map(this::convertToProblemDTO)
            .collect(Collectors.toList());
        
        response.setProblems(problemDTOs);
        
        return response;
    }
    
    private ProblemDTO convertToProblemDTO(Problem problem) {
        ProblemDTO dto = new ProblemDTO();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setDifficulty(problem.getDifficulty());
        dto.setTimeLimit(problem.getTimeLimit());
        dto.setMemoryLimit(problem.getMemoryLimit());
        dto.setPoints(problem.getPoints());
        
        // Only include sample test cases
        List<TestCaseDTO> sampleTestCases = problem.getTestCases().stream()
            .filter(TestCase::getIsSample)
            .map(this::convertToTestCaseDTO)
            .collect(Collectors.toList());
        
        dto.setSampleTestCases(sampleTestCases);
        
        return dto;
    }
    
    private TestCaseDTO convertToTestCaseDTO(TestCase testCase) {
        TestCaseDTO dto = new TestCaseDTO();
        dto.setId(testCase.getId());
        dto.setInput(testCase.getInput());
        dto.setExpectedOutput(testCase.getExpectedOutput());
        dto.setIsSample(testCase.getIsSample());
        return dto;
    }
}
