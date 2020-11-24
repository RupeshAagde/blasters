import {mount} from "@vue/test-utils";
import * as sinon from "sinon";
import { console, Promise } from "window-or-global";
import EditCategory from "../../../../../../pages/product/category/list.vue";
import URLS from  "../../../../../../services/company-admin.service"


describe('EditCategory', () => {
it('has data', () => {
	expect(typeof EditCategory.data).toBe('function');
})
})

const stubMethod = sinon.stub(URLS,"fetchCategory_v2");

describe('Mounted Category List', () => {
    let wrapper;
    beforeAll(() => {
        console.log("**********************",stubMethod)
        stubMethod.callsFake(() => Promise.resolve([{}]))
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
