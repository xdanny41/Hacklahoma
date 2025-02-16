import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsFeed.css'; // Import external CSS file

function NewsFeed() {
    const [news, setNews] = useState([]);
    const API_KEY = 'nTlnKgjdI06vCcmTgSwpqpbXy7HDjmSOL4YvybAs'; // Replace with your MarketAux API key

    useEffect(() => {
        fetchNews();
    }, []);

    // Fetch news from the API and store it in localStorage
    const fetchNews = async () => {
      const cachedNews = localStorage.getItem("newsData");
      
      if (cachedNews) {
          setNews(JSON.parse(cachedNews));
      } else {
          try {
              const response = await axios.get(`https://api.marketaux.com/v1/news/all`, {
                  params: {
                    api_token: API_KEY,
                    symbols: 'AAPL,TSLA,GOOGL', // Example symbols
                    countries: 'us',
                    language: 'en',
                    limit: 3 //Default basic plan is 3
                   }
              });
              localStorage.setItem("newsData", JSON.stringify(response.data.data));
              setNews(response.data.data);
          } catch (error) {
              console.error('Error fetching news:', error);
          }
      }
  };

  // Truncate title if it exceeds maxLength
  const truncateTitle = (title, maxLength = 50) => {
    return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
  };

  
    // Uncomment the following function to new fetch news from the API
  /*() USE THIS FOR ACTUAL API
    const fetchNews = async () => {
        try {
            const response = await axios.get(`https://api.marketaux.com/v1/news/all`, {
                params: {
                  api_token: API_KEY,
                  symbols: 'AAPL,TSLA,GOOGL', // Example symbols
                  countries: 'us',
                  language: 'en',
                  sort: 'sentiment_avg',
                  sort_order: 'asc',
                  limit: 3 //Default basic plan is 3
                }
            });
            setNews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };*/

    return (
        <div className="news-feed">
            <h2 className="news-title">Top Trending Financial News</h2>
            <ul className="news-list">
                {news.map((article, index) => (
                    <li key={index} className="news-item">
                        <img className="news-image" src={article.image_url} alt={article.title} />
                        <a 
                          className="news-link" 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title={article.title} // Full title appears on hover
                        >
                          {truncateTitle(article.title, 50)}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NewsFeed;
