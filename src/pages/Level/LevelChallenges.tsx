import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { useEffect, useState, useCallback } from 'react';
import { userProgressService } from '@/services';
import type {
  Challenge,
  LevelChallengeResponse,
} from '@/services/userProgress.service';

// Extract level number from ID (e.g., "ZTLEVEL1" -> 1)
const extractLevelNumber = (levelId: string): number => {
  const match = levelId.match(/\d+$/);
  return match ? parseInt(match[0], 10) : 0;
};

const LevelChallenges = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { levelId } = useParams<{ levelId: string }>();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const levelNumber = levelId ? extractLevelNumber(levelId) : 0;

  const fetchChallenges = useCallback(async () => {
    if (!levelId) return;

    setLoading(true);
    try {
      const data = await userProgressService.getLevel(levelId);
      // Transform the API response to match the Challenge type
      const transformedChallenges: Challenge[] = data.map(
        (item: LevelChallengeResponse) => ({
          id: item.challenge.id,
          title: item.challenge.title,
          description: item.challenge.description,
          category: item.challenge.category,
          difficulty: item.challenge.difficulty,
          points: item.challenge.points,
          levelId: item.challenge.level?.id || levelId,
          isSolved: item.isSolved,
          resource: item.challenge.resource || [],
          hint: item.challenge.hint || [],
        }),
      );
      setChallenges(transformedChallenges);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [levelId]);

  // Re-fetch challenges whenever the user navigates back to this page
  useEffect(() => {
    fetchChallenges();
  }, [location.key, fetchChallenges]);

  // Calculate progress based on solved challenges
  const solvedCount = challenges.filter((c) => c.isSolved).length;
  const progress =
    challenges.length > 0 ? (solvedCount / challenges.length) * 100 : 0;

  if (loading) {
    return (
      <div className='w-full h-[60vh] flex items-center justify-center'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full'
        />
      </div>
    );
  }

  return (
    <div className='w-full text-white overflow-y-auto pb-10'>
      {/* Responsive Back Button */}
      <div className='fixed left-4 sm:left-6 top-28 sm:top-32 z-40'>
        <BackButton to='/' />
      </div>

      {/* Top Navigation & Progress */}
      <div className='w-full bg-[#0D202E]/80 backdrop-blur-md border-b border-white/5'>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-end mb-4'>
            <div className='font-mono text-xs text-gray-400'>
              <span className='text-cyan-400 font-bold'>
                LEVEL {String(levelNumber).padStart(2, '0')}
              </span>{' '}
              PROGRESS
            </div>
          </div>

          {/* Progress Bar */}
          <div className='w-full h-2 bg-gray-800 rounded-full overflow-hidden'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className='h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]'
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='relative z-10 max-w-4xl mx-auto px-6 py-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-10'
        >
          <h1 className='text-3xl font-bold mb-2'>Level {levelNumber}</h1>
          <p className='text-gray-400 max-w-2xl'>
            {challenges.length} challenges available. Complete them all to
            unlock the next level.
          </p>
        </motion.div>

        {challenges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center py-16 text-gray-500'
          >
            <p className='text-lg'>
              No challenges available for this level yet.
            </p>
          </motion.div>
        ) : (
          <div className='grid gap-4'>
            {challenges
              .sort((a, b) => (a.id > b.id ? 1 : -1))
              .map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  onClick={() =>
                    navigate(`/challenge/${challenge.levelId}/${challenge.id}`)
                  }
                  className='group relative bg-[#13232e]/80 hover:bg-[#162a36] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm cursor-pointer'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-1'>
                        <span className='text-xs font-mono text-cyan-500 tracking-wider uppercase'>
                          {challenge.category}
                        </span>
                        {challenge.isSolved && (
                          <span className='text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20'>
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <h3 className='text-xl font-semibold text-white group-hover:text-cyan-100 transition-colors'>
                        {challenge.title}
                      </h3>
                      <p className='text-sm text-gray-500 mt-1 line-clamp-1'>
                        {challenge.description}
                      </p>
                    </div>

                    <div className='flex items-center gap-5'>
                      <span className='text-xs text-cyan-400 font-mono'>
                        +{challenge.points} pts
                      </span>
                      <button
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors border shadow-lg shadow-black/20 ${
                          challenge.difficulty === 'Easy'
                            ? 'bg-green-900/50 hover:bg-green-800/50 text-green-100 border-green-500/20'
                            : challenge.difficulty === 'Medium'
                              ? 'bg-yellow-900/50 hover:bg-yellow-800/50 text-yellow-100 border-yellow-500/20'
                              : 'bg-red-900/50 hover:bg-red-800/50 text-red-100 border-red-500/20'
                        }`}
                      >
                        {challenge.difficulty}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelChallenges;
