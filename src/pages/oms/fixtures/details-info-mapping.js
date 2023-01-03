export const DETAILS_INFO_MAPPING = [
    {
        header: 'Shipping Details',
        data: [
            { key: 'delivery_details.name', display_name: 'Name' },
            {
                key: 'delivery_details.phone',
                display_name: 'Contact Phone',
            },
            {
                key: 'delivery_details.address1',
                display_name: 'Address',
            },
            {
                key: 'delivery_details.pincode',
                display_name: 'Pincode',
            },
            { key: 'delivery_details.city', display_name: 'City' },
            {
                key: 'delivery_details.state',
                display_name: 'State',
            },
            {
                key: 'delivery_details.country',
                display_name: 'Country',
            },
            {
                key: 'delivery_details.email',
                display_name: 'Email',
            },
        ],
    },
    {
        header: 'Billing Details',
        data: [
            { key: 'billing_details.name', display_name: 'Name' },
            {
                key: 'billing_details.phone',
                display_name: 'Contact Phone',
            },
            {
                key: 'billing_details.address1',
                display_name: 'Address',
            },
            { key: 'billing_details.email', display_name: 'Email' },
        ],
    },
    {
        header: 'User Details',
        data: [
            {
                key: ['user.first_name', 'user.last_name'],
                display_name: 'Name',
            },
            { key: 'user.mobile', display_name: 'Contact Phone' },
            { key: 'user.email', display_name: 'Email' },
        ],
    },
    {
        header: 'Ordering Store Details',
        data: [
            {
                key: 'ordering_store.code',
                display_name: ' Store Code',
            },
            { key: 'ordering_store.id', display_name: ' Store ID' },
            {
                key: 'ordering_store.name',
                display_name: 'Store Name',
            },
            {
                key: 'ordering_store.fulfillment_channel',
                display_name: 'Store Tag',
            },
            {
                key: 'ordering_store.contact_person',
                display_name: 'Contact Name',
            },
            {
                key: 'ordering_store.phone',
                display_name: 'Contact Phone',
            },
            {
                key: 'ordering_store.address1',
                display_name: 'Address',
            },
            {
                key: 'ordering_store.state',
                display_name: 'State',
            },
            {
                key: 'ordering_store.country',
                display_name: 'Country',
            },
        ],
    },
    {
        header: 'Device Details',
        data: [
            //may have to change key name for all
            { key: 'device_details.os', display_name: 'OS' },
            {
                key: 'device_details.application',
                display_name: 'Application',
            },
        ],
    },
]