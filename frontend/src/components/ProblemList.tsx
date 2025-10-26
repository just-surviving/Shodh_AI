'use client';

import { Problem, Difficulty } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProblemListProps {
  problems: Problem[];
  selectedProblem: Problem | null;
  onSelectProblem: (problem: Problem) => void;
  solvedProblems: Set<string>;
}

export default function ProblemList({
  problems,
  selectedProblem,
  onSelectProblem,
  solvedProblems
}: ProblemListProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Problems</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {problems.map((problem, index) => {
            const isSelected = selectedProblem?.id === problem.id;
            const isSolved = solvedProblems.has(problem.id);
            
            return (
              <button
                key={problem.id}
                onClick={() => onSelectProblem(problem)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md",
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {isSolved ? (
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="font-medium text-sm">
                      {index + 1}. {problem.title}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-7">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      problem.difficulty === Difficulty.EASY && "bg-green-100 text-green-700",
                      problem.difficulty === Difficulty.MEDIUM && "bg-yellow-100 text-yellow-700",
                      problem.difficulty === Difficulty.HARD && "bg-red-100 text-red-700"
                    )}
                  >
                    {problem.difficulty}
                  </Badge>
                  <span className="text-xs text-gray-600">{problem.points} pts</span>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
