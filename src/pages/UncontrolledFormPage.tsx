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
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
              className={`w-full p-2 border rounded ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your age"
              min="0"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
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
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
              className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your password"
              onChange={handlePasswordChange}
            />
            {passwordStrength && (
              <div className="mt-1">
                <span className="text-sm">Strength: </span>
                <span
                  className={`text-sm font-medium ${
                    passwordStrength === 'Strong'
                      ? 'text-green-500'
                      : passwordStrength === 'Medium'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                  }`}
                >
                  {passwordStrength}
                </span>
              </div>
            )}
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
              className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Gender Field */}
          <div>
            <span className="block font-bold text-[35px] mb-1">Gender</span>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  ref={maleRef}
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  className="mr-2"
                />
                <label htmlFor="male">Male</label>
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
                <label htmlFor="female">Female</label>
              </div>
              <div className="flex items-center">
                <input
                  ref={otherRef}
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  className="mr-2"
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
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
              className="w-full p-2 border rounded border-gray-300"
            />
            {errors.profileImage && (
              <p className="text-red-500 text-sm mt-1">{errors.profileImage}</p>
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
                className={`mr-2 ${errors.termsAccepted ? 'border-red-500' : ''}`}
              />
              <label htmlFor="terms" className="text-sm">
                I accept the Terms and Conditions
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full p-3 rounded text-white font-medium bg-blue-600 hover:bg-blue-700"
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
