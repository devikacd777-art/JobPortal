import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('http://localhost:5000/api/admin/users', { headers });
        const jobsRes = await axios.get('http://localhost:5000/api/admin/jobs', { headers });
        setUsers(usersRes.data);
        setJobs(jobsRes.data);
      } catch (err) {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleBlock = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/admin/users/${id}/block`, {}, { headers });
      setUsers(users.map(u => (u._id === id ? res.data : u)));
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/jobs/${id}`, { headers });
      setJobs(jobs.filter(j => j._id !== id));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  if (loading) return <p className="page">Loading admin dashboard...</p>;
  if (error) return <p className="page" style={{ color: 'var(--danger)' }}>{error}</p>;

  return (
    <div className="page" style={{ maxWidth: '1000px' }}>
      <h2>Admin Dashboard</h2>

     <h3>Job Seekers</h3>
<table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', background: 'white' }}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.filter(u => u.role === 'jobseeker').map(u => (
      <tr key={u._id}>
        <td>{u.name}</td>
        <td>{u.email}</td>
        <td>{u.isBlocked ? 'Blocked' : 'Active'}</td>
        <td>
          <button className="btn" onClick={() => toggleBlock(u._id)}>
            {u.isBlocked ? 'Unblock' : 'Block'}
          </button>{' '}
          <button className="btn btn-danger" onClick={() => deleteUser(u._id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

<h3>Employers</h3>
<table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', background: 'white' }}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.filter(u => u.role === 'employer').map(u => (
      <tr key={u._id}>
        <td>{u.name}</td>
        <td>{u.email}</td>
        <td>{u.isBlocked ? 'Blocked' : 'Active'}</td>
        <td>
          <button className="btn" onClick={() => toggleBlock(u._id)}>
            {u.isBlocked ? 'Unblock' : 'Block'}
          </button>{' '}
          <button className="btn btn-danger" onClick={() => deleteUser(u._id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      <h3>All Job Postings</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Posted By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j._id}>
              <td>{j.title}</td>
              <td>{j.company}</td>
              <td>{j.postedBy?.name || 'Unknown'}</td>
              <td>
                <button className="btn btn-danger" onClick={() => deleteJob(j._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;