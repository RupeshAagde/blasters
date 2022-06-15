/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';

/* Component imports */
import SectionForm from '@/pages/settings/extensions-listing/section-form.vue';
import DynamicInput from '@/pages/settings/extensions-listing/dynamic-input/index.vue';

/* Mock imports */
import mockData from './fixtures/mocks';

let localVue;
let router, wrapper;

describe('Section Form Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/administrator/settings/partners/extensions-listing', component: SectionForm }
            ]
        });

        router.push('/administrator/settings/partners/extensions-listing');

        wrapper = mount(SectionForm, {
            localVue,
            propsData: {
                section_schema: mockData.sectionSchemaForTest,
                section: mockData.sectionForTest,
                show: true,
                page: mockData.pageForTest
            },
            router
        });
    });

    afterAll(() => {
        mock.reset();
    });

    it('Checks if component is loaded', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
    });

    it('Checks if close is emitted', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.onCloseClick();
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().close).toBeTruthy();
    });

    it('should work when section is changed', async() => {
        await flushPromises();

        let element = wrapper.findComponent(DynamicInput);
        element.vm.$emit('change', {
            id: 'heading',
            label: 'Heading',
            default: '',
            type: 'textbox',
            display: true
        }, {
            value: 'Hello'
        });

        expect(wrapper.emitted()['update-block']).toBeTruthy();
    });

    it('should work when input type section is changed', async() => {
        await flushPromises();

        wrapper.setProps({
            section: mockData.inputTypeSection,
            section_schema: mockData.inputTypeSectionSchema
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        let element = wrapper.findAllComponents(DynamicInput).at(6);

        element.vm.$emit('change', {
            value: 'api'
        }, {
            id: 'item_source',
            label: 'Item Source',
            default: '',
            type: 'radio',
            display: true
        });

        expect(wrapper.emitted()['update-block']).toBeTruthy();
    });

    it('should emit search-input when user searches in a dropdown', async() => {
        await flushPromises();

        let element = wrapper.findComponent(DynamicInput);
        element.vm.$emit('searchInputChange', {
            id: 'heading',
            label: 'Heading',
            default: '',
            type: 'textbox',
            display: true
        }, {
            value: 'Hello'
        }, 0);

        expect(wrapper.emitted()).toHaveProperty('search-input');
    });

    // it('should emit update-block when the use changes a value inside one of the inputs', async() => {
    //     let element = wrapper.findComponent(DynamicInput);
    //     element.vm.$emit('change', {
    //         id: 'collection'
    //     }, {
    //         value: ['1234', '5678'],
    //         details: [{_id: '1234'}, {_id: '5678'}]
    //     });

    //     await wrapper.vm.$nextTick();

    //     expect(wrapper.emitted()).toHaveProperty('update-block');
    // })
});
