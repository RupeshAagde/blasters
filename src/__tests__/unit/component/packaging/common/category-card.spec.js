'use strict';
import CategoryCard from '@/components/packaging/common/category-card.vue';
import { mount } from '@vue/test-utils';
import mocks from '../fixtures/mocks';
let wrapper;
let item = {
    categories: [2741, 2737, 2741, 2737, 2741, 2737, 2741, 2737, 2741, 2737],
    name: 'Footwear'
};
let respItem = [
    'ResQ l3',
    'CategoryTesting',
    'ResQ l3',
    'CategoryTesting',
    'ResQ l3',
    'CategoryTesting',
    'ResQ l3',
    'CategoryTesting',
    'ResQ l3',
    'CategoryTesting'
];
describe('Category config home', () => {
    beforeEach(async () => {
        wrapper = mount(CategoryCard, {
            propsData: {
                item,
                handleEditClicked: jest.fn(),
                l3CategoryList: mocks.l3Categories
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
    it('should check mapping of item info', () => {
        expect(wrapper.find('#item-name').element.textContent.trim()).toBe(
            item.name
        );
        expect(wrapper.find('#category-name').element.textContent.trim()).toBe(
            'Categories:'
        );
    });
    it('should check for mapping of extra count', () => {
        expect(
            wrapper.find('#extra-count-value').element.textContent.trim()
        ).toBe(`+ 6`);
    });
    it('should check for mapping of extra categories', () => {
        item.categories.forEach((a, i) => {
            if (i < wrapper.vm.displayCount) {
                expect(
                    wrapper
                        .find(`#item-name-row${i}`)
                        .element.textContent.trim()
                ).toBe(respItem[i]);
            }
        });
    });
    it("should simulate edit click",async()=>{
        let btn = wrapper.find('#edit-click')
        await btn.trigger('click')
        expect(wrapper.props().handleEditClicked).toHaveBeenCalled()
    })
});
