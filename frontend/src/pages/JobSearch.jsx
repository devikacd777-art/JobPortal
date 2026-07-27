import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function JobSearch() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [jobs, setJobs] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (title) params.title = title;
      if (location) params.location = location;
      if (company) params.company = company;

      const res = await axios.get('http://localhost:5000/api/jobs', { params });
      setJobs(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Search Jobs</h2>

     <form onSubmit={handleSearch} className="form-row" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
         
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          
        />
        <button type="submit" className="btn">Search</button>
      </form>

      {loading && <p>Searching...</p>}

      {searched && !loading && jobs.length === 0 && <p>No jobs found matching your search.</p>}

      {jobs.map((job) => (
        <div key={job._id} className="card">
          <h3>
            <Link to={`/jobs/${job._id}`}>
              {job.title}
            </Link>
          </h3>
          <p>{job.company} — {job.location}</p>
          <p><strong>Type:</strong> {job.jobType} {job.salary && `| Salary: $${job.salary}`}</p>
        </div>
      ))}
    </div>
  );
}

export default JobSearch;