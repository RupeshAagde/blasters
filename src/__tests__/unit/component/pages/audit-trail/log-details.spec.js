import {
    mount,
    shallowMount,
    createLocalVue
} from "@vue/test-utils";
import AuditDetails from "./../../../../../pages/audit-trail/log-detail.vue";
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
        mock.onGet(URLS.AUDIT_TRAIL('62333580ac555e84959b9835')).reply(200, MOCK_DATA.audit_by_id );
        mock.onGet(URLS.AUDIT_TRAIL()).reply(200, MOCK_DATA.audit_log);

        router = new VueRouter({
            routes: [{
                path: '/administrator/audit-trail/logs/:id',
                component: AuditDetails
            }]
        })
        router.push('/administrator/audit-trail/logs/62333580ac555e84959b9835');
        wrapper = mount( AuditDetails , {
            localVue,
            router,
        })
        await flushPromises();

       
        
    });
    it('exists wrapper and div', async () => {

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
        wrapper.vm.auditLog = {entity: {type:'subscription'}}
        wrapper.vm.backRedirect();
       
        const viewMore = wrapper.find('#view')
       expect(viewMore.exists()).toBe(true);
       viewMore.trigger('click')


    })
   
   

    

})