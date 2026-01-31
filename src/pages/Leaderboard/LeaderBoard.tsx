import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { teamService } from '@/services';

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const UPDATE_INTERVAL = 60000; // 1 minute

  const [nextUpdateIn, setNextUpdateIn] = useState(UPDATE_INTERVAL / 1000);
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const [sortedData, setSortedData] = useState([]);
  useEffect(() => {
    const sorted = [...data].sort(
      (a: any, b: any) => b.totalPoints - a.totalPoints,
    );
    setSortedData(sorted);
  }, [data]);

  useEffect(() => {
    getLeaderBoard();
    const updateLeaderboard = () => {
      getLeaderBoard();
      setNextUpdateIn(UPDATE_INTERVAL / 1000);
    };
    const intervalId = setInterval(() => {
      updateLeaderboard();
    }, UPDATE_INTERVAL);

    const countdownId = setInterval(() => {
      setNextUpdateIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, []);

  const getLeaderBoard = async () => {
    const data = await teamService.getLeaderboard();
    console.table(data);
    setData(data);
  };
  return (
    <div className='relative min-h-screen w-full overflow-hidden'>
      {/* Background */}
      <video
        className='absolute inset-0 h-full w-full object-cover'
        src='/bg.mp4'
        autoPlay
        loop
        muted
        playsInline
      />
      <div className='absolute inset-0 bg-linear-to-br from-black/70 via-cyan-900/30 to-black/70' />

      {/* Page Content */}
      <div className='relative z-10 min-h-screen px-6 py-10'>
        {/* Header */}
        <motion.div
          className='mb-10 text-center'
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className='text-4xl font-extrabold tracking-wide text-cyan-300 drop-shadow-lg'>
            🏆 Leaderboard
          </h1>
          <p className='mt-2 text-sm text-cyan-100/70'>
            ZeroTrace — Live Team Rankings
          </p>
        </motion.div>
        <motion.div
          className='mt-2 text-xs text-cyan-200/70'
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Next update in{' '}
          <span className='font-mono text-cyan-300'>
            {formatTime(nextUpdateIn)}
          </span>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          className='relative mx-auto w-full max-w-7xl rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md shadow-2xl'
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <table className='w-full'>
            <thead className='bg-black/40'>
              <tr>
                <th className='px-6 py-4 text-left text-xs uppercase tracking-wider text-cyan-200'>
                  Rank
                </th>
                <th className='px-6 py-4 text-left text-xs uppercase tracking-wider text-cyan-200'>
                  Team
                </th>
                <th className='px-6 py-4 text-right text-xs uppercase tracking-wider text-cyan-200'>
                  Points
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedData.map((team: any, index) => (
                <motion.tr
                  key={team.teamId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className='border-t border-white/10 hover:bg-cyan-500/5'
                >
                  <td className='px-6 py-5 text-lg font-bold text-cyan-300'>
                    #{index + 1}
                  </td>

                  <td className='px-6 py-5 text-white font-medium'>
                    {team.teamName}
                  </td>

                  <td className='px-6 py-5 text-right text-lg font-extrabold text-cyan-400'>
                    {team.totalPoints}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
