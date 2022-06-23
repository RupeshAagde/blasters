'use strict';
import CreatePackaging from '@/pages/packaging/create-packaging.vue'
import { createLocalVue, mount } from '@vue/test-utils';
import PackagingCreate from '@/components/packaging/packaging-create.vue'
import BaseModal from '@/components/common/dialogs/base-modal.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { FETCH_GROUP_CATEGORIES, FETCH_L3_CATEGORIES, SAVE_PACKAGING_PRODUCT } from '../../../../../store/action.type';
import { GET_EDIT_PRODUCT } from '../../../../../store/getters.type';
let wrapper
const localVue = createLocalVue()
localVue.use(VueRouter);
localVue.use(Vuex)
let router = new VueRouter()
let store = new Vuex.Store({
    modules:{
        packaging:{
            state:{},
            dispatch: jest.fn(),
            getters:{
                async [GET_EDIT_PRODUCT](){
                    return {
                        data:true
                    }
                }
            },
            actions:{
                async [SAVE_PACKAGING_PRODUCT](){
                    return {data:"success"}
                },
                async [FETCH_L3_CATEGORIES](){
                    return []
                },
                async [FETCH_GROUP_CATEGORIES](){
                    return []
                }
            }
        }
    }
})
describe('Category packaging home', () => {
    beforeEach(async() => {
        wrapper=mount(CreatePackaging,{localVue,store,router});
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
        expect(wrapper.find('#modal-body-text').element.textContent.trim().replace(/\s/g, '')).toBe('Packaging has been succesfully added to the list'.replace(/\s/g, ''))
        expect(wrapper.find('#modal-btn').element.textContent.trim()).toBe('Thank you')
        await wrapper.find('#modal-btn').trigger('click')
    })
    it("should test for goBack",()=>{
        wrapper.vm.goBack()
    })
    it("should test for toggleBtnFunction",()=>{
        expect(wrapper.vm.isButtonDisabled).toBe(true)
        wrapper.vm.toggleBtn(false);
        expect(wrapper.vm.isButtonDisabled).toBe(false)
    })
    it("should test for onSave",async()=>{
        await wrapper.vm.onSave()
    })
});