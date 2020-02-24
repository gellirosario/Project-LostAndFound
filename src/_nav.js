export default {
    items: [
      {
        name: 'Home',
        url: '/home',
        icon: 'icon-list',
        badge: {
          variant: 'info',
        },
      },
      {
        name: 'Summary Report',
        url: '/report/summary',
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
        children: [
          {
            name: 'Edit Profile',
            url: '/profile/edit',
            icon: 'icon-pencil'
          }
        ]
      },
      {
        name: 'Personal Report',
        url: '/profile/report',
        icon: 'icon-chart',
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
        url: '/game/matchgame',
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
        name: 'Logout',
        url: '/logout',
        icon: 'icon-star',
      }
    ],
  };
  