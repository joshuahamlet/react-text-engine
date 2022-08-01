import React from 'react';
import './index.css';
import './Components/components.css';
import Game from './Game';
import Intro from './Intro';
import Help from './Help'
import { Switch, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Modal from './Components/Modal/Modal';

const App = () => {
  const location = useLocation();

  return (
    <>
    <Modal/>
    <AnimatePresence exitBeforeEnter initial={false}>
      <Switch location={location} key={location.pathname}>
        <Route exact path='/'>
          <Intro />
        </Route>
        <Route path='/game'>
          <Game />
        </Route>
        <Route path='/help'>
          <Help />
        </Route>
      </Switch>
      </AnimatePresence>
    </>
  );
};

export default App;
