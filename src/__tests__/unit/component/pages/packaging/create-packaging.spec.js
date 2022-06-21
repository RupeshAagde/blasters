'use strict';
import CreatePackaging from '@/pages/packaging/create-packaging.vue'
import { createLocalVue, mount } from '@vue/test-utils';
import PackagingCreate from '@/components/packaging/packaging-create.vue'
import BaseModal from '@/components/common/dialogs/base-modal.vue';
import VueRouter from 'vue-router';

let wrapper
const localVue = createLocalVue()
localVue.use(VueRouter);
let router = new VueRouter()
describe('Category packaging home', () => {
    beforeEach(async() => {
        wrapper=mount(CreatePackaging,{localVue,router});
    })
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
    it("should check for page header",()=>{
        expect(wrapper.find('.page-title').element.textContent).toBe("Add Packaging")
    })
    it("should check for listcategories component to be mounted",()=>{
        expect(wrapper.findComponent(PackagingCreate).exists()).toBe(true)
    })
    it("should check for class name of save button",async()=>{
        expect(wrapper.vm.isButtonDisabled).toBe(true)
        expect(wrapper.find('#save-packaging-btn').attributes().class).toBe('add-packaging-button opaque')
        await wrapper.setData({ isButtonDisabled: false })
        expect(wrapper.find('#save-packaging-btn').attributes().class).toBe('add-packaging-button')
        await wrapper.find('#save-packaging-btn').trigger('click')
    })
    it("should check for modal",async()=>{
        expect(wrapper.find('#modal-body-text').exists()).toBe(false)
        expect(wrapper.findComponent(BaseModal).exists()).toBe(true)
        await wrapper.setData({ isModalOpen: true })
        expect(wrapper.find('#modal-body-text').element.textContent.trim()).toBe('Packaging has been succesfully added to the list')
        expect(wrapper.find('#modal-btn').element.textContent.trim()).toBe('Thank you')
        await wrapper.find('#modal-btn').trigger('click')
    })
    it("should test for goBack",()=>{
        wrapper.vm.goBack()
    })
});