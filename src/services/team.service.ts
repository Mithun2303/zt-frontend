import axiosInstance, { handleApiError } from './api';

// Types
export interface CreateTeamDto {
  teamName: string;
  teamMember2Email?: string;
  teamMember3Email?: string;
}

export interface Team {
  id: string;
  teamName: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
}

export interface CreateTeamResponse {
  token: string;
}

export interface TeamInfo {
  teamName: string;
  members: {
    name: string;
    rollNumber: string;
    email: string;
  }[];
}

// Team Service
class TeamService {
  /**
   * Create a new team
   */
  async createTeam(teamData: CreateTeamDto): Promise<CreateTeamResponse> {
    try {
      const response = await axiosInstance.post('/team/create-team', teamData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  async getLeaderboard() {
    try {
      const response = await axiosInstance.get('/team/leaderboard');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
  /**
   * Get team details
   */
  async getTeam(teamId: string): Promise<Team> {
    try {
      const response = await axiosInstance.get(`/team/${teamId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get current user's team
   */
  async getMyTeam(): Promise<Team> {
    try {
      const response = await axiosInstance.get('/team/my-team');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Add member to team
   */
  async addMember(teamId: string, memberEmail: string): Promise<void> {
    try {
      await axiosInstance.post('/team/add-member', {
        teamId,
        memberEmail,
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Remove member from team
   */
  async removeMember(teamId: string, memberId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/team/${teamId}/member/${memberId}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get team score
   */
  async getTeamScore(): Promise<{ pointsEarned: number }> {
    try {
      const response = await axiosInstance.get('/team/score');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get total possible score
   */
  async getTotalScore(): Promise<{ points: number }> {
    try {
      const response = await axiosInstance.get('/team/total-score');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get team info with all members
   */
  async getTeamInfo(): Promise<TeamInfo> {
    try {
      const response = await axiosInstance.get('/team/team');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

export default new TeamService();
