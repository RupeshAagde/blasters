import {mount} from "@vue/test-utils";
import sinon from "sinon";
import ListComponent from "../../../../../pages/catalogue/list-variants.vue";
import Catalogue from  "../../../../../services/catalog.service.js"

const stubFetchVariants= sinon.stub(Catalogue,"fetchVariants");

describe('Mounted Variant List', () => {
    let wrapper;
    beforeAll(() => {
        stubFetchVariants.callsFake(() => Promise.resolve({data:{data: []}}))
        wrapper = mount(ListComponent,{
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
        expect(typeof ListComponent.data).toBe('function');
    })
    
	test('is a Vue instance', () => {
	  expect(wrapper.vm).toBeTruthy()
	})
	it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
	  })
  }
)
