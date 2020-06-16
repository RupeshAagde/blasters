//Components
import ApplicationsVue from '@/pages/partner/applications/index.vue'

export default [
  {
    name: 'application-list',
    path: 'applications',
    component: () =>
      import(
        /* webpackChunkName: "admin" */ '@/pages/partner/applications/index.vue'
      ),
    meta: {
      name: 'Applications',
      icon: 'applications'
    }
  },
  {
    name: 'application-create',
    path: 'application/create/',
    component: () =>
      import(
        /* webpackChunkName: "admin" */ '@/pages/partner/applications/form.vue'
      ),
    meta: {
      name: 'Create Application',
      action: 'create'
    }
  },
  {
    name: 'application-edit',
    path: 'application/:appId/edit/',
    component: () =>
      import(
        /* webpackChunkName: "admin" */ '@/pages/partner/applications/form.vue'
      ),
    meta: {
      name: 'Edit Application',
      action: 'edit'
    }
  }
]
