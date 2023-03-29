module.exports.getPaymentGatewayDetails = {
    "success": true,
    "message": "",
    "items": [
        {
            "name": "Simpl",
            "id": 1,
            "is_active": true,
            "logos": {
                "large": "https://hdn-1.fynd.com/payment/simpl-pg-logo.jpg",
                "small": "https://hdn-1.fynd.com/payment/simpl-pg-logo.jpg"
            },
            "payment_mode": [
                {
                    "name": "Pay Later",
                    "logos": {
                        "large": "https://hdn-1.fynd.com/payment/netbanking.png",
                        "small": "https://hdn-1.fynd.com/payment/netbanking.png"
                    },
                    "id": 1,
                    "is_active": true,
                    "sub_payment_mode": [
                        {
                            "code": "simpl",
                            "logo": "https://hdn-1.fynd.com/payment/simpl_logo.png",
                            "name": "Simpl",
                            "priority": 12,
                            "is_active": true
                        }
                    ]
                },
                {
                    "name": "QR",
                    "logos": {
                        "large": "https://hdn-1.fynd.com/payment/bharatqr-icon.png",
                        "small": "https://hdn-1.fynd.com/payment/bharatqr-icon.png"
                    },
                    "id": 10,
                    "is_active": true,
                    "sub_payment_mode": []
                }
            ]
        }
    ]
}

module.exports.getDeviceBusinessUnitList = {
    "success": true,
    "message": "",
    "items": {
        "business_unit": [
            {
                "name": "POS",
                "slug": "pos"
            },
            {
                "name": "Storefront",
                "slug": "storefront"
            },
            {
                "name": "Payment Link",
                "slug": "payment-link"
            }
        ],
        "device": [
            {
                "name": "Website",
                "slug": "desktop"
            },
            {
                "name": "IOS",
                "slug": "ios"
            },
            {
                "name": "Android",
                "slug": "android"
            }
        ]
    }
}
