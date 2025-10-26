package com.shodh.contest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry implements Serializable {
    private Integer rank;
    private String username;
    private Integer totalScore;
    private Integer problemsSolved;
}
