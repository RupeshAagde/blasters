/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';

/* Component imports */
import Header from '@/pages/settings/extensions-listing/dynamic-input/header.vue';

/* Mock imports */
import mockData from './../fixtures/mocks';

let localVue;
let wrapper;

describe('Dynamic Header Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        wrapper = mount(Header, {
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