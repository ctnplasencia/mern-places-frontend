import React, { useState, useCallback } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import Users from './pages/Users';
import NewPlace from './pages/NewPlace';
import UpdatePlace from './pages/UpdatePlace';
import MainNavigation from './components/MainNavigation/MainNavigation';
import UserPlaces from './pages/UserPlaces';
import { AuthContext } from './context/auth-context';
import Auth from './pages/Auth/Auth';

const App = () => {

  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token) => {
    setToken(token);
    localStorage.setItem('userData', JSON.stringify({userId: uid, token: token }));
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path='/' exact> <Users /> </Route>
        <Route path='/:userId/places' exact> <UserPlaces /> </Route>
        <Route path='/places/new' exact> <NewPlace /> </Route>
        <Route path='/places/:placeId'> <UpdatePlace /> </Route>
        <Redirect to='/' />
      </Switch>

    );
  } else {
    routes = (
      <Switch>
        <Route path='/' exact> <Users /> </Route>
        <Route path='/:userId/places' exact> <UserPlaces /> </Route>
        <Route path='/auth'> <Auth /> </Route>
        <Redirect to='/auth' />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}>
      <BrowserRouter>
        <MainNavigation />
        <main>
          {routes}
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;