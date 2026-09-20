import { Routes, Route } from 'react-router';
import Topbar from './Topbar';
import styles from './Main.module.css';
import Search from './Search';
import Clubs from './Clubs';
import NowPlaying from './NowPlaying';
import Signup from './Signup';
import Signin from './Signin';
import Account from './Account';
import MovieDetail from './MovieDetail';
import ProtectedRoute from './ProtectedRoute';

const Main = () => {
  return (
    <div>
      <Topbar></Topbar>

      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<NowPlaying></NowPlaying>}></Route>
          <Route path="/search" element={<Search></Search>}></Route>
          <Route path="/movie/:id" element={<MovieDetail></MovieDetail>}></Route>
          <Route path="/clubs" element={<Clubs></Clubs>}></Route>
          <Route path="/clubs/:id" element={<p>single</p>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/signin" element={<Signin></Signin>}></Route>
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route path="/account" element={<Account></Account>}></Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
};
export default Main;
