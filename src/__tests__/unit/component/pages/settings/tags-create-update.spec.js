import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import TagsCreateUpdatePage from "./../../../../../pages/settings/tags-create-update.vue";
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



describe('Mounted Create tags', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        //mock.onGet(URLS.PLATFORM_CUSTOM_TAGS()).reply(200, MOCK_DATA.list);

        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/create-tag',
                component: TagsCreateUpdatePage
            }]
        })
        router.push('/administrator/settings/create-tag');
        wrapper = mount( TagsCreateUpdatePage , {
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
    it('post tag', async () => {
        mock.onPost(URLS.PLATFORM_CUSTOM_TAGS()).reply(200, MOCK_DATA.create);
       wrapper.vm.name.value = 'sample';
       wrapper.vm.url.value = 'www.fynd.com';
       wrapper.vm.arrAttribute = [ { "key": "some", "value": "thing" } ]
       wrapper.vm.tagMode = 'Create'

        await flushPromises();
       

        const postBtn = wrapper.find('#post-update');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
        
    })
    it('post tag', async () => {
        mock.onPost(URLS.PLATFORM_CUSTOM_TAGS()).reply(400, {message: ''});
       wrapper.vm.name.value = 'sample';
       wrapper.vm.url.value = 'www.fynd.com';
       wrapper.vm.arrAttribute = [ { "key": "some", "value": "thing" } ]
       wrapper.vm.tagMode = 'Create'

        await flushPromises();
       

        const postBtn = wrapper.find('#post-update');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
        
    })
    it('form not valid', async () => {
        mock.onPost(URLS.PLATFORM_CUSTOM_TAGS()).reply(200, MOCK_DATA.create);
      

        await flushPromises();
       

        const postBtn = wrapper.find('#post-update');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
        
    })
    it('url validate correct', async () => {
      
        wrapper.vm.url.value = 'www.fynd.com'
        await flushPromises();
       

        const urlBtn = wrapper.find('#url');
        expect(urlBtn.exists()).toBe(true)
        urlBtn.trigger('input')
        
    })
    it('url validate incorrect', async () => {
      
        wrapper.vm.url.value = 'www.fynd.com'
        await flushPromises();
       

        const urlBtn = wrapper.find('#url');
        expect(urlBtn.exists()).toBe(true)
        urlBtn.trigger('input')
        
    })
    

    

})

describe('Mounted Update tags', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.PLATFORM_CUSTOM_TAGS('6188f1efaefd898270b21333')).reply(200, MOCK_DATA.list);

        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/update-tag/:tagId',
                component: TagsCreateUpdatePage
            }]
        })
        router.push('/administrator/settings/update-tag/6188f1efaefd898270b21333');
        wrapper = mount( TagsCreateUpdatePage , {
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
    it('mount update tag', async () => {
        mock.onPut(URLS.PLATFORM_CUSTOM_TAGS('6188f1efaefd898270b21333')).reply(200, MOCK_DATA.update);
        wrapper.vm.name.value = 'sample';
        wrapper.vm.url.value = 'www.fynd.com';
        wrapper.vm.arrAttribute = [ { "key": "some", "value": "thing" } ]
        wrapper.vm.tagMode = 'Save'


        await flushPromises();
       

        const postBtn = wrapper.find('#post-update');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
        
    })
    it('mount update tag failed', async () => {
        mock.onPut(URLS.PLATFORM_CUSTOM_TAGS('6188f1efaefd898270b21333')).reply(400,{message: ''});
        wrapper.vm.name.value = 'sample';
        wrapper.vm.url.value = 'www.fynd.com';
        wrapper.vm.arrAttribute = [ { "key": "some", "value": "thing" } ]
        wrapper.vm.tagMode = 'Save'


        

        await flushPromises();
       

        const postBtn = wrapper.find('#post-update');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
        
    })
    it('attribute and delete method', async()=>{
        mock.onDelete(URLS.PLATFORM_CUSTOM_TAGS('6188f1efaefd898270b21333')).reply(200, MOCK_DATA.delete);
        mock.onDelete(URLS.PLATFORM_CUSTOM_TAGS('12345')).reply(404, MOCK_DATA.delete);
        wrapper.vm.add();
        wrapper.vm.deletePair(0)
        wrapper.vm.deleteTag()
    })


    

})