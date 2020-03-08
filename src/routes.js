import React from 'react';

const MainPage = React.lazy(() => import('./components/views/Main'));
const Page404 = React.lazy(() => import('./components/views/404'));
const MoleGame = React.lazy(() => import('./components/mole-game/MoleGame'));
const MatchGame = React.lazy(() => import('./components/match-game/MatchGame'));
const SimonGame = React.lazy(() => import('./components/simonsays-game/SimonGame'));
const SummaryReport = React.lazy(() => import('./components/views/SummaryReport'));
const PersonalReport = React.lazy(() => import('./components/views/PersonalReport'));
const Profile = React.lazy(() => import('./components/views/Profile'));
const Logout = React.lazy(() => import('./components/views/Logout'));
const Chat = React.lazy(() => import('./components/chat/Chat'));

const routes = [
  { path: '/home', exact: true, name: 'Home' , component: MainPage},
  { path: '/chat', exact: true, name: 'Chat' , component: Chat},
  { path: '/404', exact: true, name: '404' , component: Page404},
  { path: '/logout', component: Logout },
  { path: '/game/molegame', name: 'Whack A Mole', component: MoleGame },
  { path: '/game/matchgame', name: 'Card Match', component: MatchGame },
  { path: '/game/simongame', name: 'Simon Says', component: SimonGame},
  { path: '/report/summary', name: 'Summary Report', component: SummaryReport},
  { path: '/profile/report', name: 'Personal Report', component: PersonalReport},
  { path: '/profile/view', name: 'Profile', component: Profile },
];

export default routes;
