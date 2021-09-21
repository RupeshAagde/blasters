'use strict';
import { mount, createLocalVue } from '@vue/test-utils';
import PgConfig from '../../../../../pages/company-admin/pgconfig.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from './fixtures/gringotts-mock.json';
import URLS from '../../../../../services/domain.service.js';
import AdminRoutes from '@/router/administrator/index.js';

import { shallowMount } from '@vue/test-utils'

let localVue, wrapper, router;
const mock = new MockAdapter(axios);


describe('Mounted PG review component ', () => {
  beforeEach(() => {
    localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        window.scrollTo = (x, y) => {
          document.documentElement.scrollTop = y;
        }

        

  });

  it('Get pg detail page info. successfully', async () => {
    router = new VueRouter({
      routes: [
          { path: '/administrator/company-details/:companyId/application/:appId', component: PgConfig   }
      ]
  })
    router.push('/administrator/company-details/1/application/000000000000000000000001?status=true');
    
    mock.onGet(URLS.FETCH_COD_CONFIG({ companyId: '1', app_id: '000000000000000000000001' })).reply(
      200,
      MOCK_DATA.getcod
    );

    mock.onGet(URLS.FETCH_REVIEW_LIST({ companyId: '1', app_id: '000000000000000000000001' }, "true")).reply(
      200,
      MOCK_DATA.getpg
    );
   

    


    mock.onPost(URLS.FETCH_COD_CONFIG({ companyId: '1', app_id: '000000000000000000000001' })).reply(
      200,
      MOCK_DATA.getcod
    );
    mock.onPost(URLS.PG_REVIEWED({ companyId: '1', app_id: '000000000000000000000001', paymentId: "45", email: "omanshlavania@gofynd.com" })).reply(
      200,
      MOCK_DATA.postpg
    );



    wrapper = mount(PgConfig, {
      localVue,
      router,
      computed: {
				currentUserInfo: (state) => {
					return MOCK_DATA.computedFix;
				}
      }
      // mocks: {
      //   $route: {
      //     params: {
      //       companyId: "1",
      //       appId: "000000000000000000000001",
      //       paymentId: "51",
      //     },
      //     query: {
      //       status: "true",
      //       email: "omanshlavania@gofynd.com"
      //     }
      //   }
      // }
    });

    await flushPromises();
    console.log(router.path);
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.exists()).toBeTruthy();
    const modalDiv = wrapper.find('#removedialog')
    modalDiv.trigger('click');
    const div = wrapper.find('div');
    expect(div.exists()).toBe(true);
    const coddiv = wrapper.find('#cod')
    expect(coddiv.exists()).toBe(true);
    coddiv.trigger('click')

    const approveDiv = wrapper.find("#approve")
    expect(approveDiv.exists()).toBe(true);
    approveDiv.trigger('click')
    const checkBlur = wrapper.find("#blurE")
    expect(checkBlur.exists()).toBe(true);
    checkBlur.trigger("blur")
     const codpost = wrapper.find('#codPost')
     expect(codpost.exists()).toBe(true);
     codpost.trigger('click')
    



    //mock.reset();
  });





});


