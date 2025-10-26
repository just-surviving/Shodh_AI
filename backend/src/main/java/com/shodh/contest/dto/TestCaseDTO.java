package com.shodh.contest.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class TestCaseDTO {
    private UUID id;
    private String input;
    private String expectedOutput;
    private Boolean isSample;
}
