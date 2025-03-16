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
  profileImage: string | File;
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
      profileImage: '',
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
      setValue('profileImage', '');
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

  const onSubmit = async (data: FormInputs) => {
    let profileImageData = null;
    if (data.profileImage) {
      if (data.profileImage instanceof File) {
        // Convert file to base64 if it hasn't been converted yet
        try {
          profileImageData = await fileToBase64(data.profileImage);
        } catch (error) {
          console.error('Error converting profile image:', error);
        }
      } else if (typeof data.profileImage === 'string' && data.profileImage.startsWith('data:')) {
        // If it's already a data URL, use it directly
        profileImageData = data.profileImage;
      }
    }

    return new Promise<void>(resolve => {
      setTimeout(() => {
        dispatch(
          addFormData({
            id: uuidv4(),
            ...data,
            source: 'hookForm',
            timestamp: Date.now(),
            profileImage: profileImageData,
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
        <h1 className="text-[40px] font-bold mb-4">React Hook Form Example</h1>
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
                {errors.name.message}
              </p>
            )}
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
                {errors.age.message}
              </p>
            )}
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
                {errors.email.message}
              </p>
            )}
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
              style={{
                borderColor: errors.password ? '#EF4444' : '#D1D5DB',
                boxShadow: errors.password ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
              }}
              className="w-full py-5 px-4 border text-lg transition-all outline-none rounded-[8px] min-h-[30px]"
              placeholder="Your password"
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
                {errors.password.message}
              </p>
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
                {errors.confirmPassword.message}
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
                  {...register('gender')}
                  type="radio"
                  id="hook-male"
                  value="male"
                  className="mr-2"
                />
                <label className="text-[35px] font-bold" htmlFor="hook-male">
                  Male
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register('gender')}
                  type="radio"
                  id="hook-female"
                  value="female"
                  className="mr-2"
                />
                <label className="text-[35px] font-bold" htmlFor="hook-female">
                  Female
                </label>
              </div>
            </div>
            {errors.gender && (
              <p
                style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }}
                className="mt-1"
              >
                {errors.gender.message}
              </p>
            )}
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
                {errors.profileImage.message}
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
                {...register('termsAccepted')}
                type="checkbox"
                id="hook-terms"
                style={{
                  borderColor: errors.termsAccepted ? '#EF4444' : '',
                  boxShadow: errors.termsAccepted ? '0 0 0 2px rgba(239, 68, 68, 0.5)' : 'none',
                }}
                className="mr-2"
              />
              <label htmlFor="hook-terms" className="text-[30px] font-bold">
                I accept the Terms and Conditions
              </label>
            </div>
            {errors.termsAccepted && (
              <p
                style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }}
                className="mt-1"
              >
                {errors.termsAccepted.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-5 px-4 rounded-[8px] text-white font-medium text-xl transition-colors min-h-[30px]
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
