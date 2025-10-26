'use client';

import { Problem, Language } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react';
import { Send, Clock, HardDrive } from 'lucide-react';

interface CodeEditorProps {
  problem: Problem | null;
  code: string;
  language: Language;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: Language) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function CodeEditor({
  problem,
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onSubmit,
  isSubmitting,
}: CodeEditorProps) {
  if (!problem) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-gray-500">Select a problem to start coding</p>
      </Card>
    );
  }

  const getEditorLanguage = () => {
    switch (language) {
      case Language.JAVA: return 'java';
      case Language.PYTHON: return 'python';
      case Language.CPP: return 'cpp';
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Problem Description */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{problem.title}</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{problem.timeLimit}ms</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <HardDrive className="h-4 w-4" />
                <span>{problem.memoryLimit}MB</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="examples">Sample Tests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {problem.description}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="mt-4">
              <div className="space-y-4">
                {problem.sampleTestCases.map((testCase, index) => (
                  <div key={testCase.id} className="bg-gray-50 rounded-lg p-3 border">
                    <p className="font-semibold text-sm mb-2">Sample Test {index + 1}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Input:</p>
                        <pre className="bg-white p-2 rounded text-xs border">{testCase.input}</pre>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Expected Output:</p>
                        <pre className="bg-white p-2 rounded text-xs border">{testCase.expectedOutput}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Code Editor</CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={Language.JAVA}>Java</option>
                <option value={Language.PYTHON}>Python</option>
                <option value={Language.CPP}>C++</option>
              </select>
              
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit Code
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Editor
            height="100%"
            language={getEditorLanguage()}
            value={code}
            onChange={(value) => onCodeChange(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
