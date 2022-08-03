/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';

/* Component imports */
import TextBox from '@/pages/settings/extensions-listing/dynamic-input/textbox.vue';

/* Mock imports */
import mockData from './../fixtures/mocks';

let localVue;
let wrapper;

describe('Dynamic TextBox Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        wrapper = mount(TextBox, {
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

    it('should emit change when the value of input changes', async() => {
        let element = wrapper.find('input');
        element.trigger('input');

        expect(wrapper.emitted()).toHaveProperty('change');
    });
});