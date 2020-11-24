import {mount} from "@vue/test-utils";
import * as sinon from "sinon";
import { console, Promise } from "window-or-global";
import EditCategory from "../../../../../../pages/product/attributes/list.vue";
import URLS from  "../../../../../../services/company-admin.service";


describe('Mounted Category List', () => {
    let wrapper;
    beforeAll(() => {
        wrapper = mount(EditCategory,{
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
        expect(typeof EditCategory.data).toBe('function');
    })
    
	test('is a Vue instance', () => {
	  expect(wrapper.vm).toBeTruthy()
	})
	it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
	  })
  }
)
