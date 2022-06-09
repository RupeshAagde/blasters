'use strict';
import CategoryCard from '@/components/packaging/common/category-card.vue'
import { mount } from '@vue/test-utils';

let wrapper
let item={
    categories:[
        {
            name:'category1'
        },
        {
            name:'category2'
        },
        {
            name:'category3'
        },
        {
            name:'category4'
        },
        {
            name:'category5'
        },
        {
            name:'category6'
        },
        {
            name:'category7'
        },
        {
            name:'category8'
        },
    ],
    name:'Footwear'
}
describe('Category config home', () => {
    beforeEach(async() => {
        wrapper=mount(CategoryCard,{
            propsData:{
                item
            }
        });
    })
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
    it('should check mapping of item info',()=>{
        expect(wrapper.find('#item-name').element.textContent.trim()).toBe(item.name)
        expect(wrapper.find('#category-name').element.textContent.trim()).toBe('Categories:')
    })
    it("should check for mapping of extra count",()=>{
        expect(wrapper.find('#extra-count-value').element.textContent.trim()).toBe(`+2`)
    })
    it("should check for mapping of extra categories",()=>{
        item.categories.forEach((a,i)=>{
            if(i< wrapper.vm.displayCount){
                expect(wrapper.find(`#name-${i}`).element.textContent).toBe(a.name)
            }
        })
    })
});