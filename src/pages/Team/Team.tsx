import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaShieldAlt,
  FaEnvelope,
  FaIdCard,
  FaUserCircle,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { useTeam } from '@/context/TeamContext';
import BackButton from '@/components/BackButton';

const Team = () => {
  const { teamInfo, loading, error } = useTeam();

  if (loading) {
    return (
      <div className='w-full min-h-[80vh] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin' />
          <p className='text-cyan-400 font-mono tracking-wider'>
            LOADING TEAM DATA...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full min-h-[80vh] flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-400 font-mono text-lg'>{error}</p>
          <Link
            to='/'
            className='mt-4 inline-block text-cyan-400 hover:text-cyan-300 transition-colors'
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full text-white flex flex-col items-center justify-start p-4 min-h-[80vh]'>
      <div className='z-10 w-full max-w-4xl'>
        {/* Header Section with Responsive Back Button */}
        <div className='flex items-center mb-8 gap-4'>
          <BackButton to='/' />
          <div className='flex-1'>
            <h1 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-mono uppercase tracking-tight'>
              Team Profile
            </h1>
          </div>
        </div>

        {/* Team Name Card */}
        <div className='relative bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl mb-8 overflow-hidden'>
          {/* Decorative elements */}
          <div className='absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-cyan-500/50 rounded-tl-2xl pointer-events-none' />
          <div className='absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-cyan-500/50 rounded-br-2xl pointer-events-none' />

          {/* Glowing background effect */}
          <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none' />

          <div className='relative flex items-center gap-6'>
            {/* Team Icon */}
            <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]'>
              <FaShieldAlt className='text-cyan-400 text-4xl' />
            </div>

            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-2'>
                <HiSparkles className='text-yellow-400 text-sm' />
                <span className='text-xs text-cyan-400/60 font-mono tracking-widest uppercase'>
                  Team Name
                </span>
              </div>
              <h2 className='text-3xl font-bold text-white font-mono tracking-wider'>
                {teamInfo?.teamName || 'Unknown Team'}
              </h2>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className='relative bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl'>
          {/* Decorative corner accents */}
          <div className='absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-cyan-500/50 rounded-tl-2xl pointer-events-none' />
          <div className='absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-cyan-500/50 rounded-br-2xl pointer-events-none' />

          {/* Section Header */}
          <div className='flex items-center gap-3 mb-8'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center'>
              <FaUsers className='text-cyan-400 text-lg' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-white font-mono uppercase tracking-tight'>
                Team Members
              </h3>
              <p className='text-sm text-gray-400'>
                {teamInfo?.members?.length || 0} active member
                {teamInfo?.members?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Members Grid */}
          <div className='grid gap-4'>
            {teamInfo?.members?.map((member, index) => (
              <div
                key={member.rollNumber}
                className='group relative bg-black/40 rounded-xl p-6 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]'
              >
                {/* Member number badge */}
                <div className='absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-black shadow-lg'>
                  {index + 1}
                </div>

                <div className='flex items-start gap-4'>
                  {/* Avatar */}
                  <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/30 transition-colors'>
                    <FaUserCircle className='text-3xl text-gray-500 group-hover:text-cyan-400 transition-colors' />
                  </div>

                  {/* Member Info */}
                  <div className='flex-1 min-w-0'>
                    {/* Name */}
                    <h4 className='text-lg font-bold text-white font-mono tracking-wide mb-3 truncate'>
                      {member.name}
                    </h4>

                    {/* Details Grid */}
                    <div className='grid sm:grid-cols-2 gap-3'>
                      {/* Roll Number */}
                      <div className='flex items-center gap-2 text-sm'>
                        <div className='w-8 h-8 rounded-lg bg-zinc-800/80 border border-white/5 flex items-center justify-center flex-shrink-0'>
                          <FaIdCard className='text-cyan-400 text-xs' />
                        </div>
                        <div className='min-w-0'>
                          <p className='text-gray-500 text-xs uppercase tracking-wider'>
                            Roll No.
                          </p>
                          <p className='text-gray-300 font-mono truncate'>
                            {member.rollNumber}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className='flex items-center gap-2 text-sm'>
                        <div className='w-8 h-8 rounded-lg bg-zinc-800/80 border border-white/5 flex items-center justify-center flex-shrink-0'>
                          <FaEnvelope className='text-cyan-400 text-xs' />
                        </div>
                        <div className='min-w-0'>
                          <p className='text-gray-500 text-xs uppercase tracking-wider'>
                            Email
                          </p>
                          <p className='text-gray-300 font-mono truncate'>
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' />
              </div>
            ))}

            {/* Empty State */}
            {(!teamInfo?.members || teamInfo.members.length === 0) && (
              <div className='text-center py-12'>
                <FaUsers className='text-4xl text-gray-600 mx-auto mb-4' />
                <p className='text-gray-400 font-mono'>No team members found</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className='mt-8 flex justify-center'>
          <div className='inline-flex items-center gap-4 bg-black/40 px-6 py-3 rounded-full border border-white/5'>
            <span className='text-gray-400 text-sm'>Team Status:</span>
            <span className='flex items-center gap-2 text-green-400 text-sm font-mono'>
              <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
