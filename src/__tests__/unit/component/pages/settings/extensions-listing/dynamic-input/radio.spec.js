/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import { NitrozenRadio } from '@gofynd/nitrozen-vue';

/* Component imports */
import Radio from '@/pages/settings/extensions-listing/dynamic-input/radio.vue';

/* Mock imports */
import mockData from './../fixtures/mocks';

let localVue;
let wrapper;

describe('Dynamic Radio Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        wrapper = mount(Radio, {
            localVue,
            propsData: {
                prop_schema: mockData.sectionSchemaForTest.props[4],
                prop: mockData.sectionsMock[4],
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

    it('should emit change when the value of radio changes', async() => {
        let element = wrapper.findComponent(NitrozenRadio);
        element.vm.$emit('change');

        expect(wrapper.emitted()).toHaveProperty('change');
    });
});