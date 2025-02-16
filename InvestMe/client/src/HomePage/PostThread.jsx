import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PostThread() {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyState, setReplyState] = useState({}); 
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [sentimentResult, setSentimentResult] = useState('');
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [sentimentError, setSentimentError] = useState('');

  // Fetch the full post details
  const fetchPost = async () => {
    try {
      console.log('Fetching post with id:', id);
      const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
      console.log('Fetched post:', res.data);
      setPost(res.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Unable to retrieve post. Please try again later.');
    } finally {
      setLoadingPost(false);
    }
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    setLoadingPost(true);
    fetchPost();
    fetchComments();
  }, [id]);

  // Handle submitting a new comment (for the main comment box)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first!');
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/posts/${id}/comments`,
        { comment: newComment }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment!');
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first!');
      return;
    }
    const replyText = replyState[parentId];
    if (!replyText) return;
    try {
      await axios.post(
        `http://localhost:5000/api/posts/${id}/comments`,
        { comment: replyText, parentId }, // Include the parentId for a reply
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Clear the reply text for that comment
      setReplyState((prevState) => ({ ...prevState, [parentId]: '' }));
      fetchComments();
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Error posting reply!');
    }
  };

  // Handle sentiment analysis
  const handleAnalyzeSentiment = async () => {
    if (!post || !post.content) return;
    setSentimentLoading(true);
    setSentimentError('');
    try {
      const res = await axios.post('http://localhost:5000/api/openai/analyze', { text: post.content });
      setSentimentResult(res.data.result);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setSentimentError('Error analyzing sentiment. Please try again.');
    } finally {
      setSentimentLoading(false);
    }
  };

  const toggleReplyForm = (commentId) => {
    setReplyState((prevState) => ({
      ...prevState,
      [commentId]: prevState[commentId] || ''
    }));
  };

  const topLevelComments = comments.filter((c) => !c.parentId);
  const getReplies = (commentId) => comments.filter((c) => c.parentId === commentId);

  if (loadingPost) return <p className="text-center py-4">Loading post...</p>;
  if (error) return <p className="text-center text-danger py-4">{error}</p>;

  return (
    <div className="container py-4">
      {post ? (
        <div className="card mb-3">
          <div className="card-body">
            <h3 className="card-title">{post.title || 'Untitled Post'}</h3>
            <p className="card-text">{post.content}</p>
            {post.mediaUrl && (
              post.mediaUrl.match(/\.(mp4|mov|webm|ogg)(\?.*)?$/i) ? (
                <video
                  src={post.mediaUrl}
                  controls
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={post.mediaUrl}
                  alt="Post Media"
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                />
              )
            )}
            <div className="mt-3">
              <button className="btn btn-secondary" onClick={handleAnalyzeSentiment} disabled={sentimentLoading}>
                {sentimentLoading ? 'Analyzing...' : 'Analyze Sentiment'}
              </button>
              {sentimentError && <p className="text-danger mt-2">{sentimentError}</p>}
              {sentimentResult && (
                <div className="alert alert-info mt-2">
                  <strong>Sentiment Analysis:</strong> {sentimentResult}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center py-4">Post not found.</p>
      )}

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="mb-3">Add a Comment</h5>
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Post Comment
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="mb-3">Comments</h5>
          {topLevelComments.length > 0 ? (
            topLevelComments.map((cmt) => (
              <div key={cmt._id} className="mb-3">
                <div>
                  <strong>{cmt.userId?.username || 'Anonymous'}: </strong>
                  {cmt.comment}
                </div>
                <button
                  className="btn btn-sm btn-link"
                  onClick={() => toggleReplyForm(cmt._id)}
                >
                  Reply
                </button>
                {/* If a reply form is toggled open for this comment */}
                {replyState.hasOwnProperty(cmt._id) && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, cmt._id)}
                    className="mt-2 ms-4"  // Indented reply form
                  >
                    <div className="mb-2">
                      <textarea
                        className="form-control form-control-sm"
                        placeholder="Write a reply..."
                        value={replyState[cmt._id]}
                        onChange={(e) =>
                          setReplyState((prevState) => ({
                            ...prevState,
                            [cmt._id]: e.target.value
                          }))
                        }
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-sm btn-primary">
                      Post Reply
                    </button>
                  </form>
                )}
                {/* Display replies for this comment, indented */}
                {getReplies(cmt._id).map((reply) => (
                  <div key={reply._id} className="ms-4 mt-2" style={{ borderLeft: '2px solid #eee', paddingLeft: '10px' }}>
                    <strong>{reply.userId?.username || 'Anonymous'}: </strong>
                    {reply.comment}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-muted">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostThread;
