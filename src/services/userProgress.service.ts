import axiosInstance, { handleApiError } from './api';

// Types
export interface LevelData {
  id: string;
  description: string;
  challenges: Challenge[];
}

export interface TeamProgress {
  teamId: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  level: LevelData;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  levelId: string;
  isSolved?: boolean;
  resource: any[];
  hint: any[];
}

export interface Hint {
  id: string;
  description: string | null;
  pointToReduce: number;
  used: boolean;
}

// API response type for level challenges
export interface LevelChallengeResponse {
  isSolved: boolean;
  challengeId: string;
  challenge: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    points: number;
    resource: any[];
    hint: any[];
    level: {
      id: string;
    };
  };
}

export interface ChallengeFile {
  id: string;
  name: string;
  url: string;
  type: 'file' | 'link';
}

export interface UseHintDto {
  levelId: string;
  challengeId: string;
  hintId: string;
}

export interface UseHintResponse {
  id: string;
  content: string;
  pointReduction: number;
}

export interface SolveLevelDto {
  levelId: string;
  challengeId: string;
  answer: string;
}

export interface SolveResponse {
  success: boolean;
  message: string;
  pointsEarned?: number;
  nextLevelUnlocked?: boolean;
}

// User Progress Service
class UserProgressService {
  /**
   * Get all levels with progress
   */
  async getLevels(): Promise<TeamProgress[]> {
    try {
      const response = await axiosInstance.get('/user-progress/levels');
      // In case the backend returns 307 as a success status or axios doesn't throw
      if (
        response.status === 307 ||
        (response.data && response.data.status === 307)
      ) {
        throw { status: 307, message: 'Create Team' };
      }
      return response.data;
    } catch (error: any) {
      if (
        (error.response && error.response.status === 307) ||
        (error.response &&
          error.response.data &&
          error.response.data.status === 307)
      ) {
        throw { status: 307, message: 'Create Team' };
      }
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get challenges for a specific level
   */
  async getLevel(levelId: string): Promise<LevelChallengeResponse[]> {
    try {
      const response = await axiosInstance.get(
        `/user-progress/level?levelID=${levelId}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Use a hint for a challenge
   * Returns the hint content and reduces points from the question
   */
  async useHint(hintData: UseHintDto): Promise<UseHintResponse> {
    try {
      const response = await axiosInstance.post(
        '/user-progress/use-hint',
        hintData,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Submit answer for a challenge
   * Returns status 201 for correct flag, 403 for wrong flag
   */
  async solveChallenge(
    solveData: SolveLevelDto,
  ): Promise<SolveResponse & { status: number }> {
    try {
      const response = await axiosInstance.post(
        '/user-progress/solve',
        solveData,
      );
      return { ...response.data, status: response.status };
    } catch (error: any) {
      // Handle 403 as wrong flag (not an error to throw)
      if (error.response && error.response.status === 403) {
        return {
          success: false,
          message: error.response.data?.message || 'Wrong flag!',
          status: 403,
        };
      }
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Onboard teams (admin function)
   */
  async onboardTeams(): Promise<any> {
    try {
      const response = await axiosInstance.post('/user-progress/onboard-teams');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get team leaderboard
   */
  async getLeaderboard(): Promise<any[]> {
    try {
      const response = await axiosInstance.get('/user-progress/leaderboard');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get team score
   */
  async getTeamScore(): Promise<{ score: number; rank: number }> {
    try {
      const response = await axiosInstance.get('/user-progress/team-score');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

export default new UserProgressService();
