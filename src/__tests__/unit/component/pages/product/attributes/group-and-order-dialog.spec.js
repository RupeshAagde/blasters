import {mount, shallowMount} from "@vue/test-utils";
import Attributes from "../../../../../../pages/product/attributes/group-and-order-dialog.vue";

describe('Mounted Attributes Group Nd order Dialog', () => {
	let wrapper;
	beforeAll(() => {
		wrapper = mount(Attributes,{
			propsData: {
			},
			mocks:{
				$route: {
					params: {}
				}
			}
		}
		);
	})
	test('is a Vue instance', () => {
	  expect(wrapper.vm).toBeTruthy()
	})
	it('has data', () => {
		expect(typeof Attributes.data).toBe('function');
	})
	it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
	  })
	it('div expect', () => {
		const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
	})
  }
)
