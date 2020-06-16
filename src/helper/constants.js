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
}
export const NAV_TYPE = {
  PAGE: 'page',
  POPUP: 'popup'
}

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
}

export default {
  FYND_VPA: 'razorpaypg@hdfcbank',
  ACCOUNTS: [
    {
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
  SETTINGS: [
    {
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
  PROFILE_DATA: [
    {
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
}
