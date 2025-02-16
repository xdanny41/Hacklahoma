import React, { useState } from 'react';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting post with title:', title);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first!');
        return;
      }

      setUploading(true);
      let mediaUrl = '';

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

      const payload = { title, content, mediaUrl };
      console.log('Payload being sent:', payload);

      const response = await axios.post(
        'http://localhost:5000/api/posts',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Post creation response:', response.data);
      setTitle('');
      setContent('');
      setFile(null);
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Error creating post!');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  return (
    <div className="accordion mb-3" id="createPostAccordion">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingCreatePost">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseCreatePost"
            aria-expanded="false"
            aria-controls="collapseCreatePost"
          >
            Create a Post
          </button>
        </h2>
        <div
          id="collapseCreatePost"
          className="accordion-collapse collapse"
          aria-labelledby="headingCreatePost"
          data-bs-parent="#createPostAccordion"
        >
          <div className="accordion-body">
            <form onSubmit={handleSubmit}>
              {/* Title Input */}
              <div className="mb-3">
                <input
                  name="title"
                  type="text"
                  className="form-control"
                  placeholder="Post Title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    console.log('Updated title:', e.target.value);
                  }}
                  required
                />
              </div>
              {/* Content Input */}
              <div className="mb-3">
                <textarea
                  name="content"
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
      </div>
    </div>
  );
}

export default CreatePost;
