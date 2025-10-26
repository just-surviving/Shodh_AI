'use client';

import { useQuery } from '@tanstack/react-query';
import { contestApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  contestId: string;
  currentUsername: string;
}

export default function Leaderboard({ contestId, currentUsername }: LeaderboardProps) {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', contestId],
    queryFn: () => contestApi.getLeaderboard(contestId),
    refetchInterval: 20000, // Poll every 20 seconds
    enabled: !!contestId,
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-sm font-semibold text-gray-600">#{rank}</span>;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Live Leaderboard
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        ) : leaderboard && leaderboard.length > 0 ? (
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry) => {
                const isCurrentUser = entry.username === currentUsername;
                return (
                  <TableRow
                    key={entry.username}
                    className={cn(
                      "transition-colors",
                      isCurrentUser && "bg-blue-50 font-semibold border-l-4 border-l-blue-500",
                      entry.rank <= 3 && !isCurrentUser && "bg-yellow-50/30"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className={cn(
                          "text-sm",
                          isCurrentUser && "text-blue-700 font-bold"
                        )}>
                          {entry.username}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {entry.problemsSolved} {entry.problemsSolved === 1 ? 'problem' : 'problems'} solved
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "inline-flex items-center justify-center min-w-[60px] px-2 py-1 rounded-full text-sm font-bold",
                        entry.rank === 1 && "bg-yellow-100 text-yellow-800",
                        entry.rank === 2 && "bg-gray-100 text-gray-700",
                        entry.rank === 3 && "bg-orange-100 text-orange-700",
                        entry.rank > 3 && "bg-blue-100 text-blue-700"
                      )}>
                        {entry.totalScore}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No submissions yet</p>
              <p className="text-xs">Be the first to solve a problem!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
