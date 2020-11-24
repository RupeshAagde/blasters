import {mount, shallowMount} from "@vue/test-utils";
import EditAttributes from "../../../../../../pages/product/attributes/edit.vue";

describe('Mounted Attributes Edit', () => {
	let wrapper;
	beforeAll(() => {
		wrapper = shallowMount(EditAttributes,{
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
		expect(typeof EditAttributes.data).toBe('function');
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
