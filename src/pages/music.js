import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import _ from 'underscore';
import Pagination from '../components/pagination/pagination';
import { AudioContext } from '../context/audioContext';
import { NavigationContext } from '../context/navigationContext';
import { ShoppingCartContext } from '../context/shoppingCartContext';
import SmallPlayer from '../components/audio-player/smallPlayer/smallPlayer';
import Sidebar from '../components/filter/sidebar';
import { SideBarPageContainer } from '../components/shared/shared';

const Main = styled.div`
  margin: 3em;
`;

const PageLayout = styled(SideBarPageContainer)`
  border-bottom: solid 2px ${props => props.theme.color.lightGrey};
  margin-bottom: 6em;
  height: auto;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  align-items: center;
`;

const Heading = styled.h3`
  font-size: 2em;
  color: ${props => props.theme.color.black};
  font-family: ${props => props.theme.font.family};
  font-weight: ${props => props.theme.font.weight};
  font-style: ${props => props.theme.font.style};
  margin-bottom: 10px;
`;

const Subheading = styled.p`
  color: ${props => props.theme.color.primaryGrey};
  font-family: ${props => props.theme.font.family};
  font-weight: ${props => props.theme.font.weight};
  font-style: ${props => props.theme.font.style};
  font-size: 1em;
  width: 50%;
  margin-bottom: 1em;
`;

const SmallPlayerWrap = styled.div`
  margin-bottom: 1em;
  width: 100%;
`;

const TrackLink = styled(Link)`
  color: black;
`;

const Music = () => {
  const [tracks, setTracks] = useState([]);
  const [moods, setMoods] = useState([]);
  const [genre, setGenre] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [bpm, setBPM] = useState([0, 200]);
  const [price, setPrice] = useState([0, 150]);
  const [pageCount, setPageCount] = useState(0);
  const [skip, setSkip] = useState(0);

  const {
    setFooterVisibility,
    playlist,
    setPlaylist,
    playing,
    message
  } = useContext(AudioContext);
  const navigationContext = useContext(NavigationContext);

  // Returns new tracks based on selected filters
  useEffect(() => {
    async function fetchFilteredTracks() {
      if (
        selectedMoods.length === 0 &&
        !selectedGenre &&
        _.difference(bpm, [0, 200].length === 0) &&
        _.difference(price, [0, 200].length === 0)
      ) {
        const res = await axios.get(`/api/music/?skip=${skip}&limit=10`);
        setTracks(res.data);
        const trackNumber = await axios.get('/api/music/count');
        return setPageCount(Math.ceil(trackNumber.data.count / 10));
      }

      const params = {
        genre: selectedGenre,
        mood: selectedMoods,
        bpm,
        price
      };

      const res = await axios.request({
        method: 'GET',
        url: `/api/music/search?skip=${skip}&limit=10`,
        params
      });
      setTracks(res.data[0]);
      console.log(res.data[1]);
      return setPageCount(Math.ceil(res.data[1] / 10));
    }
    fetchFilteredTracks();
  }, [selectedMoods, selectedGenre, bpm, price, skip]);

  // Initial fetch for tracks, sets footer visibility
  useEffect(() => {
    setFooterVisibility('auto');
    navigationContext.setBackgroundColor('auto');
    async function fetchData() {
      const res = await axios.get('/api/music');
      const trackNumber = await axios.get('/api/music/count');

      setPageCount(Math.ceil(trackNumber.data.count / 10));
      setTracks(res.data);

      if (playlist.length < 1 || !playing) {
        setPlaylist(res.data);
      }
    }
    console.log('rendered fetch data for tracks in music.js');
    fetchData();
  }, [
    navigationContext,
    playing,
    playlist.length,
    setFooterVisibility,
    setPlaylist
  ]);

  // Fetch sidebar options
  useEffect(() => {
    console.log('rerenderd sidebar');
    async function fetchData() {
      const moodData = await axios.get('/api/music/mood');
      const genreData = await axios.get('/api/music/genre');
      setMoods(moodData.data.sort());
      setGenre(genreData.data.sort());
    }
    fetchData();
  }, []);

  const handleClearAll = () => {
    setSelectedMoods([]);
    setSelectedGenre('');
    setPrice([0, 200]);
    setBPM([0, 200]);
  };

  const handleAddMood = useCallback(
    mood => {
      setSelectedMoods(selectedMoods.concat([mood]));
    },
    [selectedMoods]
  );

  const handleCheckboxChange = useCallback(
    (category, option) => {
      console.log(price);
      if (category === 'genre') {
        if (selectedGenre === option) return setSelectedGenre('');
        return setSelectedGenre(option);
      }
      if (category === 'mood') {
        if (selectedMoods.includes(option)) {
          return setSelectedMoods(
            selectedMoods.filter(item => item !== option)
          );
        }
      }
      if (category === 'price') {
        if (option[0] === price[0] && option[1] === price[1]) {
          return setPrice([0, 200]);
        }
        return setPrice(option);
      }
      return handleAddMood(option);
    },
    [price, handleAddMood, selectedGenre, selectedMoods]
  );

  const handleSelected = useCallback(
    (category, option) => {
      if (category === 'genre') {
        if (option !== selectedGenre) return false;
        return true;
      }
      if (category === 'mood') {
        if (selectedMoods.includes(option)) return true;
        return false;
      }
      if (category === 'price') {
        if (option[0] === price[0] && option[1] === price[1]) return true;
        return false;
      }
    },
    [price, selectedGenre, selectedMoods]
  );

  const createTracks = () => {
    return tracks.map(data => {
      return (
        <SmallPlayerWrap>
          <SmallPlayer
            trackTitle={data.presentationTitle}
            genre={data.genre}
            similarArtists={data.similarArtists.join(', ')}
            price={data.price}
            trackUrl={data.mp3Url || data.wavUrl}
            cover={data.imageUrl}
            duration={data.duration}
            moods={data.mood}
            id={data._id}
            route={data.trackTitle}
          />
        </SmallPlayerWrap>
      );
    });
  };

  return (
    <PageLayout division="25% 75%">
      {moods && genre && (
        <Sidebar
          moods={moods}
          genres={genre}
          handleClearAll={handleClearAll}
          handleCheckboxChange={handleCheckboxChange}
          handleSelected={handleSelected}
          handleAddMood={handleAddMood}
          bpm={bpm}
          setBPM={setBPM}
        />
      )}
      <Main>
        <Heading>{message}</Heading>
        <Subheading>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim{' '}
        </Subheading>

        <Container>
          {createTracks()}
          <Pagination
            pageCount={pageCount}
            changeHandler={e => setSkip(Number(`${e.selected}0`))}
          />
        </Container>
      </Main>
    </PageLayout>
  );
};

export default Music;
