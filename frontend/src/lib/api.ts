import axios from 'axios';
import { Contest, Submission, LeaderboardEntry, SubmissionRequest } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const contestApi = {
  getContest: async (contestId: string): Promise<Contest> => {
    const { data } = await api.get(`/contests/${contestId}`);
    return data;
  },

  submitCode: async (submission: SubmissionRequest): Promise<{ submissionId: string; message: string }> => {
    const { data } = await api.post('/submissions', submission);
    return data;
  },

  getSubmissionStatus: async (submissionId: string): Promise<Submission> => {
    const { data } = await api.get(`/submissions/${submissionId}`);
    return data;
  },

  getLeaderboard: async (contestId: string): Promise<LeaderboardEntry[]> => {
    const { data } = await api.get(`/contests/${contestId}/leaderboard`);
    return data;
  },
};
