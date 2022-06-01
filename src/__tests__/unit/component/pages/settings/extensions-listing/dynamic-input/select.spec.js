/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import { NitrozenDropdown } from '@gofynd/nitrozen-vue';

/* Component imports */
import Select from '@/pages/settings/extensions-listing/dynamic-input/select.vue';

/* Mock imports */
import mockData from './../fixtures/mocks';

let localVue;
let wrapper;

describe('Dynamic Select Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        wrapper = mount(Select, {
            localVue,
            propsData: {
                prop_schema: mockData.sectionSchemaForTest.props[0],
                prop: mockData.sectionsMock[0],
                name: '',
                page: mockData.pageForTest
            }
        });
    });

    it('Checks if component is loaded', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('should emit change when the value of dropdown changes', async() => {
        let element = wrapper.findComponent(NitrozenDropdown);
        element.vm.$emit('change');

        expect(wrapper.emitted()).toHaveProperty('change');
    });

    it('should emit change when the value of dropdown changes', async() => {
        let element = wrapper.findComponent(NitrozenDropdown);
        element.vm.$emit('input');

        expect(wrapper.emitted()).toHaveProperty('input');
    });
});