# 🏗️ Architecture Documentation - Shodh-a-Code

## System Architecture Overview

This document provides a comprehensive overview of the Shodh-a-Code platform architecture, including system design, data flow, component interactions, and design decisions.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                                │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Next.js Frontend                           │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │  │
│  │  │ Join Page  │  │Contest Page│  │  Components            │ │  │
│  │  │            │  │            │  │  - ProblemList         │ │  │
│  │  │ - Contest  │  │ - Problems │  │  - CodeEditor (Monaco) │ │  │
│  │  │   ID Input │  │ - Editor   │  │  - SubmissionStatus    │ │  │
│  │  │ - Username │  │ - Submit   │  │  - Leaderboard         │ │  │
│  │  └────────────┘  └────────────┘  └────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (Axios Client)
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                    Spring Boot Backend (Port 8080)                   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    REST Controller                            │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  GET  /api/contests/{id}                               │  │  │
│  │  │  POST /api/submissions                                 │  │  │
│  │  │  GET  /api/submissions/{id}                            │  │  │
│  │  │  GET  /api/contests/{id}/leaderboard                   │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            │                                         │
│  ┌─────────────────────────┼────────────────────────────────────┐  │
│  │                    Service Layer                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │   Contest    │  │  Submission  │  │   Leaderboard    │  │  │
│  │  │   Service    │  │  Processor   │  │    Service       │  │  │
│  │  │              │  │   (@Async)   │  │  (Redis Cache)   │  │  │
│  │  └──────────────┘  └──────┬───────┘  └──────────────────┘  │  │
│  │                            │                                  │  │
│  │                     ┌──────▼───────┐                         │  │
│  │                     │    Judge     │                         │  │
│  │                     │   Service    │                         │  │
│  │                     │  (Docker)    │                         │  │
│  │                     └──────┬───────┘                         │  │
│  └────────────────────────────┼──────────────────────────────┘  │
│                                │                                   │
│  ┌─────────────────────────────┼────────────────────────────────┐│
│  │                    Repository Layer                           ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  ││
│  │  │   Contest    │  │  Submission  │  │      User        │  ││
│  │  │  Repository  │  │  Repository  │  │   Repository     │  ││
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  ││
│  └────────────────────────────────────────────────────────────┘│
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ ProcessBuilder
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                    Docker Judge Environment                          │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Docker Run Command with Security Constraints:               │  │
│  │  - --rm (auto-remove)                                        │  │
│  │  - --network=none (no network access)                        │  │
│  │  - --memory=256m (memory limit)                              │  │
│  │  - --cpus=1 (CPU limit)                                      │  │
│  │  - --pids-limit=50 (prevent fork bombs)                      │  │
│  │  - -v /code:/app:ro (read-only mount)                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐     │
│  │ Java Judge   │  │Python Judge  │  │    C++ Judge         │     │
│  │              │  │              │  │                      │     │
│  │ - JDK 17     │  │ - Python 3.11│  │ - GCC 13             │     │
│  │ - Alpine     │  │ - Alpine     │  │ - Alpine             │     │
│  │ - Non-root   │  │ - Non-root   │  │ - Non-root           │     │
│  └──────────────┘  └──────────────┘  └──────────────────────┘     │
└───────────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│   PostgreSQL     │                  │      Redis       │
│   Database       │                  │      Cache       │
│                  │                  │                  │
│ - Contests       │                  │ - Leaderboard    │
│ - Problems       │                  │   (30s TTL)      │
│ - TestCases      │                  │                  │
│ - Submissions    │                  │                  │
│ - Users          │                  │                  │
│                  │                  │                  │
│ Port: 5432       │                  │ Port: 6379       │
└──────────────────┘                  └──────────────────┘
```

---

## Data Flow Diagrams

### 1. Contest Join Flow

```
User Browser                Frontend                Backend
     │                         │                       │
     │  Enter Contest ID       │                       │
     │  & Username             │                       │
     ├────────────────────────>│                       │
     │                         │                       │
     │                         │  Store in localStorage│
     │                         │                       │
     │                         │  Navigate to          │
     │                         │  /contest/{id}        │
     │<────────────────────────┤                       │
     │                         │                       │
     │                         │  GET /contests/{id}   │
     │                         ├──────────────────────>│
     │                         │                       │
     │                         │  Contest + Problems   │
     │                         │<──────────────────────┤
     │                         │                       │
     │  Display Contest Page   │                       │
     │<────────────────────────┤                       │
```

### 2. Code Submission Flow

```
User          Frontend        Backend         Judge Service      Docker
 │               │               │                  │              │
 │ Write Code    │               │                  │              │
 │ Click Submit  │               │                  │              │
 ├──────────────>│               │                  │              │
 │               │               │                  │              │
 │               │ POST          │                  │              │
 │               │ /submissions  │                  │              │
 │               ├──────────────>│                  │              │
 │               │               │                  │              │
 │               │               │ Save Submission  │              │
 │               │               │ (Status: PENDING)│              │
 │               │               │                  │              │
 │               │ Submission ID │                  │              │
 │               │<──────────────┤                  │              │
 │               │               │                  │              │
 │               │               │ @Async Process   │              │
 │               │               ├─────────────────>│              │
 │               │               │                  │              │
 │               │               │ Update Status    │              │
 │               │               │ (RUNNING)        │              │
 │               │               │                  │              │
 │               │               │                  │ Create Temp  │
 │               │               │                  │ Directory    │
 │               │               │                  ├─────────────>│
 │               │               │                  │              │
 │               │               │                  │ Write Code   │
 │               │               │                  │ to File      │
 │               │               │                  │              │
 │               │               │                  │ Docker Run   │
 │               │               │                  │ with Limits  │
 │               │               │                  ├─────────────>│
 │               │               │                  │              │
 │               │               │                  │ Execute Code │
 │               │               │                  │ Run Tests    │
 │               │               │                  │              │
 │               │               │                  │ Results      │
 │               │               │                  │<─────────────┤
 │               │               │                  │              │
 │               │               │                  │ Cleanup      │
 │               │               │                  ├─────────────>│
 │               │               │                  │              │
 │               │               │ Update Status    │              │
 │               │               │ (ACCEPTED/WA/etc)│              │
 │               │               │<─────────────────┤              │
 │               │               │                  │              │
 │               │               │ Update User Score│              │
 │               │               │ (if ACCEPTED)    │              │
 │               │               │                  │              │
 │ Poll Status   │               │                  │              │
 │ (every 2s)    │               │                  │              │
 │               │ GET           │                  │              │
 │               │ /submissions  │                  │              │
 │               │ /{id}         │                  │              │
 │               ├──────────────>│                  │              │
 │               │               │                  │              │
 │               │ Status +      │                  │              │
 │               │ Results       │                  │              │
 │               │<──────────────┤                  │              │
 │               │               │                  │              │
 │ Display       │               │                  │              │
 │ Results       │               │                  │              │
 │<──────────────┤               │                  │              │
 │               │               │                  │              │
 │ Confetti! 🎉  │               │                  │              │
 │ (if ACCEPTED) │               │                  │              │
```

### 3. Leaderboard Update Flow

```
Frontend              Backend           Redis           PostgreSQL
   │                     │                │                 │
   │ GET /leaderboard    │                │                 │
   ├────────────────────>│                │                 │
   │                     │                │                 │
   │                     │ Check Cache    │                 │
   │                     ├───────────────>│                 │
   │                     │                │                 │
   │                     │ Cache Miss     │                 │
   │                     │<───────────────┤                 │
   │                     │                │                 │
   │                     │ Query Users    │                 │
   │                     │ ORDER BY score │                 │
   │                     ├────────────────────────────────>│
   │                     │                │                 │
   │                     │ User Rankings  │                 │
   │                     │<────────────────────────────────┤
   │                     │                │                 │
   │                     │ Cache Result   │                 │
   │                     │ (TTL: 30s)     │                 │
   │                     ├───────────────>│                 │
   │                     │                │                 │
   │ Leaderboard Data    │                │                 │
   │<────────────────────┤                │                 │
   │                     │                │                 │
   │ Display Rankings    │                │                 │
   │                     │                │                 │
   │ (Poll every 20s)    │                │                 │
```

---

## Database Schema

```sql
┌─────────────────────────────────────────────────────────────┐
│                         CONTESTS                             │
├─────────────────────────────────────────────────────────────┤
│ id              UUID PRIMARY KEY                             │
│ name            VARCHAR NOT NULL                             │
│ description     VARCHAR(1000)                                │
│ start_time      TIMESTAMP                                    │
│ end_time        TIMESTAMP                                    │
│ created_at      TIMESTAMP                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1:N
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         PROBLEMS                             │
├─────────────────────────────────────────────────────────────┤
│ id              UUID PRIMARY KEY                             │
│ title           VARCHAR NOT NULL                             │
│ description     TEXT                                         │
│ difficulty      VARCHAR (EASY/MEDIUM/HARD)                   │
│ time_limit      INTEGER (ms)                                 │
│ memory_limit    INTEGER (MB)                                 │
│ points          INTEGER                                      │
│ contest_id      UUID FOREIGN KEY → contests.id               │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1:N
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       TEST_CASES                             │
├─────────────────────────────────────────────────────────────┤
│ id              UUID PRIMARY KEY                             │
│ input           TEXT                                         │
│ expected_output TEXT                                         │
│ is_sample       BOOLEAN                                      │
│ problem_id      UUID FOREIGN KEY → problems.id               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       SUBMISSIONS                            │
├─────────────────────────────────────────────────────────────┤
│ id              UUID PRIMARY KEY                             │
│ code            TEXT NOT NULL                                │
│ language        VARCHAR (JAVA/PYTHON/CPP)                    │
│ status          VARCHAR (PENDING/RUNNING/ACCEPTED/etc)       │
│ execution_time  INTEGER (ms)                                 │
│ memory_used     INTEGER (KB)                                 │
│ test_cases_passed INTEGER                                    │
│ test_cases_total  INTEGER                                    │
│ verdict         VARCHAR(1000)                                │
│ submitted_at    TIMESTAMP                                    │
│ username        VARCHAR NOT NULL                             │
│ problem_id      UUID NOT NULL                                │
│ contest_id      UUID NOT NULL                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                          USERS                               │
├─────────────────────────────────────────────────────────────┤
│ id              UUID PRIMARY KEY                             │
│ username        VARCHAR NOT NULL                             │
│ contest_id      UUID NOT NULL                                │
│ total_score     INTEGER DEFAULT 0                            │
│ problems_solved INTEGER DEFAULT 0                            │
│ last_submission_time TIMESTAMP                               │
│ joined_at       TIMESTAMP                                    │
│ UNIQUE(username, contest_id)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Matrix

```
┌──────────────┬─────────┬─────────┬──────┬──────────┬────────┐
│ Component    │ Frontend│ Backend │ DB   │ Redis    │ Docker │
├──────────────┼─────────┼─────────┼──────┼──────────┼────────┤
│ Frontend     │    -    │  REST   │  -   │    -     │   -    │
│ Backend      │  JSON   │    -    │ JDBC │  Client  │  CLI   │
│ PostgreSQL   │    -    │   JPA   │  -   │    -     │   -    │
│ Redis        │    -    │Template │  -   │    -     │   -    │
│ Docker Judge │    -    │Process  │  -   │    -     │   -    │
└──────────────┴─────────┴─────────┴──────┴──────────┴────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Network Isolation                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Docker containers run with --network=none              │ │
│  │ No external network access for user code               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 2: Resource Limits                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ CPU: Limited to 1 core (--cpus=1)                      │ │
│  │ Memory: 256MB hard limit (--memory=256m)               │ │
│  │ Time: 5-second timeout (timeout command)               │ │
│  │ Processes: Max 50 PIDs (--pids-limit=50)               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 3: File System Isolation                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Code mounted as read-only (:ro flag)                   │ │
│  │ Temporary execution directories                         │ │
│  │ Automatic cleanup after execution                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 4: User Permissions                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Non-root user (coderunner) inside containers           │ │
│  │ Limited system access                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 5: Input Validation                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Jakarta Validation on API inputs                        │ │
│  │ SQL injection prevention (JPA)                          │ │
│  │ XSS protection (React escaping)                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                  Performance Optimizations                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Backend Optimizations                                    │
│     ├─ Database Indexing (username, problem_id, score)      │
│     ├─ Connection Pooling (HikariCP)                        │
│     ├─ Redis Caching (30s TTL for leaderboard)              │
│     └─ Async Thread Pool (4-8 concurrent submissions)       │
│                                                               │
│  2. Frontend Optimizations                                   │
│     ├─ Code Splitting (Next.js automatic)                   │
│     ├─ Monaco Editor Lazy Loading                           │
│     ├─ Query Caching (React Query)                          │
│     └─ Conditional Polling (stop when final)                │
│                                                               │
│  3. Docker Optimizations                                     │
│     ├─ Multi-stage Builds (smaller images)                  │
│     ├─ Layer Caching (faster builds)                        │
│     ├─ Alpine Base Images (~5MB)                            │
│     └─ Fast Container Spin-up                               │
│                                                               │
│  4. Database Optimizations                                   │
│     ├─ Indexed Queries                                       │
│     ├─ Lazy Loading (JPA)                                   │
│     ├─ Query Optimization                                    │
│     └─ Connection Reuse                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
Production Deployment (Recommended)

┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                           │
│                     (NGINX/HAProxy)                          │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐      ┌─────────┐
│Frontend │      │Frontend │
│Instance │      │Instance │
│  (CDN)  │      │  (CDN)  │
└─────────┘      └─────────┘
                      │
                      │
    ┌─────────────────┴─────────────────┐
    │                                   │
    ▼                                   ▼
┌─────────┐                        ┌─────────┐
│Backend  │                        │Backend  │
│Instance │                        │Instance │
│  (API)  │                        │  (API)  │
└────┬────┘                        └────┬────┘
     │                                  │
     └──────────────┬───────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│PostgreSQL│   │  Redis  │   │ Judge   │
│(Primary) │   │ Cluster │   │ Nodes   │
└─────────┘   └─────────┘   └─────────┘
```

---

This architecture ensures:
- ✅ Scalability
- ✅ Security
- ✅ Performance
- ✅ Reliability
- ✅ Maintainability
