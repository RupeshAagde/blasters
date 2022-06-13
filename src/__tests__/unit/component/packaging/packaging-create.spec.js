'use strict';
import  PackagingCreate from '@/components/packaging/packaging-create.vue'
import { mount } from '@vue/test-utils';

let wrapper
let category = {
    id:1,
    value:1
}
describe('Packaging Create', () => {
    beforeEach(async() => {
        wrapper=mount(PackagingCreate);
    })
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
    it("should check for header",()=>{
        expect(wrapper.find('.packaging-create-container-header').element.textContent).toBe("Extra Details")
    })
    it("should test the input field",()=>{
        const input =  wrapper.find('#select-packaging')
        input.element.value = "test value"
        input.trigger('input')
        expect(wrapper.vm.searchInput).toBe("test value")
        expect(wrapper.vm.searchTooltipText).toBe("Tool tip text")
    })
    it("should check for checkGroupCategoryError",async()=>{
        const resp = await wrapper.vm.checkGroupCategoryError()
        expect(resp).toBe(false)
    })
    it("should simulate changes in the row2 inputs",()=>{
        wrapper.vm.handleChange('row2Inputs', 'length', 1)
        wrapper.vm.handleChange('row2Inputs', 'width', 2)
        expect(wrapper.vm.row3Inputs['deadWeight'].value).toBe('')
        wrapper.vm.handleChange('row2Inputs', 'height', 3)
        expect(wrapper.vm.row3Inputs['deadWeight'].value).toBe(1*2*3/5000)
    })
    it("should check for row inputs to be mapped",()=>{
        [0,1,2].forEach((id)=>{
            expect(wrapper.find(`#row2-${id}`).exists()).toBe(true)
            expect(wrapper.find(`#row3-${id}`).exists()).toBe(true)
        })
    })
    it("should simulate on click on the addgroup button",async()=>{
        expect(wrapper.find('#add-group').exists()).toBe(false)
        // toggle the bulk location category area
        await wrapper.vm.handleToggleChange('bulk')
        await wrapper.vm.handleToggleChange('l3')
        expect(wrapper.find('#add-group').exists()).toBe(true)
        expect(wrapper.find('#add-group').attributes().disabled).toBe('disabled')
        expect(wrapper.find('#add-group').attributes().class).toBe("n-button ripple n-button-secondary add-group-btn opaque")
        expect(wrapper.vm.bulkPackaging.length).toBe(1)
        wrapper.vm.bulkPackaging[0].volumetricWeight.minimum.value = 1
        wrapper.vm.bulkPackaging[0].volumetricWeight.maximum.value = 1
        wrapper.vm.bulkPackaging[0].quantity.minimum.value = 1
        wrapper.vm.bulkPackaging[0].quantity.maximum.value = 1
        wrapper.vm.bulkPackaging[0].categoryConfig = 'category'
        wrapper.vm.handleAddGroup()
        expect(wrapper.vm.bulkPackaging.length).toBe(2)
    })
    it("should test for handleGroup delete",async ()=>{
        await wrapper.vm.handleGroupDelete(0)
        expect(wrapper.vm.bulkPackaging.length).toBe(0)
    })
    it("should check for checkGroupCategoryError",async()=>{
        const resp = await wrapper.vm.checkGroupCategoryError()
        expect(resp).toBe(false)
    })
    it("should test the savePackagingOrder",()=>{
        wrapper.vm.savePackagingOrder()
    })
});