/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

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

    it('Checks if onBlocksListChange works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.onBlocksListChange();
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted()['update-block']).toBeTruthy();
    });

    it('Checks if onBlockClick works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.block = {
            expand: false,
        };
        wrapper.vm.onBlockClick(wrapper.vm.block);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.block.expand).toBe(true);
    });
    
    it('Checks if removeBlock works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.removeBlock(0);
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted()['update-block']).toBeTruthy();
    });

    it('Checks if onBlockInputChange works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.onBlockInputChange(
            { props: { test: '' } },
            { id: 'test' },
            'test'
        );
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted()['update-block']).toBeTruthy();
    });

    it('Checks if onBlockSelectionOutsideClick works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.onBlockSelectionOutsideClick();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.showAvailableBlocksSelectionPopup).toBe(false);
    });

    it('should work when section is changed', async() => {
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

    it('should emit search-input when user searches in a dropdown', async() => {
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
    })
});
