/**
 * Password Security Service
 * Provides password validation and strength checking
 */

export interface PasswordStrength {
  score: number; // 0-4
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  feedback: string[];
  isValid: boolean;
}

export const passwordService = {
  /**
   * Validate password strength
   * Requirements:
   * - Minimum 8 characters (Firebase minimum is 6, but we enforce 8 for better security)
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  validatePasswordStrength(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    // Check minimum length
    if (password.length >= 8) {
      score++;
    } else {
      feedback.push('Password must be at least 8 characters long');
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('Add at least one uppercase letter');
    }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push('Add at least one lowercase letter');
    }

    // Check for numbers
    if (/\d/.test(password)) {
      score++;
    } else {
      feedback.push('Add at least one number');
    }

    // Check for special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score++;
    } else {
      feedback.push('Add at least one special character (!@#$%^&*)');
    }

    // Determine level
    let level: PasswordStrength['level'];
    if (score <= 1) {
      level = 'weak';
    } else if (score === 2) {
      level = 'fair';
    } else if (score === 3) {
      level = 'good';
    } else if (score === 4) {
      level = 'strong';
    } else {
      level = 'very-strong';
    }

    return {
      score,
      level,
      feedback,
      isValid: score >= 4, // Require at least 4 criteria
    };
  },

  /**
   * Check if password meets minimum requirements
   * Minimum: 8 characters, 1 uppercase, 1 lowercase, 1 number
   */
  isPasswordValid(password: string): boolean {
    const strength = this.validatePasswordStrength(password);
    return strength.isValid;
  },

  /**
   * Get password strength level as percentage
   */
  getPasswordStrengthPercentage(password: string): number {
    const strength = this.validatePasswordStrength(password);
    return (strength.score / 5) * 100;
  },

  /**
   * Check if two passwords match
   */
  passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  },

  /**
   * Check for common weak passwords
   */
  isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password',
      '123456',
      '12345678',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein',
      'welcome',
      'monkey',
      'dragon',
      'master',
      'sunshine',
      'princess',
      'football',
    ];

    return commonPasswords.includes(password.toLowerCase());
  },

  /**
   * Get comprehensive password validation result
   */
  validatePassword(password: string, confirmPassword?: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if password is empty
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors, warnings };
    }

    // Check strength
    const strength = this.validatePasswordStrength(password);
    if (!strength.isValid) {
      errors.push(...strength.feedback);
    }

    // Check for common passwords
    if (this.isCommonPassword(password)) {
      warnings.push('This password is too common. Consider using a more unique password.');
    }

    // Check if passwords match
    if (confirmPassword !== undefined && !this.passwordsMatch(password, confirmPassword)) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },
};

