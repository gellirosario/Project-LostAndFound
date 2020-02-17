import React from 'react';

const MainPage = React.lazy(() => import('./components/views/Main'));
const MoleGame = React.lazy(() => import('./components/mole-game/MoleGame'));
const MatchGame = React.lazy(() => import('./components/match-game/MatchGame'));
const SimonGame = React.lazy(() => import('./components/simonsays-game/SimonGame'));
const SummaryReport = React.lazy(() => import('./components/views/SummaryReport'));
const PersonalReport = React.lazy(() => import('./components/views/PersonalReport'));

const routes = [
  { path: '/', exact: true, name: 'Home' , component: MainPage},
  { path: '/game', exact: true, name: 'Game' },
  { path: '/game/molegame', name: 'Whack A Mole', component: MoleGame },
  { path: '/game/matchgame', name: 'Card Match', component: MatchGame },
  { path: '/game/simongame', name: 'Simon Says', component: SimonGame},
  { path: '/report/summary', name: 'Summary Report', component: SummaryReport},
  { path: '/profile/report', name: 'Personal Report', component: PersonalReport},
];

export default routes;
