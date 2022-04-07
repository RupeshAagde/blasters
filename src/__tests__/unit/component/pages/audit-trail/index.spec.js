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
import MOCK_DATA from "./fixtures.json";
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
        mock.onGet(URLS.AUDIT_TRAIL()).reply(200, MOCK_DATA.audit_log);
        mock.onGet(URLS.SEARCH_USER()).reply(200, MOCK_DATA.user_info);

    


        router = new VueRouter({
            routes: [{
                path: '/administrator/audit-trail',
                component: AuditPage
            }]
        })
        router.push('/administrator/audit-trail?sdate=2022-02-28T18%3A30%3A00.000Z&edate=2022-03-24T18%3A30%3A00.000Z&usrid=6dea800ff2befc54a6342d52&usrval=9557999334&enttyp=subscription');
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
    
        wrapper.vm.filters.emailOrPhone.value = "9557999334"
        wrapper.vm.getUserIdByEmailPhone()

        wrapper.vm.paginationClick('next')

        


    })
})