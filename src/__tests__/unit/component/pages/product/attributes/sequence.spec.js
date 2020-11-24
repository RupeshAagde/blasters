import {mount, shallowMount} from "@vue/test-utils";
import sinon from "sinon";
import EditAttributes from "../../../../../../pages/product/attributes/sequence.vue";
import URLS from  "../../../../../../services/company-admin.service"


const stubFetchShuffleAttributes = sinon.stub(URLS,"fetchShuffleAttributes");

describe('Mounted Attributes Attribute Sequence', () => {
	let wrapper;
	beforeAll(() => {
        stubFetchShuffleAttributes.callsFake(() => Promise.resolve([{}]))

		wrapper = shallowMount(EditAttributes,{
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
		expect(typeof EditAttributes.data).toBe('function');
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
