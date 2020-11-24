import {mount} from "@vue/test-utils";
import ListComponent from "../../../../../../pages/product/templates/list.vue";

describe('Mounted Templates List', () => {
    let wrapper;
    beforeAll(() => {
        wrapper = mount(ListComponent,{
            propsData: {
            },
			mocks:{
                $route: {
                    params: {},
                    query: {}
                },
			}
		}
        );
    })
    it('has data', () => {
        expect(typeof ListComponent.data).toBe('function');
    })
    
	test('is a Vue instance', () => {
	  expect(wrapper.exists()).toBeTruthy()
	})
	it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
      })
    
  }
)
