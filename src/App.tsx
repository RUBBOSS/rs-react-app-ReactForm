import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UncontrolledFormPage from './pages/UncontrolledFormPage';
import HookFormPage from './pages/HookFormPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="uncontrolled-form" element={<UncontrolledFormPage />} />
          <Route path="hook-form" element={<HookFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
