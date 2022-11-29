/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import { NitrozenCheckBox } from '@gofynd/nitrozen-vue';

/* Component imports */
import CheckBox from '@/pages/settings/extensions-listing/dynamic-input/checkbox.vue';

/* Mock imports */
import mockData from './../fixtures/mocks';

let localVue;
let wrapper;

describe('Dynamic CheckBox Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        wrapper = mount(CheckBox, {
            localVue,
            propsData: {
                prop_schema: mockData.sectionSchemaForTest.props[0],
                prop: mockData.sectionsMock[0],
                name: ''
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
        let element = wrapper.findComponent(NitrozenCheckBox);
        element.vm.$emit('change', {
            target: {
                checked: false
            }
        });

        expect(wrapper.emitted()).toHaveProperty('change');
    });
});