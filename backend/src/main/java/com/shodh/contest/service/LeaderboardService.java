package com.shodh.contest.service;

import com.shodh.contest.dto.LeaderboardEntry;
import com.shodh.contest.entity.User;
import com.shodh.contest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaderboardService {
    
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    
    public List<LeaderboardEntry> getLeaderboard(UUID contestId) {
        String cacheKey = "leaderboard:" + contestId;
        
        // Check cache
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached instanceof List<?>) {
            try {
                @SuppressWarnings("unchecked")
                List<LeaderboardEntry> cachedList = (List<LeaderboardEntry>) cached;
                log.info("Returning cached leaderboard for contest: {}", contestId);
                return cachedList;
            } catch (ClassCastException e) {
                log.warn("Cache type mismatch, fetching from database");
            }
        }
        
        // Fetch from database
        List<User> users = userRepository
            .findByContestIdOrderByTotalScoreDescProblemsSolvedDescLastSubmissionTimeAsc(contestId);
        
        List<LeaderboardEntry> leaderboard = new ArrayList<>();
        int rank = 1;
        for (User user : users) {
            leaderboard.add(new LeaderboardEntry(
                rank++,
                user.getUsername(),
                user.getTotalScore(),
                user.getProblemsSolved()
            ));
        }
        
        // Cache for 30 seconds
        redisTemplate.opsForValue().set(cacheKey, leaderboard, Duration.ofSeconds(30));
        
        log.info("Fetched leaderboard from database for contest: {}", contestId);
        return leaderboard;
    }
}
