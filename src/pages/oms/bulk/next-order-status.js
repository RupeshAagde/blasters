export const NEXT_ORDER_STATUS = {
    pending: [{
        text: 'Placed',
        value: 'placed'
    }],
    placed: [{
            text: 'Bag Confirmed',
            value: 'bag_confirmed'
        },
        // {
        //     text: 'Bag Not Confirmed',
        //     value: 'bag_not_confirmed'
        // }
    ],
    bag_confirmed: [{
        text: 'Bag Invoiced',
        value: 'bag_invoiced'
    }],
    dp_assigned: [{
        text: 'Bag Packed',
        value: 'bag_packed'
    }],
    bag_packed: [{
        text: 'Handed Over to DG',
        value: 'handed_over_to_dg'
    }],
    bag_invoiced: [],
    store_reassigned: [],
    bag_not_confirmed: [],
    handed_over_to_dp: [],
    bag_picked: [],
    out_for_delivery: [],

    delivery_done: [{
        text: 'Return Initiated',
        value: 'return_initiated'
    }],
    refund_initiated: [],
    return_bag_delivered: [{
            text: 'Return Bag Accepted',
            value: 'return_bag_accepted'
        },
        {
            text: 'Return Accepted',
            value: 'return_accepted'
        },
        {
            text: 'Deadstock',
            value: 'deadstock'
        }
    ],
    return_bag_accepted: [],
    deadstock: [],
    return_dp_assigned: [],
    return_bag_out_for_pickup: [],
    return_bag_in_transit: [],
    return_bag_out_for_delivery: [],
    return_accepted: [],
    refund_approved: []
};

export const ALL_ORDER_STATUS = [{
        text: 'Bag Confirmed',
        value: 'bag_confirmed'
    },
    // {
    //     text: 'Bag Not Confirmed',
    //     value: 'bag_not_confirmed'
    // },
    {
        text: 'Bag Invoiced',
        value: 'bag_invoiced'
    },
    {
        text: 'Bag Packed',
        value: 'bag_packed'
    },
    {
        text: 'Handed Over to DP',
        value: 'handed_over_to_dp'
    },
    {
        text: 'Refund Initiated',
        value: 'refund_initiated'
    },
    {
        text: 'Return Bag Accepted',
        value: 'return_bag_accepted'
    },
    {
        text: 'Return Accepted',
        value: 'return_accepted'
    },
    {
        text: 'Deadstock',
        value: 'deadstock'
    }
];


export const ORDER_STATE_MAPPING = {
    all: [{
            text: 'All',
            value: 'all'
        },
        {
            text: 'Placed',
            value: 'placed',
            actions: [{
                text: 'Bag Confirmed',
                value: 'bag_confirmed'
            }]
        },
        {
            text: 'Bag Confirmed',
            value: 'bag_confirmed',
            actions: [{
                text: 'Bag Invoiced',
                value: 'bag_invoiced'
            }]
        },
        {
            text: 'Bag Invoiced',
            value: 'bag_invoiced'
        },
        {
            text: 'DP Assigned',
            value: 'dp_assigned',
            actions: [{
                text: 'Bag Packed',
                value: 'bag_packed'
            }]
        },
        {
            text: 'Bag Packed',
            value: 'bag_packed',
            actions: [{
                text: 'Hand over to DG',
                value: 'handed_over_to_dg'
            }]
        },
        {
            text: 'Hand over to DG',
            value: 'handed_over_to_dg'
        },
        {
            text: 'Payment Failed',
            value: 'payment_failed'
        }
    ],
    new: [{
        text: 'All',
        value: 'all',
        actions: [{
            text: 'Bag Confirmed',
            value: 'bag_confirmed'
        }]
    }, {
        text: 'Placed',
        value: 'placed',
        actions: [{
            text: 'Bag Confirmed',
            value: 'bag_confirmed'
        }]
    }],
    processing: [{
            text: 'All',
            value: 'all'
        },
        {
            text: 'Bag Confirmed',
            value: 'bag_confirmed',
            actions: [{
                text: 'Bag Invoiced',
                value: 'bag_invoiced'
            }]
        },
        {
            text: 'Bag Invoiced',
            value: 'bag_invoiced'
        },
        {
            text: 'DP Assigned',
            value: 'dp_assigned',
            actions: [{
                text: 'Bag Packed',
                value: 'bag_packed'
            }]
        },
        {
            text: 'Bag Packed',
            value: 'bag_packed',
            actions: [{
                text: 'Hand over to DG',
                value: 'handed_over_to_dg'
            }]
        }
    ],
    processed: [{
            text: 'All',
            value: 'all'
        },
        {
            text: 'Hand over to DP',
            value: 'handed_over_to_dp'
        },
        {
            text: 'Hand over to DG',
            value: 'handed_over_to_dg'
        },
        {
            text: 'Payment Failed',
            value: 'payment_failed'
        },
        {
            text: 'Bag Picked',
            value: 'bag_picked'
        },
        {
            text: 'Out for Delivery',
            value: 'out_for_delivery'
        },
        {
            text: 'Delivery Done',
            value: 'delivery_done',
            actions: [{
                text: 'Return Initiated',
                value: 'return_initiated'
            }]
        }
    ],
    returns: [{
        text: 'All',
        value: 'all'
    }],
}
