import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { SlLock } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import authService from '../../services/auth.service';
import userProgressService from '../../services/userProgress.service';
import { setAuthToken } from '@/services';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login({ email, password });

      console.table(response);
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response));
      setAuthToken(response?.accessToken);
      toast.success('Login successful! Welcome to ZeroTrace.');

      // Check if user needs to create a team by calling levels API
      try {
        await userProgressService.getLevels();
        // If successful (no 307), navigate to home page
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } catch (levelsError: any) {
        // Check if the error is a 307 redirect (Create Team required)
        if (
          levelsError.status === 307 ||
          levelsError.message === 'Create Team'
        ) {
          toast('Please create or join a team to continue.', {
            icon: '👥',
            duration: 3000,
          });
          setTimeout(() => {
            navigate('/create-team');
          }, 1000);
        } else {
          // Other error, still navigate to home (ProtectedRoute will handle further checks)
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';
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
    <div className='relative min-h-screen w-full overflow-hidden'>
      <video
        className='absolute inset-0 h-full w-full object-cover'
        src='/bg.mp4'
        autoPlay
        loop
        muted
        playsInline
      />
      <div className='absolute inset-0 bg-linear-to-br from-black/60 via-cyan-900/20 to-black/60'></div>

      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          className='absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-cyan-400/30'
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute top-3/4 right-1/4 h-1 w-1 rounded-full bg-cyan-300/40'
          animate={{
            scale: [1, 2, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className='absolute top-1/2 left-1/2 h-3 w-3 rounded-full bg-cyan-500/20'
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <div className='relative z-10 flex items-center justify-center min-h-screen px-4 py-4 sm:py-8'>
        <motion.div
          className='w-full max-w-md rounded-3xl border border-white/20 bg-white/5 p-6 sm:p-8 shadow-2xl backdrop-blur-md'
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
            <motion.div className='relative'>
              <motion.img
                src='/logo.jpeg'
                alt='ZeroTrace logo'
                className='h-16 w-16 rounded-full border border-cyan-400/60 object-cover shadow-lg'
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.h1
              className='text-3xl font-bold tracking-wide text-cyan-300 drop-shadow-lg'
              variants={itemVariants}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              ZeroTrace
            </motion.h1>
            <motion.p
              className='mt-2 text-sm text-cyan-100/80'
              variants={itemVariants}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              Advanced Threat Intelligence Platform
            </motion.p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className='space-y-6'
            variants={containerVariants}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
              staggerChildren: 0.1,
            }}
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  className='rounded-lg bg-red-500/20 p-3 text-sm text-red-300 border border-red-500/30'
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className='space-y-2'
              variants={itemVariants}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.label
                htmlFor='email'
                className='block text-sm font-medium text-cyan-100'
                whileHover={{ color: '#22d3ee' }}
              >
                Email Address
              </motion.label>
              <motion.div
                className='relative'
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400' />
                <motion.input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder='your_rollno@psgtech.ac.in'
                  className='block w-full rounded-xl border border-white/20 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/50 outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20'
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className='space-y-2'
              variants={itemVariants}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.label
                htmlFor='password'
                className='block text-sm font-medium text-cyan-100'
                whileHover={{ color: '#22d3ee' }}
              >
                Password
              </motion.label>
              <motion.div
                className='relative'
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <SlLock className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400' />
                <motion.input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder='••••••••'
                  className='block w-full rounded-xl border border-white/20 bg-black/30 pl-10 pr-12 py-3 text-sm text-white placeholder:text-white/50 outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20'
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              className='flex items-center justify-end'
              variants={itemVariants}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* <motion.a
                href='/forgot-password'
                className='text-sm text-cyan-300 hover:text-cyan-200 transition-colors underline'
                whileHover={{ scale: 1.05, color: '#67e8f9' }}
                whileTap={{ scale: 0.95 }}
              >
                Forgot password?
              </motion.a> */}
            </motion.div>

            <motion.button
              type='submit'
              disabled={isLoading}
              className='mt-2 inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-cyan-400 to-cyan-600 px-4 py-3 text-sm font-semibold tracking-wide text-slate-950 transition-all duration-300 hover:from-cyan-300 hover:to-cyan-500 hover:shadow-cyan-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed'
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
                    Authenticating...
                  </motion.div>
                ) : (
                  <motion.span
                    key='signin'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>

          <motion.div
            className='mt-6 text-center'
            variants={itemVariants}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.p
              className='text-xs text-cyan-200/60'
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Don't have an account?{' '}
              <motion.a
                href='/signup'
                className='text-cyan-300 hover:text-cyan-200 underline'
                whileHover={{ scale: 1.05 }}
              >
                Sign Up
              </motion.a>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
