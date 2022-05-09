export const ORDER_RULES_ENUM = [{
    display: 'Full Access',
    value: 'full_access'
},
{
    display: 'Store Manager',
    value: 'store_manager'
},
{
    display: 'Customer Care',
    value: 'customer_care'
},
{
    display: 'Read Only',
    value: 'read_only'
}
]

export const RETURN_ORDER_STATUS = ["rto_in_transit", "rto_bag_delivered", "rto_bag_accepted",
    "return_processing", "return_product_picked", "return_rejected", "return_dp_assigned",
    "return_bag_in_transit", "return_accepted", "refund_initiated", "refund_done",
    "return_bag_delivered", "refund_approved", "refund_completed",
    "return_not_accepted", "return_bag_not_delivered", "return_bag_picked",
    "return_initiated"
]

export const CANCELLATION_REASONS = {
    'store_manager': [{
        value: 82,
        text: "Defective Product"
    },
    {
        value: 83,
        text: "Product Not Available"
    },
    {
        value: 85,
        text: "Store didn't ship the shipment"
    }, //Delivery address is wrong
    {
        value: 86,
        text: "Price Mismatch"
    }, //Found better price elsewhere
    {
        value: 84,
        text: "Others"
    }, //Changed my mind
    ],
    'customer_care': [{
        value: 56,
        text: "Incorrect Delivery Address"
    },
    {
        value: 57,
        text: "Store Closed"
    },
    {
        value: 58,
        text: "Does not want to wait for Webstore Delivery"
    },
    {
        value: 59,
        text: "Change of mind"
    },
    ],
    'full_access': [{
        value: 82,
        text: "Defective Product"
    },
    {
        value: 83,
        text: "Product Not Available"
    },
    {
        value: 85,
        text: "Store didn't ship the shipment"
    }, //Delivery address is wrong
    {
        value: 86,
        text: "Price Mismatch"
    }, //Found better price elsewhere
    {
        value: 56,
        text: "Incorrect Delivery Address"
    },
    {
        value: 57,
        text: "Store Closed"
    },
    {
        value: 58,
        text: "Does not want to wait for Webstore Delivery"
    },
    {
        value: 59,
        text: "Change of mind"
    },
    {
        value: 84,
        text: "Others"
    }, //Changed my mind
    ],
    'read_only': []
}

export const RETURN_ACCEPTED_REASONS = [{
    text: "Free Gift Missing",
    value: 129
},
{
    text: "Empty Box Received",
    value: 130
},
{
    text: "Short Received",
    value: 131
},
{
    text: "Lost",
    value: 132
},
{
    text: "Customer Abuse",
    value: 133
},
{
    text: "Wrong Product Received",
    value: 134
},
{
    text: "Fully Damaged",
    value: 136
},
{
    text: "Seal Opened",
    value: 137
},
{
    text: "Refinish-For Pressing",
    value: 138
},
{
    text: "Refinish-Damaged",
    value: 139
},
{
    text: "Refinish-Package Damaged",
    value: 140
},
{
    text: "Refinish-Tag Missing",
    value: 141
},
{
    text: "Package Damaged",
    value: 142
},
{
    text: "Tag Missing",
    value: 143
},
{
    text: "Component Missing",
    value: 144
},
];