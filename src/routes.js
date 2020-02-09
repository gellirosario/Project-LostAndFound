import React from 'react';

const MainPage = React.lazy(() => import('./components/views/Main'));
const MoleGame = React.lazy(() => import('./components/mole-game/MoleGame'));

const routes = [
  { path: '/', exact: true, name: 'Home' , component: MainPage},
  { path: '/game', exact: true, name: 'Game' },
  { path: '/game/molegame', name: 'Whack A Mole', component: MoleGame },
];

export default routes;
