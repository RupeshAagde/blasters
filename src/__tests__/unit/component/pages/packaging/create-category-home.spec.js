'use strict';
import CreateCategoryHome from '@/pages/packaging/create-category-home.vue'
import { mount } from '@vue/test-utils';
import CreateCategory from '@/components/packaging/create-category.vue'
import BaseModal from '@/components/common/dialogs/base-modal.vue';

let wrapper
describe('Category config home', () => {
    beforeEach(async() => {
        wrapper=mount(CreateCategoryHome);
    })
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
    it("should check for page header",()=>{
        expect(wrapper.find('.page-title').element.textContent).toBe("Add New Category")
    })
    it("should check for listcategories component to be mounted",()=>{
        expect(wrapper.findComponent(CreateCategory).exists()).toBe(true)
    })
    it("should check for class name of save button",async()=>{
        expect(wrapper.vm.isButtonDisabled).toBe(true)
        expect(wrapper.find('#save-category-btn').attributes().class).toBe('add-category-button opaque')
        await wrapper.setData({ isButtonDisabled: false })
        expect(wrapper.find('#save-category-btn').attributes().class).toBe('add-category-button')
        await wrapper.find('#save-category-btn').trigger('click')
    })
    it("should check for modal",async()=>{
        expect(wrapper.find('#modal-body-text').exists()).toBe(false)
        expect(wrapper.findComponent(BaseModal).exists()).toBe(true)
        await wrapper.setData({ isModalOpen: true })
        expect(wrapper.find('#modal-body-text').element.textContent.trim().replace(/\s/g,'')).toContain('Category has been succesfully added to the list'.replace(/\s/g,''))
        expect(wrapper.find('#modal-btn').element.textContent.trim()).toBe('Thank you')
        await wrapper.find('#modal-btn').trigger('click')
    })
});