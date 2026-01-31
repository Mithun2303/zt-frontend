// Export all services
export { default as authService } from './auth.service';
export { default as userService } from './user.service';
export { default as teamService } from './team.service';
export { default as userProgressService } from './userProgress.service';

// Export API utilities
export {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  handleApiError,
} from './api';

// Re-export types
export type {
  LoginDto,
  RegisterDto,
  VerifyEmailDto,
  OnboardingDto,
  ResetPasswordDto,
  LoginResponse,
} from './auth.service';
export type { User } from './user.service';
export type {
  CreateTeamDto,
  Team,
  TeamMember,
  CreateTeamResponse,
  TeamInfo,
} from './team.service';
export type {
  LevelData,
  TeamProgress,
  Challenge,
  LevelChallengeResponse,
  Hint,
  ChallengeFile,
  UseHintDto,
  SolveLevelDto,
  SolveResponse,
} from './userProgress.service';
