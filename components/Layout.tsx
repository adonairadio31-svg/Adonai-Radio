import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Radio, 
  Calendar, 
  Newspaper, 
  ShoppingBag, 
  Info, 
  Menu,
  Mic2,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';
import { NavItem } from '../types';
import { useData } from '../context/DataContext';

// Navigation Items Configuration
const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'News', path: '/news', icon: Newspaper },
  { label: 'Events', path: '/events', icon: Calendar },
  { label: 'Market', path: '/market', icon: ShoppingBag },
  { label: 'Programs', path: '/programs', icon: Radio },
  { label: 'Services', path: '/services', icon: Menu },
  { label: 'About', path: '/about', icon: Info },
];

interface LayoutProps {
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (val: number) => void;
}

const Layout: React.FC<LayoutProps> = ({ isPlaying, togglePlay, volume, setVolume }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname);
  const { isAdmin } = useData();
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Admin Triggers
  const [logoClicks, setLogoClicks] = useState(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  // Handle Shift + S for Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Handle Logo Click
  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const newVal = prev + 1;
      if (newVal >= 7) {
        navigate('/admin');
        return 0;
      }
      return newVal;
    });

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      setLogoClicks(0);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Desktop Sidebar (Visible on lg screens) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 h-full fixed left-0 top-0 z-20 shadow-sm transition-colors duration-300">
        <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <Radio size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 dark:from-primary-400 dark:to-primary-200">
              Adonai
            </span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                <Icon size={20} className={`${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                {item.label}
              </button>
            );
          })}
          {isAdmin && (
             <button
                onClick={() => navigate('/admin')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
             >
               <ShieldCheck size={20} />
               Admin Panel
             </button>
          )}
        </nav>

        {/* Theme Toggle Desktop */}
        <div className="px-4 py-2">
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
           >
             {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
             <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
           </button>
        </div>

        {/* Mini Player in Sidebar (if playing and not on home) */}
        {isPlaying && activePath !== '/' && (
           <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center animate-pulse">
                   <Mic2 size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">Live Stream</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 truncate">On Air Now</p>
                </div>
             </div>
             <button 
                onClick={togglePlay}
                className="w-full py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-md text-xs font-bold transition shadow-sm"
             >
               Pause Stream
             </button>
           </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 h-full overflow-y-auto overflow-x-hidden pb-24 lg:pb-0 scroll-smooth bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* Mobile Header with Rainbow Gradient */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 backdrop-blur-md sticky top-0 z-30 shadow-md">
          <div 
             className="flex items-center gap-2 select-none"
             onClick={handleLogoClick}
          >
             <div className="w-8 h-8 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center text-white shadow-sm border border-white/20">
                <Radio size={18} />
             </div>
             <span className="font-bold text-lg text-white drop-shadow-sm">Adonai</span>
          </div>
          <div className="flex gap-2">
             {isAdmin && (
                <button onClick={() => navigate('/admin')} className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors"><ShieldCheck size={20}/></button>
             )}
             <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 transition-colors border border-white/10 shadow-sm"
             >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
             </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto min-h-full">
           <Outlet context={{ isPlaying, togglePlay, volume, setVolume }} />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <div className="flex items-center justify-between px-2 py-1 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center min-w-[4.5rem] py-2 px-1 rounded-xl transition-all duration-200
                  ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <div className={`p-1.5 rounded-full mb-1 transition-all ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 translate-y-[-2px]' : ''}`}>
                   <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium tracking-tight leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Mini Player Floating (if playing and not on home) */}
      {isPlaying && activePath !== '/' && (
         <div className="lg:hidden fixed bottom-[72px] left-4 right-4 bg-gray-900 dark:bg-slate-800 text-white p-3 rounded-2xl shadow-xl z-40 flex items-center justify-between backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-700 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-bold">Adonai Radio Live</p>
                <p className="text-xs text-gray-300">Streaming...</p>
              </div>
            </div>
            <button 
              onClick={togglePlay}
              className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-full text-xs font-bold shadow-lg"
            >
              Pause
            </button>
         </div>
      )}

    </div>
  );
};

export default Layout;