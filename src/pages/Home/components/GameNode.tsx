import React from 'react';
import { Lock } from 'lucide-react';

interface GameNodeProps {
  active?: boolean;
  locked?: boolean;

  className?: string; // To allow positioning from parent
  scale?: number;
  onClick?: () => void;
}

const GameNode: React.FC<GameNodeProps> = ({
  active = false,
  locked = false,

  className = '',
  scale = 1,
  onClick,
}) => {
  return (
    <div
      className={`relative cursor-pointer transition-transform hover:scale-105 flex flex-col items-center justify-center ${className}`}
      style={{ width: 198 * scale, height: 144 * scale }}
      onClick={onClick}
    >
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 198 144'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={`absolute inset-0 transition-all duration-300 ${active ? 'filter drop-shadow-[0_0_15px_rgba(23,243,233,0.3)]' : 'opacity-60 grayscale-[0.6]'} ${locked ? 'brightness-50' : ''}`}
      >
        <path
          d='M198 89.5C198 120.152 153.676 143.5 99 143.5C44.3238 143.5 0 120.152 0 89.5C0 58.8482 44.3238 34 99 34C153.676 34 198 58.8482 198 89.5Z'
          fill='#0F494D'
        />
        <rect y='50' width='198' height='45' rx='10' fill='#0F494D' />
        <path
          d='M198 55.5C198 86.1518 153.676 109.5 99 109.5C44.3238 109.5 0 86.1518 0 55.5C0 24.8482 44.3238 0 99 0C153.676 0 198 24.8482 198 55.5Z'
          fill={active ? '#17F3E9' : '#156469'}
          className='transition-colors duration-300'
        />
      </svg>

      {/* Content Overlay */}
      <div className='relative z-10 flex flex-col items-center justify-center -mt-6'>
        {locked && (
          <div className='mb-2 p-2 rounded-full bg-black/60 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'>
            <Lock size={24} className='text-red-500/80' />
          </div>
        )}
      </div>

      {/* Active Glow Effect overlay if needed */}
      {active && (
        <div className='absolute inset-0 bg-cyan-400/10 blur-xl rounded-full -z-10 transform scale-75 pointer-events-none' />
      )}
    </div>
  );
};

export default GameNode;
