import React from 'react';
import NowPlaying from './NowPlaying';
import ForYou from './MovieAlgorithm/ForYou';
import styles from './Main.module.css';

const HomeView = () => {
  return (
    <>
        <NowPlaying></NowPlaying>
        <ForYou></ForYou>
    </>
  );
};

export default HomeView;