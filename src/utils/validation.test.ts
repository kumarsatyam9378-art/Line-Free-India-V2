/**
 * Unit tests for form validation utility
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { validateField, validateForm, showFieldError, clearFieldError, validationRules } from './validation';

describe('Email Validation', () => {
  test('accepts valid email format', () => {
    const result = validateField('email', 'user@example.com');
    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  test('accepts email with subdomain', () => {
    const result = validateField('email', 'user@mail.example.com');
    expect(result.valid).toBe(true);
  });

  test('accepts email with plus sign', () => {
    const result = validateField('email', 'user+tag@example.com');
    expect(result.valid).toBe(true);
  });

  test('rejects email without @ symbol', () => {
    const result = validateField('email', 'invalid-email');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('valid email');
  });

  test('rejects email without domain', () => {
    const result = validateField('email', 'user@');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('valid email');
  });

  test('rejects email without local part', () => {
    const result = validateField('email', '@example.com');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('valid email');
  });

  test('rejects email with spaces', () => {
    const result = validateField('email', 'user @example.com');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('valid email');
  });

  test('rejects empty email', () => {
    const result = validateField('email', '');
    expect(result.valid).toBe(false);
  });
});

describe('Password Validation', () => {
  test('accepts valid password with all requirements', () => {
    const result = validateField('password', 'Password123');
    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  test('accepts password with special characters', () => {
    const result = validateField('password', 'Pass@word123');
    expect(result.valid).toBe(true);
  });

  test('rejects password shorter than 8 characters', () => {
    const result = validateField('password', 'Pass1');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('at least 8 characters');
  });

  test('rejects password without uppercase letter', () => {
    const result = validateField('password', 'password123');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('uppercase');
  });

  test('rejects password without lowercase letter', () => {
    const result = validateField('password', 'PASSWORD123');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('lowercase');
  });

  test('rejects password without number', () => {
    const result = validateField('password', 'Password');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('number');
  });

  test('rejects empty password', () => {
    const result = validateField('password', '');
    expect(result.valid).toBe(false);
  });

  test('accepts exactly 8 character password with requirements', () => {
    const result = validateField('password', 'Pass1234');
    expect(result.valid).toBe(true);
  });
});

describe('Username Validation', () => {
  test('accepts valid username with letters and numbers', () => {
    const result = validateField('username', 'user123');
    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  test('accepts username with underscores', () => {
    const result = validateField('username', 'user_name_123');
    expect(result.valid).toBe(true);
  });

  test('accepts exactly 3 character username', () => {
    const result = validateField('username', 'abc');
    expect(result.valid).toBe(true);
  });

  test('accepts exactly 20 character username', () => {
    const result = validateField('username', 'a'.repeat(20));
    expect(result.valid).toBe(true);
  });

  test('rejects username shorter than 3 characters', () => {
    const result = validateField('username', 'ab');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('3-20 characters');
  });

  test('rejects username longer than 20 characters', () => {
    const result = validateField('username', 'a'.repeat(21));
    expect(result.valid).toBe(false);
    expect(result.message).toContain('3-20 characters');
  });

  test('rejects username with spaces', () => {
    const result = validateField('username', 'user name');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('letters, numbers, underscore');
  });

  test('rejects username with special characters', () => {
    const result = validateField('username', 'user@name');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('letters, numbers, underscore');
  });

  test('rejects username with hyphens', () => {
    const result = validateField('username', 'user-name');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('letters, numbers, underscore');
  });

  test('rejects empty username', () => {
    const result = validateField('username', '');
    expect(result.valid).toBe(false);
  });
});

describe('validateForm', () => {
  test('validates all fields and returns overall result', () => {
    const fields = {
      email: 'user@example.com',
      password: 'Password123',
      username: 'user123'
    };
    
    const result = validateForm(fields);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  test('returns errors for invalid fields', () => {
    const fields = {
      email: 'invalid-email',
      password: 'weak',
      username: 'ab'
    };
    
    const result = validateForm(fields);
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
    expect(result.errors.username).toBeDefined();
  });

  test('returns partial errors when some fields are valid', () => {
    const fields = {
      email: 'user@example.com',
      password: 'weak',
      username: 'validuser'
    };
    
    const result = validateForm(fields);
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeUndefined();
    expect(result.errors.password).toBeDefined();
    expect(result.errors.username).toBeUndefined();
  });
});

describe('Field Error Display Functions', () => {
  let container: HTMLDivElement;
  let inputGroup: HTMLDivElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    // Create DOM structure
    container = document.createElement('div');
    inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    input = document.createElement('input');
    input.type = 'email';
    input.id = 'test-email';
    
    inputGroup.appendChild(input);
    container.appendChild(inputGroup);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('showFieldError displays error message below input', () => {
    showFieldError(input, 'Invalid email');
    
    const errorElement = inputGroup.nextSibling as HTMLElement;
    expect(errorElement).toBeTruthy();
    expect(errorElement.className).toBe('field-error');
    expect(errorElement.textContent).toBe('Invalid email');
  });

  test('showFieldError applies error styling to input', () => {
    showFieldError(input, 'Invalid email');
    
    expect(input.style.borderColor).toBe('rgb(239, 68, 68)');
  });

  test('clearFieldError removes error message', () => {
    showFieldError(input, 'Invalid email');
    clearFieldError(input);
    
    const errorElement = inputGroup.nextSibling;
    expect(errorElement).toBeNull();
  });

  test('clearFieldError resets input border color', () => {
    showFieldError(input, 'Invalid email');
    clearFieldError(input);
    
    expect(input.style.borderColor).toBe('');
  });

  test('showFieldError replaces existing error message', () => {
    showFieldError(input, 'First error');
    showFieldError(input, 'Second error');
    
    const errorElements = container.querySelectorAll('.field-error');
    expect(errorElements.length).toBe(1);
    expect(errorElements[0].textContent).toBe('Second error');
  });
});

describe('Validation Rules Export', () => {
  test('validationRules contains email rule', () => {
    expect(validationRules.email).toBeDefined();
    expect(validationRules.email.pattern).toBeInstanceOf(RegExp);
    expect(validationRules.email.message).toBeTruthy();
  });

  test('validationRules contains password rule', () => {
    expect(validationRules.password).toBeDefined();
    expect(validationRules.password.minLength).toBe(8);
    expect(validationRules.password.pattern).toBeInstanceOf(RegExp);
    expect(validationRules.password.message).toBeTruthy();
  });

  test('validationRules contains username rule', () => {
    expect(validationRules.username).toBeDefined();
    expect(validationRules.username.minLength).toBe(3);
    expect(validationRules.username.maxLength).toBe(20);
    expect(validationRules.username.pattern).toBeInstanceOf(RegExp);
    expect(validationRules.username.message).toBeTruthy();
  });
});
