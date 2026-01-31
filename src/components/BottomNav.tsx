import { FaHome, FaCalendarAlt, FaUser, FaTrophy } from 'react-icons/fa';
import { MdQrCodeScanner } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className='fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4'>
      <div className='bg-[#1A1A1A]/80 backdrop-blur-md border border-white/5 rounded-3xl h-16 flex items-center px-6 gap-8 shadow-2xl relative'>
        {/* Nav Items */}
        <Link
          to='/'
          className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <FaHome size={20} />
          <span className='text-[10px] font-medium'>Home</span>
        </Link>

        <Link
          to='/events'
          className='flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors'
        >
          <FaCalendarAlt size={18} />
          <span className='text-[10px] font-medium'>Events</span>
        </Link>

        {/* Center Profile Button - Popped out */}
        <div className='relative -top-6 group'>
          <div className='absolute inset-0 bg-[#160203] rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity'></div>
          <Link
            to='/profile'
            className='relative flex items-center justify-center w-14 h-14 bg-[#1A1A1A] border-4 border-[#0D202E] rounded-full shadow-[0_0_20px_rgba(255,0,0,0.15)] group-hover:shadow-[0_0_25px_rgba(255,0,0,0.3)] transition-all'
          >
            {/* Red glow inner */}
            <div className='absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-red-900/20'></div>
            <FaUser size={22} className='text-white relative z-10' />
          </Link>
        </div>

        <Link
          to='/leaderboard'
          className='flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors'
        >
          <FaTrophy size={18} />
          <span className='text-[10px] font-medium'>LeaderBoard</span>
        </Link>

        <Link
          to='/scan'
          className='flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors'
        >
          <MdQrCodeScanner size={22} />
          <span className='text-[10px] font-medium'>Scan</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
