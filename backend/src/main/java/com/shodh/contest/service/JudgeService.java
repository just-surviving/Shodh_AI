package com.shodh.contest.service;

import com.shodh.contest.enums.Language;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class JudgeService {
    
    @Data
    @AllArgsConstructor
    public static class JudgeResult {
        private boolean success;
        private String output;
        private String error;
        private Integer executionTime;
        private String resultType; // SUCCESS, TLE, RUNTIME_ERROR, MEMORY_LIMIT_EXCEEDED, SYSTEM_ERROR
    }
    
    public JudgeResult executeCode(String code, Language language, String input, 
                                   int timeLimitMs, int memoryLimitMb) {
        Path tempDir = null;
        long startTime = System.currentTimeMillis();
        
        try {
            // Create temp directory
            String executionId = UUID.randomUUID().toString();
            tempDir = Paths.get("/tmp/shodh-executions", executionId);
            Files.createDirectories(tempDir);
            
            // Write code to file
            String fileName = getFileName(language);
            Path codeFile = tempDir.resolve(fileName);
            Files.writeString(codeFile, code);
            
            // Build Docker command
            String dockerImage = getDockerImage(language);
            String executeCommand = getExecuteCommand(language);
            
            ProcessBuilder processBuilder = new ProcessBuilder(
                "docker", "run",
                "--rm",
                "--network=none",
                "--memory=" + memoryLimitMb + "m",
                "--memory-swap=" + memoryLimitMb + "m",
                "--cpus=1",
                "--pids-limit=50",
                "-v", tempDir.toAbsolutePath() + ":/app:ro",
                "-w", "/app",
                dockerImage,
                "sh", "-c", executeCommand
            );
            
            Process process = processBuilder.start();
            
            // Provide input
            if (input != null && !input.isEmpty()) {
                try (OutputStreamWriter writer = new OutputStreamWriter(process.getOutputStream())) {
                    writer.write(input);
                    writer.flush();
                }
            }
            
            // Wait for process with timeout
            boolean completed = process.waitFor(timeLimitMs + 1000, TimeUnit.MILLISECONDS);
            
            if (!completed) {
                process.destroyForcibly();
                long executionTime = System.currentTimeMillis() - startTime;
                return new JudgeResult(false, "", "Time Limit Exceeded", 
                    (int) executionTime, "TLE");
            }
            
            // Capture output
            StringBuilder output = new StringBuilder();
            StringBuilder error = new StringBuilder();
            
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    error.append(line).append("\n");
                }
            }
            
            long executionTime = System.currentTimeMillis() - startTime;
            int exitCode = process.exitValue();
            
            if (exitCode != 0) {
                String errorMsg = error.length() > 0 ? error.toString() : "Runtime Error";
                return new JudgeResult(false, output.toString(), errorMsg, 
                    (int) executionTime, "RUNTIME_ERROR");
            }
            
            return new JudgeResult(true, output.toString(), "", 
                (int) executionTime, "SUCCESS");
            
        } catch (Exception e) {
            log.error("Error executing code", e);
            long executionTime = System.currentTimeMillis() - startTime;
            return new JudgeResult(false, "", "System Error: " + e.getMessage(), 
                (int) executionTime, "SYSTEM_ERROR");
        } finally {
            // Cleanup temp directory
            if (tempDir != null) {
                try {
                    Files.walk(tempDir)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
                } catch (Exception e) {
                    log.error("Error cleaning up temp directory", e);
                }
            }
        }
    }
    
    private String getFileName(Language language) {
        return switch (language) {
            case JAVA -> "Solution.java";
            case PYTHON -> "solution.py";
            case CPP -> "solution.cpp";
        };
    }
    
    private String getDockerImage(Language language) {
        return switch (language) {
            case JAVA -> "shodh-judge-java:latest";
            case PYTHON -> "shodh-judge-python:latest";
            case CPP -> "shodh-judge-cpp:latest";
        };
    }
    
    private String getExecuteCommand(Language language) {
        return switch (language) {
            case JAVA -> "javac Solution.java && timeout 5s java Solution";
            case PYTHON -> "timeout 5s python3 solution.py";
            case CPP -> "g++ -o solution solution.cpp && timeout 5s ./solution";
        };
    }
}
