export const getNavigations = () => {
    return {
        // Home: [
        //     {
        //         display: 'Home',
        //         link: `/administrator/home`,
        //         title: 'Home',
        //         icon: 'home',
        //         highlightedIcon: 'home-highlighted'
        //     }
        // ],
        COMPANY: [
            {
                display: 'Company',
                link: '/administrator/company-list',
                title: 'Company',
                icon: 'home',
                highlightedIcon: 'home-highlighted'
            }
        ],
        PLANS: [
            // {
            //     display: 'Subscription Plans',
            //     link: `/administrator/subscription-plans`,
            //     title: 'Subscription Plans',
            //     icon: 'home',
            //     highlightedIcon: 'home-highlighted'
            // }
        ],
        USER_MANAGEMENT: [
            {
                display: 'Admin User Access',
                link: '/administrator/user-management',
                title: 'User Management',
                icon: 'team',
                highlightedIcon: 'team-highlighted'
            }
        ],
        PRODUCTS: [
            {
                display: 'Product',
                link: '/administrator/product',
                title: 'Product',
                icon: 'productsv2',
                highlightedIcon: 'productsv2-highlighted'
            }
        ],
        TICKETS: [
            {
                display: 'Support Center',
                link: '/administrator/support',
                title: 'Support Center',
                icon: 'home',
                highlightedIcon: 'home-highlighted'
            }
        ],
        SETTINGS: [
            {
                display: 'Settings',
                link: '/administrator/settings',
                title: 'Settings',
                icon: 'settings',
                highlightedIcon: 'settings-highlighted'
            }
        ]
    };
};
