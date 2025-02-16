import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PostThread() {
  const { id } = useParams(); // Extract the post ID from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  // replyState will track which comment (by its _id) is currently being replied to
  const [replyState, setReplyState] = useState({}); // key: commentId, value: reply text
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);

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
        { comment: newComment }, // no parentId means it's a top-level comment
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment!');
    }
  };

  // Handle submitting a reply to a specific comment
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

  // Helper to toggle the reply form for a comment
  const toggleReplyForm = (commentId) => {
    setReplyState((prevState) => ({
      ...prevState,
      [commentId]: prevState[commentId] || ''
    }));
  };

  // Organize comments into a tree structure if using parentId
  // For simplicity, we'll assume comments with no parentId are top-level,
  // and replies have a parentId matching a top-level comment's _id.
  const topLevelComments = comments.filter((c) => !c.parentId);
  const getReplies = (commentId) =>
    comments.filter((c) => c.parentId === commentId);

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
