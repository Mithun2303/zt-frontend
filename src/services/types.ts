/**
 * Common TypeScript Types for API Services
 *
 * This file contains shared types used across multiple services
 */

// ============================================
// Common Response Types
// ============================================

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

// ============================================
// Authentication Types
// ============================================

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  rollNumber: string;
}

export interface VerifyEmailDto {
  email: string;
  code: string;
  rollNumber: string;
}

export interface OnboardingDto {
  email: string;
  name: string;
  rollNumber: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: string;
}

export interface ResetPasswordDto {
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  rollNumber: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: string;
  teamId?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  team?: Team;
  stats?: UserStats;
}

export interface UserStats {
  totalPoints: number;
  challengesSolved: number;
  hintsUsed: number;
  rank: number;
}

// ============================================
// Team Types
// ============================================

export interface Team {
  id: string;
  teamName: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
  score?: number;
  rank?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  role?: 'leader' | 'member';
}

export interface CreateTeamDto {
  teamName: string;
  teamMember2Email?: string;
  teamMember3Email?: string;
}

export interface CreateTeamResponse {
  token: string;
  teamId: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  token: string;
  isAccepted: boolean;
  createdAt: string;
}

// ============================================
// Challenge & Progress Types
// ============================================

export interface Level {
  id: string;
  name: string;
  description: string;
  order: number;
  isUnlocked: boolean;
  challenges: Challenge[];
  progress?: LevelProgress;
  createdAt: string;
  updatedAt: string;
}

export interface LevelProgress {
  completed: number;
  total: number;
  percentage: number;
  points: number;
}

export interface Challenge {
  id: string;
  levelId: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  isSolved: boolean;
  hints: Hint[];
  files?: ChallengeFile[];
  createdAt: string;
  updatedAt: string;
}

export interface Hint {
  id: string;
  challengeId: string;
  content: string;
  pointReduction: number;
  isUsed: boolean;
  order: number;
}

export interface ChallengeFile {
  id: string;
  challengeId: string;
  name: string;
  url: string;
  type: 'file' | 'link';
  size?: number;
}

export interface UseHintDto {
  challengeId: string;
  hintId: string;
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
  correctAnswer?: string;
}

// ============================================
// Leaderboard Types
// ============================================

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  score: number;
  challengesSolved: number;
  lastSolvedAt?: string;
}

export interface TeamScore {
  score: number;
  rank: number;
  totalTeams: number;
  percentile: number;
}

// ============================================
// Utility Types
// ============================================

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type ChallengeCategory =
  | 'Web Exploitation'
  | 'Cryptography'
  | 'Reverse Engineering'
  | 'Forensics'
  | 'Binary Exploitation'
  | 'Miscellaneous';

export type UserRole = 'user' | 'admin' | 'moderator';

export type TeamRole = 'leader' | 'member';

// ============================================
// Form State Types (for React components)
// ============================================

export interface LoginFormState {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  rollNumber: string;
}

export interface TeamFormState {
  teamName: string;
  member2Email: string;
  member3Email: string;
}

// ============================================
// Loading & Error States
// ============================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// ============================================
// Validation Types
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}
