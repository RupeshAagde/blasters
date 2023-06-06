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

module.exports.paymentMode = { 
    "name": "Pay Later",
     "logos": { 
        "large": "https://hdn-1.fynd.com/payment/netbanking.png", 
        "small": "https://hdn-1.fynd.com/payment/netbanking.png" 
    }, 
    "id": 1, 
    "is_active": true, 
    "sub_payment_mode": [ { 
        "code": "simpl", 
        "logo": "https://hdn-1.fynd.com/payment/simpl_logo.png", 
        "name": "Simpl", 
        "priority": 12, 
        "is_active": true 
    } ] 
}

module.exports.updateGatewayStatus = {
    "success": true,
    "message": "",
    "items": [
        {
            "id": 1,
            "name": "Simpl",
            "slug": "simpl",
            "logos": {
                "large": "https://hdn-1.fynd.com/payment/simpl-pg-logo.jpg",
                "small": "https://hdn-1.fynd.com/payment/simpl-pg-logo.jpg"
            },
            "is_active": false
        }
    ]
}

module.exports.emptyUpdateGatewayStatus = {
    "success": true,
    "message": ""
}

module.exports.allPaymentMode = {
    "success": true,
    "items": [
        {
            "name": "Pay Later",
            "id": 1,
            "is_active": true,
            "priority": 11,
            "logos": {
                "large": "https://hdn-1.fynd.com/payment/netbanking.png",
                "small": "https://hdn-1.fynd.com/payment/netbanking.png"
            },
            "sub_payment_mode": [
                {
                    "code": "icic",
                    "logo": "https://hdn-1.fynd.com/payment/NB_ICICI.png",
                    "name": "ICICI Bank PayLater",
                    "is_active": false
                },
                {
                    "code": "hdfc",
                    "logo": "https://hdn-1.fynd.com/payment/NB_HDFC.png",
                    "name": "FlexiPay by HDFC Bank",
                    "is_active": true
                }
            ]
        },
        {
            "name": "Card",
            "id": 2,
            "is_active": true,
            "priority": 2,
            "logos": {
                "large": "https://hdn-1.fynd.com/payment/default_card.png",
                "small": "https://hdn-1.fynd.com/payment/default_card.png"
            },
            "sub_payment_mode": []
        },
        {
            "name": "Net Banking",
            "id": 3,
            "is_active": true,
            "priority": 3,
            "logos": {
                "large": "https://hdn-1.fynd.com/payment/netbanking.png",
                "small": "https://hdn-1.fynd.com/payment/netbanking.png"
            },
            "sub_payment_mode": [
                {
                    "code": "LAVB_R",
                    "logo": "https://hdn-1.fynd.com/payment/NB_generic.png",
                    "name": "Lakshmi Vilas Bank - Retail Banking",
                    "is_active": true
                },
                {
                    "code": "BBKM",
                    "logo": "https://hdn-1.fynd.com/payment/NB_generic.png",
                    "name": "Bank of Bahrein and Kuwait",
                    "is_active": true
                }              
            ]
        }
    ]
}

module.exports.copyConfig = {
    "success": true,
    "message": "requested change is being performed",
    "items": []
}