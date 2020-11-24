import {mount, shallowMount} from "@vue/test-utils";
import DeptComponent from "../../../../../pages/catalogue/create-update-department.vue";

describe('Mounted Department Create/Update', () => {
	let wrapper;
	beforeAll(() => {
		wrapper = mount(DeptComponent,{
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
		expect(typeof DeptComponent.data).toBe('function');
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
