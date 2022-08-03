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

        mock.onGet(URLS.FETCH_PUBLIC_EXTENSIONS(), {
            params: {
                _id: [
                    '60be66a2d4cbbf1fd0a67c8c',
                    '609400409d0dcbdc2e6b76a5',
                    '610d2ad295dcfa14eb408bad'
                ],
                published: true
            }
        })
        .reply(200, mockData.getExtensionInfo4);

        mock.onGet(URLS.FETCH_PUBLIC_EXTENSIONS(), {
            params: {
                _id: [
                    '60be66a2d4cbbf1fd0a67c8c',
                    '610d2ad295dcfa14eb408bad',
                    '61109c6795dcfa38cb408c70',
                    '6232f7c538bac40085b874c5'
                ],
                published: true
            }
        })
        .reply(200, mockData.getExtensionInfo2);

        mock.onGet(URLS.FETCH_PUBLIC_EXTENSIONS(), {
            params: {
                _id: [
                    '611624ac95dcfa262740920e',
                    '6116026a95dcfa05eb4091e3',
                    '61155f5d95dcfad8294091c4',
                    '61138cf895dcfa08a5408fc4'
                ],
                published: true
            }
        })
        .reply(200, mockData.getExtensionInfo3);

        mock.onGet(URLS.FETCH_PUBLIC_EXTENSIONS(), {
            params: {
                _id: [
                    '62445236d4cc749faccf213e',
                    '6232f7c538bac40085b874c5',
                    '61155f5d95dcfad8294091c4'
                ],
                published: true
            }
        })
        .reply(200, mockData.getExtensionInfo1);

        mock.onGet(URLS.GET_EXTENSION_COLLECTIONS_DETAILS(), {
            params: {
                _id: [
                    '623847d0ec3c4b10b1f5fed6',
                    '627ba8371171f7705212333b',
                    '62384f66ec3c4b4e6ff5fee6',
                    '625fe7c726e867d85730af1a'
                ]
            }
        }).reply(200, mockData.getCollectionDetails);

        mock.onGet(URLS.FETCH_PUBLIC_EXTENSIONS())
        .reply(200, mockData.fetchPublicExtensions);

        mock.onGet(URLS.GET_EXTENSION_COLLECTIONS())
        .reply(200, mockData.fetchCollections);

        mock.onGet(URLS.PUBLIC_EXTENSION_CATEGORIES())
        .reply(200, mockData.fetchCategories);


        mock.onGet(URLS.EXTENSION_HOME())
        .reply(200, mockData.extensionHome);

        mock.onGet(URLS.GET_AVAILABLE_SECTIONS())
        .reply(200, mockData.availableSections);


        // mock.onPut(URLS.EXTENSION_HOME(mockData.updateHomePayload))
        mock.onPut(URLS.EXTENSION_HOME(), mockData.putPayload)
        .reply(200, mockData.putResponse);

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

    it('should fetch new options for the dropdown when user searches for an extension', async() => {
        let getPublicExtensionsMethod = jest.spyOn(wrapper.vm, 'getPublicExtensions');

        await wrapper.vm.$nextTick();

        let element = wrapper.findComponent(SectionsList);
        element.vm.$emit('search-input', {type: 'extension', value: {text: 'Hello'}});

        expect(getPublicExtensionsMethod).toHaveBeenCalledWith({"name": "Hello"});
    });

    it('should fetch new options for the dropdown when user searches for a collection', async() => {
        let getCollectionsMethod = jest.spyOn(wrapper.vm, 'getCollections');

        await wrapper.vm.$nextTick();

        let element = wrapper.findComponent(SectionsList);
        element.vm.$emit('search-input', {type: 'collection', value: {text: 'Hello'}});
        element.vm.$emit('save', mockData.saveEventObj);

        expect(getCollectionsMethod).toHaveBeenCalledWith({"name": "Hello"});
    });
})
