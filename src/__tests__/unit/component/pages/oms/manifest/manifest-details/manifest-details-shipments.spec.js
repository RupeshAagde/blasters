'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import ManifestDetailPage from '@/pages/oms/manifest/manifest-details/manifest-details.vue';
import ManifestHomePage from '@/pages/oms/manifest/index.vue';
import ManifestDetailsShipments from '@/pages/oms/manifest/manifest-details/manifest-details-shipments.vue';

/* Mock imports */
import MANIFEST_DETAILS_RESPONSE from '../../fixtures/manifest/manifest-detail-response.json'
import ORDER_ROLES from '../../fixtures/order-roles.json'
import MANIFEST_SAVE_PROCESS_RESPONSE from '../../fixtures/manifest/manifest-save-process-response.json'


/*Domanin imports */
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
]
describe('ManifestDetailsShipments', () => {
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

        wrapper = mount(ManifestDetailsShipments, {
            localVue,
            router,
            propsData: {
                orderRoles: ORDER_ROLES,
                manifestDetailsShipmentCount: 10,
                data: MANIFEST_DETAILS_RESPONSE.manifest_details[0],
                totalShipments: 10,
                manifestFetchInProgress: false,
                hasManifestFetched: true,
                isIntialState: false,
                keepRowsAllChecked: false,
                selectedShipmentCount: 10,
                isHeaderChecked: true,
                shipmentsList: SHIPMENT_LIST,   
                showCheckboxAlert: true,
                selectedShipmentCount: 3, 
                showSelectAllResponse: true,
                manifestStatus: 'pdf_generated',
                checkboxShipmentData: {}
            },
            computed:{
                showDetails: ()=> true
            },
            deliveryPartnerName: ()=> 'Delhivery',
            stubs: {
                copyToClipboard: {
                    render: () => { return },
                }
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
    
    it('should select one rows calling debounce functionn', async()=> {
        wrapper.setData({
            shipmentsList: SHIPMENT_LIST,
            checkboxShipmentData: {}
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const dispalyButtonSelectAllFromResponse = jest.spyOn(wrapper.vm, 'dispalyButtonSelectAllFromResponse');
        wrapper.vm.selectItem(1);
        await new Promise(resolve => setTimeout(resolve, 150));
        expect(dispalyButtonSelectAllFromResponse).toHaveBeenCalled();
        
    });

    it('should unselect one rows calling debounce functionn', async()=> {
        wrapper.setData({
            shipmentsList: [   {
                "shipment_id": "16732742344951132260",
                "shipment_created_time": "2023-01-09T19:53:55+00:00",
                "order_id": "FY63BC23790F6BA18E3C",
                "invoice_id": "vghasuyjajs",
                "awb": "5046512055852",
                "items": 1,
                "isSelected": false
            },],
            checkboxShipmentData: {}
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const dispalyButtonSelectAllFromResponse = jest.spyOn(wrapper.vm, 'dispalyButtonSelectAllFromResponse');
        wrapper.vm.selectItem(0);
        await new Promise(resolve => setTimeout(resolve, 150));
        expect(dispalyButtonSelectAllFromResponse).toHaveBeenCalled();    
    });

    it('should select all checkbox when clicked on header checkbox', async()=>{
        wrapper.setData({
            shipmentsList: SHIPMENT_LIST,
            checkboxShipmentData: {},
            selectedShipmentCount: 2,
            totalShipments: 2

        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        wrapper.vm.selectUnSelectAllItem();
        await new Promise(resolve => setTimeout(resolve, 150));
        expect(wrapper.emitted()['keepAllRowsCheckedEvent']).toBeTruthy();

    });
    it('should select all checkbox when clicked on header checkbox', async()=>{
        wrapper.setData({
            shipmentsList: SHIPMENT_LIST,
            checkboxShipmentData: {},
            selectedShipmentCount: 1,
            totalShipments: 2

        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        wrapper.vm.selectUnSelectAllItem();
        await new Promise(resolve => setTimeout(resolve, 150));
        expect(wrapper.emitted()['keepAllRowsCheckedEvent']).toBeTruthy();
    });

   });
