export type UserType = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};

export type UserUpdateType = {
  clerkId: string;
  data: Omit<UserType, 'email' | 'clerkId'>;
};
