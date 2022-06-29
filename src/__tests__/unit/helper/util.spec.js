import {
    generateProductRequest,
    generateGroupCategoryRequest
} from '../../../helper/utils';
let product = {
    bulkChecked: false,
    l3Checked: false,
    errorRate: 0,
    itemId: 1,
    deadWeight: 12,
    length: 12,
    width: 12,
    height: 12,
    orderThreshold: 10,
    weight: 30,
    l3Categories: [1],
    bulkPackaging: [
        {
            is_default_packaging_material: false,
            group_category: '62a8d4e2a3b4ddc50021dda5',
            quantity: {
                max: 6.0,
                min: 2.0
            },
            volumetric_weight: {
                max: 1.45419064,
                min: 0.36354766
            }
        }
    ]
};
describe('Test suite for packaging related utils', () => {
    it('should test for generateProductRequest with l3Checked and bulkChecked false', () => {
        const resp = generateProductRequest(product);
        let expected = {
            dead_weight_in_kg: 12,
            default_package: {
                l3_categories: [],
                quantity: { max: 1, min: 1 }
            },
            dimensions: { height: 12, length: 12, width: 12 },
            error_rate: 0,
            is_bulk: false,
            is_l3_specific: false,
            item_id: 1,
            l3_mapping: [],
            maximum_order: 10,
            weight: 30
        };
        expect(resp).toStrictEqual(expected);
    });
    it('should test for generateProductRequest with l3Checked and bulkChecked true', () => {
        product.bulkChecked = true;
        product.l3Checked = true;
        const resp = generateProductRequest(product);
        let expected = {
            dead_weight_in_kg: 12,
            default_package: {
                l3_categories: [1],
                quantity: { max: 1, min: 1 }
            },
            dimensions: { height: 12, length: 12, width: 12 },
            error_rate: 0,
            is_bulk: true,
            is_l3_specific: true,
            item_id: 1,
            l3_mapping: [
                {
                    group_category: '62a8d4e2a3b4ddc50021dda5',
                    is_default_packaging_material: false,
                    quantity: { max: 6, min: 2 },
                    volumetric_weight: { max: 1.45419064, min: 0.36354766 }
                }
            ],
            maximum_order: 10,
            weight: 30
        };
        expect(resp).toStrictEqual(expected);
    });
    it('should test for generateGroupCategoryRequest function', () => {
        const resp = generateGroupCategoryRequest({
            categoryName: 'Footwear',
            categories: [1]
        });
        expect(resp).toStrictEqual({ categories: [1], name: 'Footwear' });
    });
});
