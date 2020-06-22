import AdministratorBaseViewVue from './../../pages/administrator/baseview.vue'
import HomeVue from './../../pages/administrator/home.vue'
import PlansVue from './../../pages/plan-creator/plans-list.vue'

export default [
  {
    path: '/administrator/',
    component: AdministratorBaseViewVue,
    children: [
      {
        path: 'home',
        component: HomeVue
      },
      {
        path: 'plans',
        component: PlansVue
      }
    ]
  }
]
