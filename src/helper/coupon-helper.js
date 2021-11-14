export const TYPE_DATA = {
    percentage_quantity_percentage: {
        title: 'X Percentage Value',
        example: 'FLAT50  |  Flat 50% OFF',
        subtitle:
            'Get a fixed percentage discount on the effective selling price',
        description: `      
        Here,
        <b>Percentage Value (D)</b> is the fixed percentage discount
        <b>Maximum Discount Amount (MD)</b> (optional) is a maximum limit to the discount
        <b>Minimum Cart Value (MCV)</b> (optional) is the minimum price of the cart items

        E.g. 
        A 30% discount on a shirt worth Rs. 1000
        
        Formula:
        Coupon Discount = Min(MD, (CV*D/100))
        
        Where
        CV = Cart value
        D = Percent Discount
        MD = Maximum discount limit
        
        Here
        CV = 1000
        D = 30%
        MD = 400
        
        Therefore  
        Min(400, (1000* 30/ 1000)) = 300
        
        Cart value				1000
        Coupon Discount			-300
        ===========================
        TOTAL					700
        `,
        value_title: 'Percentage Value',
        postfix_value: 'OFF',
        type: 'percentage',
        applicable_on: 'quantity',
        value_type: 'percentage',
        auto_apply: false,
        key: 1
    },
    absolute_quantity_absolute: {
        title: 'X Amount Value',
        example: 'FLAT500  |  Flat Rs. 500 OFF on Rs. 2000',
        subtitle: 'Get a flat discount on the effective selling price',
        description: `
        Here,
        <b>Amount Value(D)</b> is the flat discount
        <b>Minimum Cart Value(MCV)</b> (optional) is the minimum price of the cart items

        E.g. 
        Flat Rs. 500 discount on jeans worth Rs. 3000, will make the Order Value Rs. 2500

        Formula: 
        Coupon Discount = D

        Where
        D = Flat Discount

        Here,
        Cart value = 3000
        D = 500

        Cart value				3000
        Coupon Discount			-500
        ===========================
        TOTAL					2500
        `,
        value_title: 'Amount Value',
        postfix_value: 'OFF',
        type: 'absolute',
        applicable_on: 'quantity',
        value_type: 'absolute',
        auto_apply: false,
        key: 1
    },
    bundle_quantity_percentage: {
        title: 'Bundle Percentage Discount',
        example:
            'BUYNOW123  |  Buy 1 Get 20% OFF, Buy 2 Get 30% OFF, Buy 3 Get 40% OFF',
        subtitle: 'Get a flexible percentage discount on a bundle of products',
        description: `
        Here,
        <b>Buy items(BI)</b> is the minimum number of items eligible for a discount
        <b>Percentage Value(D)</b> is the fixed percentage discount
        <b>Maximum Discount Amount(MD)</b> (optional) is a limit to the discount
        <b>Minimum Cart Value(MCV)</b> (optional) is the minimum price of the cart items
        <b>Apply coupon on exact quantities</b> (optional) if checked, will apply the coupon only to the specified <b>Buy items</b>
        and if unchecked, will apply the coupon to more than the specified <b>Buy items</b>

        E.g. 
        Buy 1 get 10% off, 
        Buy 2 get 15% off, 
        Buy 3 get 20% off. 
        Let’s say you wish to purchase 2 items worth total Rs. 2500

        Formula: 
        Coupon Discount = Min(MD, (CV*D/100))

        Where
        CV = Cart value of n items
        D = Percent Discount for n items
        MD ­= Maximum discount limit specified for n items
        
        On adding 2 items,
        n = 2
        CV = 2500
        D = 15%
        MD = 400

        Therefore 
        Min(400, (2500*15/100)) = 375

        Cart value				2500
        Coupon Discount			-375
        ===========================
        TOTAL					2125
        `,
        key_title: 'Buy Items',
        value_title: 'Percentage Value',
        postfix_value: '% OFF',
        type: 'bundle',
        applicable_on: 'quantity',
        value_type: 'percentage',
        auto_apply: false,
        key: 1
    },
    bundle_quantity_absolute: {
        title: 'Bundle Amount Discount',
        example:
            'BUY123  |  Buy 1 Get Rs. 500 OFF, Buy 2 Get Rs. 1,000 OFF, Buy 3 Get Rs. 1,500 OFF',
        subtitle: 'Get a flexible and flat discount on a bundle of products',
        description: `
        Here,
        <b>Buy items</b> is the minimum number of items eligible for a discount
        <b>Amount Value(Dn)</b> is the flat discount
        <b>Minimum Cart Value(MCV)</b> (optional) is the minimum price of the cart items
        <b>Apply coupon on exact quantities</b> (optional) if checked, will apply the coupon only to the specified <b>Buy items</b>
        and if unchecked, will apply the coupon to more than the specified <b>Buy items</b>

        E.g. 
        Buy 1 get Rs. 250 off, 
        Buy 2 get Rs. 600 off, 
        Buy 3 get Rs. 1000 off
        Let’s say you wish to purchase 3 items worth total Rs. 4000

        Formula: 
        Coupon Discount = D

        Where
        D = Discount for n items
        
        On adding 3 items,
        Cart value = 4000
        D = 1000

        Cart value			   4000
        Coupon Discount		  -1000
        ===========================
        TOTAL                  3000
        `,
        key_title: 'Buy Items',
        value_title: 'Amount Value',
        postfix_value: 'OFF',
        type: 'bundle',
        applicable_on: 'quantity',
        value_type: 'absolute',
        auto_apply: false,
        key: 1
    },
    bundle_amount_percentage: {
        title: 'Bundle Amount Percentage Discount',
        example:
            'BUY3000  |  Get 10% OFF On Purchase of Rs. 3000, Get 20% On Purchase of Rs. 8,000, Get 25% OFF On Purchase of Rs. 10,000',
        subtitle:
            'Get a flexible percentage discount subjected to a maximum limit, on a bundle of products',
        description: `
        Here,
        <b>Buy Items</b> <b>Amount</b> is the minimum cart value that is eligible for a discount
        <b>Percentage Value(D)</b> is the fixed percentage discount
        <b>Maximum Discount Amount(MD)</b> (optional) is a limit to the discount

        E.g. 
        Buy items worth Rs.1000 or more get 10% off up to Rs. 100,
        Buy items worth Rs.2000 or more and get 15% off up to Rs. 250, 
        Buy items worth Rs.3000 or more and get 20% off up to Rs. 450
        Let’s say you wish to purchase items worth total Rs. 2500


        Formula: 
        Coupon Discount = Min(MD, (CV*D/100))

        Where
        CV = Cart value of the bundle
        D = Discount for bundle items
        MD ­= Maximum discount limit specified for bundle items
        
        On adding items worth Rs. 2500 
        CV = 2500
        D = 15%
        MD = 250

        Therefore 
        Min(250, (2500*15/100)) = 250

        Cart value             2500
        Coupon Discount        -250
        ===========================
        TOTAL                  2250
        `,
        key_title: 'Buy Items Amount',
        value_title: 'Percentage Value',
        postfix_value: 'OFF',
        type: 'bundle',
        applicable_on: 'amount',
        value_type: 'percentage',
        auto_apply: false,
        key: 0
    },
    bogo_quantity_absolute: {
        title: 'Buy X Items Get Y Items Free',
        example: 'BOGO  |  Buy 1 Get 1 Free, Buy 2 Get 2 Free',
        subtitle:
            'Get additional items (Y) for free when you add a specific number of items (X).',
        description: `
        Here,
        <b>Buy items(X)</b> is the minimum number of items eligible for getting more items for free
        <b>Get Free Items(Y)</b> is the number of items you will get for free
        <b>Minimum Cart Value(MCV)</b> (optional) is the minimum price of the cart items

        E.g. 
        Buy 2 items, get 2 items free. 
        Let’s say Item 1 costs Rs. 2000, 
        Item 2 costs Rs. 1500 and Item 3 costs Rs. 3000 
        and Item 4 costs Rs. 1000

        Formula:
        Coupon Discount = Ymin(X+Y)

        Where
        CV = Cart value of X+Y items
        X = mandatory number of items
        Y = number of items for free
        Ymin(X+Y) = Sum(Y Minimum price in X+Y items)

        Here
        CV = (2000+1500+3000+1000) = 7500
        X = 2
        Y = 2

        Therefore
        Ymin(X+Y) = Sum(2 Minimum price in 4 items) 
                = Sum(1500, 1000)
                = 2500 

        Cart value             7500
        Coupon Discount       -2500
        ===========================
        TOTAL                  5000
        `,
        key_title: 'Buy Items',
        value_title: 'Get Free Items',
        postfix_value: '',
        type: 'bogo',
        applicable_on: 'quantity',
        value_type: 'quantity',
        auto_apply: false,
        key: 1,
        value: 0
    },
    bundle_quantity_flat_price: {
        title: 'Buy X Items at Absolute Amount',
        example:
            'Use filters and search on items list and curate specilised collection by handpicking items one at a time.',
        subtitle:
            'Add a specific number of items (X) or more, to get X items at a fixed price',
        description: `
        Here,
        <b>Buy items(BI)</b> is the minimum number of items eligible for a discount
        <b>Absolute Amount(Abs)</b> is the fixed price for the <b>Buy items</b>
        <b>Minimum Cart Value(MCV)</b> (optional) is the minimum price of the cart items

        E.g. 
        Buy 3 items at Rs. 12000. 
        Let’s say Item 1 costs Rs. 5495, 
        Item 2 costs Rs. 5495, 
        Item 3 costs Rs. 9995 and Item 4 costs Rs 4000

        Formula: 
        Coupon Discount = Abs - BImin(all)

        Where
        Abs = Fixed amount
        BI = Minimum cart items
        BImin(all) = Sum(BI Minimum price in cart)
        
        Here
        CV = 5495+5495+9995+4000 = 24985
        Abs = 12000  
        BI = 3
        BImin(all) = Sum(3 Minimum price in cart)
                = Sum(5495+5495+4000) 
                = 14990

        Therefore,                     
        Abs - BImin(all) = 14990 – 12000
                    = 2990 

        Cart Value             24985
        Coupon Discount        -2990
        ============================
        TOTAL                  21995
        `,
        key_title: 'Buy Items',
        value_title: 'Absolute Amount',
        postfix_value: '',
        type: 'bundle',
        applicable_on: 'quantity',
        value_type: 'flat_price',
        auto_apply: false,
        key: 1,
        value: 0
    },
    bulk_bundle_quantity_percentage: {
        title: 'Bulk Bundle Percentage Discount',
        example:
            'BUYNOW123  |  Buy 1 Get 20% OFF, Buy 2 Get 30% OFF, Buy 3 Get 40% OFF. Discount will be automatically applied in cart',
        subtitle:
            'Get a flexible percentage discount on a bundle of products when buying in bulk',
        description: `
            Here,
            <b>Buy items(BI)</b> is the minimum number of items eligible for a discount
            <b>Percentage Value(D)</b> is the fixed percentage discount
            <b>Maximum Discount Amount(MD)</b> (optional) is a limit to the discount
            <b>Minimum Cart Value(MCV)</b> (optional) is the minimum price of the cart items
            <b>Apply coupon on exact quantities</b> (optional) if checked, will apply the coupon only to the specified <b>Buy items</b>
            and if unchecked, will apply the coupon to more than the specified <b>Buy items</b>
            Coupon Discount is applied automatically
    
            E.g. 
            Buy 1 get 10% off, 
            Buy 2 get 15% off, 
            Buy 3 get 20% off. 
            Let’s say you wish to purchase 2 items worth total Rs. 2500
    
            Formula: 
            Coupon Discount = Min(MD, (CV*D/100))
    
            Where
            CV = Cart value of n items
            D = Percent Discount for n items
            MD ­= Maximum discount limit specified for n items
            
            On adding 2 items,
            n = 2
            CV = 2500
            D = 15%
            MD = 400
    
            Therefore 
            Min(400, (2500*15/100)) = 375
    
            Cart value				2500
            Coupon Discount			-375
            ===========================
            TOTAL					2125
            `,
        key_title: 'Buy Items',
        value_title: 'Percentage Value',
        postfix_value: '% OFF',
        type: 'bundle',
        auto_apply: true,
        applicable_on: 'quantity',
        value_type: 'percentage',
        key: 1
    },
    // bulk_bundle_quantity_absolute: {
    //     title: 'Bulk Bundle Amount Discount',
    //     example:
    //         'Example: BUY123  |  Buy 1 Get Rs. 500 OFF, Buy 2 Get Rs. 1,000 OFF, Buy 3 Get Rs. 1,500 OFF. Discount will be automatically applied in cart',
    //     key_title: 'Buy Items',
    //     value_title: 'Amount Value',
    //     postfix_value: 'OFF',
    //     type: 'bundle',
    //     applicable_on: 'quantity',
    //     value_type: 'absolute',
    //     auto_apply: true,
    //     key: 1
    // },
    bundle_discount_quantity_percentage: {
        title: 'Bundle On Quantity Percentage Discount',
        example:
            'BUYNOW123  |  Buy 3 Get 20% OFF on 2 Quantity, Buy 5 Get 30% OFF on 2 Quantity, Buy 7 Get 40% OFF on 3 Quantity',
        subtitle:
            'Get a flexible percentage discount on a partial number of items in a bundle.',
        description: `
        Here,
        <b>Buy items(BI)</b> is the minimum number of items to purchase
        <b>Discount items(DI)</b> is the partial number of items eligible for a discount
        <b>Percentage Value(D)</b> is the fixed percentage discount
        <b>Maximum Discount Amount(MD)</b> (optional) is a limit to the total discount

        E.g. 
        Buy 3 items, get 2 of them at 10% off. 
        Let’s say Item 1 costs Rs. 5495, 
        Item 2 costs Rs. 6495 and Item 3 costs Rs. 9995 and Maximum Discount is Rs. 2000

        Formula: 
        Coupon Discount = Min(MD, (DImin(all)*D/100))

        Where
        DI = Discounted Items
        D = Percentage Discount 
        MD = Maximum discount limit
        DImin(all) = Sum(DI Minimum price in cart)

        Here
        BI = 3
        DI = 2
        D = 10
        CV = 5495+5495+9995 = 21985
        MD = 2000

        Therefore 
        DImin(all) = Sum(2 Minimum price in cart)
                = [5495+6495 OR 9995+5495 OR 6495+9995]
                = [5495+6495 OR 9995+5495 OR 6495+9995]
                = [11900 OR 15490 OR 16490] 
                = 11900

        Min(MD, (DImin(all)*D/100)) = Min(2000, (11900*10/100))  
                                = Min(2000, 1190)      
                                = 1190
                
        Cart Value             21985
        Coupon Discount        -1190
        ============================
        TOTAL                  20795
        `,
        key_title: 'Buy Items',
        value_title: 'Percentage Value',
        postfix_value: 'OFF',
        type: 'bundle',
        applicable_on: 'quantity',
        value_type: 'percentage',
        auto_apply: false,
        key: 1,
        discount_qty: -1
    }
};