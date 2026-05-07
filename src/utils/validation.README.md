# Form Validation Utility

## Overview

This module provides client-side form validation for the modern animated authentication page. It includes validation rules for email, password, and username fields with regex pattern matching and error display functions.

## Files

- `validation.ts` - Core validation logic and functions
- `validation.test.ts` - Comprehensive unit tests
- `validation-visual-test.html` - Interactive visual testing tool

## Validation Rules

### Email
- **Pattern**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Requirements**: Standard email format (local@domain.tld)
- **Error Message**: "Please enter a valid email address"

### Password
- **Min Length**: 8 characters
- **Pattern**: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/`
- **Requirements**: 
  - At least 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Error Message**: "Password must be at least 8 characters with uppercase, lowercase, and number"

### Username
- **Min Length**: 3 characters
- **Max Length**: 20 characters
- **Pattern**: `/^[a-zA-Z0-9_]+$/`
- **Requirements**: Only letters, numbers, and underscores
- **Error Message**: "Username must be 3-20 characters (letters, numbers, underscore only)"

## API

### `validateField(fieldName: string, value: string): ValidationResult`

Validates a single field based on predefined rules.

**Parameters:**
- `fieldName` - The field to validate ('email', 'password', or 'username')
- `value` - The value to validate

**Returns:**
```typescript
{
  valid: boolean;
  message?: string;
}
```

**Example:**
```typescript
const result = validateField('email', 'user@example.com');
if (!result.valid) {
  console.error(result.message);
}
```

### `validateForm(fields: Record<string, string>): { valid: boolean; errors: Record<string, string> }`

Validates multiple fields at once.

**Parameters:**
- `fields` - Object with field names as keys and values to validate

**Returns:**
```typescript
{
  valid: boolean;
  errors: Record<string, string>;
}
```

**Example:**
```typescript
const result = validateForm({
  email: 'user@example.com',
  password: 'Password123',
  username: 'user123'
});

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### `showFieldError(inputElement: HTMLInputElement, message: string): void`

Displays an error message below an input field with visual styling.

**Parameters:**
- `inputElement` - The input element to show the error for
- `message` - The error message to display

**Example:**
```typescript
const emailInput = document.getElementById('email') as HTMLInputElement;
showFieldError(emailInput, 'Invalid email address');
```

### `clearFieldError(inputElement: HTMLInputElement): void`

Clears the error message and styling from an input field.

**Parameters:**
- `inputElement` - The input element to clear the error from

**Example:**
```typescript
const emailInput = document.getElementById('email') as HTMLInputElement;
clearFieldError(emailInput);
```

## Integration with modern-auth.html

The validation functions have been integrated into `modern-auth.html` with:

1. **Real-time error clearing**: Errors are cleared when users start typing
2. **Form submission validation**: Both login and signup forms validate on submit
3. **Visual error display**: Errors appear below fields with red styling
4. **Inline validation**: Each field is validated individually with specific error messages

## Testing

### Unit Tests

Run the comprehensive test suite:
```bash
npm run test -- src/utils/validation.test.ts
```

Test coverage includes:
- Email format validation (valid/invalid cases)
- Password strength requirements
- Username length and character restrictions
- Empty field validation
- Error display functions
- Form-level validation

### Visual Testing

Open `src/test/validation-visual-test.html` in a browser to:
- Test validation rules interactively
- See error messages in real-time
- Run automated test cases
- Verify visual styling

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **4.6**: Email format validation before submission
- **5.4**: Minimum password length of 8 characters
- **5.5**: Password complexity requirements (uppercase, lowercase, number)
- **5.6**: Username length validation (3-20 characters)
- **7.1**: Display error messages for empty required fields
- **7.2**: Display error messages for invalid email format

## Usage in Authentication Flow

```javascript
// Login form validation
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const emailValidation = validateField('email', emailInput.value);
  if (!emailValidation.valid) {
    showFieldError(emailInput, emailValidation.message);
    return;
  }
  
  const passwordValidation = validateField('password', passwordInput.value);
  if (!passwordValidation.valid) {
    showFieldError(passwordInput, passwordValidation.message);
    return;
  }
  
  // Proceed with authentication...
});
```

## Future Enhancements

Potential improvements for future iterations:
- Custom validation rules per use case
- Async validation (e.g., check if email exists)
- Internationalization of error messages
- Password strength meter visualization
- Real-time validation as user types (debounced)
