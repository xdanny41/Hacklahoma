import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsFeed.css'; // Import external CSS file

function NewsFeed() {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 5;
    const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY; // Replace with your MarketAux API key

    useEffect(() => {
        fetchNews();
    }, []);

    // Fetch news from the API and store it in localStorage
    const fetchNews = async () => {
        try {
            const response = await axios.get(`https://finnhub.io/api/v1/news`, {
                params: {
                    category: 'general', // Fetch general financial news
                    token: API_KEY,
                }
            });
            setNews(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    // Truncate title if it exceeds maxLength
    const truncateTitle = (title, maxLength = 50) => {
        return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
    };

    // Adding pages to news feed
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(news.length / articlesPerPage);

    const nextPage = () => {
        if (indexOfLastArticle < news.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="news-feed">
            <h2 className="news-title">Top Trending Financial News</h2>
            <ul className="news-list">
                {currentArticles.map((article, index) => (
                    <li key={index} className="news-item">
                        <img className="news-image" src={article.image} alt={article.headline} />
                        <a 
                          className="news-link" 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title={article.headline} // Full title appears on hover
                        >
                          {truncateTitle(article.headline, 50)}
                        </a>
                    </li>
                ))}
            </ul>
            <div className="pagination-controls">
                <button className="pagination-button" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span className="pagination-text"> Page {currentPage} of {totalPages} </span>
                <button className="pagination-button" onClick={nextPage} disabled={currentPage >= totalPages}>Next</button>
            </div>
        </div>
    );
}

export default NewsFeed;