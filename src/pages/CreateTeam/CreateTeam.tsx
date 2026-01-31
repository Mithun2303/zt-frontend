import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import teamService from '../../services/team.service';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: '',
    teamMember2Email: '',
    teamMember3Email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.teamName.trim()) {
      setError('Team Name is required');
      toast.error('Team Name is required');
      setIsLoading(false);
      return;
    }

    try {
      await teamService.createTeam({
        teamName: formData.teamName,
        teamMember2Email: formData.teamMember2Email || undefined,
        teamMember3Email: formData.teamMember3Email || undefined,
      });

      toast.success('Team created successfully!');

      // Navigate to home page after successful team creation
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Failed to create team. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)' },
    tap: { scale: 0.95 },
  };

  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-100px)] px-4 py-8 relative'>
      <motion.div
        className='w-full max-w-lg rounded-3xl border border-white/20 bg-white/5 p-6 sm:p-10 shadow-2xl backdrop-blur-md relative z-10'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        transition={{ duration: 0.8, ease: 'easeOut', staggerChildren: 0.1 }}
        whileHover={{ boxShadow: '0 0 50px rgba(34, 211, 238, 0.2)' }}
      >
        <motion.div
          className='mb-8 flex flex-col items-center text-center'
          variants={itemVariants}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className='w-20 h-20 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Users className='w-10 h-10 text-cyan-400' />
          </motion.div>
          <motion.h1
            className='text-3xl font-bold tracking-wide text-cyan-300 drop-shadow-lg'
            variants={itemVariants}
          >
            Create Your Team
          </motion.h1>
          <motion.p
            className='mt-2 text-sm text-cyan-100/80 max-w-xs'
            variants={itemVariants}
          >
            Assemble your squad to compete in ZeroTrace challenges.
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className='space-y-6'
          variants={containerVariants}
        >
          <AnimatePresence>
            {error && (
              <motion.div
                className='rounded-lg bg-red-500/20 p-3 text-sm text-red-300 border border-red-500/30 flex items-center gap-2'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div className='space-y-2' variants={itemVariants}>
            <motion.label
              htmlFor='teamName'
              className='block text-sm font-medium text-cyan-100 pl-1'
            >
              Team Name <span className='text-red-400'>*</span>
            </motion.label>
            <motion.div
              className='relative'
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Users className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400' />
              <motion.input
                id='teamName'
                name='teamName'
                type='text'
                value={formData.teamName}
                onChange={handleInputChange}
                required
                placeholder='Enter a unique team name'
                className='block w-full rounded-xl border border-white/20 bg-black/40 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20'
                whileFocus={{
                  scale: 1.01,
                  boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                }}
              />
            </motion.div>
          </motion.div>

          {/* Divider */}
          <div className='relative py-2'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-white/10' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-[#0D202E] px-2 text-cyan-500/70 font-mono tracking-wider'>
                Add Members (Optional)
              </span>
            </div>
          </div>

          <motion.div className='space-y-2' variants={itemVariants}>
            <motion.label
              htmlFor='teamMember2Email'
              className='block text-sm font-medium text-cyan-100 pl-1'
            >
              Team Member 2 Email
            </motion.label>
            <motion.div
              className='relative'
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Mail className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-500/70' />
              <motion.input
                id='teamMember2Email'
                name='teamMember2Email'
                type='email'
                value={formData.teamMember2Email}
                onChange={handleInputChange}
                placeholder='teammate2@example.com'
                className='block w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-500/50 focus:ring-cyan-500/30'
                whileFocus={{
                  scale: 1.01,
                  borderColor: 'rgba(34, 211, 238, 0.5)',
                }}
              />
            </motion.div>
          </motion.div>

          <motion.div className='space-y-2' variants={itemVariants}>
            <motion.label
              htmlFor='teamMember3Email'
              className='block text-sm font-medium text-cyan-100 pl-1'
            >
              Team Member 3 Email
            </motion.label>
            <motion.div
              className='relative'
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Mail className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-500/70' />
              <motion.input
                id='teamMember3Email'
                name='teamMember3Email'
                type='email'
                value={formData.teamMember3Email}
                onChange={handleInputChange}
                placeholder='teammate3@example.com'
                className='block w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-500/50 focus:ring-cyan-500/30'
                whileFocus={{
                  scale: 1.01,
                  borderColor: 'rgba(34, 211, 238, 0.5)',
                }}
              />
            </motion.div>
          </motion.div>

          <motion.button
            type='submit'
            disabled={isLoading}
            className='mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 px-4 py-3.5 text-sm font-bold tracking-wide text-slate-950 transition-all duration-300 hover:from-cyan-300 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed group'
            variants={buttonVariants}
            initial='idle'
            whileHover='hover'
            whileTap='tap'
          >
            <AnimatePresence mode='wait'>
              {isLoading ? (
                <motion.div
                  key='loading'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className='flex items-center'
                >
                  <motion.div
                    className='mr-2 h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent'
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  Creating Team...
                </motion.div>
              ) : (
                <motion.span
                  key='create'
                  className='flex items-center gap-2'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Create Team
                  <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default CreateTeam;
