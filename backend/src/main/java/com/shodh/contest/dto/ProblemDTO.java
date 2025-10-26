package com.shodh.contest.dto;

import com.shodh.contest.enums.Difficulty;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ProblemDTO {
    private UUID id;
    private String title;
    private String description;
    private Difficulty difficulty;
    private Integer timeLimit;
    private Integer memoryLimit;
    private Integer points;
    private List<TestCaseDTO> sampleTestCases;
}
