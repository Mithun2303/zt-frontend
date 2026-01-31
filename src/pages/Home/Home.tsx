import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import GameNode from './components/GameNode';
import { useEffect, useState, useCallback } from 'react';
import { userProgressService } from '@/services';
import type { TeamProgress } from '@/services/userProgress.service';

// Responsive node positions for each level - mobile first approach
const NODE_POSITIONS = [
  {
    // Level 1 - Bottom left
    className:
      'left-[8%] bottom-[8%] sm:left-[12%] sm:bottom-[10%] md:left-[15%] md:bottom-[12%] lg:left-[18%] lg:bottom-[14%]',
    mobileScale: 0.28,
    tabletScale: 0.35,
    desktopScale: 0.4,
  },
  {
    // Level 2 - Right middle-bottom
    className:
      'right-[8%] bottom-[28%] sm:right-[15%] sm:bottom-[30%] md:right-[18%] md:bottom-[32%] lg:right-[22%] lg:bottom-[34%]',
    mobileScale: 0.25,
    tabletScale: 0.3,
    desktopScale: 0.35,
  },
  {
    // Level 3 - Center-left middle
    className:
      'left-[25%] top-[42%] sm:left-[32%] sm:top-[40%] md:left-[38%] md:top-[38%] lg:left-[42%] lg:top-[36%]',
    mobileScale: 0.22,
    tabletScale: 0.26,
    desktopScale: 0.3,
  },
  {
    // Level 4 - Top right
    className:
      'right-[8%] top-[15%] sm:right-[12%] sm:top-[14%] md:right-[15%] md:top-[12%] lg:right-[18%] lg:top-[10%]',
    mobileScale: 0.2,
    tabletScale: 0.22,
    desktopScale: 0.25,
  },
];

// Extract level number from ID (e.g., "ZTLEVEL1" -> 1)
const extractLevelNumber = (levelId: string): number => {
  const match = levelId.match(/\d+$/);
  return match ? parseInt(match[0], 10) : 0;
};

// Custom hook to get responsive scale based on screen size
const useResponsiveScale = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop',
  );

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [levels, setLevels] = useState<TeamProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const screenSize = useResponsiveScale();

  const getLevel = useCallback(() => {
    setLoading(true);
    userProgressService
      .getLevels()
      .then((res) => {
        console.log(res);
        // Sort levels by level ID to ensure correct order
        const sortedLevels = res.sort(
          (a, b) =>
            extractLevelNumber(a.level.id) - extractLevelNumber(b.level.id),
        );
        console.log(
          'Levels data:',
          sortedLevels.map((l) => ({
            id: l.level.id,
            isUnlocked: l.isUnlocked,
            isCompleted: l.isCompleted,
          })),
        );
        setLevels(sortedLevels);
      })
      .catch((err) => {
        if (err.status === 307) {
          navigate('/create-team');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  // Re-fetch levels whenever the user navigates back to this page
  useEffect(() => {
    getLevel();
  }, [location.key, getLevel]);

  // Calculate progress for a level
  const calculateProgress = (levelProgress: TeamProgress): number => {
    const challenges = levelProgress.level.challenges;
    if (!challenges || challenges.length === 0) return 0;
    const solved = challenges.filter((c) => c.isSolved).length;
    return (solved / challenges.length) * 100;
  };

  // Get the scale based on screen size
  const getScale = (position: (typeof NODE_POSITIONS)[0]) => {
    switch (screenSize) {
      case 'mobile':
        return position.mobileScale;
      case 'tablet':
        return position.tabletScale;
      default:
        return position.desktopScale;
    }
  };

  if (loading) {
    return (
      <div className='w-full h-[85vh] flex items-center justify-center'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full'
        />
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col items-center overflow-hidden'>
      {/* Main Game Map Container */}
      <div className='relative w-full max-w-6xl h-[75vh] sm:h-[80vh] md:h-[85vh] flex items-center justify-center z-10'>
        {/* SVG Path Layer - Responsive */}
        <svg
          className='absolute inset-0 w-full h-full pointer-events-none'
          viewBox='0 0 1000 600'
          preserveAspectRatio='xMidYMid slice'
        >
          {/* Animated S-Curve Path */}
          <motion.path
            d='M 200 500 C 400 500, 500 450, 750 380 C 950 320, 800 250, 450 250 C 200 250, 300 150, 800 100'
            fill='none'
            stroke='#156469'
            strokeWidth='3'
            strokeDasharray='12 12'
            strokeLinecap='round'
            className='filter drop-shadow-[0_0_8px_rgba(21,100,105,0.4)]'
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
        </svg>

        {/* Nodes Layer - Dynamically rendered from backend data */}
        {levels.map((levelProgress, index) => {
          const position =
            NODE_POSITIONS[index] || NODE_POSITIONS[NODE_POSITIONS.length - 1];
          const levelNumber = extractLevelNumber(levelProgress.level.id);
          const isActive = levelProgress.isUnlocked;
          const isLocked = !levelProgress.isUnlocked;
          const isCompleted = levelProgress.isCompleted;
          const progress = calculateProgress(levelProgress);
          const showInfoCard = isActive; // Show card for all unlocked levels
          const scale = getScale(position);

          return (
            <motion.div
              key={levelProgress.level.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2 + index * 0.8,
                duration: 0.5,
                type: 'spring',
              }}
              className={`absolute ${position.className} ${isActive ? 'z-20 group' : 'z-10 hover:z-20'}`}
            >
              {/* Info Card - Responsive: Show for all unlocked levels */}
              {showInfoCard && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className='absolute z-30 
                    -top-40 -left-2 w-52 p-3
                    sm:-top-44 sm:-left-4 sm:w-60 sm:p-4
                    md:-top-48 md:-left-6 md:w-68 md:p-4
                    lg:-top-52 lg:-left-8 lg:w-72 lg:p-5
                    rounded-xl sm:rounded-2xl border border-cyan-400/20 bg-[#08121A]/90 backdrop-blur-xl pointer-events-none origin-bottom-left'
                  style={{
                    boxShadow:
                      '0 0 40px rgba(8, 145, 178, 0.15), inset 0 0 20px rgba(8, 145, 178, 0.05)',
                  }}
                >
                  <div className='flex justify-between items-center mb-2 sm:mb-3 border-b border-white/5 pb-1.5 sm:pb-2'>
                    <span className='text-cyan-400 font-bold text-sm sm:text-base lg:text-lg tracking-wider font-mono'>
                      LEVEL
                    </span>
                    <div className='flex items-center gap-1.5 sm:gap-2'>
                      {isCompleted && (
                        <span className='flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-500/30'>
                          <svg
                            className='w-2.5 h-2.5 sm:w-3 sm:h-3'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          <span className='hidden xs:inline'>COMPLETED</span>
                          <span className='xs:hidden'>✓</span>
                        </span>
                      )}
                      <span className='text-white font-mono text-lg sm:text-xl lg:text-2xl font-bold bg-cyan-950/50 px-2 sm:px-3 py-0.5 rounded-lg border border-cyan-500/20'>
                        {String(levelNumber).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <p className='text-cyan-100/60 text-[10px] sm:text-xs leading-relaxed font-light line-clamp-2 sm:line-clamp-3'>
                    {levelProgress.level.description}
                  </p>

                  <motion.div
                    className='w-full h-0.5 sm:h-1 bg-gray-800 rounded-full mt-2 sm:mt-3 overflow-hidden'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <motion.div
                      className={`h-full ${isCompleted ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 1.4, duration: 1, ease: 'easeOut' }}
                    />
                  </motion.div>
                </motion.div>
              )}

              {/* Node Wrapper */}
              <div
                className={`relative ${isActive ? 'group-hover:scale-105' : ''} transition-transform duration-300`}
              >
                {isActive && (
                  <div className='absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity' />
                )}
                <div
                  className={
                    isLocked
                      ? 'opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105'
                      : ''
                  }
                >
                  <GameNode
                    active={isActive}
                    locked={isLocked}
                    scale={scale}
                    onClick={
                      isActive
                        ? () => navigate(`/level/${levelProgress.level.id}`)
                        : undefined
                    }
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
