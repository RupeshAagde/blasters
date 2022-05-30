/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';

/* Service imports */
import URLS from '@/services/mixmaster-url.service';

/* Component imports */
import Container from '@/pages/settings/extensions-listing/container.vue';
import SectionsList from '@/pages/settings/extensions-listing/sections-list.vue';

/* Mock imports */
import mockData from './fixtures/mocks';

let localVue;
const mock = new MockAdapter(axios);
let router, wrapper;

describe('Extensions Container', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/administrator/settings/partners/extensions-listing', component: Container }
            ]
        });

        mock.onGet(URLS.GET_AVAILABLE_SECTIONS())
        .reply(200, mockData.availableSections);

        mock.onGet(URLS.EXTENSION_HOME())
        .reply(200, mockData.extensionHome);

        // mock.onPut(URLS.EXTENSION_HOME(mockData.updateHomePayload))
        mock.onPut(URLS.EXTENSION_HOME())
        .reply(200, mockData.updateHome);

        router.push('/administrator/settings/partners/extensions-listing');

        wrapper = mount(Container, {
            localVue,
            router
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
    });

    afterAll(() => {
        mock.reset();
    });
    
    it('Checks if extension home page is loaded', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('should show the sidebar if user clicks on any viewport icon except expand', async () => {
        let element = wrapper.findAll('.viewport-icon').at(1);
        element.trigger('click');

        expect(wrapper.vm.showSidebar).toBe(true);
    });
    
    it('should not show the sidebar if user clicks on any viewport icon if it is expand', async () => {
        let element = wrapper.findAll('.viewport-icon').at(3);
        element.trigger('click');

        expect(wrapper.vm.showSidebar).toBe(false);
    });

    // it('should call available pages when user successfully updates the home page', async() => {
    //     let getAvailablePagesMethod = jest.spyOn(wrapper.vm, 'getAvailablePages');

    //     console.log("getAvailablePagesMethod:   ", getAvailablePagesMethod);

    //     let element = wrapper.findComponent(SectionsList);
    //     element.vm.$emit('save', mockData.updateHomeEvent);

    //     expect(getAvailablePagesMethod).not.toHaveBeenCalled();
    // })
})
