module.exports.availableSections = {
    "section_name": "home",
    "data": [
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "items": [],
            "custom_meta": [],
            "_id": "6287788f3ff7ad0037278750",
            "type": "extension_item_list",
            "name": "Extension Item List",
            "page_type": "extension",
            "props": [
                {
                    "id": "heading",
                    "label": "Heading",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "title",
                    "label": "Title",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "subtitle",
                    "label": "Subtitle",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "button_label",
                    "label": "Button Label",
                    "default": "View All",
                    "type": "text"
                },
                {
                    "id": "button_page_link",
                    "label": "Redirection Page",
                    "default": "/extensions",
                    "type": "select",
                    "predicate_prop": {
                        "button_label": true
                    },
                    "options": [
                        {
                            "value": "/extensions",
                            "text": "Extensions List"
                        }
                    ]
                },
                {
                    "id": "button_position",
                    "label": "Button Position",
                    "default": "top_right",
                    "type": "select",
                    "predicate_prop": {
                        "button_label": true
                    },
                    "options": [
                        {
                            "value": "top_right",
                            "text": "Top Right"
                        },
                        {
                            "value": "bottom_left",
                            "text": "Bottom Left"
                        },
                        {
                            "value": "bottom_center",
                            "text": "Bottom Center"
                        },
                        {
                            "value": "bottom_right",
                            "text": "Bottom Right"
                        }
                    ]
                },
                {
                    "id": "item_source",
                    "label": "List item source",
                    "default": "",
                    "type": "radio",
                    "options": [
                        {
                            "text": "Powered by API",
                            "value": "api"
                        },
                        {
                            "text": "Manual Select",
                            "value": "manual"
                        }
                    ]
                },
                {
                    "id": "api_source",
                    "label": "API Source",
                    "default": "extension_latest",
                    "type": "select",
                    "predicate_prop": {
                        "item_source": "api"
                    },
                    "options": [
                        {
                            "text": "Latest Extensions",
                            "value": "extension_latest"
                        }
                    ]
                }
            ],
            "item_type": "extension",
            "created_at": "2022-05-20T11:16:31.245Z",
            "modified_at": "2022-05-20T11:16:31.245Z",
            "__v": 0
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "items": [],
            "custom_meta": [],
            "_id": "6287788f3ff7ad003727874f",
            "type": "banner",
            "name": "Banner",
            "page_type": "all",
            "props": [
                {
                    "id": "heading",
                    "label": "Heading",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "title",
                    "label": "Title",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "subtitle",
                    "label": "Subtitle",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "image",
                    "label": "Banner Image",
                    "default": "",
                    "type": "image_picker"
                },
                {
                    "id": "image_position",
                    "label": "Banner Position",
                    "default": "",
                    "type": "radio",
                    "predicate_prop": {
                        "image": true
                    },
                    "options": [
                        {
                            "value": "left",
                            "text": "Left"
                        },
                        {
                            "value": "right",
                            "text": "Right"
                        }
                    ]
                },
                {
                    "id": "button_label",
                    "label": "Button Label",
                    "default": "",
                    "type": "text"
                },
                {
                    "id": "button_page_link",
                    "label": "Redirection Page",
                    "default": "",
                    "type": "select",
                    "predicate_prop": {
                        "button_label": true
                    },
                    "options": [
                        {
                            "value": "Extensions List",
                            "text": "/extensions"
                        }
                    ]
                }
            ],
            "created_at": "2022-05-20T11:16:31.245Z",
            "modified_at": "2022-05-20T11:16:31.245Z",
            "__v": 0
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "items": [],
            "custom_meta": [],
            "_id": "6287788f3ff7ad0037278753",
            "type": "extension_grid",
            "name": "Extension Grid",
            "page_type": "extension",
            "props": [
                {
                    "id": "heading",
                    "label": "Heading",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "title",
                    "label": "Title",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "subtitle",
                    "label": "Subtitle",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "button_label",
                    "label": "Button Label",
                    "default": "",
                    "type": "text"
                },
                {
                    "id": "button_page_link",
                    "label": "Redirection Page",
                    "default": "",
                    "type": "select",
                    "predicate_prop": {
                        "button_label": true
                    },
                    "options": [
                        {
                            "value": "Collections",
                            "text": "/collections"
                        }
                    ]
                },
                {
                    "id": "item_source",
                    "label": "List item source",
                    "default": "manual",
                    "type": "radio",
                    "options": []
                },
                {
                    "id": "image",
                    "label": "Banner Image",
                    "default": "",
                    "type": "image_picker"
                },
                {
                    "id": "image_position",
                    "label": "Banner Position",
                    "default": "",
                    "type": "radio",
                    "predicate_prop": {
                        "image": true
                    },
                    "options": [
                        {
                            "value": "left",
                            "text": "Left"
                        },
                        {
                            "value": "right",
                            "text": "Right"
                        }
                    ]
                }
            ],
            "item_type": "extension",
            "created_at": "2022-05-20T11:16:31.245Z",
            "modified_at": "2022-05-20T11:16:31.245Z",
            "__v": 0
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "items": [],
            "custom_meta": [],
            "_id": "6287788f3ff7ad0037278751",
            "type": "collection_grid",
            "name": "Collection Grid",
            "page_type": "all",
            "props": [
                {
                    "id": "heading",
                    "label": "Heading",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "title",
                    "label": "Title",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "subtitle",
                    "label": "Subtitle",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "button_label",
                    "label": "Button Label",
                    "default": "",
                    "type": "text"
                },
                {
                    "id": "button_page_link",
                    "label": "Redirection Page",
                    "default": "",
                    "type": "select",
                    "predicate_prop": {
                        "button_label": true
                    },
                    "options": [
                        {
                            "value": "Collections",
                            "text": "/collections"
                        }
                    ]
                },
                {
                    "id": "item_source",
                    "label": "List item source",
                    "default": "manual",
                    "type": "radio",
                    "options": []
                },
                {
                    "id": "image",
                    "label": "Banner Image",
                    "default": "",
                    "type": "image_picker"
                },
                {
                    "id": "image_position",
                    "label": "Banner Position",
                    "default": "",
                    "type": "radio",
                    "predicate_prop": {
                        "image": true
                    },
                    "options": [
                        {
                            "value": "left",
                            "text": "Left"
                        },
                        {
                            "value": "right",
                            "text": "Right"
                        }
                    ]
                }
            ],
            "item_type": "collection",
            "created_at": "2022-05-20T11:16:31.245Z",
            "modified_at": "2022-05-20T11:16:31.245Z",
            "__v": 0
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "items": [],
            "custom_meta": [],
            "_id": "6287788f3ff7ad0037278752",
            "type": "category_item_list",
            "name": "Category Item List",
            "page_type": "extension",
            "props": [
                {
                    "id": "heading",
                    "label": "Heading",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "title",
                    "label": "Title",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "subtitle",
                    "label": "Subtitle",
                    "default": "",
                    "type": "textbox"
                },
                {
                    "id": "button_label",
                    "label": "Button Label",
                    "default": "View All",
                    "type": "text"
                },
                {
                    "id": "button_page_link",
                    "label": "Redirection Page",
                    "default": "/extensions",
                    "type": "select",
                    "predicate_prop": {
                        "button_label": true
                    },
                    "options": []
                },
                {
                    "id": "button_position",
                    "label": "Button Position",
                    "default": "top_right",
                    "type": "select",
                    "predicate_prop": {
                        "button_label": true
                    },
                    "options": [
                        {
                            "value": "top_right",
                            "text": "Top Right"
                        },
                        {
                            "value": "bottom_left",
                            "text": "Bottom Left"
                        },
                        {
                            "value": "bottom_center",
                            "text": "Bottom Center"
                        },
                        {
                            "value": "bottom_right",
                            "text": "Bottom Right"
                        }
                    ]
                },
                {
                    "id": "item_source",
                    "label": "List item source",
                    "default": "manual",
                    "type": "radio",
                    "options": []
                }
            ],
            "item_type": "category",
            "created_at": "2022-05-20T11:16:31.245Z",
            "modified_at": "2022-05-20T11:16:31.245Z",
            "__v": 0
        }
    ]
}

module.exports.extensionHome = {
    "_id": "628cd739e1abb8002fa71f9e",
    "custom_meta": [],
    "type": "extension",
    "slug": "extension-home",
    "sections": [
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "banner",
            "page_type": "all",
            "data": {
                "heading": "Heading",
                "title": "Skyrocket your business experience using extensions",
                "subtitle": "Boost the capability of Fynd Platform using extensions created specially for the merchant community ",
                "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png",
                "image_position": "right",
                "button_label": "View All Extensions",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "extension_item_list",
            "page_type": "extension",
            "item_type": "extension",
            "items": [
                {
                    "_id": "61232bb99b84cb780e583a35",
                    "listing_info": {
                        "keywords": [
                            "file",
                            "products",
                            "collections"
                        ],
                        "name": "File Attachment Manager",
                        "tagline": "Attach extra files with products and collections ",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/6ZX0MGDLJ-logo.png"
                    },
                    "details": {
                        "description": "File attachment is an extension that helps us to attach additional files to collections, products etc"
                    },
                    "plans": [
                        {
                            "name": "Basic",
                            "features": "Attach Files\nSupport for products ",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                },
                {
                    "_id": "61233a429b84cb6fbc583a37",
                    "listing_info": {
                        "keywords": [
                            "moengage"
                        ],
                        "name": "MoEngage Catalogue",
                        "tagline": "Export products in MoEngage compatible format",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/vWxBbWFrp-B9wLASdAHG-moengage.png"
                    },
                    "details": {
                        "description": "<p>Your catalogue on Fynd Platform is readily usable on MoEngage Commerce Manager. This app helps you transform your Fynd Platform catalogue into MoEngage's import products CSV file format without much manual intervention. You may use this exported CSV file readily on MoEngage Commerce Manager to upload your products to MoEngage Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on MoEngage Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the MoEngage marketplace to Fynd Platform using the exported CSV from MoEngage Commerce Manager.</li>\n</ul>\n</li>\n</ul>"
                    },
                    "plans": [
                        {
                            "name": "Premium",
                            "features": "Unlimited catalogue export\nSchedule catalogue generation\nView export event history ",
                            "type": "recurring",
                            "price": {
                                "amount": 199,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": "",
                            "recurring": {
                                "type": "month",
                                "recurring_time": 30,
                                "yearly_amount": 2388
                            }
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                },
                {
                    "_id": "61233a489b84cb6eca583a3b",
                    "listing_info": {
                        "keywords": [
                            "adyogi"
                        ],
                        "name": "Adyogi Catalogue",
                        "tagline": "Export products in Adyogi compatible format",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/RWrB493lZ-logo.png"
                    },
                    "details": {
                        "description": "<p>Your catalogue on Fynd Platform is readily usable on Adyogi Commerce Manager. This app helps you transform your Fynd Platform catalogue into Adyogi's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Adyogi Commerce Manager to upload your products to Adyogi Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Adyogi Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Adyogi marketplace to Fynd Platform using the exported CSV from Adyogi Commerce Manager.</li>\n</ul>\n</li>\n</ul>"
                    },
                    "plans": [
                        {
                            "name": "Premium",
                            "features": "Unlimited catalogue export\nSchedule catalogue generation\nView export event history ",
                            "type": "recurring",
                            "price": {
                                "amount": 199,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": "",
                            "recurring": {
                                "type": "month",
                                "recurring_time": 30,
                                "yearly_amount": 2388
                            }
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                }
            ],
            "data": {
                "heading": "MOST RECOMMENDED",
                "title": "Handful of extensions",
                "subtitle": " we suggest for your online business",
                "button_label": "View All",
                "button_page_link": "/extensions",
                "button_position": "top_right",
                "item_source": "manual",
                "api_source": "extension_latest"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "collection_grid",
            "page_type": "all",
            "item_type": "collection",
            "items": [],
            "data": {
                "heading": "COLLECTIONS",
                "title": "Explore group of extensions",
                "subtitle": " for your larger business objectives",
                "image": "",
                "image_position": "right",
                "button_label": "View All",
                "button_page_link": "Collections",
                "button_position": "top_right",
                "item_source": "manual"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "category_item_list",
            "page_type": "extension",
            "item_type": "category",
            "items": [],
            "data": {
                "heading": "CATEGORIES",
                "title": "Extensions organized as per their genre",
                "subtitle": "",
                "button_label": "View All",
                "button_page_link": "/extensions",
                "button_position": "bottom_center",
                "item_source": "manual"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "extension_grid",
            "page_type": "extension",
            "item_type": "extension",
            "items": [
                {
                    "_id": "60bf7f734fe0a3c8e90e5b83",
                    "listing_info": {
                        "keywords": [],
                        "name": "Newsletter Subscription",
                        "tagline": "dsvsv",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
                    },
                    "details": {
                        "description": "<p>Now you can run referral campaigns that lets you and your existing customers refer their friends and family to register on your website.<br /><br />Features<br />&bull; Configure reward for the referrer<br />&bull; Configure reward for the one being referred<br />&bull; Set validity of referral and the reward<br />&bull; Enable/Disable referral campaigns</p>"
                    },
                    "plans": [
                        {
                            "name": "dbfd",
                            "features": "ngfnfgm",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Fynd",
                            "slug": "Fynd-s8f-32"
                        }
                    ]
                },
                {
                    "_id": "6113c85841dc073aebc38f5f",
                    "listing_info": {
                        "keywords": [],
                        "name": "Newsletter-Local-Aayush",
                        "tagline": "This is tagline for test2",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png"
                    },
                    "details": {
                        "description": "Newsletter local by aayush"
                    },
                    "plans": [
                        {
                            "name": "free",
                            "features": "free\nfree\nfree\nfree",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Fynd",
                            "slug": "Fynd-s8f-32"
                        }
                    ]
                },
                {
                    "_id": "61160b0041dc073a0fc38f61",
                    "listing_info": {
                        "keywords": [],
                        "name": "APK ",
                        "tagline": "Downloadable apk",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png"
                    },
                    "details": {
                        "description": "xyz"
                    },
                    "plans": [
                        {
                            "name": "apk",
                            "features": "xyz",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Strikers",
                            "slug": "ApkExt-ze8-72"
                        }
                    ]
                },
                {
                    "_id": "61232bb99b84cb780e583a35",
                    "listing_info": {
                        "keywords": [
                            "file",
                            "products",
                            "collections"
                        ],
                        "name": "File Attachment Manager",
                        "tagline": "Attach extra files with products and collections ",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/6ZX0MGDLJ-logo.png"
                    },
                    "details": {
                        "description": "File attachment is an extension that helps us to attach additional files to collections, products etc"
                    },
                    "plans": [
                        {
                            "name": "Basic",
                            "features": "Attach Files\nSupport for products ",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                }
            ],
            "data": {
                "heading": "TOP FREE",
                "title": "Free extensions for you",
                "subtitle": " to install",
                "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/8LO7Ifsjd-logo.png",
                "image_position": "right",
                "button_label": "View All",
                "button_page_link": "Collections",
                "button_position": "bottom_left",
                "item_source": "manual"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "Heading",
                "title": "Title",
                "subtitle": "Subtitle",
                "image": "",
                "image_position": "left",
                "button_label": "View",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "New",
                "title": "Year",
                "subtitle": "Happy",
                "image": "",
                "image_position": "left",
                "button_label": "Hahahah",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "What",
                "title": "Are",
                "subtitle": "Youu",
                "image": "",
                "image_position": "right",
                "button_label": "Saying",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "What",
                "title": "Are",
                "subtitle": "Youu",
                "image": "",
                "image_position": "right",
                "button_label": "Saying",
                "button_page_link": "Extensions List"
            }
        }
    ],
    "props": [],
    "created_at": "2022-05-24T13:01:45.727Z",
    "modified_at": "2022-05-24T15:07:45.441Z",
    "__v": 0
}

module.exports.updateHomePayload = {
    "_id": "628cd739e1abb8002fa71f9e",
    "custom_meta": [],
    "type": "extension",
    "slug": "extension-home",
    "sections": [
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "banner",
            "page_type": "all",
            "data": {
                "heading": "Heading",
                "title": "Skyrocket your business experience using extensions",
                "subtitle": "Boost the capability of Fynd Platform using extensions created specially for the merchant community ",
                "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png",
                "image_position": "right",
                "button_label": "View All Extensions",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "extension_item_list",
            "page_type": "extension",
            "item_type": "extension",
            "items": [
                {
                    "_id": "61232bb99b84cb780e583a35",
                    "listing_info": {
                        "keywords": [
                            "file",
                            "products",
                            "collections"
                        ],
                        "name": "File Attachment Manager",
                        "tagline": "Attach extra files with products and collections ",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/6ZX0MGDLJ-logo.png"
                    },
                    "details": {
                        "description": "File attachment is an extension that helps us to attach additional files to collections, products etc"
                    },
                    "plans": [
                        {
                            "name": "Basic",
                            "features": "Attach Files\nSupport for products ",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                },
                {
                    "_id": "61233a429b84cb6fbc583a37",
                    "listing_info": {
                        "keywords": [
                            "moengage"
                        ],
                        "name": "MoEngage Catalogue",
                        "tagline": "Export products in MoEngage compatible format",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/vWxBbWFrp-B9wLASdAHG-moengage.png"
                    },
                    "details": {
                        "description": "<p>Your catalogue on Fynd Platform is readily usable on MoEngage Commerce Manager. This app helps you transform your Fynd Platform catalogue into MoEngage's import products CSV file format without much manual intervention. You may use this exported CSV file readily on MoEngage Commerce Manager to upload your products to MoEngage Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on MoEngage Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the MoEngage marketplace to Fynd Platform using the exported CSV from MoEngage Commerce Manager.</li>\n</ul>\n</li>\n</ul>"
                    },
                    "plans": [
                        {
                            "name": "Premium",
                            "features": "Unlimited catalogue export\nSchedule catalogue generation\nView export event history ",
                            "type": "recurring",
                            "price": {
                                "amount": 199,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": "",
                            "recurring": {
                                "type": "month",
                                "recurring_time": 30,
                                "yearly_amount": 2388
                            }
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                },
                {
                    "_id": "61233a489b84cb6eca583a3b",
                    "listing_info": {
                        "keywords": [
                            "adyogi"
                        ],
                        "name": "Adyogi Catalogue",
                        "tagline": "Export products in Adyogi compatible format",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/RWrB493lZ-logo.png"
                    },
                    "details": {
                        "description": "<p>Your catalogue on Fynd Platform is readily usable on Adyogi Commerce Manager. This app helps you transform your Fynd Platform catalogue into Adyogi's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Adyogi Commerce Manager to upload your products to Adyogi Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Adyogi Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Adyogi marketplace to Fynd Platform using the exported CSV from Adyogi Commerce Manager.</li>\n</ul>\n</li>\n</ul>"
                    },
                    "plans": [
                        {
                            "name": "Premium",
                            "features": "Unlimited catalogue export\nSchedule catalogue generation\nView export event history ",
                            "type": "recurring",
                            "price": {
                                "amount": 199,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": "",
                            "recurring": {
                                "type": "month",
                                "recurring_time": 30,
                                "yearly_amount": 2388
                            }
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                }
            ],
            "data": {
                "heading": "MOST RECOMMENDED",
                "title": "Handful of extensions",
                "subtitle": " we suggest for your online business",
                "button_label": "View All",
                "button_page_link": "/extensions",
                "button_position": "top_right",
                "item_source": "manual",
                "api_source": "extension_latest"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "collection_grid",
            "page_type": "all",
            "item_type": "collection",
            "items": [],
            "data": {
                "heading": "COLLECTIONS",
                "title": "Explore group of extensions",
                "subtitle": " for your larger business objectives",
                "image": "",
                "image_position": "right",
                "button_label": "View All",
                "button_page_link": "Collections",
                "button_position": "top_right",
                "item_source": "manual"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "category_item_list",
            "page_type": "extension",
            "item_type": "category",
            "items": [],
            "data": {
                "heading": "CATEGORIES",
                "title": "Extensions organized as per their genre",
                "subtitle": "",
                "button_label": "View All",
                "button_page_link": "/extensions",
                "button_position": "bottom_center",
                "item_source": "manual"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "extension_grid",
            "page_type": "extension",
            "item_type": "extension",
            "items": [
                {
                    "_id": "60bf7f734fe0a3c8e90e5b83",
                    "listing_info": {
                        "keywords": [],
                        "name": "Newsletter Subscription",
                        "tagline": "dsvsv",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
                    },
                    "details": {
                        "description": "<p>Now you can run referral campaigns that lets you and your existing customers refer their friends and family to register on your website.<br /><br />Features<br />&bull; Configure reward for the referrer<br />&bull; Configure reward for the one being referred<br />&bull; Set validity of referral and the reward<br />&bull; Enable/Disable referral campaigns</p>"
                    },
                    "plans": [
                        {
                            "name": "dbfd",
                            "features": "ngfnfgm",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Fynd",
                            "slug": "Fynd-s8f-32"
                        }
                    ]
                },
                {
                    "_id": "6113c85841dc073aebc38f5f",
                    "listing_info": {
                        "keywords": [],
                        "name": "Newsletter-Local-Aayush",
                        "tagline": "This is tagline for test2",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png"
                    },
                    "details": {
                        "description": "Newsletter local by aayush"
                    },
                    "plans": [
                        {
                            "name": "free",
                            "features": "free\nfree\nfree\nfree",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Fynd",
                            "slug": "Fynd-s8f-32"
                        }
                    ]
                },
                {
                    "_id": "61160b0041dc073a0fc38f61",
                    "listing_info": {
                        "keywords": [],
                        "name": "APK ",
                        "tagline": "Downloadable apk",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png"
                    },
                    "details": {
                        "description": "xyz"
                    },
                    "plans": [
                        {
                            "name": "apk",
                            "features": "xyz",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Strikers",
                            "slug": "ApkExt-ze8-72"
                        }
                    ]
                },
                {
                    "_id": "61232bb99b84cb780e583a35",
                    "listing_info": {
                        "keywords": [
                            "file",
                            "products",
                            "collections"
                        ],
                        "name": "File Attachment Manager",
                        "tagline": "Attach extra files with products and collections ",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/6ZX0MGDLJ-logo.png"
                    },
                    "details": {
                        "description": "File attachment is an extension that helps us to attach additional files to collections, products etc"
                    },
                    "plans": [
                        {
                            "name": "Basic",
                            "features": "Attach Files\nSupport for products ",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                }
            ],
            "data": {
                "heading": "TOP FREE",
                "title": "Free extensions for you",
                "subtitle": " to install",
                "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/8LO7Ifsjd-logo.png",
                "image_position": "right",
                "button_label": "View All",
                "button_page_link": "Collections",
                "button_position": "bottom_left",
                "item_source": "manual"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "Heading",
                "title": "Title",
                "subtitle": "Subtitle",
                "image": "",
                "image_position": "left",
                "button_label": "View",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "New",
                "title": "Year",
                "subtitle": "Happy",
                "image": "",
                "image_position": "left",
                "button_label": "Hahahah",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "What",
                "title": "Are",
                "subtitle": "Youu",
                "image": "",
                "image_position": "right",
                "button_label": "Saying",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "What",
                "title": "Are",
                "subtitle": "Youu",
                "image": "",
                "image_position": "right",
                "button_label": "Sayingg",
                "button_page_link": "Extensions List"
            }
        }
    ],
    "props": [],
    "modified_at": "2022-05-24T15:07:45.441Z",
    "__v": 0,
    "value": "extension-home",
    "text": "extension-home"
}

module.exports.updateHome = { "n": 1, "nModified": 1, "opTime": { "ts": "7102265986337734657", "t": 33 }, "electionId": "7fffffff0000000000000021", "ok": 1, "$clusterTime": { "clusterTime": "7102265986337734657", "signature": { "hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAA=", "keyId": 0 } }, "operationTime": "7102265986337734657" };

module.exports.updateHomeEvent = {
    "sections": [
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "banner",
            "page_type": "all",
            "data": {
                "heading": "Heading",
                "title": "Skyrocket your business experience using extensions",
                "subtitle": "Boost the capability of Fynd Platform using extensions created specially for the merchant community ",
                "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png",
                "image_position": "right",
                "button_label": "View All Extensions",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "extension_item_list",
            "page_type": "extension",
            "item_type": "extension",
            "items": [
                {
                    "_id": "61232bb99b84cb780e583a35",
                    "listing_info": {
                        "keywords": [
                            "file",
                            "products",
                            "collections"
                        ],
                        "name": "File Attachment Manager",
                        "tagline": "Attach extra files with products and collections ",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/6ZX0MGDLJ-logo.png"
                    },
                    "details": {
                        "description": "File attachment is an extension that helps us to attach additional files to collections, products etc"
                    },
                    "plans": [
                        {
                            "name": "Basic",
                            "features": "Attach Files\nSupport for products ",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                },
                {
                    "_id": "61233a429b84cb6fbc583a37",
                    "listing_info": {
                        "keywords": [
                            "moengage"
                        ],
                        "name": "MoEngage Catalogue",
                        "tagline": "Export products in MoEngage compatible format",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/vWxBbWFrp-B9wLASdAHG-moengage.png"
                    },
                    "details": {
                        "description": "<p>Your catalogue on Fynd Platform is readily usable on MoEngage Commerce Manager. This app helps you transform your Fynd Platform catalogue into MoEngage's import products CSV file format without much manual intervention. You may use this exported CSV file readily on MoEngage Commerce Manager to upload your products to MoEngage Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on MoEngage Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the MoEngage marketplace to Fynd Platform using the exported CSV from MoEngage Commerce Manager.</li>\n</ul>\n</li>\n</ul>"
                    },
                    "plans": [
                        {
                            "name": "Premium",
                            "features": "Unlimited catalogue export\nSchedule catalogue generation\nView export event history ",
                            "type": "recurring",
                            "price": {
                                "amount": 199,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": "",
                            "recurring": {
                                "type": "month",
                                "recurring_time": 30,
                                "yearly_amount": 2388
                            }
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                },
                {
                    "_id": "61233a489b84cb6eca583a3b",
                    "listing_info": {
                        "keywords": [
                            "adyogi"
                        ],
                        "name": "Adyogi Catalogue",
                        "tagline": "Export products in Adyogi compatible format",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/RWrB493lZ-logo.png"
                    },
                    "details": {
                        "description": "<p>Your catalogue on Fynd Platform is readily usable on Adyogi Commerce Manager. This app helps you transform your Fynd Platform catalogue into Adyogi's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Adyogi Commerce Manager to upload your products to Adyogi Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Adyogi Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Adyogi marketplace to Fynd Platform using the exported CSV from Adyogi Commerce Manager.</li>\n</ul>\n</li>\n</ul>"
                    },
                    "plans": [
                        {
                            "name": "Premium",
                            "features": "Unlimited catalogue export\nSchedule catalogue generation\nView export event history ",
                            "type": "recurring",
                            "price": {
                                "amount": 199,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": "",
                            "recurring": {
                                "type": "month",
                                "recurring_time": 30,
                                "yearly_amount": 2388
                            }
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                }
            ],
            "data": {
                "heading": "MOST RECOMMENDED",
                "title": "Handful of extensions",
                "subtitle": " we suggest for your online business",
                "button_label": "View All",
                "button_page_link": "/extensions",
                "button_position": "top_right",
                "item_source": "manual",
                "api_source": "extension_latest"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "collection_grid",
            "page_type": "all",
            "item_type": "collection",
            "items": [],
            "data": {
                "heading": "COLLECTIONS",
                "title": "Explore group of extensions",
                "subtitle": " for your larger business objectives",
                "image": "",
                "image_position": "right",
                "button_label": "View All",
                "button_page_link": "Collections",
                "button_position": "top_right",
                "item_source": "manual"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "category_item_list",
            "page_type": "extension",
            "item_type": "category",
            "items": [],
            "data": {
                "heading": "CATEGORIES",
                "title": "Extensions organized as per their genre",
                "subtitle": "",
                "button_label": "View All",
                "button_page_link": "/extensions",
                "button_position": "bottom_center",
                "item_source": "manual"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true
                }
            },
            "tags": [],
            "visible": true,
            "type": "extension_grid",
            "page_type": "extension",
            "item_type": "extension",
            "items": [
                {
                    "_id": "60bf7f734fe0a3c8e90e5b83",
                    "listing_info": {
                        "keywords": [],
                        "name": "Newsletter Subscription",
                        "tagline": "dsvsv",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
                    },
                    "details": {
                        "description": "<p>Now you can run referral campaigns that lets you and your existing customers refer their friends and family to register on your website.<br /><br />Features<br />&bull; Configure reward for the referrer<br />&bull; Configure reward for the one being referred<br />&bull; Set validity of referral and the reward<br />&bull; Enable/Disable referral campaigns</p>"
                    },
                    "plans": [
                        {
                            "name": "dbfd",
                            "features": "ngfnfgm",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Fynd",
                            "slug": "Fynd-s8f-32"
                        }
                    ]
                },
                {
                    "_id": "6113c85841dc073aebc38f5f",
                    "listing_info": {
                        "keywords": [],
                        "name": "Newsletter-Local-Aayush",
                        "tagline": "This is tagline for test2",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png"
                    },
                    "details": {
                        "description": "Newsletter local by aayush"
                    },
                    "plans": [
                        {
                            "name": "free",
                            "features": "free\nfree\nfree\nfree",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Fynd",
                            "slug": "Fynd-s8f-32"
                        }
                    ]
                },
                {
                    "_id": "61160b0041dc073a0fc38f61",
                    "listing_info": {
                        "keywords": [],
                        "name": "APK ",
                        "tagline": "Downloadable apk",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png"
                    },
                    "details": {
                        "description": "xyz"
                    },
                    "plans": [
                        {
                            "name": "apk",
                            "features": "xyz",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Strikers",
                            "slug": "ApkExt-ze8-72"
                        }
                    ]
                },
                {
                    "_id": "61232bb99b84cb780e583a35",
                    "listing_info": {
                        "keywords": [
                            "file",
                            "products",
                            "collections"
                        ],
                        "name": "File Attachment Manager",
                        "tagline": "Attach extra files with products and collections ",
                        "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/6ZX0MGDLJ-logo.png"
                    },
                    "details": {
                        "description": "File attachment is an extension that helps us to attach additional files to collections, products etc"
                    },
                    "plans": [
                        {
                            "name": "Basic",
                            "features": "Attach Files\nSupport for products ",
                            "type": "free",
                            "price": {
                                "amount": 0,
                                "currency": "INR"
                            },
                            "trial_days": 0,
                            "additional_charges": ""
                        }
                    ],
                    "organization": [
                        {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    ]
                }
            ],
            "data": {
                "heading": "TOP FREE",
                "title": "Free extensions for you",
                "subtitle": " to install",
                "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/8LO7Ifsjd-logo.png",
                "image_position": "right",
                "button_label": "View All",
                "button_page_link": "Collections",
                "button_position": "bottom_left",
                "item_source": "manual"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "Heading",
                "title": "Title",
                "subtitle": "Subtitle",
                "image": "",
                "image_position": "left",
                "button_label": "View",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "New",
                "title": "Year",
                "subtitle": "Happy",
                "image": "",
                "image_position": "left",
                "button_label": "Hahahah",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "What",
                "title": "Are",
                "subtitle": "Youu",
                "image": "",
                "image_position": "right",
                "button_label": "Saying",
                "button_page_link": "Extensions List"
            }
        },
        {
            "predicate": {
                "screen": {
                    "mobile": true,
                    "table": true,
                    "desktop": true,
                    "tablet": true
                }
            },
            "tags": [],
            "visible": true,
            "preview": true,
            "page_type": "all",
            "type": "banner",
            "data": {
                "heading": "What",
                "title": "Are",
                "subtitle": "Youu",
                "image": "",
                "image_position": "right",
                "button_label": "Sayingg",
                "button_page_link": "Extensions List"
            }
        }
    ]
}