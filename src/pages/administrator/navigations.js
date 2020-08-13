export const getNavigations = () => {
    return [
        // Home:{
        //         display: 'Home',
        //         link: `/administrator/home`,
        //         title: 'Home',
        //         icon: 'home',
        //         highlightedIcon: 'home-highlighted'
        //         children: []
        // },
        {
            display: 'Company',
            link: '/administrator/company-list',
            title: 'company',
            icon: 'home',
            highlightedIcon: 'home-highlighted',
            active: false,
            children: []
        },
        {
            display: 'Product',
            link: '/administrator/product/department',
            title: 'product',
            icon: 'home',
            highlightedIcon: 'home-highlighted',
            active: false,
            children: [
                {
                    display: 'Department',
                    link: '/administrator/product/department',
                    title: 'product-department',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                {
                    display: 'Variants',
                    link: '/administrator/product/variants',
                    title: 'product-variants',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }
            ]
        },
        {
            display: 'Admin User Access',
            link: '/administrator/user-management',
            title: 'user',
            icon: 'team',
            highlightedIcon: 'team-highlighted',
            active: false,
            children: []
        },
        {
            display: 'Support Center',
            link: '/administrator/support',
            title: 'support',
            icon: 'home',
            highlightedIcon: 'home-highlighted',
            active: false,
            children: []
        },
        {
            display: 'Settings',
            link: '/administrator/settings',
            title: 'settings',
            icon: 'settings',
            highlightedIcon: 'settings-highlighted',
            active: false,
            children: []
        }
    ];
};
