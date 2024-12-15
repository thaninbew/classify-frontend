import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './userProfile.css';

const UserProfile = ({ accessToken }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) {
        setError('Access token not provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch user profile data from your backend
        const response = await axios.get('http://localhost:3001/playlists/user-profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        const { displayName, profilePicture, coolFact } = response.data;

        setUserProfile({
          displayName,
          profilePicture: profilePicture || 'https://via.placeholder.com/300',
          topArtists: coolFact?.topArtists || [], 
          topTrack: coolFact?.topTrack || 'No top track',
        });
      } catch (err) {
        console.error('Error fetching user profile:', err.message);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-profile">
      <div className="container">
        <div className="sidebar">
          <button id="back-btn" onClick={() => navigate('/')}>◀</button> {/* Navigate to LandingPage */}
          <div className="top-artists">
            <h2>Your Top Artists</h2>
            <div className="artists-list">
              {userProfile.topArtists.length > 0 ? (
                userProfile.topArtists.map((artist, index) => (
                  <div key={index} className="artist-info">
                    <div className="artist-circle">
                      <img
                        src={artist.image || 'https://via.placeholder.com/50'}
                        alt={artist.name}
                        className="circle-image"
                      />
                    </div>
                    <p>{artist.name}</p>
                  </div>
                ))
              ) : (
                <p>No top artists available</p>
              )}
            </div>
          </div>
          <div className="top-tracks">
            <h2>Your Top Track</h2>
            <div className="track-info">
              <div className="track-circle">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Top Track"
                  id="top-track-picture"
                  className="circle-image"
                />
              </div>
              <p>{userProfile.topTrack}</p>
            </div>
          </div>
          <div className="go-button">
            <button id="go-btn" onClick={() => navigate('/dashboard')}>Let's Go ▶</button> {/* Navigate to Dashboard */}
          </div>
        </div>
        <div className="main">
          <div className="header">
            <h1>
              Your All Time <span className="favorites">Favorites</span>
            </h1>
          </div>
          <div className="main-circle">
            <img
              src={userProfile.profilePicture}
              alt="Profile"
              id="profile"
              className="profile-circle"
            />
            <div className="user-name">
              <p>{userProfile.displayName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
