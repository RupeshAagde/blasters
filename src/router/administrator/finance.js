import BillsAndPayouts from './../../pages/finance/bills-payouts.vue';
import FinanceReportGen from './../../pages/finance/finance-report.vue';
import FinanceAccounts from './../../pages/finance/finance-reconciliation.vue';
import { checkUserPermission } from './../guards';

export default [
    {
        name: 'bills-and-payouts',
        path: 'finance/bills-and-payouts',
        component: BillsAndPayouts,
        beforeEnter: (to, from, next) => {
            return checkUserPermission(to, from, next, ['finance']);
        }
    },
    {
        name: 'report-generator',
        path: 'finance/bills-and-payouts?activeTab=0',
        component: FinanceReportGen,
        beforeEnter: (to, from, next) => {
            return checkUserPermission(to, from, next, ['finance']);
        }
    },
    {
        name: 'account-ledgers',
        path: 'finance/bills-and-payouts?activeTab=1',
        component: FinanceAccounts,
        beforeEnter: (to, from, next) => {
            return checkUserPermission(to, from, next, ['finance']);
        }
    }
];
