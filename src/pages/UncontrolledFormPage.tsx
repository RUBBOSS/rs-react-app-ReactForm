import { useRef, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { validationSchema, getPasswordStrengthText } from '../utils/validationSchema';
import { fileToBase64 } from '../utils/fileToBase64';
import { addFormData } from '../store/formDataSlice';
import CountryAutocomplete from '../components/CountryAutocomplete';

interface FormErrors {
  name?: string;
  age?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  termsAccepted?: string;
  profileImage?: string;
  country?: string;
}

const UncontrolledFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form refs
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const maleRef = useRef<HTMLInputElement>(null);
  const femaleRef = useRef<HTMLInputElement>(null);
  const otherRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Check password strength on change
  const handlePasswordChange = () => {
    if (passwordRef.current) {
      setPasswordStrength(getPasswordStrengthText(passwordRef.current.value));
    }
  };

  // Handle file input change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewImage(null);
      return;
    }

    try {
      // Validate file type and size
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({ ...prev, profileImage: 'File must be JPEG or PNG' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'File size must be less than 5MB' }));
        return;
      }

      const base64 = await fileToBase64(file);
      setPreviewImage(base64);
      setErrors(prev => ({ ...prev, profileImage: undefined }));
    } catch (error) {
      console.error('Error processing file:', error);
      setErrors(prev => ({ ...prev, profileImage: 'Error processing file' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const formData = {
        name: nameRef.current?.value || '',
        age: ageRef.current?.value ? parseInt(ageRef.current.value) : 0,
        email: emailRef.current?.value || '',
        password: passwordRef.current?.value || '',
        confirmPassword: confirmPasswordRef.current?.value || '',
        gender: maleRef.current?.checked
          ? 'male'
          : femaleRef.current?.checked
            ? 'female'
            : otherRef.current?.checked
              ? 'other'
              : '',
        termsAccepted: termsRef.current?.checked || false,
        profileImage: previewImage,
        country: selectedCountry,
      };

      // Validate form data
      await validationSchema.validate(formData, { abortEarly: false });

      // Submit to Redux store
      dispatch(
        addFormData({
          id: uuidv4(),
          ...formData,
          source: 'uncontrolled',
          timestamp: Date.now(),
        })
      );

      // Redirect to home page
      navigate('/');
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: FormErrors = {};
        error.inner.forEach(err => {
          if (err.path) {
            newErrors[err.path as keyof FormErrors] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error('Submission error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="font-bold text-[40px] font-bold mb-4">Uncontrolled Form Example</h1>
        <p className="font-bold text-[35px]">
          This form uses the uncontrolled components approach with validation on submit.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block font-bold text-[35px] mb-1">
              Name
            </label>
            <input
              ref={nameRef}
              type="text"
              id="name"
              style={{
                borderColor: errors.name ? '#EF4444' : '#D1D5DB',
                boxShadow: errors.name ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
              }}
              className="w-full py-5 px-4 border text-lg transition-all outline-none rounded-[8px] min-h-[30px]"
              placeholder="Your name"
            />
            {errors.name && (
              <p
                style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }}
                className="mt-1"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Age Field */}
          <div>
            <label htmlFor="age" className="block font-bold text-[35px] mb-1">
              Age
            </label>
            <input
              ref={ageRef}
              type="number"
              id="age"
              style={{
                borderColor: errors.age ? '#EF4444' : '#D1D5DB',
                boxShadow: errors.age ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
              }}
              className="w-full py-5 px-4 border text-lg transition-all outline-none rounded-[8px] min-h-[30px]"
              placeholder="Your age"
              min="0"
            />
            {errors.age && (
              <p
                style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }}
                className="mt-1"
              >
                {errors.age}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block font-bold text-[35px] mb-1">
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              style={{
                borderColor: errors.email ? '#EF4444' : '#D1D5DB',
                boxShadow: errors.email ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
              }}
              className="w-full py-5 px-4 border text-lg transition-all outline-none rounded-[8px] min-h-[30px]"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p
                style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }}
                className="mt-1"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block font-bold text-[35px] mb-1">
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              style={{
                borderColor: errors.password ? '#EF4444' : '#D1D5DB',
                boxShadow: errors.password ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
              }}
              className="w-full py-5 px-4 border text-lg transition-all outline-none rounded-[8px] min-h-[30px]"
              placeholder="Your password"
              onChange={handlePasswordChange}
            />
            {passwordStrength && (
              <div className="mt-3">
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Strength: </span>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color:
                      passwordStrength === 'Strong'
                        ? '#10B981'
                        : passwordStrength === 'Medium'
                          ? '#F59E0B'
                          : '#EF4444',
                  }}
                >
                  {passwordStrength}
                </span>
              </div>
            )}
            {errors.password && (
              <p
                style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }}
                className="mt-1"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block font-bold text-[35px] mb-1">
              Confirm Password
            </label>
            <input
              ref={confirmPasswordRef}
              type="password"
              id="confirmPassword"
              style={{
                borderColor: errors.confirmPassword ? '#EF4444' : '#D1D5DB',
                boxShadow: errors.confirmPassword ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
              }}
              className="w-full py-5 px-4 border text-lg transition-all outline-none rounded-[8px] min-h-[30px]"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p
                style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }}
                className="mt-1"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Gender Field */}
          <div>
            <span className="block font-bold text-[35px] mb-1">Gender</span>
            <div
              style={{
                borderColor: errors.gender ? '#EF4444' : 'transparent',
                borderWidth: errors.gender ? '2px' : '0',
                borderStyle: 'solid',
                borderRadius: '8px',
                padding: errors.gender ? '8px' : '0',
              }}
              className="flex space-x-4"
            >
              <div className="flex items-center">
                <input
                  ref={maleRef}
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  className="mr-2"
                />
                <label className="text-[30px]" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="flex items-center">
                <input
                  ref={femaleRef}
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  className="mr-2"
                />
                <label className="text-[30px]" htmlFor="female">
                  Female
                </label>
              </div>
            </div>
            {errors.gender && (
              <p
                style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }}
                className="mt-1"
              >
                {errors.gender}
              </p>
            )}
          </div>

          {/* Country Autocomplete */}
          <div>
            <label htmlFor="country" className="block font-bold text-[35px] mb-1">
              Country
            </label>
            <CountryAutocomplete
              id="country"
              value={selectedCountry}
              onChange={setSelectedCountry}
              error={errors.country}
            />
          </div>

          {/* Profile Image */}
          <div>
            <label htmlFor="profileImage" className="block font-bold text-[35px] mb-1">
              Profile Image (JPEG/PNG, max 5MB)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="profileImage"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              style={{
                borderColor: errors.profileImage ? '#EF4444' : '#D1D5DB',
                boxShadow: errors.profileImage ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
              }}
              className="w-full py-5 px-4 border text-lg transition-all outline-none rounded-[8px] min-h-[30px] bg-white"
            />
            {errors.profileImage && (
              <p
                style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }}
                className="mt-1"
              >
                {errors.profileImage}
              </p>
            )}

            {previewImage && (
              <div className="mt-2">
                <img src={previewImage} alt="Preview" className="h-20 w-20 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-center">
              <input
                ref={termsRef}
                type="checkbox"
                id="terms"
                style={{
                  borderColor: errors.termsAccepted ? '#EF4444' : '',
                  boxShadow: errors.termsAccepted ? '0 0 0 2px rgba(239, 68, 68, 0.5)' : 'none',
                }}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-[30px] font-bold">
                I accept the Terms and Conditions
              </label>
            </div>
            {errors.termsAccepted && (
              <p
                style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }}
                className="mt-1"
              >
                {errors.termsAccepted}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 px-4 rounded-[8px] text-white font-medium text-xl transition-colors bg-blue-600 hover:bg-blue-700 min-h-[30px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UncontrolledFormPage;
