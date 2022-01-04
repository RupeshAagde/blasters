import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import ExtensionReviewList from "./../../../../../pages/extensions/extension-review-list.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services//mixmaster-url.service"
import MOCK_DATA from "./fixtures/extension-review.json";
import flushPromises from "flush-promises";
import { console } from "window-or-global";


const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper , router

describe('Mounted Extension Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.EXTENSION_REVIEW()).reply(200, MOCK_DATA.extensiondata);
        router = new VueRouter({
            routes: [{
                path: '/administrator/extensions/review',
                component: ExtensionReviewList 
            }]
        })
        router.push('/administrator/extensions/review');
        wrapper = mount( ExtensionReviewList  , {
            localVue,
            router,
        })
        await flushPromises();        
    });
    it('exists wrapper and div', async () => {

        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })
    it('check extension list length', async () => {
     //   wrapper.vm.open()
      expect(wrapper.vm.extensionList.length).toBeGreaterThan(1);
    })
    it('get list data', async () => {
        //   wrapper.vm.open()
         console.log(wrapper.vm);
         expect(wrapper.find(list-card)).toBe(true)
       })
      /* it('list data', async () => {
        //   wrapper.vm.open()
         expect(wrapper.vm.extensionList.length).toBeGreaterThan(1);
       })*/

        
       /* wrapper.selectedFilter = 'pending';
        //wrapper.fetchExtensions(); 


        wrapper.paginationChange({current:1,limit:5});

        wrapper.setRouteQuery({current_status:'pending'})
       // wrapper.modalSelectandProceed()
      //  wrapper.updatePage({slug: 'qwe', type:'rawhtml'})*/

    

    

})