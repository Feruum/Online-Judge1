import { useNavigate, useLocation } from 'react-router-dom';
import {
  Code2,
  Trophy,
  MessageSquare,
  Bell,
  Settings,
  FileText,
  Circle
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function LeftSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isProblemsActive = location.pathname === '/problems' || location.pathname.startsWith('/problems/');
  const isDiscussActive = location.pathname.includes('/discussions');

  return (
    <div className="w-80 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground">Online Judge</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavItem
          icon={<FileText className="w-5 h-5" />}
          label="Problems"
          active={isProblemsActive && !isDiscussActive}
          onClick={() => navigate('/problems')}
        />
        <NavItem
          icon={<Trophy className="w-5 h-5" />}
          label="Contest"
          active={false}
        />
        <NavItem
          icon={<MessageSquare className="w-5 h-5" />}
          label="Discuss"
          active={isDiscussActive}
          onClick={() => {
            // Navigate to discussions for the current problem if on a problem page
            const match = location.pathname.match(/\/problems\/(\d+)/);
            if (match) {
              navigate(`/problems/${match[1]}/discussions`);
            } else {
              navigate('/problems');
            }
          }}
        />
      </nav>

      {/* Status */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
          <span>Online</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {user?.username?.substring(0, 2).toUpperCase() || 'US'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-foreground">{user?.username || 'Guest'}</div>
            <div className="text-xs text-muted-foreground">{user?.role === 'admin' ? 'Admin' : 'Member'}</div>
          </div>
        </div>
      </div>

      {/* Action Icons */}
      <div className="px-6 py-4 border-t border-border flex items-center gap-4">
        <button
          onClick={() => navigate('/problems')}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Problems"
        >
          <Code2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="My Submissions"
        >
          <FileText className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Achievements"
        >
          <Trophy className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const problemMatch = location.pathname.match(/\/problems\/(\d+)/);
            if (problemMatch) {
              navigate(`/problems/${problemMatch[1]}/discussions`);
            } else {
              navigate('/problems');
            }
          }}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Discussions"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        <button
          onClick={() => alert('Notifications coming soon!')}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

