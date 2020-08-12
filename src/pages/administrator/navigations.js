export const getNavigations = () => {
    return {
        // Home:{
        //         display: 'Home',
        //         link: `/administrator/home`,
        //         title: 'Home',
        //         icon: 'home',
        //         highlightedIcon: 'home-highlighted'
        //         child: []
        // },
        COMPANY: {
            display: 'Company',
            link: '/administrator/company-list',
            title: 'Company',
            icon: 'home',
            highlightedIcon: 'home-highlighted',
            active: false,
            child: []
        },
        PRODUCT: {
            display: 'Product',
            link: '/administrator/product/department',
            title: 'Department',
            icon: 'home',
            highlightedIcon: 'home-highlighted',
            active: false,
            child: [
                {
                    display: 'Department',
                    link: '/administrator/product/department',
                    title: 'Department',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                {
                    display: 'Variants',
                    link: '/administrator/product/variants',
                    title: 'Variants',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }
            ]
        },
        // PLANS: [
        // {
        //     display: 'Subscription Plans',
        //     link: `/administrator/subscription-plans`,
        //     title: 'Subscription Plans',
        //     icon: 'home',
        //     highlightedIcon: 'home-highlighted'
        // }
        // ],
        USER_MANAGEMENT: {
            display: 'Admin User Access',
            link: '/administrator/user-management',
            title: 'User Management',
            icon: 'team',
            highlightedIcon: 'team-highlighted',
            active: false,
            child: []
        },
        TICKETS: {
            display: 'Support Center',
            link: '/administrator/support',
            title: 'Support Center',
            icon: 'home',
            highlightedIcon: 'home-highlighted',
            active: false,
            child: []
        },
        SETTINGS: {
            display: 'Settings',
            link: '/administrator/settings',
            title: 'Settings',
            icon: 'settings',
            highlightedIcon: 'settings-highlighted',
            active: false,
            child: []
        }
    };
};
