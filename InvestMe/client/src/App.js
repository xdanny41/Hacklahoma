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
import RegistrationPage from './HomePage/RegistrationPage';
import LearningCenter from './HomePage/LearningCenter';

function App() {
  return (
    <div style={{backgroundColor:'#001f3f'}}>
       <Router>
       <Navbar></Navbar>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Registration/Login page */}
        <Route path="/registration" element={<RegistrationPage />} />

        {/* User Portfolio page */}
        <Route path="/user-portfolio" element={<Portfolio />} />

        {/* Threads page for a specific post, postId is passed as a URL parameter */}
        <Route path="/post/:id" element={<PostThread />} />

        <Route path="/charts" element={<CompanyPage />} />

        <Route path="/learning" element={<LearningCenter />} />


      </Routes>
    </Router>
    </div>
  );
}

export default App;
