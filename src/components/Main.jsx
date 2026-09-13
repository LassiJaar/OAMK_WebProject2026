import { Routes, Route } from 'react-router';
import Topbar from './Topbar';
import styles from './Main.module.css';
import Search from './Search';
import Clubs from './Clubs';
import NowPlaying from './NowPlaying';

const Main = () => {
  return (
    <div>
      <Topbar></Topbar>

      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<NowPlaying></NowPlaying>}></Route>
          <Route path="/search" element={<Search></Search>}></Route>
          <Route path="/clubs" element={<Clubs></Clubs>}></Route>
          <Route path="/clubs/:id" element={<p>single</p>}></Route>
          <Route path="/account"></Route>
        </Routes>
      </div>
    </div>
  );
};
export default Main;
