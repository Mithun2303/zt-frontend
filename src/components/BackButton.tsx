import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';

interface BackButtonProps {
  to?: string; // Optional: navigate to specific path, otherwise go back
  className?: string;
}

const BackButton = ({ to, className = '' }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-center
        w-10 h-10 sm:w-12 sm:h-12
        rounded-xl
        bg-[#0A1A24]/80 backdrop-blur-sm
        border border-cyan-500/20
        text-gray-400 hover:text-cyan-400
        hover:border-cyan-500/40
        hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]
        transition-all duration-300
        group
        ${className}
      `}
      aria-label='Go back'
    >
      <IoChevronBack className='w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform' />
    </button>
  );
};

export default BackButton;
