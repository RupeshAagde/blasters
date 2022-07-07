'use strict';
import PackagingCreate from '@/components/packaging/packaging-create.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import {
    GET_PACKAGING_PRODUCTS,
    GET_EDIT_PRODUCT
} from '../../../../store/getters.type';
import {
    FETCH_GROUP_CATEGORIES,
    FETCH_L3_CATEGORIES
} from '../../../../store/action.type';
import mocks from './fixtures/mocks';
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
                },
                async [GET_EDIT_PRODUCT]() {
                    return {};
                }
            },
            actions: {
                async [FETCH_L3_CATEGORIES](data) {
                    return mocks.l3Categories;
                },
                async [FETCH_GROUP_CATEGORIES](data) {
                    return mocks.groupCategories;
                }
            }
        },
        dispatch: jest.fn()
    }
});
const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
describe('Packaging Create', () => {
    beforeEach(async () => {
        wrapper = mount(PackagingCreate, {
            localVue,
            store,
            propsData: {
                toggleBtn: jest.fn()
            }
        });
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
            wrapper.find('#packaging-create-container-header').element
                .textContent
        ).toBe('Extra Details');
    });
    it('should test the input field', () => {
        const input = wrapper.find('.n-input');
        input.element.value = 'test value';
        input.trigger('input');
        expect(wrapper.vm.searchInput).toBe('test value');
        expect(wrapper.vm.searchTooltipText).toBe(
            'Choose an item you wish to use as a packaging material, and fill its details'
        );
    });
    it('should check for checkGroupCategoryError', async () => {
        const resp = await wrapper.vm.checkGroupCategoryError();
        expect(resp).toBe(false);
    });
    it('should check for checkGroupCategoryError to be true', async () => {
        wrapper.vm.bulkPackaging = [
            {
                toggle: {
                    val: false,
                    disabled: false
                },
                categoryConfig: '1',
                volumetricWeight: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Volumetric Weight',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Volumetric Weight',
                        value: '',
                        error: ''
                    }
                },
                quantity: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Quantity',
                        value: '1',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Quantity',
                        value: '1',
                        error: ''
                    }
                }
            }
        ];
        const resp = await wrapper.vm.checkGroupCategoryError();
        expect(resp).toBe(true);
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
            'n-button ripple n-button-secondary add-group-btn opaque-custom'
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
        expect(wrapper.vm.bulkPackaging.length).toBe(1);
    });
    it('should check for checkGroupCategoryError', async () => {
        const resp = await wrapper.vm.checkGroupCategoryError();
        expect(resp).toBe(false);
    });
    it('should test the savePackagingOrder', () => {
        wrapper.vm.bulkPackaging = [
            {
                toggle: {
                    val: false,
                    disabled: false
                },
                categoryConfig: '1',
                volumetricWeight: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Volumetric Weight',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Volumetric Weight',
                        value: '',
                        error: ''
                    }
                },
                quantity: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Quantity',
                        value: '1',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Quantity',
                        value: '1',
                        error: ''
                    }
                }
            }
        ];
        const resp = wrapper.vm.savePackagingOrder();
        expect(resp).toStrictEqual({
            _id: undefined,
            data: {
                dead_weight_in_kg: '',
                default_package: {
                    l3_categories: [],
                    quantity: { max: 1, min: 1 }
                },
                dimensions: { height: '', length: '', width: '' },
                error_rate: '',
                is_bulk: false,
                is_l3_specific: false,
                item_id: '',
                l3_mapping: [],
                maximum_order: '',
                weight: ''
            },
            isEdit: false
        });
    });
    it('should test for input field simulation and data being set in state', async () => {
        const input = wrapper.find('.n-input');
        input.element.value = '5 Ply Corrugated';
        await input.trigger('input');
        expect(wrapper.vm.searchInput).toBe('5 Ply Corrugated');
        expect(wrapper.vm.searchTooltipText).toBe(
            'Choose an item you wish to use as a packaging material, and fill its details'
        );
        sleep(1500).then(() => {
            expect(wrapper.vm.showSearchList).toBe(true);
            console.log(wrapper.vm.searchedProductList);
            expect(wrapper.vm.searchedProductList.length).toBe(1);
        });
    });
    it('should check for mapping of searchable list', () => {
        wrapper.vm.searchedProductList = [
            {
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
            }
        ];
        wrapper.vm.showSearchList = true;
        expect(wrapper.vm.showSearchList).toBe(true);
        expect(wrapper.vm.searchedProductList.length).toBe(2);
    });
    it('should test for no error message', async () => {
        wrapper.vm.bulkPackaging = [
            {
                toggle: {
                    val: false,
                    disabled: false
                },
                categoryConfig: '1',
                volumetricWeight: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Volumetric Weight',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Volumetric Weight',
                        value: '',
                        error: ''
                    }
                },
                quantity: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Quantity',
                        value: '1',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Quantity',
                        value: '1',
                        error: ''
                    }
                }
            }
        ];
        const resp = await wrapper.vm.checkGroupCategoryError();
        expect(resp).toBe(true);
    });
    it('should test for setCategoryList', () => {
        wrapper.vm.setCategoryList({ text: 'some text' });
    });
    it('should test for handlePackagingProductClicked', async () => {
        await wrapper.vm.handlePackagingProductClicked({
            uid: '123',
            name: 'product'
        });
        expect(wrapper.vm.selectedPackage).toBe('123');
        expect(wrapper.vm.packagingSelected).toBe(true);
        expect(wrapper.vm.showSearchList).toBe(false);
        expect(wrapper.vm.searchInput).toBe('product');
        expect(wrapper.vm.searchedProductList).toStrictEqual([]);
    });
    it('should test handleBulkChange', () => {
        wrapper.vm.bulkPackaging = [
            {
                toggle: {
                    val: false,
                    disabled: false
                },
                categoryConfig: '1',
                volumetricWeight: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Volumetric Weight',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Volumetric Weight',
                        value: '',
                        error: ''
                    }
                },
                quantity: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Quantity',
                        value: '1',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Quantity',
                        value: '1',
                        error: ''
                    }
                }
            }
        ];
        wrapper.vm.handleBulkChange('volumetricWeight', 'minimum', 12, 0);
        expect(wrapper.vm.bulkPackaging[0].volumetricWeight.minimum.value).toBe(
            12
        );
        expect(wrapper.vm.bulkPackaging[0].volumetricWeight.minimum.error).toBe(
            ''
        );
    });
    it('should test for handleBulkBlur', () => {
        wrapper.vm.bulkPackaging = [
            {
                toggle: {
                    val: false,
                    disabled: false
                },
                categoryConfig: '1',
                volumetricWeight: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Volumetric Weight',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Volumetric Weight',
                        value: '',
                        error: ''
                    }
                },
                quantity: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Quantity',
                        value: '1',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Quantity',
                        value: '1',
                        error: ''
                    }
                }
            }
        ];
        wrapper.vm.handleBulkBlur('volumetricWeight', 'minimum', 0);
        expect(wrapper.vm.bulkPackaging[0].volumetricWeight.minimum.value).toBe(
            ''
        );
        expect(wrapper.vm.bulkPackaging[0].volumetricWeight.minimum.error).toBe(
            'Minimum should have some value'
        );
    });
    it('should call the handleBulkToggle', () => {
        wrapper.vm.bulkPackaging = [
            {
                toggle: {
                    val: false,
                    disabled: false
                },
                categoryConfig: '1',
                volumetricWeight: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Volumetric Weight',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Volumetric Weight',
                        value: '',
                        error: ''
                    }
                },
                quantity: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Quantity',
                        value: '1',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Quantity',
                        value: '1',
                        error: ''
                    }
                }
            },
            {
                toggle: {
                    val: false,
                    disabled: false
                },
                categoryConfig: '1',
                volumetricWeight: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Volumetric Weight',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Volumetric Weight',
                        value: '',
                        error: ''
                    }
                },
                quantity: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Quantity',
                        value: '1',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Quantity',
                        value: '1',
                        error: ''
                    }
                }
            }
        ];
        wrapper.vm.handleBulkToggle(0, true);
        expect(wrapper.vm.bulkPackaging[0].toggle.val).toBe(false);
        expect(wrapper.vm.bulkPackaging[0].toggle.disabled).toBe(false);
        wrapper.vm.handleBulkToggle(0, false);
        expect(wrapper.vm.bulkPackaging[0].toggle.val).toBe(true);
        expect(wrapper.vm.bulkPackaging[0].toggle.disabled).toBe(false);
    });
    it('should check for handleBulkDropdown', () => {
        wrapper.vm.bulkPackaging = [
            {
                toggle: {
                    val: false,
                    disabled: false
                },
                categoryConfig: '1',
                volumetricWeight: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Volumetric Weight',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Volumetric Weight',
                        value: '',
                        error: ''
                    }
                },
                quantity: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Quantity',
                        value: '1',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Quantity',
                        value: '1',
                        error: ''
                    }
                }
            }
        ];
        wrapper.vm.handleBulkDropdown(0, 1);
        expect(wrapper.vm.bulkPackaging[0].categoryConfig).toBe(1);
    });
    it("should test for handleCategoryChange",()=>{
        wrapper.vm.searchableCategoryList=[{
            value:1,
            name:"category1"
        },
        {
            value:2,
            name:"category2"
        }]
        wrapper.vm.handleCategoryChange([1,2])
        expect(wrapper.vm.selectedCategories).toStrictEqual([{
            value:1,
            name:"category1"
        },
        {
            value:2,
            name:"category2"
        }])
        expect(wrapper.vm.categoryValue).toStrictEqual([1,2])
        wrapper.vm.handleCategoryChange([])
        expect(wrapper.vm.selectedCategories).toStrictEqual([{value:1,name:'category1'}])
        expect(wrapper.vm.categoryValue).toStrictEqual([1])
        // expect(wrapper.vm.checkForButtonToggle).toHaveBeenCalled()
    })
    it("should test for handleCategoryRemove",()=>{
        wrapper.vm.selectedCategories = [{value:1,name:'cat1'}]
        wrapper.vm.categoryValue = [1]
        wrapper.vm.handleCategoryRemove({value:1,name:'cat1'},0)
        expect(wrapper.vm.selectedCategories).toStrictEqual([])
        expect(wrapper.vm.categoryValue).toStrictEqual([])
    })
    it("should test for handleSearchInput",()=>{
        wrapper.vm.handleSearchInput("test")
        sleep(1000).then(()=>{
            expect(wrapper.vm.showListLoader).toBe(false)
            expect(wrapper.vm.showSearchList).toBe(true)
        })
        wrapper.vm.handleSearchInput("")
        sleep(1000).then(()=>{
            expect(wrapper.vm.showListLoader).toBe(false)
            expect(wrapper.vm.showSearchList).toBe(false)
            expect(wrapper.vm.packagingSelected).toBe(false)
            expect(wrapper.vm.searchedProductList).toStrictEqual([])
        })
    })
});
