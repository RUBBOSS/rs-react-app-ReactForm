import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id: string;
}

const CountryAutocomplete = ({ value, onChange, error, id }: CountryAutocompleteProps) => {
  const countries = useSelector((state: RootState) => state.countries.list);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = countries
        .filter(country => country.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);

      setSuggestions(filtered);
      setShowSuggestions(true);
    }

    onChange(value);
  };

  const handleSelectCountry = (country: string) => {
    setInputValue(country);
    onChange(country);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.trim() !== '' && setShowSuggestions(true)}
        style={{
          borderColor: error ? '#EF4444' : '#D1D5DB',
          boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
        }}
        className={`w-full py-5 px-4 border text-lg transition-all outline-none rounded-[8px] min-h-[30px]`}
        placeholder="Search for a country"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          style={{
            backgroundColor: 'white',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            marginTop: '4px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 50,
          }}
          className="absolute w-full"
        >
          {suggestions.map((country, index) => (
            <div
              key={index}
              onClick={() => handleSelectCountry(country)}
              style={{
                padding: '12px 16px',
                fontSize: '30px',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderBottom: index < suggestions.length - 1 ? '1px solid #E5E7EB' : 'none',
              }}
              className="hover:bg-gray-100"
            >
              {country}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p style={{ color: '#EF4444', fontSize: '30px', fontWeight: 'bold' }} className="mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default CountryAutocomplete;
