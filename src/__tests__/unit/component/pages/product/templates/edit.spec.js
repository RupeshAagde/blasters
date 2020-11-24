import {mount, shallowMount} from "@vue/test-utils";
import EditCategory from "../../../../../../pages/product/templates/edit.vue";

describe('Mounted Templates', () => {
	let wrapper;
	beforeAll(() => {
		wrapper = shallowMount(EditCategory,{
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
	it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
	  })
	  it('div expect', () => {
		const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
	})
  }
)
