import AdministratorBaseViewVue from './../../pages/administrator/baseview.vue';
import HomeVue from './../../pages/administrator/home.vue';
import PlansListVue from './../../pages/plan-creator/plans-list.vue';
import ComponentsListVue from './../../pages/plan-creator/component-list.vue';
import CompanyListVue from './../../pages/company-admin/company-list.vue';
import CbsDetailVue from './../../pages/company-admin/cbs-detail.vue';

export default [
  {
    path: '/administrator/',
    component: AdministratorBaseViewVue,
    redirect: '/administrator/home',
    children: [
      {
        path: 'home',
        component: HomeVue
      },
      {
        path: 'plans',
        component: PlansListVue
      },
      {
        path: 'components',
        component: ComponentsListVue
      },
      {
        path: 'company-list',
        component: CompanyListVue
      },
      {
        path: 'company-details/:companyId',
        component: CbsDetailVue
      }
    ]
  }
];
