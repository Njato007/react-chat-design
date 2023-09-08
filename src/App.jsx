import {Routes, Route, Outlet} from 'react-router-dom';
import Login from './components/Login';
import Messenger from './components/Messenger';
function App() {
  return (
    <>
      <Routes>
        <Route path='/' index element={<Login />} />
        <Route path='messenger' element={<Messenger />} />
      </Routes>
      <Outlet />
    </>
  );
}

export default App;
