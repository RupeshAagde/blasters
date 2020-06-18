import CloudBaseViewVue from './../../pages/cloud/baseview.vue'
import HomeVue from './../../pages/cloud/home.vue'

export default [
  {
    path: '/cloud/',
    component: CloudBaseViewVue,
    children: [
      {
        path: 'home',
        component: HomeVue
      }
    ]
  }
]
