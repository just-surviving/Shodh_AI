# 🧪 Testing Guide - Shodh-a-Code

## Overview

This guide provides comprehensive testing instructions for the Shodh-a-Code contest platform.

## Prerequisites

Ensure all services are running:

```bash
docker-compose ps
```

Expected output:
- ✅ shodh-frontend (port 3000)
- ✅ shodh-backend (port 8080)
- ✅ shodh-postgres (port 5432)
- ✅ shodh-redis (port 6379)

## Manual Testing Checklist

### 1. Contest Join Flow

**Steps**:
1. Open http://localhost:3000
2. Enter Contest ID: `spring-code-sprint-2025`
3. Enter Username: `testuser` (or any username)
4. Click "Join Contest"

**Expected Results**:
- ✅ Form validation works (minimum 3 characters for username)
- ✅ Success toast notification appears
- ✅ Redirects to contest page
- ✅ Username stored in localStorage

**Verification**:
```javascript
// Open browser console
localStorage.getItem('username')  // Should return your username
localStorage.getItem('contestId') // Should return contest ID
```

### 2. Contest Page Load

**Expected Results**:
- ✅ Contest name and description displayed
- ✅ 3 problems shown in left sidebar
- ✅ Problem difficulty badges (EASY, MEDIUM)
- ✅ Points displayed for each problem
- ✅ Code editor loads in center
- ✅ Leaderboard shown in right sidebar

### 3. Problem Selection

**Steps**:
1. Click on "Two Sum" problem
2. Click on "Reverse String" problem
3. Click on "Valid Parentheses" problem

**Expected Results**:
- ✅ Problem description updates
- ✅ Sample test cases displayed
- ✅ Time and memory limits shown
- ✅ Code editor resets with default template
- ✅ Selected problem highlighted in sidebar

### 4. Code Editor Functionality

**Steps**:
1. Select Java language
2. Write some code
3. Switch to Python
4. Switch to C++

**Expected Results**:
- ✅ Monaco editor loads properly
- ✅ Syntax highlighting works
- ✅ Code template changes with language
- ✅ Editor is responsive and editable

### 5. Code Submission - Accepted

**Steps**:
1. Select "Two Sum" problem
2. Select Java language
3. Copy and paste the correct solution (see below)
4. Click "Submit Code"

**Correct Solution (Java)**:
```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] numsStr = sc.nextLine().split(" ");
        int target = Integer.parseInt(sc.nextLine());
        
        int[] nums = new int[numsStr.length];
        for (int i = 0; i < numsStr.length; i++) {
            nums[i] = Integer.parseInt(numsStr[i]);
        }
        
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                System.out.println(map.get(complement) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
        sc.close();
    }
}
```

**Expected Results**:
- ✅ Success toast: "Code submitted! Judging in progress..."
- ✅ Submission status card appears below editor
- ✅ Status shows "PENDING" → "RUNNING" → "ACCEPTED"
- ✅ Execution time displayed (e.g., 145ms)
- ✅ Memory used displayed (e.g., 1024KB)
- ✅ Test cases: 4/4 passed
- ✅ Verdict: "Accepted! All test cases passed."
- ✅ Confetti animation plays 🎉
- ✅ Leaderboard updates with your score
- ✅ Problem marked as solved (checkmark in sidebar)

### 6. Code Submission - Wrong Answer

**Steps**:
1. Select "Two Sum" problem
2. Submit this intentionally wrong solution:

```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("0 0");
        sc.close();
    }
}
```

**Expected Results**:
- ✅ Status shows "WRONG_ANSWER"
- ✅ Test cases: 1/4 or 2/4 passed (fails on some)
- ✅ Verdict explains which test case failed
- ✅ No confetti
- ✅ No points added to leaderboard

### 7. Code Submission - Time Limit Exceeded

**Steps**:
1. Submit this solution with infinite loop:

```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        while (true) {
            // Infinite loop
        }
    }
}
```

**Expected Results**:
- ✅ Status shows "TLE" (Time Limit Exceeded)
- ✅ Verdict: "Time limit exceeded"
- ✅ Execution time: ~5000ms (timeout)

### 8. Code Submission - Runtime Error

**Steps**:
1. Submit this solution with null pointer exception:

```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        String s = null;
        System.out.println(s.length());
    }
}
```

**Expected Results**:
- ✅ Status shows "RUNTIME_ERROR"
- ✅ Verdict includes error message (NullPointerException)

### 9. Code Submission - Compilation Error

**Steps**:
1. Submit this solution with syntax error:

```java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello"  // Missing closing parenthesis
    }
}
```

**Expected Results**:
- ✅ Status shows "COMPILATION_ERROR"
- ✅ Verdict includes compiler error message

### 10. Multi-Language Testing

**Python Solution (Reverse String)**:
```python
s = input()
print(s[::-1])
```

**C++ Solution (Valid Parentheses)**:
```cpp
#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) {
                cout << "false" << endl;
                return 0;
            }
            char top = st.top();
            st.pop();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) {
                cout << "false" << endl;
                return 0;
            }
        }
    }
    
    cout << (st.empty() ? "true" : "false") << endl;
    return 0;
}
```

**Expected Results**:
- ✅ All languages execute correctly
- ✅ Proper syntax highlighting for each language
- ✅ Correct compilation and execution

### 11. Leaderboard Functionality

**Steps**:
1. Solve problems with different users
2. Watch leaderboard update

**Expected Results**:
- ✅ Leaderboard updates after each accepted submission
- ✅ Rankings sorted by: score DESC, problems solved DESC, time ASC
- ✅ Current user highlighted in blue
- ✅ Top 3 users have trophy icons
- ✅ Auto-refreshes every 20 seconds
- ✅ Shows username, score, and problems solved

### 12. Real-Time Polling

**Expected Results**:
- ✅ Submission status polls every 2 seconds while PENDING/RUNNING
- ✅ Polling stops when status is final (ACCEPTED, WRONG_ANSWER, etc.)
- ✅ Leaderboard polls every 20 seconds continuously
- ✅ No excessive API calls (check Network tab in DevTools)

### 13. UI/UX Testing

**Expected Results**:
- ✅ Responsive design works on different screen sizes
- ✅ Loading skeletons shown while fetching data
- ✅ Toast notifications for all actions
- ✅ Smooth animations and transitions
- ✅ Proper error messages
- ✅ Accessible UI (keyboard navigation works)

## API Testing

### 1. Get Contest Details

```bash
curl http://localhost:8080/api/contests/spring-code-sprint-2025
```

**Expected Response**:
```json
{
  "id": "...",
  "name": "Spring Code Sprint 2025",
  "description": "Welcome to the Spring Code Sprint!",
  "problems": [...]
}
```

### 2. Submit Code

```bash
curl -X POST http://localhost:8080/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello\")",
    "language": "PYTHON",
    "username": "testuser",
    "problemId": "<problem-id>",
    "contestId": "<contest-id>"
  }'
```

**Expected Response**:
```json
{
  "submissionId": "...",
  "message": "Submission queued for processing"
}
```

### 3. Get Submission Status

```bash
curl http://localhost:8080/api/submissions/<submission-id>
```

**Expected Response**:
```json
{
  "id": "...",
  "status": "ACCEPTED",
  "executionTime": 145,
  "testCasesPassed": 4,
  "testCasesTotal": 4,
  "verdict": "Accepted! All test cases passed."
}
```

### 4. Get Leaderboard

```bash
curl http://localhost:8080/api/contests/spring-code-sprint-2025/leaderboard
```

**Expected Response**:
```json
[
  {
    "rank": 1,
    "username": "alice",
    "totalScore": 300,
    "problemsSolved": 3
  }
]
```

## Performance Testing

### Load Testing

Test with multiple concurrent users:

```bash
# Install Apache Bench (if not installed)
# Ubuntu: sudo apt-get install apache2-utils
# Mac: brew install ab

# Test submission endpoint
ab -n 100 -c 10 -p submission.json -T application/json \
  http://localhost:8080/api/submissions
```

**Expected Results**:
- ✅ All requests complete successfully
- ✅ Average response time < 500ms
- ✅ No failed requests
- ✅ Backend handles concurrent submissions

### Database Performance

```sql
-- Connect to database
docker exec -it shodh-postgres psql -U admin -d shodh_contests

-- Check query performance
EXPLAIN ANALYZE SELECT * FROM users 
ORDER BY total_score DESC, problems_solved DESC, last_submission_time ASC;

-- Verify indexes exist
\di
```

**Expected Results**:
- ✅ Indexes on username, problem_id, contest_id
- ✅ Query execution time < 50ms
- ✅ Index scans used (not sequential scans)

### Redis Caching

```bash
# Connect to Redis
docker exec -it shodh-redis redis-cli

# Check cache hits
INFO stats

# View cached leaderboard
KEYS leaderboard:*
GET leaderboard:<contest-id>
```

**Expected Results**:
- ✅ Leaderboard cached with 30s TTL
- ✅ Cache hit rate > 90%
- ✅ Reduced database queries

## Security Testing

### 1. Docker Isolation

**Test**: Try to access network from submitted code

```java
import java.net.*;

public class Solution {
    public static void main(String[] args) {
        try {
            URL url = new URL("http://google.com");
            url.openConnection();
        } catch (Exception e) {
            System.out.println("Network access blocked");
        }
    }
}
```

**Expected Result**: ✅ Network access denied (--network=none)

### 2. Resource Limits

**Test**: Try to allocate excessive memory

```java
public class Solution {
    public static void main(String[] args) {
        int[] arr = new int[1000000000]; // 4GB
    }
}
```

**Expected Result**: ✅ Memory limit exceeded (256MB limit)

### 3. Fork Bomb Protection

**Test**: Try to create many processes

```java
public class Solution {
    public static void main(String[] args) {
        while (true) {
            Runtime.getRuntime().exec("echo test");
        }
    }
}
```

**Expected Result**: ✅ PID limit enforced (max 50 processes)

### 4. File System Access

**Test**: Try to read/write files

```java
import java.io.*;

public class Solution {
    public static void main(String[] args) {
        try {
            FileWriter fw = new FileWriter("/etc/passwd");
            fw.write("malicious");
        } catch (Exception e) {
            System.out.println("File access denied");
        }
    }
}
```

**Expected Result**: ✅ Read-only mount, permission denied

## Regression Testing

After making changes, verify:

- ✅ All existing tests still pass
- ✅ No performance degradation
- ✅ No new security vulnerabilities
- ✅ Backward compatibility maintained

## Automated Testing (Future)

Recommended test frameworks:

**Backend**:
- JUnit 5 for unit tests
- Spring Boot Test for integration tests
- Testcontainers for database tests

**Frontend**:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

## Test Data

### Pre-Seeded Contest

- **Contest ID**: `spring-code-sprint-2025`
- **Problems**: 3 (Two Sum, Reverse String, Valid Parentheses)
- **Test Cases**: 15 total (6 sample, 9 hidden)

### Creating Test Users

```bash
# Join with different usernames to test leaderboard
# User 1: alice
# User 2: bob
# User 3: charlie
```

## Monitoring & Logs

### View Application Logs

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f postgres

# All logs
docker-compose logs -f
```

### Check for Errors

```bash
# Filter errors
docker-compose logs backend | grep ERROR
docker-compose logs backend | grep Exception

# Check submission processing
docker-compose logs backend | grep "Processing submission"
docker-compose logs backend | grep "Submission completed"
```

## Troubleshooting Tests

### Test Fails: Submission Stuck in PENDING

**Check**:
1. Judge images exist: `docker images | grep shodh-judge`
2. Backend logs: `docker-compose logs backend`
3. Docker socket mounted: `docker-compose exec backend ls -l /var/run/docker.sock`

### Test Fails: Leaderboard Not Updating

**Check**:
1. Redis running: `docker exec shodh-redis redis-cli ping`
2. Cache TTL: `docker exec shodh-redis redis-cli TTL leaderboard:<contest-id>`
3. Backend logs for cache operations

### Test Fails: Frontend Network Error

**Check**:
1. Backend running: `curl http://localhost:8080/api/contests/test`
2. CORS configuration in application.properties
3. Environment variable: `cat frontend/.env.local`

## Test Report Template

```markdown
## Test Execution Report

**Date**: YYYY-MM-DD
**Tester**: Your Name
**Environment**: Local Docker

### Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| Contest Join | ✅ Pass | |
| Problem Selection | ✅ Pass | |
| Code Submission (Accepted) | ✅ Pass | |
| Code Submission (Wrong Answer) | ✅ Pass | |
| Code Submission (TLE) | ✅ Pass | |
| Leaderboard Update | ✅ Pass | |
| Multi-Language Support | ✅ Pass | |

### Issues Found

1. None

### Recommendations

1. All tests passing
2. Ready for deployment
```

## Conclusion

This testing guide ensures comprehensive coverage of all platform features. Run through this checklist before any deployment or major changes.

**Happy Testing!** 🧪
