import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './HomePage/LandingPage';
import Feed from './HomePage/Feed';
import Createpost from './HomePage/Createpost';
import PostThread from './HomePage/PostThread'; // Adjust the path accordingly
import Portfolio from './HomePage/UserPortfolio';
import CompanyPage from './HomePage/CompanyPage';
import Navbar from './HomePage/navbar';


function App() {
  return (
    <div>

       <Router>
       <Navbar></Navbar>
       <LandingPage />
      <Routes>
      <Route path="/" element={<Feed />} /> 
        <Route path="/post/:id" element={<PostThread />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
