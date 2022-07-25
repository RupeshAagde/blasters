/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

/* Component imports */
import AvailableSections from '@/pages/settings/extensions-listing/available-sections-list.vue';
import AvailableSectionItem from '@/pages/settings/extensions-listing/available-section-list-item.vue';

/* Mock imports */
import mockData from './fixtures/mocks';

let localVue;
let router, wrapper;

describe('Available Sections Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/administrator/settings/partners/extensions-listing', component: AvailableSections }
            ]
        });

        router.push('/administrator/settings/partners/extensions-listing');

        wrapper = mount(AvailableSections, {
            localVue,
            propsData: {
                available_sections: mockData.availableSectionsMock,
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
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('should emit select when user has selected a section', async() => {
        let element = wrapper.findComponent(AvailableSectionItem);
        element.vm.$emit('select');
        expect(wrapper.emitted()).toHaveProperty('select');
    });

    it('should emit add-section when user has confirmed selecting a section', async() => {
        let element = wrapper.findComponent(AvailableSectionItem);
        element.vm.$emit('confirm_add');
        expect(wrapper.emitted()).toHaveProperty('add-section');
    });

    it('should emit remove_preview when user has removed a section', async() => {
        let element = wrapper.findComponent(AvailableSectionItem);
        element.vm.$emit('remove_preview');
        expect(wrapper.emitted()).toHaveProperty('remove_preview');
    });

    it('should emit close when user has clicks on the close icon of the available section', async() => {
        let element = wrapper.find('.close-btn');
        element.trigger('click');
        expect(wrapper.emitted()).toHaveProperty('close');
    });
});
