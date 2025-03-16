import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'font-extrabold text-black' : '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16">
            <ul className="flex justify-between items-center w-full list-none text-[40px] font-bold text-black">
              <li>
                <Link
                  to="/"
                  className={`no-underline hover:text-black transition-colors ${isActive('/')}`}
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/uncontrolled-form"
                  className={`no-underline hover:text-black transition-colors  ${isActive('/uncontrolled-form')}`}
                  aria-current={location.pathname === '/uncontrolled-form' ? 'page' : undefined}
                >
                  Uncontrolled Form
                </Link>
              </li>
              <li>
                <Link
                  to="/hook-form"
                  className={`no-underline hover:text-black transition-colors mr-[40px] ${isActive('/hook-form')}`}
                  aria-current={location.pathname === '/hook-form' ? 'page' : undefined}
                >
                  React Hook Form
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white shadow-inner py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[35px]">React Forms Demo - {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
