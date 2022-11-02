/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';

/* Component imports */
import DynamicInput from '@/pages/settings/extensions-listing/dynamic-input/index.vue';

/* Mock imports */
import mockData from './../fixtures/mocks';

let localVue;
let wrapper;

describe('Dynamic Input Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        wrapper = mount(DynamicInput, {
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

    it('should emit change when the component receives change event', async() => {
        wrapper.vm.onChange();
        expect(wrapper.emitted()).toHaveProperty('change');
    });

    it('should emit searchInputChange when the component receives search event', async() => {
        wrapper.vm.onSearchInputChange();
        expect(wrapper.emitted()).toHaveProperty('searchInputChange');
    })
});