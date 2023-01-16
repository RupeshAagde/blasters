'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import ListCards from '../../../../../../../pages/finance/bulk-upload/upload-history/list-cards.vue';
//import BillingRoutes from '../../../../../router/admin/billing';
import mocks from '../../fixtures/upload-reports.json';


let localVue, wrapper, router,store;
const mock = new MockAdapter(axios);
const companyId = '11';

describe('Finance', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/administrator/finance/bulk-upload/upload-history',
                name: 'bulk-upload',
                component: ListCards
            }]
        });
        router.push('/administrator/finance/bulk-upload/upload-history');
        wrapper = shallowMount(ListCards, {
            localVue,
            router,
            propsData: { 
                data: mocks.getListCards.items[0] 
            },
            computed: {
                badgeState(){
                    return 'success'
                },
            }
            
        });
        //mock.onPost(DOMAIN_URLS.GET_REPORT_LIST()).reply(200, mocks.getListCards);
        await flushPromises();
    });

    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

})
