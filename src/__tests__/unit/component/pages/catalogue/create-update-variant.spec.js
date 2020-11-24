import {mount, shallowMount} from "@vue/test-utils";
import sinon from "sinon";
import { Promise } from "window-or-global";
import VariantComponent from "../../../../../pages/catalogue/create-update-variant.vue";
import Catalogue from  "../../../../../services/catalog.service.js"


const stubFetchDepartment= sinon.stub(Catalogue,"fetchDepartment");
const stubFetchChoices= sinon.stub(Catalogue,"fetchChoices");

describe('Mounted Variant Create/Update', () => {
	let wrapper;
	beforeAll(() => {
        stubFetchDepartment.callsFake(() => Promise.resolve({data:{data: []}}))
        stubFetchChoices.callsFake(() => Promise.resolve({data:{data: []}}))
		wrapper = mount(VariantComponent,{
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
		expect(typeof VariantComponent.data).toBe('function');
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
