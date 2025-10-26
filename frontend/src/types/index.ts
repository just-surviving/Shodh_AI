export enum Language {
  JAVA = 'JAVA',
  PYTHON = 'PYTHON',
  CPP = 'CPP'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  TLE = 'TLE',
  MLE = 'MLE',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILATION_ERROR = 'COMPILATION_ERROR'
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  timeLimit: number;
  memoryLimit: number;
  points: number;
  sampleTestCases: TestCase[];
}

export interface Contest {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
}

export interface Submission {
  id: string;
  status: SubmissionStatus;
  executionTime?: number;
  memoryUsed?: number;
  testCasesPassed?: number;
  testCasesTotal?: number;
  verdict?: string;
  submittedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  totalScore: number;
  problemsSolved: number;
}

export interface SubmissionRequest {
  code: string;
  language: Language;
  username: string;
  problemId: string;
  contestId: string;
}
