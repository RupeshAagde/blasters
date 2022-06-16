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
    });

    afterAll(() => {
        mock.reset();
    });

    it('Checks if component is loaded', async () => {
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

        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
    });

    it('Checks if close is emitted', async () => {
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

        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.onCloseClick();
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().close).toBeTruthy();
    });

    it('should work when section is changed', async() => {
        await flushPromises();
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
        wrapper = mount(SectionForm, {
            localVue,
            propsData: {
                section_schema: mockData.inputTypeSectionSchema,
                section: mockData.inputTypeSection,
                show: true,
                page: mockData.pageForTest
            },
            router
        });

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

    it('should emit zoom-out when dragging starts of a selected item', async() => {
        wrapper = mount(SectionForm, {
            localVue,
            propsData: {
                section_schema: mockData.collectionSectionSchema,
                section: mockData.collectionSection,
                show: true,
                page: mockData.pageForTest
            },
            router
        });

        await wrapper.vm.$nextTick();

        let element = wrapper.find('.drag');
        element.trigger('mousedown');

        expect(wrapper.emitted()).toHaveProperty('zoom-out');
    });

    it('should emit zoom-in when dragging stops for a selected item', async() => {
        wrapper = mount(SectionForm, {
            localVue,
            propsData: {
                section_schema: mockData.collectionSectionSchema,
                section: mockData.collectionSection,
                show: true,
                page: mockData.pageForTest
            },
            router
        });

        await wrapper.vm.$nextTick();

        let element = wrapper.find('.drag');
        element.trigger('mouseup');

        expect(wrapper.emitted()).toHaveProperty('update-block');
        expect(wrapper.emitted()).toHaveProperty('zoom-in');
        expect(wrapper.vm.dragging).toBe(false);
        expect(wrapper.vm.movingIndex).toBe(-1);
    });

    it('should emit zoom-in when dragging stops for a selected item', async() => {
        wrapper = mount(SectionForm, {
            localVue,
            propsData: {
                section_schema: mockData.collectionSectionSchema,
                section: mockData.collectionSection,
                show: true,
                page: mockData.pageForTest
            },
            router
        });

        await wrapper.vm.$nextTick();

        let element = wrapper.find('.sections');
        element.vm.$emit('change');
        
        wrapper.vm.onMove({
            draggedContext: {
                index: 1,
                futureIndex: 2
            }
        });

        expect(wrapper.vm.movingIndex).toBe(2);
    });

    it('should remove item', async() => {
        wrapper = mount(SectionForm, {
            localVue,
            propsData: {
                section_schema: mockData.collectionSectionSchema,
                section: mockData.collectionSection,
                show: true,
                page: mockData.pageForTest
            },
            router
        });

        await wrapper.vm.$nextTick();

        let element = wrapper.find('.remove');
        element.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('update-block');
    });
});
