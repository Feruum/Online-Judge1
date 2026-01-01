import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { ProfilePage } from './pages/ProfilePage';
import { DiscussionsPage } from './pages/DiscussionsPage';
import { CodingChallengePage } from './coding-challenge/components/CodingChallengePage';
import { AdminGuard } from './components/AdminGuard';
import { AdminLayout } from './admin/AdminLayout';
import { CreateProblemPage } from './admin/CreateProblemPage';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/problems/:id" element={<CodingChallengePage />} />
              <Route path="/problems/:problemId/discussions" element={<DiscussionsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminGuard />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="create-problem" replace />} />
                <Route path="create-problem" element={<CreateProblemPage />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/problems" replace />} />
            <Route path="*" element={<Navigate to="/problems" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
