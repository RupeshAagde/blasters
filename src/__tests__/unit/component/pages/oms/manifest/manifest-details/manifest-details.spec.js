'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import ManifestDetailPage from '@/pages/oms/manifest/manifest-details/manifest-details.vue';
import admpageheader from '@/components/common/layout/adm-page-header.vue';
import ManifestHomePage from '@/pages/oms/manifest/index.vue';

/* Mock imports */
import MANIFEST_DETAILS_RESPONSE from '../../fixtures/manifest/manifest-detail-response.json';
import ORDER_ROLES from '../../fixtures/order-roles.json';
import ACCESS_DETAIl from '../../fixtures/access-detail.json';
import MANIFEST_SAVE_PROCESS_RESPONSE from '../../fixtures/manifest/manifest-save-process-response.json';

/* Domain imports */
import URLS from '@/services/domain.service';


let wrapper, router, localVue;
const mock = new MockAdapter(axios);
const SHIPMENT_LIST =  [   
    {
        "shipment_id": "16732742344951132260",
        "shipment_created_time": "2023-01-09T19:53:55+00:00",
        "order_id": "FY63BC23790F6BA18E3C",
        "invoice_id": "vghasuyjajs",
        "awb": "5046512055852",
        "items": 1,
        "isSelected": true
    },
    {
        "shipment_id": "16732659431611028287",
        "shipment_created_time": "2023-01-09T17:35:43+00:00",
        "order_id": "FY63BC03160FB2E63A4E",
        "invoice_id": "jhgfdsewa",
        "awb": "5046512055701",
        "items": 4,
        "isSelected": true
    }
];

describe('ManifestDetailPage', () => {
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

        wrapper = mount(ManifestDetailPage, {
            localVue,
            router,
            computed: {
                orderRoles: ()=> ORDER_ROLES,
                accessDetail: ()=> ACCESS_DETAIl
            }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('check the page is routed back on back click', async () => {
        await flushPromises();
        let routerBack = jest.spyOn(router, "push");
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        let pageHeader = wrapper.findComponent(admpageheader);
        pageHeader.vm.$emit("backClick");
        await wrapper.vm.$nextTick();
        expect(routerBack).toHaveBeenCalled();
    });
  
    it('on click of add shipments button it opens edit manifest drawer', async () =>{
        wrapper.setData({
            editShipmentView: false,
            additionalShipmentCount:10,
            manifestStatus:'pdf_generated',
            noManifestId: false,
            manifestFetchInProgress: false
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        let editmanifestbutton = wrapper.findComponent({ref: 'open-edit-manifest-drawer'});
        editmanifestbutton.trigger('click');
        expect(wrapper.vm.editShipmentView).toBe(true);   
    });

    it('Selected filters should be equal to the route query', async() => {
        router.push({
            name: 'company-manifest-detail',
            params:{manifestId: 'manifest-1101'},
        })
        wrapper = mount(ManifestDetailPage, {
            localVue,
            router,
            computed: {
                orderRoles: ()=> ORDER_ROLES,
                accessDetail: ()=> ACCESS_DETAIl
            }
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.noManifestId).toBe(false);
    });

    it('should should close consent drawer', async() => {
        wrapper.setData({
            uploadConsentView: true,
            noManifestId: false,
            manifestFetchInProgress: false
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const closeDrawerButton = wrapper.findComponent({ref: 'slide-fade-upload-consent'});
        closeDrawerButton.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.uploadConsentView).toBe(false);
    });

    it('should call the add shipment api call and update manifest', async() => {
        wrapper.setData({
            noManifestId: false,
            manifestFetchInProgress: false,
            editShipmentView: true,
            shipmentsList : SHIPMENT_LIST,
           
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const addShipments = wrapper.findComponent({ref:'add-shipments'});
        addShipments.vm.$emit('update', {
            "action": "process",
            "manifest_id": "MN0000000191",
            "filters": {
                "from_date": "10-10-2022",
                "to_date": "09-01-2023",
                "dp_ids": 22,
                "dp_name": "Fyndr",
                "lane": "ready_for_dispatch",
                "sales_channels": "",
                "stores": 3664,
                "store_name": "Store name ---Shetty & Co",
                "selected_shipments": "16724705684341686707"
            },
            "unique_id": "1673295154843"
        }
        )
        await wrapper.vm.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 1000));
        expect(wrapper.vm.editShipmentView).toBe(false);
    });
});
