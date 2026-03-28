export type UserProfileSnapshot = {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
  createDate: string;
  lastLogin: string | null;
  sessionTimeoutMinutes: number;
  locale: string;
};

export type UpdateUserProfileRequest = {
  name: string;
};
