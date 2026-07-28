import './App.css';
import { BrowserRouter, Routes, Route , Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import JobDetails from './pages/JobDetails';
import JobSearch from './pages/JobSearch';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';


function HomeGate() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role === 'employer') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }
  return <Home />;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeGate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/search" element={<JobSearch />} />
        <Route path="/my-applications" element={<JobSeekerDashboard />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;