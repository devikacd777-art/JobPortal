import { useEffect, useState } from 'react';
import axios from 'axios';

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [applicantsFor, setApplicantsFor] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const [newJob, setNewJob] = useState({
    title: '', description: '', company: '', location: '', salary: '', jobType: 'full-time',
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs/my', { headers });
      setJobs(res.data);
    } catch (err) {
      setError('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', newJob, { headers });
      setNewJob({ title: '', description: '', company: '', location: '', salary: '', jobType: 'full-time' });
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create job');
    }
  };

  const startEdit = (job) => {
    setEditingId(job._id);
    setEditForm({ title: job.title, description: job.description, company: job.company, location: job.location, salary: job.salary, jobType: job.jobType });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, editForm, { headers });
      setEditingId(null);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, { headers });
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    }
  };

  const viewApplicants = async (jobId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, { headers });
      setApplicants(res.data);
      setApplicantsFor(jobId);
    } catch (err) {
      alert('Failed to load applicants');
    }
  };
const updateStatus = async (appId, status, jobId) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status }, { headers });
      viewApplicants(jobId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <p className="page">Loading your jobs...</p>;
  if (error) return <p className="page" style={{ color: 'var(--danger)' }}>{error}</p>;

  return (
    <div className="page">
      <h2>Recruiter Dashboard</h2>

      <h3>Post a New Job</h3>
      <form onSubmit={handleCreate} className="form-stack" style={{ marginBottom: '2rem' }}>
        <input placeholder="Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} required style={{ padding: '0.5rem' }} />
        <input placeholder="Company" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} required style={{ padding: '0.5rem' }} />
        <input placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} required style={{ padding: '0.5rem' }} />
        <input placeholder="Salary" type="number" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} style={{ padding: '0.5rem' }} />
        <select value={newJob.jobType} onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })} style={{ padding: '0.5rem' }}>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
        </select>
        <textarea placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} required style={{ padding: '0.5rem' }} />
        <button type="submit" className="btn">Post Job</button>
      </form>

      <h3>Your Job Postings</h3>
      {jobs.length === 0 && <p>You haven't posted any jobs yet.</p>}

      {jobs.map((job) => (
        <div key={job._id} className="card">
          {editingId === job._id ? (
  <div className="form-stack">
    <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
    <input value={editForm.company} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} />
    <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
    <input type="number" value={editForm.salary} onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })} />
    <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
    <div>
      <button className="btn" onClick={() => handleUpdate(job._id)}>Save</button>{' '}
      <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
    </div>
  </div>
) : (
            <>
              <h3>{job.title}</h3>
              <p>{job.company} — {job.location}</p>
              <p><strong>Type:</strong> {job.jobType} {job.salary && `| Salary: $${job.salary}`}</p>
              <button className="btn btn-danger" onClick={() => handleDelete(job._id)}>Delete</button>
              <button className="btn btn-secondary" onClick={() => viewApplicants(job._id)}>View Applicants</button>
              <button className="btn" onClick={() => startEdit(job)}>Edit</button>


              {applicantsFor === job._id && (
                <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border)' }}>
                  <strong>Applicants:</strong>
                  {applicants.length === 0 && <p>No applicants yet.</p>}
                  {applicants.map((app) => (
                    <div key={app._id} style={{ marginBottom: '0.75rem' }}>
                      <p style={{ margin: 0 }}>
                        {app.applicant.name} ({app.applicant.email}) — <strong>{app.status}</strong>
                      </p>
                      {app.resumeUrl && (
                        <a href={`http://localhost:5000${app.resumeUrl}`} target="_blank" rel="noreferrer">
                          View Resume
                        </a>
                      )}
                      <div style={{ marginTop: '0.25rem' }}>
                        <button className="btn" onClick={() => updateStatus(app._id, 'accepted', job._id)}>Accept</button>{' '}
                        <button className="btn btn-danger" onClick={() => updateStatus(app._id, 'rejected', job._id)}>Reject</button>{' '}
                        <button className="btn btn-secondary" onClick={() => updateStatus(app._id, 'reviewed', job._id)}>Mark Reviewed</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default RecruiterDashboard;