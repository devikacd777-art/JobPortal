import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({});

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleApply = async (jobId) => {
  if (!token) {
    navigate('/login');
    return;
  }
  try {
    await axios.post(
      'http://localhost:5000/api/applications',
      { jobId, resumeUrl: 'https://example.com/myresume.pdf' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessage({ ...message, [jobId]: 'Applied successfully!' });
  } catch (err) {
    setMessage({ ...message, [jobId]: err.response?.data?.message || 'Error applying' });
  }
};
 if (loading) return <p style={{ padding: '2rem' }}>Loading jobs...</p>;

 return (
    <>
      <div className="hero-banner">
        <h1>Find Your Next Opportunity</h1>
        <p>Browse open roles from companies actively hiring right now</p>
      </div>

      <div className="page" style={{ maxWidth: '1000px' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Latest Openings</h2>
      {jobs.length === 0 && <p>No jobs posted yet.</p>}

        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <h3><Link to={`/jobs/${job._id}`}>{job.title}</Link></h3>
              <p className="job-meta">{job.company} — {job.location}</p>
              <p className="job-desc">{job.description}</p>
              <p className="job-tags">
                <span className="tag">{job.jobType}</span>
                {job.salary && <span className="tag tag-salary">${job.salary}</span>}
              </p>

              <button className="btn" onClick={() => handleApply(job._id)}>
                Apply
              </button>
              {message[job._id] && <p style={{ marginTop: '0.5rem' }}>{message[job._id]}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;