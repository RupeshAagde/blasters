import { mount, shallowMount } from "@vue/test-utils";
import CompanyComponent from "../../../../../pages/company-admin/stores.vue";
import URLS from "../../../../../services/domain.service.js"

describe('Mounted Company Stores', () => {
	let wrapper;
	beforeAll(() => {
		wrapper = mount(CompanyComponent, {
			propsData: {
			},
			mocks: {
				$route: {
					params: {},
					query: {} //TODO: Change mock query params to VUE ROUTER mock
				}
			}
		}
		);
	})
	test('is a Vue instance', () => {
		expect(wrapper.vm).toBeTruthy()
	})
	it('has data', () => {
		expect(typeof CompanyComponent.data).toBe('function');
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
