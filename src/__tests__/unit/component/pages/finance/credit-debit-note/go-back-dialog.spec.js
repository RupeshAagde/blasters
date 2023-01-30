'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import GoBackDialog from '../../../../../../../src/pages/finance/credit-debit-note/go-back-dialog.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';

describe('go back dialog', () => {
    let wrapper;
    beforeEach(()=>{
        wrapper = mount(GoBackDialog,{
            props:{
                  data: {
                    type: Object
                  }
            },
            mocks:{
                $router: {
                    params: {},
                    back:() => {}
                }
            }
        });
        wrapper.vm.open({});
    })

    it('is a Vue instance', () => {
		expect(wrapper.vm).toBeTruthy()
	})
    it('has data', () => {
		expect(typeof GoBackDialog.data).toBe('function');
	})
    it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
	})
    it('div expect', () => {
		const div = wrapper.find('div')
		expect(div.exists()).toBe(true)
	})
    it('should close the modal when the cancel button is clicked', () => {
        let element = wrapper.findComponent(NitrozenButton);
        element.vm.$emit('click');
        
        expect(wrapper.emitted()).toBeTruthy()
    })
    it('should go back on click of Go Back button', () => {
        let element = wrapper.find('.go-back')
        element.vm.$emit('click');
        expect(wrapper.emitted()).toBeTruthy()
    })
})
