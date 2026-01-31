import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import teamService from '@/services/team.service';
import type { TeamInfo } from '@/services/team.service';

interface TeamContextType {
  teamInfo: TeamInfo | null;
  score: number;
  totalScore: number;
  loading: boolean;
  error: string | null;
  refreshTeamData: () => Promise<void>;
  refreshScore: () => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

interface TeamProviderProps {
  children: ReactNode;
}

export const TeamProvider = ({ children }: TeamProviderProps) => {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTeamData = useCallback(async () => {
    try {
      const data = await teamService.getTeamInfo();
      setTeamInfo(data);
      // Also update localStorage for consistency
      if (data?.teamName) {
        localStorage.setItem('teamName', data.teamName);
      }
    } catch (err) {
      console.error('Failed to fetch team info:', err);
      setError('Failed to load team data');
    }
  }, []);

  const refreshScore = useCallback(async () => {
    try {
      const [scoreData, totalScoreData] = await Promise.all([
        teamService.getTeamScore(),
        teamService.getTotalScore(),
      ]);
      setScore(scoreData.pointsEarned || 0);
      setTotalScore(totalScoreData.points || 0);
    } catch (err) {
      console.error('Failed to fetch scores:', err);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([refreshTeamData(), refreshScore()]);
    } finally {
      setLoading(false);
    }
  }, [refreshTeamData, refreshScore]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const value: TeamContextType = {
    teamInfo,
    score,
    totalScore,
    loading,
    error,
    refreshTeamData,
    refreshScore,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export const useTeam = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

export default TeamContext;
