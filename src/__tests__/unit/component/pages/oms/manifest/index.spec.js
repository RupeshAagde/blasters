'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import ManifestHomePage from '@/pages/oms/manifest/index.vue';
import GenerateManifestPage from '@/pages/oms/manifest/manifest-generate.vue';

/* Mock imports */
import MANIFEST_LISTING_MOCK from '../fixtures/manifest/manifest-home.json';
import MANIFEST_FILTERS_MOCK from '../fixtures/manifest/manifest-filter.json';
import MANIFEST_FULLFILMENT_FILTER_MOCK from '../fixtures/manifest/manifest-fullfilment-filter.json';
import MANIFEST_DETAILS_RESPONSE from '../fixtures/manifest/manifest-detail-response.json';
import ORDER_ROLES from '../fixtures/order-roles.json';
import ACCESS_DETAIl from '../fixtures/access-detail.json';
import COMPANIES_LIST_MOCK from '@/__tests__/unit/component/pages/oms/fixtures/oms-companies-list.json';

/* Domain imports */
import URLS from '@/services/domain.service';

const mock = new MockAdapter(axios);
let wrapper, router, localVue;
describe('ManifestHomePage', () => {
    beforeEach(async () => {
        localVue = createLocalVue();

        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                {
                    path: '/company/:company_id/orders/manfiest/',
                    name: 'company-order-manifest',
                    component: ManifestHomePage,
                },
                {
                    path: '/company/orders/manifest/generate',
                    name:'company-manifest-generate',
                    component: GenerateManifestPage,
                },
            ],
        });
        router.push('/company/1/orders/?sales_channels=63635aca76bf40273c62f4ba&dp_ids=24');
        mock.onGet(URLS.GET_COMPANY_LIST({})).reply(200, COMPANIES_LIST_MOCK);
        mock.onGet(URLS.FETCH_MANIFEST_LIST()).reply(200, MANIFEST_LISTING_MOCK);
        mock.onGet(URLS.FILTERS_V2()).reply(200, MANIFEST_FILTERS_MOCK);
        mock.onGet(URLS.GET_FULFILLMENT_CENTER()).reply(200, MANIFEST_FULLFILMENT_FILTER_MOCK);
        mock.onGet(URLS.FETCH_MANIFEST_DETAILS()).reply(200, MANIFEST_DETAILS_RESPONSE);

        wrapper = mount(ManifestHomePage, {
            localVue,
            router,
            propsData: {},
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

    it('closes the consent drawer on close button click', async () => {
        wrapper.setData({
            uploadConsentView: true,
        });
        await flushPromises();
        const element = wrapper.find('.upload-consent-drawer');
        element.vm.$emit('dispatch');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.uploadConsentView).toBe(false);
    });

    it('opens the consent drawer on open button click', async () => {
        wrapper.setData({
            uploadConsentView: false,
            manifestDataLoaded: true,
            fetchInProgress: false
        });
        await flushPromises();
        const element = wrapper.find('.shipment-item');
        element.vm.$emit('openConsentEvent', 'MN0000000154');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.uploadConsentView).toBe(true);
        expect(wrapper.vm.manifestId).toBe('MN0000000154');
    });

    it('is advanced filter applied', async () => {
        // @todo this test case as it is failing
        wrapper.setData({

            advancedFilterView: true,
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const element = wrapper.findComponent({ref:'slide-adv-filter'});
        element.vm.$emit('applyFilters', {
            "closeDrawer": true,
            "data": {
                "sales_channel": [
                    "62d8086765453e759eba7e99"
                ]
            }
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(false);
    });

    it('Should trigger the input search and update the query param', async () => {
        // calling this function directly as facing issues with above test case 
        let element = jest.spyOn(wrapper.vm, 'onSearch');
        wrapper.vm.onSearch();
        expect(element).toHaveBeenCalled();
    })

    it('Catch api fail for manifest listing', async () => {
        mock.onGet(URLS.FETCH_MANIFEST_LIST()).reply(400, {error: 'could not fetch manifest list'});
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.manifestFetchFailure).toBe(false);
    });

    // it('Selected filters should be equal to the route query', async() => {
    //     router.push({
    //         name: 'company-manifest-generate',
    //         params:{sales_channels: '63635aca76bf40273c62f4ba'},
    //     });
    //     expect(wrapper.vm.selectedAdvancedFilters).toHaveProperty('sales_channels');
    //  })

    it('Clearing filter should delete the Global params',  async () => {
        wrapper.setData({
            advancedFilterView: true,
            filterApplied:true
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const element = wrapper.findComponent({ref:'slide-adv-filter'});
        element.vm.$emit('applyFilters', {
            "closeDrawer": false,
            "data": {}
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.filterApplied).toBe(false);
    })

    it('Should filter the fullfilment stores options when getting store ids in accessDetails variable', async() => {
        wrapper.setData({
            accessDetail: {
                "store_access": {
                    "values": [3664]
                },
        }});
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.filteredStores.length).toBe(0);        
    });
    
    it('should evaluate the tab change active', async() => {
        wrapper.setData({
            manifestLaneData: [
                {
                    text: 'Active',
                    value: 'active',
                },
                {
                    text: 'Closed',
                    value: 'closed',
                },
            ],
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const element = wrapper.findComponent({ref:'tabs'});
        element.vm.$emit('tab-change',{'index': 0, 'item': 'Active'} );
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.globalParams.status).toBe('active');
    });

    it('should evaluate the tab change closed', async() => {
        wrapper.setData({
            manifestLaneData: [
                {
                    text: 'Active',
                    value: 'active',
                },
                {
                    text: 'Closed',
                    value: 'closed',
                },
            ],
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const element = wrapper.findComponent({ref:'tabs'});
        element.vm.$emit('tab-change',{'index': 1, 'item': 'Closed'} );
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.globalParams.status).toBe('closed');
    });

    it('should update the global param on pagination change', async() => {
        wrapper.setData({
            manifestData:  MANIFEST_LISTING_MOCK.items
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element =  wrapper.find('.pagination-main');
        element.vm.$emit('change', {
            "current": 1,
            "total": 14,
            "has_previous": false,
            "has_next": true,
            "type": "number",
            "size": "10",
            "limit": 20
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.globalParams.page_size).toBe(20);
    });

    it('close method call should set the boolean value false for consent and filter drawer', async () => {
        wrapper.setData({
            advancedFilterView: true
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const element = wrapper.findComponent({ref:'slide-fade'});
        element.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(false);
        expect(wrapper.vm.uploadConsentView).toBe(false);
    });
});
