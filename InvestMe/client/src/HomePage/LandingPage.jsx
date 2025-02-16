import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewsFeed from './NewsFeed';
import Watchlist from './Watchlist';
import Feed from './Feed';
import PortfolioCard from './PortfolioCard';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../Styling/Lottie2.json';


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
    <div className="container-fluid vh-100" style={{backgroundColor:'black'}}>
      <div className="row h-100">
        {/* LEFT SIDEBAR WITH WATCHLIST */}
  
        <div className="col-3 d-flex flex-column align-items-start py-3" style={{backgroundColor:'#001f3f'}}>
         

        <PortfolioCard />
      <span style={{marginLeft:'115px'}}>
      <Player
                  autoplay
                  loop
                  src={animationData}
                  style={{ height: '150px', width: '200px' }}
                />
     </span> 
                  
                         <Watchlist />
        </div>
        
        {/* CENTER FEED */}
       <div className="col-6 " id="feed" style={{ overflowY: 'auto' , backgroundColor:'#001f3f'}}>
        <Feed></Feed>
        </div> 
        
        {/* RIGHT SIDEBAR WITH NEWS FEED */}
        <div className="col-3  d-flex flex-column align-items-start py-3" style={{backgroundColor:'#001f3f'}}>
          <h6 className="mb-3"> </h6>
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;