import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, LayoutDashboard, PlusCircle, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '@/lib/utils'; // Assuming utilities exist, or I can inline

export function AdminLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/create-problem', label: 'Create Problem', icon: PlusCircle },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card/50 hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Code2 className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-lg font-bold">Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        to="/problems"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to App</span>
                    </Link>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <div className="flex items-center justify-between">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header (TODO if needed) */}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

// Inline helper if cn is not available globally, but sticking to imports is better.
// If cn fails, I'll fix it. I saw cn imported in LefSidebar.tsx so existing utils are likely there.
