import {mount} from "@vue/test-utils";
import sinon from "sinon";
import DeptComponent from "../../../../../pages/catalogue/list-department.vue";
import Catalogue from  "../../../../../services/catalog.service.js"

const stubFetchDepartment= sinon.stub(Catalogue,"fetchDepartment");

describe('Mounted Department List', () => {
    let wrapper;
    beforeAll(() => {
        stubFetchDepartment.callsFake(() => Promise.resolve({data: {data: []}}))
        wrapper = mount(DeptComponent,{
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
        expect(typeof DeptComponent.data).toBe('function');
    })
    
	test('is a Vue instance', () => {
	  expect(wrapper.vm).toBeTruthy()
	})
	it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
	  })
  }
)
