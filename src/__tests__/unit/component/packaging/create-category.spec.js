'use strict';
import CreateCategory from '@/components/packaging/create-category.vue';
import { mount } from '@vue/test-utils';

let wrapper;
let category = {
    id: 1,
    value: 1
};
describe('Category config home', () => {
    beforeEach(async () => {
        wrapper = mount(CreateCategory, {
            propsData: {
                toggleBtn: jest.fn()
            }
        });
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it('should check for header', () => {
        expect(
            wrapper.find('.category-create-container-header').element
                .textContent
        ).toBe('Create Category');
    });
    it('should test the input field', () => {
        const input = wrapper.find('#category-input');
        input.element.value = 'test value';
        input.trigger('input');
        expect(wrapper.vm.groupName.value).toBe('test value');
        expect(wrapper.vm.groupName.error).toBe('');
        expect(wrapper.vm.groupName.placeHolder).toBe('Name of the group');
        expect(wrapper.vm.groupName.label).toBe('Group Name');
    });
    it('should simulate error on blur', () => {
        const input = wrapper.find('#category-input');
        input.element.value = 'test value';
        input.trigger('input');
        input.trigger('blur');
        expect(wrapper.vm.groupName.error).toBe('');
        input.element.value = '';
        input.trigger('input');
        input.trigger('blur');
        expect(wrapper.vm.groupName.error).toBe(
            `${wrapper.vm.groupName.label} is a mandatory field`
        );
    });
    it('should check for the handle Save function', () => {
        const input = wrapper.find('#category-input');
        input.element.value = 'test value';
        input.trigger('input');
        wrapper.vm.selectedCategories = [123];
        const resp = wrapper.vm.handleSave();
        let op = {
            categories: [undefined],
            is_active: false,
            name: 'test value',
            slug: 'test-value',
            tags: []
        };
        expect(resp).toStrictEqual(op);
    });
    it('should check for handleCategoryChange function', () => {
        expect(wrapper.vm.selectedCategories).toStrictEqual([]);
        expect(wrapper.vm.categoryValue).toStrictEqual([]);
        wrapper.vm.searchableCategoryList = [category];
        wrapper.vm.handleCategoryChange([1]);
        expect(wrapper.vm.selectedCategories).toStrictEqual([category]);
        expect(wrapper.vm.categoryValue).toStrictEqual([1]);
    });
    it('should test the remove category function', () => {
        wrapper.vm.handleCategoryRemove(category, 0);
        expect(wrapper.vm.selectedCategories).toStrictEqual([]);
        expect(wrapper.vm.categoryValue).toStrictEqual([]);
    });
});
