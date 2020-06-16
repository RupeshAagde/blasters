//Routes
import ApplicationRoutes from './applications'
import MiniAppsRoutes from './miniapps'
import ThemesRoutes from './themes'
import PluginsRoutes from './plugins'
import InfluencersRoutes from './influencers'
import SettingsRoutes from './settings'
import TeamRoutes from './team'

//Components
import BaseViewVue from './../../pages/baseview.vue'
import HomeVue from './../../pages/partner/home.vue'
import DocumentationVue from './../../pages/partner/documentation.vue'

export default [
  {
    path: '/partner/:partnerId/',
    component: BaseViewVue,
    children: [
      {
        path: 'home',
        component: HomeVue
      },
      // {
      //   path: 'documentation',
      //   component: DocumentationVue
      // },
      ...ApplicationRoutes,
      // ...MiniAppsRoutes,
      // ...PluginsRoutes,
      ...ThemesRoutes,
      ...SettingsRoutes,
      ...TeamRoutes,
      // ...InfluencersRoutes,
      {
        path: '',
        redirect: '/partner/:partnerId/home'
      },
      {
        path: '*',
        redirect: '/partner/:partnerId/home'
      }
    ]
  }
]
