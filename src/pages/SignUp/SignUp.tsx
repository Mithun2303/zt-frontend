import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Hash,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../../services/auth.service';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    email: '',
    mobile: '',
    password: '',
    department: '',
    year: 0,
    degree: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFinalLoading, setIsFinalLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || 0 : value,
    }));
  };

  const validateStep = (step: number): boolean => {
    setError('');
    switch (step) {
      case 1: {
        if (!formData.rollNumber || !formData.name || !formData.email) {
          setError('Please fill in all required fields in Step 1');
          toast.error('Please fill in all required fields in Step 1');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Please enter a valid email address');
          toast.error('Please enter a valid email address');
          return false;
        }
        return true;
      }
      case 2: {
        if (!formData.mobile || !formData.password) {
          setError('Please fill in all required fields in Step 2');
          toast.error('Please fill in all required fields in Step 2');
          return false;
        }
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(formData.mobile)) {
          setError('Please enter a valid 10-digit mobile number');
          toast.error('Please enter a valid 10-digit mobile number');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          toast.error('Password must be at least 8 characters long');
          return false;
        }
        return true;
      }
      case 3: {
        if (!formData.department || formData.year === 0 || !formData.degree) {
          setError('Please fill in all required fields in Step 3');
          toast.error('Please fill in all required fields in Step 3');
          return false;
        }
        return true;
      }
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsFinalLoading(true);
    setCompletedSteps((prev) => [...prev, currentStep]);

    try {
      // Show loading toast
      toast.loading('Creating your account...', { id: 'signup-process' });

      // Call the register API
      await authService.register(formData);

      // Dismiss loading toast
      toast.dismiss('signup-process');

      // Show success message
      toast(
        'Account created successfully! Please check your email to verify your account.',
        {
          duration: 5000,
          style: {
            background: '#22d3ee',
            color: '#0f172a',
            fontWeight: 'bold',
            fontSize: '16px',
          },
          icon: '✅',
        },
      );

      // Reset form
      setFormData({
        rollNumber: '',
        name: '',
        email: '',
        mobile: '',
        password: '',
        department: '',
        year: 0,
        degree: '',
      });
      setCurrentStep(1);
      setCompletedSteps([]);

      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate('/verify-email', {
          state: {
            email: formData.email,
            rollNumber: formData.rollNumber,
          },
        });
      }, 2000);
    } catch (err: any) {
      toast.dismiss('signup-process');
      const errorMessage =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsFinalLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
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

      <div className='relative z-10 flex items-center justify-center min-h-screen px-4 py-2'>
        <motion.div
          className='w-full max-w-lg rounded-3xl border border-white/20 bg-white/5 p-4 sm:p-6 shadow-2xl backdrop-blur-md'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.8, ease: 'easeOut', staggerChildren: 0.1 }}
          whileHover={{ boxShadow: '0 0 50px rgba(34, 211, 238, 0.2)' }}
        >
          <motion.div className='mb-4 flex flex-col items-center text-center'>
            <motion.div className='relative mb-2'>
              <motion.img
                src='/logo.jpeg'
                alt='ZeroTrace logo'
                className='h-12 w-12 rounded-full border border-cyan-400/60 object-cover shadow-lg'
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.h1 className='text-2xl font-bold tracking-wide text-cyan-300 drop-shadow-lg'>
              Join ZeroTrace
            </motion.h1>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div className='mb-4'>
            <div className='flex items-center justify-center space-x-3'>
              {[1, 2, 3].map((step) => (
                <div key={step} className='flex items-center'>
                  <motion.div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                      completedSteps.includes(step)
                        ? 'border-green-400 bg-green-400/20 text-green-300'
                        : currentStep === step
                          ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                          : 'border-white/30 bg-black/30 text-white/50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      scale: currentStep === step ? 1.1 : 1,
                    }}
                  >
                    {completedSteps.includes(step) ? (
                      <motion.svg
                        className='h-5 w-5'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </motion.svg>
                    ) : (
                      step
                    )}
                  </motion.div>
                  {step < 3 && (
                    <motion.div
                      className={`mx-2 h-1 w-12 rounded transition-all duration-500 ${
                        completedSteps.includes(step)
                          ? 'bg-green-400'
                          : 'bg-white/20'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: completedSteps.includes(step) ? 1 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              ))}
            </div>
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

            {/* Step 1: Basic Information */}
            <AnimatePresence>
              {currentStep === 1 && (
                <motion.div
                  key='step1'
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className='space-y-3'
                >
                  <motion.div className='space-y-1'>
                    <motion.label
                      htmlFor='rollNumber'
                      className='block text-sm font-medium text-cyan-100'
                      whileHover={{ color: '#22d3ee' }}
                    >
                      Roll Number *
                    </motion.label>
                    <motion.div
                      className='relative'
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Hash className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400' />
                      <motion.input
                        id='rollNumber'
                        name='rollNumber'
                        type='text'
                        value={formData.rollNumber}
                        onChange={handleInputChange}
                        required
                        placeholder='e.g., 22PCXX'
                        className='block w-full rounded-xl border border-white/20 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/50 outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20'
                        whileFocus={{
                          scale: 1.01,
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                        }}
                        transition={{ duration: 0.15 }}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div className='space-y-1'>
                    <motion.label
                      htmlFor='name'
                      className='block text-sm font-medium text-cyan-100'
                      whileHover={{ color: '#22d3ee' }}
                    >
                      Full Name *
                    </motion.label>
                    <motion.div
                      className='relative'
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                    >
                      <User className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400' />
                      <motion.input
                        id='name'
                        name='name'
                        type='text'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder='Enter your full name'
                        className='block w-full rounded-xl border border-white/20 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/50 outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20'
                        whileFocus={{
                          scale: 1.01,
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                        }}
                        transition={{ duration: 0.15 }}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div className='space-y-1'>
                    <motion.label
                      htmlFor='email'
                      className='block text-sm font-medium text-cyan-100'
                      whileHover={{ color: '#22d3ee' }}
                    >
                      Email Address *
                    </motion.label>
                    <motion.div
                      className='relative'
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Mail className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400' />
                      <motion.input
                        id='email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder='your_rollno@psgtech.ac.in'
                        className='block w-full rounded-xl border border-white/20 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/50 outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20'
                        whileFocus={{
                          scale: 1.01,
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                        }}
                        transition={{ duration: 0.15 }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 2: Contact & Security */}
            <AnimatePresence>
              {currentStep === 2 && (
                <motion.div
                  key='step2'
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className='space-y-3'
                >
                  <motion.div className='space-y-1'>
                    <motion.label
                      htmlFor='mobile'
                      className='block text-sm font-medium text-cyan-100'
                      whileHover={{ color: '#22d3ee' }}
                    >
                      Mobile Number *
                    </motion.label>
                    <motion.div
                      className='relative'
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Phone className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400' />
                      <motion.input
                        id='mobile'
                        name='mobile'
                        type='tel'
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        placeholder='10-digit mobile number'
                        className='block w-full rounded-xl border border-white/20 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/50 outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20'
                        whileFocus={{
                          scale: 1.01,
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                        }}
                        transition={{ duration: 0.15 }}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div className='space-y-1'>
                    <motion.label
                      htmlFor='password'
                      className='block text-sm font-medium text-cyan-100'
                      whileHover={{ color: '#22d3ee' }}
                    >
                      Password *
                    </motion.label>
                    <motion.div
                      className='relative'
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Lock className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400' />
                      <motion.input
                        id='password'
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder='Minimum 8 characters'
                        className='block w-full rounded-xl border border-white/20 bg-black/30 pl-10 pr-12 py-3 text-sm text-white placeholder:text-white/50 outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20'
                        whileFocus={{
                          scale: 1.01,
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                        }}
                        transition={{ duration: 0.15 }}
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Academic Details */}
            <AnimatePresence>
              {currentStep === 3 && (
                <motion.div
                  key='step3'
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className='space-y-3'
                >
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <motion.div className='space-y-1'>
                      <motion.label
                        htmlFor='department'
                        className='block text-sm font-medium text-cyan-100'
                        whileHover={{ color: '#22d3ee' }}
                      >
                        Department *
                      </motion.label>
                      <div className='relative'>
                        <motion.select
                          id='department'
                          name='department'
                          value={formData.department}
                          onChange={handleInputChange}
                          required
                          className='block w-full rounded-xl border border-white/20 bg-black/30 pl-4 pr-10 py-3 text-sm text-white outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20 appearance-none'
                          whileFocus={{
                            scale: 1.01,
                            boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                          }}
                          transition={{ duration: 0.15 }}
                        >
                          <option value='' className='bg-black/80'>
                            Select Department
                          </option>
                          <option
                            value='Computer Science'
                            className='bg-black/80'
                          >
                            Computer Science
                          </option>
                          <option
                            value='Information Technology'
                            className='bg-black/80'
                          >
                            Information Technology
                          </option>
                          <option value='Electronics' className='bg-black/80'>
                            Electronics
                          </option>
                          <option value='Mechanical' className='bg-black/80'>
                            Mechanical
                          </option>
                          <option value='Civil' className='bg-black/80'>
                            Civil
                          </option>
                          <option value='Electrical' className='bg-black/80'>
                            Electrical
                          </option>
                          <option value='Other' className='bg-black/80'>
                            Other
                          </option>
                        </motion.select>
                        <ChevronDown className='absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400 pointer-events-none' />
                      </div>
                    </motion.div>

                    <motion.div className='space-y-1'>
                      <motion.label
                        htmlFor='year'
                        className='block text-sm font-medium text-cyan-100'
                        whileHover={{ color: '#22d3ee' }}
                      >
                        Year *
                      </motion.label>
                      <div className='relative'>
                        <motion.select
                          id='year'
                          name='year'
                          value={formData.year}
                          onChange={handleInputChange}
                          required
                          className='block w-full rounded-xl border border-white/20 bg-black/30 pl-4 pr-10 py-3 text-sm text-white outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20 appearance-none'
                          whileFocus={{
                            scale: 1.01,
                            boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                          }}
                          transition={{ duration: 0.15 }}
                        >
                          <option value='' className='bg-black/80'>
                            Select Year
                          </option>
                          <option value='1' className='bg-black/80'>
                            1st Year
                          </option>
                          <option value='2' className='bg-black/80'>
                            2nd Year
                          </option>
                          <option value='3' className='bg-black/80'>
                            3rd Year
                          </option>
                          <option value='4' className='bg-black/80'>
                            4th Year
                          </option>
                        </motion.select>
                        <ChevronDown className='absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400 pointer-events-none' />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div className='space-y-1'>
                    <motion.label
                      htmlFor='degree'
                      className='block text-sm font-medium text-cyan-100'
                      whileHover={{ color: '#22d3ee' }}
                    >
                      Degree Program *
                    </motion.label>
                    <div className='relative'>
                      <motion.select
                        id='degree'
                        name='degree'
                        value={formData.degree}
                        onChange={handleInputChange}
                        required
                        className='block w-full rounded-xl border border-white/20 bg-black/30 pl-4 pr-10 py-3 text-sm text-white outline-none ring-1 ring-transparent transition-all duration-300 focus:border-cyan-400 focus:ring-cyan-400/60 focus:shadow-lg focus:shadow-cyan-500/20 appearance-none'
                        whileFocus={{
                          scale: 1.01,
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                        }}
                        transition={{ duration: 0.15 }}
                      >
                        <option value='' className='bg-black/80'>
                          Select Degree
                        </option>
                        <option value='B.Tech' className='bg-black/80'>
                          B.Tech
                        </option>
                        <option value='B.E.' className='bg-black/80'>
                          B.E.
                        </option>
                        <option value='B.Sc' className='bg-black/80'>
                          B.Sc
                        </option>
                        <option value='M.Tech' className='bg-black/80'>
                          M.Tech
                        </option>
                        <option value='M.E.' className='bg-black/80'>
                          M.E.
                        </option>
                        <option value='M.Sc' className='bg-black/80'>
                          M.Sc
                        </option>
                        <option value='PhD' className='bg-black/80'>
                          PhD
                        </option>
                        <option value='Other' className='bg-black/80'>
                          Other
                        </option>
                      </motion.select>
                      <ChevronDown className='absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400 pointer-events-none' />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div className='flex gap-3 pt-3'>
              {currentStep > 1 && (
                <motion.button
                  type='button'
                  onClick={handlePrevStep}
                  disabled={isFinalLoading}
                  className='flex-1 rounded-xl bg-gray-600/50 px-4 py-3 text-sm font-semibold text-gray-200 shadow-lg transition-all duration-300 hover:bg-gray-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed'
                  variants={buttonVariants}
                  initial='idle'
                  whileHover='hover'
                  whileTap='tap'
                >
                  Previous
                </motion.button>
              )}

              {currentStep < 3 ? (
                <motion.button
                  type='button'
                  onClick={handleNextStep}
                  disabled={isFinalLoading}
                  className='flex-1 rounded-xl bg-linear-to-r from-cyan-400 to-cyan-600 px-4 py-3 text-sm font-semibold tracking-wide text-slate-950 shadow-lg shadow-cyan-500/40 transition-all duration-300 hover:from-cyan-300 hover:to-cyan-500 hover:shadow-cyan-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed'
                  variants={buttonVariants}
                  initial='idle'
                  whileHover='hover'
                  whileTap='tap'
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  type='submit'
                  disabled={isFinalLoading}
                  className='flex-1 rounded-xl bg-linear-to-r from-cyan-400 to-cyan-600 px-4 py-3 text-sm font-semibold tracking-wide text-slate-950 shadow-lg shadow-cyan-500/40 transition-all duration-300 hover:from-cyan-300 hover:to-cyan-500 hover:shadow-cyan-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed'
                  variants={buttonVariants}
                  initial='idle'
                  whileHover='hover'
                  whileTap='tap'
                >
                  <AnimatePresence mode='wait'>
                    {isFinalLoading ? (
                      <motion.div
                        key='final-loading'
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className='flex items-center justify-center'
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
                        Creating Account...
                      </motion.div>
                    ) : (
                      <motion.span
                        key='create-account'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Create Student Account
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </motion.div>
          </motion.form>

          <motion.div className='mt-3 text-center'>
            <motion.p
              className='text-xs text-cyan-200/60'
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Already have an account?{' '}
              <motion.a
                href='/login'
                className='text-cyan-300 hover:text-cyan-200 underline'
                whileHover={{ scale: 1.05 }}
              >
                Sign In
              </motion.a>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
