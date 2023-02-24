'use strict';

/* Package imports */
import { mount,  createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

/* Component imports */
import ManifestListItem from '@/pages/oms/manifest/manifest-list.vue';
import ManifestDetailPage from '@/pages/oms/manifest/manifest-details/manifest-details.vue';
import ManifestHomePage from '@/pages/oms/manifest/index.vue';

/* Mock imports */
import ORDER_ROLES from '../fixtures/order-roles.json';
import MANIFEST_HOME_JSON from '../fixtures/manifest/manifest-home.json';


let wrapper, router, localVue;
describe('ManifestListItem', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                 { path: '/orders/manifest', name: 'company-order-manifest', component: ManifestHomePage},
                 { path: 'orders/manifest/:manifestId/',name: 'company-manifest-detail', component: ManifestDetailPage },
            ],
        });
        router.push({name: 'company-order-manifest', query:{
            "sales_channels": "637ca422d097a6095339c25f,637b76e2d097a60953396561,63635aca76bf40273c62f4ba"
        }});

        wrapper = mount(ManifestListItem, {
            localVue,
           propsData: { manifestList: MANIFEST_HOME_JSON.items,  tabIndex: 0,
            orderRoles: ORDER_ROLES},
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

});
