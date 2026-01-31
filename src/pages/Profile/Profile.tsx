import { useState, useEffect } from 'react';
import { User, Camera } from 'lucide-react';
import BackButton from '@/components/BackButton';

const Profile = () => {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem('userAvatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='w-full text-white flex flex-col items-center justify-center p-4 min-h-[80vh]'>
      <div className='z-10 w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative'>
        {/* Decorative corner accents */}
        <div className='absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-cyan-500/50 rounded-tl-2xl pointer-events-none' />
        <div className='absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-cyan-500/50 rounded-br-2xl pointer-events-none' />

        <div className='flex items-center mb-8 gap-4'>
          <BackButton to='/' />
          <div className='flex-1'>
            <h1 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-mono uppercase tracking-tight'>
              Profile Settings
            </h1>
          </div>
        </div>

        <div className='flex flex-col items-center gap-6'>
          <div className='relative group'>
            <div className='w-32 h-32 rounded-full overflow-hidden ring-4 ring-black shadow-2xl relative bg-zinc-900 flex items-center justify-center'>
              {avatar ? (
                <img
                  src={avatar}
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              ) : (
                <User className='w-16 h-16 text-zinc-700' />
              )}
            </div>
            <div className='absolute inset-0 rounded-full ring-2 ring-cyan-500/20 pointer-events-none' />

            <label className='absolute bottom-0 right-0 p-3 bg-cyan-600 rounded-full cursor-pointer hover:bg-cyan-500 transition-colors shadow-lg border-4 border-black group-hover:scale-110 active:scale-95'>
              <Camera className='w-5 h-5 text-black' />
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className='text-center space-y-1'>
            <h2 className='text-xl font-bold text-white font-mono'>
              Guest User
            </h2>
            <p className='text-cyan-500/60 text-sm tracking-widest uppercase font-mono'>
              Participant #042
            </p>
          </div>

          <div className='w-full bg-black/40 rounded-xl p-4 border border-white/5 space-y-3'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-zinc-400 font-mono'>
                Current Clearance
              </span>
              <span className='text-sm font-bold text-cyan-400 font-mono'>
                LEVEL 1
              </span>
            </div>
            <div className='w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden'>
              <div className='w-[25%] h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
