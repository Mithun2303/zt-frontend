import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Simulate password reset email sending
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password reset email sent successfully!', {
        duration: 4000,
        style: {
          background: '#22d3ee',
          color: '#0f172a',
          fontWeight: 'bold',
        },
        icon: '📧',
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }, 2000);
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

      <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>
        <motion.div
          className='w-full max-w-md rounded-3xl border border-white/20 bg-white/5 p-8 shadow-2xl backdrop-blur-md'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.8, ease: 'easeOut', staggerChildren: 0.1 }}
          whileHover={{ boxShadow: '0 0 50px rgba(34, 211, 238, 0.2)' }}
        >
          {/* Back to Login Button */}
          <motion.button
            onClick={() => navigate('/login')}
            className='mb-6 flex items-center text-white hover:text-cyan-200 transition-colors'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Sign In
          </motion.button>

          <motion.div className='mb-8 flex flex-col items-center text-center'>
            <motion.div className='relative mb-4'>
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
              Set New Password
            </motion.h1>
            <motion.p
              className='mt-2 text-sm text-cyan-100/80'
              variants={itemVariants}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              Enter your email to receive instructions
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

            <motion.button
              type='submit'
              disabled={isLoading}
              className='mt-2 inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-cyan-400 to-cyan-600 px-4 py-3 text-sm font-semibold tracking-wide text-slate-950 shadow-lg shadow-cyan-500/40 transition-all duration-300 hover:from-cyan-300 hover:to-cyan-500 hover:shadow-cyan-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed'
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
                    Sending Reset Email...
                  </motion.div>
                ) : (
                  <motion.span
                    key='send'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Send Email
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
