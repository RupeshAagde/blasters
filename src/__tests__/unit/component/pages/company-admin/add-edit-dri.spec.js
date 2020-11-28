import { mount, shallowMount } from "@vue/test-utils";
import CompanyComponent from "../../../../../pages/company-admin/add-edit-dri.vue";
import URLS from "../../../../../services/domain.service.js"

describe('Mounted Company Edit Component', () => {
	let wrapper;
	beforeAll(() => {
		wrapper = mount(CompanyComponent, {
			propsData: {
			},
			mocks: {
				$route: {
					params: {}  //TODO: Change mock query params to VUE ROUTER mock
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
