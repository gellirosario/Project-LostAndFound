import React from 'react';

const MoleGame = React.lazy(() => import('./components/mole-game/MoleGame'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/game', exact: true, name: 'Game' },
  { path: '/game/molegame', name: 'Whack A Mole', component: MoleGame },
];

export default routes;
