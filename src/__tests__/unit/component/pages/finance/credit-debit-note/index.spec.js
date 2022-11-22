'use strict';

import { shallowMount } from "@vue/test-utils";
import CreditNoteIndex from '../../../../../../../src/pages/finance/credit-debit-note/index.Vue';


describe('Index Page of Credit Debit Note', () => {
    let wrapper;
    beforeAll(() => {
		wrapper = shallowMount(CreditNoteIndex, {
			propsData: {
			},
			mocks: {
				$route: {
					params: {},
                    query: {}  
				}
			}
		}
		);
	})

    it('is a Vue instance', () => {
		expect(wrapper.vm).toBeTruthy()
	})
	it('has data', () => {
		expect(typeof CreditNoteIndex.data).toBe('function');
	})
	it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
	})
	it('div expect', () => {
		const div = wrapper.find('div')
		expect(div.exists()).toBe(true)
	})
})
