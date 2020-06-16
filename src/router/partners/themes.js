//Components
import ThemeVue from '@/pages/partner/themes/index.vue'

export default [
  {
    name: 'theme-list',
    path: 'themes',
    component: () =>
      import(
        /* webpackChunkName: "admin" */ '@/pages/partner/themes/index.vue'
      ),
    meta: {
      name: 'Themes',
      icon: 'themes'
    }
  },
  {
    name: 'theme-create',
    path: 'theme/create/',
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/pages/partner/themes/form.vue'),
    meta: {
      name: 'Create Theme',
      action: 'create'
    }
  },
  {
    name: 'theme-edit',
    path: 'theme/:appId/edit/',
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/pages/partner/themes/form.vue'),
    meta: {
      name: 'Edit Theme',
      action: 'edit'
    }
  }
]
