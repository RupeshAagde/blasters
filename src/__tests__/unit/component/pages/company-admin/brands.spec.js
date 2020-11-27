import {mount, shallowMount} from "@vue/test-utils";
import BrandComponent from "../../../../../pages/company-admin/brands.vue";
import URLS from  "../../../../../services/domain.service.js"

describe('Mounted Attributes Group Nd order Dialog', () => {
	let wrapper;
	beforeAll(() => {
		wrapper = shallowMount(BrandComponent,{
			propsData: {
			},
			mocks:{
				$route: {
                    params: {},
                    query:{}
				}
			}
		}
		);
	})
	test('is a Vue instance', () => {
	  expect(wrapper.vm).toBeTruthy()
	})
	it('has data', () => {
		expect(typeof BrandComponent.data).toBe('function');
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
