import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthTest from './HomePage/AuthTest';
import LandingPage from './HomePage/LandingPage';
import Feed from './HomePage/Feed';
import Createpost from './HomePage/Createpost';
import PostThread from './HomePage/PostThread'; // Adjust the path accordingly

function App() {
  return (
    <div>
       <Router>
      <Routes>
        <Route path="/" element={<Feed />} /> 
        <Route path="/post/:id" element={<PostThread />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
