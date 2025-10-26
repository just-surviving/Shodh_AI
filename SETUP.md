# 🚀 Setup Guide - Shodh-a-Code

## Prerequisites

Before you begin, ensure you have:

- **Docker Desktop** installed and running
  - Download: https://www.docker.com/products/docker-desktop
  - Version: 20.10+ recommended
- **4GB RAM** minimum available
- **Ports available**: 3000, 8080, 5432, 6379
- **Git** (optional, for cloning)

## Quick Start

### For Windows Users

1. **Open Command Prompt or PowerShell** in the project directory

2. **Build Judge Images**
   ```cmd
   build-judge-images.bat
   ```
   
   This creates Docker images for code execution:
   - `shodh-judge-java:latest`
   - `shodh-judge-python:latest`
   - `shodh-judge-cpp:latest`

3. **Start All Services**
   ```cmd
   start.bat
   ```
   
   This will:
   - Start PostgreSQL database
   - Start Redis cache
   - Build and start Spring Boot backend
   - Build and start Next.js frontend
   - Seed database with sample contest

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Pre-seeded Contest ID: `spring-code-sprint-2025`

### For Linux/Mac Users

1. **Make scripts executable**
   ```bash
   chmod +x build-judge-images.sh start.sh
   ```

2. **Build Judge Images**
   ```bash
   ./build-judge-images.sh
   ```

3. **Start All Services**
   ```bash
   ./start.sh
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api

## Manual Setup (Alternative)

If you prefer manual control:

```bash
# Build judge images
docker build -f docker/java.Dockerfile -t shodh-judge-java:latest docker/
docker build -f docker/python.Dockerfile -t shodh-judge-python:latest docker/
docker build -f docker/cpp.Dockerfile -t shodh-judge-cpp:latest docker/

# Start services with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Verification

### Check Services Status

```bash
docker-compose ps
```

You should see 4 services running:
- `shodh-frontend` (port 3000)
- `shodh-backend` (port 8080)
- `shodh-postgres` (port 5432)
- `shodh-redis` (port 6379)

### Test Backend API

```bash
curl http://localhost:8080/api/contests/spring-code-sprint-2025
```

Should return contest details in JSON format.

### Test Frontend

Open http://localhost:3000 in your browser. You should see the contest join page.

## First Time Usage

1. **Open Frontend**: http://localhost:3000

2. **Join Contest**:
   - Contest ID: `spring-code-sprint-2025`
   - Username: Choose any username (e.g., `testuser`)
   - Click "Join Contest"

3. **Explore Problems**:
   - View 3 pre-seeded problems
   - Read descriptions and sample test cases

4. **Submit Solution**:
   - Select a problem
   - Choose language (Java, Python, or C++)
   - Write your code
   - Click "Submit Code"

5. **Watch Results**:
   - Status updates in real-time
   - See test cases passed
   - View execution time and memory
   - Check leaderboard for your ranking

## Sample Solutions

### Problem 1: Two Sum (Java)

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

### Problem 2: Reverse String (Python)

```python
s = input()
print(s[::-1])
```

### Problem 3: Valid Parentheses (C++)

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

## Troubleshooting

### Docker Not Running

**Symptom**: `Cannot connect to the Docker daemon`

**Solution**:
1. Start Docker Desktop
2. Wait for it to fully initialize (whale icon in system tray)
3. Run the start script again

### Port Already in Use

**Symptom**: `Port 3000 is already allocated`

**Solution**:
```bash
# Stop all containers
docker-compose down

# Stop any conflicting processes
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Restart
./start.sh
```

### Backend Can't Connect to Database

**Symptom**: `Connection refused` or `Unknown database`

**Solution**:
```bash
# Reset database and volumes
docker-compose down -v
docker-compose up -d

# Wait 30 seconds for initialization
# Check logs
docker-compose logs postgres
```

### Judge Images Not Found

**Symptom**: `Unable to find image 'shodh-judge-java:latest'`

**Solution**:
```bash
# Rebuild judge images
./build-judge-images.sh  # or .bat on Windows

# Verify images exist
docker images | grep shodh-judge
```

### Frontend Shows Network Error

**Symptom**: API calls fail with network error

**Solution**:
1. Check backend is running:
   ```bash
   docker-compose logs backend
   curl http://localhost:8080/api/contests/test
   ```

2. Verify environment variable:
   ```bash
   cat frontend/.env.local
   # Should contain: NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. Check CORS configuration in `backend/src/main/resources/application.properties`

### Submissions Stuck in PENDING

**Symptom**: Submissions never complete

**Solution**:
1. Check judge images exist:
   ```bash
   docker images | grep shodh-judge
   ```

2. Check backend logs:
   ```bash
   docker-compose logs backend | grep "Processing submission"
   ```

3. Verify Docker socket is mounted:
   ```bash
   docker-compose exec backend ls -l /var/run/docker.sock
   ```

4. Check temp directory permissions:
   ```bash
   ls -la /tmp/shodh-executions/
   ```

## Useful Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 backend

# Filter by keyword
docker-compose logs backend | grep ERROR
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Clean Everything

```bash
# Remove all containers, networks, volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a

# Rebuild from scratch
./build-judge-images.sh
./start.sh
```

### Access Database

```bash
# PostgreSQL CLI
docker exec -it shodh-postgres psql -U admin -d shodh_contests

# Example queries:
# \dt                    -- List tables
# SELECT * FROM contests;
# SELECT * FROM problems;
# SELECT * FROM submissions;
```

### Access Redis

```bash
# Redis CLI
docker exec -it shodh-redis redis-cli

# Example commands:
# PING                   -- Test connection
# KEYS *                 -- List all keys
# GET leaderboard:*      -- Get leaderboard cache
# FLUSHALL               -- Clear all cache
```

## Environment Variables

### Backend (application.properties)

```properties
# Database
spring.datasource.url=jdbc:postgresql://postgres:5432/shodh_contests
spring.datasource.username=admin
spring.datasource.password=admin123

# Redis
spring.data.redis.host=redis
spring.data.redis.port=6379

# Server
server.port=8080
```

### Frontend (.env.local)

```properties
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Architecture Overview

```
┌─────────────┐
│   Browser   │
│  (Port 3000)│
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│  Next.js    │
│  Frontend   │
└──────┬──────┘
       │ REST API
       ▼
┌─────────────┐
│ Spring Boot │
│  Backend    │
│ (Port 8080) │
└──────┬──────┘
       │
   ┌───┴───┐
   ▼       ▼
┌──────┐ ┌──────┐
│Postgres│ │Redis │
│(5432)│ │(6379)│
└──────┘ └──────┘
```

## Tech Stack

- **Backend**: Spring Boot 3.2, Java 17, PostgreSQL, Redis
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Monaco Editor
- **Judge**: Docker containers with resource limits
- **DevOps**: Docker Compose

## Features

✅ Live contest system  
✅ Multi-language support (Java, Python, C++)  
✅ Secure code execution  
✅ Real-time leaderboard  
✅ Async submission processing  
✅ Beautiful responsive UI

## Support

For detailed documentation, see:
- **README.md** - Complete project documentation
- **ARCHITECTURE.md** - System architecture details
- **TESTING.md** - Testing guide
- **SAMPLE_SOLUTIONS.md** - Working solutions for all problems

---

**Ready to code?** Open http://localhost:3000 and start solving problems! 🚀
