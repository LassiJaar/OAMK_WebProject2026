import NowPlaying from './NowPlaying';
import ForYou from './MovieAlgorithm/ForYou';
import Welcome from './Welcome';
import RecentReviews from './RecentReviews';
import HomeClubs from './HomeClubs';

const HomeView = () => {
  return (
    <main>
      <Welcome />
      <NowPlaying />
      <RecentReviews />
      <ForYou />
      <HomeClubs />
    </main>
  );
};

export default HomeView;
