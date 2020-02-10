import React from 'react';

const MainPage = React.lazy(() => import('./components/views/Main'));
const MoleGame = React.lazy(() => import('./components/mole-game/MoleGame'));
const MatchGame = React.lazy(() => import('./components/match-game/MatchGame'));

const routes = [
  { path: '/', exact: true, name: 'Home' , component: MainPage},
  { path: '/game', exact: true, name: 'Game' },
  { path: '/game/molegame', name: 'Whack A Mole', component: MoleGame },
  { path: '/game/matchgame', name: 'Card Match', component: MatchGame },
];

export default routes;
