import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../store';
import { clearLatestEntry } from '../store/formDataSlice';

interface FormEntry {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  country: string;
  profileImage?: string;
  source: 'uncontrolled' | 'hookForm';
  timestamp: number;
}

const HomePage = () => {
  const dispatch = useDispatch();
  const { entries, latestEntryId } = useSelector(
    (state: RootState) => state.formData as { entries: FormEntry[]; latestEntryId: string | null }
  );

  useEffect(() => {
    if (latestEntryId) {
      const timer = setTimeout(() => {
        dispatch(clearLatestEntry());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [latestEntryId, dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6 text-center">
      <div className="mb-8 text-center">
        <h1 className="text-[40px] font-bold mb-4">React Forms Demo</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[35px]">Uncontrolled Components</h2>
          </div>
          <Link
            to="/uncontrolled-form"
            className="inline-block text-[30px] font-bold py-2 px-4 rounded transition-colors no-underline"
          >
            Try Uncontrolled Form
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[35px]">React Hook Form</h2>
          </div>
          <Link
            to="/hook-form"
            className="inline-block text-[30px] font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors no-underline"
          >
            Try React Hook Form
          </Link>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Submitted Forms</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map(entry => {
              const isLatest = entry.id === latestEntryId;

              return (
                <div
                  key={entry.id}
                  className={`bg-white rounded-lg shadow p-6 ${
                    isLatest ? 'ring-4 ring-blue-400 animate-pulse' : ''
                  } transition-all`}
                >
                  <div
                    className={`text-sm font-medium mb-4 ${
                      entry.source === 'hookForm' ? 'text-green-600' : 'text-blue-600'
                    }`}
                  >
                    {entry.source === 'hookForm' ? 'React Hook Form' : 'Uncontrolled Form'}
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      {entry.profileImage && (
                        <img
                          src={entry.profileImage}
                          alt={entry.name}
                          className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-gray-200"
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{entry.name}</h3>
                        <p className="text-gray-500 text-sm">
                          {entry.age} years old • {entry.gender}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Email:</span> {entry.email}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Country:</span> {entry.country}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Submitted {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
