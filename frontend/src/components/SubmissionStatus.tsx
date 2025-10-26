'use client';

import { useQuery } from '@tanstack/react-query';
import { contestApi } from '@/lib/api';
import { SubmissionStatus as Status } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmissionStatusProps {
  submissionId: string;
  onAccepted: () => void;
}

export default function SubmissionStatusComponent({ submissionId, onAccepted }: SubmissionStatusProps) {
  const { data: submission, isLoading } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: () => contestApi.getSubmissionStatus(submissionId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000;
      
      // Stop polling if status is final
      if (data.status !== Status.PENDING && data.status !== Status.RUNNING) {
        if (data.status === Status.ACCEPTED) {
          onAccepted();
        }
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
    enabled: !!submissionId,
  });

  if (isLoading || !submission) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading submission status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (submission.status) {
      case Status.ACCEPTED:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case Status.WRONG_ANSWER:
      case Status.COMPILATION_ERROR:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case Status.TLE:
      case Status.MLE:
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case Status.RUNTIME_ERROR:
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
    }
  };

  const getStatusBadge = () => {
    const baseClass = "text-sm font-medium";
    switch (submission.status) {
      case Status.ACCEPTED:
        return <Badge className={cn(baseClass, "bg-green-100 text-green-700")}>Accepted</Badge>;
      case Status.WRONG_ANSWER:
        return <Badge className={cn(baseClass, "bg-red-100 text-red-700")}>Wrong Answer</Badge>;
      case Status.TLE:
        return <Badge className={cn(baseClass, "bg-orange-100 text-orange-700")}>Time Limit Exceeded</Badge>;
      case Status.MLE:
        return <Badge className={cn(baseClass, "bg-orange-100 text-orange-700")}>Memory Limit Exceeded</Badge>;
      case Status.RUNTIME_ERROR:
        return <Badge className={cn(baseClass, "bg-red-100 text-red-700")}>Runtime Error</Badge>;
      case Status.COMPILATION_ERROR:
        return <Badge className={cn(baseClass, "bg-red-100 text-red-700")}>Compilation Error</Badge>;
      case Status.RUNNING:
        return <Badge className={cn(baseClass, "bg-blue-100 text-blue-700")}>Running...</Badge>;
      default:
        return <Badge className={cn(baseClass, "bg-yellow-100 text-yellow-700")}>Pending...</Badge>;
    }
  };

  return (
    <Card className={cn(
      "border-2",
      submission.status === Status.ACCEPTED && "border-green-500 bg-green-50/50",
      submission.status === Status.WRONG_ANSWER && "border-red-500 bg-red-50/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon()}
            Submission Result
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Stats */}
        {(submission.executionTime !== undefined || submission.testCasesPassed !== undefined) && (
          <div className="grid grid-cols-3 gap-4">
            {submission.executionTime !== undefined && (
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-xs text-gray-600 mb-1">Execution Time</p>
                <p className="font-semibold">{submission.executionTime}ms</p>
              </div>
            )}
            {submission.memoryUsed !== undefined && (
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-xs text-gray-600 mb-1">Memory Used</p>
                <p className="font-semibold">{submission.memoryUsed}KB</p>
              </div>
            )}
            {submission.testCasesPassed !== undefined && submission.testCasesTotal !== undefined && (
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-xs text-gray-600 mb-1">Test Cases</p>
                <p className="font-semibold">
                  {submission.testCasesPassed}/{submission.testCasesTotal}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Verdict Message */}
        {submission.verdict && (
          <Alert className={cn(
            submission.status === Status.ACCEPTED && "border-green-500 bg-green-50",
            (submission.status === Status.WRONG_ANSWER || 
             submission.status === Status.RUNTIME_ERROR || 
             submission.status === Status.COMPILATION_ERROR) && "border-red-500 bg-red-50",
            (submission.status === Status.TLE || submission.status === Status.MLE) && "border-orange-500 bg-orange-50"
          )}>
            <AlertDescription className="text-sm">
              {submission.verdict}
            </AlertDescription>
          </Alert>
        )}

        {/* Progress indicator for pending/running */}
        {(submission.status === Status.PENDING || submission.status === Status.RUNNING) && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <p className="text-xs text-gray-600 text-center">
              {submission.status === Status.PENDING ? 'Waiting in queue...' : 'Testing your code...'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
