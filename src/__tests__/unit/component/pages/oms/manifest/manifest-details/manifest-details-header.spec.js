'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';



/* Component imports */
import ManifestDetailPage from '@/pages/oms/manifest/manifest-details/manifest-details.vue';
import admpageheader from '@/components/common/layout/adm-page-header.vue';
import ManifestHomePage from '@/pages/oms/manifest/index.vue';
import ManifestDetailsHeader from '@/pages/oms/manifest/manifest-details/manifest-details-header.vue';

/* Mock imports */
import ORDER_ROLES from '../../fixtures/order-roles.json';

let wrapper, router, localVue;

describe('ManifestDetailsHeader', () => {
    beforeEach(async () => {
        localVue = createLocalVue();

        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                 { path: '/orders/manifest', name: 'company-order-manifest', component: ManifestHomePage},
                 { path: 'orders/manifest/:manifestId/',name: 'company-manifest-detail', component: ManifestDetailPage },
            ],
        });
        router.push(`/company/1/orders/manifest/manifest-1101/`);
        wrapper = mount(ManifestDetailsHeader, {
            localVue,
            router,
            propsData: {
                orderRoles: ORDER_ROLES
            },
           
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('check the page is emit back on back click', async () => {
        let pageHeader = wrapper.findComponent(admpageheader);
        pageHeader.vm.$emit("backClick");
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted()['back']).toBeTruthy();
    });
   });
