import type { ReactNode } from 'react';
import { FaShieldAlt, FaTrophy } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { TeamProvider, useTeam } from '@/context/TeamContext';

interface LayoutProps {
  children: ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { teamInfo, score, totalScore } = useTeam();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('teamName');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className='min-h-screen bg-[#0D202E] relative overflow-hidden'>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className='fixed inset-0 w-full h-full object-cover opacity-30 z-0'
      >
        <source src='/bg.mp4' type='video/mp4' />
      </video>

      {/* Background gradient overlay */}
      <div className='fixed inset-0 bg-gradient-to-b from-[#0D202E]/80 via-transparent to-[#0D202E]/90 z-[1]' />

      {/* Grid pattern overlay */}
      <div
        className='fixed inset-0 z-[2] opacity-10'
        style={{
          backgroundImage:
            'linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Header */}
      <header className='fixed top-0 left-0 right-0 z-50 bg-[#0D202E]/80 backdrop-blur-md border-b border-white/5'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          {/* Left - Team Badge (clickable to view team) */}
          <Link
            to='/team'
            className='flex items-center gap-4 group cursor-pointer'
          >
            <div className='w-12 h-12 rounded-xl bg-[#0A1A24] border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all'>
              <FaShieldAlt className='text-cyan-400 text-xl' />
            </div>
            <div className='flex flex-col'>
              <span className='text-white font-bold tracking-wider text-lg group-hover:text-cyan-300 transition-colors'>
                {teamInfo?.teamName || 'TEAM'}
              </span>
              <span className='text-green-400 text-xs flex items-center gap-1.5'>
                <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
                ONLINE
              </span>
            </div>
          </Link>

          {/* Right - Score & Logout */}
          <div className='flex items-center gap-6'>
            {/* Score Badge */}
            <div className='flex items-center gap-2 bg-[#0A1A24] px-4 py-2 rounded-full border border-cyan-500/20'>
              <FaTrophy className='text-yellow-400' />
              <span className='text-white font-bold font-mono'>
                {score?.toLocaleString() || '0'}
              </span>
              <span className='text-gray-400 text-sm'>/</span>
              <span className='text-cyan-300 font-bold font-mono'>
                {totalScore?.toLocaleString() || '0'}
              </span>
              <span className='text-gray-400 text-sm'>PTS</span>
            </div>

            {/* Separator */}
            <div className='w-px h-8 bg-white/10' />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group'
            >
              <span className='text-sm font-medium'>LOGOUT</span>
              <FiLogOut className='text-lg group-hover:translate-x-0.5 transition-transform' />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='relative z-10 pt-24 min-h-screen flex items-center justify-center'>
        <div className='w-full max-w-7xl mx-auto px-6'>{children}</div>
      </main>

      {/* Bottom Navigation */}
      {/* <BottomNav /> */}
    </div>
  );
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <TeamProvider>
      <LayoutContent>{children}</LayoutContent>
    </TeamProvider>
  );
};

export default Layout;
