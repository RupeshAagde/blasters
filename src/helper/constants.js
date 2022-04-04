export const NAV_VIEW = {
    HOME: 'home',
    BRANDS: 'brands',
    CATEGORIES: 'categories',
    COLLECTION: 'collection',
    COLLECTIONS: 'collections',
    FAQ: 'faq',
    CONTACT_US: 'contact-us',
    PRODUCTS: 'products',
    PAGE: 'page',
    LINK: 'link',
    BLOG: 'blog'
};
export const NAV_TYPE = {
    PAGE: 'page',
    POPUP: 'popup'
};

export const TEMPLATE_TYPE = {
    HEADER: 'header',
    FOOTER: 'footer',
    CATEGORIES: 'categories',
    COLLECTIONS: 'collections',
    PRODUCT_DETAILS_PAGE: 'pdp',
    PRODUCT_LISTING_PAGE: 'plp',
    SCREEN_SAVER: 'screensaver',
    BLOG: 'blog',
    ORDER_REVIEW: 'order_review',
    CART_LANDING: 'cart_landing',
    CART_REVIEW: 'cart_review',
    COMPARE_PRODUCTS: 'compare_products',
    ORDER_TRACKING: 'order_tracking',
    ORDER_TRACKING_DETAILS: 'order_tracking_details'
};
export const THEME_PREVIEW_EVENTS = {
    ADD_SECTION: 'add_section',
    REMOVE_SECTION: 'remove_section',
    UPDATE_SECTION: 'update_section',
    DRAG_SECTION_START: 'drag_section_start',
    DRAGGING_SECTION: 'dragging_section',
    DRAG_SECTION_END: 'drag_section_end',
    UPDATE_CONFIG: 'update_config',
    SELECT_SECTION: 'select_section',
    THEME_MOUNTED: 'mounted',
    SECTIONS_FILTER_PREDICATE: 'filter_section_predicate'
};
export const MARKETPLACE_INFO = {
    'flipkart_in': {
        'fyndx0': {
            client_id: '4351563210763b8985674115654741a66389',
            redirect_uri: 'https://platform.fyndx0.de/oauth',
            //flipkart_uri: 'http://sandbox-api.flipkart.net/oauth-service/oauth/authorize'
            flipkart_uri: 'https://api.flipkart.net/oauth-service/oauth/authorize'
        },
        'fynd': {
            client_id: '75a0291412535aa050334a5a7711b4517367',
            redirect_uri: 'https://platform.fynd.com/oauth',
            flipkart_uri: 'https://api.flipkart.net/oauth-service/oauth/authorize'
        },
    },
    'flipkartAssured': {
        'fyndx0': {
            client_id: '1a469b310946787814a565295811739565689',
            redirect_uri: 'https://platform.fyndx0.de/oauth',
            flipkart_uri: 'https://api.flipkart.net/oauth-service/oauth/authorize'
            //flipkart_uri: 'http://sandbox-api.flipkart.net/oauth-service/oauth/authorize'
        },
        'fynd': {
            client_id: '708967688a08700785576499aa1753634171',
            redirect_uri: 'https://platform.fynd.com/oauth',
            flipkart_uri: 'https://api.flipkart.net/oauth-service/oauth/authorize'
        },
    },
    'amazonsmartconnect': {
        'fyndx0': {
            client_id: 'amzn1.application-oa2-client.83a2fe362f964145aee6b4880c2bc5de',
            redirect_uri: 'https://platform.fyndx0.de/oauth',
            amazon_uri: 'https://na.account.amazon.com/ap/oa'
            // amazon_uri: 'https://api.sandbox.dub.yojaka.xp.sellers.a2z.com/ap/oa'
        },
        'fyndx1': {
            client_id: 'amzn1.application-oa2-client.83a2fe362f964145aee6b4880c2bc5de',
            redirect_uri: 'https://platform.fyndx1.de/oauth',
            amazon_uri: 'https://na.account.amazon.com/ap/oa'
            // amazon_uri: 'https://api.sandbox.dub.yojaka.xp.sellers.a2z.com/ap/oa'
        },
        'fynd': {
            client_id: 'amzn1.application-oa2-client.906482b2d3924a86b7173a21297cb320',
            redirect_uri: 'https://platform.fynd.com/oauth',
            amazon_uri: 'https://www.amazon.com/ap/oa'
            // amazon_uri: 'https://api.sandbox.dub.yojaka.xp.sellers.a2z.com/ap/oa'
        },
    }
};

export const LISTING_PRICE_OPTIONS = [{
    "display": "Min",
    "value": "min",
    "sort": "min"
},
{
    "display": "Max",
    "value": "max",
    "sort": "max"
},
{
    "display": "Range",
    "value": "range",
    "sort": "min"
}
]

export const ORDER_RULES_ENUM = [{
    display: 'Full Access',
    value: 'full_access'
},
{
    display: 'Store Manager',
    value: 'store_manager'
},
{
    display: 'Customer Care',
    value: 'customer_care'
},
{
    display: 'Read Only',
    value: 'read_only'
}
]

export const RETURN_ORDER_STATUS = ["rto_in_transit", "rto_bag_delivered", "rto_bag_accepted",
    "return_processing", "return_product_picked", "return_rejected", "return_dp_assigned",
    "return_bag_in_transit", "return_accepted", "refund_initiated", "refund_done",
    "return_bag_delivered", "refund_approved", "refund_completed",
    "return_not_accepted", "return_bag_not_delivered", "return_bag_picked",
    "return_initiated"
]

export const CANCELLATION_REASONS = {
    'store_manager': [{
        value: 82,
        text: "Defective Product"
    },
    {
        value: 83,
        text: "Product Not Available"
    },
    {
        value: 85,
        text: "Store didn't ship the shipment"
    }, //Delivery address is wrong
    {
        value: 86,
        text: "Price Mismatch"
    }, //Found better price elsewhere
    {
        value: 84,
        text: "Others"
    }, //Changed my mind
    ],
    'customer_care': [{
        value: 56,
        text: "Incorrect Delivery Address"
    },
    {
        value: 57,
        text: "Store Closed"
    },
    {
        value: 58,
        text: "Does not want to wait for Webstore Delivery"
    },
    {
        value: 59,
        text: "Change of mind"
    },
    ],
    'full_access': [{
        value: 82,
        text: "Defective Product"
    },
    {
        value: 83,
        text: "Product Not Available"
    },
    {
        value: 85,
        text: "Store didn't ship the shipment"
    }, //Delivery address is wrong
    {
        value: 86,
        text: "Price Mismatch"
    }, //Found better price elsewhere
    {
        value: 56,
        text: "Incorrect Delivery Address"
    },
    {
        value: 57,
        text: "Store Closed"
    },
    {
        value: 58,
        text: "Does not want to wait for Webstore Delivery"
    },
    {
        value: 59,
        text: "Change of mind"
    },
    {
        value: 84,
        text: "Others"
    }, //Changed my mind
    ],
    'read_only': []
}

export const RETURN_ACCEPTED_REASONS = [{
    text: "Free Gift Missing",
    value: 129
},
{
    text: "Empty Box Received",
    value: 130
},
{
    text: "Short Received",
    value: 131
},
{
    text: "Lost",
    value: 132
},
{
    text: "Customer Abuse",
    value: 133
},
{
    text: "Wrong Product Received",
    value: 134
},
{
    text: "Fully Damaged",
    value: 136
},
{
    text: "Seal Opened",
    value: 137
},
{
    text: "Refinish-For Pressing",
    value: 138
},
{
    text: "Refinish-Damaged",
    value: 139
},
{
    text: "Refinish-Package Damaged",
    value: 140
},
{
    text: "Refinish-Tag Missing",
    value: 141
},
{
    text: "Package Damaged",
    value: 142
},
{
    text: "Tag Missing",
    value: 143
},
{
    text: "Component Missing",
    value: 144
},
];

export default {
    FYND_VPA: 'razorpaypg@hdfcbank',
    ACCOUNTS: [{
        icon: 'save',
        display: 'Wishlist',
        link: '/wishlist/'
    },
    {
        icon: 'orders',
        display: 'Orders',
        link: '/orders/'
    },
    {
        icon: 'address',
        display: 'Addresses',
        link: '/address/'
    },
    {
        icon: 'orders',
        display: 'Profile',
        link: '/profile/'
    }
    ],
    SETTINGS: [{
        icon: 'currency',
        display: 'Currency',
        link: '/setting/currency/'
    },
    {
        icon: 'language',
        display: 'Language',
        link: '/setting/language/'
    },
    {
        icon: 'store',
        display: 'Store',
        link: '/setting/store/',
        deployment_store: true
    }
    ],
    PROFILE_DATA: [{
        key: 'orders',
        icon: 'orders',
        display: 'My Orders',
        link: '/profile/orders',
        staff: false
    },
    {
        key: 'phone',
        icon: 'call',
        display: 'Phone Number',
        link: '/profile/phone',
        staff: false
    },
    {
        key: 'email',
        icon: 'email',
        display: 'Email Address',
        link: '/profile/email',
        staff: false
    },
    {
        key: 'address',
        icon: 'address',
        display: 'My Address',
        link: '/profile/address',
        staff: false
    },
    {
        key: 'card',
        icon: 'card',
        display: 'My Cards',
        link: '/profile/my-cards/',
        staff: false
    },
    {
        key: 'reward_points',
        icon: 'refernearn',
        display: 'Refer and Earn',
        link: '/profile/refer-earn',
        staff: false
    },
    {
        key: 'company',
        icon: 'company',
        display: 'Company',
        link: '/profile/company',
        staff: true
    }
    ],
    PAGE_INFO: {
        [NAV_VIEW.HOME]: {
            link: '/',
            icon: 'home',
            display: 'Home'
        },
        [NAV_VIEW.BRANDS]: {
            link: '/brands/',
            icon: 'brands',
            display: 'Brands'
        },
        [NAV_VIEW.CATEGORIES]: {
            link: '/categories/',
            icon: 'categories',
            display: 'Categories'
        },
        [NAV_VIEW.COLLECTIONS]: {
            link: '/collections/',
            icon: 'collections',
            display: 'Collections'
        },
        [NAV_VIEW.COLLECTION]: {
            link: '/collection/',
            icon: 'collections',
            display: 'Collection'
        },
        [NAV_VIEW.FAQ]: {
            link: '/faq/',
            icon: 'home',
            display: 'FAQ'
        },
        [NAV_VIEW.CONTACT_US]: {
            link: '/contact-us/',
            icon: 'collections',
            display: 'Contact Us'
        },
        [NAV_VIEW.PRODUCTS]: {
            link: '/products/',
            icon: 'collections',
            display: 'Products'
        },
        [NAV_VIEW.PAGE]: {
            link: '/page/',
            icon: 'home',
            display: 'Page'
        },
        [NAV_VIEW.LINK]: {
            link: '/page/',
            icon: 'home',
            display: 'Link'
        },
        [NAV_VIEW.BLOG]: {
            link: '/blog/',
            icon: 'home',
            display: 'Link'
        }
    }
};