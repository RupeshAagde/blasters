/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';

/* Component imports */
import Paragraph from '@/pages/settings/extensions-listing/dynamic-input/paragraph.vue';

/* Mock imports */
import mockData from './../fixtures/mocks';

let localVue;
let wrapper;

describe('Dynamic Paragraph Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        wrapper = mount(Paragraph, {
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
});