export const getNavigations = (route) => {
  const { partnerId } = route.params
  return {
    Home: [
      {
        display: 'Home',
        link: `/partner/${partnerId}/home`,
        title: 'Home',
        icon: 'home',
        highlightedIcon: 'home-highlighted'
      }
    ],
    Applications: [
      {
        display: 'Applications',
        link: `/partner/${partnerId}/applications`,
        title: 'Applications',
        icon: 'application',
        highlightedIcon: 'application-highlighted',
        desc: `Create new websites and manage omnichannel business through its admin panel`
      }
    ],
    Themes: [
      {
        display: 'Themes',
        link: `/partner/${partnerId}/themes`,
        title: 'themes',
        icon: 'team',
        highlightedIcon: 'team-highlighted',
        desc: `Create themes and handle the aesthetic look & feel of your application`
      }
    ],
    Team: [
      {
        display: 'Team',
        link: `/partner/${partnerId}/team`,
        title: 'Team',
        icon: 'team',
        highlightedIcon: 'team-highlighted',
        desc: `Assemble qualified individuals on-board to aptly run your business`
      }
    ],
    // Plugins: [
    //   {
    //     display: 'Plugins',
    //     link: `/partner/${partnerId}/plugins`,
    //     title: 'plugins',
    //     icon: 'team',
    //     highlightedIcon: 'team-highlighted'
    //   }
    // ],
    // MiniApps: [
    //   {
    //     display: 'Mini Apps',
    //     link: `/partner/${partnerId}/miniapps`,
    //     title: 'mini apps',
    //     icon: 'team',
    //     highlightedIcon: 'team-highlighted'
    //   }
    // ],
    Settings: [
      {
        display: 'Settings',
        link: `/partner/${partnerId}/settings`,
        title: 'Settings',
        icon: 'settings',
        highlightedIcon: 'settings-highlighted',
        desc: `Manage all the core configurations of a merchant's retail application`
      }
    ]
    // Influencers: [
    //   {
    //     display: 'Influencers',
    //     link: `/partner/${partnerId}/influencers`,
    //     title: 'influencers',
    //     icon: 'settings',
    //     highlightedIcon: 'settings-highlighted'
    //   }
    // ],
    // Documentation: [
    //   {
    //     display: 'Documentation',
    //     link: `/partner/${partnerId}/documentation`,
    //     title: 'documentation',
    //     icon: 'settings',
    //     highlightedIcon: 'settings-highlighted'
    //   }
    // ]
  }
}
