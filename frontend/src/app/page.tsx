'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Trophy, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function JoinPage() {
  const router = useRouter();
  const [contestId, setContestId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contestId.trim() || !username.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    setLoading(true);
    try {
      localStorage.setItem('username', username.trim());
      localStorage.setItem('contestId', contestId.trim());
      toast.success('Joining contest...');
      router.push(`/contest/${contestId.trim()}`);
    } catch (error) {
      toast.error('Failed to join contest');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Code2 className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Shodh-a-Code
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Join a coding contest and compete with others!
            </CardDescription>
          </div>

          <div className="flex gap-6 justify-center pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Live Contests</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Leaderboards</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleJoin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Contest ID <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter contest ID"
                value={contestId}
                onChange={(e) => setContestId(e.target.value)}
                className="h-11"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                💡 Try: <code className="bg-gray-100 px-2 py-0.5 rounded text-blue-600 font-mono">spring-code-sprint-2025</code>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Choose your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
                required
                minLength={3}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                This will be displayed on the leaderboard
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Joining...
                </span>
              ) : (
                'Join Contest'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
