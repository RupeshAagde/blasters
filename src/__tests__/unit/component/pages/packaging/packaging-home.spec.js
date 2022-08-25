'use strict';
import PackagingHome from '@/pages/packaging/packaging-home.vue'
import { mount } from '@vue/test-utils';
import ListPackaging from '@/components/packaging/list-packaging.vue'

let wrapper
describe('Category config home', () => {
    beforeEach(async() => {
        wrapper=mount(PackagingHome);
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
        expect(wrapper.findComponent(ListPackaging).exists()).toBe(true)
    })
});