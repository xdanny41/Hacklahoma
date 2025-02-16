import React, { useState } from 'react';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first!');
        return;
      }

      setUploading(true);
      let mediaUrl = '';

      // If a file is selected, upload it to Firebase Storage first.
      if (file) {
        const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Optionally, update progress here.
            },
            (error) => reject(error),
            () => resolve()
          );
        });

        mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
      }

      // Send title, content, and mediaUrl to your back end.
      const response = await axios.post(
        'http://localhost:5000/api/posts',
        { title, content, mediaUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data);
      setTitle('');
      setContent('');
      setFile(null);
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error(err);
      alert('Error creating post!');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Create a Post</h5>
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {/* Content Input */}
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Post Body"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          {/* File Upload */}
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
