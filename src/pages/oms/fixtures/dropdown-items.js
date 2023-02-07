export const fulfillmentCentres = [
    {
        text: 'Andheri West',
        value: 'Andheri West'
    },
    {
        text: 'Sion',
        value: 'Sion'
    },
    {
        text: 'Ghaziabad',
        value: 'Ghaziabad'
    }
];

export const statuses = [
    {
        text: 'All',
        value: 'all'
    },
    {
        text: 'Completed',
        value: 'COMPLETED'
    },
    {
        text: 'Partially Completed',
        value: 'PARTIALLY COMPLETED'
    },
    {
        text: 'Failed',
        value: 'FAILED'
    },
    {
        text: 'Processing',
        value: 'PROCESSING'
    }
];

export const fileTypes = [
    {
        text: 'CSV',
        value: 'csv'
    },
    {
        text: 'XLSX',
        value: 'xlsx'
    }
];

export const returnNextStates = [
    {
        text: 'Initiate RTO',
        value: 'initiate_rto'
    },
    {
        text: 'Initiate Return',
        value: 'initiate_return'
    }
];

export const adminActionDropdownItems = [
    {
        id: 1,
        text: 'Create Invoice (S3)',
        value: 'create_invoice_s3',
        icon: 'oms-create-invoice',
        forceDisplay: false
    },
    {
        id: 2,
        text: 'Call',
        value: 'call',
        icon: 'oms-call',
        forceDisplay: false
    },
    {
        id: 3,
        text: 'SMS',
        value: 'sms',
        icon: 'oms-sms',
        forceDisplay: false
    },
    {
        id: 4,
        text: 'Debug Logistics',
        value: 'debug_logistics',
        icon: 'oms-debug-logistics',
        forceDisplay: false
    },
    // {
    //     id: 5,
    //     text: 'Debug Shipment',
    //     value: 'debug_shipment',
    //     icon: 'debug-shipment',
    //     forceDisplay: false
    // },
    {
        id: 6,
        text: 'Change Bag State',
        value: 'change_bag_state',
        icon: 'oms-change-bag-state',
        forceDisplay: false
    },
    // {
    //     id: 7,
    //     text: 'Bank Details',
    //     value: 'bank_details',
    //     icon: 'bank',
    //     forceDisplay: false
    // },
    {
        id: 8,
        text: 'Reassign Store',
        value: 'reassign_store',
        icon: 'oms-reassign-store',
        forceDisplay: false
    },
    // {
    //     id: 9,
    //     text: 'Initiate NDR',
    //     value: 'initiate_ndr',
    //     icon: 'ndr',
    //     forceDisplay: false
    // },
    {
        id: 10,
        text: 'Change Address',
        value: 'change_address',
        icon: 'oms-change-address',
        forceDisplay: false
    }
];
