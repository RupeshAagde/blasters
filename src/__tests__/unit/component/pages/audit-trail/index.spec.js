import {
    mount,
    shallowMount,
    createLocalVue
} from "@vue/test-utils";
import AuditPage from "./../../../../../pages/audit-trail/index.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
//import MOCK_DATA from "./fixtures/reports.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router



describe('Mounted audit logs', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.AUDIT_TRAIL()).reply(200, {});
    


        router = new VueRouter({
            routes: [{
                path: '/administrator/audit-trail',
                component: AuditPage
            }]
        })
        router.push('/administrator/audit-trail');
        wrapper = mount( AuditPage , {
            localVue,
            router,
        })
        await flushPromises();

       
        
    });
    it('exists wrapper and div', async () => {

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
        wrapper.vm.dateChanged();
        wrapper.vm.updateQueryParams({sdate: '2022-04-11T18:30:00.000Z'},true);
        wrapper.vm.setUrlQueryParams()


    })
   
   

    

})