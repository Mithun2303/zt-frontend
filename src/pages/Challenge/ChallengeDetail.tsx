import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Flag, Lock, Unlock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { userProgressService } from '@/services';
import type {
  Challenge,
  LevelChallengeResponse,
} from '@/services/userProgress.service';
import toast from 'react-hot-toast';
import { useTeam } from '@/context/TeamContext';

interface HintData {
  id: string;
  description: string | null;
  pointToReduce: number;
  used: boolean;
}

const ChallengeDetail = () => {
  const navigate = useNavigate();
  const { levelId, challengeId } = useParams<{
    levelId: string;
    challengeId: string;
  }>();
  const { refreshScore } = useTeam();
  const [activeHint, setActiveHint] = useState(1);
  const [flag, setFlag] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  // Track hints that have been unlocked in this session
  const [unlockedHintIds, setUnlockedHintIds] = useState<Set<string>>(
    new Set(),
  );
  const [unlockingHint, setUnlockingHint] = useState<string | null>(null);

  useEffect(() => {
    if (levelId && challengeId) {
      fetchChallengeData();
    }
  }, [levelId, challengeId]);

  const fetchChallengeData = async () => {
    if (!levelId || !challengeId) return;

    setLoading(true);
    try {
      const data = await userProgressService.getLevel(levelId);
      // Find the specific challenge from the level data
      const challengeItem = data.find(
        (item: LevelChallengeResponse) =>
          item.challengeId === challengeId || item.challenge.id === challengeId,
      );

      if (challengeItem) {
        setChallenge({
          id: challengeItem.challenge.id,
          title: challengeItem.challenge.title,
          description: challengeItem.challenge.description,
          category: challengeItem.challenge.category,
          difficulty: challengeItem.challenge.difficulty,
          points: challengeItem.challenge.points,
          levelId: challengeItem.challenge.level?.id || levelId,
          isSolved: challengeItem.isSolved,
          resource: challengeItem.challenge.resource || [],
          hint: challengeItem.challenge.hint || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
      toast.error('Failed to load challenge details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFlag = async () => {
    if (!flag.trim() || !challengeId || !levelId) {
      toast.error('Please enter a flag');
      return;
    }

    setSubmitting(true);
    try {
      const response = await userProgressService.solveChallenge({
        levelId,
        challengeId,
        answer: flag,
      });
      console.table(response);
      // Check status code: 201 = correct flag, 403 = wrong flag
      if (response.status === 201) {
        toast.success(response.message || 'Correct flag! 🎉');
        if (response.pointsEarned) {
          toast.success(`+${response.pointsEarned} points earned!`);
        }
        // Refresh challenge data to show solved status
        fetchChallengeData();
        // Refresh score in header
        refreshScore();
        setFlag('');
      } else if (response.status === 403) {
        toast.error(response.message || 'Wrong flag! Try again.');
      } else {
        toast.error(response.message || 'Something went wrong. Try again!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit flag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlockHint = async (hintId: string, pointToReduce: number) => {
    if (!levelId || !challengeId) return;

    // Confirm before unlocking
    const confirmed = window.confirm(
      `Unlocking this hint will reduce ${pointToReduce} points from this challenge. Continue?`,
    );
    if (!confirmed) return;

    setUnlockingHint(hintId);
    try {
      await userProgressService.useHint({
        levelId,
        challengeId,
        hintId,
      });

      // Add to unlocked hints set
      setUnlockedHintIds((prev) => new Set(prev).add(hintId));

      toast.success('Hint unlocked!');

      // Refresh challenge data to get the updated hint description and points
      await fetchChallengeData();
      // Refresh score in header (hint usage may affect points)
      refreshScore();
    } catch (error: any) {
      toast.error(error.message || 'Failed to unlock hint');
    } finally {
      setUnlockingHint(null);
    }
  };

  const isHintUnlocked = (hint: HintData) => {
    // Check if hint is already used (from API) or unlocked in this session
    return hint.used || unlockedHintIds.has(hint.id);
  };

  const getHintDescription = (hint: HintData) => {
    // Return description if hint is used (unlocked)
    if (hint.used && hint.description) {
      return hint.description;
    }
    return null;
  };

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

  if (!challenge) {
    return (
      <div className='w-full h-[60vh] flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-400 mb-4'>
            Challenge Not Found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className='text-cyan-400 hover:text-cyan-300 transition-colors'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const hints = challenge.hint || [];
  const resources = challenge.resource || [];

  return (
    <div className='w-full text-white overflow-y-auto pb-10'>
      {/* Responsive Back Button */}
      <div className='fixed left-4 sm:left-6 top-28 sm:top-32 z-40'>
        <BackButton />
      </div>

      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex items-center gap-4 mb-6'>
            <h1 className='text-4xl font-bold text-white'>{challenge.title}</h1>
            {challenge.isSolved && (
              <span className='px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30'>
                ✓ SOLVED
              </span>
            )}
          </div>

          <div className='flex gap-3 mb-10'>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                challenge.difficulty === 'Easy'
                  ? 'bg-green-900/30 text-green-100 border-green-500/20'
                  : challenge.difficulty === 'Medium'
                    ? 'bg-yellow-900/30 text-yellow-100 border-yellow-500/20'
                    : 'bg-red-900/30 text-red-100 border-red-500/20'
              }`}
            >
              {challenge.difficulty}
            </span>
            <span className='px-4 py-1.5 rounded-full bg-[#13232e] text-cyan-500 text-sm font-medium border border-cyan-500/20'>
              {challenge.category}
            </span>
            <span className='px-4 py-1.5 rounded-full bg-[#13232e] text-cyan-400 text-sm font-medium border border-cyan-500/20'>
              {challenge.points} pts
            </span>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Column - Description and Hints */}
            <div className='lg:col-span-2 space-y-8'>
              {/* Description Section */}
              <div className='border-t border-white/10 pt-6'>
                <h2 className='text-2xl font-semibold mb-4'>Description</h2>
                <div className='text-gray-300 leading-relaxed whitespace-pre-line'>
                  {challenge.description}
                </div>
              </div>

              {/* Hints Section */}
              {hints.length > 0 && (
                <div>
                  <h3 className='text-2xl font-semibold mb-4'>Hints</h3>

                  {/* Tabs */}
                  <div className='flex mb-0'>
                    {hints.map((hint: HintData, index: number) => {
                      const hintUnlocked = isHintUnlocked(hint);

                      return (
                        <button
                          key={hint.id || index}
                          onClick={() => setActiveHint(index + 1)}
                          className={`
                            flex-1 py-3 text-center font-medium text-lg rounded-t-lg transition-colors relative flex items-center justify-center gap-2
                            ${
                              activeHint === index + 1
                                ? 'bg-[#1e2329] text-white'
                                : 'text-gray-500 hover:text-gray-300'
                            }
                          `}
                        >
                          {hintUnlocked ? (
                            <Unlock size={16} className='text-cyan-400' />
                          ) : (
                            <Lock size={16} className='text-yellow-500' />
                          )}
                          Hint {index + 1}
                          {activeHint === index + 1 && (
                            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]' />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Hint Content */}
                  <div className='bg-[#1e2329] p-6 rounded-b-lg rounded-tr-lg min-h-[150px]'>
                    {(() => {
                      const currentHint = hints[activeHint - 1] as HintData;
                      if (!currentHint) {
                        return (
                          <div className='text-gray-500 text-center'>
                            No hint available
                          </div>
                        );
                      }

                      const hintDescription = getHintDescription(currentHint);
                      const hintUnlocked = isHintUnlocked(currentHint);
                      const isUnlocking = unlockingHint === currentHint.id;

                      if (hintUnlocked && hintDescription) {
                        // Show unlocked hint content
                        return (
                          <div className='text-gray-300'>
                            <div className='flex items-center gap-2 mb-3 text-cyan-400'>
                              <Unlock size={18} />
                              <span className='text-sm font-medium'>
                                Hint Unlocked
                              </span>
                            </div>
                            <p className='leading-relaxed'>{hintDescription}</p>
                          </div>
                        );
                      }

                      // Show locked hint with unlock button
                      return (
                        <div className='flex flex-col items-center justify-center h-full min-h-[100px] text-center'>
                          <div className='p-4 rounded-full bg-yellow-900/20 mb-4'>
                            <Lock size={32} className='text-yellow-500' />
                          </div>
                          <p className='text-gray-400 mb-2'>
                            This hint is locked
                          </p>
                          <p className='text-sm text-gray-500 mb-4'>
                            Unlocking will reduce{' '}
                            <span className='text-yellow-400 font-semibold'>
                              {currentHint.pointToReduce || 10} points
                            </span>{' '}
                            from this challenge
                          </p>
                          <button
                            onClick={() =>
                              handleUnlockHint(
                                currentHint.id,
                                currentHint.pointToReduce || 10,
                              )
                            }
                            disabled={isUnlocking || challenge.isSolved}
                            className='px-6 py-2.5 rounded-lg bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-500/25'
                          >
                            {isUnlocking ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: 'linear',
                                  }}
                                  className='w-4 h-4 border-2 border-white border-t-transparent rounded-full'
                                />
                                Unlocking...
                              </>
                            ) : (
                              <>
                                <Unlock size={16} />
                                Unlock Hint
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {hints.length === 0 && (
                <div className='bg-[#1e2329] p-6 rounded-lg text-gray-500 text-center'>
                  No hints available for this challenge
                </div>
              )}
            </div>

            {/* Right Column - Resources and Submit */}
            <div className='space-y-8'>
              {/* Resources Section */}
              <div className='bg-[#161b22] border border-white/5 rounded-xl p-6'>
                <h3 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                  <ExternalLink size={20} className='text-cyan-500' />
                  Resources
                </h3>
                <div className='space-y-3'>
                  {resources.length > 0 ? (
                    resources.map((resource: any, i: number) => (
                      <a
                        key={resource.id || i}
                        href={resource.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-between p-3 rounded bg-[#0d1117] border border-white/5 hover:border-cyan-500/30 hover:bg-[#1a202a] transition-all cursor-pointer group'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='p-2 rounded bg-cyan-950/30 text-cyan-400 group-hover:text-cyan-300'>
                            <ExternalLink size={16} />
                          </div>
                          <span className='text-sm text-gray-300 group-hover:text-white truncate max-w-[180px]'>
                            {resource.description || 'Resource'}
                          </span>
                        </div>
                        <span className='text-xs text-cyan-400/60 font-mono uppercase'>
                          OPEN
                        </span>
                      </a>
                    ))
                  ) : (
                    <div className='text-gray-500 text-center py-4'>
                      No resources available
                    </div>
                  )}
                </div>
              </div>

              <div className='border-t border-white/10 my-6' />

              {/* Submit Flag Section */}
              <div>
                <h3 className='text-xl font-semibold mb-4'>Submit Flag</h3>
                <div className='mb-4'>
                  <div className='relative'>
                    <Flag
                      size={18}
                      className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'
                    />
                    <input
                      type='text'
                      value={flag}
                      onChange={(e) => setFlag(e.target.value)}
                      placeholder='ZeroTrace(...)'
                      disabled={challenge.isSolved}
                      className='w-full bg-[#051114] border border-white/10 rounded py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm shadow-inner disabled:opacity-50 disabled:cursor-not-allowed'
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmitFlag}
                  disabled={submitting || challenge.isSolved}
                  className='w-full py-4 rounded bg-[#0f3d46] hover:bg-[#154f59] text-white font-bold tracking-wider transition-all border border-cyan-500/20 shadow-[0_0_15px_rgba(21,79,89,0.3)] hover:shadow-[0_0_25px_rgba(22,213,238,0.2)] disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {submitting
                    ? 'SUBMITTING...'
                    : challenge.isSolved
                      ? 'ALREADY SOLVED'
                      : 'SUBMIT FLAG'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
