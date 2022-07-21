/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';

/* Component imports */
import HTML from '@/pages/settings/extensions-listing/dynamic-input/html.vue';

/* Mock imports */
import mockData from './../fixtures/mocks';

let localVue;
let wrapper;

describe('Dynamic HTML Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        wrapper = mount(HTML, {
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
        let element = wrapper.find('input');
        element.trigger('input');

        expect(wrapper.emitted()).toHaveProperty('change');
    });
});