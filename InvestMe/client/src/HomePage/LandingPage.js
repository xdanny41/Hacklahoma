import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
 watchlist
import NewsFeed from '../HomePage/NewsFeed';
import Watchlist from '../HomePage/Watchlist';

 Development

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
 watchlist

    // Add more sample data as needed...
 Development
  ];

  return (
    <div className="container-fluid vh-100">
 watchlist
      <div className="row h-100">
        {/* LEFT SIDEBAR WITH WATCHLIST */}
        <div className="col-3 bg-light d-flex flex-column align-items-start py-3">
          <h4 className="mb-4">Logo/Brand</h4>
          <nav className="nav flex-column">
            <a className="nav-link active" href="#home">Home</a>
            <a className="nav-link" href="#profile">Profile</a>
            <a className="nav-link" href="#settings">Settings</a>
          </nav>
          <h6 className="mt-4"> </h6>
          <Watchlist />
        </div>
        
        {/* CENTER FEED */}
        <div className="col-6 border-start border-end" style={{ overflowY: 'auto' }}>

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
 Development
          <div className="py-3 px-3">
            <h5>Home</h5>
          </div>
          <hr />
 watchlist

          
          {/* List of posts */}
 Development
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
        
 watchlist
        {/* RIGHT SIDEBAR WITH NEWS FEED */}
        <div className="col-3 bg-light d-flex flex-column align-items-start py-3">
          <h6 className="mb-3"> </h6>
          <NewsFeed />

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
 Development
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
