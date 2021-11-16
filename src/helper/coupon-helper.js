export const TYPE_DATA = [
     {
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
        key: 0
    },
     {
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
]