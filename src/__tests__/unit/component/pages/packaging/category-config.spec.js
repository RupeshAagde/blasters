'use strict';
import CategoryConfig from '@/pages/packaging/category-config.vue'
import { mount } from '@vue/test-utils';
import ListCategories from '@/components/packaging/list-categories.vue'

let wrapper
describe('Category config home', () => {
    beforeEach(async() => {
        wrapper=mount(CategoryConfig);
    })
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
    it("should check for page header",()=>{
        expect(wrapper.find('.page-title').element.textContent).toBe("Packaging")
    })
    it("should check for listcategories component to be mounted",()=>{
        expect(wrapper.findComponent(ListCategories).exists()).toBe(true)
    })
});