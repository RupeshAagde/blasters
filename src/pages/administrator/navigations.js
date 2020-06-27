export const getNavigations = () => {
  return {
    Home: [
      {
        display: 'Home',
        link: `/administrator/home`,
        title: 'Home',
        icon: 'home',
        highlightedIcon: 'home-highlighted'
      }
    ],
    PLANS: [
      {
        display: 'Plans',
        link: `/administrator/plans`,
        title: 'Plans',
        icon: 'home',
        highlightedIcon: 'home-highlighted'
      }
    ],
    COMPONENTS: [
      {
        display: 'Plan Components',
        link: `/administrator/components`,
        title: 'Plan Components',
        icon: 'home',
        highlightedIcon: 'home-highlighted'
      }
    ],
    COMPANY: [
      {
        display: 'Company',
        link: '/administrator/company-list',
        title: 'Company',
        icon: 'home',
        highlightedIcon: 'home-highlighted'
      }
    ]
  };
};
