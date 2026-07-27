import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function JobSeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/applications/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        setError('Failed to load your applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case 'accepted': return '#16a34a';
      case 'rejected': return '#dc2626';
      case 'reviewed': return '#2563eb';
      default: return '#6b7280';
    }
  };

  if (loading) return <p className="page">Loading your applications...</p>;
  if (error) return <p className="page" style={{ color: 'var(--danger)' }}>{error}</p>;

  return (
   <div className="page">
      <h2>My Applications</h2>

      {applications.length === 0 && <p>You haven't applied to any jobs yet.</p>}

      {applications.map((app) => (
       <div key={app._id} className="card">
  <h3>
    <Link to={`/jobs/${app.job._id}`}>
              {app.job.title}
            </Link>
          </h3>
          <p>{app.job.company} — {app.job.location}</p>
          <p>
            <strong>Status: </strong>
            <span className={`status-${app.status}`} style={{ textTransform: 'capitalize' }}>
              {app.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default JobSeekerDashboard;