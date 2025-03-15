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
        className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Search for a country"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((country, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectCountry(country)}
            >
              {country}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CountryAutocomplete;
