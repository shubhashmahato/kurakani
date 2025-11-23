export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateProfileData = (data: any) => {
  const errors: Record<string, string> = {};

  if (data.displayName && data.displayName.length < 2) {
    errors.displayName = 'Name must be at least 2 characters';
  }

  if (data.bio && data.bio.length > 150) {
    errors.bio = 'Bio must be less than 150 characters';
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  return errors;
};