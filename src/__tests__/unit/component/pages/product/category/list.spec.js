import {mount} from "@vue/test-utils";
import * as sinon from "sinon";
import { console, Promise } from "window-or-global";
import EditCategory from "../../../../../../pages/product/category/list.vue";
import URLS from  "../../../../../../services/company-admin.service"


const stub_fetchCategory_v2 = sinon.stub(URLS,"fetchCategory_v2");

describe('Mounted Category List', () => {
    let wrapper;
    beforeAll(() => {
        stub_fetchCategory_v2.callsFake(() => Promise.resolve([{}]))
        wrapper = mount(EditCategory,{
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
    it('has data', () => {
        expect(typeof EditCategory.data).toBe('function');
    })
    
	test('is a Vue instance', () => {
	  expect(wrapper.vm).toBeTruthy()
	})
	// it('has a button', () => {
	// 	expect(wrapper.find('image-uploader-tile')).toBe(true)
	// })
	it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
      })
    
  }
)
