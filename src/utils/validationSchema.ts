import * as yup from 'yup';

// Check if first letter is uppercase
const firstLetterUppercase = (value: string) => {
  return /^[A-Z]/.test(value);
};

// Validate password strength
const passwordStrength = (value: string) => {
  let strength = 0;
  if (value.length >= 8) strength++;
  if (/[0-9]/.test(value)) strength++;
  if (/[A-Z]/.test(value)) strength++;
  if (/[a-z]/.test(value)) strength++;
  if (/[^A-Za-z0-9]/.test(value)) strength++;
  return strength;
};

export const getPasswordStrengthText = (password: string) => {
  const strength = passwordStrength(password);
  if (strength <= 2) return 'Weak';
  if (strength <= 4) return 'Medium';
  return 'Strong';
};

export const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .test('first-letter-uppercase', 'First letter must be uppercase', firstLetterUppercase),

  age: yup
    .number()
    .typeError('Age must be a number')
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be an integer'),

  email: yup.string().required('Email is required').email('Invalid email format'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test('has-number', 'Password must contain at least one number', value =>
      /[0-9]/.test(value || '')
    )
    .test('has-uppercase', 'Password must contain at least one uppercase letter', value =>
      /[A-Z]/.test(value || '')
    )
    .test('has-lowercase', 'Password must contain at least one lowercase letter', value =>
      /[a-z]/.test(value || '')
    )
    .test('has-special', 'Password must contain at least one special character', value =>
      /[^A-Za-z0-9]/.test(value || '')
    ),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),

  termsAccepted: yup
    .boolean()
    .required('You must accept the terms and conditions')
    .oneOf([true], 'You must accept the terms and conditions'),

  country: yup.string().required('Country is required'),

  profileImage: yup
    .mixed<File | string>()
    .required('Profile image is required')
    .test('is-not-empty', 'Profile image is required', function (value) {
      // Reject empty strings
      if (value === '' || value === null || value === undefined) return false;
      return true;
    })
    .test('is-valid-type', 'File must be JPEG or PNG', function (value) {
      if (value === null || value === undefined || value === '') return false;
      if (typeof value === 'string' && value.startsWith('data:image/')) return true;
      if (value instanceof File) {
        return ['image/jpeg', 'image/png'].includes(value.type);
      }
      return false;
    })
    .test('is-valid-size', 'File size must be less than 5MB', function (value) {
      if (value === null || value === undefined || value === '') return false;
      if (typeof value === 'string' && value.startsWith('data:image/')) return true;
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024;
      }
      return false;
    }),
});
