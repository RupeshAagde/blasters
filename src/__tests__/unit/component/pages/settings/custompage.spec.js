import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import CustomPage from "./../../../../../pages/settings/custompage.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/custom-page.json";
//import CUSTOM_PAGE_MOCK_DATA from "./fixtures/custom-pages.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router



describe('Mounted Custom Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.PLATFORM_CUSTOM_PAGES()).reply(200, MOCK_DATA.customdata);
        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/pages',
                component: CustomPage
            }]
        })
        router.push('/administrator/settings/pages');
        wrapper = mount( CustomPage , {
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
    it('open custom page dialog', () => {
        const customPageModal = wrapper.findComponent({ref: 'create-custom-page'});
        customPageModal.vm.$emit('click');
        expect(customPageModal.exists()).toBe(true);
    })
    it('other methods', async () => {
        wrapper.vm.searchText = 'omansh';
        wrapper.vm.debounceInput(); 


        wrapper.vm.setPagination({current:1,limit:5,search:'omansh'});

        wrapper.vm.setRouteQuery({search:'omansh'})
        wrapper.vm.modalSelectandProceed()
        wrapper.vm.updatePage({slug: 'qwe', type:'rawhtml'})

    })
    
    

})