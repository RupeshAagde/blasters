'use strict';
import PackagingCard from '@/components/packaging/common/packaging-card.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import mocks from '../fixtures/mocks';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { EDIT_PRODUCT } from '../../../../../store/action.type';
let wrapper;
let item = {
    product: {
        name: 'Product name - pack of 90',
        media: [
            {
                url: 'image.png'
            }
        ],
        item_code: 123
    },
    dimensions: {
        length: '1',
        width: '1',
        height: '2'
    },
    l3_mapping: [
        {
            is_default_packaging_material: true,
            group_category: '62b0adb80000acb23b173033'
        },
        {
            is_default_packaging_material: true,
            group_category: '62b155050000acb23b173037'
        }
    ]
};
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
let router = new VueRouter();
let store = new Vuex.Store({
    modules: {
        packaging: {
            state: {},
            dispatch: jest.fn(),
            actions: {
                async [EDIT_PRODUCT]() {
                    return true;
                }
            }
        }
    }
});
describe('packaging card component ', () => {
    beforeEach(async () => {
        wrapper = mount(PackagingCard, {
            propsData: {
                item,
                groupCategories: [
                    {
                        modified_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        },
                        created_on: '2022-06-20 17:26:16.070000',
                        _id: '62b0adb80000acb23b173033',
                        categories: [2737, 2736],
                        modified_on: '2022-06-21 05:12:28.089000',
                        name: 'footwere',
                        slug: 'footwere',
                        created_by: {
                            username: 'shivamgupta_gofynd_com_57924',
                            user_id: 'a58e734b8755a09c5a73628f'
                        }
                    },
                    {
                        modified_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        },
                        created_on: '2022-06-21 05:20:05.766000',
                        _id: '62b155050000acb23b173037',
                        categories: [1361, 1337, 1374, 1360, 1341, 1362],
                        modified_on: '2022-06-29 07:13:59.401000',
                        name: 'Mens Clothing',
                        slug: 'mens-clothing',
                        created_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        }
                    },
                    {
                        modified_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        },
                        created_on: '2022-06-21 09:20:25.229000',
                        _id: '62b18d5928295b5287c3743c',
                        categories: [2141],
                        modified_on: '2022-06-21 10:47:20.215000',
                        name: 'pants',
                        slug: 'pant',
                        created_by: {
                            username: 'shivamgupta_gofynd_com_57924',
                            user_id: 'a58e734b8755a09c5a73628f'
                        }
                    },
                    {
                        modified_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        },
                        created_on: '2022-06-21 10:33:47.122000',
                        _id: '62b19e8b79cfa573ca4f1e25',
                        categories: [952],
                        modified_on: '2022-06-21 10:34:49.537000',
                        name: 'Footwear - update',
                        slug: 'footwear',
                        created_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        }
                    },
                    {
                        modified_by: {
                            username: 'kavishd29598_gmail_com_28101',
                            user_id: '4ad7ebc2e79657e864042802'
                        },
                        created_on: '2022-06-27 06:56:28.290000',
                        _id: '62b9549c152660e300cdf984',
                        categories: [
                            201,
                            2286,
                            2279,
                            1815,
                            528,
                            1805,
                            662,
                            841,
                            199,
                            953,
                            1818,
                            1814,
                            1812,
                            1816,
                            352,
                            1819
                        ],
                        modified_on: '2022-06-27 09:07:07.736000',
                        name: 'Luggage n',
                        slug: 'luggage',
                        created_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        }
                    },
                    {
                        modified_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        },
                        created_on: '2022-06-27 12:41:34.134000',
                        _id: '62b9a57e152660e300cdf988',
                        categories: [2142],
                        modified_on: '2022-06-27 12:41:34.134000',
                        name: 'Burger',
                        slug: 'burger',
                        created_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        }
                    },
                    {
                        modified_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        },
                        created_on: '2022-06-29 12:59:50.833000',
                        _id: '62bc4cc6361322019bc47402',
                        categories: [2762, 2761, 2759],
                        modified_on: '2022-06-29 12:59:50.833000',
                        name: 'Dummy',
                        slug: 'dummy',
                        created_by: {
                            username: 'rohanshah_gofynd_com_11583',
                            user_id: 'c0cb6fa7449eaae3c80d83aa'
                        }
                    }
                ]
            },
            localVue,
            router,
            store
        });
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it('should check for product info mapping', () => {
        expect(wrapper.find('#image-path').attributes().src).toBe(
            item.product.media[0].url
        );
        expect(wrapper.find('#product-name').element.textContent.trim()).toBe(
            item.product.name
        );
        expect(wrapper.find('#item-code').element.textContent).toBe(
            item.product.item_code.toString()
        );
        expect(
            wrapper.find('#product-dimension').element.textContent.trim()
        ).toBe('1x1x2 inch');
        expect(wrapper.find('#pack-info').element.textContent.trim()).toBe(
            'pack of 90'
        );
    });
    it('should test for button click simulation', async () => {
        let btn = wrapper.find('.packaging-card-button');
        await btn.trigger('click');
    });
    it('shpuld test for getPackInfo wrong case', () => {
        const resp = wrapper.vm.getPackInfo({ name: 'test' });
        expect(resp).toBe('NA');
    });
    it('should check for l3 mapping', () => {
        expect(wrapper.find('#item-l3-value').element.textContent).toBe('footwere,Mens Clothing');
        item.l3_mapping = ["1"]
    });
    it("should check for '-' mapping for l3 data",()=>{
        expect(wrapper.find('#item-l3-value').element.textContent).toBe('-');
    })
});
