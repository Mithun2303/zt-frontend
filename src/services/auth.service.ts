import axiosInstance, { handleApiError, setAuthToken } from './api';

// Types
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
  user: {
    email: string;
    name: string;
    rollNumber: string;
    teamId?: string;
  };
}

// Auth Service
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginDto): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token } = response.data;

      if (token) {
        setAuthToken(token);
      }

      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterDto): Promise<RegisterDto> {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Verify email with code
   */
  async verifyEmail(
    verificationData: VerifyEmailDto,
  ): Promise<{ message: string; token: string }> {
    try {
      const response = await axiosInstance.post(
        '/auth/verify-email',
        verificationData,
      );
      const { token } = response.data;

      if (token) {
        setAuthToken(token);
      }

      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Onboard user (complete registration)
   */
  async onboardUser(token: string, userData: OnboardingDto): Promise<string> {
    try {
      const response = await axiosInstance.post(
        `/auth/onboard-user?token=${token}`,
        userData,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(
    token: string,
    passwordData: ResetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post(
        `/auth/reset-password?token=${token}`,
        passwordData,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Upload CSV for bulk onboarding
   */
  async uploadCsv(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post(
        '/auth/onboard-people',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    setAuthToken('');
  }
}

export default new AuthService();
