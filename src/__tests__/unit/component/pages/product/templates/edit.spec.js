import {mount, shallowMount} from "@vue/test-utils";
import TemplateComponent from "../../../../../../pages/product/templates/edit.vue";

describe('Mounted Templates', () => {
	let wrapper;
	beforeAll(() => {
		wrapper = mount(TemplateComponent,{
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
	  expect(wrapper.exists()).toBeTruthy()
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
