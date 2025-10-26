'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contestApi } from '@/lib/api';
import { Language, Problem } from '@/types';
import ProblemList from '@/components/ProblemList';
import CodeEditor from '@/components/CodeEditor';
import SubmissionStatus from '@/components/SubmissionStatus';
import Leaderboard from '@/components/Leaderboard';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function ContestPage() {
  const params = useParams();
  const contestId = params.contestId as string;
  const queryClient = useQueryClient();
  
  const [username, setUsername] = useState<string>('');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<Language>(Language.JAVA);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  // Load username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedContestId = localStorage.getItem('contestId');
    
    if (!storedUsername || storedContestId !== contestId) {
      window.location.href = '/';
      return;
    }
    
    setUsername(storedUsername);
  }, [contestId]);

  // Fetch contest data
  const { data: contest, isLoading: contestLoading, error: contestError } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: () => contestApi.getContest(contestId),
    enabled: !!contestId,
    retry: 2,
  });

  // Select first problem by default
  useEffect(() => {
    if (contest && contest.problems.length > 0 && !selectedProblem) {
      setSelectedProblem(contest.problems[0]);
      setCode(getDefaultCode(language));
    }
  }, [contest, selectedProblem, language]);

  // Submit code mutation
  const submitMutation = useMutation({
    mutationFn: (submissionData: any) => contestApi.submitCode(submissionData),
    onSuccess: (data) => {
      setCurrentSubmissionId(data.submissionId);
      toast.success('Code submitted! Judging in progress...');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to submit code');
    },
  });

  const handleSubmit = () => {
    if (!selectedProblem || !code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    submitMutation.mutate({
      code,
      language,
      username,
      problemId: selectedProblem.id,
      contestId,
    });
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    setCurrentSubmissionId(null);
    setCode(getDefaultCode(language));
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(getDefaultCode(newLanguage));
  };

  const handleAccepted = (problemId: string) => {
    setSolvedProblems(prev => new Set(prev).add(problemId));
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Refresh leaderboard
    queryClient.invalidateQueries({ queryKey: ['leaderboard', contestId] });
  };

  if (contestLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading contest...</p>
        </div>
      </div>
    );
  }

  if (contestError || !contest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Contest Not Found</h2>
          <p className="text-gray-600 mb-4">The contest ID you entered doesn't exist.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{contest.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{contest.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Competing as</p>
                <p className="font-semibold text-blue-600">{username}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-100px)]">
        {/* Left Sidebar - Problems */}
        <div className="col-span-3">
          <ProblemList
            problems={contest.problems}
            selectedProblem={selectedProblem}
            onSelectProblem={handleProblemSelect}
            solvedProblems={solvedProblems}
          />
        </div>

        {/* Center - Code Editor */}
        <div className="col-span-6 flex flex-col gap-4">
          <CodeEditor
            problem={selectedProblem}
            code={code}
            language={language}
            onCodeChange={setCode}
            onLanguageChange={handleLanguageChange}
            onSubmit={handleSubmit}
            isSubmitting={submitMutation.isPending}
          />
          
          {currentSubmissionId && (
            <SubmissionStatus
              submissionId={currentSubmissionId}
              onAccepted={() => handleAccepted(selectedProblem?.id || '')}
            />
          )}
        </div>

        {/* Right Sidebar - Leaderboard */}
        <div className="col-span-3">
          <Leaderboard
            contestId={contestId}
            currentUsername={username}
          />
        </div>
      </div>
    </div>
  );
}

function getDefaultCode(language: Language): string {
  switch (language) {
    case Language.JAVA:
      return `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Write your code here
        
        sc.close();
    }
}`;
    case Language.PYTHON:
      return `# Read input
# Write your code here
# Print output
`;
    case Language.CPP:
      return `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Write your code here
    
    return 0;
}`;
  }
}
