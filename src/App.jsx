import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Main from './components/Main';
import AccountProvider from './context/AccountProvider';

function App() {
  return (
    <AccountProvider>
      <BrowserRouter>
        <Main></Main>
      </BrowserRouter>
    </AccountProvider>
  );
}

export default App;
