//Components
import TeamVue from './../../pages/partner/team/index.vue'
import StaffEditVue from './../../pages/partner/team/edit.vue'
import InviteVue from './../../pages/partner/invite/index.vue'
import SentInviteVue from './../../pages/partner/invite/sent.vue'

export default [
  {
    path: 'team',
    component: TeamVue,
    meta: {
      name: 'Team',
      icon: 'team'
    }
  },
  {
    path: 'team/edit/:user_id',
    component: StaffEditVue,
    meta: {
      name: 'Staff Edit',
      action: 'edit'
    }
  },
  {
    path: 'invite/',
    component: InviteVue,
    meta: {
      name: 'Invite'
    }
  },
  {
    path: 'invite/sent',
    component: SentInviteVue,
    meta: {
      name: 'Sent Invites'
    }
  }
]
