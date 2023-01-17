'use strict';

import { shallowMount } from "@vue/test-utils";
import CreditNoteIndex from '../../../../../../../src/pages/finance/credit-debit-note/index.Vue';
import flushPromises from 'flush-promises';


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
	it('should change Route', async() => {
		await flushPromises();

        let changeTab = jest.spyOn(wrapper.vm, 'changeGroupIndex');
		
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const groupEl = wrapper.find('#group-tab');
        groupEl.vm.$emit("tab-change", {
			"index": 1
		});
        await wrapper.vm.$nextTick();
        expect(changeTab).toHaveBeenCalled();
	})
})
