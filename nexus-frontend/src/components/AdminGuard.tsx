import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function AdminGuard() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/problems" replace />;
    }

    return <Outlet />;
}
