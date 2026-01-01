import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Lock, User, Mail } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';


export function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await register(username, email, password);
            navigate('/problems');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
                        <Code2 className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">Create Account</h1>
                    <p className="text-muted-foreground">Start your coding journey today</p>
                </div>

                {/* Register Form */}
                <div className="bg-card/50 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-border">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-destructive/20 border border-destructive/50 text-destructive px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-primary/25"
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-primary hover:text-primary/80 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
