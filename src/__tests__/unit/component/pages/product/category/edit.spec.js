import {mount, shallowMount} from "@vue/test-utils";
import EditCategory from "../../../../../../pages/product/category/edit.vue";


describe('EditCategory', () => {
it('has data', () => {
	expect(typeof EditCategory.data).toBe('function');
})
})

describe('Mounted Category', () => {
	let wrapper;
	beforeAll(() => {
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
	test('is a Vue instance', () => {
	  expect(wrapper.exists()).toBeTruthy()
	})
	// it('has a button', () => {
	// 	expect(wrapper.find('image-uploader-tile')).toBe(true)
	// })
	it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
	  })
	  it('div expect', () => {
		const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
	})
  }
)
