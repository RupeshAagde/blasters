'use strict';
import PackagingCreate from '@/components/packaging/packaging-create.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { GET_PACKAGING_PRODUCTS } from '../../../../store/getters.type';
import mocks from './fixtures';
let wrapper;
let category = {
    id: 1,
    value: 1
};
const localVue = createLocalVue();
localVue.use(Vuex);
let store = new Vuex.Store({
    modules: {
        packaging: {
            state: {},
            getters: {
                async [GET_PACKAGING_PRODUCTS](data) {
                    return mocks.products;
                }
            }
        },
        dispatch: jest.fn()
    }
});
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
describe('Packaging Create', () => {
    beforeEach(async () => {
        wrapper = mount(PackagingCreate, { localVue, store });
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it('should check for header', () => {
        expect(
            wrapper.find('.packaging-create-container-header').element
                .textContent
        ).toBe('Extra Details');
    });
    it('should test the input field', () => {
        const input = wrapper.find('#select-packaging');
        input.element.value = 'test value';
        input.trigger('input');
        expect(wrapper.vm.searchInput).toBe('test value');
        expect(wrapper.vm.searchTooltipText).toBe('Tool tip text');
    });
    it('should check for checkGroupCategoryError', async () => {
        const resp = await wrapper.vm.checkGroupCategoryError();
        expect(resp).toBe(false);
    });
    it('should simulate changes in the row2 inputs', () => {
        wrapper.vm.handleChange('row2Inputs', 'length', 1);
        wrapper.vm.handleChange('row2Inputs', 'width', 2);
        expect(wrapper.vm.row3Inputs['deadWeight'].value).toBe('');
        wrapper.vm.handleChange('row2Inputs', 'height', 3);
        expect(wrapper.vm.row3Inputs['deadWeight'].value).toBe(
            (1 * 2 * 3) / 5000
        );
    });
    it('should check for row inputs to be mapped', () => {
        [0, 1, 2].forEach((id) => {
            expect(wrapper.find(`#row2-${id}`).exists()).toBe(true);
            expect(wrapper.find(`#row3-${id}`).exists()).toBe(true);
        });
    });
    it('should simulate on click on the addgroup button', async () => {
        expect(wrapper.find('#add-group').exists()).toBe(false);
        // toggle the bulk location category area
        await wrapper.vm.handleToggleChange('bulk');
        await wrapper.vm.handleToggleChange('l3');
        expect(wrapper.find('#add-group').exists()).toBe(true);
        expect(wrapper.find('#add-group').attributes().disabled).toBe(
            'disabled'
        );
        expect(wrapper.find('#add-group').attributes().class).toBe(
            'n-button ripple n-button-secondary add-group-btn opaque'
        );
        expect(wrapper.vm.bulkPackaging.length).toBe(1);
        wrapper.vm.bulkPackaging[0].volumetricWeight.minimum.value = 1;
        wrapper.vm.bulkPackaging[0].volumetricWeight.maximum.value = 1;
        wrapper.vm.bulkPackaging[0].quantity.minimum.value = 1;
        wrapper.vm.bulkPackaging[0].quantity.maximum.value = 1;
        wrapper.vm.bulkPackaging[0].categoryConfig = 'category';
        wrapper.vm.handleAddGroup();
        expect(wrapper.vm.bulkPackaging.length).toBe(2);
    });
    it('should test for handleGroup delete', async () => {
        await wrapper.vm.handleGroupDelete(0);
        expect(wrapper.vm.bulkPackaging.length).toBe(0);
    });
    it('should check for checkGroupCategoryError', async () => {
        const resp = await wrapper.vm.checkGroupCategoryError();
        expect(resp).toBe(false);
    });
    it('should test the savePackagingOrder', () => {
        wrapper.vm.savePackagingOrder();
    });
    it('should test for input field simulation and data being set in state', async () => {
        const input = wrapper.find('#select-packaging');
        input.element.value = '5 Ply Corrugated';
        await input.trigger('input');
        expect(wrapper.vm.searchInput).toBe('5 Ply Corrugated');
        expect(wrapper.vm.searchTooltipText).toBe('Tool tip text');
        sleep(1500).then(()=>{
            expect(wrapper.vm.showSearchList).toBe(true);
            console.log(wrapper.vm.searchedProductList)
            expect(wrapper.vm.searchedProductList.length).toBe(1);
        })
    });
    it("should check for mapping of searchable list",()=>{

        wrapper.vm.searchedProductList = [{
            image:
                'https://hdn-1.addsale.com/addsale/products/pictures/item/free/270x0/rollup/5PLY_CB_M_221816/0/X-AZmPfOn9-5PLY_CB_M_221816.jpg',
            name: '5 Ply Corrugated box (22 X 18 x 16 inch ) - Pack of 10',
            dimension: '22 X 18 x 16 inch'
        },
        {
            image:
                'https://hdn-1.addsale.com/addsale/products/pictures/item/free/270x0/rollup/5PLY_CB_M_221816/0/X-AZmPfOn9-5PLY_CB_M_221816.jpg',
            name: '3 ply corrugated box [13.5 x 12 x 3 Inch] - pack of 25',
            dimension: '22 X 18 x 16 inch'
        }]
        wrapper.vm.showSearchList = true
        expect(wrapper.vm.showSearchList).toBe(true)
        expect(wrapper.vm.searchedProductList.length).toBe(2)
        // expect(wrapper.find('#product-not-found').element.textContent).toBe("")
        // wrapper.vm.searchedProductList.forEach((item,index)=>{
        //     expect(wrapper.find('#packaging-image'+index).attributes().src).toBe(item.image)
        //     expect(wrapper.find('#packaging-name'+index).element.textContent).toBe(item.name)
        //     expect(wrapper.find('#packaging-dimension'+index).element.textContent).toBe(item.dimension)
        // })
    })
});
