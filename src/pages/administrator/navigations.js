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
                    display: 'Taxation',
                    link: '/administrator/product/taxation',
                    title: 'taxation',
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
                },
                {
                    display: 'Verification',
                    link: '/administrator/product/verification',
                    title: 'verification',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }
            ]
        },
        {
            display: 'Orders',
            link: '/administrator/orders/list',
            title: 'orders',
            icon: 'orders-cart',
            highlightedIcon: 'orders-cart-highlighted',
            active: false,
            permission: 'order',
            children: [
                {
                    display: 'List Orders',
                    link: '/administrator/orders/list',
                    title: 'list',
                    icon: 'orders-cart',
                    highlightedIcon: 'orders-cart-highlighted',
                    active: false
                },
                {
                    display: 'Hyperlocal Tracking',
                    link: '/administrator/orders/hyperlocal-tracking',
                    title: 'hyperlocal-tracking',
                    icon: 'home',
                    highlightedIcon: 'orders-cart-highlighted',
                    active: false
                }
            ]
            //     {
            //         display: 'Orders',
            //         link: '/administrator/orders/list',
            //         title: 'orders',
            //         icon: 'orders-bag',
            //         highlightedIcon: 'orders-highlighted',
            //         active: false
            //     }
            // ]
        },
        {
            display: 'Integrations',
            link: '/administrator/integrations/list',
            title: 'integrations',
            icon: 'team',
            highlightedIcon: 'team-highlighted',
            active: false,
            permission: 'integration',
            children: []
        },
        {
            display: 'Subscription',
            link: '/administrator/subscription/invoices',
            title: 'subscription',
            icon: 'settings',
            highlightedIcon: 'home-highlighted',
            active: false,
            permission: 'plans',
            children: [
               
                {
                    display: 'Invoices',
                    link: '/administrator/subscription/invoices',
                    title: 'invoice',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }, 
                {
                    display: 'Coupons',
                    link: '/administrator/subscription/coupons',
                    title: 'coupons',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                
            ]
        },
        // Packaging related changes for adding navbar element
        {
            display: 'Packaging',
            link: '/administrator/packaging/items',
            title: 'packaging',
            icon: 'packaging_icon',
            highlightedIcon: 'home-highlighted',
            active: false,
            permission: 'packaging',
            // sub items for packaging dashboard
            children: [
                {
                    display: 'Items',
                    link: '/administrator/packaging/items',
                    title: 'items',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                {
                    display: 'Category configuration',
                    link: '/administrator/packaging/category-configuration',
                    title: 'category-configuration',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }
            ]
        },
        {
            display: 'Communication',
            link: '/administrator/communication/reports',
            title: 'reports',
            icon: 'settings',
            highlightedIcon: 'home-highlighted',
            active: false,
            permission: 'communication',
            children: [
                {
                    display: 'Reports',
                    link: '/administrator/communication/reports',
                    title: 'reports',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }
            ]
        },
        {
            display: 'Extension',
            link: '/administrator/extensions',
            title: 'extensions',
            icon: 'settings',
            highlightedIcon: 'settings-highlighted',
            active: false,
            permission: 'extension',
            children: [
                {
                    display: 'Review',
                    link: '/administrator/extensions/review',
                    title: 'review',
                    icon: 'settings',
                    permission: 'extension/review',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                {
                    display: 'Collection',
                    link: '/administrator/extensions/collection',
                    title: 'collection',
                    icon: 'settings',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }
            ]
        },
        {
            display: 'Support Center',
            link: '/administrator/support/configuration',
            title: 'support',
            icon: 'support-icon',
            highlightedIcon: 'home-highlighted',
            active: false,
            permission: 'support',
            children: [
                {
                    display: 'Configuration',
                    link: '/administrator/support/configuration',
                    title: 'configuration',
                    icon: 'support-icon',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                {
                    display: 'Ticket Listing',
                    link: '/administrator/support/ticket-listing',
                    title: 'ticket-listing',
                    icon: 'support-icon',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }
            ]
        },
        {
            display: 'Finance',
            link: '/administrator/finance/credit-debit-note',
            title: 'finance',
            icon: 'kycdetails',
            highlightedIcon: 'home-highlighted',
            active: false,
            permission: 'finance',
            children: [
                {
                    display: 'Credit-Note/Debit-Note',
                    link: '/administrator/finance/credit-debit-note',
                    title: 'cndn',
                    icon: 'kycdetails',
                    highlightedIcon: 'home-highlighted',
                    active: false,
                }
            ]
        },
        {
            display: 'Settings',
            link: '/administrator/settings/platform',
            title: 'settings',
            icon: 'settings',
            highlightedIcon: 'home-highlighted',
            active: false,
            permission: 'settings',
            children: [
                {
                    display: 'Platform',
                    link: '/administrator/settings/platform',
                    title: 'platform',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                },
                {
                    display: 'Partner',
                    link: '/administrator/settings/partners',
                    title: 'partner',
                    icon: 'home',
                    highlightedIcon: 'home-highlighted',
                    active: false
                }
            ]
        },
        {
            display: 'Webhooks',
            link: '/administrator/webhook',
            title: 'webhooks',
            icon: 'webhook',
            highlightedIcon: 'webhook',
            active: false,
            permission: 'webhook',
            children: []
        },
    ];
};
