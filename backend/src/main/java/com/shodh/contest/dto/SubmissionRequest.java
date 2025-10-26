package com.shodh.contest.dto;

import com.shodh.contest.enums.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class SubmissionRequest {
    
    @NotBlank(message = "Code cannot be blank")
    private String code;
    
    @NotNull(message = "Language is required")
    private Language language;
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotNull(message = "Problem ID is required")
    private UUID problemId;
    
    @NotNull(message = "Contest ID is required")
    private UUID contestId;
}
