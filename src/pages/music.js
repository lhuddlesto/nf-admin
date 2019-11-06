import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrackCard from '../components/trackCard';

const Music = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:5000/music');
      setTracks(res.data);
    }
    fetchData();
  });

  const createTracks = () => {
    return tracks.map(data => {
      return (
        <div className="box">
          <article className="media">
            <div className="media-left">
              <figure className="image is-128x128">
                <img src={data.imageUrl} alt={`img-${data.trackTitle}`} />
              </figure>
            </div>
            <TrackCard
              trackTitle={data.trackTitle}
              genre={data.genre}
              isPublic={data.isPublic}
              mood={data.mood}
              price={data.price}
              trackUrl={data.trackUrl}
              coverUrl={data.imageUrl}
            />
          </article>
        </div>
      );
    });
  };

  return (
    <div>
      <h1 align="center" className="title is-1">
        Latest Tracks
      </h1>
      <div className="container">{createTracks()}</div>
    </div>
  );
};

export default Music;