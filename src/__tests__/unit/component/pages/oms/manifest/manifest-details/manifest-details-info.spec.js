'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import ManifestDetailPage from '@/pages/oms/manifest/manifest-details/manifest-details.vue';
import ManifestHomePage from '@/pages/oms/manifest/index.vue';
import ManifestDetailsInfo from '@/pages/oms/manifest/manifest-details/manifest-details-info.vue';

/* Mock imports */
import MANIFEST_DETAILS_RESPONSE from '../../fixtures/manifest/manifest-detail-response.json';
import ORDER_ROLES from '../../fixtures/order-roles.json';
import MANIFEST_SAVE_PROCESS_RESPONSE from '../../fixtures/manifest/manifest-save-process-response.json';

/*Domanin imports */
import URLS from '@/services/domain.service';


let wrapper, router, localVue;
const mock = new MockAdapter(axios);

describe('ManifestDetailsInfo', () => {
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
        mock.onGet(URLS.FETCH_MANIFEST_DETAILS()).reply(200, MANIFEST_DETAILS_RESPONSE);
        mock.onPost(URLS.SAVE_PROCESS_MANIFEST(1)).reply(200, MANIFEST_SAVE_PROCESS_RESPONSE);

        wrapper = mount(ManifestDetailsInfo, {
            localVue,
            router,
            propsData: {
                orderRoles: ORDER_ROLES,
                manifestDetailsShipmentCount: 10,
                data: MANIFEST_DETAILS_RESPONSE.manifest_details[0]
            },
            computed:{
                showDetails: ()=> true,
                deliveryPartnerName: ()=> 'Delhivery',
                pickupSlot: ()=> 'date',
                salesChannel: ()=> 'salesChannel',
                totalShipments: ()=> 10
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
});
