import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wall from './pages/Wall';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminApplications from './components/admin/AdminApplications';
import AdminMembers from './components/admin/AdminMembers';
import AdminStats from './components/admin/AdminStats';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wall" element={<Wall />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="stats" element={<AdminStats />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
