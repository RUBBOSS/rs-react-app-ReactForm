import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { validationSchema, getPasswordStrengthText } from '../utils/validationSchema';
import { fileToBase64 } from '../utils/fileToBase64';
import { addFormData } from '../store/formDataSlice';
import CountryAutocomplete from '../components/CountryAutocomplete';

interface FormInputs {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  termsAccepted: boolean;
  country: string;
  profileImage?: string | File | null;
}

const HookFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      profileImage: null,
    },
  });

  const [passwordStrength, setPasswordStrength] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('');

  const password = watch('password');

  useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrengthText(password));
    } else {
      setPasswordStrength('');
    }
  }, [password]);

  useEffect(() => {
    register('profileImage', { value: undefined });
  }, [register]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewImage(null);
      setValue('profileImage', null);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setPreviewImage(base64);
      setValue('profileImage', file);
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setValue('country', country);
    trigger('country');
  };

  const onSubmit = (data: FormInputs) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        dispatch(
          addFormData({
            id: uuidv4(),
            ...data,
            source: 'hookForm',
            timestamp: Date.now(),
            profileImage: typeof data.profileImage === 'string' ? data.profileImage : null,
          })
        );

        reset();
        setPreviewImage(null);
        setSelectedCountry('');
        navigate('/');
        resolve();
      }, 500);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">React Hook Form Example</h1>
        <p className="font-bold text-[35px]">
          This form uses React Hook Form for live validation and efficient form handling.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="hook-name" className="block font-bold text-[35px] mb-1">
              Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="hook-name"
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Age Field */}
          <div>
            <label htmlFor="hook-age" className="block font-bold text-[35px] mb-1">
              Age
            </label>
            <input
              {...register('age')}
              type="number"
              id="hook-age"
              className={`w-full p-2 border rounded ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your age"
              min="0"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="hook-email" className="block font-bold text-[35px] mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="hook-email"
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="hook-password" className="block font-bold text-[35px] mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              id="hook-password"
              className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your password"
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="hook-confirmPassword" className="block font-bold text-[35px] mb-1">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              id="hook-confirmPassword"
              className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Gender Field */}
          <div>
            <span className="block font-bold text-[35px] mb-1">Gender</span>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  {...register('gender')}
                  type="radio"
                  id="hook-male"
                  value="male"
                  className="mr-2"
                />
                <label htmlFor="hook-male">Male</label>
              </div>
              <div className="flex items-center">
                <input
                  {...register('gender')}
                  type="radio"
                  id="hook-female"
                  value="female"
                  className="mr-2"
                />
                <label htmlFor="hook-female">Female</label>
              </div>
              <div className="flex items-center">
                <input
                  {...register('gender')}
                  type="radio"
                  id="hook-other"
                  value="other"
                  className="mr-2"
                />
                <label htmlFor="hook-other">Other</label>
              </div>
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
          </div>

          {/* Country Autocomplete */}
          <div>
            <label htmlFor="hook-country" className="block font-bold text-[35px] mb-1">
              Country
            </label>
            <CountryAutocomplete
              id="hook-country"
              value={selectedCountry}
              onChange={handleCountryChange}
              error={errors.country?.message}
            />
          </div>

          {/* Profile Image */}
          <div>
            <label htmlFor="hook-profileImage" className="block font-bold text-[35px] mb-1">
              Profile Image (JPEG/PNG, max 5MB)
            </label>
            <input
              type="file"
              id="hook-profileImage"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              className="w-full p-2 border rounded border-gray-300"
            />
            {errors.profileImage && (
              <p className="text-red-500 text-sm mt-1">{errors.profileImage.message}</p>
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
                {...register('termsAccepted')}
                type="checkbox"
                id="hook-terms"
                className={`mr-2 ${errors.termsAccepted ? 'border-red-500' : ''}`}
              />
              <label htmlFor="hook-terms" className="text-sm">
                I accept the Terms and Conditions
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm mt-1">{errors.termsAccepted.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-3 rounded text-white font-medium
                ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HookFormPage;
