import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyMessage, setApplyMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        setError('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/applications',
        { jobId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplyMessage('Applied successfully!');
    } catch (err) {
      setApplyMessage(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <p className="page">Loading job details...</p>;
  if (error) return <p className="page" style={{ color: 'var(--danger)' }}>{error}</p>;

  return (
    <div className="page">
      <h2>{job.title}</h2>
      <p><strong>{job.company}</strong> — {job.location}</p>
      <p><strong>Type:</strong> {job.jobType} | <strong>Salary:</strong> ${job.salary}</p>
      <p style={{ marginTop: '1rem' }}>{job.description}</p>

     <button className="btn" onClick={handleApply} style={{ marginTop: '1.5rem' }}>
        Apply
      </button>

      {applyMessage && <p style={{ marginTop: '1rem' }}>{applyMessage}</p>}
    </div>
  );
}

export default JobDetails;