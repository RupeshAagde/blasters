import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import TagsPage from "./../../../../../pages/settings/tags-inject.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/custom-tags.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router



describe('Mounted Custom tags', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.PLATFORM_CUSTOM_TAGS()).reply(200, MOCK_DATA.list);

        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/list-tags',
                component: TagsPage
            }]
        })
        router.push('/administrator/settings/list-tags');
        wrapper = mount( TagsPage , {
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
    it('delete tag', async () => {
        mock.onDelete(URLS.PLATFORM_CUSTOM_TAGS('6188f1efaefd898270b21333')).reply(200, MOCK_DATA.delete);
        mock.onDelete(URLS.PLATFORM_CUSTOM_TAGS('12345')).reply(404, MOCK_DATA.delete);



        await flushPromises();
        const delIcon = wrapper.find('#delete');
        expect(delIcon.exists()).toBe(true)
        delIcon.trigger('click')

        const delBtn = wrapper.find('#del');
        expect(delBtn.exists()).toBe(true)
        delBtn.trigger('click')
        
    })
    it('pagination', async () => {
        await flushPromises();
        wrapper.vm.setPagination({current:1,limit:5})

        const delBtn = wrapper.find('#pagination');
        expect(delBtn.exists()).toBe(true)
        delBtn.trigger('change')
        
    })

    

})