import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import ReportPage from "./../../../../../pages/communication/reports.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
//import MOCK_DATA from "./fixtures/custom-tags.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router



describe('Mounted report logs', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        //mock.onGet(URLS.PLATFORM_CUSTOM_TAGS()).reply(200, MOCK_DATA.list);

        router = new VueRouter({
            routes: [{
                path: '/administrator/communication/reports',
                component: ReportPage
            }]
        })
        router.push('/administrator/communication/reports');
        wrapper = mount( ReportPage , {
            localVue,
            router,
        })
        await flushPromises();

       
        
    });
    it('exists wrapper and div', async () => {

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })
   
   

    

})