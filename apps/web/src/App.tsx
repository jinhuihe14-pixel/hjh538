import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from './stores/userStore';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Hero from './pages/Hero/Hero';
import HeroDetail from './pages/Hero/HeroDetail';
import Battle from './pages/Battle/Battle';
import Arena from './pages/Arena/Arena';
import City from './pages/City/City';
import Bag from './pages/Bag/Bag';
import User from './pages/User/User';
import BattleReport from './pages/Battle/BattleReport';
import './App.css';

function App() {
  const { token, initAuth } = useUserStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
      
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/hero/:id" element={<HeroDetail />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/battle/report/:id" element={<BattleReport />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/city" element={<City />} />
        <Route path="/bag" element={<Bag />} />
        <Route path="/user" element={<User />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
