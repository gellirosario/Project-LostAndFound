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
        name: 'Chat',
        url: '/chat',
        icon: 'icon-speech',
      },
      {
        name: 'Summary Report',
        url: '/report/summary',
        icon: 'icon-pie-chart',
      },
      {
        name: 'Individual Report',
        url: '/report/individual',
        icon: 'icon-chart',
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
  