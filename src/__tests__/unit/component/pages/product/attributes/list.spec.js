import {mount} from "@vue/test-utils";
import AttributeComponent from "../../../../../../pages/product/attributes/list.vue";


describe('Mounted Category List', () => {
    let wrapper;
    beforeAll(() => {
        wrapper = mount(AttributeComponent,{
            propsData: {
            },
			mocks:{
                $route: {
                    params: {},
                    query: {}
				}
			}
		}
        );
    })
    it('has data', () => {
        expect(typeof AttributeComponent.data).toBe('function');
    })
    
	test('is a Vue instance', () => {
	  expect(wrapper.vm).toBeTruthy()
	})
	it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
	  })
  }
)
