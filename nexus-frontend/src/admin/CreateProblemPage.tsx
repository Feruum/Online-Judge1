import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../coding-challenge/services/apiClient';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';

interface TestCase {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}

interface Example {
    input: string;
    output: string;
    explanation?: string;
}

export function CreateProblemPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
    const [examples, setExamples] = useState<Example[]>([{ input: '', output: '', explanation: '' }]);
    const [testCases, setTestCases] = useState<TestCase[]>([{ input: '', expectedOutput: '', isHidden: false }]);
    const [starterCode, setStarterCode] = useState(''); // Simple string for now, backend expects object?

    // Backend expects 'starterCode' to be string or object. Let's assume simple string template for now
    // or better, a JSON object mapping language to code.
    // The previous frontend mock service had: starterCode: { javascript: "..." }
    // Let's create a simple JSON editor or just text for now.

    const handleAddExample = () => {
        setExamples([...examples, { input: '', output: '', explanation: '' }]);
    };

    const handleRemoveExample = (index: number) => {
        setExamples(examples.filter((_, i) => i !== index));
    };

    const handleExampleChange = (index: number, field: keyof Example, value: string) => {
        const newExamples = [...examples];
        newExamples[index] = { ...newExamples[index], [field]: value };
        setExamples(newExamples);
    };

    const handleAddTestCase = () => {
        setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false }]);
    };

    const handleRemoveTestCase = (index: number) => {
        setTestCases(testCases.filter((_, i) => i !== index));
    };

    const handleTestCaseChange = (index: number, field: keyof TestCase, value: any) => {
        const newTestCases = [...testCases];
        newTestCases[index] = { ...newTestCases[index], [field]: value };
        setTestCases(newTestCases);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Construct payload
            const payload = {
                title,
                description,
                difficulty,
                slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
                examples: JSON.stringify(examples),
                testCases: JSON.stringify(testCases),
                constraints: JSON.stringify(["Time Limit: 1s", "Memory Limit: 128MB"]), // Default
                starterCode: JSON.stringify({
                    javascript: starterCode || "// Write your code here"
                }),
                tags: [] // Todo add tags
            };

            await apiClient.createProblem(payload);
            navigate('/problems');
        } catch (err: any) {
            setError(err.message || 'Failed to create problem');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Create New Problem</h1>
                <p className="text-muted-foreground">Add a new coding challenge to the platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                {error && (
                    <div className="bg-destructive/20 border border-destructive/50 text-destructive px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-4 bg-card/50 p-6 rounded-xl border border-border">
                    <h2 className="text-xl font-semibold">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value as any)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Markdown)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-sm outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4 bg-card/50 p-6 rounded-xl border border-border">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Examples</h2>
                        <button
                            type="button"
                            onClick={handleAddExample}
                            className="text-sm flex items-center gap-1 text-primary hover:underline"
                        >
                            <Plus className="w-4 h-4" /> Add Example
                        </button>
                    </div>

                    {examples.map((ex, idx) => (
                        <div key={idx} className="space-y-3 p-4 bg-background/50 rounded-lg border border-border relative group">
                            <button
                                type="button"
                                onClick={() => handleRemoveExample(idx)}
                                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Input</label>
                                    <input
                                        type="text"
                                        value={ex.input}
                                        onChange={(e) => handleExampleChange(idx, 'input', e.target.value)}
                                        className="w-full bg-background border border-border rounded px-2 py-1 text-sm outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Output</label>
                                    <input
                                        type="text"
                                        value={ex.output}
                                        onChange={(e) => handleExampleChange(idx, 'output', e.target.value)}
                                        className="w-full bg-background border border-border rounded px-2 py-1 text-sm outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">Explanation</label>
                                <input
                                    type="text"
                                    value={ex.explanation}
                                    onChange={(e) => handleExampleChange(idx, 'explanation', e.target.value)}
                                    className="w-full bg-background border border-border rounded px-2 py-1 text-sm outline-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Starter Code - Simplified */}
                <div className="space-y-4 bg-card/50 p-6 rounded-xl border border-border">
                    <h2 className="text-xl font-semibold">Starter Code (JavaScript)</h2>
                    <textarea
                        value={starterCode}
                        onChange={(e) => setStarterCode(e.target.value)}
                        rows={5}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-sm outline-none"
                        placeholder="// function solution(args) { ... }"
                    />
                </div>

                {/* Test Cases */}
                <div className="space-y-4 bg-card/50 p-6 rounded-xl border border-border">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Test Cases (Hidden)</h2>
                        <button
                            type="button"
                            onClick={handleAddTestCase}
                            className="text-sm flex items-center gap-1 text-primary hover:underline"
                        >
                            <Plus className="w-4 h-4" /> Add Test Case
                        </button>
                    </div>

                    {testCases.map((tc, idx) => (
                        <div key={idx} className="space-y-3 p-4 bg-background/50 rounded-lg border border-border relative group">
                            <button
                                type="button"
                                onClick={() => handleRemoveTestCase(idx)}
                                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Input</label>
                                    <input
                                        type="text"
                                        value={tc.input}
                                        onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                                        className="w-full bg-background border border-border rounded px-2 py-1 text-sm outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Expected Output</label>
                                    <input
                                        type="text"
                                        value={tc.expectedOutput}
                                        onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                                        className="w-full bg-background border border-border rounded px-2 py-1 text-sm outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <Save className="w-4 h-4" />
                        Create Problem
                    </button>
                </div>
            </form>
        </div>
    );
}
