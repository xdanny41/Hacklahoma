import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  // Sample data to simulate “tweets” about stocks
  const samplePosts = [
    {
      id: 1,
      username: '@traderJoe',
      content: 'Apple stock might explode next quarter! 🚀 #AAPL',
      timestamp: '2m'
    },
    {
      id: 2,
      username: '@investorJane',
      content: 'Just bought some TSLA on the dip. Holding long. #TSLA #EV',
      timestamp: '10m'
    },
    {
      id: 3,
      username: '@stockGuru',
      content: 'Watch out for upcoming earnings on $NFLX. #FAANG',
      timestamp: '1h'
    },
    // Add more sample data as needed...
  ];

  return (
    <div className="container-fluid vh-100">
      {/* If you want a fixed top navbar, place it here */}
      <div className="row h-100">
        
        {/* LEFT SIDEBAR */}
        <div className="col-2 bg-light d-flex flex-column align-items-start py-3">
          <h4 className="mb-4">Logo/Brand</h4>
          {/* Potential nav items, e.g. */}
          <nav className="nav flex-column">
            <a className="nav-link active" href="#home">
              Home
            </a>
            <a className="nav-link" href="#profile">
              Profile
            </a>
            <a className="nav-link" href="#settings">
              Settings
            </a>
          </nav>
        </div>
        
        {/* CENTER FEED */}
        <div className="col-8 border-start border-end" style={{ overflowY: 'auto' }}>
          <div className="py-3 px-3">
            <h5>Home</h5>
          </div>
          <hr />
          
          {/* List of posts */}
          <div className="px-3">
            {samplePosts.map((post) => (
              <div key={post.id} className="mb-4">
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">{post.username}</span>
                  <span className="text-muted small">{post.timestamp}</span>
                </div>
                <div>{post.content}</div>
                <hr />
              </div>
            ))}
          </div>
        </div>
        
        {/* RIGHT SIDEBAR */}
        <div className="col-2 bg-light d-flex flex-column align-items-start py-3">
          <h6 className="mb-3">Trending Stocks</h6>
          <ul className="list-unstyled">
            <li>
              <a href="#AAPL" className="text-decoration-none">AAPL</a>
            </li>
            <li>
              <a href="#TSLA" className="text-decoration-none">TSLA</a>
            </li>
            <li>
              <a href="#AMZN" className="text-decoration-none">AMZN</a>
            </li>
            <li>
              <a href="#NFLX" className="text-decoration-none">NFLX</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
