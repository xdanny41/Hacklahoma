import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewsFeed from './NewsFeed';
import Watchlist from './Watchlist';
import Feed from './Feed';
import PortfolioCard from './PortfolioCard';



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
  ];

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT SIDEBAR WITH WATCHLIST */}
  
        <div className="col-3 bg-light d-flex flex-column align-items-start py-3">
        <PortfolioCard />

          <Watchlist />
        </div>
        
        {/* CENTER FEED */}
       <div className="col-6 border-start border-end" id="feed" style={{ overflowY: 'auto' }}>
        <Feed></Feed>
        </div> 
        
        {/* RIGHT SIDEBAR WITH NEWS FEED */}
        <div className="col-3 bg-light d-flex flex-column align-items-start py-3">
          <h6 className="mb-3"> </h6>
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;