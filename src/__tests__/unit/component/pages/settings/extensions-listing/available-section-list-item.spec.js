/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import { NitrozenButton } from '@gofynd/nitrozen-vue';

/* Component imports */
import AvailableSectionItem from '@/pages/settings/extensions-listing/available-section-list-item.vue';

/* Mock imports */
import mockData from './fixtures/mocks';

let localVue;
let router, wrapper;

describe('Available Section List Item Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/administrator/settings/partners/extensions-listing', component: AvailableSectionItem }
            ]
        });

        router.push('/administrator/settings/partners/extensions-listing');

        wrapper = mount(AvailableSectionItem, {
            localVue,
            propsData: {
                section: mockData.availableSectionsMock[0],
                index: 0
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

    it('should emit select when the user clicks on the list item', async() => {
        let element = wrapper.find('.available-section-list-item');
        element.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('select');
    });

    it('should keep the Add button hidden if the user clicks on the outside and it is not visible', async() => {
        wrapper.vm.hideAdd();
        expect(wrapper.vm.show_add).toBe(false);
    });

    it('should emit remove_preview when the user clicks outside', async() => {
        wrapper.setData({
            show_add: true
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        wrapper.vm.hideAdd();
        expect(wrapper.emitted()).toHaveProperty('remove_preview');
    });

    it('should emit confirm_add if the user clicks on the add button', async() => {
        wrapper.setData({
            show_add: true
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let element = wrapper.findComponent(NitrozenButton);
        element.vm.$emit('click');

        expect(wrapper.emitted()).toHaveProperty('confirm_add');
    })
});
