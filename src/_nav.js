export default {
    items: [
      {
        name: 'Home',
        url: '/home',
        icon: 'icon-speedometer',
        badge: {
          variant: 'info',
        },
      },
      {
        name: 'Statistics',
        url: '/statistics',
        icon: 'icon-pie-chart',
      },
      {
        title: true,
        name: 'Profile',
        wrapper: {            // optional wrapper object
          element: '',        // required valid HTML5 element tag
          attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
        },
        class: ''             // optional class names space delimited list for title item ex: "text-center"
      },
      {
        name: 'View Profile',
        url: '/profile',
        icon: 'icon-user',
      },
      {
        name: 'Edit Profile',
        url: '/profile/edit',
        icon: 'icon-pencil',
      },
      {
        title: true,
        name: 'Games',
        wrapper: {
          element: '',
          attributes: {},
        },
      },
      {
        name: 'Card Match',
        url: '/game/cardgame',
        icon: 'icon-puzzle'
      },
      {
        name: 'Whack A Mole',
        url: '/game/molegame',
        icon: 'icon-ghost',
      },
      {
        name: 'Simon Says',
        url: '/game/simongame',
        icon: 'icon-grid'
      },
      {
        divider: true,
      },
      {
        title: true,
        name: 'Account',
      },
      {
        name: 'Login',
        url: '/login',
        icon: 'icon-star',
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'icon-star',
      },
      {
        name: '404 (extra)',
        url: '/404',
        icon: 'icon-star',
      },
    ],
  };
  