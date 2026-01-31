import { LogOut, Trophy, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='absolute top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-gradient-to-b from-[#0D202E] via-[#0D202E]/80 to-transparent'
    >
      {/* Team Info */}
      <div className='flex items-center gap-4'>
        <div className='w-12 h-12 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden group'>
          <div className='absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity' />
          <Shield className='text-cyan-400 w-6 h-6' />
        </div>
        <div>
          <h2 className='text-white font-bold tracking-wider text-lg font-mono leading-none'>
            TEAM PHANTOM
          </h2>
          <div className='flex items-center gap-2 mt-1'>
            <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
            <span className='text-xs text-cyan-500/70 font-mono tracking-widest uppercase'>
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Points & Logout */}
      <div className='flex items-center gap-6 md:gap-8'>
        {/* Points Display */}
        <div className='hidden md:flex items-center gap-3 bg-[#08121A] px-5 py-2.5 rounded-full border border-white/5 shadow-inner'>
          <Trophy className='text-yellow-500 w-5 h-5' />
          <span className='text-white font-mono font-bold text-lg tracking-wide'>
            2,450{' '}
            <span className='text-gray-500 text-sm font-normal ml-1'>PTS</span>
          </span>
        </div>

        {/* Divider */}
        <div className='w-px h-8 bg-white/10 hidden md:block' />

        {/* Logout Button */}
        <button
          className='flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group'
          onClick={() => console.log('Logout clicked')} // Placeholder logic
        >
          <span className='text-sm font-medium tracking-wide hidden md:block group-hover:tracking-wider transition-all'>
            LOGOUT
          </span>
          <div className='p-2 rounded-lg bg-white/5 group-hover:bg-red-500/10 transition-colors'>
            <LogOut size={18} />
          </div>
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
