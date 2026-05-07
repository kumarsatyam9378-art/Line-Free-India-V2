/**
 * Form Validation Utility
 * Provides validation rules and functions for authentication forms
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validation rule interface
 */
interface ValidationRule {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  message: string;
}

/**
 * Validation rules for authentication form fields
 */
export const validationRules: Record<string, ValidationRule> = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  },
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Username must be 3-20 characters (letters, numbers, underscore only)'
  }
};

/**
 * Validates a form field based on predefined rules
 * @param fieldName - The name of the field to validate ('email', 'password', or 'username')
 * @param value - The value to validate
 * @returns ValidationResult object with valid flag and optional error message
 */
export function validateField(fieldName: string, value: string): ValidationResult {
  const rule = validationRules[fieldName];
  
  if (!rule) {
    return { valid: true };
  }
  
  // Check minimum length
  if (rule.minLength && value.length < rule.minLength) {
    return { valid: false, message: rule.message };
  }
  
  // Check maximum length
  if (rule.maxLength && value.length > rule.maxLength) {
    return { valid: false, message: rule.message };
  }
  
  // Check pattern
  if (rule.pattern && !rule.pattern.test(value)) {
    return { valid: false, message: rule.message };
  }
  
  return { valid: true };
}

/**
 * Displays an error message below an input field
 * @param inputElement - The input element to display the error for
 * @param message - The error message to display
 */
export function showFieldError(inputElement: HTMLInputElement, message: string): void {
  // Remove any existing error message
  clearFieldError(inputElement);
  
  // Create error message element
  const errorElement = document.createElement('div');
  errorElement.className = 'field-error';
  errorElement.textContent = message;
  errorElement.style.cssText = `
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
    animation: fadeIn 0.2s ease;
  `;
  
  // Insert error message after the input group
  const inputGroup = inputElement.closest('.input-group');
  if (inputGroup && inputGroup.parentNode) {
    inputGroup.parentNode.insertBefore(errorElement, inputGroup.nextSibling);
  }
  
  // Add error styling to input
  inputElement.style.borderColor = '#ef4444';
}

/**
 * Clears the error message for an input field
 * @param inputElement - The input element to clear the error for
 */
export function clearFieldError(inputElement: HTMLInputElement): void {
  const inputGroup = inputElement.closest('.input-group');
  if (inputGroup && inputGroup.nextSibling) {
    const nextElement = inputGroup.nextSibling as HTMLElement;
    if (nextElement.classList && nextElement.classList.contains('field-error')) {
      nextElement.remove();
    }
  }
  
  // Reset input border color
  inputElement.style.borderColor = '';
}

/**
 * Validates all fields in a form
 * @param fields - Object containing field names and values to validate
 * @returns Object with overall validity and field-specific errors
 */
export function validateForm(fields: Record<string, string>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  let valid = true;
  
  for (const [fieldName, value] of Object.entries(fields)) {
    const result = validateField(fieldName, value);
    if (!result.valid && result.message) {
      errors[fieldName] = result.message;
      valid = false;
    }
  }
  
  return { valid, errors };
}
