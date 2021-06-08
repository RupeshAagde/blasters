/* title should be same as the url trailing word or a part of it */

export const getNavigations = () => {
    return [
        {
            display: 'Company',
            link: '/administrator/company-list',
            title: 'company',
            icon: 'home',
            highlightedIcon: 'home-highlighted',
            active: false,
            permission: 'company',
            children: []
        },
        {
            display: 'Admin User Access',
            link: '/administrator/user-management',
            title: 'user',
            icon: 'team',
            highlightedIcon: 'team-highlighted',
            active: false,
            permission: 'admin-access',
            children: []
        },
        {
            display: 'Product',
            link: '/administrator/product/attributes',
            title: 'product',
            icon: 'productsv2',
            highlightedIcon: 'home-highlighted',
            active: false,
            permission: 'product',
            children: [
                {
                    display: 'Attributes',
                    link: '/administrator/product/attributes',
                    title: 'attributes',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                {
                    display: 'Category',
                    link: '/administrator/product/category',
                    title: 'category',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                {
                    display: 'Templates',
                    link: '/administrator/product/templates',
                    title: 'templates',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                {
                    display: 'Departments',
                    link: '/administrator/product/department',
                    title: 'department',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                {
                    display: 'Variants',
                    link: '/administrator/product/variants',
                    title: 'variants',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }
            ]
        },
        {
            display: 'Integrations',
            link: '/administrator/integrations/list',
            title: 'integrations',
            icon: 'team',
            highlightedIcon: 'team-highlighted',
            active: false,
            permission: 'admin-access',
            children: []
        },
        {
            display: 'Extension Review',
            link: '/administrator/extensions/review',
            title: 'extensons',
            icon: 'settings',
            highlightedIcon: 'settings-highlighted',
            active: false,
            permission: 'settings',
            children: []
        },
        {
            display: 'Subscription',
            link: '/administrator/subscription/invoices',
            title: 'invoice',
            icon: 'support-icon',
            highlightedIcon: 'home-highlighted',
            active: false,
            permission: 'admin-access',
            children: [
                {
                    display: 'Invoices',
                    link: '/administrator/subscription/invoices',
                    title: 'invoice',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }
            ]
        },
        {
            display: 'Support Center',
            link: '/administrator/support',
            title: 'support',
            icon: 'support-icon',
            highlightedIcon: 'home-highlighted',
            active: false,
            permission: 'support',
            children: []
        },
        {
            display: 'Settings',
            link: '/administrator/settings',
            title: 'settings',
            icon: 'settings',
            highlightedIcon: 'settings-highlighted',
            active: false,
            permission: 'settings',
            children: []
        }
    ];
};
