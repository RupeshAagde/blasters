module.exports.availableSections = {
  "items": [
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
  "_id": "62a97b0fd55336002dbfb789",
  "custom_meta": [],
  "name": "Extension Home",
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
          "page_type": "extension",
          "type": "extension_item_list",
          "item_type": "extension",
          "data": {
              "heading": "Heading",
              "title": "Title",
              "subtitle": "Subtitle",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "api_source": "extension_latest",
              "extension": [
                  "62445236d4cc749faccf213e",
                  "6232f7c538bac40085b874c5",
                  "61155f5d95dcfad8294091c4"
              ]
          },
          "items": [
              {
                  "value": "62445236d4cc749faccf213e"
              },
              {
                  "value": "6232f7c538bac40085b874c5"
              },
              {
                  "value": "61155f5d95dcfad8294091c4"
              }
          ]
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
          "type": "banner",
          "page_type": "all",
          "data": {
              "heading": "Fynd Extensions",
              "title": "Skyrocket your business experience using extensions",
              "subtitle": "Boost the capability of Fynd Platform using extensions created specially for the merchant community",
              "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png",
              "image_position": "right",
              "button_label": "View All Extensions",
              "button_page_link": "Extensions List"
          },
          "items": []
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
          "page_type": "all",
          "type": "collection_grid",
          "data": {
              "heading": "Collections",
              "title": "Latest",
              "subtitle": "Subtitle",
              "button_label": "View",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "collection": [
                  "623847d0ec3c4b10b1f5fed6",
                  "627ba8371171f7705212333b",
                  "62384f66ec3c4b4e6ff5fee6",
                  "625fe7c726e867d85730af1a"
              ]
          },
          "item_type": "collection",
          "items": [
              {
                  "value": "623847d0ec3c4b10b1f5fed6"
              },
              {
                  "value": "627ba8371171f7705212333b"
              },
              {
                  "value": "62384f66ec3c4b4e6ff5fee6"
              },
              {
                  "value": "625fe7c726e867d85730af1a"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_grid",
          "data": {
              "heading": "Latest Extensions",
              "title": "Extensions",
              "subtitle": "Latest Extensions",
              "button_label": "View All",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "extension": [
                  "60be66a2d4cbbf1fd0a67c8c",
                  "610d2ad295dcfa14eb408bad",
                  "61109c6795dcfa38cb408c70",
                  "6232f7c538bac40085b874c5"
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "60be66a2d4cbbf1fd0a67c8c"
              },
              {
                  "value": "610d2ad295dcfa14eb408bad"
              },
              {
                  "value": "61109c6795dcfa38cb408c70"
              },
              {
                  "value": "6232f7c538bac40085b874c5"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_item_list",
          "data": {
              "heading": "NEW! NEW!",
              "title": "New Extensions",
              "subtitle": "Subtitle",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "api_source": "extension_latest",
              "extension": [
                  "611624ac95dcfa262740920e",
                  "6116026a95dcfa05eb4091e3",
                  "61155f5d95dcfad8294091c4",
                  "61138cf895dcfa08a5408fc4"
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "611624ac95dcfa262740920e"
              },
              {
                  "value": "6116026a95dcfa05eb4091e3"
              },
              {
                  "value": "61155f5d95dcfad8294091c4"
              },
              {
                  "value": "61138cf895dcfa08a5408fc4"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_grid",
          "data": {
              "heading": "TOP FREE",
              "title": "Free extensions for you",
              "subtitle": "to to install",
              "button_label": "View All",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "extension": [
                  "60be66a2d4cbbf1fd0a67c8c",
                  "609400409d0dcbdc2e6b76a5",
                  "610d2ad295dcfa14eb408bad"
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "60be66a2d4cbbf1fd0a67c8c"
              },
              {
                  "value": "609400409d0dcbdc2e6b76a5"
              },
              {
                  "value": "610d2ad295dcfa14eb408bad"
              }
          ]
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
          "page_type": "extension",
          "type": "category_item_list",
          "data": {
              "heading": "H",
              "title": "T",
              "subtitle": "ST",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "category": [
                  "629461b2e6bf3c5f04e4f63d",
                  "629461b2e6bf3c5f04e4f64a",
                  "629461b2e6bf3c5f04e4f646"
              ]
          },
          "item_type": "category",
          "items": [
              {
                  "value": "629461b2e6bf3c5f04e4f63d"
              },
              {
                  "value": "629461b2e6bf3c5f04e4f64a"
              },
              {
                  "value": "629461b2e6bf3c5f04e4f646"
              }
          ]
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
          "page_type": "all",
          "type": "banner",
          "data": {
              "heading": "Banner",
              "title": "Banner",
              "subtitle": "Banner Sub",
              "image": "https://hdn-1.addsale.com/x0/platform/pictures/partner-feature-image/original/_APcxzEiu-BSUMhjxhp-8OGhZsCWy-extension-image-1655268946947.jpeg",
              "image_position": "right",
              "button_label": "Gheun Taak",
              "button_page_link": "Extensions List"
          },
          "items": []
      }
  ],
  "props": [],
  "modified_at": "2022-06-15T14:05:02.494Z",
  "__v": 28,
  "created_at": "2022-06-15T06:24:15.426Z"
}

module.exports.getExtensionInfo1 = {
  "items": [
      {
          "_id": "61155f5d95dcfad8294091c4",
          "description": "",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/profile",
              "company/product",
              "company/application/catalogue"
          ],
          "name": "Amazon Catalogue",
          "base_url": "https://amazon-ct.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png",
              "large": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png"
          },
          "callbacks": {
              "setup": "https://amazon-ct.extensions.fyndx0.de/fp/setup",
              "auth": "https://amazon-ct.extensions.fyndx0.de/fp/auth",
              "install": "https://amazon-ct.extensions.fyndx0.de/fp/install",
              "uninstall": "https://amazon-ct.extensions.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Piyush Org",
          "contact_email": "piyushvishwakarma@gofynd.com",
          "organization_id": "6111ec0095dcfac23e408dd1",
          "created_at": "2021-08-12T17:50:21.608Z",
          "modified_at": "2021-09-29T09:51:39.732Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "6149687d9e865808c8556baf",
              "listing_info": {
                  "keywords": [
                      "amazon"
                  ],
                  "name": "Amazon Catalogue",
                  "tagline": "Export products in Amazon compatible format",
                  "icon": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/KrryVoFfH-desk-sc-1.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/YDwSZsoiV-mob-sc-1.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "6149687d9e8658092e556bb0",
                          "title": "Catalogue Export",
                          "description": "Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager."
                      }
                  ],
                  "description": "<p>Your catalogue on Fynd Platform is readily usable on Facebook Commerce Manager. This app helps you transform your Fynd Platform catalogue into Facebook's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Facebook Commerce Manager to upload your products to Facebook Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Facebook marketplace to Fynd Platform using the exported CSV from Facebook Commerce Manager.</li>\n</ul>\n</li>\n</ul>",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "piyushvishwakarma@gofynd.com",
                      "phone": "7208229699",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/profile",
                  "company/product",
                  "company/application/catalogue"
              ],
              "plans": [
                  {
                      "name": "Premium",
                      "features": "Unlimited catalogue export   \nSchedule catalogue generation\nView export event history ",
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
              "extension_id": "61155f5d95dcfad8294091c4",
              "slug": "amazon-catalogue",
              "plan_type": "recurring",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "6111ec0095dcfac23e408dd1",
              "created_at": "2021-09-21T05:07:09.208Z",
              "modified_at": "2022-03-21T12:27:07.601Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f45a",
                          "_id": "62320b45f4213eb19aa8f45a",
                          "slug": "customer-service"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f45c",
                          "_id": "62320b45f4213eb19aa8f45c",
                          "slug": "channel-management"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4f4",
                          "_id": "62320b45f4213eb19aa8f4f4",
                          "parent": "62320b45f4213eb19aa8f45c",
                          "slug": "shipping-solution"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4e9",
                          "_id": "62320b45f4213eb19aa8f4e9",
                          "parent": "62320b45f4213eb19aa8f45c",
                          "slug": "channel-management-internalization"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4d6",
                          "_id": "62320b45f4213eb19aa8f4d6",
                          "parent": "62320b45f4213eb19aa8f45a",
                          "slug": "customer-account"
                      }
                  ]
              },
              "organization": {
                  "name": "Piyush Org",
                  "slug": "Piyush-ph2-25"
              }
          },
          "organization": {
              "name": "Piyush Org",
              "slug": "Piyush-ph2-25"
          }
      },
      {
          "_id": "6232f7c538bac40085b874c5",
          "description": "As an online marketer with a product that you believe in, nailing the art of converting site visitors into leads is going to have a huge impact on the success of your business. Well, Hellobar makes it possible!\n \n What's New\n • Business efforts will not be wasted\n • Keep customers engaged on your website",
          "whitelisted_urls": [],
          "ext_version": "1.0",
          "extention_type": "public",
          "is_application_level": false,
          "is_saleschannel": false,
          "scope": [
              "company/profile"
          ],
          "name": "Hellobar",
          "base_url": "https://localdev.fyndx0.de",
          "logo": {
              "large": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png",
              "small": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png"
          },
          "contact_email": "gauravkumarsharma@gofynd.com",
          "callbacks": {
              "auth": "https://localdev.fyndx0.de/fp/auth",
              "install": "https://localdev.fyndx0.de/fp/install",
              "setup": "https://localdev.fyndx0.de/fp/setup",
              "uninstall": "https://localdev.fyndx0.de/fp/uninstall"
          },
          "is_coming_soon": true,
          "organization_id": "610d3a4595dcfae682408c07",
          "created_at": "2022-03-17T08:56:37.174Z",
          "modified_at": "2022-03-17T08:56:37.174Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "6232f7c538bac40085b874c7",
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f458",
                          "_id": "62320b45f4213eb19aa8f458",
                          "slug": "source-and-selling-product"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4e5",
                          "_id": "62320b45f4213eb19aa8f4e5",
                          "parent": "62320b45f4213eb19aa8f458",
                          "slug": "marketplace"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4e1",
                          "_id": "62320b45f4213eb19aa8f4e1",
                          "parent": "62320b45f4213eb19aa8f458",
                          "slug": "dropshipping"
                      }
                  ]
              },
              "listing_info": {
                  "keywords": [],
                  "icon": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png",
                  "name": "Hellobar",
                  "tagline": "Use emphasized text as heading that sticks on your website"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/banner.png"
                      ],
                      "mobile": []
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "6232f7c538bac40085b874c8",
                          "title": "Guest To Customer Transition",
                          "description": "Effective headers will increase sign-ups"
                      },
                      {
                          "_id": "6232f7c538bac40085b874c9",
                          "title": "Create Leads For Marketing",
                          "description": "Fetch emails/contact numbers to boost business"
                      },
                      {
                          "_id": "6232f7c538bac40085b874ca",
                          "title": "Minimize Cart Rejection",
                          "description": "Encourages customer to buy items"
                      }
                  ],
                  "description": "As an online marketer with a product that you believe in, nailing the art of converting site visitors into leads is going to have a huge impact on the success of your business. Well, Hellobar makes it possible!\n \n \n <p>What's New\n \n\n\n \n <p>• Business efforts will not be wasted\n \n\n\n \n <p>• Keep customers engaged on your website",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "",
                      "phone": "",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": true
              },
              "scope": [
                  "company/profile"
              ],
              "plans": [
                  {
                      "additional_charges": "",
                      "features": "free plan features",
                      "name": "free",
                      "price": {
                          "amount": 0,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "type": "free"
                  }
              ],
              "slug": "hellobar",
              "current_status": "active",
              "plan_type": "free",
              "extension_id": "6232f7c538bac40085b874c5",
              "organization_id": "610d3a4595dcfae682408c07",
              "created_at": "2022-03-17T08:56:37.202Z",
              "modified_at": "2022-03-21T12:27:08.921Z",
              "organization": {
                  "name": "Social Icons Company",
                  "slug": "Social-asx-16"
              }
          },
          "organization": {
              "name": "Social Icons Company",
              "slug": "Social-asx-16"
          }
      },
      {
          "_id": "62445236d4cc749faccf213e",
          "description": "myntra-sujoy",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": false,
          "is_saleschannel": true,
          "scope": [
              "company/profile",
              "company/saleschannel",
              "company/product",
              "company/order",
              "company/application/customer",
              "company/application/analytics",
              "company/application/storage",
              "company/application/marketing",
              "company/application/catalogue",
              "company/application/communication",
              "company/application/support",
              "company/application/order",
              "company/application/settings"
          ],
          "name": "myntra-sujoy",
          "base_url": "https://myntra.extension.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/vrJwpxtMi-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/vrJwpxtMi-logo.png"
          },
          "callbacks": {
              "setup": "https://myntra.extension.fyndx0.de/fp/setup",
              "auth": "https://myntra.extension.fyndx0.de/fp/auth",
              "install": "https://myntra.extension.fyndx0.de/fp/install",
              "uninstall": "https://myntra.extension.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Piyush Org",
          "contact_email": "piyushvishwakarma@gofynd.com",
          "organization_id": "6111ec0095dcfac23e408dd1",
          "created_at": "2022-03-30T12:51:02.857Z",
          "modified_at": "2022-04-05T15:41:56.975Z",
          "__v": 0,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "6244555436ebaa1c0a806fca",
              "category": {
                  "categories_l1": [],
                  "categories_l2": []
              },
              "listing_info": {
                  "keywords": [],
                  "name": "myntra-sujoy",
                  "tagline": "myntra-sujoy",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/vrJwpxtMi-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/DIggRhbu6-desk-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/GgEWkKID7-desk-sc-2.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/SJxzAiPMF-desk-sc-3.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/sR0iVrGDO-mob-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/wXsAQC2-m-mob-sc-2.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/QIEIc_Q2u-mob-sc-3.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "6244555436ebaaac30806fcb",
                          "title": "feature",
                          "description": "description"
                      }
                  ],
                  "video_url": [],
                  "description": "myntra-sujoy",
                  "demo_url": ""
              },
              "contact_info": {
                  "support": {
                      "email": "piyushvishwakarma@gofynd.com",
                      "phone": "7208229699",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": false
              },
              "scope": [
                  "company/profile",
                  "company/saleschannel",
                  "company/product",
                  "company/order",
                  "company/application/customer",
                  "company/application/analytics",
                  "company/application/storage",
                  "company/application/marketing",
                  "company/application/catalogue",
                  "company/application/communication",
                  "company/application/support",
                  "company/application/order",
                  "company/application/settings"
              ],
              "plans": [
                  {
                      "name": "free",
                      "features": "free",
                      "type": "free",
                      "price": {
                          "amount": 0,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": ""
                  }
              ],
              "extension_id": "62445236d4cc749faccf213e",
              "slug": "myntra-sujoy",
              "plan_type": "free",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "6111ec0095dcfac23e408dd1",
              "created_at": "2022-03-30T13:04:20.837Z",
              "modified_at": "2022-03-30T13:04:20.837Z",
              "organization": {
                  "name": "Piyush Org",
                  "slug": "Piyush-ph2-25"
              }
          },
          "organization": {
              "name": "Piyush Org",
              "slug": "Piyush-ph2-25"
          }
      }
  ],
  "page": {
      "type": "number",
      "current": 1,
      "size": 10,
      "has_next": false,
      "item_total": 3
  }
}

module.exports.getExtensionInfo2 = {
  "items": [
      {
          "_id": "60be66a2d4cbbf1fd0a67c8c",
          "description": "",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "scope": [
              "company/saleschannel"
          ],
          "name": "newsletter-local Brijesh",
          "base_url": "https://newsletter-sub-008.loca.lt",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
          },
          "callbacks": {
              "setup": "https://newsletter-sub-008.loca.lt/fp/setup",
              "auth": "https://newsletter-sub-008.loca.lt/fp/auth",
              "install": "https://newsletter-sub-008.loca.lt/fp/install",
              "uninstall": "https://newsletter-sub-008.loca.lt/fp/uninstall"
          },
          "developed_by_name": "Social Icons Company",
          "contact_email": "brijeshgajjar@gofynd.com",
          "organization_id": "610d3a4595dcfae682408c07",
          "created_at": "2021-06-07T18:34:10.795Z",
          "modified_at": "2022-04-29T07:22:36.929Z",
          "__v": 0,
          "is_application_level": true,
          "is_saleschannel": false,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "626b92f7f36a77f7b0517b87",
              "category": {
                  "categories_l1": [],
                  "categories_l2": []
              },
              "listing_info": {
                  "keywords": [],
                  "name": "newsletter-local Brijesh",
                  "tagline": "test",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pX9zldCt8-desk-sc-1.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LvtKWCCZF-desk-sc-3.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pjqTQJKfF-desk-sc-3.jpeg"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/hJZfpuvZo-mob-sc-2.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/i2pysVdSu-mob-sc-3.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/u7sf_tXdN-mob-sc-3.jpeg"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "626b9420f36a773678517bbf",
                          "title": "Test",
                          "description": "test"
                      }
                  ],
                  "video_url": [],
                  "description": "<p>Test</p>",
                  "demo_url": ""
              },
              "contact_info": {
                  "support": {
                      "email": "brijeshgajjar@gofynd.com",
                      "phone": "8452996729",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": false
              },
              "scope": [
                  "company/saleschannel"
              ],
              "plans": [
                  {
                      "name": "Free",
                      "features": "test",
                      "type": "free",
                      "price": {
                          "amount": 0,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": ""
                  }
              ],
              "extension_id": "60be66a2d4cbbf1fd0a67c8c",
              "slug": "newsletter-local-brijesh",
              "plan_type": "free",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "610d3a4595dcfae682408c07",
              "created_at": "2022-04-29T07:25:43.514Z",
              "modified_at": "2022-04-29T07:30:40.646Z",
              "organization": {
                  "name": "Social Icons Company",
                  "slug": "Social-asx-16"
              }
          },
          "organization": {
              "name": "Social Icons Company",
              "slug": "Social-asx-16"
          }
      },
      {
          "_id": "610d2ad295dcfa14eb408bad",
          "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/saleschannel",
              "company/application/marketing"
          ],
          "name": "Bulk Coupons Generator",
          "base_url": "https://bulkcoupon.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png"
          },
          "callbacks": {
              "setup": "https://bulkcoupon.extensions.fyndx0.de/fp/setup",
              "auth": "https://bulkcoupon.extensions.fyndx0.de/fp/auth",
              "install": "https://bulkcoupon.extensions.fyndx0.de/fp/install",
              "uninstall": "https://bulkcoupon.extensions.fyndx0.de/fp/uninstall",
              "auto_install": "https://bulkcoupon.extensions.fyndx0.de/fp/auto_install"
          },
          "developed_by_name": "Rushabh Shah",
          "contact_email": "rushabhmshah@gofynd.com",
          "organization_id": "610d29f395dcfaba6b408ba6",
          "created_at": "2021-08-06T12:28:02.036Z",
          "modified_at": "2022-02-28T15:56:31.338Z",
          "__v": 0,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "621cf0c006962803b4cd780d",
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f44e",
                          "_id": "62320b45f4213eb19aa8f44e",
                          "slug": "merchandising"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f458",
                          "_id": "62320b45f4213eb19aa8f458",
                          "slug": "source-and-selling-product"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4e5",
                          "_id": "62320b45f4213eb19aa8f4e5",
                          "parent": "62320b45f4213eb19aa8f458",
                          "slug": "marketplace"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f480",
                          "_id": "62320b45f4213eb19aa8f480",
                          "parent": "62320b45f4213eb19aa8f44e",
                          "slug": "announcement-and-banner"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f486",
                          "_id": "62320b45f4213eb19aa8f486",
                          "parent": "62320b45f4213eb19aa8f44e",
                          "slug": "additional-purchase"
                      }
                  ]
              },
              "listing_info": {
                  "keywords": [],
                  "name": "Bulk Coupons Generator",
                  "tagline": "Test",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/fQ_yjdowj-desk-sc-1.jpeg"
                      ],
                      "mobile": []
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "621cf0c00696281d1dcd780e",
                          "title": "Test",
                          "description": "test"
                      }
                  ],
                  "video_url": [],
                  "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                  "demo_url": ""
              },
              "contact_info": {
                  "support": {
                      "email": "rushabhmshah@gofynd.com",
                      "phone": "9930630722",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": false
              },
              "scope": [
                  "company/saleschannel",
                  "company/application/marketing"
              ],
              "plans": [
                  {
                      "name": "Standard Plan",
                      "features": "Standard feature\nStandard feature\nStandard feature",
                      "type": "recurring",
                      "price": {
                          "amount": 99,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": "",
                      "recurring": {
                          "type": "month",
                          "recurring_time": 30,
                          "yearly_amount": 1188
                      }
                  },
                  {
                      "name": "Premium Plan",
                      "features": "Premium Feature\nPremium Feature\nPremium Feature",
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
              "extension_id": "610d2ad295dcfa14eb408bad",
              "slug": "bulk-coupons-generator",
              "plan_type": "recurring",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "610d29f395dcfaba6b408ba6",
              "created_at": "2022-02-28T15:56:48.806Z",
              "modified_at": "2022-03-21T12:27:08.714Z",
              "organization": {
                  "name": "Rushabh Shah",
                  "slug": "Rushab-omn-2"
              }
          },
          "organization": {
              "name": "Rushabh Shah",
              "slug": "Rushab-omn-2"
          }
      },
      {
          "_id": "61109c6795dcfa38cb408c70",
          "description": "Local tag manager",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": false,
          "is_saleschannel": false,
          "scope": [
              "company/saleschannel",
              "company/application/settings"
          ],
          "name": "Tag Manager Local",
          "base_url": "https://quiet-cow-22.loca.lt",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png"
          },
          "callbacks": {
              "setup": "https://quiet-cow-22.loca.lt/fp/setup",
              "auth": "https://quiet-cow-22.loca.lt/fp/auth",
              "install": "https://quiet-cow-22.loca.lt/fp/install",
              "uninstall": "https://quiet-cow-22.loca.lt/fp/uninstall"
          },
          "developed_by_name": "Akash Organization",
          "contact_email": "akashmane@gofynd.com",
          "organization_id": "6110967d95dcfaf485408c60",
          "created_at": "2021-08-09T03:09:27.392Z",
          "modified_at": "2021-09-09T04:40:50.398Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "61109ded41dc073111c38f59",
              "listing_info": {
                  "keywords": [],
                  "name": "Tag Manager Local",
                  "tagline": "Google Tag Manager",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/bNNRnl-IE-desk-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/P0IcHYNbA-desk-sc-2.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PlY2R2xgo-desk-sc-3.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/30gIT73MK-mob-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/XoAtVMhIn-mob-sc-2.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/XoAtVMhIn-mob-sc-2.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "61109ded41dc072bf4c38f5a",
                          "title": "Feature 1",
                          "description": "Description 1"
                      }
                  ],
                  "description": "Local tag manager",
                  "demo_url": "https://honest-rattlesnake-7.loca.lt/",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "akashmane@gofynd.com",
                      "phone": "8652523958",
                      "website_url": "https://honest-rattlesnake-7.loca.lt/",
                      "faq_url": "https://honest-rattlesnake-7.loca.lt/",
                      "privacy_policy_url": "https://honest-rattlesnake-7.loca.lt/"
                  }
              },
              "scope": [
                  "company/saleschannel",
                  "company/application/settings"
              ],
              "plans": [
                  {
                      "name": "Basic",
                      "features": "Basic ",
                      "type": "recurring",
                      "price": {
                          "amount": 99,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": "",
                      "recurring": {
                          "type": "month",
                          "recurring_time": 30,
                          "yearly_amount": 1188
                      }
                  }
              ],
              "extension_id": "61109c6795dcfa38cb408c70",
              "slug": "tag-manager-local",
              "plan_type": "recurring",
              "plans_url": "https://honest-rattlesnake-7.loca.lt/company/1/pricing",
              "current_status": "active",
              "organization_id": "6110967d95dcfaf485408c60",
              "created_at": "2021-08-09T03:15:57.074Z",
              "modified_at": "2022-03-21T12:27:06.809Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f45b",
                          "_id": "62320b45f4213eb19aa8f45b",
                          "slug": "inventory"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f45a",
                          "_id": "62320b45f4213eb19aa8f45a",
                          "slug": "customer-service"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4d9",
                          "_id": "62320b45f4213eb19aa8f4d9",
                          "parent": "62320b45f4213eb19aa8f45b",
                          "slug": "managing-inventory"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4d4",
                          "_id": "62320b45f4213eb19aa8f4d4",
                          "parent": "62320b45f4213eb19aa8f45a",
                          "slug": "support"
                      }
                  ]
              },
              "organization": {
                  "name": "Akash Organization",
                  "slug": "AkashO-2xk-98"
              }
          },
          "organization": {
              "name": "Akash Organization",
              "slug": "AkashO-2xk-98"
          }
      },
      {
          "_id": "6232f7c538bac40085b874c5",
          "description": "As an online marketer with a product that you believe in, nailing the art of converting site visitors into leads is going to have a huge impact on the success of your business. Well, Hellobar makes it possible!\n \n What's New\n • Business efforts will not be wasted\n • Keep customers engaged on your website",
          "whitelisted_urls": [],
          "ext_version": "1.0",
          "extention_type": "public",
          "is_application_level": false,
          "is_saleschannel": false,
          "scope": [
              "company/profile"
          ],
          "name": "Hellobar",
          "base_url": "https://localdev.fyndx0.de",
          "logo": {
              "large": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png",
              "small": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png"
          },
          "contact_email": "gauravkumarsharma@gofynd.com",
          "callbacks": {
              "auth": "https://localdev.fyndx0.de/fp/auth",
              "install": "https://localdev.fyndx0.de/fp/install",
              "setup": "https://localdev.fyndx0.de/fp/setup",
              "uninstall": "https://localdev.fyndx0.de/fp/uninstall"
          },
          "is_coming_soon": true,
          "organization_id": "610d3a4595dcfae682408c07",
          "created_at": "2022-03-17T08:56:37.174Z",
          "modified_at": "2022-03-17T08:56:37.174Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "6232f7c538bac40085b874c7",
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f458",
                          "_id": "62320b45f4213eb19aa8f458",
                          "slug": "source-and-selling-product"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4e5",
                          "_id": "62320b45f4213eb19aa8f4e5",
                          "parent": "62320b45f4213eb19aa8f458",
                          "slug": "marketplace"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4e1",
                          "_id": "62320b45f4213eb19aa8f4e1",
                          "parent": "62320b45f4213eb19aa8f458",
                          "slug": "dropshipping"
                      }
                  ]
              },
              "listing_info": {
                  "keywords": [],
                  "icon": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png",
                  "name": "Hellobar",
                  "tagline": "Use emphasized text as heading that sticks on your website"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/banner.png"
                      ],
                      "mobile": []
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "6232f7c538bac40085b874c8",
                          "title": "Guest To Customer Transition",
                          "description": "Effective headers will increase sign-ups"
                      },
                      {
                          "_id": "6232f7c538bac40085b874c9",
                          "title": "Create Leads For Marketing",
                          "description": "Fetch emails/contact numbers to boost business"
                      },
                      {
                          "_id": "6232f7c538bac40085b874ca",
                          "title": "Minimize Cart Rejection",
                          "description": "Encourages customer to buy items"
                      }
                  ],
                  "description": "As an online marketer with a product that you believe in, nailing the art of converting site visitors into leads is going to have a huge impact on the success of your business. Well, Hellobar makes it possible!\n \n \n <p>What's New\n \n\n\n \n <p>• Business efforts will not be wasted\n \n\n\n \n <p>• Keep customers engaged on your website",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "",
                      "phone": "",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": true
              },
              "scope": [
                  "company/profile"
              ],
              "plans": [
                  {
                      "additional_charges": "",
                      "features": "free plan features",
                      "name": "free",
                      "price": {
                          "amount": 0,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "type": "free"
                  }
              ],
              "slug": "hellobar",
              "current_status": "active",
              "plan_type": "free",
              "extension_id": "6232f7c538bac40085b874c5",
              "organization_id": "610d3a4595dcfae682408c07",
              "created_at": "2022-03-17T08:56:37.202Z",
              "modified_at": "2022-03-21T12:27:08.921Z",
              "organization": {
                  "name": "Social Icons Company",
                  "slug": "Social-asx-16"
              }
          },
          "organization": {
              "name": "Social Icons Company",
              "slug": "Social-asx-16"
          }
      }
  ],
  "page": {
      "type": "number",
      "current": 1,
      "size": 10,
      "has_next": false,
      "item_total": 4
  }
}

module.exports.getExtensionInfo3 = {
  "items": [
      {
          "_id": "61138cf895dcfa08a5408fc4",
          "description": "Newsletter local by aayush",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/saleschannel",
              "company/application/settings"
          ],
          "name": "Newsletter-Local-Aayush",
          "base_url": "https://example-javascript-001.loca.lt",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png"
          },
          "callbacks": {
              "setup": "https://example-javascript-001.loca.lt/fp/setup",
              "auth": "https://example-javascript-001.loca.lt/fp/auth",
              "install": "https://example-javascript-001.loca.lt/fp/install",
              "uninstall": "https://example-javascript-001.loca.lt/fp/uninstall"
          },
          "developed_by_name": "Fynd",
          "contact_email": "regrowth@gofynd.com",
          "organization_id": "610d178e2ab8f356aa98481b",
          "created_at": "2021-08-11T08:40:24.109Z",
          "modified_at": "2022-03-04T07:46:02.077Z",
          "__v": 0,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "6113c85841dc073aebc38f5f",
              "listing_info": {
                  "keywords": [],
                  "name": "Newsletter-Local-Aayush",
                  "tagline": "This is tagline for test2",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/cKylPAkW_-desk-sc-1.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LqwXrhZGR-mob-sc-1.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "6113c85841dc074febc38f60",
                          "title": "feature 1",
                          "description": "feature 1"
                      }
                  ],
                  "description": "Newsletter local by aayush",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "regrowth@gofynd.com",
                      "phone": "8767087087",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/saleschannel",
                  "company/application/settings"
              ],
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
              "extension_id": "61138cf895dcfa08a5408fc4",
              "slug": "newsletter-local-aayush",
              "plan_type": "free",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "610d178e2ab8f356aa98481b",
              "created_at": "2021-08-11T12:53:45.001Z",
              "modified_at": "2022-03-21T12:27:06.810Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f455",
                          "_id": "62320b45f4213eb19aa8f455",
                          "slug": "fulfillment"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4cb",
                          "_id": "62320b45f4213eb19aa8f4cb",
                          "parent": "62320b45f4213eb19aa8f455",
                          "slug": "managing-inventory-and-order"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4cd",
                          "_id": "62320b45f4213eb19aa8f4cd",
                          "parent": "62320b45f4213eb19aa8f455",
                          "slug": "managing-order"
                      }
                  ]
              },
              "organization": {
                  "name": "Fynd",
                  "slug": "Fynd-s8f-32"
              }
          },
          "organization": {
              "name": "Fynd",
              "slug": "Fynd-s8f-32"
          }
      },
      {
          "_id": "61155f5d95dcfad8294091c4",
          "description": "",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/profile",
              "company/product",
              "company/application/catalogue"
          ],
          "name": "Amazon Catalogue",
          "base_url": "https://amazon-ct.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png",
              "large": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png"
          },
          "callbacks": {
              "setup": "https://amazon-ct.extensions.fyndx0.de/fp/setup",
              "auth": "https://amazon-ct.extensions.fyndx0.de/fp/auth",
              "install": "https://amazon-ct.extensions.fyndx0.de/fp/install",
              "uninstall": "https://amazon-ct.extensions.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Piyush Org",
          "contact_email": "piyushvishwakarma@gofynd.com",
          "organization_id": "6111ec0095dcfac23e408dd1",
          "created_at": "2021-08-12T17:50:21.608Z",
          "modified_at": "2021-09-29T09:51:39.732Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "6149687d9e865808c8556baf",
              "listing_info": {
                  "keywords": [
                      "amazon"
                  ],
                  "name": "Amazon Catalogue",
                  "tagline": "Export products in Amazon compatible format",
                  "icon": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/KrryVoFfH-desk-sc-1.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/YDwSZsoiV-mob-sc-1.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "6149687d9e8658092e556bb0",
                          "title": "Catalogue Export",
                          "description": "Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager."
                      }
                  ],
                  "description": "<p>Your catalogue on Fynd Platform is readily usable on Facebook Commerce Manager. This app helps you transform your Fynd Platform catalogue into Facebook's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Facebook Commerce Manager to upload your products to Facebook Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Facebook marketplace to Fynd Platform using the exported CSV from Facebook Commerce Manager.</li>\n</ul>\n</li>\n</ul>",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "piyushvishwakarma@gofynd.com",
                      "phone": "7208229699",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/profile",
                  "company/product",
                  "company/application/catalogue"
              ],
              "plans": [
                  {
                      "name": "Premium",
                      "features": "Unlimited catalogue export   \nSchedule catalogue generation\nView export event history ",
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
              "extension_id": "61155f5d95dcfad8294091c4",
              "slug": "amazon-catalogue",
              "plan_type": "recurring",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "6111ec0095dcfac23e408dd1",
              "created_at": "2021-09-21T05:07:09.208Z",
              "modified_at": "2022-03-21T12:27:07.601Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f45a",
                          "_id": "62320b45f4213eb19aa8f45a",
                          "slug": "customer-service"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f45c",
                          "_id": "62320b45f4213eb19aa8f45c",
                          "slug": "channel-management"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4f4",
                          "_id": "62320b45f4213eb19aa8f4f4",
                          "parent": "62320b45f4213eb19aa8f45c",
                          "slug": "shipping-solution"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4e9",
                          "_id": "62320b45f4213eb19aa8f4e9",
                          "parent": "62320b45f4213eb19aa8f45c",
                          "slug": "channel-management-internalization"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4d6",
                          "_id": "62320b45f4213eb19aa8f4d6",
                          "parent": "62320b45f4213eb19aa8f45a",
                          "slug": "customer-account"
                      }
                  ]
              },
              "organization": {
                  "name": "Piyush Org",
                  "slug": "Piyush-ph2-25"
              }
          },
          "organization": {
              "name": "Piyush Org",
              "slug": "Piyush-ph2-25"
          }
      },
      {
          "_id": "6116026a95dcfa05eb4091e3",
          "description": "xyz",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": false,
          "is_saleschannel": true,
          "scope": [
              "company/profile",
              "company/saleschannel",
              "company/product",
              "company/order",
              "company/application/customer",
              "company/application/analytics",
              "company/application/storage",
              "company/application/marketing",
              "company/application/catalogue",
              "company/application/communication",
              "company/application/support",
              "company/application/order",
              "company/application/settings"
          ],
          "name": "APK ",
          "base_url": "https://4a2f-49-204-113-86.ngrok.io",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png"
          },
          "callbacks": {
              "setup": "https://4a2f-49-204-113-86.ngrok.io/fp/setup",
              "auth": "https://4a2f-49-204-113-86.ngrok.io/fp/auth",
              "install": "https://4a2f-49-204-113-86.ngrok.io/fp/install",
              "uninstall": "https://4a2f-49-204-113-86.ngrok.io/fp/uninstall"
          },
          "developed_by_name": "Apk Extension",
          "contact_email": "venkhatesharunachalam@gofynd.com",
          "organization_id": "6116013e95dcfa31f64091dc",
          "created_at": "2021-08-13T05:26:02.843Z",
          "modified_at": "2022-02-08T06:08:32.675Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "61160b0041dc073a0fc38f61",
              "listing_info": {
                  "keywords": [],
                  "name": "APK ",
                  "tagline": "Downloadable apk",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/ld0bkv7uE-desk-sc-1.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/haYr70MB6-desk-sc-2.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/1ywtXQaRo-desk-sc-3.jpeg"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/WsLyDAES9-mob-sc-1.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/akmpv_h_V-mob-sc-2.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Rw60j7I5r-mob-sc-3.jpeg"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "61262f2ebec3d618918f7561",
                          "title": "APk ",
                          "description": "test"
                      }
                  ],
                  "description": "xyz",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "venkhatesharunachalam@gofynd.com",
                      "phone": "8369903075",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/profile",
                  "company/saleschannel",
                  "company/product",
                  "company/order",
                  "company/application/customer",
                  "company/application/analytics",
                  "company/application/storage",
                  "company/application/marketing",
                  "company/application/catalogue",
                  "company/application/communication",
                  "company/application/support",
                  "company/application/order",
                  "company/application/settings"
              ],
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
              "extension_id": "6116026a95dcfa05eb4091e3",
              "slug": "apk",
              "plan_type": "free",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "6116013e95dcfa31f64091dc",
              "created_at": "2021-08-13T06:02:40.313Z",
              "modified_at": "2022-03-21T12:27:06.810Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f447",
                          "_id": "62320b45f4213eb19aa8f447",
                          "slug": "conversion"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f44e",
                          "_id": "62320b45f4213eb19aa8f44e",
                          "slug": "merchandising"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f47a",
                          "_id": "62320b45f4213eb19aa8f47a",
                          "parent": "62320b45f4213eb19aa8f447",
                          "slug": "cart-modification"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f480",
                          "_id": "62320b45f4213eb19aa8f480",
                          "parent": "62320b45f4213eb19aa8f44e",
                          "slug": "announcement-and-banner"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f479",
                          "_id": "62320b45f4213eb19aa8f479",
                          "parent": "62320b45f4213eb19aa8f447",
                          "slug": "customer-feedback"
                      }
                  ]
              },
              "organization": {
                  "name": "Strikers",
                  "slug": "ApkExt-ze8-72"
              }
          },
          "organization": {
              "name": "Strikers",
              "slug": "ApkExt-ze8-72"
          }
      },
      {
          "_id": "611624ac95dcfa262740920e",
          "description": "Android App Builder",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/profile",
              "company/saleschannel",
              "company/product",
              "company/order",
              "company/application/customer",
              "company/application/analytics",
              "company/application/storage",
              "company/application/marketing",
              "company/application/catalogue",
              "company/application/communication",
              "company/application/support",
              "company/application/order",
              "company/application/settings"
          ],
          "name": "App Builder",
          "base_url": "https://android-app-builder.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9nrhvtx7s-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9nrhvtx7s-logo.png"
          },
          "callbacks": {
              "setup": "https://android-app-builder.extensions.fyndx0.de/fp/setup",
              "auth": "https://android-app-builder.extensions.fyndx0.de/fp/auth",
              "install": "https://android-app-builder.extensions.fyndx0.de/fp/install",
              "uninstall": "https://android-app-builder.extensions.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Apk Extension",
          "contact_email": "venkhatesharunachalam@gofynd.com",
          "organization_id": "6116013e95dcfa31f64091dc",
          "created_at": "2021-08-13T07:52:12.323Z",
          "modified_at": "2022-04-18T07:23:43.379Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "61e52b2d2573dc50d8eb3e5b",
              "listing_info": {
                  "keywords": [
                      "app",
                      "android"
                  ],
                  "name": "App Builder",
                  "tagline": "App for your e-commerce website",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9nrhvtx7s-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/7u47o-l7y-desk-sc-1.png"
                      ],
                      "mobile": []
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "61e52b2d2573dc0241eb3e5c",
                          "title": "Create App for your Fynd Platform website",
                          "description": "Create App for your Fynd Platform website"
                      }
                  ],
                  "video_url": [],
                  "description": "<p>App Builder for your Fynd Platform website</p>",
                  "demo_url": ""
              },
              "contact_info": {
                  "support": {
                      "email": "venkhatesharunachalam@gofynd.com",
                      "phone": "8369903075",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0
              },
              "scope": [
                  "company/profile",
                  "company/saleschannel",
                  "company/product",
                  "company/order",
                  "company/application/customer",
                  "company/application/analytics",
                  "company/application/storage",
                  "company/application/marketing",
                  "company/application/catalogue",
                  "company/application/communication",
                  "company/application/support",
                  "company/application/order",
                  "company/application/settings"
              ],
              "plans": [
                  {
                      "name": "Monthly",
                      "features": "Android App",
                      "type": "recurring",
                      "price": {
                          "amount": 149,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": "",
                      "recurring": {
                          "type": "month",
                          "recurring_time": 30,
                          "yearly_amount": 1788
                      }
                  },
                  {
                      "name": "Yearly",
                      "features": "Android App",
                      "type": "recurring",
                      "price": {
                          "amount": 1499,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": "",
                      "recurring": {
                          "type": "year",
                          "recurring_time": 365,
                          "yearly_amount": 0
                      }
                  }
              ],
              "extension_id": "611624ac95dcfa262740920e",
              "slug": "app-builder",
              "plan_type": "recurring",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "6116013e95dcfa31f64091dc",
              "created_at": "2022-01-17T08:39:09.184Z",
              "modified_at": "2022-03-21T12:27:07.911Z",
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f44c",
                          "_id": "62320b45f4213eb19aa8f44c",
                          "slug": "marketing"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f45b",
                          "_id": "62320b45f4213eb19aa8f45b",
                          "slug": "inventory"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4d9",
                          "_id": "62320b45f4213eb19aa8f4d9",
                          "parent": "62320b45f4213eb19aa8f45b",
                          "slug": "managing-inventory"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4a4",
                          "_id": "62320b45f4213eb19aa8f4a4",
                          "parent": "62320b45f4213eb19aa8f44c",
                          "slug": "email-and-sms-marketing"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f48b",
                          "_id": "62320b45f4213eb19aa8f48b",
                          "parent": "62320b45f4213eb19aa8f44c",
                          "slug": "notification"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4a7",
                          "_id": "62320b45f4213eb19aa8f4a7",
                          "parent": "62320b45f4213eb19aa8f44c",
                          "slug": "page-enhancement"
                      }
                  ]
              },
              "organization": {
                  "name": "Strikers",
                  "slug": "ApkExt-ze8-72"
              }
          },
          "organization": {
              "name": "Strikers",
              "slug": "ApkExt-ze8-72"
          }
      }
  ],
  "page": {
      "type": "number",
      "current": 1,
      "size": 10,
      "has_next": false,
      "item_total": 4
  }
}

module.exports.getExtensionInfo4 = {
  "items": [
      {
          "_id": "609400409d0dcbdc2e6b76a5",
          "description": "Newsletter Subscription\nNewsletter Subscription",
          "whitelisted_urls": [],
          "ext_version": "1.0",
          "extention_type": "public",
          "scope": [
              "company/saleschannel",
              "company/application/settings"
          ],
          "name": "Newsletter Subscription",
          "base_url": "https://newsletter.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
          },
          "callbacks": {
              "setup": "https://newsletter.extensions.fyndx0.de/fp/setup",
              "auth": "https://newsletter.extensions.fyndx0.de/fp/auth",
              "install": "https://newsletter.extensions.fyndx0.de/fp/install",
              "uninstall": "https://newsletter.extensions.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Fynd",
          "contact_email": "brijeshgajjar@gofynd.com",
          "organization_id": "610d178e2ab8f356aa98481b",
          "created_at": "2021-05-06T14:42:08.318Z",
          "modified_at": "2022-02-09T06:54:58.104Z",
          "__v": 2,
          "is_application_level": true,
          "is_saleschannel": false,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "60bf7f734fe0a3c8e90e5b83",
              "listing_info": {
                  "keywords": [],
                  "name": "Newsletter Subscription",
                  "tagline": "dsvsv",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nKlrV_01V-desk-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/UZ0zmE2sW-desk-sc-2.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/cGtO7qpge-desk-sc-3.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/10Twf0N0R-mob-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/CRHrGZf5n-mob-sc-2.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nDsWxx2rB-mob-sc-3.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "623db9405ce44ba088b9c5bc",
                          "title": "dsvsv",
                          "description": "dvssdvdvdv"
                      }
                  ],
                  "description": "<p>Now you can run referral campaigns that lets you and your existing customers refer their friends and family to register on your website.<br /><br />Features<br />&bull; Configure reward for the referrer<br />&bull; Configure reward for the one being referred<br />&bull; Set validity of referral and the reward<br />&bull; Enable/Disable referral campaigns</p>",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "aayushvjain@gofynd.com",
                      "phone": "8767087087",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/saleschannel",
                  "company/application/settings"
              ],
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
              "extension_id": "609400409d0dcbdc2e6b76a5",
              "slug": "newsletter-subscription",
              "plan_type": "free",
              "current_status": "active",
              "organization_id": "610d178e2ab8f356aa98481b",
              "created_at": "2021-06-08T14:32:19.574Z",
              "modified_at": "2022-03-25T12:44:48.325Z",
              "plans_url": "",
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": false
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f44c",
                          "slug": "marketing",
                          "_id": "62320b45f4213eb19aa8f44c"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4aa",
                          "slug": "advertisement",
                          "_id": "62320b45f4213eb19aa8f4aa",
                          "parent": "62320b45f4213eb19aa8f44c"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4c6",
                          "slug": "marketing-analytics",
                          "_id": "62320b45f4213eb19aa8f4c6",
                          "parent": "62320b45f4213eb19aa8f44c"
                      }
                  ]
              },
              "organization": {
                  "name": "Fynd",
                  "slug": "Fynd-s8f-32"
              }
          },
          "organization": {
              "name": "Fynd",
              "slug": "Fynd-s8f-32"
          }
      },
      {
          "_id": "60be66a2d4cbbf1fd0a67c8c",
          "description": "",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "scope": [
              "company/saleschannel"
          ],
          "name": "newsletter-local Brijesh",
          "base_url": "https://newsletter-sub-008.loca.lt",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
          },
          "callbacks": {
              "setup": "https://newsletter-sub-008.loca.lt/fp/setup",
              "auth": "https://newsletter-sub-008.loca.lt/fp/auth",
              "install": "https://newsletter-sub-008.loca.lt/fp/install",
              "uninstall": "https://newsletter-sub-008.loca.lt/fp/uninstall"
          },
          "developed_by_name": "Social Icons Company",
          "contact_email": "brijeshgajjar@gofynd.com",
          "organization_id": "610d3a4595dcfae682408c07",
          "created_at": "2021-06-07T18:34:10.795Z",
          "modified_at": "2022-04-29T07:22:36.929Z",
          "__v": 0,
          "is_application_level": true,
          "is_saleschannel": false,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "626b92f7f36a77f7b0517b87",
              "category": {
                  "categories_l1": [],
                  "categories_l2": []
              },
              "listing_info": {
                  "keywords": [],
                  "name": "newsletter-local Brijesh",
                  "tagline": "test",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pX9zldCt8-desk-sc-1.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LvtKWCCZF-desk-sc-3.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pjqTQJKfF-desk-sc-3.jpeg"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/hJZfpuvZo-mob-sc-2.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/i2pysVdSu-mob-sc-3.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/u7sf_tXdN-mob-sc-3.jpeg"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "626b9420f36a773678517bbf",
                          "title": "Test",
                          "description": "test"
                      }
                  ],
                  "video_url": [],
                  "description": "<p>Test</p>",
                  "demo_url": ""
              },
              "contact_info": {
                  "support": {
                      "email": "brijeshgajjar@gofynd.com",
                      "phone": "8452996729",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": false
              },
              "scope": [
                  "company/saleschannel"
              ],
              "plans": [
                  {
                      "name": "Free",
                      "features": "test",
                      "type": "free",
                      "price": {
                          "amount": 0,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": ""
                  }
              ],
              "extension_id": "60be66a2d4cbbf1fd0a67c8c",
              "slug": "newsletter-local-brijesh",
              "plan_type": "free",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "610d3a4595dcfae682408c07",
              "created_at": "2022-04-29T07:25:43.514Z",
              "modified_at": "2022-04-29T07:30:40.646Z",
              "organization": {
                  "name": "Social Icons Company",
                  "slug": "Social-asx-16"
              }
          },
          "organization": {
              "name": "Social Icons Company",
              "slug": "Social-asx-16"
          }
      },
      {
          "_id": "610d2ad295dcfa14eb408bad",
          "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/saleschannel",
              "company/application/marketing"
          ],
          "name": "Bulk Coupons Generator",
          "base_url": "https://bulkcoupon.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png"
          },
          "callbacks": {
              "setup": "https://bulkcoupon.extensions.fyndx0.de/fp/setup",
              "auth": "https://bulkcoupon.extensions.fyndx0.de/fp/auth",
              "install": "https://bulkcoupon.extensions.fyndx0.de/fp/install",
              "uninstall": "https://bulkcoupon.extensions.fyndx0.de/fp/uninstall",
              "auto_install": "https://bulkcoupon.extensions.fyndx0.de/fp/auto_install"
          },
          "developed_by_name": "Rushabh Shah",
          "contact_email": "rushabhmshah@gofynd.com",
          "organization_id": "610d29f395dcfaba6b408ba6",
          "created_at": "2021-08-06T12:28:02.036Z",
          "modified_at": "2022-02-28T15:56:31.338Z",
          "__v": 0,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "621cf0c006962803b4cd780d",
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f44e",
                          "_id": "62320b45f4213eb19aa8f44e",
                          "slug": "merchandising"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f458",
                          "_id": "62320b45f4213eb19aa8f458",
                          "slug": "source-and-selling-product"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4e5",
                          "_id": "62320b45f4213eb19aa8f4e5",
                          "parent": "62320b45f4213eb19aa8f458",
                          "slug": "marketplace"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f480",
                          "_id": "62320b45f4213eb19aa8f480",
                          "parent": "62320b45f4213eb19aa8f44e",
                          "slug": "announcement-and-banner"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f486",
                          "_id": "62320b45f4213eb19aa8f486",
                          "parent": "62320b45f4213eb19aa8f44e",
                          "slug": "additional-purchase"
                      }
                  ]
              },
              "listing_info": {
                  "keywords": [],
                  "name": "Bulk Coupons Generator",
                  "tagline": "Test",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/fQ_yjdowj-desk-sc-1.jpeg"
                      ],
                      "mobile": []
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "621cf0c00696281d1dcd780e",
                          "title": "Test",
                          "description": "test"
                      }
                  ],
                  "video_url": [],
                  "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                  "demo_url": ""
              },
              "contact_info": {
                  "support": {
                      "email": "rushabhmshah@gofynd.com",
                      "phone": "9930630722",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": false
              },
              "scope": [
                  "company/saleschannel",
                  "company/application/marketing"
              ],
              "plans": [
                  {
                      "name": "Standard Plan",
                      "features": "Standard feature\nStandard feature\nStandard feature",
                      "type": "recurring",
                      "price": {
                          "amount": 99,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": "",
                      "recurring": {
                          "type": "month",
                          "recurring_time": 30,
                          "yearly_amount": 1188
                      }
                  },
                  {
                      "name": "Premium Plan",
                      "features": "Premium Feature\nPremium Feature\nPremium Feature",
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
              "extension_id": "610d2ad295dcfa14eb408bad",
              "slug": "bulk-coupons-generator",
              "plan_type": "recurring",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "610d29f395dcfaba6b408ba6",
              "created_at": "2022-02-28T15:56:48.806Z",
              "modified_at": "2022-03-21T12:27:08.714Z",
              "organization": {
                  "name": "Rushabh Shah",
                  "slug": "Rushab-omn-2"
              }
          },
          "organization": {
              "name": "Rushabh Shah",
              "slug": "Rushab-omn-2"
          }
      }
  ],
  "page": {
      "type": "number",
      "current": 1,
      "size": 10,
      "has_next": false,
      "item_total": 3
  }
}

module.exports.getCollectionDetails = {
  "items": [
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/o9UhZ5Em6-logo.jpeg",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/dU3kXnGwR-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the"
          },
          "tags": [
              "asdsa",
              "asdas",
              "my"
          ],
          "published": false,
          "_id": "623847d0ec3c4b10b1f5fed6",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "New Extension collection",
          "description": "fdsdssdasdsdsd d d sddas dsd sd d",
          "slug": "new-extension-collection",
          "__v": 0,
          "created_at": "2022-06-02T15:24:26.203Z",
          "modified_at": "2022-06-02T15:24:26.203Z"
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/q7Ex7-oAT-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/HCrbg2uGD-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/0cyP63leb-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the"
          },
          "tags": [
              "adsa",
              "dsad",
              "asdas"
          ],
          "published": true,
          "_id": "62384f66ec3c4b4e6ff5fee6",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "NEW ONE",
          "description": "sadasdasd",
          "slug": "new-one",
          "__v": 0,
          "created_at": "2022-06-01T08:19:13.070Z",
          "modified_at": "2022-06-01T08:19:13.070Z"
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/lOyFu1NjT-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LLbfmTiyf-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/1hvSt917P-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the collection"
          },
          "tags": [
              "dfg"
          ],
          "published": true,
          "_id": "625fe7c726e867d85730af1a",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "Test3",
          "description": "gdfdfd",
          "slug": "qwer-tyui-tyu",
          "__v": 0,
          "created_at": "2022-06-08T09:49:38.324Z",
          "modified_at": "2022-06-08T09:49:38.324Z"
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/IcaJe8Jty-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Pkucz2J8n-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/JdOFjaPIr-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the collection"
          },
          "tags": [],
          "published": true,
          "_id": "627ba8371171f7705212333b",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "sands odsoic ",
          "description": "dd ",
          "slug": "sands-odsoic",
          "__v": 0
      }
  ],
  "page": {
      "type": "number",
      "current": 1,
      "size": 10,
      "item_total": 4,
      "has_next": false
  }
}

module.exports.putPayload = {
  "_id": "62a97b0fd55336002dbfb789",
  "custom_meta": [],
  "name": "Extension Home",
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
          "page_type": "extension",
          "type": "extension_item_list",
          "item_type": "extension",
          "data": {
              "heading": "Heading",
              "title": "Title",
              "subtitle": "Subtitle",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "api_source": "extension_latest",
              "extension": [
                  "62445236d4cc749faccf213e",
                  "6232f7c538bac40085b874c5",
                  "61155f5d95dcfad8294091c4"
              ]
          },
          "items": [
              {
                  "value": "62445236d4cc749faccf213e"
              },
              {
                  "value": "6232f7c538bac40085b874c5"
              },
              {
                  "value": "61155f5d95dcfad8294091c4"
              }
          ]
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
          "type": "banner",
          "page_type": "all",
          "data": {
              "heading": "Fynd Extensions",
              "title": "Skyrocket your business experience using extensions",
              "subtitle": "Boost the capability of Fynd Platform using extensions created specially for the merchant community",
              "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png",
              "image_position": "right",
              "button_label": "View All Extensions",
              "button_page_link": "Extensions List"
          },
          "items": []
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
          "page_type": "all",
          "type": "collection_grid",
          "data": {
              "heading": "Collections",
              "title": "Latest",
              "subtitle": "Subtitle",
              "button_label": "View",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "collection": [
                  "623847d0ec3c4b10b1f5fed6",
                  "627ba8371171f7705212333b",
                  "62384f66ec3c4b4e6ff5fee6",
                  "625fe7c726e867d85730af1a"
              ]
          },
          "item_type": "collection",
          "items": [
              {
                  "value": "623847d0ec3c4b10b1f5fed6"
              },
              {
                  "value": "627ba8371171f7705212333b"
              },
              {
                  "value": "62384f66ec3c4b4e6ff5fee6"
              },
              {
                  "value": "625fe7c726e867d85730af1a"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_grid",
          "data": {
              "heading": "Latest Extensions",
              "title": "Extensions",
              "subtitle": "Latest Extensions",
              "button_label": "View All",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "extension": [
                  "60be66a2d4cbbf1fd0a67c8c",
                  "610d2ad295dcfa14eb408bad",
                  "61109c6795dcfa38cb408c70",
                  "6232f7c538bac40085b874c5"
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "60be66a2d4cbbf1fd0a67c8c"
              },
              {
                  "value": "610d2ad295dcfa14eb408bad"
              },
              {
                  "value": "61109c6795dcfa38cb408c70"
              },
              {
                  "value": "6232f7c538bac40085b874c5"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_item_list",
          "data": {
              "heading": "NEW! NEW!",
              "title": "New Extensions",
              "subtitle": "Subtitle",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "api_source": "extension_latest",
              "extension": [
                  "611624ac95dcfa262740920e",
                  "6116026a95dcfa05eb4091e3",
                  "61155f5d95dcfad8294091c4",
                  "61138cf895dcfa08a5408fc4"
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "611624ac95dcfa262740920e"
              },
              {
                  "value": "6116026a95dcfa05eb4091e3"
              },
              {
                  "value": "61155f5d95dcfad8294091c4"
              },
              {
                  "value": "61138cf895dcfa08a5408fc4"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_grid",
          "data": {
              "heading": "TOP FREE",
              "title": "Free extensions for you",
              "subtitle": "to to install",
              "button_label": "View All",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "extension": [
                  "60be66a2d4cbbf1fd0a67c8c",
                  "609400409d0dcbdc2e6b76a5",
                  "610d2ad295dcfa14eb408bad"
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "60be66a2d4cbbf1fd0a67c8c"
              },
              {
                  "value": "609400409d0dcbdc2e6b76a5"
              },
              {
                  "value": "610d2ad295dcfa14eb408bad"
              }
          ]
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
          "page_type": "extension",
          "type": "category_item_list",
          "data": {
              "heading": "H",
              "title": "T",
              "subtitle": "ST",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "category": [
                  "629461b2e6bf3c5f04e4f63d",
                  "629461b2e6bf3c5f04e4f64a",
                  "629461b2e6bf3c5f04e4f646"
              ]
          },
          "item_type": "category",
          "items": [
              {
                  "value": "629461b2e6bf3c5f04e4f63d"
              },
              {
                  "value": "629461b2e6bf3c5f04e4f64a"
              },
              {
                  "value": "629461b2e6bf3c5f04e4f646"
              }
          ]
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
          "page_type": "all",
          "type": "banner",
          "data": {
              "heading": "Banner",
              "title": "Banner",
              "subtitle": "Banner Subtitle",
              "image": "https://hdn-1.addsale.com/x0/platform/pictures/partner-feature-image/original/_APcxzEiu-BSUMhjxhp-8OGhZsCWy-extension-image-1655268946947.jpeg",
              "image_position": "right",
              "button_label": "Gheun Taak",
              "button_page_link": "Extensions List"
          },
          "items": []
      }
  ],
  "props": [],
  "modified_at": "2022-06-15T14:05:02.494Z",
  "__v": 28,
  "value": "extension-home",
  "text": "Extension Home"
}

module.exports.putResponse = {
  "custom_meta": [],
  "_id": "62a97b0fd55336002dbfb789",
  "name": "Extension Home",
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
          "page_type": "extension",
          "type": "extension_item_list",
          "item_type": "extension",
          "data": {
              "heading": "Heading",
              "title": "Title",
              "subtitle": "Subtitle",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "api_source": "extension_latest",
              "extension": [
                  "62445236d4cc749faccf213e",
                  "6232f7c538bac40085b874c5",
                  "61155f5d95dcfad8294091c4"
              ]
          },
          "items": [
              {
                  "value": "62445236d4cc749faccf213e"
              },
              {
                  "value": "6232f7c538bac40085b874c5"
              },
              {
                  "value": "61155f5d95dcfad8294091c4"
              }
          ]
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
          "type": "banner",
          "page_type": "all",
          "data": {
              "heading": "Fynd Extensions",
              "title": "Skyrocket your business experience using extensions",
              "subtitle": "Boost the capability of Fynd Platform using extensions created specially for the merchant community",
              "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png",
              "image_position": "right",
              "button_label": "View All Extensions",
              "button_page_link": "Extensions List"
          },
          "items": []
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
          "page_type": "all",
          "type": "collection_grid",
          "data": {
              "heading": "Collections",
              "title": "Latest",
              "subtitle": "Subtitle",
              "button_label": "View",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "collection": [
                  "623847d0ec3c4b10b1f5fed6",
                  "627ba8371171f7705212333b",
                  "62384f66ec3c4b4e6ff5fee6",
                  "625fe7c726e867d85730af1a"
              ]
          },
          "item_type": "collection",
          "items": [
              {
                  "value": "623847d0ec3c4b10b1f5fed6"
              },
              {
                  "value": "627ba8371171f7705212333b"
              },
              {
                  "value": "62384f66ec3c4b4e6ff5fee6"
              },
              {
                  "value": "625fe7c726e867d85730af1a"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_grid",
          "data": {
              "heading": "Latest Extensions",
              "title": "Extensions",
              "subtitle": "Latest Extensions",
              "button_label": "View All",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "extension": [
                  "60be66a2d4cbbf1fd0a67c8c",
                  "610d2ad295dcfa14eb408bad",
                  "61109c6795dcfa38cb408c70",
                  "6232f7c538bac40085b874c5"
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "60be66a2d4cbbf1fd0a67c8c"
              },
              {
                  "value": "610d2ad295dcfa14eb408bad"
              },
              {
                  "value": "61109c6795dcfa38cb408c70"
              },
              {
                  "value": "6232f7c538bac40085b874c5"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_item_list",
          "data": {
              "heading": "NEW! NEW!",
              "title": "New Extensions",
              "subtitle": "Subtitle",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "api_source": "extension_latest",
              "extension": [
                  "611624ac95dcfa262740920e",
                  "6116026a95dcfa05eb4091e3",
                  "61155f5d95dcfad8294091c4",
                  "61138cf895dcfa08a5408fc4"
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "611624ac95dcfa262740920e"
              },
              {
                  "value": "6116026a95dcfa05eb4091e3"
              },
              {
                  "value": "61155f5d95dcfad8294091c4"
              },
              {
                  "value": "61138cf895dcfa08a5408fc4"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_grid",
          "data": {
              "heading": "TOP FREE",
              "title": "Free extensions for you",
              "subtitle": "to to install",
              "button_label": "View All",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "extension": [
                  "60be66a2d4cbbf1fd0a67c8c",
                  "609400409d0dcbdc2e6b76a5",
                  "610d2ad295dcfa14eb408bad"
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "60be66a2d4cbbf1fd0a67c8c"
              },
              {
                  "value": "609400409d0dcbdc2e6b76a5"
              },
              {
                  "value": "610d2ad295dcfa14eb408bad"
              }
          ]
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
          "page_type": "extension",
          "type": "category_item_list",
          "data": {
              "heading": "H",
              "title": "T",
              "subtitle": "ST",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "category": [
                  "629461b2e6bf3c5f04e4f63d",
                  "629461b2e6bf3c5f04e4f64a",
                  "629461b2e6bf3c5f04e4f646"
              ]
          },
          "item_type": "category",
          "items": [
              {
                  "value": "629461b2e6bf3c5f04e4f63d"
              },
              {
                  "value": "629461b2e6bf3c5f04e4f64a"
              },
              {
                  "value": "629461b2e6bf3c5f04e4f646"
              }
          ]
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
          "page_type": "all",
          "type": "banner",
          "data": {
              "heading": "Banner",
              "title": "Banner",
              "subtitle": "Banner Subtitle",
              "image": "https://hdn-1.addsale.com/x0/platform/pictures/partner-feature-image/original/_APcxzEiu-BSUMhjxhp-8OGhZsCWy-extension-image-1655268946947.jpeg",
              "image_position": "right",
              "button_label": "Gheun Taak",
              "button_page_link": "Extensions List"
          },
          "items": []
      }
  ],
  "props": [],
  "modified_at": "2022-06-15T14:05:02.494Z",
  "__v": 28,
  "created_at": "2022-06-15T06:24:15.426Z"
}

module.exports.saveEventObj = {
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
          "page_type": "extension",
          "type": "extension_item_list",
          "item_type": "extension",
          "data": {
              "heading": "Heading",
              "title": "Title",
              "subtitle": "Subtitle",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "api_source": "extension_latest",
              "extension": [
                  "62445236d4cc749faccf213e",
                  "6232f7c538bac40085b874c5",
                  "61155f5d95dcfad8294091c4"
              ],
              "extension_details": [
                  {
                      "_id": "62445236d4cc749faccf213e",
                      "description": "myntra-sujoy",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "is_application_level": false,
                      "is_saleschannel": true,
                      "scope": [
                          "company/profile",
                          "company/saleschannel",
                          "company/product",
                          "company/order",
                          "company/application/customer",
                          "company/application/analytics",
                          "company/application/storage",
                          "company/application/marketing",
                          "company/application/catalogue",
                          "company/application/communication",
                          "company/application/support",
                          "company/application/order",
                          "company/application/settings"
                      ],
                      "name": "myntra-sujoy",
                      "base_url": "https://myntra.extension.fyndx0.de",
                      "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/vrJwpxtMi-logo.png",
                      "callbacks": {
                          "setup": "https://myntra.extension.fyndx0.de/fp/setup",
                          "auth": "https://myntra.extension.fyndx0.de/fp/auth",
                          "install": "https://myntra.extension.fyndx0.de/fp/install",
                          "uninstall": "https://myntra.extension.fyndx0.de/fp/uninstall"
                      },
                      "developed_by_name": "Piyush Org",
                      "contact_email": "piyushvishwakarma@gofynd.com",
                      "organization_id": "6111ec0095dcfac23e408dd1",
                      "created_at": "2022-03-30T12:51:02.857Z",
                      "modified_at": "2022-04-05T15:41:56.975Z",
                      "__v": 0,
                      "is_coming_soon": false,
                      "extension_public_data": {
                          "_id": "6244555436ebaa1c0a806fca",
                          "category": {
                              "categories_l1": [],
                              "categories_l2": []
                          },
                          "listing_info": {
                              "keywords": [],
                              "name": "myntra-sujoy",
                              "tagline": "myntra-sujoy",
                              "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/vrJwpxtMi-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/DIggRhbu6-desk-sc-1.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/GgEWkKID7-desk-sc-2.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/SJxzAiPMF-desk-sc-3.png"
                                  ],
                                  "mobile": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/sR0iVrGDO-mob-sc-1.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/wXsAQC2-m-mob-sc-2.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/QIEIc_Q2u-mob-sc-3.png"
                                  ]
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "6244555436ebaaac30806fcb",
                                      "title": "feature",
                                      "description": "description"
                                  }
                              ],
                              "video_url": [],
                              "description": "myntra-sujoy",
                              "demo_url": ""
                          },
                          "contact_info": {
                              "support": {
                                  "email": "piyushvishwakarma@gofynd.com",
                                  "phone": "7208229699",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "coming_soon": {
                              "upvote_count": 0,
                              "is_coming_soon": false
                          },
                          "scope": [
                              "company/profile",
                              "company/saleschannel",
                              "company/product",
                              "company/order",
                              "company/application/customer",
                              "company/application/analytics",
                              "company/application/storage",
                              "company/application/marketing",
                              "company/application/catalogue",
                              "company/application/communication",
                              "company/application/support",
                              "company/application/order",
                              "company/application/settings"
                          ],
                          "plans": [
                              {
                                  "name": "free",
                                  "features": "free",
                                  "type": "free",
                                  "price": {
                                      "amount": 0,
                                      "currency": "INR"
                                  },
                                  "trial_days": 0,
                                  "additional_charges": ""
                              }
                          ],
                          "extension_id": "62445236d4cc749faccf213e",
                          "slug": "myntra-sujoy",
                          "plan_type": "free",
                          "plans_url": "",
                          "current_status": "active",
                          "organization_id": "6111ec0095dcfac23e408dd1",
                          "created_at": "2022-03-30T13:04:20.837Z",
                          "modified_at": "2022-03-30T13:04:20.837Z",
                          "organization": {
                              "name": "Piyush Org",
                              "slug": "Piyush-ph2-25"
                          }
                      },
                      "organization": {
                          "name": "Piyush Org",
                          "slug": "Piyush-ph2-25"
                      },
                      "text": "myntra-sujoy",
                      "value": "62445236d4cc749faccf213e",
                      "label": "Extensions"
                  },
                  {
                      "_id": "6232f7c538bac40085b874c5",
                      "description": "As an online marketer with a product that you believe in, nailing the art of converting site visitors into leads is going to have a huge impact on the success of your business. Well, Hellobar makes it possible!\n \n What's New\n • Business efforts will not be wasted\n • Keep customers engaged on your website",
                      "whitelisted_urls": [],
                      "ext_version": "1.0",
                      "extention_type": "public",
                      "is_application_level": false,
                      "is_saleschannel": false,
                      "scope": [
                          "company/profile"
                      ],
                      "name": "Hellobar",
                      "base_url": "https://localdev.fyndx0.de",
                      "logo": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png",
                      "contact_email": "gauravkumarsharma@gofynd.com",
                      "callbacks": {
                          "auth": "https://localdev.fyndx0.de/fp/auth",
                          "install": "https://localdev.fyndx0.de/fp/install",
                          "setup": "https://localdev.fyndx0.de/fp/setup",
                          "uninstall": "https://localdev.fyndx0.de/fp/uninstall"
                      },
                      "is_coming_soon": true,
                      "organization_id": "610d3a4595dcfae682408c07",
                      "created_at": "2022-03-17T08:56:37.174Z",
                      "modified_at": "2022-03-17T08:56:37.174Z",
                      "__v": 0,
                      "extension_public_data": {
                          "_id": "6232f7c538bac40085b874c7",
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f458",
                                      "_id": "62320b45f4213eb19aa8f458",
                                      "slug": "source-and-selling-product"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f4e5",
                                      "_id": "62320b45f4213eb19aa8f4e5",
                                      "parent": "62320b45f4213eb19aa8f458",
                                      "slug": "marketplace"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4e1",
                                      "_id": "62320b45f4213eb19aa8f4e1",
                                      "parent": "62320b45f4213eb19aa8f458",
                                      "slug": "dropshipping"
                                  }
                              ]
                          },
                          "listing_info": {
                              "keywords": [],
                              "icon": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png",
                              "name": "Hellobar",
                              "tagline": "Use emphasized text as heading that sticks on your website"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/banner.png"
                                  ],
                                  "mobile": []
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "6232f7c538bac40085b874c8",
                                      "title": "Guest To Customer Transition",
                                      "description": "Effective headers will increase sign-ups"
                                  },
                                  {
                                      "_id": "6232f7c538bac40085b874c9",
                                      "title": "Create Leads For Marketing",
                                      "description": "Fetch emails/contact numbers to boost business"
                                  },
                                  {
                                      "_id": "6232f7c538bac40085b874ca",
                                      "title": "Minimize Cart Rejection",
                                      "description": "Encourages customer to buy items"
                                  }
                              ],
                              "description": "As an online marketer with a product that you believe in, nailing the art of converting site visitors into leads is going to have a huge impact on the success of your business. Well, Hellobar makes it possible!\n \n \n <p>What's New\n \n\n\n \n <p>• Business efforts will not be wasted\n \n\n\n \n <p>• Keep customers engaged on your website",
                              "video_url": []
                          },
                          "contact_info": {
                              "support": {
                                  "email": "",
                                  "phone": "",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "coming_soon": {
                              "upvote_count": 0,
                              "is_coming_soon": true
                          },
                          "scope": [
                              "company/profile"
                          ],
                          "plans": [
                              {
                                  "additional_charges": "",
                                  "features": "free plan features",
                                  "name": "free",
                                  "price": {
                                      "amount": 0,
                                      "currency": "INR"
                                  },
                                  "trial_days": 0,
                                  "type": "free"
                              }
                          ],
                          "slug": "hellobar",
                          "current_status": "active",
                          "plan_type": "free",
                          "extension_id": "6232f7c538bac40085b874c5",
                          "organization_id": "610d3a4595dcfae682408c07",
                          "created_at": "2022-03-17T08:56:37.202Z",
                          "modified_at": "2022-03-21T12:27:08.921Z",
                          "organization": {
                              "name": "Social Icons Company",
                              "slug": "Social-asx-16"
                          }
                      },
                      "organization": {
                          "name": "Social Icons Company",
                          "slug": "Social-asx-16"
                      },
                      "text": "Hellobar",
                      "value": "6232f7c538bac40085b874c5",
                      "label": "Extensions"
                  },
                  {
                      "_id": "61155f5d95dcfad8294091c4",
                      "description": "",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "is_application_level": true,
                      "is_saleschannel": false,
                      "scope": [
                          "company/profile",
                          "company/product",
                          "company/application/catalogue"
                      ],
                      "name": "Amazon Catalogue",
                      "base_url": "https://amazon-ct.extensions.fyndx0.de",
                      "logo": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png",
                      "callbacks": {
                          "setup": "https://amazon-ct.extensions.fyndx0.de/fp/setup",
                          "auth": "https://amazon-ct.extensions.fyndx0.de/fp/auth",
                          "install": "https://amazon-ct.extensions.fyndx0.de/fp/install",
                          "uninstall": "https://amazon-ct.extensions.fyndx0.de/fp/uninstall"
                      },
                      "developed_by_name": "Piyush Org",
                      "contact_email": "piyushvishwakarma@gofynd.com",
                      "organization_id": "6111ec0095dcfac23e408dd1",
                      "created_at": "2021-08-12T17:50:21.608Z",
                      "modified_at": "2021-09-29T09:51:39.732Z",
                      "__v": 0,
                      "extension_public_data": {
                          "_id": "6149687d9e865808c8556baf",
                          "listing_info": {
                              "keywords": [
                                  "amazon"
                              ],
                              "name": "Amazon Catalogue",
                              "tagline": "Export products in Amazon compatible format",
                              "icon": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/KrryVoFfH-desk-sc-1.png"
                                  ],
                                  "mobile": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/YDwSZsoiV-mob-sc-1.png"
                                  ]
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "6149687d9e8658092e556bb0",
                                      "title": "Catalogue Export",
                                      "description": "Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager."
                                  }
                              ],
                              "description": "<p>Your catalogue on Fynd Platform is readily usable on Facebook Commerce Manager. This app helps you transform your Fynd Platform catalogue into Facebook's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Facebook Commerce Manager to upload your products to Facebook Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Facebook marketplace to Fynd Platform using the exported CSV from Facebook Commerce Manager.</li>\n</ul>\n</li>\n</ul>",
                              "demo_url": "",
                              "video_url": []
                          },
                          "contact_info": {
                              "support": {
                                  "email": "piyushvishwakarma@gofynd.com",
                                  "phone": "7208229699",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "scope": [
                              "company/profile",
                              "company/product",
                              "company/application/catalogue"
                          ],
                          "plans": [
                              {
                                  "name": "Premium",
                                  "features": "Unlimited catalogue export   \nSchedule catalogue generation\nView export event history ",
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
                          "extension_id": "61155f5d95dcfad8294091c4",
                          "slug": "amazon-catalogue",
                          "plan_type": "recurring",
                          "plans_url": "",
                          "current_status": "active",
                          "organization_id": "6111ec0095dcfac23e408dd1",
                          "created_at": "2021-09-21T05:07:09.208Z",
                          "modified_at": "2022-03-21T12:27:07.601Z",
                          "coming_soon": {
                              "upvote_count": 0
                          },
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f45a",
                                      "_id": "62320b45f4213eb19aa8f45a",
                                      "slug": "customer-service"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f45c",
                                      "_id": "62320b45f4213eb19aa8f45c",
                                      "slug": "channel-management"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f4f4",
                                      "_id": "62320b45f4213eb19aa8f4f4",
                                      "parent": "62320b45f4213eb19aa8f45c",
                                      "slug": "shipping-solution"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4e9",
                                      "_id": "62320b45f4213eb19aa8f4e9",
                                      "parent": "62320b45f4213eb19aa8f45c",
                                      "slug": "channel-management-internalization"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4d6",
                                      "_id": "62320b45f4213eb19aa8f4d6",
                                      "parent": "62320b45f4213eb19aa8f45a",
                                      "slug": "customer-account"
                                  }
                              ]
                          },
                          "organization": {
                              "name": "Piyush Org",
                              "slug": "Piyush-ph2-25"
                          }
                      },
                      "organization": {
                          "name": "Piyush Org",
                          "slug": "Piyush-ph2-25"
                      },
                      "text": "Amazon Catalogue",
                      "value": "61155f5d95dcfad8294091c4",
                      "label": "Extensions"
                  }
              ]
          },
          "items": [
              {
                  "value": "62445236d4cc749faccf213e"
              },
              {
                  "value": "6232f7c538bac40085b874c5"
              },
              {
                  "value": "61155f5d95dcfad8294091c4"
              }
          ]
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
          "type": "banner",
          "page_type": "all",
          "data": {
              "heading": "Fynd Extensions",
              "title": "Skyrocket your business experience using extensions",
              "subtitle": "Boost the capability of Fynd Platform using extensions created specially for the merchant community",
              "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png",
              "image_position": "right",
              "button_label": "View All Extensions",
              "button_page_link": "Extensions List"
          },
          "items": []
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
          "page_type": "all",
          "type": "collection_grid",
          "data": {
              "heading": "Collections",
              "title": "Latest",
              "subtitle": "Subtitle",
              "button_label": "View",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "collection": [
                  "623847d0ec3c4b10b1f5fed6",
                  "627ba8371171f7705212333b",
                  "62384f66ec3c4b4e6ff5fee6",
                  "625fe7c726e867d85730af1a"
              ],
              "collection_details": [
                  {
                      "banner": {
                          "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/o9UhZ5Em6-logo.jpeg",
                          "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/dU3kXnGwR-logo.png",
                          "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png"
                      },
                      "seo": {
                          "title": "Title",
                          "description": "Breif description about the"
                      },
                      "tags": [
                          "asdsa",
                          "asdas",
                          "my"
                      ],
                      "published": false,
                      "_id": "623847d0ec3c4b10b1f5fed6",
                      "collection_category": "extension",
                      "collection_type": "handpicked",
                      "name": "New Extension collection",
                      "description": "fdsdssdasdsdsd d d sddas dsd sd d",
                      "slug": "new-extension-collection",
                      "__v": 0,
                      "created_at": "2022-06-02T15:24:26.203Z",
                      "modified_at": "2022-06-02T15:24:26.203Z"
                  },
                  {
                      "banner": {
                          "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/IcaJe8Jty-logo.png",
                          "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Pkucz2J8n-logo.png",
                          "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/JdOFjaPIr-logo.png"
                      },
                      "seo": {
                          "title": "Title",
                          "description": "Breif description about the collection"
                      },
                      "tags": [],
                      "published": true,
                      "_id": "627ba8371171f7705212333b",
                      "collection_category": "extension",
                      "collection_type": "handpicked",
                      "name": "sands odsoic ",
                      "description": "dd ",
                      "slug": "sands-odsoic",
                      "__v": 0
                  },
                  {
                      "banner": {
                          "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/q7Ex7-oAT-logo.png",
                          "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/HCrbg2uGD-logo.png",
                          "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/0cyP63leb-logo.png"
                      },
                      "seo": {
                          "title": "Title",
                          "description": "Breif description about the"
                      },
                      "tags": [
                          "adsa",
                          "dsad",
                          "asdas"
                      ],
                      "published": true,
                      "_id": "62384f66ec3c4b4e6ff5fee6",
                      "collection_category": "extension",
                      "collection_type": "handpicked",
                      "name": "NEW ONE",
                      "description": "sadasdasd",
                      "slug": "new-one",
                      "__v": 0,
                      "created_at": "2022-06-01T08:19:13.070Z",
                      "modified_at": "2022-06-01T08:19:13.070Z"
                  },
                  {
                      "banner": {
                          "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/lOyFu1NjT-logo.png",
                          "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LLbfmTiyf-logo.png",
                          "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/1hvSt917P-logo.png"
                      },
                      "seo": {
                          "title": "Title",
                          "description": "Breif description about the collection"
                      },
                      "tags": [
                          "dfg"
                      ],
                      "published": true,
                      "_id": "625fe7c726e867d85730af1a",
                      "collection_category": "extension",
                      "collection_type": "handpicked",
                      "name": "Test3",
                      "description": "gdfdfd",
                      "slug": "qwer-tyui-tyu",
                      "__v": 0,
                      "created_at": "2022-06-08T09:49:38.324Z",
                      "modified_at": "2022-06-08T09:49:38.324Z"
                  }
              ]
          },
          "item_type": "collection",
          "items": [
              {
                  "value": "623847d0ec3c4b10b1f5fed6"
              },
              {
                  "value": "627ba8371171f7705212333b"
              },
              {
                  "value": "62384f66ec3c4b4e6ff5fee6"
              },
              {
                  "value": "625fe7c726e867d85730af1a"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_grid",
          "data": {
              "heading": "Latest Extensions",
              "title": "Extensions",
              "subtitle": "Latest Extensions",
              "button_label": "View All",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "extension": [
                  "60be66a2d4cbbf1fd0a67c8c",
                  "610d2ad295dcfa14eb408bad",
                  "61109c6795dcfa38cb408c70",
                  "6232f7c538bac40085b874c5"
              ],
              "extension_details": [
                  {
                      "_id": "60be66a2d4cbbf1fd0a67c8c",
                      "description": "",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "scope": [
                          "company/saleschannel"
                      ],
                      "name": "newsletter-local Brijesh",
                      "base_url": "https://newsletter-sub-008.loca.lt",
                      "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png",
                      "callbacks": {
                          "setup": "https://newsletter-sub-008.loca.lt/fp/setup",
                          "auth": "https://newsletter-sub-008.loca.lt/fp/auth",
                          "install": "https://newsletter-sub-008.loca.lt/fp/install",
                          "uninstall": "https://newsletter-sub-008.loca.lt/fp/uninstall"
                      },
                      "developed_by_name": "Social Icons Company",
                      "contact_email": "brijeshgajjar@gofynd.com",
                      "organization_id": "610d3a4595dcfae682408c07",
                      "created_at": "2021-06-07T18:34:10.795Z",
                      "modified_at": "2022-04-29T07:22:36.929Z",
                      "__v": 0,
                      "is_application_level": true,
                      "is_saleschannel": false,
                      "is_coming_soon": false,
                      "extension_public_data": {
                          "_id": "626b92f7f36a77f7b0517b87",
                          "category": {
                              "categories_l1": [],
                              "categories_l2": []
                          },
                          "listing_info": {
                              "keywords": [],
                              "name": "newsletter-local Brijesh",
                              "tagline": "test",
                              "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pX9zldCt8-desk-sc-1.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LvtKWCCZF-desk-sc-3.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pjqTQJKfF-desk-sc-3.jpeg"
                                  ],
                                  "mobile": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/hJZfpuvZo-mob-sc-2.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/i2pysVdSu-mob-sc-3.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/u7sf_tXdN-mob-sc-3.jpeg"
                                  ]
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "626b9420f36a773678517bbf",
                                      "title": "Test",
                                      "description": "test"
                                  }
                              ],
                              "video_url": [],
                              "description": "<p>Test</p>",
                              "demo_url": ""
                          },
                          "contact_info": {
                              "support": {
                                  "email": "brijeshgajjar@gofynd.com",
                                  "phone": "8452996729",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "coming_soon": {
                              "upvote_count": 0,
                              "is_coming_soon": false
                          },
                          "scope": [
                              "company/saleschannel"
                          ],
                          "plans": [
                              {
                                  "name": "Free",
                                  "features": "test",
                                  "type": "free",
                                  "price": {
                                      "amount": 0,
                                      "currency": "INR"
                                  },
                                  "trial_days": 0,
                                  "additional_charges": ""
                              }
                          ],
                          "extension_id": "60be66a2d4cbbf1fd0a67c8c",
                          "slug": "newsletter-local-brijesh",
                          "plan_type": "free",
                          "plans_url": "",
                          "current_status": "active",
                          "organization_id": "610d3a4595dcfae682408c07",
                          "created_at": "2022-04-29T07:25:43.514Z",
                          "modified_at": "2022-04-29T07:30:40.646Z",
                          "organization": {
                              "name": "Social Icons Company",
                              "slug": "Social-asx-16"
                          }
                      },
                      "organization": {
                          "name": "Social Icons Company",
                          "slug": "Social-asx-16"
                      },
                      "text": "newsletter-local Brijesh",
                      "value": "60be66a2d4cbbf1fd0a67c8c",
                      "label": "Extensions"
                  },
                  {
                      "_id": "610d2ad295dcfa14eb408bad",
                      "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "is_application_level": true,
                      "is_saleschannel": false,
                      "scope": [
                          "company/saleschannel",
                          "company/application/marketing"
                      ],
                      "name": "Bulk Coupons Generator",
                      "base_url": "https://bulkcoupon.extensions.fyndx0.de",
                      "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png",
                      "callbacks": {
                          "setup": "https://bulkcoupon.extensions.fyndx0.de/fp/setup",
                          "auth": "https://bulkcoupon.extensions.fyndx0.de/fp/auth",
                          "install": "https://bulkcoupon.extensions.fyndx0.de/fp/install",
                          "uninstall": "https://bulkcoupon.extensions.fyndx0.de/fp/uninstall",
                          "auto_install": "https://bulkcoupon.extensions.fyndx0.de/fp/auto_install"
                      },
                      "developed_by_name": "Rushabh Shah",
                      "contact_email": "rushabhmshah@gofynd.com",
                      "organization_id": "610d29f395dcfaba6b408ba6",
                      "created_at": "2021-08-06T12:28:02.036Z",
                      "modified_at": "2022-02-28T15:56:31.338Z",
                      "__v": 0,
                      "is_coming_soon": false,
                      "extension_public_data": {
                          "_id": "621cf0c006962803b4cd780d",
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f44e",
                                      "_id": "62320b45f4213eb19aa8f44e",
                                      "slug": "merchandising"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f458",
                                      "_id": "62320b45f4213eb19aa8f458",
                                      "slug": "source-and-selling-product"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f4e5",
                                      "_id": "62320b45f4213eb19aa8f4e5",
                                      "parent": "62320b45f4213eb19aa8f458",
                                      "slug": "marketplace"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f480",
                                      "_id": "62320b45f4213eb19aa8f480",
                                      "parent": "62320b45f4213eb19aa8f44e",
                                      "slug": "announcement-and-banner"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f486",
                                      "_id": "62320b45f4213eb19aa8f486",
                                      "parent": "62320b45f4213eb19aa8f44e",
                                      "slug": "additional-purchase"
                                  }
                              ]
                          },
                          "listing_info": {
                              "keywords": [],
                              "name": "Bulk Coupons Generator",
                              "tagline": "Test",
                              "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/fQ_yjdowj-desk-sc-1.jpeg"
                                  ],
                                  "mobile": []
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "621cf0c00696281d1dcd780e",
                                      "title": "Test",
                                      "description": "test"
                                  }
                              ],
                              "video_url": [],
                              "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                              "demo_url": ""
                          },
                          "contact_info": {
                              "support": {
                                  "email": "rushabhmshah@gofynd.com",
                                  "phone": "9930630722",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "coming_soon": {
                              "upvote_count": 0,
                              "is_coming_soon": false
                          },
                          "scope": [
                              "company/saleschannel",
                              "company/application/marketing"
                          ],
                          "plans": [
                              {
                                  "name": "Standard Plan",
                                  "features": "Standard feature\nStandard feature\nStandard feature",
                                  "type": "recurring",
                                  "price": {
                                      "amount": 99,
                                      "currency": "INR"
                                  },
                                  "trial_days": 0,
                                  "additional_charges": "",
                                  "recurring": {
                                      "type": "month",
                                      "recurring_time": 30,
                                      "yearly_amount": 1188
                                  }
                              },
                              {
                                  "name": "Premium Plan",
                                  "features": "Premium Feature\nPremium Feature\nPremium Feature",
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
                          "extension_id": "610d2ad295dcfa14eb408bad",
                          "slug": "bulk-coupons-generator",
                          "plan_type": "recurring",
                          "plans_url": "",
                          "current_status": "active",
                          "organization_id": "610d29f395dcfaba6b408ba6",
                          "created_at": "2022-02-28T15:56:48.806Z",
                          "modified_at": "2022-03-21T12:27:08.714Z",
                          "organization": {
                              "name": "Rushabh Shah",
                              "slug": "Rushab-omn-2"
                          }
                      },
                      "organization": {
                          "name": "Rushabh Shah",
                          "slug": "Rushab-omn-2"
                      },
                      "text": "Bulk Coupons Generator",
                      "value": "610d2ad295dcfa14eb408bad",
                      "label": "Extensions"
                  },
                  {
                      "_id": "61109c6795dcfa38cb408c70",
                      "description": "Local tag manager",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "is_application_level": false,
                      "is_saleschannel": false,
                      "scope": [
                          "company/saleschannel",
                          "company/application/settings"
                      ],
                      "name": "Tag Manager Local",
                      "base_url": "https://quiet-cow-22.loca.lt",
                      "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png",
                      "callbacks": {
                          "setup": "https://quiet-cow-22.loca.lt/fp/setup",
                          "auth": "https://quiet-cow-22.loca.lt/fp/auth",
                          "install": "https://quiet-cow-22.loca.lt/fp/install",
                          "uninstall": "https://quiet-cow-22.loca.lt/fp/uninstall"
                      },
                      "developed_by_name": "Akash Organization",
                      "contact_email": "akashmane@gofynd.com",
                      "organization_id": "6110967d95dcfaf485408c60",
                      "created_at": "2021-08-09T03:09:27.392Z",
                      "modified_at": "2021-09-09T04:40:50.398Z",
                      "__v": 0,
                      "extension_public_data": {
                          "_id": "61109ded41dc073111c38f59",
                          "listing_info": {
                              "keywords": [],
                              "name": "Tag Manager Local",
                              "tagline": "Google Tag Manager",
                              "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/bNNRnl-IE-desk-sc-1.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/P0IcHYNbA-desk-sc-2.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PlY2R2xgo-desk-sc-3.png"
                                  ],
                                  "mobile": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/30gIT73MK-mob-sc-1.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/XoAtVMhIn-mob-sc-2.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/XoAtVMhIn-mob-sc-2.png"
                                  ]
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "61109ded41dc072bf4c38f5a",
                                      "title": "Feature 1",
                                      "description": "Description 1"
                                  }
                              ],
                              "description": "Local tag manager",
                              "demo_url": "https://honest-rattlesnake-7.loca.lt/",
                              "video_url": []
                          },
                          "contact_info": {
                              "support": {
                                  "email": "akashmane@gofynd.com",
                                  "phone": "8652523958",
                                  "website_url": "https://honest-rattlesnake-7.loca.lt/",
                                  "faq_url": "https://honest-rattlesnake-7.loca.lt/",
                                  "privacy_policy_url": "https://honest-rattlesnake-7.loca.lt/"
                              }
                          },
                          "scope": [
                              "company/saleschannel",
                              "company/application/settings"
                          ],
                          "plans": [
                              {
                                  "name": "Basic",
                                  "features": "Basic ",
                                  "type": "recurring",
                                  "price": {
                                      "amount": 99,
                                      "currency": "INR"
                                  },
                                  "trial_days": 0,
                                  "additional_charges": "",
                                  "recurring": {
                                      "type": "month",
                                      "recurring_time": 30,
                                      "yearly_amount": 1188
                                  }
                              }
                          ],
                          "extension_id": "61109c6795dcfa38cb408c70",
                          "slug": "tag-manager-local",
                          "plan_type": "recurring",
                          "plans_url": "https://honest-rattlesnake-7.loca.lt/company/1/pricing",
                          "current_status": "active",
                          "organization_id": "6110967d95dcfaf485408c60",
                          "created_at": "2021-08-09T03:15:57.074Z",
                          "modified_at": "2022-03-21T12:27:06.809Z",
                          "coming_soon": {
                              "upvote_count": 0
                          },
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f45b",
                                      "_id": "62320b45f4213eb19aa8f45b",
                                      "slug": "inventory"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f45a",
                                      "_id": "62320b45f4213eb19aa8f45a",
                                      "slug": "customer-service"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f4d9",
                                      "_id": "62320b45f4213eb19aa8f4d9",
                                      "parent": "62320b45f4213eb19aa8f45b",
                                      "slug": "managing-inventory"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4d4",
                                      "_id": "62320b45f4213eb19aa8f4d4",
                                      "parent": "62320b45f4213eb19aa8f45a",
                                      "slug": "support"
                                  }
                              ]
                          },
                          "organization": {
                              "name": "Akash Organization",
                              "slug": "AkashO-2xk-98"
                          }
                      },
                      "organization": {
                          "name": "Akash Organization",
                          "slug": "AkashO-2xk-98"
                      },
                      "text": "Tag Manager Local",
                      "value": "61109c6795dcfa38cb408c70",
                      "label": "Extensions"
                  },
                  {
                      "_id": "6232f7c538bac40085b874c5",
                      "description": "As an online marketer with a product that you believe in, nailing the art of converting site visitors into leads is going to have a huge impact on the success of your business. Well, Hellobar makes it possible!\n \n What's New\n • Business efforts will not be wasted\n • Keep customers engaged on your website",
                      "whitelisted_urls": [],
                      "ext_version": "1.0",
                      "extention_type": "public",
                      "is_application_level": false,
                      "is_saleschannel": false,
                      "scope": [
                          "company/profile"
                      ],
                      "name": "Hellobar",
                      "base_url": "https://localdev.fyndx0.de",
                      "logo": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png",
                      "contact_email": "gauravkumarsharma@gofynd.com",
                      "callbacks": {
                          "auth": "https://localdev.fyndx0.de/fp/auth",
                          "install": "https://localdev.fyndx0.de/fp/install",
                          "setup": "https://localdev.fyndx0.de/fp/setup",
                          "uninstall": "https://localdev.fyndx0.de/fp/uninstall"
                      },
                      "is_coming_soon": true,
                      "organization_id": "610d3a4595dcfae682408c07",
                      "created_at": "2022-03-17T08:56:37.174Z",
                      "modified_at": "2022-03-17T08:56:37.174Z",
                      "__v": 0,
                      "extension_public_data": {
                          "_id": "6232f7c538bac40085b874c7",
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f458",
                                      "_id": "62320b45f4213eb19aa8f458",
                                      "slug": "source-and-selling-product"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f4e5",
                                      "_id": "62320b45f4213eb19aa8f4e5",
                                      "parent": "62320b45f4213eb19aa8f458",
                                      "slug": "marketplace"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4e1",
                                      "_id": "62320b45f4213eb19aa8f4e1",
                                      "parent": "62320b45f4213eb19aa8f458",
                                      "slug": "dropshipping"
                                  }
                              ]
                          },
                          "listing_info": {
                              "keywords": [],
                              "icon": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png",
                              "name": "Hellobar",
                              "tagline": "Use emphasized text as heading that sticks on your website"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/banner.png"
                                  ],
                                  "mobile": []
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "6232f7c538bac40085b874c8",
                                      "title": "Guest To Customer Transition",
                                      "description": "Effective headers will increase sign-ups"
                                  },
                                  {
                                      "_id": "6232f7c538bac40085b874c9",
                                      "title": "Create Leads For Marketing",
                                      "description": "Fetch emails/contact numbers to boost business"
                                  },
                                  {
                                      "_id": "6232f7c538bac40085b874ca",
                                      "title": "Minimize Cart Rejection",
                                      "description": "Encourages customer to buy items"
                                  }
                              ],
                              "description": "As an online marketer with a product that you believe in, nailing the art of converting site visitors into leads is going to have a huge impact on the success of your business. Well, Hellobar makes it possible!\n \n \n <p>What's New\n \n\n\n \n <p>• Business efforts will not be wasted\n \n\n\n \n <p>• Keep customers engaged on your website",
                              "video_url": []
                          },
                          "contact_info": {
                              "support": {
                                  "email": "",
                                  "phone": "",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "coming_soon": {
                              "upvote_count": 0,
                              "is_coming_soon": true
                          },
                          "scope": [
                              "company/profile"
                          ],
                          "plans": [
                              {
                                  "additional_charges": "",
                                  "features": "free plan features",
                                  "name": "free",
                                  "price": {
                                      "amount": 0,
                                      "currency": "INR"
                                  },
                                  "trial_days": 0,
                                  "type": "free"
                              }
                          ],
                          "slug": "hellobar",
                          "current_status": "active",
                          "plan_type": "free",
                          "extension_id": "6232f7c538bac40085b874c5",
                          "organization_id": "610d3a4595dcfae682408c07",
                          "created_at": "2022-03-17T08:56:37.202Z",
                          "modified_at": "2022-03-21T12:27:08.921Z",
                          "organization": {
                              "name": "Social Icons Company",
                              "slug": "Social-asx-16"
                          }
                      },
                      "organization": {
                          "name": "Social Icons Company",
                          "slug": "Social-asx-16"
                      },
                      "text": "Hellobar",
                      "value": "6232f7c538bac40085b874c5",
                      "label": "Extensions"
                  }
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "60be66a2d4cbbf1fd0a67c8c"
              },
              {
                  "value": "610d2ad295dcfa14eb408bad"
              },
              {
                  "value": "61109c6795dcfa38cb408c70"
              },
              {
                  "value": "6232f7c538bac40085b874c5"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_item_list",
          "data": {
              "heading": "NEW! NEW!",
              "title": "New Extensions",
              "subtitle": "Subtitle",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "api_source": "extension_latest",
              "extension": [
                  "611624ac95dcfa262740920e",
                  "6116026a95dcfa05eb4091e3",
                  "61155f5d95dcfad8294091c4",
                  "61138cf895dcfa08a5408fc4"
              ],
              "extension_details": [
                  {
                      "_id": "611624ac95dcfa262740920e",
                      "description": "Android App Builder",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "is_application_level": true,
                      "is_saleschannel": false,
                      "scope": [
                          "company/profile",
                          "company/saleschannel",
                          "company/product",
                          "company/order",
                          "company/application/customer",
                          "company/application/analytics",
                          "company/application/storage",
                          "company/application/marketing",
                          "company/application/catalogue",
                          "company/application/communication",
                          "company/application/support",
                          "company/application/order",
                          "company/application/settings"
                      ],
                      "name": "App Builder",
                      "base_url": "https://android-app-builder.extensions.fyndx0.de",
                      "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9nrhvtx7s-logo.png",
                      "callbacks": {
                          "setup": "https://android-app-builder.extensions.fyndx0.de/fp/setup",
                          "auth": "https://android-app-builder.extensions.fyndx0.de/fp/auth",
                          "install": "https://android-app-builder.extensions.fyndx0.de/fp/install",
                          "uninstall": "https://android-app-builder.extensions.fyndx0.de/fp/uninstall"
                      },
                      "developed_by_name": "Apk Extension",
                      "contact_email": "venkhatesharunachalam@gofynd.com",
                      "organization_id": "6116013e95dcfa31f64091dc",
                      "created_at": "2021-08-13T07:52:12.323Z",
                      "modified_at": "2022-04-18T07:23:43.379Z",
                      "__v": 0,
                      "extension_public_data": {
                          "_id": "61e52b2d2573dc50d8eb3e5b",
                          "listing_info": {
                              "keywords": [
                                  "app",
                                  "android"
                              ],
                              "name": "App Builder",
                              "tagline": "App for your e-commerce website",
                              "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9nrhvtx7s-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/7u47o-l7y-desk-sc-1.png"
                                  ],
                                  "mobile": []
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "61e52b2d2573dc0241eb3e5c",
                                      "title": "Create App for your Fynd Platform website",
                                      "description": "Create App for your Fynd Platform website"
                                  }
                              ],
                              "video_url": [],
                              "description": "<p>App Builder for your Fynd Platform website</p>",
                              "demo_url": ""
                          },
                          "contact_info": {
                              "support": {
                                  "email": "venkhatesharunachalam@gofynd.com",
                                  "phone": "8369903075",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "coming_soon": {
                              "upvote_count": 0
                          },
                          "scope": [
                              "company/profile",
                              "company/saleschannel",
                              "company/product",
                              "company/order",
                              "company/application/customer",
                              "company/application/analytics",
                              "company/application/storage",
                              "company/application/marketing",
                              "company/application/catalogue",
                              "company/application/communication",
                              "company/application/support",
                              "company/application/order",
                              "company/application/settings"
                          ],
                          "plans": [
                              {
                                  "name": "Monthly",
                                  "features": "Android App",
                                  "type": "recurring",
                                  "price": {
                                      "amount": 149,
                                      "currency": "INR"
                                  },
                                  "trial_days": 0,
                                  "additional_charges": "",
                                  "recurring": {
                                      "type": "month",
                                      "recurring_time": 30,
                                      "yearly_amount": 1788
                                  }
                              },
                              {
                                  "name": "Yearly",
                                  "features": "Android App",
                                  "type": "recurring",
                                  "price": {
                                      "amount": 1499,
                                      "currency": "INR"
                                  },
                                  "trial_days": 0,
                                  "additional_charges": "",
                                  "recurring": {
                                      "type": "year",
                                      "recurring_time": 365,
                                      "yearly_amount": 0
                                  }
                              }
                          ],
                          "extension_id": "611624ac95dcfa262740920e",
                          "slug": "app-builder",
                          "plan_type": "recurring",
                          "plans_url": "",
                          "current_status": "active",
                          "organization_id": "6116013e95dcfa31f64091dc",
                          "created_at": "2022-01-17T08:39:09.184Z",
                          "modified_at": "2022-03-21T12:27:07.911Z",
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f44c",
                                      "_id": "62320b45f4213eb19aa8f44c",
                                      "slug": "marketing"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f45b",
                                      "_id": "62320b45f4213eb19aa8f45b",
                                      "slug": "inventory"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f4d9",
                                      "_id": "62320b45f4213eb19aa8f4d9",
                                      "parent": "62320b45f4213eb19aa8f45b",
                                      "slug": "managing-inventory"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4a4",
                                      "_id": "62320b45f4213eb19aa8f4a4",
                                      "parent": "62320b45f4213eb19aa8f44c",
                                      "slug": "email-and-sms-marketing"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f48b",
                                      "_id": "62320b45f4213eb19aa8f48b",
                                      "parent": "62320b45f4213eb19aa8f44c",
                                      "slug": "notification"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4a7",
                                      "_id": "62320b45f4213eb19aa8f4a7",
                                      "parent": "62320b45f4213eb19aa8f44c",
                                      "slug": "page-enhancement"
                                  }
                              ]
                          },
                          "organization": {
                              "name": "Strikers",
                              "slug": "ApkExt-ze8-72"
                          }
                      },
                      "organization": {
                          "name": "Strikers",
                          "slug": "ApkExt-ze8-72"
                      },
                      "text": "App Builder",
                      "value": "611624ac95dcfa262740920e",
                      "label": "Extensions"
                  },
                  {
                      "_id": "6116026a95dcfa05eb4091e3",
                      "description": "xyz",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "is_application_level": false,
                      "is_saleschannel": true,
                      "scope": [
                          "company/profile",
                          "company/saleschannel",
                          "company/product",
                          "company/order",
                          "company/application/customer",
                          "company/application/analytics",
                          "company/application/storage",
                          "company/application/marketing",
                          "company/application/catalogue",
                          "company/application/communication",
                          "company/application/support",
                          "company/application/order",
                          "company/application/settings"
                      ],
                      "name": "APK ",
                      "base_url": "https://4a2f-49-204-113-86.ngrok.io",
                      "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png",
                      "callbacks": {
                          "setup": "https://4a2f-49-204-113-86.ngrok.io/fp/setup",
                          "auth": "https://4a2f-49-204-113-86.ngrok.io/fp/auth",
                          "install": "https://4a2f-49-204-113-86.ngrok.io/fp/install",
                          "uninstall": "https://4a2f-49-204-113-86.ngrok.io/fp/uninstall"
                      },
                      "developed_by_name": "Apk Extension",
                      "contact_email": "venkhatesharunachalam@gofynd.com",
                      "organization_id": "6116013e95dcfa31f64091dc",
                      "created_at": "2021-08-13T05:26:02.843Z",
                      "modified_at": "2022-02-08T06:08:32.675Z",
                      "__v": 0,
                      "extension_public_data": {
                          "_id": "61160b0041dc073a0fc38f61",
                          "listing_info": {
                              "keywords": [],
                              "name": "APK ",
                              "tagline": "Downloadable apk",
                              "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/ld0bkv7uE-desk-sc-1.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/haYr70MB6-desk-sc-2.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/1ywtXQaRo-desk-sc-3.jpeg"
                                  ],
                                  "mobile": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/WsLyDAES9-mob-sc-1.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/akmpv_h_V-mob-sc-2.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Rw60j7I5r-mob-sc-3.jpeg"
                                  ]
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "61262f2ebec3d618918f7561",
                                      "title": "APk ",
                                      "description": "test"
                                  }
                              ],
                              "description": "xyz",
                              "demo_url": "",
                              "video_url": []
                          },
                          "contact_info": {
                              "support": {
                                  "email": "venkhatesharunachalam@gofynd.com",
                                  "phone": "8369903075",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "scope": [
                              "company/profile",
                              "company/saleschannel",
                              "company/product",
                              "company/order",
                              "company/application/customer",
                              "company/application/analytics",
                              "company/application/storage",
                              "company/application/marketing",
                              "company/application/catalogue",
                              "company/application/communication",
                              "company/application/support",
                              "company/application/order",
                              "company/application/settings"
                          ],
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
                          "extension_id": "6116026a95dcfa05eb4091e3",
                          "slug": "apk",
                          "plan_type": "free",
                          "plans_url": "",
                          "current_status": "active",
                          "organization_id": "6116013e95dcfa31f64091dc",
                          "created_at": "2021-08-13T06:02:40.313Z",
                          "modified_at": "2022-03-21T12:27:06.810Z",
                          "coming_soon": {
                              "upvote_count": 0
                          },
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f447",
                                      "_id": "62320b45f4213eb19aa8f447",
                                      "slug": "conversion"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f44e",
                                      "_id": "62320b45f4213eb19aa8f44e",
                                      "slug": "merchandising"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f47a",
                                      "_id": "62320b45f4213eb19aa8f47a",
                                      "parent": "62320b45f4213eb19aa8f447",
                                      "slug": "cart-modification"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f480",
                                      "_id": "62320b45f4213eb19aa8f480",
                                      "parent": "62320b45f4213eb19aa8f44e",
                                      "slug": "announcement-and-banner"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f479",
                                      "_id": "62320b45f4213eb19aa8f479",
                                      "parent": "62320b45f4213eb19aa8f447",
                                      "slug": "customer-feedback"
                                  }
                              ]
                          },
                          "organization": {
                              "name": "Strikers",
                              "slug": "ApkExt-ze8-72"
                          }
                      },
                      "organization": {
                          "name": "Strikers",
                          "slug": "ApkExt-ze8-72"
                      },
                      "text": "APK ",
                      "value": "6116026a95dcfa05eb4091e3",
                      "label": "Extensions"
                  },
                  {
                      "_id": "61155f5d95dcfad8294091c4",
                      "description": "",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "is_application_level": true,
                      "is_saleschannel": false,
                      "scope": [
                          "company/profile",
                          "company/product",
                          "company/application/catalogue"
                      ],
                      "name": "Amazon Catalogue",
                      "base_url": "https://amazon-ct.extensions.fyndx0.de",
                      "logo": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png",
                      "callbacks": {
                          "setup": "https://amazon-ct.extensions.fyndx0.de/fp/setup",
                          "auth": "https://amazon-ct.extensions.fyndx0.de/fp/auth",
                          "install": "https://amazon-ct.extensions.fyndx0.de/fp/install",
                          "uninstall": "https://amazon-ct.extensions.fyndx0.de/fp/uninstall"
                      },
                      "developed_by_name": "Piyush Org",
                      "contact_email": "piyushvishwakarma@gofynd.com",
                      "organization_id": "6111ec0095dcfac23e408dd1",
                      "created_at": "2021-08-12T17:50:21.608Z",
                      "modified_at": "2021-09-29T09:51:39.732Z",
                      "__v": 0,
                      "extension_public_data": {
                          "_id": "6149687d9e865808c8556baf",
                          "listing_info": {
                              "keywords": [
                                  "amazon"
                              ],
                              "name": "Amazon Catalogue",
                              "tagline": "Export products in Amazon compatible format",
                              "icon": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/KrryVoFfH-desk-sc-1.png"
                                  ],
                                  "mobile": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/YDwSZsoiV-mob-sc-1.png"
                                  ]
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "6149687d9e8658092e556bb0",
                                      "title": "Catalogue Export",
                                      "description": "Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager."
                                  }
                              ],
                              "description": "<p>Your catalogue on Fynd Platform is readily usable on Facebook Commerce Manager. This app helps you transform your Fynd Platform catalogue into Facebook's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Facebook Commerce Manager to upload your products to Facebook Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Facebook marketplace to Fynd Platform using the exported CSV from Facebook Commerce Manager.</li>\n</ul>\n</li>\n</ul>",
                              "demo_url": "",
                              "video_url": []
                          },
                          "contact_info": {
                              "support": {
                                  "email": "piyushvishwakarma@gofynd.com",
                                  "phone": "7208229699",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "scope": [
                              "company/profile",
                              "company/product",
                              "company/application/catalogue"
                          ],
                          "plans": [
                              {
                                  "name": "Premium",
                                  "features": "Unlimited catalogue export   \nSchedule catalogue generation\nView export event history ",
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
                          "extension_id": "61155f5d95dcfad8294091c4",
                          "slug": "amazon-catalogue",
                          "plan_type": "recurring",
                          "plans_url": "",
                          "current_status": "active",
                          "organization_id": "6111ec0095dcfac23e408dd1",
                          "created_at": "2021-09-21T05:07:09.208Z",
                          "modified_at": "2022-03-21T12:27:07.601Z",
                          "coming_soon": {
                              "upvote_count": 0
                          },
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f45a",
                                      "_id": "62320b45f4213eb19aa8f45a",
                                      "slug": "customer-service"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f45c",
                                      "_id": "62320b45f4213eb19aa8f45c",
                                      "slug": "channel-management"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f4f4",
                                      "_id": "62320b45f4213eb19aa8f4f4",
                                      "parent": "62320b45f4213eb19aa8f45c",
                                      "slug": "shipping-solution"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4e9",
                                      "_id": "62320b45f4213eb19aa8f4e9",
                                      "parent": "62320b45f4213eb19aa8f45c",
                                      "slug": "channel-management-internalization"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4d6",
                                      "_id": "62320b45f4213eb19aa8f4d6",
                                      "parent": "62320b45f4213eb19aa8f45a",
                                      "slug": "customer-account"
                                  }
                              ]
                          },
                          "organization": {
                              "name": "Piyush Org",
                              "slug": "Piyush-ph2-25"
                          }
                      },
                      "organization": {
                          "name": "Piyush Org",
                          "slug": "Piyush-ph2-25"
                      },
                      "text": "Amazon Catalogue",
                      "value": "61155f5d95dcfad8294091c4",
                      "label": "Extensions"
                  },
                  {
                      "_id": "61138cf895dcfa08a5408fc4",
                      "description": "Newsletter local by aayush",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "is_application_level": true,
                      "is_saleschannel": false,
                      "scope": [
                          "company/saleschannel",
                          "company/application/settings"
                      ],
                      "name": "Newsletter-Local-Aayush",
                      "base_url": "https://example-javascript-001.loca.lt",
                      "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png",
                      "callbacks": {
                          "setup": "https://example-javascript-001.loca.lt/fp/setup",
                          "auth": "https://example-javascript-001.loca.lt/fp/auth",
                          "install": "https://example-javascript-001.loca.lt/fp/install",
                          "uninstall": "https://example-javascript-001.loca.lt/fp/uninstall"
                      },
                      "developed_by_name": "Fynd",
                      "contact_email": "regrowth@gofynd.com",
                      "organization_id": "610d178e2ab8f356aa98481b",
                      "created_at": "2021-08-11T08:40:24.109Z",
                      "modified_at": "2022-03-04T07:46:02.077Z",
                      "__v": 0,
                      "is_coming_soon": false,
                      "extension_public_data": {
                          "_id": "6113c85841dc073aebc38f5f",
                          "listing_info": {
                              "keywords": [],
                              "name": "Newsletter-Local-Aayush",
                              "tagline": "This is tagline for test2",
                              "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/cKylPAkW_-desk-sc-1.png"
                                  ],
                                  "mobile": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LqwXrhZGR-mob-sc-1.png"
                                  ]
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "6113c85841dc074febc38f60",
                                      "title": "feature 1",
                                      "description": "feature 1"
                                  }
                              ],
                              "description": "Newsletter local by aayush",
                              "demo_url": "",
                              "video_url": []
                          },
                          "contact_info": {
                              "support": {
                                  "email": "regrowth@gofynd.com",
                                  "phone": "8767087087",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "scope": [
                              "company/saleschannel",
                              "company/application/settings"
                          ],
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
                          "extension_id": "61138cf895dcfa08a5408fc4",
                          "slug": "newsletter-local-aayush",
                          "plan_type": "free",
                          "plans_url": "",
                          "current_status": "active",
                          "organization_id": "610d178e2ab8f356aa98481b",
                          "created_at": "2021-08-11T12:53:45.001Z",
                          "modified_at": "2022-03-21T12:27:06.810Z",
                          "coming_soon": {
                              "upvote_count": 0
                          },
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f455",
                                      "_id": "62320b45f4213eb19aa8f455",
                                      "slug": "fulfillment"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f4cb",
                                      "_id": "62320b45f4213eb19aa8f4cb",
                                      "parent": "62320b45f4213eb19aa8f455",
                                      "slug": "managing-inventory-and-order"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4cd",
                                      "_id": "62320b45f4213eb19aa8f4cd",
                                      "parent": "62320b45f4213eb19aa8f455",
                                      "slug": "managing-order"
                                  }
                              ]
                          },
                          "organization": {
                              "name": "Fynd",
                              "slug": "Fynd-s8f-32"
                          }
                      },
                      "organization": {
                          "name": "Fynd",
                          "slug": "Fynd-s8f-32"
                      },
                      "text": "Newsletter-Local-Aayush",
                      "value": "61138cf895dcfa08a5408fc4",
                      "label": "Extensions"
                  }
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "611624ac95dcfa262740920e"
              },
              {
                  "value": "6116026a95dcfa05eb4091e3"
              },
              {
                  "value": "61155f5d95dcfad8294091c4"
              },
              {
                  "value": "61138cf895dcfa08a5408fc4"
              }
          ]
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
          "page_type": "extension",
          "type": "extension_grid",
          "data": {
              "heading": "TOP FREE",
              "title": "Free extensions for you",
              "subtitle": "to to install",
              "button_label": "View All",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "extension": [
                  "60be66a2d4cbbf1fd0a67c8c",
                  "609400409d0dcbdc2e6b76a5",
                  "610d2ad295dcfa14eb408bad"
              ],
              "extension_details": [
                  {
                      "_id": "60be66a2d4cbbf1fd0a67c8c",
                      "description": "",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "scope": [
                          "company/saleschannel"
                      ],
                      "name": "newsletter-local Brijesh",
                      "base_url": "https://newsletter-sub-008.loca.lt",
                      "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png",
                      "callbacks": {
                          "setup": "https://newsletter-sub-008.loca.lt/fp/setup",
                          "auth": "https://newsletter-sub-008.loca.lt/fp/auth",
                          "install": "https://newsletter-sub-008.loca.lt/fp/install",
                          "uninstall": "https://newsletter-sub-008.loca.lt/fp/uninstall"
                      },
                      "developed_by_name": "Social Icons Company",
                      "contact_email": "brijeshgajjar@gofynd.com",
                      "organization_id": "610d3a4595dcfae682408c07",
                      "created_at": "2021-06-07T18:34:10.795Z",
                      "modified_at": "2022-04-29T07:22:36.929Z",
                      "__v": 0,
                      "is_application_level": true,
                      "is_saleschannel": false,
                      "is_coming_soon": false,
                      "extension_public_data": {
                          "_id": "626b92f7f36a77f7b0517b87",
                          "category": {
                              "categories_l1": [],
                              "categories_l2": []
                          },
                          "listing_info": {
                              "keywords": [],
                              "name": "newsletter-local Brijesh",
                              "tagline": "test",
                              "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pX9zldCt8-desk-sc-1.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LvtKWCCZF-desk-sc-3.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pjqTQJKfF-desk-sc-3.jpeg"
                                  ],
                                  "mobile": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/hJZfpuvZo-mob-sc-2.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/i2pysVdSu-mob-sc-3.jpeg",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/u7sf_tXdN-mob-sc-3.jpeg"
                                  ]
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "626b9420f36a773678517bbf",
                                      "title": "Test",
                                      "description": "test"
                                  }
                              ],
                              "video_url": [],
                              "description": "<p>Test</p>",
                              "demo_url": ""
                          },
                          "contact_info": {
                              "support": {
                                  "email": "brijeshgajjar@gofynd.com",
                                  "phone": "8452996729",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "coming_soon": {
                              "upvote_count": 0,
                              "is_coming_soon": false
                          },
                          "scope": [
                              "company/saleschannel"
                          ],
                          "plans": [
                              {
                                  "name": "Free",
                                  "features": "test",
                                  "type": "free",
                                  "price": {
                                      "amount": 0,
                                      "currency": "INR"
                                  },
                                  "trial_days": 0,
                                  "additional_charges": ""
                              }
                          ],
                          "extension_id": "60be66a2d4cbbf1fd0a67c8c",
                          "slug": "newsletter-local-brijesh",
                          "plan_type": "free",
                          "plans_url": "",
                          "current_status": "active",
                          "organization_id": "610d3a4595dcfae682408c07",
                          "created_at": "2022-04-29T07:25:43.514Z",
                          "modified_at": "2022-04-29T07:30:40.646Z",
                          "organization": {
                              "name": "Social Icons Company",
                              "slug": "Social-asx-16"
                          }
                      },
                      "organization": {
                          "name": "Social Icons Company",
                          "slug": "Social-asx-16"
                      },
                      "text": "newsletter-local Brijesh",
                      "value": "60be66a2d4cbbf1fd0a67c8c",
                      "label": "Extensions"
                  },
                  {
                      "_id": "609400409d0dcbdc2e6b76a5",
                      "description": "Newsletter Subscription\nNewsletter Subscription",
                      "whitelisted_urls": [],
                      "ext_version": "1.0",
                      "extention_type": "public",
                      "scope": [
                          "company/saleschannel",
                          "company/application/settings"
                      ],
                      "name": "Newsletter Subscription",
                      "base_url": "https://newsletter.extensions.fyndx0.de",
                      "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png",
                      "callbacks": {
                          "setup": "https://newsletter.extensions.fyndx0.de/fp/setup",
                          "auth": "https://newsletter.extensions.fyndx0.de/fp/auth",
                          "install": "https://newsletter.extensions.fyndx0.de/fp/install",
                          "uninstall": "https://newsletter.extensions.fyndx0.de/fp/uninstall"
                      },
                      "developed_by_name": "Fynd",
                      "contact_email": "brijeshgajjar@gofynd.com",
                      "organization_id": "610d178e2ab8f356aa98481b",
                      "created_at": "2021-05-06T14:42:08.318Z",
                      "modified_at": "2022-02-09T06:54:58.104Z",
                      "__v": 2,
                      "is_application_level": true,
                      "is_saleschannel": false,
                      "is_coming_soon": false,
                      "extension_public_data": {
                          "_id": "60bf7f734fe0a3c8e90e5b83",
                          "listing_info": {
                              "keywords": [],
                              "name": "Newsletter Subscription",
                              "tagline": "dsvsv",
                              "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nKlrV_01V-desk-sc-1.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/UZ0zmE2sW-desk-sc-2.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/cGtO7qpge-desk-sc-3.png"
                                  ],
                                  "mobile": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/10Twf0N0R-mob-sc-1.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/CRHrGZf5n-mob-sc-2.png",
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nDsWxx2rB-mob-sc-3.png"
                                  ]
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "623db9405ce44ba088b9c5bc",
                                      "title": "dsvsv",
                                      "description": "dvssdvdvdv"
                                  }
                              ],
                              "description": "<p>Now you can run referral campaigns that lets you and your existing customers refer their friends and family to register on your website.<br /><br />Features<br />&bull; Configure reward for the referrer<br />&bull; Configure reward for the one being referred<br />&bull; Set validity of referral and the reward<br />&bull; Enable/Disable referral campaigns</p>",
                              "demo_url": "",
                              "video_url": []
                          },
                          "contact_info": {
                              "support": {
                                  "email": "aayushvjain@gofynd.com",
                                  "phone": "8767087087",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "scope": [
                              "company/saleschannel",
                              "company/application/settings"
                          ],
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
                          "extension_id": "609400409d0dcbdc2e6b76a5",
                          "slug": "newsletter-subscription",
                          "plan_type": "free",
                          "current_status": "active",
                          "organization_id": "610d178e2ab8f356aa98481b",
                          "created_at": "2021-06-08T14:32:19.574Z",
                          "modified_at": "2022-03-25T12:44:48.325Z",
                          "plans_url": "",
                          "coming_soon": {
                              "upvote_count": 0,
                              "is_coming_soon": false
                          },
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f44c",
                                      "slug": "marketing",
                                      "_id": "62320b45f4213eb19aa8f44c"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f4aa",
                                      "slug": "advertisement",
                                      "_id": "62320b45f4213eb19aa8f4aa",
                                      "parent": "62320b45f4213eb19aa8f44c"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f4c6",
                                      "slug": "marketing-analytics",
                                      "_id": "62320b45f4213eb19aa8f4c6",
                                      "parent": "62320b45f4213eb19aa8f44c"
                                  }
                              ]
                          },
                          "organization": {
                              "name": "Fynd",
                              "slug": "Fynd-s8f-32"
                          }
                      },
                      "organization": {
                          "name": "Fynd",
                          "slug": "Fynd-s8f-32"
                      },
                      "text": "Newsletter Subscription",
                      "value": "609400409d0dcbdc2e6b76a5",
                      "label": "Extensions"
                  },
                  {
                      "_id": "610d2ad295dcfa14eb408bad",
                      "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                      "whitelisted_urls": [],
                      "ext_version": "1.0.0",
                      "extention_type": "public",
                      "is_application_level": true,
                      "is_saleschannel": false,
                      "scope": [
                          "company/saleschannel",
                          "company/application/marketing"
                      ],
                      "name": "Bulk Coupons Generator",
                      "base_url": "https://bulkcoupon.extensions.fyndx0.de",
                      "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png",
                      "callbacks": {
                          "setup": "https://bulkcoupon.extensions.fyndx0.de/fp/setup",
                          "auth": "https://bulkcoupon.extensions.fyndx0.de/fp/auth",
                          "install": "https://bulkcoupon.extensions.fyndx0.de/fp/install",
                          "uninstall": "https://bulkcoupon.extensions.fyndx0.de/fp/uninstall",
                          "auto_install": "https://bulkcoupon.extensions.fyndx0.de/fp/auto_install"
                      },
                      "developed_by_name": "Rushabh Shah",
                      "contact_email": "rushabhmshah@gofynd.com",
                      "organization_id": "610d29f395dcfaba6b408ba6",
                      "created_at": "2021-08-06T12:28:02.036Z",
                      "modified_at": "2022-02-28T15:56:31.338Z",
                      "__v": 0,
                      "is_coming_soon": false,
                      "extension_public_data": {
                          "_id": "621cf0c006962803b4cd780d",
                          "category": {
                              "categories_l1": [
                                  {
                                      "id": "62320b45f4213eb19aa8f44e",
                                      "_id": "62320b45f4213eb19aa8f44e",
                                      "slug": "merchandising"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f458",
                                      "_id": "62320b45f4213eb19aa8f458",
                                      "slug": "source-and-selling-product"
                                  }
                              ],
                              "categories_l2": [
                                  {
                                      "id": "62320b45f4213eb19aa8f4e5",
                                      "_id": "62320b45f4213eb19aa8f4e5",
                                      "parent": "62320b45f4213eb19aa8f458",
                                      "slug": "marketplace"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f480",
                                      "_id": "62320b45f4213eb19aa8f480",
                                      "parent": "62320b45f4213eb19aa8f44e",
                                      "slug": "announcement-and-banner"
                                  },
                                  {
                                      "id": "62320b45f4213eb19aa8f486",
                                      "_id": "62320b45f4213eb19aa8f486",
                                      "parent": "62320b45f4213eb19aa8f44e",
                                      "slug": "additional-purchase"
                                  }
                              ]
                          },
                          "listing_info": {
                              "keywords": [],
                              "name": "Bulk Coupons Generator",
                              "tagline": "Test",
                              "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png"
                          },
                          "details": {
                              "screenshots": {
                                  "desktop": [
                                      "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/fQ_yjdowj-desk-sc-1.jpeg"
                                  ],
                                  "mobile": []
                              },
                              "integrations": [],
                              "benefits": [
                                  {
                                      "_id": "621cf0c00696281d1dcd780e",
                                      "title": "Test",
                                      "description": "test"
                                  }
                              ],
                              "video_url": [],
                              "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                              "demo_url": ""
                          },
                          "contact_info": {
                              "support": {
                                  "email": "rushabhmshah@gofynd.com",
                                  "phone": "9930630722",
                                  "website_url": "",
                                  "faq_url": "",
                                  "privacy_policy_url": ""
                              }
                          },
                          "coming_soon": {
                              "upvote_count": 0,
                              "is_coming_soon": false
                          },
                          "scope": [
                              "company/saleschannel",
                              "company/application/marketing"
                          ],
                          "plans": [
                              {
                                  "name": "Standard Plan",
                                  "features": "Standard feature\nStandard feature\nStandard feature",
                                  "type": "recurring",
                                  "price": {
                                      "amount": 99,
                                      "currency": "INR"
                                  },
                                  "trial_days": 0,
                                  "additional_charges": "",
                                  "recurring": {
                                      "type": "month",
                                      "recurring_time": 30,
                                      "yearly_amount": 1188
                                  }
                              },
                              {
                                  "name": "Premium Plan",
                                  "features": "Premium Feature\nPremium Feature\nPremium Feature",
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
                          "extension_id": "610d2ad295dcfa14eb408bad",
                          "slug": "bulk-coupons-generator",
                          "plan_type": "recurring",
                          "plans_url": "",
                          "current_status": "active",
                          "organization_id": "610d29f395dcfaba6b408ba6",
                          "created_at": "2022-02-28T15:56:48.806Z",
                          "modified_at": "2022-03-21T12:27:08.714Z",
                          "organization": {
                              "name": "Rushabh Shah",
                              "slug": "Rushab-omn-2"
                          }
                      },
                      "organization": {
                          "name": "Rushabh Shah",
                          "slug": "Rushab-omn-2"
                      },
                      "text": "Bulk Coupons Generator",
                      "value": "610d2ad295dcfa14eb408bad",
                      "label": "Extensions"
                  }
              ]
          },
          "item_type": "extension",
          "items": [
              {
                  "value": "60be66a2d4cbbf1fd0a67c8c"
              },
              {
                  "value": "609400409d0dcbdc2e6b76a5"
              },
              {
                  "value": "610d2ad295dcfa14eb408bad"
              }
          ]
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
          "page_type": "extension",
          "type": "category_item_list",
          "data": {
              "heading": "H",
              "title": "T",
              "subtitle": "ST",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "top_right",
              "item_source": "manual",
              "category": [
                  "629461b2e6bf3c5f04e4f63d",
                  "629461b2e6bf3c5f04e4f64a",
                  "629461b2e6bf3c5f04e4f646"
              ],
              "category_details": [
                  {
                      "key": "l1",
                      "id": "629461b2e6bf3c5f04e4f63d",
                      "_id": "629461b2e6bf3c5f04e4f63d",
                      "display": "Marketing",
                      "value": "629461b2e6bf3c5f04e4f63d",
                      "slug": "marketing",
                      "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                      "childs": [
                          {
                              "key": "l2",
                              "id": "629461b2e6bf3c5f04e4f695",
                              "_id": "629461b2e6bf3c5f04e4f695",
                              "display": "Email and SMS marketing",
                              "value": "Email and SMS marketing",
                              "parent": "629461b2e6bf3c5f04e4f63d",
                              "slug": "email-and-sms-marketing",
                              "display_type": "checkbox",
                              "kind": "multivalues",
                              "type": "category_filter_l2",
                              "count": 16
                          },
                          {
                              "key": "l2",
                              "id": "629461b2e6bf3c5f04e4f692",
                              "_id": "629461b2e6bf3c5f04e4f692",
                              "display": "Notification",
                              "value": "Notification",
                              "parent": "629461b2e6bf3c5f04e4f63d",
                              "slug": "notification",
                              "display_type": "checkbox",
                              "kind": "multivalues",
                              "type": "category_filter_l2",
                              "count": 10
                          },
                          {
                              "key": "l2",
                              "id": "629461b3e6bf3c5f04e4f6b5",
                              "_id": "629461b3e6bf3c5f04e4f6b5",
                              "display": "Page enhancement",
                              "value": "Page enhancement",
                              "parent": "629461b2e6bf3c5f04e4f63d",
                              "slug": "page-enhancement",
                              "display_type": "checkbox",
                              "kind": "multivalues",
                              "type": "category_filter_l2",
                              "count": 12
                          },
                          {
                              "key": "l2",
                              "id": "629461b3e6bf3c5f04e4f6b8",
                              "_id": "629461b3e6bf3c5f04e4f6b8",
                              "display": "Advertisement",
                              "value": "Advertisement",
                              "parent": "629461b2e6bf3c5f04e4f63d",
                              "slug": "advertisement",
                              "display_type": "checkbox",
                              "kind": "multivalues",
                              "type": "category_filter_l2",
                              "count": 13
                          },
                          {
                              "key": "l2",
                              "id": "629461b3e6bf3c5f04e4f6be",
                              "_id": "629461b3e6bf3c5f04e4f6be",
                              "display": "Internalization",
                              "value": "Internalization",
                              "parent": "629461b2e6bf3c5f04e4f63d",
                              "slug": "marketing-internalization",
                              "display_type": "checkbox",
                              "kind": "multivalues",
                              "type": "category_filter_l2",
                              "count": 14
                          },
                          {
                              "key": "l2",
                              "id": "629461b3e6bf3c5f04e4f6bb",
                              "_id": "629461b3e6bf3c5f04e4f6bb",
                              "display": "Marketing analytics",
                              "value": "Marketing analytics",
                              "parent": "629461b2e6bf3c5f04e4f63d",
                              "slug": "marketing-analytics",
                              "display_type": "checkbox",
                              "kind": "multivalues",
                              "type": "category_filter_l2",
                              "count": 13
                          }
                      ],
                      "kind": "single",
                      "display_type": "radio",
                      "type": "category_filter_l1",
                      "count": 37,
                      "text": "Marketing"
                  },
                  {
                      "key": "l1",
                      "id": "629461b2e6bf3c5f04e4f64a",
                      "_id": "629461b2e6bf3c5f04e4f64a",
                      "display": "Source and Selling Product",
                      "value": "629461b2e6bf3c5f04e4f64a",
                      "slug": "source-and-selling-product",
                      "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                      "childs": [
                          {
                              "key": "l2",
                              "id": "629461b3e6bf3c5f04e4f6ce",
                              "_id": "629461b3e6bf3c5f04e4f6ce",
                              "display": "Marketplace",
                              "value": "Marketplace",
                              "parent": "629461b2e6bf3c5f04e4f64a",
                              "slug": "marketplace",
                              "display_type": "checkbox",
                              "kind": "multivalues",
                              "type": "category_filter_l2",
                              "count": 21
                          },
                          {
                              "key": "l2",
                              "id": "629461b3e6bf3c5f04e4f6cc",
                              "_id": "629461b3e6bf3c5f04e4f6cc",
                              "display": "Dropshipping",
                              "value": "Dropshipping",
                              "parent": "629461b2e6bf3c5f04e4f64a",
                              "slug": "dropshipping",
                              "display_type": "checkbox",
                              "kind": "multivalues",
                              "type": "category_filter_l2",
                              "count": 21
                          }
                      ],
                      "kind": "single",
                      "display_type": "radio",
                      "type": "category_filter_l1",
                      "count": 36,
                      "text": "Source and Selling Product"
                  },
                  {
                      "key": "l1",
                      "id": "629461b2e6bf3c5f04e4f646",
                      "_id": "629461b2e6bf3c5f04e4f646",
                      "display": "Customer Service",
                      "value": "629461b2e6bf3c5f04e4f646",
                      "slug": "customer-service",
                      "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                      "childs": [
                          {
                              "key": "l2",
                              "id": "629461b3e6bf3c5f04e4f6c6",
                              "_id": "629461b3e6bf3c5f04e4f6c6",
                              "display": "Support",
                              "value": "Support",
                              "parent": "629461b2e6bf3c5f04e4f646",
                              "slug": "support",
                              "display_type": "checkbox",
                              "kind": "multivalues",
                              "type": "category_filter_l2",
                              "count": 19
                          },
                          {
                              "key": "l2",
                              "id": "629461b3e6bf3c5f04e4f6c8",
                              "_id": "629461b3e6bf3c5f04e4f6c8",
                              "display": "Customer account",
                              "value": "Customer account",
                              "parent": "629461b2e6bf3c5f04e4f646",
                              "slug": "customer-account",
                              "display_type": "checkbox",
                              "kind": "multivalues",
                              "type": "category_filter_l2",
                              "count": 23
                          }
                      ],
                      "kind": "single",
                      "display_type": "radio",
                      "type": "category_filter_l1",
                      "count": 38,
                      "text": "Customer Service"
                  }
              ]
          },
          "item_type": "category",
          "items": [
              {
                  "value": "629461b2e6bf3c5f04e4f63d"
              },
              {
                  "value": "629461b2e6bf3c5f04e4f64a"
              },
              {
                  "value": "629461b2e6bf3c5f04e4f646"
              }
          ]
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
          "page_type": "all",
          "type": "banner",
          "data": {
              "heading": "Banner",
              "title": "Banner",
              "subtitle": "Banner Subtitle",
              "image": "https://hdn-1.addsale.com/x0/platform/pictures/partner-feature-image/original/_APcxzEiu-BSUMhjxhp-8OGhZsCWy-extension-image-1655268946947.jpeg",
              "image_position": "right",
              "button_label": "Gheun Taak",
              "button_page_link": "Extensions List"
          },
          "items": []
      }
  ]
}

module.exports.updateHomePayload = {
    "_id": "6294abba16cd26002faff08c",
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
          "heading": "Fynd Extensions ",
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
          "extension": [
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
            "609400409d0dcbdc2e6b76a5",
            "60be66a2d4cbbf1fd0a67c8c",
            "610d2ad295dcfa14eb408bad"
          ]
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
        "items": [
          {
            "_id": "629461b2e6bf3c5f04e4f63a",
            "level": 1,
            "slug": "conversion",
            "__v": 0,
            "description": "description for this category in not more than 2 lines",
            "display": "Conversion",
            "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
            "value": "Conversion"
          },
          {
            "_id": "629461b2e6bf3c5f04e4f63d",
            "level": 1,
            "slug": "marketing",
            "__v": 0,
            "description": "description for this category in not more than 2 lines",
            "display": "Marketing",
            "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
            "value": "Marketing"
          },
          {
            "_id": "629461b2e6bf3c5f04e4f63c",
            "level": 1,
            "slug": "merchandising",
            "__v": 0,
            "description": "description for this category in not more than 2 lines",
            "display": "Merchandising",
            "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
            "value": "Merchandising"
          },
          {
            "_id": "629461b2e6bf3c5f04e4f646",
            "level": 1,
            "slug": "customer-service",
            "__v": 0,
            "description": "description for this category in not more than 2 lines",
            "display": "Customer Service",
            "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
            "value": "Customer Service"
          }
        ],
        "data": {
          "heading": "CATEGORIES",
          "title": "Extensions organized as per their genre",
          "subtitle": "Subtitle",
          "button_label": "View All",
          "button_page_link": "/extensions",
          "button_position": "bottom_center",
          "item_source": "manual",
          "category": [
            {
              "_id": "629461b2e6bf3c5f04e4f63a",
              "level": 1,
              "slug": "conversion",
              "__v": 0,
              "description": "description for this category in not more than 2 lines",
              "display": "Conversion",
              "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
              "value": "Conversion"
            },
            {
              "_id": "629461b2e6bf3c5f04e4f63c",
              "level": 1,
              "slug": "merchandising",
              "__v": 0,
              "description": "description for this category in not more than 2 lines",
              "display": "Merchandising",
              "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
              "value": "Merchandising"
            },
            {
              "_id": "629461b2e6bf3c5f04e4f63d",
              "level": 1,
              "slug": "marketing",
              "__v": 0,
              "description": "description for this category in not more than 2 lines",
              "display": "Marketing",
              "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
              "value": "Marketing"
            },
            {
              "_id": "629461b2e6bf3c5f04e4f645",
              "level": 1,
              "slug": "fulfillment",
              "__v": 0,
              "description": "description for this category in not more than 2 lines",
              "display": "Fulfillment",
              "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
              "value": "Fulfillment"
            },
            "Conversion",
            "Merchandising",
            "Marketing"
          ]
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
        "type": "collection_grid",
        "data": {
          "heading": "Collections",
          "title": "Latest",
          "subtitle": "Subtitle",
          "button_label": "View",
          "button_page_link": "Collections",
          "item_source": "manual",
          "image": "",
          "image_position": "",
          "collection": [
            "623847d0ec3c4b10b1f5fed6",
            "623b4d518087776e618af270",
            "627ba8371171f7705212333b",
            "62384f66ec3c4b4e6ff5fee6"
          ]
        },
        "items": []
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
        "page_type": "extension",
        "type": "extension_grid",
        "data": {
          "heading": "Latest Extensions",
          "title": "Extensions",
          "subtitle": "Subtitle",
          "button_label": "View",
          "button_page_link": "Collections",
          "item_source": "manual",
          "image": "",
          "image_position": "",
          "extension": [
            "610d2ad295dcfa14eb408bad",
            "60be66a2d4cbbf1fd0a67c8c",
            "609400409d0dcbdc2e6b76a5"
          ]
        }
      }
    ],
    "props": [],
    "modified_at": "2022-05-31T10:25:10.230Z",
    "__v": 2,
    "value": "extension-home",
    "text": "extension-home"
}

module.exports.updateHomeResponse = {
    "custom_meta": [],
    "_id": "6294abba16cd26002faff08c",
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
          "heading": "Fynd Extensions ",
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
          "extension": [
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
            "609400409d0dcbdc2e6b76a5",
            "60be66a2d4cbbf1fd0a67c8c",
            "610d2ad295dcfa14eb408bad"
          ]
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
        "items": [
          {
            "_id": "629461b2e6bf3c5f04e4f63a",
            "level": 1,
            "slug": "conversion",
            "__v": 0,
            "description": "description for this category in not more than 2 lines",
            "display": "Conversion",
            "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
            "value": "Conversion"
          },
          {
            "_id": "629461b2e6bf3c5f04e4f63d",
            "level": 1,
            "slug": "marketing",
            "__v": 0,
            "description": "description for this category in not more than 2 lines",
            "display": "Marketing",
            "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
            "value": "Marketing"
          },
          {
            "_id": "629461b2e6bf3c5f04e4f63c",
            "level": 1,
            "slug": "merchandising",
            "__v": 0,
            "description": "description for this category in not more than 2 lines",
            "display": "Merchandising",
            "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
            "value": "Merchandising"
          },
          {
            "_id": "629461b2e6bf3c5f04e4f646",
            "level": 1,
            "slug": "customer-service",
            "__v": 0,
            "description": "description for this category in not more than 2 lines",
            "display": "Customer Service",
            "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
            "value": "Customer Service"
          }
        ],
        "data": {
          "heading": "CATEGORIES",
          "title": "Extensions organized as per their genre",
          "subtitle": "Subtitle",
          "button_label": "View All",
          "button_page_link": "/extensions",
          "button_position": "bottom_center",
          "item_source": "manual",
          "category": [
            {
              "_id": "629461b2e6bf3c5f04e4f63a",
              "level": 1,
              "slug": "conversion",
              "__v": 0,
              "description": "description for this category in not more than 2 lines",
              "display": "Conversion",
              "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
              "value": "Conversion"
            },
            {
              "_id": "629461b2e6bf3c5f04e4f63c",
              "level": 1,
              "slug": "merchandising",
              "__v": 0,
              "description": "description for this category in not more than 2 lines",
              "display": "Merchandising",
              "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
              "value": "Merchandising"
            },
            {
              "_id": "629461b2e6bf3c5f04e4f63d",
              "level": 1,
              "slug": "marketing",
              "__v": 0,
              "description": "description for this category in not more than 2 lines",
              "display": "Marketing",
              "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
              "value": "Marketing"
            },
            {
              "_id": "629461b2e6bf3c5f04e4f645",
              "level": 1,
              "slug": "fulfillment",
              "__v": 0,
              "description": "description for this category in not more than 2 lines",
              "display": "Fulfillment",
              "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
              "value": "Fulfillment"
            },
            "Conversion",
            "Merchandising",
            "Marketing"
          ]
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
        "type": "collection_grid",
        "data": {
          "heading": "Collections",
          "title": "Latest",
          "subtitle": "Subtitle",
          "button_label": "View",
          "button_page_link": "Collections",
          "item_source": "manual",
          "image": "",
          "image_position": "",
          "collection": [
            "623847d0ec3c4b10b1f5fed6",
            "623b4d518087776e618af270",
            "627ba8371171f7705212333b",
            "62384f66ec3c4b4e6ff5fee6"
          ]
        },
        "items": []
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
        "page_type": "extension",
        "type": "extension_grid",
        "data": {
          "heading": "Latest Extensions",
          "title": "Extensions",
          "subtitle": "Subtitle",
          "button_label": "View",
          "button_page_link": "Collections",
          "item_source": "manual",
          "image": "",
          "image_position": "",
          "extension": [
            "610d2ad295dcfa14eb408bad",
            "60be66a2d4cbbf1fd0a67c8c",
            "609400409d0dcbdc2e6b76a5"
          ]
        }
      }
    ],
    "props": [],
    "created_at": "2022-05-30T11:34:18.217Z",
    "modified_at": "2022-05-31T10:25:10.230Z",
    "__v": 2
}

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

module.exports.fetchPublicExtensions = {
  "items": [
      {
          "_id": "610d2ad295dcfa14eb408bad",
          "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/saleschannel",
              "company/application/marketing"
          ],
          "name": "Bulk Coupons Generator",
          "base_url": "https://bulkcoupon.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png"
          },
          "callbacks": {
              "setup": "https://bulkcoupon.extensions.fyndx0.de/fp/setup",
              "auth": "https://bulkcoupon.extensions.fyndx0.de/fp/auth",
              "install": "https://bulkcoupon.extensions.fyndx0.de/fp/install",
              "uninstall": "https://bulkcoupon.extensions.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Rushabh Shah",
          "contact_email": "rushabhmshah@gofynd.com",
          "organization_id": "610d29f395dcfaba6b408ba6",
          "created_at": "2021-08-06T12:28:02.036Z",
          "modified_at": "2022-02-28T15:56:31.338Z",
          "__v": 0,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "621cf0c006962803b4cd780d",
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f44e",
                          "_id": "62320b45f4213eb19aa8f44e",
                          "slug": "merchandising"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f458",
                          "_id": "62320b45f4213eb19aa8f458",
                          "slug": "source-and-selling-product"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4e5",
                          "_id": "62320b45f4213eb19aa8f4e5",
                          "parent": "62320b45f4213eb19aa8f458",
                          "slug": "marketplace"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f480",
                          "_id": "62320b45f4213eb19aa8f480",
                          "parent": "62320b45f4213eb19aa8f44e",
                          "slug": "announcement-and-banner"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f486",
                          "_id": "62320b45f4213eb19aa8f486",
                          "parent": "62320b45f4213eb19aa8f44e",
                          "slug": "additional-purchase"
                      }
                  ]
              },
              "listing_info": {
                  "keywords": [],
                  "name": "Bulk Coupons Generator",
                  "tagline": "Test",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/fQ_yjdowj-desk-sc-1.jpeg"
                      ],
                      "mobile": []
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "621cf0c00696281d1dcd780e",
                          "title": "Test",
                          "description": "test"
                      }
                  ],
                  "video_url": [],
                  "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                  "demo_url": ""
              },
              "contact_info": {
                  "support": {
                      "email": "rushabhmshah@gofynd.com",
                      "phone": "9930630722",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": false
              },
              "scope": [
                  "company/saleschannel",
                  "company/application/marketing"
              ],
              "plans": [
                  {
                      "name": "Standard Plan",
                      "features": "Standard feature\nStandard feature\nStandard feature",
                      "type": "recurring",
                      "price": {
                          "amount": 99,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": "",
                      "recurring": {
                          "type": "month",
                          "recurring_time": 30,
                          "yearly_amount": 1188
                      }
                  },
                  {
                      "name": "Premium Plan",
                      "features": "Premium Feature\nPremium Feature\nPremium Feature",
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
              "extension_id": "610d2ad295dcfa14eb408bad",
              "slug": "bulk-coupons-generator",
              "plan_type": "recurring",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "610d29f395dcfaba6b408ba6",
              "created_at": "2022-02-28T15:56:48.806Z",
              "modified_at": "2022-03-21T12:27:08.714Z",
              "organization": {
                  "name": "Rushabh Shah",
                  "slug": "Rushab-omn-2"
              }
          },
          "organization": {
              "name": "Rushabh Shah",
              "slug": "Rushab-omn-2"
          }
      },
      {
          "_id": "60be66a2d4cbbf1fd0a67c8c",
          "description": "",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "scope": [
              "company/saleschannel"
          ],
          "name": "newsletter-local Brijesh",
          "base_url": "https://newsletter-sub-008.loca.lt",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
          },
          "callbacks": {
              "setup": "https://newsletter-sub-008.loca.lt/fp/setup",
              "auth": "https://newsletter-sub-008.loca.lt/fp/auth",
              "install": "https://newsletter-sub-008.loca.lt/fp/install",
              "uninstall": "https://newsletter-sub-008.loca.lt/fp/uninstall"
          },
          "developed_by_name": "Social Icons Company",
          "contact_email": "brijeshgajjar@gofynd.com",
          "organization_id": "610d3a4595dcfae682408c07",
          "created_at": "2021-06-07T18:34:10.795Z",
          "modified_at": "2022-04-29T07:22:36.929Z",
          "__v": 0,
          "is_application_level": true,
          "is_saleschannel": false,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "626b92f7f36a77f7b0517b87",
              "category": {
                  "categories_l1": [],
                  "categories_l2": []
              },
              "listing_info": {
                  "keywords": [],
                  "name": "newsletter-local Brijesh",
                  "tagline": "test",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pX9zldCt8-desk-sc-1.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LvtKWCCZF-desk-sc-3.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pjqTQJKfF-desk-sc-3.jpeg"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/hJZfpuvZo-mob-sc-2.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/i2pysVdSu-mob-sc-3.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/u7sf_tXdN-mob-sc-3.jpeg"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "626b9420f36a773678517bbf",
                          "title": "Test",
                          "description": "test"
                      }
                  ],
                  "video_url": [],
                  "description": "<p>Test</p>",
                  "demo_url": ""
              },
              "contact_info": {
                  "support": {
                      "email": "brijeshgajjar@gofynd.com",
                      "phone": "8452996729",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": false
              },
              "scope": [
                  "company/saleschannel"
              ],
              "plans": [
                  {
                      "name": "Free",
                      "features": "test",
                      "type": "free",
                      "price": {
                          "amount": 0,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": ""
                  }
              ],
              "extension_id": "60be66a2d4cbbf1fd0a67c8c",
              "slug": "newsletter-local-brijesh",
              "plan_type": "free",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "610d3a4595dcfae682408c07",
              "created_at": "2022-04-29T07:25:43.514Z",
              "modified_at": "2022-04-29T07:30:40.646Z",
              "organization": {
                  "name": "Social Icons Company",
                  "slug": "Social-asx-16"
              }
          },
          "organization": {
              "name": "Social Icons Company",
              "slug": "Social-asx-16"
          }
      },
      {
          "_id": "609400409d0dcbdc2e6b76a5",
          "description": "Newsletter Subscription\nNewsletter Subscription",
          "whitelisted_urls": [],
          "ext_version": "1.0",
          "extention_type": "public",
          "scope": [
              "company/saleschannel",
              "company/application/settings"
          ],
          "name": "Newsletter Subscription",
          "base_url": "https://newsletter.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
          },
          "callbacks": {
              "setup": "https://newsletter.extensions.fyndx0.de/fp/setup",
              "auth": "https://newsletter.extensions.fyndx0.de/fp/auth",
              "install": "https://newsletter.extensions.fyndx0.de/fp/install",
              "uninstall": "https://newsletter.extensions.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Fynd",
          "contact_email": "brijeshgajjar@gofynd.com",
          "organization_id": "610d178e2ab8f356aa98481b",
          "created_at": "2021-05-06T14:42:08.318Z",
          "modified_at": "2022-02-09T06:54:58.104Z",
          "__v": 2,
          "is_application_level": true,
          "is_saleschannel": false,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "60bf7f734fe0a3c8e90e5b83",
              "listing_info": {
                  "keywords": [],
                  "name": "Newsletter Subscription",
                  "tagline": "dsvsv",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nKlrV_01V-desk-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/UZ0zmE2sW-desk-sc-2.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/cGtO7qpge-desk-sc-3.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/10Twf0N0R-mob-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/CRHrGZf5n-mob-sc-2.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nDsWxx2rB-mob-sc-3.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "623db9405ce44ba088b9c5bc",
                          "title": "dsvsv",
                          "description": "dvssdvdvdv"
                      }
                  ],
                  "description": "<p>Now you can run referral campaigns that lets you and your existing customers refer their friends and family to register on your website.<br /><br />Features<br />&bull; Configure reward for the referrer<br />&bull; Configure reward for the one being referred<br />&bull; Set validity of referral and the reward<br />&bull; Enable/Disable referral campaigns</p>",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "aayushvjain@gofynd.com",
                      "phone": "8767087087",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/saleschannel",
                  "company/application/settings"
              ],
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
              "extension_id": "609400409d0dcbdc2e6b76a5",
              "slug": "newsletter-subscription",
              "plan_type": "free",
              "current_status": "active",
              "organization_id": "610d178e2ab8f356aa98481b",
              "created_at": "2021-06-08T14:32:19.574Z",
              "modified_at": "2022-03-25T12:44:48.325Z",
              "plans_url": "",
              "coming_soon": {
                  "upvote_count": 0,
                  "is_coming_soon": false
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f44c",
                          "slug": "marketing",
                          "_id": "62320b45f4213eb19aa8f44c"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4aa",
                          "slug": "advertisement",
                          "_id": "62320b45f4213eb19aa8f4aa",
                          "parent": "62320b45f4213eb19aa8f44c"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4c6",
                          "slug": "marketing-analytics",
                          "_id": "62320b45f4213eb19aa8f4c6",
                          "parent": "62320b45f4213eb19aa8f44c"
                      }
                  ]
              },
              "organization": {
                  "name": "Fynd",
                  "slug": "Fynd-s8f-32"
              }
          },
          "organization": {
              "name": "Fynd",
              "slug": "Fynd-s8f-32"
          }
      },
      {
          "_id": "61109c6795dcfa38cb408c70",
          "description": "Local tag manager",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": false,
          "is_saleschannel": false,
          "scope": [
              "company/saleschannel",
              "company/application/settings"
          ],
          "name": "Tag Manager Local",
          "base_url": "https://quiet-cow-22.loca.lt",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png"
          },
          "callbacks": {
              "setup": "https://quiet-cow-22.loca.lt/fp/setup",
              "auth": "https://quiet-cow-22.loca.lt/fp/auth",
              "install": "https://quiet-cow-22.loca.lt/fp/install",
              "uninstall": "https://quiet-cow-22.loca.lt/fp/uninstall"
          },
          "developed_by_name": "Akash Organization",
          "contact_email": "akashmane@gofynd.com",
          "organization_id": "6110967d95dcfaf485408c60",
          "created_at": "2021-08-09T03:09:27.392Z",
          "modified_at": "2021-09-09T04:40:50.398Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "61109ded41dc073111c38f59",
              "listing_info": {
                  "keywords": [],
                  "name": "Tag Manager Local",
                  "tagline": "Google Tag Manager",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/bNNRnl-IE-desk-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/P0IcHYNbA-desk-sc-2.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PlY2R2xgo-desk-sc-3.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/30gIT73MK-mob-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/XoAtVMhIn-mob-sc-2.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/XoAtVMhIn-mob-sc-2.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "61109ded41dc072bf4c38f5a",
                          "title": "Feature 1",
                          "description": "Description 1"
                      }
                  ],
                  "description": "Local tag manager",
                  "demo_url": "https://honest-rattlesnake-7.loca.lt/",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "akashmane@gofynd.com",
                      "phone": "8652523958",
                      "website_url": "https://honest-rattlesnake-7.loca.lt/",
                      "faq_url": "https://honest-rattlesnake-7.loca.lt/",
                      "privacy_policy_url": "https://honest-rattlesnake-7.loca.lt/"
                  }
              },
              "scope": [
                  "company/saleschannel",
                  "company/application/settings"
              ],
              "plans": [
                  {
                      "name": "Basic",
                      "features": "Basic ",
                      "type": "recurring",
                      "price": {
                          "amount": 99,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": "",
                      "recurring": {
                          "type": "month",
                          "recurring_time": 30,
                          "yearly_amount": 1188
                      }
                  }
              ],
              "extension_id": "61109c6795dcfa38cb408c70",
              "slug": "tag-manager-local",
              "plan_type": "recurring",
              "plans_url": "https://honest-rattlesnake-7.loca.lt/company/1/pricing",
              "current_status": "active",
              "organization_id": "6110967d95dcfaf485408c60",
              "created_at": "2021-08-09T03:15:57.074Z",
              "modified_at": "2022-03-21T12:27:06.809Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f45b",
                          "_id": "62320b45f4213eb19aa8f45b",
                          "slug": "inventory"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f45a",
                          "_id": "62320b45f4213eb19aa8f45a",
                          "slug": "customer-service"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4d9",
                          "_id": "62320b45f4213eb19aa8f4d9",
                          "parent": "62320b45f4213eb19aa8f45b",
                          "slug": "managing-inventory"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4d4",
                          "_id": "62320b45f4213eb19aa8f4d4",
                          "parent": "62320b45f4213eb19aa8f45a",
                          "slug": "support"
                      }
                  ]
              },
              "organization": {
                  "name": "Akash Organization",
                  "slug": "AkashO-2xk-98"
              }
          },
          "organization": {
              "name": "Akash Organization",
              "slug": "AkashO-2xk-98"
          }
      },
      {
          "_id": "61117dab95dcfa5db7408dba",
          "description": "Create and update multiple selling locations at once using Excel and CSV",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": false,
          "is_saleschannel": false,
          "scope": [
              "company/profile"
          ],
          "name": "Multi Location Manager",
          "base_url": "https://bulk-location.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/jaOfDVYGe-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/jaOfDVYGe-logo.png"
          },
          "callbacks": {
              "setup": "https://bulk-location.extensions.fyndx0.de/fp/setup",
              "auth": "https://bulk-location.extensions.fyndx0.de/fp/auth",
              "install": "https://bulk-location.extensions.fyndx0.de/fp/install",
              "uninstall": "https://bulk-location.extensions.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Multi Location",
          "contact_email": "abhinavmaurya@gofynd.com",
          "organization_id": "61117d3295dcfa7f9a408db3",
          "created_at": "2021-08-09T19:10:35.891Z",
          "modified_at": "2022-01-12T06:48:01.826Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "6111fc5841dc070042c38f5d",
              "listing_info": {
                  "keywords": [
                      "bulk",
                      "multi",
                      "locations"
                  ],
                  "name": "Multi Location Manager",
                  "tagline": "Create and update multiple selling locations at once using Excel and CSV",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/RUnu34gmJ-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Og8k9HyMY-desk-sc-1.png",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/M5VGePGD7-desk-sc-2.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/NMZQDEpZN-mob-sc-1.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "6111fc5841dc0705d7c38f5e",
                          "title": "Location Management",
                          "description": "Download our Excel or CSV template to add and update selling locations"
                      }
                  ],
                  "description": "Create and update multiple selling locations at once using Excel and CSV",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "abhinavmaurya@gofynd.com",
                      "phone": "7905339667",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/profile"
              ],
              "plans": [
                  {
                      "name": "Standard",
                      "features": "Create and update multiple selling locations at once using Excel and CSV",
                      "type": "recurring",
                      "price": {
                          "amount": 99,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": "",
                      "recurring": {
                          "type": "month",
                          "recurring_time": 30,
                          "yearly_amount": 1188
                      }
                  }
              ],
              "extension_id": "61117dab95dcfa5db7408dba",
              "slug": "multi-location-manager",
              "plan_type": "recurring",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "61117d3295dcfa7f9a408db3",
              "created_at": "2021-08-10T04:11:04.509Z",
              "modified_at": "2022-03-21T12:27:07.205Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f458",
                          "_id": "62320b45f4213eb19aa8f458",
                          "slug": "source-and-selling-product"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f45c",
                          "_id": "62320b45f4213eb19aa8f45c",
                          "slug": "channel-management"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4f4",
                          "_id": "62320b45f4213eb19aa8f4f4",
                          "parent": "62320b45f4213eb19aa8f45c",
                          "slug": "shipping-solution"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4ec",
                          "_id": "62320b45f4213eb19aa8f4ec",
                          "parent": "62320b45f4213eb19aa8f45c",
                          "slug": "operation"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4e5",
                          "_id": "62320b45f4213eb19aa8f4e5",
                          "parent": "62320b45f4213eb19aa8f458",
                          "slug": "marketplace"
                      }
                  ]
              },
              "organization": {
                  "name": "Abhinav",
                  "slug": "MultiL-fnm-55"
              }
          },
          "organization": {
              "name": "Abhinav",
              "slug": "MultiL-fnm-55"
          }
      },
      {
          "_id": "6111ec7e95dcfa8e12408dd8",
          "description": "Facebook Catalogue",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/profile",
              "company/product",
              "company/application/catalogue"
          ],
          "name": "Facebook Catalogue",
          "base_url": "https://facebook-ct.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/JdPFZDJ-y-logo.jpeg",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/JdPFZDJ-y-logo.jpeg"
          },
          "callbacks": {
              "setup": "https://facebook-ct.extensions.fyndx0.de/fp/setup",
              "auth": "https://facebook-ct.extensions.fyndx0.de/fp/auth",
              "install": "https://facebook-ct.extensions.fyndx0.de/fp/install",
              "uninstall": "https://facebook-ct.extensions.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Piyush Org",
          "contact_email": "piyushvishwakarma@gofynd.com",
          "organization_id": "6111ec0095dcfac23e408dd1",
          "created_at": "2021-08-10T03:03:26.683Z",
          "modified_at": "2022-02-02T09:11:04.485Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "6111fc2741dc07b7bbc38f5b",
              "listing_info": {
                  "keywords": [
                      "facebook"
                  ],
                  "name": "Facebook Catalogue",
                  "tagline": "Export products in Facebook compatible format",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/JdPFZDJ-y-logo.jpeg"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/TknKwu-cj-desk-sc-1.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Q30Y33G-c-mob-sc-1.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "6111fc2741dc070437c38f5c",
                          "title": "Catalogue Export",
                          "description": "Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager."
                      }
                  ],
                  "description": "<p>Your catalogue on Fynd Platform is readily usable on Facebook Commerce Manager. This app helps you transform your Fynd Platform catalogue into Facebook's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Facebook Commerce Manager to upload your products to Facebook Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Facebook marketplace to Fynd Platform using the exported CSV from Facebook Commerce Manager.</li>\n</ul>\n</li>\n</ul>",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "piyushvishwakarma@gofynd.com",
                      "phone": "7208229699",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/profile",
                  "company/product",
                  "company/application/catalogue"
              ],
              "plans": [
                  {
                      "name": "Premium",
                      "features": "Unlimited catalogue export   \nSchedule catalogue generation\nView export event history ",
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
              "extension_id": "6111ec7e95dcfa8e12408dd8",
              "slug": "facebook-catalogue",
              "plan_type": "recurring",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "6111ec0095dcfac23e408dd1",
              "created_at": "2021-08-10T04:10:15.269Z",
              "modified_at": "2022-03-21T12:27:06.810Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f44e",
                          "_id": "62320b45f4213eb19aa8f44e",
                          "slug": "merchandising"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f458",
                          "_id": "62320b45f4213eb19aa8f458",
                          "slug": "source-and-selling-product"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4e1",
                          "_id": "62320b45f4213eb19aa8f4e1",
                          "parent": "62320b45f4213eb19aa8f458",
                          "slug": "dropshipping"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f483",
                          "_id": "62320b45f4213eb19aa8f483",
                          "parent": "62320b45f4213eb19aa8f44e",
                          "slug": "product-display"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4e5",
                          "_id": "62320b45f4213eb19aa8f4e5",
                          "parent": "62320b45f4213eb19aa8f458",
                          "slug": "marketplace"
                      }
                  ]
              },
              "organization": {
                  "name": "Piyush Org",
                  "slug": "Piyush-ph2-25"
              }
          },
          "organization": {
              "name": "Piyush Org",
              "slug": "Piyush-ph2-25"
          }
      },
      {
          "_id": "61138cf895dcfa08a5408fc4",
          "description": "Newsletter local by aayush",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/saleschannel",
              "company/application/settings"
          ],
          "name": "Newsletter-Local-Aayush",
          "base_url": "https://example-javascript-001.loca.lt",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png"
          },
          "callbacks": {
              "setup": "https://example-javascript-001.loca.lt/fp/setup",
              "auth": "https://example-javascript-001.loca.lt/fp/auth",
              "install": "https://example-javascript-001.loca.lt/fp/install",
              "uninstall": "https://example-javascript-001.loca.lt/fp/uninstall"
          },
          "developed_by_name": "Fynd",
          "contact_email": "regrowth@gofynd.com",
          "organization_id": "610d178e2ab8f356aa98481b",
          "created_at": "2021-08-11T08:40:24.109Z",
          "modified_at": "2022-03-04T07:46:02.077Z",
          "__v": 0,
          "is_coming_soon": false,
          "extension_public_data": {
              "_id": "6113c85841dc073aebc38f5f",
              "listing_info": {
                  "keywords": [],
                  "name": "Newsletter-Local-Aayush",
                  "tagline": "This is tagline for test2",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/cKylPAkW_-desk-sc-1.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LqwXrhZGR-mob-sc-1.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "6113c85841dc074febc38f60",
                          "title": "feature 1",
                          "description": "feature 1"
                      }
                  ],
                  "description": "Newsletter local by aayush",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "regrowth@gofynd.com",
                      "phone": "8767087087",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/saleschannel",
                  "company/application/settings"
              ],
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
              "extension_id": "61138cf895dcfa08a5408fc4",
              "slug": "newsletter-local-aayush",
              "plan_type": "free",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "610d178e2ab8f356aa98481b",
              "created_at": "2021-08-11T12:53:45.001Z",
              "modified_at": "2022-03-21T12:27:06.810Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f455",
                          "_id": "62320b45f4213eb19aa8f455",
                          "slug": "fulfillment"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4cb",
                          "_id": "62320b45f4213eb19aa8f4cb",
                          "parent": "62320b45f4213eb19aa8f455",
                          "slug": "managing-inventory-and-order"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4cd",
                          "_id": "62320b45f4213eb19aa8f4cd",
                          "parent": "62320b45f4213eb19aa8f455",
                          "slug": "managing-order"
                      }
                  ]
              },
              "organization": {
                  "name": "Fynd",
                  "slug": "Fynd-s8f-32"
              }
          },
          "organization": {
              "name": "Fynd",
              "slug": "Fynd-s8f-32"
          }
      },
      {
          "_id": "61155f5d95dcfad8294091c4",
          "description": "",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/profile",
              "company/product",
              "company/application/catalogue"
          ],
          "name": "Amazon Catalogue",
          "base_url": "https://amazon-ct.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png",
              "large": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png"
          },
          "callbacks": {
              "setup": "https://amazon-ct.extensions.fyndx0.de/fp/setup",
              "auth": "https://amazon-ct.extensions.fyndx0.de/fp/auth",
              "install": "https://amazon-ct.extensions.fyndx0.de/fp/install",
              "uninstall": "https://amazon-ct.extensions.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Piyush Org",
          "contact_email": "piyushvishwakarma@gofynd.com",
          "organization_id": "6111ec0095dcfac23e408dd1",
          "created_at": "2021-08-12T17:50:21.608Z",
          "modified_at": "2021-09-29T09:51:39.732Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "6149687d9e865808c8556baf",
              "listing_info": {
                  "keywords": [
                      "amazon"
                  ],
                  "name": "Amazon Catalogue",
                  "tagline": "Export products in Amazon compatible format",
                  "icon": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/KrryVoFfH-desk-sc-1.png"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/YDwSZsoiV-mob-sc-1.png"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "6149687d9e8658092e556bb0",
                          "title": "Catalogue Export",
                          "description": "Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager."
                      }
                  ],
                  "description": "<p>Your catalogue on Fynd Platform is readily usable on Facebook Commerce Manager. This app helps you transform your Fynd Platform catalogue into Facebook's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Facebook Commerce Manager to upload your products to Facebook Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Facebook marketplace to Fynd Platform using the exported CSV from Facebook Commerce Manager.</li>\n</ul>\n</li>\n</ul>",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "piyushvishwakarma@gofynd.com",
                      "phone": "7208229699",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/profile",
                  "company/product",
                  "company/application/catalogue"
              ],
              "plans": [
                  {
                      "name": "Premium",
                      "features": "Unlimited catalogue export   \nSchedule catalogue generation\nView export event history ",
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
              "extension_id": "61155f5d95dcfad8294091c4",
              "slug": "amazon-catalogue",
              "plan_type": "recurring",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "6111ec0095dcfac23e408dd1",
              "created_at": "2021-09-21T05:07:09.208Z",
              "modified_at": "2022-03-21T12:27:07.601Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f45a",
                          "_id": "62320b45f4213eb19aa8f45a",
                          "slug": "customer-service"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f45c",
                          "_id": "62320b45f4213eb19aa8f45c",
                          "slug": "channel-management"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4f4",
                          "_id": "62320b45f4213eb19aa8f4f4",
                          "parent": "62320b45f4213eb19aa8f45c",
                          "slug": "shipping-solution"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4e9",
                          "_id": "62320b45f4213eb19aa8f4e9",
                          "parent": "62320b45f4213eb19aa8f45c",
                          "slug": "channel-management-internalization"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4d6",
                          "_id": "62320b45f4213eb19aa8f4d6",
                          "parent": "62320b45f4213eb19aa8f45a",
                          "slug": "customer-account"
                      }
                  ]
              },
              "organization": {
                  "name": "Piyush Org",
                  "slug": "Piyush-ph2-25"
              }
          },
          "organization": {
              "name": "Piyush Org",
              "slug": "Piyush-ph2-25"
          }
      },
      {
          "_id": "6116026a95dcfa05eb4091e3",
          "description": "xyz",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": false,
          "is_saleschannel": true,
          "scope": [
              "company/profile",
              "company/saleschannel",
              "company/product",
              "company/order",
              "company/application/customer",
              "company/application/analytics",
              "company/application/storage",
              "company/application/marketing",
              "company/application/catalogue",
              "company/application/communication",
              "company/application/support",
              "company/application/order",
              "company/application/settings"
          ],
          "name": "APK ",
          "base_url": "https://4a2f-49-204-113-86.ngrok.io",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png"
          },
          "callbacks": {
              "setup": "https://4a2f-49-204-113-86.ngrok.io/fp/setup",
              "auth": "https://4a2f-49-204-113-86.ngrok.io/fp/auth",
              "install": "https://4a2f-49-204-113-86.ngrok.io/fp/install",
              "uninstall": "https://4a2f-49-204-113-86.ngrok.io/fp/uninstall"
          },
          "developed_by_name": "Apk Extension",
          "contact_email": "venkhatesharunachalam@gofynd.com",
          "organization_id": "6116013e95dcfa31f64091dc",
          "created_at": "2021-08-13T05:26:02.843Z",
          "modified_at": "2022-02-08T06:08:32.675Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "61160b0041dc073a0fc38f61",
              "listing_info": {
                  "keywords": [],
                  "name": "APK ",
                  "tagline": "Downloadable apk",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/ld0bkv7uE-desk-sc-1.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/haYr70MB6-desk-sc-2.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/1ywtXQaRo-desk-sc-3.jpeg"
                      ],
                      "mobile": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/WsLyDAES9-mob-sc-1.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/akmpv_h_V-mob-sc-2.jpeg",
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Rw60j7I5r-mob-sc-3.jpeg"
                      ]
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "61262f2ebec3d618918f7561",
                          "title": "APk ",
                          "description": "test"
                      }
                  ],
                  "description": "xyz",
                  "demo_url": "",
                  "video_url": []
              },
              "contact_info": {
                  "support": {
                      "email": "venkhatesharunachalam@gofynd.com",
                      "phone": "8369903075",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "scope": [
                  "company/profile",
                  "company/saleschannel",
                  "company/product",
                  "company/order",
                  "company/application/customer",
                  "company/application/analytics",
                  "company/application/storage",
                  "company/application/marketing",
                  "company/application/catalogue",
                  "company/application/communication",
                  "company/application/support",
                  "company/application/order",
                  "company/application/settings"
              ],
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
              "extension_id": "6116026a95dcfa05eb4091e3",
              "slug": "apk",
              "plan_type": "free",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "6116013e95dcfa31f64091dc",
              "created_at": "2021-08-13T06:02:40.313Z",
              "modified_at": "2022-03-21T12:27:06.810Z",
              "coming_soon": {
                  "upvote_count": 0
              },
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f447",
                          "_id": "62320b45f4213eb19aa8f447",
                          "slug": "conversion"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f44e",
                          "_id": "62320b45f4213eb19aa8f44e",
                          "slug": "merchandising"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f47a",
                          "_id": "62320b45f4213eb19aa8f47a",
                          "parent": "62320b45f4213eb19aa8f447",
                          "slug": "cart-modification"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f480",
                          "_id": "62320b45f4213eb19aa8f480",
                          "parent": "62320b45f4213eb19aa8f44e",
                          "slug": "announcement-and-banner"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f479",
                          "_id": "62320b45f4213eb19aa8f479",
                          "parent": "62320b45f4213eb19aa8f447",
                          "slug": "customer-feedback"
                      }
                  ]
              },
              "organization": {
                  "name": "Strikers",
                  "slug": "ApkExt-ze8-72"
              }
          },
          "organization": {
              "name": "Strikers",
              "slug": "ApkExt-ze8-72"
          }
      },
      {
          "_id": "611624ac95dcfa262740920e",
          "description": "Android App Builder",
          "whitelisted_urls": [],
          "ext_version": "1.0.0",
          "extention_type": "public",
          "is_application_level": true,
          "is_saleschannel": false,
          "scope": [
              "company/profile",
              "company/saleschannel",
              "company/product",
              "company/order",
              "company/application/customer",
              "company/application/analytics",
              "company/application/storage",
              "company/application/marketing",
              "company/application/catalogue",
              "company/application/communication",
              "company/application/support",
              "company/application/order",
              "company/application/settings"
          ],
          "name": "App Builder",
          "base_url": "https://android-app-builder.extensions.fyndx0.de",
          "logo": {
              "small": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9nrhvtx7s-logo.png",
              "large": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9nrhvtx7s-logo.png"
          },
          "callbacks": {
              "setup": "https://android-app-builder.extensions.fyndx0.de/fp/setup",
              "auth": "https://android-app-builder.extensions.fyndx0.de/fp/auth",
              "install": "https://android-app-builder.extensions.fyndx0.de/fp/install",
              "uninstall": "https://android-app-builder.extensions.fyndx0.de/fp/uninstall"
          },
          "developed_by_name": "Apk Extension",
          "contact_email": "venkhatesharunachalam@gofynd.com",
          "organization_id": "6116013e95dcfa31f64091dc",
          "created_at": "2021-08-13T07:52:12.323Z",
          "modified_at": "2022-04-18T07:23:43.379Z",
          "__v": 0,
          "extension_public_data": {
              "_id": "61e52b2d2573dc50d8eb3e5b",
              "listing_info": {
                  "keywords": [
                      "app",
                      "android"
                  ],
                  "name": "App Builder",
                  "tagline": "App for your e-commerce website",
                  "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9nrhvtx7s-logo.png"
              },
              "details": {
                  "screenshots": {
                      "desktop": [
                          "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/7u47o-l7y-desk-sc-1.png"
                      ],
                      "mobile": []
                  },
                  "integrations": [],
                  "benefits": [
                      {
                          "_id": "61e52b2d2573dc0241eb3e5c",
                          "title": "Create App for your Fynd Platform website",
                          "description": "Create App for your Fynd Platform website"
                      }
                  ],
                  "video_url": [],
                  "description": "<p>App Builder for your Fynd Platform website</p>",
                  "demo_url": ""
              },
              "contact_info": {
                  "support": {
                      "email": "venkhatesharunachalam@gofynd.com",
                      "phone": "8369903075",
                      "website_url": "",
                      "faq_url": "",
                      "privacy_policy_url": ""
                  }
              },
              "coming_soon": {
                  "upvote_count": 0
              },
              "scope": [
                  "company/profile",
                  "company/saleschannel",
                  "company/product",
                  "company/order",
                  "company/application/customer",
                  "company/application/analytics",
                  "company/application/storage",
                  "company/application/marketing",
                  "company/application/catalogue",
                  "company/application/communication",
                  "company/application/support",
                  "company/application/order",
                  "company/application/settings"
              ],
              "plans": [
                  {
                      "name": "Monthly",
                      "features": "Android App",
                      "type": "recurring",
                      "price": {
                          "amount": 149,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": "",
                      "recurring": {
                          "type": "month",
                          "recurring_time": 30,
                          "yearly_amount": 1788
                      }
                  },
                  {
                      "name": "Yearly",
                      "features": "Android App",
                      "type": "recurring",
                      "price": {
                          "amount": 1499,
                          "currency": "INR"
                      },
                      "trial_days": 0,
                      "additional_charges": "",
                      "recurring": {
                          "type": "year",
                          "recurring_time": 365,
                          "yearly_amount": 0
                      }
                  }
              ],
              "extension_id": "611624ac95dcfa262740920e",
              "slug": "app-builder",
              "plan_type": "recurring",
              "plans_url": "",
              "current_status": "active",
              "organization_id": "6116013e95dcfa31f64091dc",
              "created_at": "2022-01-17T08:39:09.184Z",
              "modified_at": "2022-03-21T12:27:07.911Z",
              "category": {
                  "categories_l1": [
                      {
                          "id": "62320b45f4213eb19aa8f44c",
                          "_id": "62320b45f4213eb19aa8f44c",
                          "slug": "marketing"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f45b",
                          "_id": "62320b45f4213eb19aa8f45b",
                          "slug": "inventory"
                      }
                  ],
                  "categories_l2": [
                      {
                          "id": "62320b45f4213eb19aa8f4d9",
                          "_id": "62320b45f4213eb19aa8f4d9",
                          "parent": "62320b45f4213eb19aa8f45b",
                          "slug": "managing-inventory"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4a4",
                          "_id": "62320b45f4213eb19aa8f4a4",
                          "parent": "62320b45f4213eb19aa8f44c",
                          "slug": "email-and-sms-marketing"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f48b",
                          "_id": "62320b45f4213eb19aa8f48b",
                          "parent": "62320b45f4213eb19aa8f44c",
                          "slug": "notification"
                      },
                      {
                          "id": "62320b45f4213eb19aa8f4a7",
                          "_id": "62320b45f4213eb19aa8f4a7",
                          "parent": "62320b45f4213eb19aa8f44c",
                          "slug": "page-enhancement"
                      }
                  ]
              },
              "organization": {
                  "name": "Strikers",
                  "slug": "ApkExt-ze8-72"
              }
          },
          "organization": {
              "name": "Strikers",
              "slug": "ApkExt-ze8-72"
          }
      }
  ],
  "page": {
      "type": "number",
      "current": 1,
      "size": 10,
      "has_next": false,
      "item_total": 153
  }
}

module.exports.fetchCategories = {
  "filters": [
      {
          "key": {
              "display": "Price",
              "display_type": "heading"
          },
          "values": [
              {
                  "display": "Free",
                  "type": "price_filter",
                  "value": "free",
                  "kind": "single",
                  "display_type": "radio",
                  "slug": "free",
                  "count": 141
              },
              {
                  "display": "Paid",
                  "type": "price_filter",
                  "value": "paid",
                  "kind": "single",
                  "display_type": "radio",
                  "slug": "paid",
                  "count": 35
              }
          ]
      },
      {
          "key": {
              "display": "Category",
              "display_type": "heading"
          },
          "values": [
              {
                  "key": "l1",
                  "id": "629461b2e6bf3c5f04e4f63a",
                  "_id": "629461b2e6bf3c5f04e4f63a",
                  "display": "Conversion",
                  "value": "Conversion",
                  "slug": "conversion",
                  "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "childs": [
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f676",
                          "_id": "629461b2e6bf3c5f04e4f676",
                          "display": "Promotions",
                          "value": "Promotions",
                          "parent": "629461b2e6bf3c5f04e4f63a",
                          "slug": "promotions",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 17
                      },
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f67a",
                          "_id": "629461b2e6bf3c5f04e4f67a",
                          "display": "Recovering orders",
                          "value": "Recovering orders",
                          "parent": "629461b2e6bf3c5f04e4f63a",
                          "slug": "recovering-orders",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 24
                      },
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f679",
                          "_id": "629461b2e6bf3c5f04e4f679",
                          "display": "Upselling and cross-selling",
                          "value": "Upselling and cross-selling",
                          "parent": "629461b2e6bf3c5f04e4f63a",
                          "slug": "upselling-and-cross-selling",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 15
                      },
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f67f",
                          "_id": "629461b2e6bf3c5f04e4f67f",
                          "display": "Cart modification",
                          "value": "Cart modification",
                          "parent": "629461b2e6bf3c5f04e4f63a",
                          "slug": "cart-modification",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 23
                      },
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f680",
                          "_id": "629461b2e6bf3c5f04e4f680",
                          "display": "Customer feedback",
                          "value": "Customer feedback",
                          "parent": "629461b2e6bf3c5f04e4f63a",
                          "slug": "customer-feedback",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 16
                      }
                  ],
                  "kind": "single",
                  "display_type": "radio",
                  "type": "category_filter_l1",
                  "count": 42
              },
              {
                  "key": "l1",
                  "id": "629461b2e6bf3c5f04e4f63c",
                  "_id": "629461b2e6bf3c5f04e4f63c",
                  "display": "Merchandising",
                  "value": "Merchandising",
                  "slug": "merchandising",
                  "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "childs": [
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f686",
                          "_id": "629461b2e6bf3c5f04e4f686",
                          "display": "Announcement and banner",
                          "value": "Announcement and banner",
                          "parent": "629461b2e6bf3c5f04e4f63c",
                          "slug": "announcement-and-banner",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 20
                      },
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f68e",
                          "_id": "629461b2e6bf3c5f04e4f68e",
                          "display": "Additional purchase",
                          "value": "Additional purchase",
                          "parent": "629461b2e6bf3c5f04e4f63c",
                          "slug": "additional-purchase",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 24
                      },
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f68b",
                          "_id": "629461b2e6bf3c5f04e4f68b",
                          "display": "Product display",
                          "value": "Product display",
                          "parent": "629461b2e6bf3c5f04e4f63c",
                          "slug": "product-display",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 21
                      },
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f683",
                          "_id": "629461b2e6bf3c5f04e4f683",
                          "display": "Pricing",
                          "value": "Pricing",
                          "parent": "629461b2e6bf3c5f04e4f63c",
                          "slug": "pricing",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 20
                      }
                  ],
                  "kind": "single",
                  "display_type": "radio",
                  "type": "category_filter_l1",
                  "count": 45
              },
              {
                  "key": "l1",
                  "id": "629461b2e6bf3c5f04e4f63d",
                  "_id": "629461b2e6bf3c5f04e4f63d",
                  "display": "Marketing",
                  "value": "Marketing",
                  "slug": "marketing",
                  "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "childs": [
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f695",
                          "_id": "629461b2e6bf3c5f04e4f695",
                          "display": "Email and SMS marketing",
                          "value": "Email and SMS marketing",
                          "parent": "629461b2e6bf3c5f04e4f63d",
                          "slug": "email-and-sms-marketing",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 16
                      },
                      {
                          "key": "l2",
                          "id": "629461b2e6bf3c5f04e4f692",
                          "_id": "629461b2e6bf3c5f04e4f692",
                          "display": "Notification",
                          "value": "Notification",
                          "parent": "629461b2e6bf3c5f04e4f63d",
                          "slug": "notification",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 10
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6b5",
                          "_id": "629461b3e6bf3c5f04e4f6b5",
                          "display": "Page enhancement",
                          "value": "Page enhancement",
                          "parent": "629461b2e6bf3c5f04e4f63d",
                          "slug": "page-enhancement",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 12
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6b8",
                          "_id": "629461b3e6bf3c5f04e4f6b8",
                          "display": "Advertisement",
                          "value": "Advertisement",
                          "parent": "629461b2e6bf3c5f04e4f63d",
                          "slug": "advertisement",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 13
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6be",
                          "_id": "629461b3e6bf3c5f04e4f6be",
                          "display": "Internalization",
                          "value": "Internalization",
                          "parent": "629461b2e6bf3c5f04e4f63d",
                          "slug": "marketing-internalization",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 14
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6bb",
                          "_id": "629461b3e6bf3c5f04e4f6bb",
                          "display": "Marketing analytics",
                          "value": "Marketing analytics",
                          "parent": "629461b2e6bf3c5f04e4f63d",
                          "slug": "marketing-analytics",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 13
                      }
                  ],
                  "kind": "single",
                  "display_type": "radio",
                  "type": "category_filter_l1",
                  "count": 37
              },
              {
                  "key": "l1",
                  "id": "629461b2e6bf3c5f04e4f645",
                  "_id": "629461b2e6bf3c5f04e4f645",
                  "display": "Fulfillment",
                  "value": "Fulfillment",
                  "slug": "fulfillment",
                  "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "childs": [
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6c2",
                          "_id": "629461b3e6bf3c5f04e4f6c2",
                          "display": "Managing order",
                          "value": "Managing order",
                          "parent": "629461b2e6bf3c5f04e4f645",
                          "slug": "managing-order",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 21
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6c0",
                          "_id": "629461b3e6bf3c5f04e4f6c0",
                          "display": "Managing inventory and order",
                          "value": "Managing inventory and order",
                          "parent": "629461b2e6bf3c5f04e4f645",
                          "slug": "managing-inventory-and-order",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 24
                      }
                  ],
                  "kind": "single",
                  "display_type": "radio",
                  "type": "category_filter_l1",
                  "count": 38
              },
              {
                  "key": "l1",
                  "id": "629461b2e6bf3c5f04e4f64c",
                  "_id": "629461b2e6bf3c5f04e4f64c",
                  "display": "Channel Management",
                  "value": "Channel Management",
                  "slug": "channel-management",
                  "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "childs": [
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6e6",
                          "_id": "629461b3e6bf3c5f04e4f6e6",
                          "display": "Shipping solution",
                          "value": "Shipping solution",
                          "parent": "629461b2e6bf3c5f04e4f64c",
                          "slug": "shipping-solution",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 16
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6d9",
                          "_id": "629461b3e6bf3c5f04e4f6d9",
                          "display": "Internalization",
                          "value": "Internalization",
                          "parent": "629461b2e6bf3c5f04e4f64c",
                          "slug": "channel-management-internalization",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 12
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6e8",
                          "_id": "629461b3e6bf3c5f04e4f6e8",
                          "display": "Business Insight",
                          "value": "Business Insight",
                          "parent": "629461b2e6bf3c5f04e4f64c",
                          "slug": "business-insight",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 16
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6e1",
                          "_id": "629461b3e6bf3c5f04e4f6e1",
                          "display": "Policy and security",
                          "value": "Policy and security",
                          "parent": "629461b2e6bf3c5f04e4f64c",
                          "slug": "policy-and-security",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 9
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6de",
                          "_id": "629461b3e6bf3c5f04e4f6de",
                          "display": "Operation",
                          "value": "Operation",
                          "parent": "629461b2e6bf3c5f04e4f64c",
                          "slug": "operation",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 21
                      }
                  ],
                  "kind": "single",
                  "display_type": "radio",
                  "type": "category_filter_l1",
                  "count": 34
              },
              {
                  "key": "l1",
                  "id": "629461b2e6bf3c5f04e4f64b",
                  "_id": "629461b2e6bf3c5f04e4f64b",
                  "display": "Inventory",
                  "value": "Inventory",
                  "slug": "inventory",
                  "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "childs": [
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6d6",
                          "_id": "629461b3e6bf3c5f04e4f6d6",
                          "display": "Managing inventory",
                          "value": "Managing inventory",
                          "parent": "629461b2e6bf3c5f04e4f64b",
                          "slug": "managing-inventory",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 30
                      }
                  ],
                  "kind": "single",
                  "display_type": "radio",
                  "type": "category_filter_l1",
                  "count": 40
              },
              {
                  "key": "l1",
                  "id": "629461b2e6bf3c5f04e4f64a",
                  "_id": "629461b2e6bf3c5f04e4f64a",
                  "display": "Source and Selling Product",
                  "value": "Source and Selling Product",
                  "slug": "source-and-selling-product",
                  "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "childs": [
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6ce",
                          "_id": "629461b3e6bf3c5f04e4f6ce",
                          "display": "Marketplace",
                          "value": "Marketplace",
                          "parent": "629461b2e6bf3c5f04e4f64a",
                          "slug": "marketplace",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 21
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6cc",
                          "_id": "629461b3e6bf3c5f04e4f6cc",
                          "display": "Dropshipping",
                          "value": "Dropshipping",
                          "parent": "629461b2e6bf3c5f04e4f64a",
                          "slug": "dropshipping",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 21
                      }
                  ],
                  "kind": "single",
                  "display_type": "radio",
                  "type": "category_filter_l1",
                  "count": 36
              },
              {
                  "key": "l1",
                  "id": "629461b2e6bf3c5f04e4f646",
                  "_id": "629461b2e6bf3c5f04e4f646",
                  "display": "Customer Service",
                  "value": "Customer Service",
                  "slug": "customer-service",
                  "logo": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "childs": [
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6c6",
                          "_id": "629461b3e6bf3c5f04e4f6c6",
                          "display": "Support",
                          "value": "Support",
                          "parent": "629461b2e6bf3c5f04e4f646",
                          "slug": "support",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 19
                      },
                      {
                          "key": "l2",
                          "id": "629461b3e6bf3c5f04e4f6c8",
                          "_id": "629461b3e6bf3c5f04e4f6c8",
                          "display": "Customer account",
                          "value": "Customer account",
                          "parent": "629461b2e6bf3c5f04e4f646",
                          "slug": "customer-account",
                          "display_type": "checkbox",
                          "kind": "multivalues",
                          "type": "category_filter_l2",
                          "count": 23
                      }
                  ],
                  "kind": "single",
                  "display_type": "radio",
                  "type": "category_filter_l1",
                  "count": 38
              }
          ],
          "all_count": 176
      }
  ]
}

module.exports.fetchCollections = {
  "items": [
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/o9UhZ5Em6-logo.jpeg",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/dU3kXnGwR-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the"
          },
          "tags": [
              "asdsa",
              "asdas",
              "my"
          ],
          "published": false,
          "_id": "623847d0ec3c4b10b1f5fed6",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "New Extension collection",
          "description": "fdsdssdasdsdsd d d sddas dsd sd d",
          "slug": "new-extension-collection",
          "__v": 0,
          "created_at": "2022-06-02T15:24:26.203Z",
          "modified_at": "2022-06-02T15:24:26.203Z"
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/q7Ex7-oAT-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/HCrbg2uGD-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/0cyP63leb-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the"
          },
          "tags": [
              "adsa",
              "dsad",
              "asdas"
          ],
          "published": true,
          "_id": "62384f66ec3c4b4e6ff5fee6",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "NEW ONE",
          "description": "sadasdasd",
          "slug": "new-one",
          "__v": 0,
          "created_at": "2022-06-01T08:19:13.070Z",
          "modified_at": "2022-06-01T08:19:13.070Z"
      },
      {
          "banner": {
              "logo": "",
              "portrait": "",
              "landscape": ""
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the"
          },
          "tags": [],
          "published": true,
          "_id": "62385ac9ec3c4b28e9f5ff05",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "test",
          "description": "",
          "__v": 0
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/BEMFKB858-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/KKukThM7Q-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/izikmUFVD-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the"
          },
          "tags": [
              "test",
              "asasas"
          ],
          "published": true,
          "_id": "623b4d518087776e618af270",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "Mac collection ",
          "description": "test",
          "slug": "mac-collection",
          "__v": 0,
          "created_at": "2022-05-31T11:02:32.745Z",
          "modified_at": "2022-06-01T08:56:59.071Z"
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/lOyFu1NjT-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LLbfmTiyf-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/1hvSt917P-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the collection"
          },
          "tags": [
              "dfg"
          ],
          "published": true,
          "_id": "625fe7c726e867d85730af1a",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "Test3",
          "description": "gdfdfd",
          "slug": "qwer-tyui-tyu",
          "__v": 0,
          "created_at": "2022-06-08T09:49:38.324Z",
          "modified_at": "2022-06-08T09:49:38.324Z"
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/zSDeCO5GF-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/wMNtZox9F-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LctdogpHF-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the collection"
          },
          "tags": [
              "as",
              "sad",
              "dsda"
          ],
          "published": true,
          "_id": "625fe8ac26e86741c830af2b",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "main-extension",
          "description": "sadsad",
          "slug": "main-extension",
          "__v": 0
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/tLyIWubai-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/lKuwhvJuo-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/kYs9a-q62-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the collection"
          },
          "tags": [
              "rrr"
          ],
          "published": true,
          "_id": "625fec4226e8671c7730af2e",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "test1",
          "description": "tyyutxd",
          "slug": "test1",
          "__v": 0
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/844q5hUne-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/mMEClTHZf-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/szDg6dJvf-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the collection"
          },
          "tags": [
              "rrr"
          ],
          "published": true,
          "_id": "625fed4326e867575a30af35",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "test12",
          "description": "rshhthsh",
          "slug": "test12",
          "__v": 0
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/-WVnF2Q7S-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/l7dpJG8bD-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/lIZMHK3dV-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the collection"
          },
          "tags": [],
          "published": true,
          "_id": "625feeda26e8670cf630af3c",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "Get 20 % off ",
          "description": "efsddfcs",
          "slug": "get-20",
          "__v": 0
      },
      {
          "banner": {
              "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/tz2RG2AqL-logo.png",
              "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/ZTo5cEkgo-logo.png",
              "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9aT_xnkVS-logo.png"
          },
          "seo": {
              "title": "Title",
              "description": "Breif description about the collection"
          },
          "tags": [],
          "published": true,
          "_id": "625fefa126e867aee330af40",
          "collection_category": "extension",
          "collection_type": "handpicked",
          "name": "get20 % off on summer ",
          "description": "h",
          "slug": "get20--off-on-summer",
          "__v": 0
      }
  ],
  "page": {
      "type": "number",
      "current": 1,
      "size": 10,
      "item_total": 31,
      "has_next": true
  }
}

module.exports.searchExtensionsResponse = {
    "items": [
      {
        "logo": {
          "large": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png",
          "small": "https://hdn-1.addsale.com/x0/partners/pictures/free/original/--unnamed--/hellobar.png"
        },
        "callbacks": {
          "auth": "https://localdev.fyndx0.de/fp/auth",
          "install": "https://localdev.fyndx0.de/fp/install",
          "setup": "https://localdev.fyndx0.de/fp/setup",
          "uninstall": "https://localdev.fyndx0.de/fp/uninstall"
        },
        "description": "As an online marketer with a product that you believe in, nailing the art of converting site visitors into leads is going to have a huge impact on the success of your business. Well, Hellobar makes it possible!\n \n What's New\n • Business efforts will not be wasted\n • Keep customers engaged on your website",
        "whitelisted_urls": [],
        "ext_version": "1.0",
        "extention_type": "public",
        "is_application_level": false,
        "is_saleschannel": false,
        "scope": [
          "company/profile"
        ],
        "_id": "6232f7c538bac40085b874c5",
        "name": "Hellobar",
        "base_url": "https://localdev.fyndx0.de",
        "contact_email": "gauravkumarsharma@gofynd.com",
        "is_coming_soon": true,
        "organization_id": "610d3a4595dcfae682408c07",
        "created_at": "2022-03-17T08:56:37.174Z",
        "modified_at": "2022-03-17T08:56:37.174Z",
        "__v": 0
      }
    ],
    "page": {
      "type": "number",
      "current": 1,
      "size": 10,
      "item_total": 1,
      "has_next": false
    }
}

module.exports.sectionsMock = [
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
            "heading": "Fynd Extensions ",
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
            "item_count": 6,
            "button_label": "View All",
            "button_page_link": "/extensions",
            "button_position": "top_right",
            "item_source": "manual",
            "extension": [
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
                "609400409d0dcbdc2e6b76a5",
                "60be66a2d4cbbf1fd0a67c8c",
                "610d2ad295dcfa14eb408bad"
            ]
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
        "items": [
            {
                "_id": "629461b2e6bf3c5f04e4f63a",
                "level": 1,
                "slug": "conversion",
                "__v": 0,
                "description": "description for this category in not more than 2 lines",
                "display": "Conversion",
                "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                "value": "Conversion"
            },
            {
                "_id": "629461b2e6bf3c5f04e4f63d",
                "level": 1,
                "slug": "marketing",
                "__v": 0,
                "description": "description for this category in not more than 2 lines",
                "display": "Marketing",
                "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                "value": "Marketing"
            },
            {
                "_id": "629461b2e6bf3c5f04e4f63c",
                "level": 1,
                "slug": "merchandising",
                "__v": 0,
                "description": "description for this category in not more than 2 lines",
                "display": "Merchandising",
                "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                "value": "Merchandising"
            },
            {
                "_id": "629461b2e6bf3c5f04e4f646",
                "level": 1,
                "slug": "customer-service",
                "__v": 0,
                "description": "description for this category in not more than 2 lines",
                "display": "Customer Service",
                "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                "value": "Customer Service"
            }
        ],
        "data": {
            "heading": "CATEGORIES",
            "title": "Extensions organized as per their genre",
            "subtitle": "Subtitle",
            "button_label": "View All",
            "button_page_link": "/extensions",
            "button_position": "bottom_center",
            "item_source": "manual",
            "item_count": "6",
            "category": [
                {
                    "_id": "629461b2e6bf3c5f04e4f63a",
                    "level": 1,
                    "slug": "conversion",
                    "__v": 0,
                    "description": "description for this category in not more than 2 lines",
                    "display": "Conversion",
                    "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                    "value": "Conversion"
                },
                {
                    "_id": "629461b2e6bf3c5f04e4f63c",
                    "level": 1,
                    "slug": "merchandising",
                    "__v": 0,
                    "description": "description for this category in not more than 2 lines",
                    "display": "Merchandising",
                    "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                    "value": "Merchandising"
                },
                {
                    "_id": "629461b2e6bf3c5f04e4f63d",
                    "level": 1,
                    "slug": "marketing",
                    "__v": 0,
                    "description": "description for this category in not more than 2 lines",
                    "display": "Marketing",
                    "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                    "value": "Marketing"
                },
                {
                    "_id": "629461b2e6bf3c5f04e4f645",
                    "level": 1,
                    "slug": "fulfillment",
                    "__v": 0,
                    "description": "description for this category in not more than 2 lines",
                    "display": "Fulfillment",
                    "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                    "value": "Fulfillment"
                },
                "Conversion",
                "Merchandising"
            ]
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
        "type": "collection_grid",
        "data": {
            "heading": "Collections",
            "title": "Latest",
            "subtitle": "Subtitle",
            "button_label": "View",
            "button_page_link": "Collections",
            "item_source": "manual",
            "image": "",
            "image_position": "",
            "collection": [
                "623847d0ec3c4b10b1f5fed6",
                "623b4d518087776e618af270",
                "627ba8371171f7705212333b",
                "62384f66ec3c4b4e6ff5fee6"
            ]
        },
        "items": []
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
        "page_type": "extension",
        "type": "extension_grid",
        "data": {
            "heading": "Latest Extensions",
            "title": "Extensions",
            "subtitle": "Subtitle",
            "button_label": "View",
            "button_page_link": "Collections",
            "item_source": "manual",
            "image": "",
            "image_position": "",
            "extension": [
                "610d2ad295dcfa14eb408bad",
                "60be66a2d4cbbf1fd0a67c8c",
                "609400409d0dcbdc2e6b76a5"
            ]
        }
    }
]

module.exports.availableSectionsMock = [
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
                "id": "item_count",
                "label": "Item Count",
                "default": "3",
                "type": "range",
                "min": 3,
                "max": 9,
                "step": 3
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
            },
            {
                "default": [],
                "id": "extension",
                "label": "Extensions",
                "options": [
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png",
                        "callbacks": {
                            "setup": "https://bulkcoupon.extensions.fyndx0.de/fp/setup",
                            "auth": "https://bulkcoupon.extensions.fyndx0.de/fp/auth",
                            "install": "https://bulkcoupon.extensions.fyndx0.de/fp/install",
                            "uninstall": "https://bulkcoupon.extensions.fyndx0.de/fp/uninstall"
                        },
                        "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "public",
                        "is_application_level": true,
                        "is_saleschannel": false,
                        "scope": [
                            "company/saleschannel",
                            "company/application/marketing"
                        ],
                        "_id": "610d2ad295dcfa14eb408bad",
                        "name": "Bulk Coupons Generator",
                        "base_url": "https://bulkcoupon.extensions.fyndx0.de",
                        "developed_by_name": "Rushabh Shah",
                        "contact_email": "rushabhmshah@gofynd.com",
                        "organization_id": "610d29f395dcfaba6b408ba6",
                        "created_at": "2021-08-06T12:28:02.036Z",
                        "modified_at": "2022-02-28T15:56:31.338Z",
                        "__v": 0,
                        "is_coming_soon": false,
                        "text": "Bulk Coupons Generator",
                        "value": "610d2ad295dcfa14eb408bad",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png",
                        "callbacks": {
                            "setup": "https://newsletter-sub-008.loca.lt/fp/setup",
                            "auth": "https://newsletter-sub-008.loca.lt/fp/auth",
                            "install": "https://newsletter-sub-008.loca.lt/fp/install",
                            "uninstall": "https://newsletter-sub-008.loca.lt/fp/uninstall"
                        },
                        "description": "",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "public",
                        "is_application_level": true,
                        "is_saleschannel": false,
                        "scope": [
                            "company/saleschannel"
                        ],
                        "_id": "60be66a2d4cbbf1fd0a67c8c",
                        "name": "newsletter-local Brijesh",
                        "base_url": "https://newsletter-sub-008.loca.lt",
                        "developed_by_name": "Social Icons Company",
                        "contact_email": "brijeshgajjar@gofynd.com",
                        "organization_id": "610d3a4595dcfae682408c07",
                        "created_at": "2021-06-07T18:34:10.795Z",
                        "modified_at": "2022-04-29T07:22:36.929Z",
                        "__v": 0,
                        "is_coming_soon": false,
                        "text": "newsletter-local Brijesh",
                        "value": "60be66a2d4cbbf1fd0a67c8c",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png",
                        "callbacks": {
                            "setup": "https://newsletter.extensions.fyndx0.de/fp/setup",
                            "auth": "https://newsletter.extensions.fyndx0.de/fp/auth",
                            "install": "https://newsletter.extensions.fyndx0.de/fp/install",
                            "uninstall": "https://newsletter.extensions.fyndx0.de/fp/uninstall"
                        },
                        "description": "Newsletter Subscription\nNewsletter Subscription",
                        "whitelisted_urls": [],
                        "ext_version": "1.0",
                        "extention_type": "public",
                        "is_application_level": true,
                        "is_saleschannel": false,
                        "scope": [
                            "company/saleschannel",
                            "company/application/settings"
                        ],
                        "_id": "609400409d0dcbdc2e6b76a5",
                        "name": "Newsletter Subscription",
                        "base_url": "https://newsletter.extensions.fyndx0.de",
                        "developed_by_name": "Fynd",
                        "contact_email": "brijeshgajjar@gofynd.com",
                        "organization_id": "610d178e2ab8f356aa98481b",
                        "created_at": "2021-05-06T14:42:08.318Z",
                        "modified_at": "2022-02-09T06:54:58.104Z",
                        "__v": 2,
                        "is_coming_soon": false,
                        "text": "Newsletter Subscription",
                        "value": "609400409d0dcbdc2e6b76a5",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/BfWmSEz1R-logo.png",
                        "callbacks": {
                            "setup": "https://google-tag-manager.extensions.fyndx0.de/fp/setup",
                            "auth": "https://google-tag-manager.extensions.fyndx0.de/fp/auth",
                            "install": "https://google-tag-manager.extensions.fyndx0.de/fp/install",
                            "uninstall": "https://google-tag-manager.extensions.fyndx0.de/fp/uninstall"
                        },
                        "description": "GTM",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "private",
                        "is_application_level": false,
                        "is_saleschannel": false,
                        "scope": [
                            "company/saleschannel",
                            "company/application/settings"
                        ],
                        "_id": "6110970195dcfa19ac408c67",
                        "name": "Googe Tag Manager",
                        "base_url": "https://google-tag-manager.extensions.fyndx0.de",
                        "developed_by_name": "Akash Organization",
                        "contact_email": "akashmane@gofynd.com",
                        "organization_id": "6110967d95dcfaf485408c60",
                        "created_at": "2021-08-09T02:46:25.744Z",
                        "modified_at": "2021-08-09T02:46:25.744Z",
                        "__v": 0,
                        "text": "Googe Tag Manager",
                        "value": "6110970195dcfa19ac408c67",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png",
                        "callbacks": {
                            "setup": "https://quiet-cow-22.loca.lt/fp/setup",
                            "auth": "https://quiet-cow-22.loca.lt/fp/auth",
                            "install": "https://quiet-cow-22.loca.lt/fp/install",
                            "uninstall": "https://quiet-cow-22.loca.lt/fp/uninstall"
                        },
                        "description": "Local tag manager",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "public",
                        "is_application_level": false,
                        "is_saleschannel": false,
                        "scope": [
                            "company/saleschannel",
                            "company/application/settings"
                        ],
                        "_id": "61109c6795dcfa38cb408c70",
                        "name": "Tag Manager Local",
                        "base_url": "https://quiet-cow-22.loca.lt",
                        "developed_by_name": "Akash Organization",
                        "contact_email": "akashmane@gofynd.com",
                        "organization_id": "6110967d95dcfaf485408c60",
                        "created_at": "2021-08-09T03:09:27.392Z",
                        "modified_at": "2021-09-09T04:40:50.398Z",
                        "__v": 0,
                        "text": "Tag Manager Local",
                        "value": "61109c6795dcfa38cb408c70",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/5qfbxktWw-logo.png",
                        "callbacks": {
                            "setup": "https://fp-extension.glamarx0.de/fp/setup",
                            "auth": "https://fp-extension.glamarx0.de/fp/auth",
                            "install": "https://fp-extension.glamarx0.de/fp/install",
                            "uninstall": "https://fp-extension.glamarx0.de/fp/uninstall"
                        },
                        "description": "GlamAR",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "private",
                        "is_application_level": true,
                        "is_saleschannel": false,
                        "scope": [
                            "company/product"
                        ],
                        "_id": "6110ccf195dcfa49cd408cdc",
                        "name": "GlamAR",
                        "base_url": "https://fp-extension.glamarx0.de",
                        "developed_by_name": "GlamaR",
                        "contact_email": "tusharmoraye@gofynd.com",
                        "organization_id": "6110cb9d95dcfa3c80408cd5",
                        "created_at": "2021-08-09T06:36:33.129Z",
                        "modified_at": "2021-09-21T12:31:43.880Z",
                        "__v": 1,
                        "text": "GlamAR",
                        "value": "6110ccf195dcfa49cd408cdc",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/vxKq0OJXl-logo.png",
                        "callbacks": {
                            "setup": "https://ajio.loca.lt/fp/setup",
                            "auth": "https://ajio.loca.lt/fp/auth",
                            "install": "https://ajio.loca.lt/fp/install",
                            "uninstall": "https://ajio.loca.lt/fp/uninstall"
                        },
                        "description": "ajio",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "private",
                        "is_application_level": false,
                        "is_saleschannel": false,
                        "scope": [
                            "company/profile",
                            "company/saleschannel"
                        ],
                        "_id": "6110d85f95dcfa6ec3408ce9",
                        "name": "ajio",
                        "base_url": "https://ajio.loca.lt",
                        "developed_by_name": "Demo",
                        "contact_email": "rakeshyadav@gofynd.com",
                        "organization_id": "6110d82395dcfa2a7a408ce2",
                        "created_at": "2021-08-09T07:25:19.783Z",
                        "modified_at": "2022-03-10T11:52:56.420Z",
                        "__v": 0,
                        "text": "ajio",
                        "value": "6110d85f95dcfa6ec3408ce9",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/AO4-MpSzn-logo.jpeg",
                        "callbacks": {
                            "setup": "https://nykaa-alankrit-v4.loca.lt/fp/setup",
                            "auth": "https://nykaa-alankrit-v4.loca.lt/fp/auth",
                            "install": "https://nykaa-alankrit-v4.loca.lt/fp/install",
                            "uninstall": "https://nykaa-alankrit-v4.loca.lt/fp/uninstall"
                        },
                        "description": "dfeefevrefwdfwev",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "private",
                        "is_application_level": false,
                        "is_saleschannel": false,
                        "scope": [
                            "company/profile",
                            "company/saleschannel",
                            "company/product",
                            "company/order",
                            "company/application/customer",
                            "company/application/analytics",
                            "company/application/storage",
                            "company/application/marketing",
                            "company/application/catalogue",
                            "company/application/communication",
                            "company/application/settings"
                        ],
                        "_id": "611129ed95dcfa0722408d95",
                        "name": "Nykaa",
                        "base_url": "https://nykaa-alankrit-v4.loca.lt",
                        "developed_by_name": "Apna_Market",
                        "contact_email": "alankritsinha@gofynd.com",
                        "organization_id": "6111297f95dcfa0847408d8e",
                        "created_at": "2021-08-09T13:13:17.036Z",
                        "modified_at": "2022-01-17T12:10:26.982Z",
                        "__v": 0,
                        "text": "Nykaa",
                        "value": "611129ed95dcfa0722408d95",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/jaOfDVYGe-logo.png",
                        "callbacks": {
                            "setup": "https://bulk-location.extensions.fyndx0.de/fp/setup",
                            "auth": "https://bulk-location.extensions.fyndx0.de/fp/auth",
                            "install": "https://bulk-location.extensions.fyndx0.de/fp/install",
                            "uninstall": "https://bulk-location.extensions.fyndx0.de/fp/uninstall"
                        },
                        "description": "Create and update multiple selling locations at once using Excel and CSV",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "public",
                        "is_application_level": false,
                        "is_saleschannel": false,
                        "scope": [
                            "company/profile"
                        ],
                        "_id": "61117dab95dcfa5db7408dba",
                        "name": "Multi Location Manager",
                        "base_url": "https://bulk-location.extensions.fyndx0.de",
                        "developed_by_name": "Multi Location",
                        "contact_email": "abhinavmaurya@gofynd.com",
                        "organization_id": "61117d3295dcfa7f9a408db3",
                        "created_at": "2021-08-09T19:10:35.891Z",
                        "modified_at": "2022-01-12T06:48:01.826Z",
                        "__v": 0,
                        "text": "Multi Location Manager",
                        "value": "61117dab95dcfa5db7408dba",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/JdPFZDJ-y-logo.jpeg",
                        "callbacks": {
                            "setup": "https://facebook-ct.extensions.fyndx0.de/fp/setup",
                            "auth": "https://facebook-ct.extensions.fyndx0.de/fp/auth",
                            "install": "https://facebook-ct.extensions.fyndx0.de/fp/install",
                            "uninstall": "https://facebook-ct.extensions.fyndx0.de/fp/uninstall"
                        },
                        "description": "Facebook Catalogue",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "public",
                        "is_application_level": true,
                        "is_saleschannel": false,
                        "scope": [
                            "company/profile",
                            "company/product",
                            "company/application/catalogue"
                        ],
                        "_id": "6111ec7e95dcfa8e12408dd8",
                        "name": "Facebook Catalogue",
                        "base_url": "https://facebook-ct.extensions.fyndx0.de",
                        "developed_by_name": "Piyush Org",
                        "contact_email": "piyushvishwakarma@gofynd.com",
                        "organization_id": "6111ec0095dcfac23e408dd1",
                        "created_at": "2021-08-10T03:03:26.683Z",
                        "modified_at": "2022-02-02T09:11:04.485Z",
                        "__v": 0,
                        "text": "Facebook Catalogue",
                        "value": "6111ec7e95dcfa8e12408dd8",
                        "label": "Extensions"
                    }
                ],
                "type": "select",
                "multiple": true,
                "search": true,
                "predicate_prop": {
                    "item_source": "manual"
                },
                "placeholder": "Search Extensions",
                "value": []
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
            },
            {
                "default": [],
                "id": "category",
                "label": "Categories",
                "options": [
                    {
                        "key": "l1",
                        "id": "629461b2e6bf3c5f04e4f63a",
                        "_id": "629461b2e6bf3c5f04e4f63a",
                        "display": "Conversion",
                        "value": "Conversion",
                        "slug": "conversion",
                        "childs": [
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f676",
                                "_id": "629461b2e6bf3c5f04e4f676",
                                "display": "Promotions",
                                "value": "Promotions",
                                "parent": "629461b2e6bf3c5f04e4f63a",
                                "slug": "promotions",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 17
                            },
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f67a",
                                "_id": "629461b2e6bf3c5f04e4f67a",
                                "display": "Recovering orders",
                                "value": "Recovering orders",
                                "parent": "629461b2e6bf3c5f04e4f63a",
                                "slug": "recovering-orders",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 24
                            },
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f679",
                                "_id": "629461b2e6bf3c5f04e4f679",
                                "display": "Upselling and cross-selling",
                                "value": "Upselling and cross-selling",
                                "parent": "629461b2e6bf3c5f04e4f63a",
                                "slug": "upselling-and-cross-selling",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 15
                            },
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f680",
                                "_id": "629461b2e6bf3c5f04e4f680",
                                "display": "Customer feedback",
                                "value": "Customer feedback",
                                "parent": "629461b2e6bf3c5f04e4f63a",
                                "slug": "customer-feedback",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 16
                            },
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f67f",
                                "_id": "629461b2e6bf3c5f04e4f67f",
                                "display": "Cart modification",
                                "value": "Cart modification",
                                "parent": "629461b2e6bf3c5f04e4f63a",
                                "slug": "cart-modification",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 23
                            }
                        ],
                        "kind": "single",
                        "display_type": "radio",
                        "type": "category_filter_l1",
                        "count": 42,
                        "text": "Conversion"
                    },
                    {
                        "key": "l1",
                        "id": "629461b2e6bf3c5f04e4f63d",
                        "_id": "629461b2e6bf3c5f04e4f63d",
                        "display": "Marketing",
                        "value": "Marketing",
                        "slug": "marketing",
                        "childs": [
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f692",
                                "_id": "629461b2e6bf3c5f04e4f692",
                                "display": "Notification",
                                "value": "Notification",
                                "parent": "629461b2e6bf3c5f04e4f63d",
                                "slug": "notification",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 10
                            },
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f695",
                                "_id": "629461b2e6bf3c5f04e4f695",
                                "display": "Email and SMS marketing",
                                "value": "Email and SMS marketing",
                                "parent": "629461b2e6bf3c5f04e4f63d",
                                "slug": "email-and-sms-marketing",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 16
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6b5",
                                "_id": "629461b3e6bf3c5f04e4f6b5",
                                "display": "Page enhancement",
                                "value": "Page enhancement",
                                "parent": "629461b2e6bf3c5f04e4f63d",
                                "slug": "page-enhancement",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 12
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6b8",
                                "_id": "629461b3e6bf3c5f04e4f6b8",
                                "display": "Advertisement",
                                "value": "Advertisement",
                                "parent": "629461b2e6bf3c5f04e4f63d",
                                "slug": "advertisement",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 13
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6bb",
                                "_id": "629461b3e6bf3c5f04e4f6bb",
                                "display": "Marketing analytics",
                                "value": "Marketing analytics",
                                "parent": "629461b2e6bf3c5f04e4f63d",
                                "slug": "marketing-analytics",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 13
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6be",
                                "_id": "629461b3e6bf3c5f04e4f6be",
                                "display": "Internalization",
                                "value": "Internalization",
                                "parent": "629461b2e6bf3c5f04e4f63d",
                                "slug": "marketing-internalization",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 14
                            }
                        ],
                        "kind": "single",
                        "display_type": "radio",
                        "type": "category_filter_l1",
                        "count": 37,
                        "text": "Marketing"
                    },
                    {
                        "key": "l1",
                        "id": "629461b2e6bf3c5f04e4f63c",
                        "_id": "629461b2e6bf3c5f04e4f63c",
                        "display": "Merchandising",
                        "value": "Merchandising",
                        "slug": "merchandising",
                        "childs": [
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f68e",
                                "_id": "629461b2e6bf3c5f04e4f68e",
                                "display": "Additional purchase",
                                "value": "Additional purchase",
                                "parent": "629461b2e6bf3c5f04e4f63c",
                                "slug": "additional-purchase",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 24
                            },
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f68b",
                                "_id": "629461b2e6bf3c5f04e4f68b",
                                "display": "Product display",
                                "value": "Product display",
                                "parent": "629461b2e6bf3c5f04e4f63c",
                                "slug": "product-display",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 22
                            },
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f686",
                                "_id": "629461b2e6bf3c5f04e4f686",
                                "display": "Announcement and banner",
                                "value": "Announcement and banner",
                                "parent": "629461b2e6bf3c5f04e4f63c",
                                "slug": "announcement-and-banner",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 20
                            },
                            {
                                "key": "l2",
                                "id": "629461b2e6bf3c5f04e4f683",
                                "_id": "629461b2e6bf3c5f04e4f683",
                                "display": "Pricing",
                                "value": "Pricing",
                                "parent": "629461b2e6bf3c5f04e4f63c",
                                "slug": "pricing",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 20
                            }
                        ],
                        "kind": "single",
                        "display_type": "radio",
                        "type": "category_filter_l1",
                        "count": 46,
                        "text": "Merchandising"
                    },
                    {
                        "key": "l1",
                        "id": "629461b2e6bf3c5f04e4f646",
                        "_id": "629461b2e6bf3c5f04e4f646",
                        "display": "Customer Service",
                        "value": "Customer Service",
                        "slug": "customer-service",
                        "childs": [
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6c6",
                                "_id": "629461b3e6bf3c5f04e4f6c6",
                                "display": "Support",
                                "value": "Support",
                                "parent": "629461b2e6bf3c5f04e4f646",
                                "slug": "support",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 19
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6c8",
                                "_id": "629461b3e6bf3c5f04e4f6c8",
                                "display": "Customer account",
                                "value": "Customer account",
                                "parent": "629461b2e6bf3c5f04e4f646",
                                "slug": "customer-account",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 23
                            }
                        ],
                        "kind": "single",
                        "display_type": "radio",
                        "type": "category_filter_l1",
                        "count": 38,
                        "text": "Customer Service"
                    },
                    {
                        "key": "l1",
                        "id": "629461b2e6bf3c5f04e4f64b",
                        "_id": "629461b2e6bf3c5f04e4f64b",
                        "display": "Inventory",
                        "value": "Inventory",
                        "slug": "inventory",
                        "childs": [
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6d6",
                                "_id": "629461b3e6bf3c5f04e4f6d6",
                                "display": "Managing inventory",
                                "value": "Managing inventory",
                                "parent": "629461b2e6bf3c5f04e4f64b",
                                "slug": "managing-inventory",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 31
                            }
                        ],
                        "kind": "single",
                        "display_type": "radio",
                        "type": "category_filter_l1",
                        "count": 41,
                        "text": "Inventory"
                    },
                    {
                        "key": "l1",
                        "id": "629461b2e6bf3c5f04e4f645",
                        "_id": "629461b2e6bf3c5f04e4f645",
                        "display": "Fulfillment",
                        "value": "Fulfillment",
                        "slug": "fulfillment",
                        "childs": [
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6c0",
                                "_id": "629461b3e6bf3c5f04e4f6c0",
                                "display": "Managing inventory and order",
                                "value": "Managing inventory and order",
                                "parent": "629461b2e6bf3c5f04e4f645",
                                "slug": "managing-inventory-and-order",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 24
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6c2",
                                "_id": "629461b3e6bf3c5f04e4f6c2",
                                "display": "Managing order",
                                "value": "Managing order",
                                "parent": "629461b2e6bf3c5f04e4f645",
                                "slug": "managing-order",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 21
                            }
                        ],
                        "kind": "single",
                        "display_type": "radio",
                        "type": "category_filter_l1",
                        "count": 38,
                        "text": "Fulfillment"
                    },
                    {
                        "key": "l1",
                        "id": "629461b2e6bf3c5f04e4f64a",
                        "_id": "629461b2e6bf3c5f04e4f64a",
                        "display": "Source and Selling Product",
                        "value": "Source and Selling Product",
                        "slug": "source-and-selling-product",
                        "childs": [
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6ce",
                                "_id": "629461b3e6bf3c5f04e4f6ce",
                                "display": "Marketplace",
                                "value": "Marketplace",
                                "parent": "629461b2e6bf3c5f04e4f64a",
                                "slug": "marketplace",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 21
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6cc",
                                "_id": "629461b3e6bf3c5f04e4f6cc",
                                "display": "Dropshipping",
                                "value": "Dropshipping",
                                "parent": "629461b2e6bf3c5f04e4f64a",
                                "slug": "dropshipping",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 21
                            }
                        ],
                        "kind": "single",
                        "display_type": "radio",
                        "type": "category_filter_l1",
                        "count": 36,
                        "text": "Source and Selling Product"
                    },
                    {
                        "key": "l1",
                        "id": "629461b2e6bf3c5f04e4f64c",
                        "_id": "629461b2e6bf3c5f04e4f64c",
                        "display": "Channel Management",
                        "value": "Channel Management",
                        "slug": "channel-management",
                        "childs": [
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6e1",
                                "_id": "629461b3e6bf3c5f04e4f6e1",
                                "display": "Policy and security",
                                "value": "Policy and security",
                                "parent": "629461b2e6bf3c5f04e4f64c",
                                "slug": "policy-and-security",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 9
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6e6",
                                "_id": "629461b3e6bf3c5f04e4f6e6",
                                "display": "Shipping solution",
                                "value": "Shipping solution",
                                "parent": "629461b2e6bf3c5f04e4f64c",
                                "slug": "shipping-solution",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 16
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6d9",
                                "_id": "629461b3e6bf3c5f04e4f6d9",
                                "display": "Internalization",
                                "value": "Internalization",
                                "parent": "629461b2e6bf3c5f04e4f64c",
                                "slug": "channel-management-internalization",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 12
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6de",
                                "_id": "629461b3e6bf3c5f04e4f6de",
                                "display": "Operation",
                                "value": "Operation",
                                "parent": "629461b2e6bf3c5f04e4f64c",
                                "slug": "operation",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 21
                            },
                            {
                                "key": "l2",
                                "id": "629461b3e6bf3c5f04e4f6e8",
                                "_id": "629461b3e6bf3c5f04e4f6e8",
                                "display": "Business Insight",
                                "value": "Business Insight",
                                "parent": "629461b2e6bf3c5f04e4f64c",
                                "slug": "business-insight",
                                "display_type": "checkbox",
                                "kind": "multivalues",
                                "type": "category_filter_l2",
                                "count": 16
                            }
                        ],
                        "kind": "single",
                        "display_type": "radio",
                        "type": "category_filter_l1",
                        "count": 34,
                        "text": "Channel Management"
                    }
                ],
                "type": "select",
                "multiple": true,
                "placeholder": "Search Categories",
                "predicate_prop": {
                    "item_source": "manual"
                }
            }
        ],
        "item_type": "category",
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
            },
            {
                "default": [],
                "id": "collection",
                "label": "Collections",
                "options": [],
                "type": "select",
                "multiple": true,
                "search": true,
                "placeholder": "Search Collections",
                "predicate_prop": {
                    "item_source": "manual"
                }
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
            },
            {
                "default": [],
                "id": "extension",
                "label": "Extensions",
                "options": [
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png",
                        "callbacks": {
                            "setup": "https://bulkcoupon.extensions.fyndx0.de/fp/setup",
                            "auth": "https://bulkcoupon.extensions.fyndx0.de/fp/auth",
                            "install": "https://bulkcoupon.extensions.fyndx0.de/fp/install",
                            "uninstall": "https://bulkcoupon.extensions.fyndx0.de/fp/uninstall"
                        },
                        "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "public",
                        "is_application_level": true,
                        "is_saleschannel": false,
                        "scope": [
                            "company/saleschannel",
                            "company/application/marketing"
                        ],
                        "_id": "610d2ad295dcfa14eb408bad",
                        "name": "Bulk Coupons Generator",
                        "base_url": "https://bulkcoupon.extensions.fyndx0.de",
                        "developed_by_name": "Rushabh Shah",
                        "contact_email": "rushabhmshah@gofynd.com",
                        "organization_id": "610d29f395dcfaba6b408ba6",
                        "created_at": "2021-08-06T12:28:02.036Z",
                        "modified_at": "2022-02-28T15:56:31.338Z",
                        "__v": 0,
                        "is_coming_soon": false,
                        "text": "Bulk Coupons Generator",
                        "value": "610d2ad295dcfa14eb408bad",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png",
                        "callbacks": {
                            "setup": "https://newsletter-sub-008.loca.lt/fp/setup",
                            "auth": "https://newsletter-sub-008.loca.lt/fp/auth",
                            "install": "https://newsletter-sub-008.loca.lt/fp/install",
                            "uninstall": "https://newsletter-sub-008.loca.lt/fp/uninstall"
                        },
                        "description": "",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "public",
                        "is_application_level": true,
                        "is_saleschannel": false,
                        "scope": [
                            "company/saleschannel"
                        ],
                        "_id": "60be66a2d4cbbf1fd0a67c8c",
                        "name": "newsletter-local Brijesh",
                        "base_url": "https://newsletter-sub-008.loca.lt",
                        "developed_by_name": "Social Icons Company",
                        "contact_email": "brijeshgajjar@gofynd.com",
                        "organization_id": "610d3a4595dcfae682408c07",
                        "created_at": "2021-06-07T18:34:10.795Z",
                        "modified_at": "2022-04-29T07:22:36.929Z",
                        "__v": 0,
                        "is_coming_soon": false,
                        "text": "newsletter-local Brijesh",
                        "value": "60be66a2d4cbbf1fd0a67c8c",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png",
                        "callbacks": {
                            "setup": "https://newsletter.extensions.fyndx0.de/fp/setup",
                            "auth": "https://newsletter.extensions.fyndx0.de/fp/auth",
                            "install": "https://newsletter.extensions.fyndx0.de/fp/install",
                            "uninstall": "https://newsletter.extensions.fyndx0.de/fp/uninstall"
                        },
                        "description": "Newsletter Subscription\nNewsletter Subscription",
                        "whitelisted_urls": [],
                        "ext_version": "1.0",
                        "extention_type": "public",
                        "is_application_level": true,
                        "is_saleschannel": false,
                        "scope": [
                            "company/saleschannel",
                            "company/application/settings"
                        ],
                        "_id": "609400409d0dcbdc2e6b76a5",
                        "name": "Newsletter Subscription",
                        "base_url": "https://newsletter.extensions.fyndx0.de",
                        "developed_by_name": "Fynd",
                        "contact_email": "brijeshgajjar@gofynd.com",
                        "organization_id": "610d178e2ab8f356aa98481b",
                        "created_at": "2021-05-06T14:42:08.318Z",
                        "modified_at": "2022-02-09T06:54:58.104Z",
                        "__v": 2,
                        "is_coming_soon": false,
                        "text": "Newsletter Subscription",
                        "value": "609400409d0dcbdc2e6b76a5",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/BfWmSEz1R-logo.png",
                        "callbacks": {
                            "setup": "https://google-tag-manager.extensions.fyndx0.de/fp/setup",
                            "auth": "https://google-tag-manager.extensions.fyndx0.de/fp/auth",
                            "install": "https://google-tag-manager.extensions.fyndx0.de/fp/install",
                            "uninstall": "https://google-tag-manager.extensions.fyndx0.de/fp/uninstall"
                        },
                        "description": "GTM",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "private",
                        "is_application_level": false,
                        "is_saleschannel": false,
                        "scope": [
                            "company/saleschannel",
                            "company/application/settings"
                        ],
                        "_id": "6110970195dcfa19ac408c67",
                        "name": "Googe Tag Manager",
                        "base_url": "https://google-tag-manager.extensions.fyndx0.de",
                        "developed_by_name": "Akash Organization",
                        "contact_email": "akashmane@gofynd.com",
                        "organization_id": "6110967d95dcfaf485408c60",
                        "created_at": "2021-08-09T02:46:25.744Z",
                        "modified_at": "2021-08-09T02:46:25.744Z",
                        "__v": 0,
                        "text": "Googe Tag Manager",
                        "value": "6110970195dcfa19ac408c67",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png",
                        "callbacks": {
                            "setup": "https://quiet-cow-22.loca.lt/fp/setup",
                            "auth": "https://quiet-cow-22.loca.lt/fp/auth",
                            "install": "https://quiet-cow-22.loca.lt/fp/install",
                            "uninstall": "https://quiet-cow-22.loca.lt/fp/uninstall"
                        },
                        "description": "Local tag manager",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "public",
                        "is_application_level": false,
                        "is_saleschannel": false,
                        "scope": [
                            "company/saleschannel",
                            "company/application/settings"
                        ],
                        "_id": "61109c6795dcfa38cb408c70",
                        "name": "Tag Manager Local",
                        "base_url": "https://quiet-cow-22.loca.lt",
                        "developed_by_name": "Akash Organization",
                        "contact_email": "akashmane@gofynd.com",
                        "organization_id": "6110967d95dcfaf485408c60",
                        "created_at": "2021-08-09T03:09:27.392Z",
                        "modified_at": "2021-09-09T04:40:50.398Z",
                        "__v": 0,
                        "text": "Tag Manager Local",
                        "value": "61109c6795dcfa38cb408c70",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/5qfbxktWw-logo.png",
                        "callbacks": {
                            "setup": "https://fp-extension.glamarx0.de/fp/setup",
                            "auth": "https://fp-extension.glamarx0.de/fp/auth",
                            "install": "https://fp-extension.glamarx0.de/fp/install",
                            "uninstall": "https://fp-extension.glamarx0.de/fp/uninstall"
                        },
                        "description": "GlamAR",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "private",
                        "is_application_level": true,
                        "is_saleschannel": false,
                        "scope": [
                            "company/product"
                        ],
                        "_id": "6110ccf195dcfa49cd408cdc",
                        "name": "GlamAR",
                        "base_url": "https://fp-extension.glamarx0.de",
                        "developed_by_name": "GlamaR",
                        "contact_email": "tusharmoraye@gofynd.com",
                        "organization_id": "6110cb9d95dcfa3c80408cd5",
                        "created_at": "2021-08-09T06:36:33.129Z",
                        "modified_at": "2021-09-21T12:31:43.880Z",
                        "__v": 1,
                        "text": "GlamAR",
                        "value": "6110ccf195dcfa49cd408cdc",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/vxKq0OJXl-logo.png",
                        "callbacks": {
                            "setup": "https://ajio.loca.lt/fp/setup",
                            "auth": "https://ajio.loca.lt/fp/auth",
                            "install": "https://ajio.loca.lt/fp/install",
                            "uninstall": "https://ajio.loca.lt/fp/uninstall"
                        },
                        "description": "ajio",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "private",
                        "is_application_level": false,
                        "is_saleschannel": false,
                        "scope": [
                            "company/profile",
                            "company/saleschannel"
                        ],
                        "_id": "6110d85f95dcfa6ec3408ce9",
                        "name": "ajio",
                        "base_url": "https://ajio.loca.lt",
                        "developed_by_name": "Demo",
                        "contact_email": "rakeshyadav@gofynd.com",
                        "organization_id": "6110d82395dcfa2a7a408ce2",
                        "created_at": "2021-08-09T07:25:19.783Z",
                        "modified_at": "2022-03-10T11:52:56.420Z",
                        "__v": 0,
                        "text": "ajio",
                        "value": "6110d85f95dcfa6ec3408ce9",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/AO4-MpSzn-logo.jpeg",
                        "callbacks": {
                            "setup": "https://nykaa-alankrit-v4.loca.lt/fp/setup",
                            "auth": "https://nykaa-alankrit-v4.loca.lt/fp/auth",
                            "install": "https://nykaa-alankrit-v4.loca.lt/fp/install",
                            "uninstall": "https://nykaa-alankrit-v4.loca.lt/fp/uninstall"
                        },
                        "description": "dfeefevrefwdfwev",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "private",
                        "is_application_level": false,
                        "is_saleschannel": false,
                        "scope": [
                            "company/profile",
                            "company/saleschannel",
                            "company/product",
                            "company/order",
                            "company/application/customer",
                            "company/application/analytics",
                            "company/application/storage",
                            "company/application/marketing",
                            "company/application/catalogue",
                            "company/application/communication",
                            "company/application/settings"
                        ],
                        "_id": "611129ed95dcfa0722408d95",
                        "name": "Nykaa",
                        "base_url": "https://nykaa-alankrit-v4.loca.lt",
                        "developed_by_name": "Apna_Market",
                        "contact_email": "alankritsinha@gofynd.com",
                        "organization_id": "6111297f95dcfa0847408d8e",
                        "created_at": "2021-08-09T13:13:17.036Z",
                        "modified_at": "2022-01-17T12:10:26.982Z",
                        "__v": 0,
                        "text": "Nykaa",
                        "value": "611129ed95dcfa0722408d95",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/jaOfDVYGe-logo.png",
                        "callbacks": {
                            "setup": "https://bulk-location.extensions.fyndx0.de/fp/setup",
                            "auth": "https://bulk-location.extensions.fyndx0.de/fp/auth",
                            "install": "https://bulk-location.extensions.fyndx0.de/fp/install",
                            "uninstall": "https://bulk-location.extensions.fyndx0.de/fp/uninstall"
                        },
                        "description": "Create and update multiple selling locations at once using Excel and CSV",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "public",
                        "is_application_level": false,
                        "is_saleschannel": false,
                        "scope": [
                            "company/profile"
                        ],
                        "_id": "61117dab95dcfa5db7408dba",
                        "name": "Multi Location Manager",
                        "base_url": "https://bulk-location.extensions.fyndx0.de",
                        "developed_by_name": "Multi Location",
                        "contact_email": "abhinavmaurya@gofynd.com",
                        "organization_id": "61117d3295dcfa7f9a408db3",
                        "created_at": "2021-08-09T19:10:35.891Z",
                        "modified_at": "2022-01-12T06:48:01.826Z",
                        "__v": 0,
                        "text": "Multi Location Manager",
                        "value": "61117dab95dcfa5db7408dba",
                        "label": "Extensions"
                    },
                    {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/JdPFZDJ-y-logo.jpeg",
                        "callbacks": {
                            "setup": "https://facebook-ct.extensions.fyndx0.de/fp/setup",
                            "auth": "https://facebook-ct.extensions.fyndx0.de/fp/auth",
                            "install": "https://facebook-ct.extensions.fyndx0.de/fp/install",
                            "uninstall": "https://facebook-ct.extensions.fyndx0.de/fp/uninstall"
                        },
                        "description": "Facebook Catalogue",
                        "whitelisted_urls": [],
                        "ext_version": "1.0.0",
                        "extention_type": "public",
                        "is_application_level": true,
                        "is_saleschannel": false,
                        "scope": [
                            "company/profile",
                            "company/product",
                            "company/application/catalogue"
                        ],
                        "_id": "6111ec7e95dcfa8e12408dd8",
                        "name": "Facebook Catalogue",
                        "base_url": "https://facebook-ct.extensions.fyndx0.de",
                        "developed_by_name": "Piyush Org",
                        "contact_email": "piyushvishwakarma@gofynd.com",
                        "organization_id": "6111ec0095dcfac23e408dd1",
                        "created_at": "2021-08-10T03:03:26.683Z",
                        "modified_at": "2022-02-02T09:11:04.485Z",
                        "__v": 0,
                        "text": "Facebook Catalogue",
                        "value": "6111ec7e95dcfa8e12408dd8",
                        "label": "Extensions"
                    }
                ],
                "type": "select",
                "multiple": true,
                "search": true,
                "predicate_prop": {
                    "item_source": "manual"
                },
                "placeholder": "Search Extensions",
                "value": []
            }
        ],
        "item_type": "extension",
        "created_at": "2022-05-20T11:16:31.245Z",
        "modified_at": "2022-05-20T11:16:31.245Z",
        "__v": 0
    }
]

module.exports.sectionForUpdate = {
  "name": "brands-listing",
  "props": {
      "title": {
          "type": "text",
          "value": "Popular Brands"
      },
      "header": {
          "type": "header"
      },
      "brand_type": {
          "value": "all",
          "type": "radio"
      },
      "department": {
          "type": "department"
      },
      "item_count": {
          "value": 5,
          "type": "range"
      },
      "layout": {
          "value": "horizontal",
          "type": "select"
      },
      "view_all": {
          "value": false,
          "type": "checkbox"
      }
  },
  "blocks": [],
  "preview": true,
  "preset": {}
};

module.exports.sectionSchemaForTest = {
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
          "type": "textbox",
          "display": true
      },
      {
          "id": "title",
          "label": "Title",
          "default": "",
          "type": "textbox",
          "display": true
      },
      {
          "id": "subtitle",
          "label": "Subtitle",
          "default": "",
          "type": "textbox",
          "display": true
      },
      {
          "id": "image",
          "label": "Banner Image",
          "default": "",
          "type": "image_picker",
          "display": true
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
          ],
          "display": false
      },
      {
          "id": "button_label",
          "label": "Button Label",
          "default": "",
          "type": "text",
          "display": true
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
          ],
          "display": true
      }
  ],
  "created_at": "2022-05-20T11:16:31.245Z",
  "modified_at": "2022-05-20T11:16:31.245Z",
  "__v": 0
}

module.exports.sectionForTest = {
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
      "heading": "Fynd Extensions ",
      "title": "Skyrocket your business experience using extensions",
      "subtitle": "Boost the capability of Fynd Platform using extensions created specially for the merchant community ",
      "image": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png",
      "image_position": "right",
      "button_label": "View All Extensions",
      "button_page_link": "Extensions List"
  },
  "props": {
      "heading": {
          "type": "textbox",
          "value": "Fynd Extensions "
      },
      "title": {
          "type": "textbox",
          "value": "Skyrocket your business experience using extensions"
      },
      "subtitle": {
          "type": "textbox",
          "value": "Boost the capability of Fynd Platform using extensions created specially for the merchant community "
      },
      "image": {
          "type": "image_picker",
          "value": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png"
      },
      "image_position": {
          "type": "radio",
          "value": "right"
      },
      "button_label": {
          "type": "text",
          "value": "View All Extensions"
      },
      "button_page_link": {
          "type": "select",
          "value": "Extensions List"
      }
  }
}

module.exports.pageForTest = {
  "_id": "6294abba16cd26002faff08c",
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
              "heading": "Fynd Extensions ",
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
              "extension": [
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
                  "609400409d0dcbdc2e6b76a5",
                  "60be66a2d4cbbf1fd0a67c8c",
                  "610d2ad295dcfa14eb408bad"
              ]
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
          "items": [
              {
                  "_id": "629461b2e6bf3c5f04e4f63a",
                  "level": 1,
                  "slug": "conversion",
                  "__v": 0,
                  "description": "description for this category in not more than 2 lines",
                  "display": "Conversion",
                  "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "value": "Conversion"
              },
              {
                  "_id": "629461b2e6bf3c5f04e4f63c",
                  "level": 1,
                  "slug": "merchandising",
                  "__v": 0,
                  "description": "description for this category in not more than 2 lines",
                  "display": "Merchandising",
                  "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "value": "Merchandising"
              },
              {
                  "_id": "629461b2e6bf3c5f04e4f63d",
                  "level": 1,
                  "slug": "marketing",
                  "__v": 0,
                  "description": "description for this category in not more than 2 lines",
                  "display": "Marketing",
                  "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "value": "Marketing"
              },
              {
                  "_id": "629461b2e6bf3c5f04e4f645",
                  "level": 1,
                  "slug": "fulfillment",
                  "__v": 0,
                  "description": "description for this category in not more than 2 lines",
                  "display": "Fulfillment",
                  "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                  "value": "Fulfillment"
              }
          ],
          "data": {
              "heading": "CATEGORIES",
              "title": "Extensions organized as per their genre",
              "subtitle": "Subtitle",
              "button_label": "View All",
              "button_page_link": "/extensions",
              "button_position": "bottom_center",
              "item_source": "manual",
              "category": [
                  {
                      "_id": "629461b2e6bf3c5f04e4f63a",
                      "level": 1,
                      "slug": "conversion",
                      "__v": 0,
                      "description": "description for this category in not more than 2 lines",
                      "display": "Conversion",
                      "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                      "value": "Conversion"
                  },
                  {
                      "_id": "629461b2e6bf3c5f04e4f63c",
                      "level": 1,
                      "slug": "merchandising",
                      "__v": 0,
                      "description": "description for this category in not more than 2 lines",
                      "display": "Merchandising",
                      "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                      "value": "Merchandising"
                  },
                  {
                      "_id": "629461b2e6bf3c5f04e4f63d",
                      "level": 1,
                      "slug": "marketing",
                      "__v": 0,
                      "description": "description for this category in not more than 2 lines",
                      "display": "Marketing",
                      "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                      "value": "Marketing"
                  },
                  {
                      "_id": "629461b2e6bf3c5f04e4f645",
                      "level": 1,
                      "slug": "fulfillment",
                      "__v": 0,
                      "description": "description for this category in not more than 2 lines",
                      "display": "Fulfillment",
                      "icon_image": "https://i.ibb.co/Z6gPpqd/Rectangle-144.png",
                      "value": "Fulfillment"
                  },
                  "Conversion",
                  "Merchandising",
                  "Marketing"
              ]
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
          "type": "collection_grid",
          "data": {
              "heading": "Collections",
              "title": "Latest",
              "subtitle": "Subtitle",
              "button_label": "View",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "collection": [
                  "623847d0ec3c4b10b1f5fed6",
                  "623b4d518087776e618af270",
                  "627ba8371171f7705212333b",
                  "62384f66ec3c4b4e6ff5fee6"
              ]
          },
          "items": []
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
          "page_type": "extension",
          "type": "extension_grid",
          "data": {
              "heading": "Latest Extensions",
              "title": "Extensions",
              "subtitle": "Subtitle",
              "button_label": "View",
              "button_page_link": "Collections",
              "item_source": "manual",
              "image": "",
              "image_position": "",
              "extension": [
                  "610d2ad295dcfa14eb408bad",
                  "60be66a2d4cbbf1fd0a67c8c",
                  "609400409d0dcbdc2e6b76a5"
              ]
          }
      }
  ],
  "props": [],
  "created_at": "2022-05-30T11:34:18.217Z",
  "modified_at": "2022-05-31T10:25:32.292Z",
  "__v": 3
}

module.exports.inputTypeSection = {
    "predicate": {
        "screen": {
            "mobile": true,
            "table": true,
            "desktop": true
        }
    },
    "tags": [],
    "visible": true,
    "page_type": "extension",
    "type": "extension_item_list",
    "data": {
        "heading": "NEW! NEW!",
        "title": "New Extensions",
        "subtitle": "Subtitle",
        "button_label": "View All",
        "button_page_link": "/extensions",
        "button_position": "top_right",
        "item_source": "api",
        "api_source": "extension_latest",
        "extension": [],
        "extension_details": []
    },
    "item_type": "extension",
    "items": [
        {
            "value": "611624ac95dcfa262740920e"
        },
        {
            "value": "6116026a95dcfa05eb4091e3"
        },
        {
            "value": "61155f5d95dcfad8294091c4"
        },
        {
            "value": "61138cf895dcfa08a5408fc4"
        }
    ],
    "props": {
        "heading": {
            "type": "textbox",
            "value": "NEW! NEW!"
        },
        "title": {
            "type": "textbox",
            "value": "New Extensions"
        },
        "subtitle": {
            "type": "textbox",
            "value": "Subtitle"
        },
        "button_label": {
            "type": "text",
            "value": "View All"
        },
        "button_page_link": {
            "type": "select",
            "value": "/extensions"
        },
        "button_position": {
            "type": "select",
            "value": "top_right"
        },
        "item_source": {
            "type": "radio",
            "value": "api"
        },
        "api_source": {
            "type": "select",
            "value": "extension_latest"
        },
        "extension": {
            "type": "select",
            "value": [
                "611624ac95dcfa262740920e",
                "6116026a95dcfa05eb4091e3",
                "61155f5d95dcfad8294091c4",
                "61138cf895dcfa08a5408fc4"
            ]
        }
    }
}

module.exports.inputTypeSectionSchema = {
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
            "type": "textbox",
            "display": true
        },
        {
            "id": "title",
            "label": "Title",
            "default": "",
            "type": "textbox",
            "display": true
        },
        {
            "id": "subtitle",
            "label": "Subtitle",
            "default": "",
            "type": "textbox",
            "display": true
        },
        {
            "id": "item_count",
            "label": "Item Count",
            "default": "3",
            "type": "range",
            "min": 3,
            "max": 9,
            "step": 3
        },
        {
            "id": "button_label",
            "label": "Button Label",
            "default": "View All",
            "type": "text",
            "display": true
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
            ],
            "display": true
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
            ],
            "display": true
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
            ],
            "display": true
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
            ],
            "display": true
        },
        {
            "default": [],
            "id": "extension",
            "label": "Extensions",
            "options": [
                {
                    "_id": "610d2ad295dcfa14eb408bad",
                    "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                    "whitelisted_urls": [],
                    "ext_version": "1.0.0",
                    "extention_type": "public",
                    "is_application_level": true,
                    "is_saleschannel": false,
                    "scope": [
                        "company/saleschannel",
                        "company/application/marketing"
                    ],
                    "name": "Bulk Coupons Generator",
                    "base_url": "https://bulkcoupon.extensions.fyndx0.de",
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png",
                    "callbacks": {
                        "setup": "https://bulkcoupon.extensions.fyndx0.de/fp/setup",
                        "auth": "https://bulkcoupon.extensions.fyndx0.de/fp/auth",
                        "install": "https://bulkcoupon.extensions.fyndx0.de/fp/install",
                        "uninstall": "https://bulkcoupon.extensions.fyndx0.de/fp/uninstall",
                        "auto_install": "https://bulkcoupon.extensions.fyndx0.de/fp/auto_install"
                    },
                    "developed_by_name": "Rushabh Shah",
                    "contact_email": "rushabhmshah@gofynd.com",
                    "organization_id": "610d29f395dcfaba6b408ba6",
                    "created_at": "2021-08-06T12:28:02.036Z",
                    "modified_at": "2022-02-28T15:56:31.338Z",
                    "__v": 0,
                    "is_coming_soon": false,
                    "extension_public_data": {
                        "_id": "621cf0c006962803b4cd780d",
                        "category": {
                            "categories_l1": [
                                {
                                    "id": "62320b45f4213eb19aa8f44e",
                                    "_id": "62320b45f4213eb19aa8f44e",
                                    "slug": "merchandising"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f458",
                                    "_id": "62320b45f4213eb19aa8f458",
                                    "slug": "source-and-selling-product"
                                }
                            ],
                            "categories_l2": [
                                {
                                    "id": "62320b45f4213eb19aa8f4e5",
                                    "_id": "62320b45f4213eb19aa8f4e5",
                                    "parent": "62320b45f4213eb19aa8f458",
                                    "slug": "marketplace"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f480",
                                    "_id": "62320b45f4213eb19aa8f480",
                                    "parent": "62320b45f4213eb19aa8f44e",
                                    "slug": "announcement-and-banner"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f486",
                                    "_id": "62320b45f4213eb19aa8f486",
                                    "parent": "62320b45f4213eb19aa8f44e",
                                    "slug": "additional-purchase"
                                }
                            ]
                        },
                        "listing_info": {
                            "keywords": [],
                            "name": "Bulk Coupons Generator",
                            "tagline": "Test",
                            "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png"
                        },
                        "details": {
                            "screenshots": {
                                "desktop": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/fQ_yjdowj-desk-sc-1.jpeg"
                                ],
                                "mobile": []
                            },
                            "integrations": [],
                            "benefits": [
                                {
                                    "_id": "621cf0c00696281d1dcd780e",
                                    "title": "Test",
                                    "description": "test"
                                }
                            ],
                            "video_url": [],
                            "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                            "demo_url": ""
                        },
                        "contact_info": {
                            "support": {
                                "email": "rushabhmshah@gofynd.com",
                                "phone": "9930630722",
                                "website_url": "",
                                "faq_url": "",
                                "privacy_policy_url": ""
                            }
                        },
                        "coming_soon": {
                            "upvote_count": 0,
                            "is_coming_soon": false
                        },
                        "scope": [
                            "company/saleschannel",
                            "company/application/marketing"
                        ],
                        "plans": [
                            {
                                "name": "Standard Plan",
                                "features": "Standard feature\nStandard feature\nStandard feature",
                                "type": "recurring",
                                "price": {
                                    "amount": 99,
                                    "currency": "INR"
                                },
                                "trial_days": 0,
                                "additional_charges": "",
                                "recurring": {
                                    "type": "month",
                                    "recurring_time": 30,
                                    "yearly_amount": 1188
                                }
                            },
                            {
                                "name": "Premium Plan",
                                "features": "Premium Feature\nPremium Feature\nPremium Feature",
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
                        "extension_id": "610d2ad295dcfa14eb408bad",
                        "slug": "bulk-coupons-generator",
                        "plan_type": "recurring",
                        "plans_url": "",
                        "current_status": "active",
                        "organization_id": "610d29f395dcfaba6b408ba6",
                        "created_at": "2022-02-28T15:56:48.806Z",
                        "modified_at": "2022-03-21T12:27:08.714Z",
                        "organization": {
                            "name": "Rushabh Shah",
                            "slug": "Rushab-omn-2"
                        }
                    },
                    "organization": {
                        "name": "Rushabh Shah",
                        "slug": "Rushab-omn-2"
                    },
                    "text": "Bulk Coupons Generator",
                    "value": "610d2ad295dcfa14eb408bad",
                    "label": "Extensions"
                },
                {
                    "_id": "60be66a2d4cbbf1fd0a67c8c",
                    "description": "",
                    "whitelisted_urls": [],
                    "ext_version": "1.0.0",
                    "extention_type": "public",
                    "scope": [
                        "company/saleschannel"
                    ],
                    "name": "newsletter-local Brijesh",
                    "base_url": "https://newsletter-sub-008.loca.lt",
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png",
                    "callbacks": {
                        "setup": "https://newsletter-sub-008.loca.lt/fp/setup",
                        "auth": "https://newsletter-sub-008.loca.lt/fp/auth",
                        "install": "https://newsletter-sub-008.loca.lt/fp/install",
                        "uninstall": "https://newsletter-sub-008.loca.lt/fp/uninstall"
                    },
                    "developed_by_name": "Social Icons Company",
                    "contact_email": "brijeshgajjar@gofynd.com",
                    "organization_id": "610d3a4595dcfae682408c07",
                    "created_at": "2021-06-07T18:34:10.795Z",
                    "modified_at": "2022-04-29T07:22:36.929Z",
                    "__v": 0,
                    "is_application_level": true,
                    "is_saleschannel": false,
                    "is_coming_soon": false,
                    "extension_public_data": {
                        "_id": "626b92f7f36a77f7b0517b87",
                        "category": {
                            "categories_l1": [],
                            "categories_l2": []
                        },
                        "listing_info": {
                            "keywords": [],
                            "name": "newsletter-local Brijesh",
                            "tagline": "test",
                            "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
                        },
                        "details": {
                            "screenshots": {
                                "desktop": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pX9zldCt8-desk-sc-1.jpeg",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LvtKWCCZF-desk-sc-3.jpeg",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pjqTQJKfF-desk-sc-3.jpeg"
                                ],
                                "mobile": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/hJZfpuvZo-mob-sc-2.jpeg",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/i2pysVdSu-mob-sc-3.jpeg",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/u7sf_tXdN-mob-sc-3.jpeg"
                                ]
                            },
                            "integrations": [],
                            "benefits": [
                                {
                                    "_id": "626b9420f36a773678517bbf",
                                    "title": "Test",
                                    "description": "test"
                                }
                            ],
                            "video_url": [],
                            "description": "<p>Test</p>",
                            "demo_url": ""
                        },
                        "contact_info": {
                            "support": {
                                "email": "brijeshgajjar@gofynd.com",
                                "phone": "8452996729",
                                "website_url": "",
                                "faq_url": "",
                                "privacy_policy_url": ""
                            }
                        },
                        "coming_soon": {
                            "upvote_count": 0,
                            "is_coming_soon": false
                        },
                        "scope": [
                            "company/saleschannel"
                        ],
                        "plans": [
                            {
                                "name": "Free",
                                "features": "test",
                                "type": "free",
                                "price": {
                                    "amount": 0,
                                    "currency": "INR"
                                },
                                "trial_days": 0,
                                "additional_charges": ""
                            }
                        ],
                        "extension_id": "60be66a2d4cbbf1fd0a67c8c",
                        "slug": "newsletter-local-brijesh",
                        "plan_type": "free",
                        "plans_url": "",
                        "current_status": "active",
                        "organization_id": "610d3a4595dcfae682408c07",
                        "created_at": "2022-04-29T07:25:43.514Z",
                        "modified_at": "2022-04-29T07:30:40.646Z",
                        "organization": {
                            "name": "Social Icons Company",
                            "slug": "Social-asx-16"
                        }
                    },
                    "organization": {
                        "name": "Social Icons Company",
                        "slug": "Social-asx-16"
                    },
                    "text": "newsletter-local Brijesh",
                    "value": "60be66a2d4cbbf1fd0a67c8c",
                    "label": "Extensions"
                },
                {
                    "_id": "609400409d0dcbdc2e6b76a5",
                    "description": "Newsletter Subscription\nNewsletter Subscription",
                    "whitelisted_urls": [],
                    "ext_version": "1.0",
                    "extention_type": "public",
                    "scope": [
                        "company/saleschannel",
                        "company/application/settings"
                    ],
                    "name": "Newsletter Subscription",
                    "base_url": "https://newsletter.extensions.fyndx0.de",
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png",
                    "callbacks": {
                        "setup": "https://newsletter.extensions.fyndx0.de/fp/setup",
                        "auth": "https://newsletter.extensions.fyndx0.de/fp/auth",
                        "install": "https://newsletter.extensions.fyndx0.de/fp/install",
                        "uninstall": "https://newsletter.extensions.fyndx0.de/fp/uninstall"
                    },
                    "developed_by_name": "Fynd",
                    "contact_email": "brijeshgajjar@gofynd.com",
                    "organization_id": "610d178e2ab8f356aa98481b",
                    "created_at": "2021-05-06T14:42:08.318Z",
                    "modified_at": "2022-02-09T06:54:58.104Z",
                    "__v": 2,
                    "is_application_level": true,
                    "is_saleschannel": false,
                    "is_coming_soon": false,
                    "extension_public_data": {
                        "_id": "60bf7f734fe0a3c8e90e5b83",
                        "listing_info": {
                            "keywords": [],
                            "name": "Newsletter Subscription",
                            "tagline": "dsvsv",
                            "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
                        },
                        "details": {
                            "screenshots": {
                                "desktop": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nKlrV_01V-desk-sc-1.png",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/UZ0zmE2sW-desk-sc-2.png",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/cGtO7qpge-desk-sc-3.png"
                                ],
                                "mobile": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/10Twf0N0R-mob-sc-1.png",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/CRHrGZf5n-mob-sc-2.png",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nDsWxx2rB-mob-sc-3.png"
                                ]
                            },
                            "integrations": [],
                            "benefits": [
                                {
                                    "_id": "623db9405ce44ba088b9c5bc",
                                    "title": "dsvsv",
                                    "description": "dvssdvdvdv"
                                }
                            ],
                            "description": "<p>Now you can run referral campaigns that lets you and your existing customers refer their friends and family to register on your website.<br /><br />Features<br />&bull; Configure reward for the referrer<br />&bull; Configure reward for the one being referred<br />&bull; Set validity of referral and the reward<br />&bull; Enable/Disable referral campaigns</p>",
                            "demo_url": "",
                            "video_url": []
                        },
                        "contact_info": {
                            "support": {
                                "email": "aayushvjain@gofynd.com",
                                "phone": "8767087087",
                                "website_url": "",
                                "faq_url": "",
                                "privacy_policy_url": ""
                            }
                        },
                        "scope": [
                            "company/saleschannel",
                            "company/application/settings"
                        ],
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
                        "extension_id": "609400409d0dcbdc2e6b76a5",
                        "slug": "newsletter-subscription",
                        "plan_type": "free",
                        "current_status": "active",
                        "organization_id": "610d178e2ab8f356aa98481b",
                        "created_at": "2021-06-08T14:32:19.574Z",
                        "modified_at": "2022-03-25T12:44:48.325Z",
                        "plans_url": "",
                        "coming_soon": {
                            "upvote_count": 0,
                            "is_coming_soon": false
                        },
                        "category": {
                            "categories_l1": [
                                {
                                    "id": "62320b45f4213eb19aa8f44c",
                                    "slug": "marketing",
                                    "_id": "62320b45f4213eb19aa8f44c"
                                }
                            ],
                            "categories_l2": [
                                {
                                    "id": "62320b45f4213eb19aa8f4aa",
                                    "slug": "advertisement",
                                    "_id": "62320b45f4213eb19aa8f4aa",
                                    "parent": "62320b45f4213eb19aa8f44c"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f4c6",
                                    "slug": "marketing-analytics",
                                    "_id": "62320b45f4213eb19aa8f4c6",
                                    "parent": "62320b45f4213eb19aa8f44c"
                                }
                            ]
                        },
                        "organization": {
                            "name": "Fynd",
                            "slug": "Fynd-s8f-32"
                        }
                    },
                    "organization": {
                        "name": "Fynd",
                        "slug": "Fynd-s8f-32"
                    },
                    "text": "Newsletter Subscription",
                    "value": "609400409d0dcbdc2e6b76a5",
                    "label": "Extensions"
                },
                {
                    "_id": "61109c6795dcfa38cb408c70",
                    "description": "Local tag manager",
                    "whitelisted_urls": [],
                    "ext_version": "1.0.0",
                    "extention_type": "public",
                    "is_application_level": false,
                    "is_saleschannel": false,
                    "scope": [
                        "company/saleschannel",
                        "company/application/settings"
                    ],
                    "name": "Tag Manager Local",
                    "base_url": "https://quiet-cow-22.loca.lt",
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png",
                    "callbacks": {
                        "setup": "https://quiet-cow-22.loca.lt/fp/setup",
                        "auth": "https://quiet-cow-22.loca.lt/fp/auth",
                        "install": "https://quiet-cow-22.loca.lt/fp/install",
                        "uninstall": "https://quiet-cow-22.loca.lt/fp/uninstall"
                    },
                    "developed_by_name": "Akash Organization",
                    "contact_email": "akashmane@gofynd.com",
                    "organization_id": "6110967d95dcfaf485408c60",
                    "created_at": "2021-08-09T03:09:27.392Z",
                    "modified_at": "2021-09-09T04:40:50.398Z",
                    "__v": 0,
                    "extension_public_data": {
                        "_id": "61109ded41dc073111c38f59",
                        "listing_info": {
                            "keywords": [],
                            "name": "Tag Manager Local",
                            "tagline": "Google Tag Manager",
                            "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/St-C8mG8_-logo.png"
                        },
                        "details": {
                            "screenshots": {
                                "desktop": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/bNNRnl-IE-desk-sc-1.png",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/P0IcHYNbA-desk-sc-2.png",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PlY2R2xgo-desk-sc-3.png"
                                ],
                                "mobile": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/30gIT73MK-mob-sc-1.png",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/XoAtVMhIn-mob-sc-2.png",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/XoAtVMhIn-mob-sc-2.png"
                                ]
                            },
                            "integrations": [],
                            "benefits": [
                                {
                                    "_id": "61109ded41dc072bf4c38f5a",
                                    "title": "Feature 1",
                                    "description": "Description 1"
                                }
                            ],
                            "description": "Local tag manager",
                            "demo_url": "https://honest-rattlesnake-7.loca.lt/",
                            "video_url": []
                        },
                        "contact_info": {
                            "support": {
                                "email": "akashmane@gofynd.com",
                                "phone": "8652523958",
                                "website_url": "https://honest-rattlesnake-7.loca.lt/",
                                "faq_url": "https://honest-rattlesnake-7.loca.lt/",
                                "privacy_policy_url": "https://honest-rattlesnake-7.loca.lt/"
                            }
                        },
                        "scope": [
                            "company/saleschannel",
                            "company/application/settings"
                        ],
                        "plans": [
                            {
                                "name": "Basic",
                                "features": "Basic ",
                                "type": "recurring",
                                "price": {
                                    "amount": 99,
                                    "currency": "INR"
                                },
                                "trial_days": 0,
                                "additional_charges": "",
                                "recurring": {
                                    "type": "month",
                                    "recurring_time": 30,
                                    "yearly_amount": 1188
                                }
                            }
                        ],
                        "extension_id": "61109c6795dcfa38cb408c70",
                        "slug": "tag-manager-local",
                        "plan_type": "recurring",
                        "plans_url": "https://honest-rattlesnake-7.loca.lt/company/1/pricing",
                        "current_status": "active",
                        "organization_id": "6110967d95dcfaf485408c60",
                        "created_at": "2021-08-09T03:15:57.074Z",
                        "modified_at": "2022-03-21T12:27:06.809Z",
                        "coming_soon": {
                            "upvote_count": 0
                        },
                        "category": {
                            "categories_l1": [
                                {
                                    "id": "62320b45f4213eb19aa8f45b",
                                    "_id": "62320b45f4213eb19aa8f45b",
                                    "slug": "inventory"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f45a",
                                    "_id": "62320b45f4213eb19aa8f45a",
                                    "slug": "customer-service"
                                }
                            ],
                            "categories_l2": [
                                {
                                    "id": "62320b45f4213eb19aa8f4d9",
                                    "_id": "62320b45f4213eb19aa8f4d9",
                                    "parent": "62320b45f4213eb19aa8f45b",
                                    "slug": "managing-inventory"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f4d4",
                                    "_id": "62320b45f4213eb19aa8f4d4",
                                    "parent": "62320b45f4213eb19aa8f45a",
                                    "slug": "support"
                                }
                            ]
                        },
                        "organization": {
                            "name": "Akash Organization",
                            "slug": "AkashO-2xk-98"
                        }
                    },
                    "organization": {
                        "name": "Akash Organization",
                        "slug": "AkashO-2xk-98"
                    },
                    "text": "Tag Manager Local",
                    "value": "61109c6795dcfa38cb408c70",
                    "label": "Extensions"
                },
                {
                    "_id": "61117dab95dcfa5db7408dba",
                    "description": "Create and update multiple selling locations at once using Excel and CSV",
                    "whitelisted_urls": [],
                    "ext_version": "1.0.0",
                    "extention_type": "public",
                    "is_application_level": false,
                    "is_saleschannel": false,
                    "scope": [
                        "company/profile"
                    ],
                    "name": "Multi Location Manager",
                    "base_url": "https://bulk-location.extensions.fyndx0.de",
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/jaOfDVYGe-logo.png",
                    "callbacks": {
                        "setup": "https://bulk-location.extensions.fyndx0.de/fp/setup",
                        "auth": "https://bulk-location.extensions.fyndx0.de/fp/auth",
                        "install": "https://bulk-location.extensions.fyndx0.de/fp/install",
                        "uninstall": "https://bulk-location.extensions.fyndx0.de/fp/uninstall"
                    },
                    "developed_by_name": "Multi Location",
                    "contact_email": "abhinavmaurya@gofynd.com",
                    "organization_id": "61117d3295dcfa7f9a408db3",
                    "created_at": "2021-08-09T19:10:35.891Z",
                    "modified_at": "2022-01-12T06:48:01.826Z",
                    "__v": 0,
                    "extension_public_data": {
                        "_id": "6111fc5841dc070042c38f5d",
                        "listing_info": {
                            "keywords": [
                                "bulk",
                                "multi",
                                "locations"
                            ],
                            "name": "Multi Location Manager",
                            "tagline": "Create and update multiple selling locations at once using Excel and CSV",
                            "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/RUnu34gmJ-logo.png"
                        },
                        "details": {
                            "screenshots": {
                                "desktop": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Og8k9HyMY-desk-sc-1.png",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/M5VGePGD7-desk-sc-2.png"
                                ],
                                "mobile": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/NMZQDEpZN-mob-sc-1.png"
                                ]
                            },
                            "integrations": [],
                            "benefits": [
                                {
                                    "_id": "6111fc5841dc0705d7c38f5e",
                                    "title": "Location Management",
                                    "description": "Download our Excel or CSV template to add and update selling locations"
                                }
                            ],
                            "description": "Create and update multiple selling locations at once using Excel and CSV",
                            "demo_url": "",
                            "video_url": []
                        },
                        "contact_info": {
                            "support": {
                                "email": "abhinavmaurya@gofynd.com",
                                "phone": "7905339667",
                                "website_url": "",
                                "faq_url": "",
                                "privacy_policy_url": ""
                            }
                        },
                        "scope": [
                            "company/profile"
                        ],
                        "plans": [
                            {
                                "name": "Standard",
                                "features": "Create and update multiple selling locations at once using Excel and CSV",
                                "type": "recurring",
                                "price": {
                                    "amount": 99,
                                    "currency": "INR"
                                },
                                "trial_days": 0,
                                "additional_charges": "",
                                "recurring": {
                                    "type": "month",
                                    "recurring_time": 30,
                                    "yearly_amount": 1188
                                }
                            }
                        ],
                        "extension_id": "61117dab95dcfa5db7408dba",
                        "slug": "multi-location-manager",
                        "plan_type": "recurring",
                        "plans_url": "",
                        "current_status": "active",
                        "organization_id": "61117d3295dcfa7f9a408db3",
                        "created_at": "2021-08-10T04:11:04.509Z",
                        "modified_at": "2022-03-21T12:27:07.205Z",
                        "coming_soon": {
                            "upvote_count": 0
                        },
                        "category": {
                            "categories_l1": [
                                {
                                    "id": "62320b45f4213eb19aa8f458",
                                    "_id": "62320b45f4213eb19aa8f458",
                                    "slug": "source-and-selling-product"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f45c",
                                    "_id": "62320b45f4213eb19aa8f45c",
                                    "slug": "channel-management"
                                }
                            ],
                            "categories_l2": [
                                {
                                    "id": "62320b45f4213eb19aa8f4f4",
                                    "_id": "62320b45f4213eb19aa8f4f4",
                                    "parent": "62320b45f4213eb19aa8f45c",
                                    "slug": "shipping-solution"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f4ec",
                                    "_id": "62320b45f4213eb19aa8f4ec",
                                    "parent": "62320b45f4213eb19aa8f45c",
                                    "slug": "operation"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f4e5",
                                    "_id": "62320b45f4213eb19aa8f4e5",
                                    "parent": "62320b45f4213eb19aa8f458",
                                    "slug": "marketplace"
                                }
                            ]
                        },
                        "organization": {
                            "name": "Abhinav",
                            "slug": "MultiL-fnm-55"
                        }
                    },
                    "organization": {
                        "name": "Abhinav",
                        "slug": "MultiL-fnm-55"
                    },
                    "text": "Multi Location Manager",
                    "value": "61117dab95dcfa5db7408dba",
                    "label": "Extensions"
                },
                {
                    "_id": "6111ec7e95dcfa8e12408dd8",
                    "description": "Facebook Catalogue",
                    "whitelisted_urls": [],
                    "ext_version": "1.0.0",
                    "extention_type": "public",
                    "is_application_level": true,
                    "is_saleschannel": false,
                    "scope": [
                        "company/profile",
                        "company/product",
                        "company/application/catalogue"
                    ],
                    "name": "Facebook Catalogue",
                    "base_url": "https://facebook-ct.extensions.fyndx0.de",
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/JdPFZDJ-y-logo.jpeg",
                    "callbacks": {
                        "setup": "https://facebook-ct.extensions.fyndx0.de/fp/setup",
                        "auth": "https://facebook-ct.extensions.fyndx0.de/fp/auth",
                        "install": "https://facebook-ct.extensions.fyndx0.de/fp/install",
                        "uninstall": "https://facebook-ct.extensions.fyndx0.de/fp/uninstall"
                    },
                    "developed_by_name": "Piyush Org",
                    "contact_email": "piyushvishwakarma@gofynd.com",
                    "organization_id": "6111ec0095dcfac23e408dd1",
                    "created_at": "2021-08-10T03:03:26.683Z",
                    "modified_at": "2022-02-02T09:11:04.485Z",
                    "__v": 0,
                    "extension_public_data": {
                        "_id": "6111fc2741dc07b7bbc38f5b",
                        "listing_info": {
                            "keywords": [
                                "facebook"
                            ],
                            "name": "Facebook Catalogue",
                            "tagline": "Export products in Facebook compatible format",
                            "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/JdPFZDJ-y-logo.jpeg"
                        },
                        "details": {
                            "screenshots": {
                                "desktop": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/TknKwu-cj-desk-sc-1.png"
                                ],
                                "mobile": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Q30Y33G-c-mob-sc-1.png"
                                ]
                            },
                            "integrations": [],
                            "benefits": [
                                {
                                    "_id": "6111fc2741dc070437c38f5c",
                                    "title": "Catalogue Export",
                                    "description": "Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager."
                                }
                            ],
                            "description": "<p>Your catalogue on Fynd Platform is readily usable on Facebook Commerce Manager. This app helps you transform your Fynd Platform catalogue into Facebook's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Facebook Commerce Manager to upload your products to Facebook Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Facebook marketplace to Fynd Platform using the exported CSV from Facebook Commerce Manager.</li>\n</ul>\n</li>\n</ul>",
                            "demo_url": "",
                            "video_url": []
                        },
                        "contact_info": {
                            "support": {
                                "email": "piyushvishwakarma@gofynd.com",
                                "phone": "7208229699",
                                "website_url": "",
                                "faq_url": "",
                                "privacy_policy_url": ""
                            }
                        },
                        "scope": [
                            "company/profile",
                            "company/product",
                            "company/application/catalogue"
                        ],
                        "plans": [
                            {
                                "name": "Premium",
                                "features": "Unlimited catalogue export   \nSchedule catalogue generation\nView export event history ",
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
                        "extension_id": "6111ec7e95dcfa8e12408dd8",
                        "slug": "facebook-catalogue",
                        "plan_type": "recurring",
                        "plans_url": "",
                        "current_status": "active",
                        "organization_id": "6111ec0095dcfac23e408dd1",
                        "created_at": "2021-08-10T04:10:15.269Z",
                        "modified_at": "2022-03-21T12:27:06.810Z",
                        "coming_soon": {
                            "upvote_count": 0
                        },
                        "category": {
                            "categories_l1": [
                                {
                                    "id": "62320b45f4213eb19aa8f44e",
                                    "_id": "62320b45f4213eb19aa8f44e",
                                    "slug": "merchandising"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f458",
                                    "_id": "62320b45f4213eb19aa8f458",
                                    "slug": "source-and-selling-product"
                                }
                            ],
                            "categories_l2": [
                                {
                                    "id": "62320b45f4213eb19aa8f4e1",
                                    "_id": "62320b45f4213eb19aa8f4e1",
                                    "parent": "62320b45f4213eb19aa8f458",
                                    "slug": "dropshipping"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f483",
                                    "_id": "62320b45f4213eb19aa8f483",
                                    "parent": "62320b45f4213eb19aa8f44e",
                                    "slug": "product-display"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f4e5",
                                    "_id": "62320b45f4213eb19aa8f4e5",
                                    "parent": "62320b45f4213eb19aa8f458",
                                    "slug": "marketplace"
                                }
                            ]
                        },
                        "organization": {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    },
                    "organization": {
                        "name": "Piyush Org",
                        "slug": "Piyush-ph2-25"
                    },
                    "text": "Facebook Catalogue",
                    "value": "6111ec7e95dcfa8e12408dd8",
                    "label": "Extensions"
                },
                {
                    "_id": "61138cf895dcfa08a5408fc4",
                    "description": "Newsletter local by aayush",
                    "whitelisted_urls": [],
                    "ext_version": "1.0.0",
                    "extention_type": "public",
                    "is_application_level": true,
                    "is_saleschannel": false,
                    "scope": [
                        "company/saleschannel",
                        "company/application/settings"
                    ],
                    "name": "Newsletter-Local-Aayush",
                    "base_url": "https://example-javascript-001.loca.lt",
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png",
                    "callbacks": {
                        "setup": "https://example-javascript-001.loca.lt/fp/setup",
                        "auth": "https://example-javascript-001.loca.lt/fp/auth",
                        "install": "https://example-javascript-001.loca.lt/fp/install",
                        "uninstall": "https://example-javascript-001.loca.lt/fp/uninstall"
                    },
                    "developed_by_name": "Fynd",
                    "contact_email": "regrowth@gofynd.com",
                    "organization_id": "610d178e2ab8f356aa98481b",
                    "created_at": "2021-08-11T08:40:24.109Z",
                    "modified_at": "2022-03-04T07:46:02.077Z",
                    "__v": 0,
                    "is_coming_soon": false,
                    "extension_public_data": {
                        "_id": "6113c85841dc073aebc38f5f",
                        "listing_info": {
                            "keywords": [],
                            "name": "Newsletter-Local-Aayush",
                            "tagline": "This is tagline for test2",
                            "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/2lonu-tXG-logo.png"
                        },
                        "details": {
                            "screenshots": {
                                "desktop": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/cKylPAkW_-desk-sc-1.png"
                                ],
                                "mobile": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LqwXrhZGR-mob-sc-1.png"
                                ]
                            },
                            "integrations": [],
                            "benefits": [
                                {
                                    "_id": "6113c85841dc074febc38f60",
                                    "title": "feature 1",
                                    "description": "feature 1"
                                }
                            ],
                            "description": "Newsletter local by aayush",
                            "demo_url": "",
                            "video_url": []
                        },
                        "contact_info": {
                            "support": {
                                "email": "regrowth@gofynd.com",
                                "phone": "8767087087",
                                "website_url": "",
                                "faq_url": "",
                                "privacy_policy_url": ""
                            }
                        },
                        "scope": [
                            "company/saleschannel",
                            "company/application/settings"
                        ],
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
                        "extension_id": "61138cf895dcfa08a5408fc4",
                        "slug": "newsletter-local-aayush",
                        "plan_type": "free",
                        "plans_url": "",
                        "current_status": "active",
                        "organization_id": "610d178e2ab8f356aa98481b",
                        "created_at": "2021-08-11T12:53:45.001Z",
                        "modified_at": "2022-03-21T12:27:06.810Z",
                        "coming_soon": {
                            "upvote_count": 0
                        },
                        "category": {
                            "categories_l1": [
                                {
                                    "id": "62320b45f4213eb19aa8f455",
                                    "_id": "62320b45f4213eb19aa8f455",
                                    "slug": "fulfillment"
                                }
                            ],
                            "categories_l2": [
                                {
                                    "id": "62320b45f4213eb19aa8f4cb",
                                    "_id": "62320b45f4213eb19aa8f4cb",
                                    "parent": "62320b45f4213eb19aa8f455",
                                    "slug": "managing-inventory-and-order"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f4cd",
                                    "_id": "62320b45f4213eb19aa8f4cd",
                                    "parent": "62320b45f4213eb19aa8f455",
                                    "slug": "managing-order"
                                }
                            ]
                        },
                        "organization": {
                            "name": "Fynd",
                            "slug": "Fynd-s8f-32"
                        }
                    },
                    "organization": {
                        "name": "Fynd",
                        "slug": "Fynd-s8f-32"
                    },
                    "text": "Newsletter-Local-Aayush",
                    "value": "61138cf895dcfa08a5408fc4",
                    "label": "Extensions"
                },
                {
                    "_id": "61155f5d95dcfad8294091c4",
                    "description": "",
                    "whitelisted_urls": [],
                    "ext_version": "1.0.0",
                    "extention_type": "public",
                    "is_application_level": true,
                    "is_saleschannel": false,
                    "scope": [
                        "company/profile",
                        "company/product",
                        "company/application/catalogue"
                    ],
                    "name": "Amazon Catalogue",
                    "base_url": "https://amazon-ct.extensions.fyndx0.de",
                    "logo": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png",
                    "callbacks": {
                        "setup": "https://amazon-ct.extensions.fyndx0.de/fp/setup",
                        "auth": "https://amazon-ct.extensions.fyndx0.de/fp/auth",
                        "install": "https://amazon-ct.extensions.fyndx0.de/fp/install",
                        "uninstall": "https://amazon-ct.extensions.fyndx0.de/fp/uninstall"
                    },
                    "developed_by_name": "Piyush Org",
                    "contact_email": "piyushvishwakarma@gofynd.com",
                    "organization_id": "6111ec0095dcfac23e408dd1",
                    "created_at": "2021-08-12T17:50:21.608Z",
                    "modified_at": "2021-09-29T09:51:39.732Z",
                    "__v": 0,
                    "extension_public_data": {
                        "_id": "6149687d9e865808c8556baf",
                        "listing_info": {
                            "keywords": [
                                "amazon"
                            ],
                            "name": "Amazon Catalogue",
                            "tagline": "Export products in Amazon compatible format",
                            "icon": "https://hdn-1.addsale.com/addsale/misc/pictures/free-icon/original/Gqsz5tKJN-logo.png"
                        },
                        "details": {
                            "screenshots": {
                                "desktop": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/KrryVoFfH-desk-sc-1.png"
                                ],
                                "mobile": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/YDwSZsoiV-mob-sc-1.png"
                                ]
                            },
                            "integrations": [],
                            "benefits": [
                                {
                                    "_id": "6149687d9e8658092e556bb0",
                                    "title": "Catalogue Export",
                                    "description": "Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager."
                                }
                            ],
                            "description": "<p>Your catalogue on Fynd Platform is readily usable on Facebook Commerce Manager. This app helps you transform your Fynd Platform catalogue into Facebook's import products CSV file format without much manual intervention. You may use this exported CSV file readily on Facebook Commerce Manager to upload your products to Facebook Marketplace.</p>\n<p><strong>Features</strong></p>\n<ul>\n<li>Catalogue Export\n<ul>\n<li>Export catalogue in a format that is fully compatible to be readily used on Facebook Commerce Manager.</li>\n<li>Filter the catalogue based on 'brands' to be exported. You can select multiple brands at once.</li>\n<li>Get the count of products that will be exported after applying filters.</li>\n</ul>\n</li>\n<li>Scheduled Catalogue Export\n<ul>\n<li>Set a recurring event to export the catalogue. For example- every 4 hours, every day, every Friday, etc.</li>\n<li>Get a constant URL that will have the latest catalogue data. You may use this URL in your system to always fetch fresh catalogue data.</li>\n</ul>\n</li>\n<li>Download History\n<ul>\n<li>A list of all the export events in past will be available. You can download the catalogue from the past export events as well.</li>\n</ul>\n</li>\n</ul>\n<p><strong>Upcoming Features</strong></p>\n<ul>\n<li>Catalogue Import\n<ul>\n<li>Upload your catalogue present on the Facebook marketplace to Fynd Platform using the exported CSV from Facebook Commerce Manager.</li>\n</ul>\n</li>\n</ul>",
                            "demo_url": "",
                            "video_url": []
                        },
                        "contact_info": {
                            "support": {
                                "email": "piyushvishwakarma@gofynd.com",
                                "phone": "7208229699",
                                "website_url": "",
                                "faq_url": "",
                                "privacy_policy_url": ""
                            }
                        },
                        "scope": [
                            "company/profile",
                            "company/product",
                            "company/application/catalogue"
                        ],
                        "plans": [
                            {
                                "name": "Premium",
                                "features": "Unlimited catalogue export   \nSchedule catalogue generation\nView export event history ",
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
                        "extension_id": "61155f5d95dcfad8294091c4",
                        "slug": "amazon-catalogue",
                        "plan_type": "recurring",
                        "plans_url": "",
                        "current_status": "active",
                        "organization_id": "6111ec0095dcfac23e408dd1",
                        "created_at": "2021-09-21T05:07:09.208Z",
                        "modified_at": "2022-03-21T12:27:07.601Z",
                        "coming_soon": {
                            "upvote_count": 0
                        },
                        "category": {
                            "categories_l1": [
                                {
                                    "id": "62320b45f4213eb19aa8f45a",
                                    "_id": "62320b45f4213eb19aa8f45a",
                                    "slug": "customer-service"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f45c",
                                    "_id": "62320b45f4213eb19aa8f45c",
                                    "slug": "channel-management"
                                }
                            ],
                            "categories_l2": [
                                {
                                    "id": "62320b45f4213eb19aa8f4f4",
                                    "_id": "62320b45f4213eb19aa8f4f4",
                                    "parent": "62320b45f4213eb19aa8f45c",
                                    "slug": "shipping-solution"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f4e9",
                                    "_id": "62320b45f4213eb19aa8f4e9",
                                    "parent": "62320b45f4213eb19aa8f45c",
                                    "slug": "channel-management-internalization"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f4d6",
                                    "_id": "62320b45f4213eb19aa8f4d6",
                                    "parent": "62320b45f4213eb19aa8f45a",
                                    "slug": "customer-account"
                                }
                            ]
                        },
                        "organization": {
                            "name": "Piyush Org",
                            "slug": "Piyush-ph2-25"
                        }
                    },
                    "organization": {
                        "name": "Piyush Org",
                        "slug": "Piyush-ph2-25"
                    },
                    "text": "Amazon Catalogue",
                    "value": "61155f5d95dcfad8294091c4",
                    "label": "Extensions"
                },
                {
                    "_id": "6116026a95dcfa05eb4091e3",
                    "description": "xyz",
                    "whitelisted_urls": [],
                    "ext_version": "1.0.0",
                    "extention_type": "public",
                    "is_application_level": false,
                    "is_saleschannel": true,
                    "scope": [
                        "company/profile",
                        "company/saleschannel",
                        "company/product",
                        "company/order",
                        "company/application/customer",
                        "company/application/analytics",
                        "company/application/storage",
                        "company/application/marketing",
                        "company/application/catalogue",
                        "company/application/communication",
                        "company/application/support",
                        "company/application/order",
                        "company/application/settings"
                    ],
                    "name": "APK ",
                    "base_url": "https://4a2f-49-204-113-86.ngrok.io",
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png",
                    "callbacks": {
                        "setup": "https://4a2f-49-204-113-86.ngrok.io/fp/setup",
                        "auth": "https://4a2f-49-204-113-86.ngrok.io/fp/auth",
                        "install": "https://4a2f-49-204-113-86.ngrok.io/fp/install",
                        "uninstall": "https://4a2f-49-204-113-86.ngrok.io/fp/uninstall"
                    },
                    "developed_by_name": "Apk Extension",
                    "contact_email": "venkhatesharunachalam@gofynd.com",
                    "organization_id": "6116013e95dcfa31f64091dc",
                    "created_at": "2021-08-13T05:26:02.843Z",
                    "modified_at": "2022-02-08T06:08:32.675Z",
                    "__v": 0,
                    "extension_public_data": {
                        "_id": "61160b0041dc073a0fc38f61",
                        "listing_info": {
                            "keywords": [],
                            "name": "APK ",
                            "tagline": "Downloadable apk",
                            "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/d24Vi-aC_-logo.png"
                        },
                        "details": {
                            "screenshots": {
                                "desktop": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/ld0bkv7uE-desk-sc-1.jpeg",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/haYr70MB6-desk-sc-2.jpeg",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/1ywtXQaRo-desk-sc-3.jpeg"
                                ],
                                "mobile": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/WsLyDAES9-mob-sc-1.jpeg",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/akmpv_h_V-mob-sc-2.jpeg",
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Rw60j7I5r-mob-sc-3.jpeg"
                                ]
                            },
                            "integrations": [],
                            "benefits": [
                                {
                                    "_id": "61262f2ebec3d618918f7561",
                                    "title": "APk ",
                                    "description": "test"
                                }
                            ],
                            "description": "xyz",
                            "demo_url": "",
                            "video_url": []
                        },
                        "contact_info": {
                            "support": {
                                "email": "venkhatesharunachalam@gofynd.com",
                                "phone": "8369903075",
                                "website_url": "",
                                "faq_url": "",
                                "privacy_policy_url": ""
                            }
                        },
                        "scope": [
                            "company/profile",
                            "company/saleschannel",
                            "company/product",
                            "company/order",
                            "company/application/customer",
                            "company/application/analytics",
                            "company/application/storage",
                            "company/application/marketing",
                            "company/application/catalogue",
                            "company/application/communication",
                            "company/application/support",
                            "company/application/order",
                            "company/application/settings"
                        ],
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
                        "extension_id": "6116026a95dcfa05eb4091e3",
                        "slug": "apk",
                        "plan_type": "free",
                        "plans_url": "",
                        "current_status": "active",
                        "organization_id": "6116013e95dcfa31f64091dc",
                        "created_at": "2021-08-13T06:02:40.313Z",
                        "modified_at": "2022-03-21T12:27:06.810Z",
                        "coming_soon": {
                            "upvote_count": 0
                        },
                        "category": {
                            "categories_l1": [
                                {
                                    "id": "62320b45f4213eb19aa8f447",
                                    "_id": "62320b45f4213eb19aa8f447",
                                    "slug": "conversion"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f44e",
                                    "_id": "62320b45f4213eb19aa8f44e",
                                    "slug": "merchandising"
                                }
                            ],
                            "categories_l2": [
                                {
                                    "id": "62320b45f4213eb19aa8f47a",
                                    "_id": "62320b45f4213eb19aa8f47a",
                                    "parent": "62320b45f4213eb19aa8f447",
                                    "slug": "cart-modification"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f480",
                                    "_id": "62320b45f4213eb19aa8f480",
                                    "parent": "62320b45f4213eb19aa8f44e",
                                    "slug": "announcement-and-banner"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f479",
                                    "_id": "62320b45f4213eb19aa8f479",
                                    "parent": "62320b45f4213eb19aa8f447",
                                    "slug": "customer-feedback"
                                }
                            ]
                        },
                        "organization": {
                            "name": "Strikers",
                            "slug": "ApkExt-ze8-72"
                        }
                    },
                    "organization": {
                        "name": "Strikers",
                        "slug": "ApkExt-ze8-72"
                    },
                    "text": "APK ",
                    "value": "6116026a95dcfa05eb4091e3",
                    "label": "Extensions"
                },
                {
                    "_id": "611624ac95dcfa262740920e",
                    "description": "Android App Builder",
                    "whitelisted_urls": [],
                    "ext_version": "1.0.0",
                    "extention_type": "public",
                    "is_application_level": true,
                    "is_saleschannel": false,
                    "scope": [
                        "company/profile",
                        "company/saleschannel",
                        "company/product",
                        "company/order",
                        "company/application/customer",
                        "company/application/analytics",
                        "company/application/storage",
                        "company/application/marketing",
                        "company/application/catalogue",
                        "company/application/communication",
                        "company/application/support",
                        "company/application/order",
                        "company/application/settings"
                    ],
                    "name": "App Builder",
                    "base_url": "https://android-app-builder.extensions.fyndx0.de",
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9nrhvtx7s-logo.png",
                    "callbacks": {
                        "setup": "https://android-app-builder.extensions.fyndx0.de/fp/setup",
                        "auth": "https://android-app-builder.extensions.fyndx0.de/fp/auth",
                        "install": "https://android-app-builder.extensions.fyndx0.de/fp/install",
                        "uninstall": "https://android-app-builder.extensions.fyndx0.de/fp/uninstall"
                    },
                    "developed_by_name": "Apk Extension",
                    "contact_email": "venkhatesharunachalam@gofynd.com",
                    "organization_id": "6116013e95dcfa31f64091dc",
                    "created_at": "2021-08-13T07:52:12.323Z",
                    "modified_at": "2022-04-18T07:23:43.379Z",
                    "__v": 0,
                    "extension_public_data": {
                        "_id": "61e52b2d2573dc50d8eb3e5b",
                        "listing_info": {
                            "keywords": [
                                "app",
                                "android"
                            ],
                            "name": "App Builder",
                            "tagline": "App for your e-commerce website",
                            "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9nrhvtx7s-logo.png"
                        },
                        "details": {
                            "screenshots": {
                                "desktop": [
                                    "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/7u47o-l7y-desk-sc-1.png"
                                ],
                                "mobile": []
                            },
                            "integrations": [],
                            "benefits": [
                                {
                                    "_id": "61e52b2d2573dc0241eb3e5c",
                                    "title": "Create App for your Fynd Platform website",
                                    "description": "Create App for your Fynd Platform website"
                                }
                            ],
                            "video_url": [],
                            "description": "<p>App Builder for your Fynd Platform website</p>",
                            "demo_url": ""
                        },
                        "contact_info": {
                            "support": {
                                "email": "venkhatesharunachalam@gofynd.com",
                                "phone": "8369903075",
                                "website_url": "",
                                "faq_url": "",
                                "privacy_policy_url": ""
                            }
                        },
                        "coming_soon": {
                            "upvote_count": 0
                        },
                        "scope": [
                            "company/profile",
                            "company/saleschannel",
                            "company/product",
                            "company/order",
                            "company/application/customer",
                            "company/application/analytics",
                            "company/application/storage",
                            "company/application/marketing",
                            "company/application/catalogue",
                            "company/application/communication",
                            "company/application/support",
                            "company/application/order",
                            "company/application/settings"
                        ],
                        "plans": [
                            {
                                "name": "Monthly",
                                "features": "Android App",
                                "type": "recurring",
                                "price": {
                                    "amount": 149,
                                    "currency": "INR"
                                },
                                "trial_days": 0,
                                "additional_charges": "",
                                "recurring": {
                                    "type": "month",
                                    "recurring_time": 30,
                                    "yearly_amount": 1788
                                }
                            },
                            {
                                "name": "Yearly",
                                "features": "Android App",
                                "type": "recurring",
                                "price": {
                                    "amount": 1499,
                                    "currency": "INR"
                                },
                                "trial_days": 0,
                                "additional_charges": "",
                                "recurring": {
                                    "type": "year",
                                    "recurring_time": 365,
                                    "yearly_amount": 0
                                }
                            }
                        ],
                        "extension_id": "611624ac95dcfa262740920e",
                        "slug": "app-builder",
                        "plan_type": "recurring",
                        "plans_url": "",
                        "current_status": "active",
                        "organization_id": "6116013e95dcfa31f64091dc",
                        "created_at": "2022-01-17T08:39:09.184Z",
                        "modified_at": "2022-03-21T12:27:07.911Z",
                        "category": {
                            "categories_l1": [
                                {
                                    "id": "62320b45f4213eb19aa8f44c",
                                    "_id": "62320b45f4213eb19aa8f44c",
                                    "slug": "marketing"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f45b",
                                    "_id": "62320b45f4213eb19aa8f45b",
                                    "slug": "inventory"
                                }
                            ],
                            "categories_l2": [
                                {
                                    "id": "62320b45f4213eb19aa8f4d9",
                                    "_id": "62320b45f4213eb19aa8f4d9",
                                    "parent": "62320b45f4213eb19aa8f45b",
                                    "slug": "managing-inventory"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f4a4",
                                    "_id": "62320b45f4213eb19aa8f4a4",
                                    "parent": "62320b45f4213eb19aa8f44c",
                                    "slug": "email-and-sms-marketing"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f48b",
                                    "_id": "62320b45f4213eb19aa8f48b",
                                    "parent": "62320b45f4213eb19aa8f44c",
                                    "slug": "notification"
                                },
                                {
                                    "id": "62320b45f4213eb19aa8f4a7",
                                    "_id": "62320b45f4213eb19aa8f4a7",
                                    "parent": "62320b45f4213eb19aa8f44c",
                                    "slug": "page-enhancement"
                                }
                            ]
                        },
                        "organization": {
                            "name": "Strikers",
                            "slug": "ApkExt-ze8-72"
                        }
                    },
                    "organization": {
                        "name": "Strikers",
                        "slug": "ApkExt-ze8-72"
                    },
                    "text": "App Builder",
                    "value": "611624ac95dcfa262740920e",
                    "label": "Extensions"
                }
            ],
            "type": "select",
            "multiple": true,
            "search": true,
            "predicate_prop": {
                "item_source": "manual"
            },
            "placeholder": "Search Extensions",
            "value": [],
            "display": false
        }
    ],
    "item_type": "extension",
    "created_at": "2022-05-20T11:16:31.245Z",
    "modified_at": "2022-05-20T11:16:31.245Z",
    "__v": 0
}

module.exports.inputTypeSectionDetails = {
    "type": "select",
    "value": [
        "609400409d0dcbdc2e6b76a5",
        "60be66a2d4cbbf1fd0a67c8c"
    ],
    "details": [
        {
            "_id": "609400409d0dcbdc2e6b76a5",
            "description": "Newsletter Subscription\nNewsletter Subscription",
            "whitelisted_urls": [],
            "ext_version": "1.0",
            "extention_type": "public",
            "scope": [
                "company/saleschannel",
                "company/application/settings"
            ],
            "name": "Newsletter Subscription",
            "base_url": "https://newsletter.extensions.fyndx0.de",
            "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png",
            "callbacks": {
                "setup": "https://newsletter.extensions.fyndx0.de/fp/setup",
                "auth": "https://newsletter.extensions.fyndx0.de/fp/auth",
                "install": "https://newsletter.extensions.fyndx0.de/fp/install",
                "uninstall": "https://newsletter.extensions.fyndx0.de/fp/uninstall"
            },
            "developed_by_name": "Fynd",
            "contact_email": "brijeshgajjar@gofynd.com",
            "organization_id": "610d178e2ab8f356aa98481b",
            "created_at": "2021-05-06T14:42:08.318Z",
            "modified_at": "2022-02-09T06:54:58.104Z",
            "__v": 2,
            "is_application_level": true,
            "is_saleschannel": false,
            "is_coming_soon": false,
            "extension_public_data": {
                "_id": "60bf7f734fe0a3c8e90e5b83",
                "listing_info": {
                    "keywords": [],
                    "name": "Newsletter Subscription",
                    "tagline": "dsvsv",
                    "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
                },
                "details": {
                    "screenshots": {
                        "desktop": [
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nKlrV_01V-desk-sc-1.png",
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/UZ0zmE2sW-desk-sc-2.png",
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/cGtO7qpge-desk-sc-3.png"
                        ],
                        "mobile": [
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/10Twf0N0R-mob-sc-1.png",
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/CRHrGZf5n-mob-sc-2.png",
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nDsWxx2rB-mob-sc-3.png"
                        ]
                    },
                    "integrations": [],
                    "benefits": [
                        {
                            "_id": "623db9405ce44ba088b9c5bc",
                            "title": "dsvsv",
                            "description": "dvssdvdvdv"
                        }
                    ],
                    "description": "<p>Now you can run referral campaigns that lets you and your existing customers refer their friends and family to register on your website.<br /><br />Features<br />&bull; Configure reward for the referrer<br />&bull; Configure reward for the one being referred<br />&bull; Set validity of referral and the reward<br />&bull; Enable/Disable referral campaigns</p>",
                    "demo_url": "",
                    "video_url": []
                },
                "contact_info": {
                    "support": {
                        "email": "aayushvjain@gofynd.com",
                        "phone": "8767087087",
                        "website_url": "",
                        "faq_url": "",
                        "privacy_policy_url": ""
                    }
                },
                "scope": [
                    "company/saleschannel",
                    "company/application/settings"
                ],
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
                "extension_id": "609400409d0dcbdc2e6b76a5",
                "slug": "newsletter-subscription",
                "plan_type": "free",
                "current_status": "active",
                "organization_id": "610d178e2ab8f356aa98481b",
                "created_at": "2021-06-08T14:32:19.574Z",
                "modified_at": "2022-03-25T12:44:48.325Z",
                "plans_url": "",
                "coming_soon": {
                    "upvote_count": 0,
                    "is_coming_soon": false
                },
                "category": {
                    "categories_l1": [
                        {
                            "id": "62320b45f4213eb19aa8f44c",
                            "slug": "marketing",
                            "_id": "62320b45f4213eb19aa8f44c"
                        }
                    ],
                    "categories_l2": [
                        {
                            "id": "62320b45f4213eb19aa8f4aa",
                            "slug": "advertisement",
                            "_id": "62320b45f4213eb19aa8f4aa",
                            "parent": "62320b45f4213eb19aa8f44c"
                        },
                        {
                            "id": "62320b45f4213eb19aa8f4c6",
                            "slug": "marketing-analytics",
                            "_id": "62320b45f4213eb19aa8f4c6",
                            "parent": "62320b45f4213eb19aa8f44c"
                        }
                    ]
                },
                "organization": {
                    "name": "Fynd",
                    "slug": "Fynd-s8f-32"
                }
            },
            "organization": {
                "name": "Fynd",
                "slug": "Fynd-s8f-32"
            },
            "text": "Newsletter Subscription",
            "value": "609400409d0dcbdc2e6b76a5",
            "label": "Extensions"
        },
        {
            "_id": "60be66a2d4cbbf1fd0a67c8c",
            "description": "",
            "whitelisted_urls": [],
            "ext_version": "1.0.0",
            "extention_type": "public",
            "scope": [
                "company/saleschannel"
            ],
            "name": "newsletter-local Brijesh",
            "base_url": "https://newsletter-sub-008.loca.lt",
            "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png",
            "callbacks": {
                "setup": "https://newsletter-sub-008.loca.lt/fp/setup",
                "auth": "https://newsletter-sub-008.loca.lt/fp/auth",
                "install": "https://newsletter-sub-008.loca.lt/fp/install",
                "uninstall": "https://newsletter-sub-008.loca.lt/fp/uninstall"
            },
            "developed_by_name": "Social Icons Company",
            "contact_email": "brijeshgajjar@gofynd.com",
            "organization_id": "610d3a4595dcfae682408c07",
            "created_at": "2021-06-07T18:34:10.795Z",
            "modified_at": "2022-04-29T07:22:36.929Z",
            "__v": 0,
            "is_application_level": true,
            "is_saleschannel": false,
            "is_coming_soon": false,
            "extension_public_data": {
                "_id": "626b92f7f36a77f7b0517b87",
                "category": {
                    "categories_l1": [],
                    "categories_l2": []
                },
                "listing_info": {
                    "keywords": [],
                    "name": "newsletter-local Brijesh",
                    "tagline": "test",
                    "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
                },
                "details": {
                    "screenshots": {
                        "desktop": [
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pX9zldCt8-desk-sc-1.jpeg",
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LvtKWCCZF-desk-sc-3.jpeg",
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pjqTQJKfF-desk-sc-3.jpeg"
                        ],
                        "mobile": [
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/hJZfpuvZo-mob-sc-2.jpeg",
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/i2pysVdSu-mob-sc-3.jpeg",
                            "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/u7sf_tXdN-mob-sc-3.jpeg"
                        ]
                    },
                    "integrations": [],
                    "benefits": [
                        {
                            "_id": "626b9420f36a773678517bbf",
                            "title": "Test",
                            "description": "test"
                        }
                    ],
                    "video_url": [],
                    "description": "<p>Test</p>",
                    "demo_url": ""
                },
                "contact_info": {
                    "support": {
                        "email": "brijeshgajjar@gofynd.com",
                        "phone": "8452996729",
                        "website_url": "",
                        "faq_url": "",
                        "privacy_policy_url": ""
                    }
                },
                "coming_soon": {
                    "upvote_count": 0,
                    "is_coming_soon": false
                },
                "scope": [
                    "company/saleschannel"
                ],
                "plans": [
                    {
                        "name": "Free",
                        "features": "test",
                        "type": "free",
                        "price": {
                            "amount": 0,
                            "currency": "INR"
                        },
                        "trial_days": 0,
                        "additional_charges": ""
                    }
                ],
                "extension_id": "60be66a2d4cbbf1fd0a67c8c",
                "slug": "newsletter-local-brijesh",
                "plan_type": "free",
                "plans_url": "",
                "current_status": "active",
                "organization_id": "610d3a4595dcfae682408c07",
                "created_at": "2022-04-29T07:25:43.514Z",
                "modified_at": "2022-04-29T07:30:40.646Z",
                "organization": {
                    "name": "Social Icons Company",
                    "slug": "Social-asx-16"
                }
            },
            "organization": {
                "name": "Social Icons Company",
                "slug": "Social-asx-16"
            },
            "text": "newsletter-local Brijesh",
            "value": "60be66a2d4cbbf1fd0a67c8c",
            "label": "Extensions"
        }
    ]
}

module.exports.itemValues = [
    {
        "_id": "60be66a2d4cbbf1fd0a67c8c",
        "description": "",
        "whitelisted_urls": [],
        "ext_version": "1.0.0",
        "extention_type": "public",
        "scope": [
            "company/saleschannel"
        ],
        "name": "newsletter-local Brijesh",
        "base_url": "https://newsletter-sub-008.loca.lt",
        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png",
        "callbacks": {
            "setup": "https://newsletter-sub-008.loca.lt/fp/setup",
            "auth": "https://newsletter-sub-008.loca.lt/fp/auth",
            "install": "https://newsletter-sub-008.loca.lt/fp/install",
            "uninstall": "https://newsletter-sub-008.loca.lt/fp/uninstall"
        },
        "developed_by_name": "Social Icons Company",
        "contact_email": "brijeshgajjar@gofynd.com",
        "organization_id": "610d3a4595dcfae682408c07",
        "created_at": "2021-06-07T18:34:10.795Z",
        "modified_at": "2022-04-29T07:22:36.929Z",
        "__v": 0,
        "is_application_level": true,
        "is_saleschannel": false,
        "is_coming_soon": false,
        "extension_public_data": {
            "_id": "626b92f7f36a77f7b0517b87",
            "category": {
                "categories_l1": [],
                "categories_l2": []
            },
            "listing_info": {
                "keywords": [],
                "name": "newsletter-local Brijesh",
                "tagline": "test",
                "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/a5mboqp8n-logo.png"
            },
            "details": {
                "screenshots": {
                    "desktop": [
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pX9zldCt8-desk-sc-1.jpeg",
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LvtKWCCZF-desk-sc-3.jpeg",
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/pjqTQJKfF-desk-sc-3.jpeg"
                    ],
                    "mobile": [
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/hJZfpuvZo-mob-sc-2.jpeg",
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/i2pysVdSu-mob-sc-3.jpeg",
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/u7sf_tXdN-mob-sc-3.jpeg"
                    ]
                },
                "integrations": [],
                "benefits": [
                    {
                        "_id": "626b9420f36a773678517bbf",
                        "title": "Test",
                        "description": "test"
                    }
                ],
                "video_url": [],
                "description": "<p>Test</p>",
                "demo_url": ""
            },
            "contact_info": {
                "support": {
                    "email": "brijeshgajjar@gofynd.com",
                    "phone": "8452996729",
                    "website_url": "",
                    "faq_url": "",
                    "privacy_policy_url": ""
                }
            },
            "coming_soon": {
                "upvote_count": 0,
                "is_coming_soon": false
            },
            "scope": [
                "company/saleschannel"
            ],
            "plans": [
                {
                    "name": "Free",
                    "features": "test",
                    "type": "free",
                    "price": {
                        "amount": 0,
                        "currency": "INR"
                    },
                    "trial_days": 0,
                    "additional_charges": ""
                }
            ],
            "extension_id": "60be66a2d4cbbf1fd0a67c8c",
            "slug": "newsletter-local-brijesh",
            "plan_type": "free",
            "plans_url": "",
            "current_status": "active",
            "organization_id": "610d3a4595dcfae682408c07",
            "created_at": "2022-04-29T07:25:43.514Z",
            "modified_at": "2022-04-29T07:30:40.646Z",
            "organization": {
                "name": "Social Icons Company",
                "slug": "Social-asx-16"
            }
        },
        "organization": {
            "name": "Social Icons Company",
            "slug": "Social-asx-16"
        },
        "text": "newsletter-local Brijesh",
        "value": "60be66a2d4cbbf1fd0a67c8c",
        "label": "Extensions"
    },
    {
        "_id": "609400409d0dcbdc2e6b76a5",
        "description": "Newsletter Subscription\nNewsletter Subscription",
        "whitelisted_urls": [],
        "ext_version": "1.0",
        "extention_type": "public",
        "scope": [
            "company/saleschannel",
            "company/application/settings"
        ],
        "name": "Newsletter Subscription",
        "base_url": "https://newsletter.extensions.fyndx0.de",
        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png",
        "callbacks": {
            "setup": "https://newsletter.extensions.fyndx0.de/fp/setup",
            "auth": "https://newsletter.extensions.fyndx0.de/fp/auth",
            "install": "https://newsletter.extensions.fyndx0.de/fp/install",
            "uninstall": "https://newsletter.extensions.fyndx0.de/fp/uninstall"
        },
        "developed_by_name": "Fynd",
        "contact_email": "brijeshgajjar@gofynd.com",
        "organization_id": "610d178e2ab8f356aa98481b",
        "created_at": "2021-05-06T14:42:08.318Z",
        "modified_at": "2022-02-09T06:54:58.104Z",
        "__v": 2,
        "is_application_level": true,
        "is_saleschannel": false,
        "is_coming_soon": false,
        "extension_public_data": {
            "_id": "60bf7f734fe0a3c8e90e5b83",
            "listing_info": {
                "keywords": [],
                "name": "Newsletter Subscription",
                "tagline": "dsvsv",
                "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/F9IzVxMC2-logo.png"
            },
            "details": {
                "screenshots": {
                    "desktop": [
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nKlrV_01V-desk-sc-1.png",
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/UZ0zmE2sW-desk-sc-2.png",
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/cGtO7qpge-desk-sc-3.png"
                    ],
                    "mobile": [
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/10Twf0N0R-mob-sc-1.png",
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/CRHrGZf5n-mob-sc-2.png",
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/nDsWxx2rB-mob-sc-3.png"
                    ]
                },
                "integrations": [],
                "benefits": [
                    {
                        "_id": "623db9405ce44ba088b9c5bc",
                        "title": "dsvsv",
                        "description": "dvssdvdvdv"
                    }
                ],
                "description": "<p>Now you can run referral campaigns that lets you and your existing customers refer their friends and family to register on your website.<br /><br />Features<br />&bull; Configure reward for the referrer<br />&bull; Configure reward for the one being referred<br />&bull; Set validity of referral and the reward<br />&bull; Enable/Disable referral campaigns</p>",
                "demo_url": "",
                "video_url": []
            },
            "contact_info": {
                "support": {
                    "email": "aayushvjain@gofynd.com",
                    "phone": "8767087087",
                    "website_url": "",
                    "faq_url": "",
                    "privacy_policy_url": ""
                }
            },
            "scope": [
                "company/saleschannel",
                "company/application/settings"
            ],
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
            "extension_id": "609400409d0dcbdc2e6b76a5",
            "slug": "newsletter-subscription",
            "plan_type": "free",
            "current_status": "active",
            "organization_id": "610d178e2ab8f356aa98481b",
            "created_at": "2021-06-08T14:32:19.574Z",
            "modified_at": "2022-03-25T12:44:48.325Z",
            "plans_url": "",
            "coming_soon": {
                "upvote_count": 0,
                "is_coming_soon": false
            },
            "category": {
                "categories_l1": [
                    {
                        "id": "62320b45f4213eb19aa8f44c",
                        "slug": "marketing",
                        "_id": "62320b45f4213eb19aa8f44c"
                    }
                ],
                "categories_l2": [
                    {
                        "id": "62320b45f4213eb19aa8f4aa",
                        "slug": "advertisement",
                        "_id": "62320b45f4213eb19aa8f4aa",
                        "parent": "62320b45f4213eb19aa8f44c"
                    },
                    {
                        "id": "62320b45f4213eb19aa8f4c6",
                        "slug": "marketing-analytics",
                        "_id": "62320b45f4213eb19aa8f4c6",
                        "parent": "62320b45f4213eb19aa8f44c"
                    }
                ]
            },
            "organization": {
                "name": "Fynd",
                "slug": "Fynd-s8f-32"
            }
        },
        "organization": {
            "name": "Fynd",
            "slug": "Fynd-s8f-32"
        },
        "text": "Newsletter Subscription",
        "value": "609400409d0dcbdc2e6b76a5",
        "label": "Extensions"
    },
    {
        "_id": "610d2ad295dcfa14eb408bad",
        "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
        "whitelisted_urls": [],
        "ext_version": "1.0.0",
        "extention_type": "public",
        "is_application_level": true,
        "is_saleschannel": false,
        "scope": [
            "company/saleschannel",
            "company/application/marketing"
        ],
        "name": "Bulk Coupons Generator",
        "base_url": "https://bulkcoupon.extensions.fyndx0.de",
        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png",
        "callbacks": {
            "setup": "https://bulkcoupon.extensions.fyndx0.de/fp/setup",
            "auth": "https://bulkcoupon.extensions.fyndx0.de/fp/auth",
            "install": "https://bulkcoupon.extensions.fyndx0.de/fp/install",
            "uninstall": "https://bulkcoupon.extensions.fyndx0.de/fp/uninstall",
            "auto_install": "https://bulkcoupon.extensions.fyndx0.de/fp/auto_install"
        },
        "developed_by_name": "Rushabh Shah",
        "contact_email": "rushabhmshah@gofynd.com",
        "organization_id": "610d29f395dcfaba6b408ba6",
        "created_at": "2021-08-06T12:28:02.036Z",
        "modified_at": "2022-02-28T15:56:31.338Z",
        "__v": 0,
        "is_coming_soon": false,
        "extension_public_data": {
            "_id": "621cf0c006962803b4cd780d",
            "category": {
                "categories_l1": [
                    {
                        "id": "62320b45f4213eb19aa8f44e",
                        "_id": "62320b45f4213eb19aa8f44e",
                        "slug": "merchandising"
                    },
                    {
                        "id": "62320b45f4213eb19aa8f458",
                        "_id": "62320b45f4213eb19aa8f458",
                        "slug": "source-and-selling-product"
                    }
                ],
                "categories_l2": [
                    {
                        "id": "62320b45f4213eb19aa8f4e5",
                        "_id": "62320b45f4213eb19aa8f4e5",
                        "parent": "62320b45f4213eb19aa8f458",
                        "slug": "marketplace"
                    },
                    {
                        "id": "62320b45f4213eb19aa8f480",
                        "_id": "62320b45f4213eb19aa8f480",
                        "parent": "62320b45f4213eb19aa8f44e",
                        "slug": "announcement-and-banner"
                    },
                    {
                        "id": "62320b45f4213eb19aa8f486",
                        "_id": "62320b45f4213eb19aa8f486",
                        "parent": "62320b45f4213eb19aa8f44e",
                        "slug": "additional-purchase"
                    }
                ]
            },
            "listing_info": {
                "keywords": [],
                "name": "Bulk Coupons Generator",
                "tagline": "Test",
                "icon": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/I9ujthIoU-logo.png"
            },
            "details": {
                "screenshots": {
                    "desktop": [
                        "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/fQ_yjdowj-desk-sc-1.jpeg"
                    ],
                    "mobile": []
                },
                "integrations": [],
                "benefits": [
                    {
                        "_id": "621cf0c00696281d1dcd780e",
                        "title": "Test",
                        "description": "test"
                    }
                ],
                "video_url": [],
                "description": "Generate thousands of unique coupon codes instantly for your sales campaigns!",
                "demo_url": ""
            },
            "contact_info": {
                "support": {
                    "email": "rushabhmshah@gofynd.com",
                    "phone": "9930630722",
                    "website_url": "",
                    "faq_url": "",
                    "privacy_policy_url": ""
                }
            },
            "coming_soon": {
                "upvote_count": 0,
                "is_coming_soon": false
            },
            "scope": [
                "company/saleschannel",
                "company/application/marketing"
            ],
            "plans": [
                {
                    "name": "Standard Plan",
                    "features": "Standard feature\nStandard feature\nStandard feature",
                    "type": "recurring",
                    "price": {
                        "amount": 99,
                        "currency": "INR"
                    },
                    "trial_days": 0,
                    "additional_charges": "",
                    "recurring": {
                        "type": "month",
                        "recurring_time": 30,
                        "yearly_amount": 1188
                    }
                },
                {
                    "name": "Premium Plan",
                    "features": "Premium Feature\nPremium Feature\nPremium Feature",
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
            "extension_id": "610d2ad295dcfa14eb408bad",
            "slug": "bulk-coupons-generator",
            "plan_type": "recurring",
            "plans_url": "",
            "current_status": "active",
            "organization_id": "610d29f395dcfaba6b408ba6",
            "created_at": "2022-02-28T15:56:48.806Z",
            "modified_at": "2022-03-21T12:27:08.714Z",
            "organization": {
                "name": "Rushabh Shah",
                "slug": "Rushab-omn-2"
            }
        },
        "organization": {
            "name": "Rushabh Shah",
            "slug": "Rushab-omn-2"
        },
        "text": "Bulk Coupons Generator",
        "value": "610d2ad295dcfa14eb408bad",
        "label": "Extensions"
    }
]

module.exports.collectionSection = {
    "predicate": {
        "screen": {
            "mobile": true,
            "table": true,
            "desktop": true
        }
    },
    "tags": [],
    "visible": true,
    "page_type": "all",
    "type": "collection_grid",
    "data": {
        "heading": "Collections",
        "title": "Latest",
        "subtitle": "Subtitle",
        "button_label": "View",
        "button_page_link": "Collections",
        "item_source": "manual",
        "image": "",
        "image_position": "",
        "collection": [
            "623847d0ec3c4b10b1f5fed6",
            "627ba8371171f7705212333b",
            "62384f66ec3c4b4e6ff5fee6",
            "625fe7c726e867d85730af1a"
        ],
        "collection_details": [
            {
                "banner": {
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/o9UhZ5Em6-logo.jpeg",
                    "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/dU3kXnGwR-logo.png",
                    "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png"
                },
                "seo": {
                    "title": "Title",
                    "description": "Breif description about the"
                },
                "tags": [
                    "asdsa",
                    "asdas",
                    "my"
                ],
                "published": false,
                "_id": "623847d0ec3c4b10b1f5fed6",
                "collection_category": "extension",
                "collection_type": "handpicked",
                "name": "New Extension collection",
                "description": "fdsdssdasdsdsd d d sddas dsd sd d",
                "slug": "new-extension-collection",
                "__v": 0,
                "created_at": "2022-06-02T15:24:26.203Z",
                "modified_at": "2022-06-02T15:24:26.203Z"
            },
            {
                "banner": {
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/IcaJe8Jty-logo.png",
                    "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/Pkucz2J8n-logo.png",
                    "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/JdOFjaPIr-logo.png"
                },
                "seo": {
                    "title": "Title",
                    "description": "Breif description about the collection"
                },
                "tags": [],
                "published": true,
                "_id": "627ba8371171f7705212333b",
                "collection_category": "extension",
                "collection_type": "handpicked",
                "name": "sands odsoic ",
                "description": "dd ",
                "slug": "sands-odsoic",
                "__v": 0
            },
            {
                "banner": {
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/q7Ex7-oAT-logo.png",
                    "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/HCrbg2uGD-logo.png",
                    "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/0cyP63leb-logo.png"
                },
                "seo": {
                    "title": "Title",
                    "description": "Breif description about the"
                },
                "tags": [
                    "adsa",
                    "dsad",
                    "asdas"
                ],
                "published": true,
                "_id": "62384f66ec3c4b4e6ff5fee6",
                "collection_category": "extension",
                "collection_type": "handpicked",
                "name": "NEW ONE",
                "description": "sadasdasd",
                "slug": "new-one",
                "__v": 0,
                "created_at": "2022-06-01T08:19:13.070Z",
                "modified_at": "2022-06-01T08:19:13.070Z"
            },
            {
                "banner": {
                    "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/lOyFu1NjT-logo.png",
                    "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LLbfmTiyf-logo.png",
                    "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/1hvSt917P-logo.png"
                },
                "seo": {
                    "title": "Title",
                    "description": "Breif description about the collection"
                },
                "tags": [
                    "dfg"
                ],
                "published": true,
                "_id": "625fe7c726e867d85730af1a",
                "collection_category": "extension",
                "collection_type": "handpicked",
                "name": "Test3",
                "description": "gdfdfd",
                "slug": "qwer-tyui-tyu",
                "__v": 0,
                "created_at": "2022-06-08T09:49:38.324Z",
                "modified_at": "2022-06-08T09:49:38.324Z"
            }
        ]
    },
    "item_type": "collection",
    "items": [
        {
            "value": "623847d0ec3c4b10b1f5fed6"
        },
        {
            "value": "627ba8371171f7705212333b"
        },
        {
            "value": "62384f66ec3c4b4e6ff5fee6"
        },
        {
            "value": "625fe7c726e867d85730af1a"
        }
    ],
    "props": {
        "heading": {
            "type": "textbox",
            "value": "Collections"
        },
        "title": {
            "type": "textbox",
            "value": "Latest"
        },
        "subtitle": {
            "type": "textbox",
            "value": "Subtitle"
        },
        "button_label": {
            "type": "text",
            "value": "View"
        },
        "button_page_link": {
            "type": "select",
            "value": "Collections"
        },
        "item_source": {
            "type": "radio",
            "value": "manual"
        },
        "image": {
            "type": "image_picker",
            "value": ""
        },
        "image_position": {
            "type": "radio",
            "value": ""
        },
        "collection": {
            "type": "select",
            "value": [
                "623847d0ec3c4b10b1f5fed6",
                "627ba8371171f7705212333b",
                "62384f66ec3c4b4e6ff5fee6",
                "625fe7c726e867d85730af1a"
            ]
        }
    }
}

module.exports.collectionSectionSchema = {
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
            "type": "textbox",
            "display": true
        },
        {
            "id": "title",
            "label": "Title",
            "default": "",
            "type": "textbox",
            "display": true
        },
        {
            "id": "subtitle",
            "label": "Subtitle",
            "default": "",
            "type": "textbox",
            "display": true
        },
        {
            "id": "button_label",
            "label": "Button Label",
            "default": "",
            "type": "text",
            "display": true
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
            ],
            "display": true
        },
        {
            "id": "item_source",
            "label": "List item source",
            "default": "manual",
            "type": "radio",
            "options": [],
            "display": false
        },
        {
            "id": "image",
            "label": "Banner Image",
            "default": "",
            "type": "image_picker",
            "display": true
        },
        {
            "id": "image_position",
            "label": "Banner Position",
            "default": "right",
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
            ],
            "display": false
        },
        {
            "default": [],
            "id": "collection",
            "label": "Collections",
            "options": [
                {
                    "banner": {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/o9UhZ5Em6-logo.jpeg",
                        "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/dU3kXnGwR-logo.png",
                        "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/PR-OVVImt-logo.png"
                    },
                    "seo": {
                        "title": "Title",
                        "description": "Breif description about the"
                    },
                    "tags": [
                        "asdsa",
                        "asdas",
                        "my"
                    ],
                    "published": false,
                    "_id": "623847d0ec3c4b10b1f5fed6",
                    "collection_category": "extension",
                    "collection_type": "handpicked",
                    "name": "New Extension collection",
                    "description": "fdsdssdasdsdsd d d sddas dsd sd d",
                    "slug": "new-extension-collection",
                    "__v": 0,
                    "created_at": "2022-06-02T15:24:26.203Z",
                    "modified_at": "2022-06-02T15:24:26.203Z",
                    "text": "New Extension collection",
                    "value": "623847d0ec3c4b10b1f5fed6"
                },
                {
                    "banner": {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/q7Ex7-oAT-logo.png",
                        "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/HCrbg2uGD-logo.png",
                        "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/0cyP63leb-logo.png"
                    },
                    "seo": {
                        "title": "Title",
                        "description": "Breif description about the"
                    },
                    "tags": [
                        "adsa",
                        "dsad",
                        "asdas"
                    ],
                    "published": true,
                    "_id": "62384f66ec3c4b4e6ff5fee6",
                    "collection_category": "extension",
                    "collection_type": "handpicked",
                    "name": "NEW ONE",
                    "description": "sadasdasd",
                    "slug": "new-one",
                    "__v": 0,
                    "created_at": "2022-06-01T08:19:13.070Z",
                    "modified_at": "2022-06-01T08:19:13.070Z",
                    "text": "NEW ONE",
                    "value": "62384f66ec3c4b4e6ff5fee6"
                },
                {
                    "banner": {
                        "logo": "",
                        "portrait": "",
                        "landscape": ""
                    },
                    "seo": {
                        "title": "Title",
                        "description": "Breif description about the"
                    },
                    "tags": [],
                    "published": true,
                    "_id": "62385ac9ec3c4b28e9f5ff05",
                    "collection_category": "extension",
                    "collection_type": "handpicked",
                    "name": "test",
                    "description": "",
                    "__v": 0,
                    "text": "test",
                    "value": "62385ac9ec3c4b28e9f5ff05"
                },
                {
                    "banner": {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/BEMFKB858-logo.png",
                        "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/KKukThM7Q-logo.png",
                        "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/izikmUFVD-logo.png"
                    },
                    "seo": {
                        "title": "Title",
                        "description": "Breif description about the"
                    },
                    "tags": [
                        "test",
                        "asasas"
                    ],
                    "published": true,
                    "_id": "623b4d518087776e618af270",
                    "collection_category": "extension",
                    "collection_type": "handpicked",
                    "name": "Mac collection ",
                    "description": "test",
                    "slug": "mac-collection",
                    "__v": 0,
                    "created_at": "2022-05-31T11:02:32.745Z",
                    "modified_at": "2022-06-01T08:56:59.071Z",
                    "text": "Mac collection ",
                    "value": "623b4d518087776e618af270"
                },
                {
                    "banner": {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/lOyFu1NjT-logo.png",
                        "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LLbfmTiyf-logo.png",
                        "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/1hvSt917P-logo.png"
                    },
                    "seo": {
                        "title": "Title",
                        "description": "Breif description about the collection"
                    },
                    "tags": [
                        "dfg"
                    ],
                    "published": true,
                    "_id": "625fe7c726e867d85730af1a",
                    "collection_category": "extension",
                    "collection_type": "handpicked",
                    "name": "Test3",
                    "description": "gdfdfd",
                    "slug": "qwer-tyui-tyu",
                    "__v": 0,
                    "created_at": "2022-06-08T09:49:38.324Z",
                    "modified_at": "2022-06-08T09:49:38.324Z",
                    "text": "Test3",
                    "value": "625fe7c726e867d85730af1a"
                },
                {
                    "banner": {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/zSDeCO5GF-logo.png",
                        "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/wMNtZox9F-logo.png",
                        "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/LctdogpHF-logo.png"
                    },
                    "seo": {
                        "title": "Title",
                        "description": "Breif description about the collection"
                    },
                    "tags": [
                        "as",
                        "sad",
                        "dsda"
                    ],
                    "published": true,
                    "_id": "625fe8ac26e86741c830af2b",
                    "collection_category": "extension",
                    "collection_type": "handpicked",
                    "name": "main-extension",
                    "description": "sadsad",
                    "slug": "main-extension",
                    "__v": 0,
                    "text": "main-extension",
                    "value": "625fe8ac26e86741c830af2b"
                },
                {
                    "banner": {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/tLyIWubai-logo.png",
                        "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/lKuwhvJuo-logo.png",
                        "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/kYs9a-q62-logo.png"
                    },
                    "seo": {
                        "title": "Title",
                        "description": "Breif description about the collection"
                    },
                    "tags": [
                        "rrr"
                    ],
                    "published": true,
                    "_id": "625fec4226e8671c7730af2e",
                    "collection_category": "extension",
                    "collection_type": "handpicked",
                    "name": "test1",
                    "description": "tyyutxd",
                    "slug": "test1",
                    "__v": 0,
                    "text": "test1",
                    "value": "625fec4226e8671c7730af2e"
                },
                {
                    "banner": {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/844q5hUne-logo.png",
                        "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/mMEClTHZf-logo.png",
                        "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/szDg6dJvf-logo.png"
                    },
                    "seo": {
                        "title": "Title",
                        "description": "Breif description about the collection"
                    },
                    "tags": [
                        "rrr"
                    ],
                    "published": true,
                    "_id": "625fed4326e867575a30af35",
                    "collection_category": "extension",
                    "collection_type": "handpicked",
                    "name": "test12",
                    "description": "rshhthsh",
                    "slug": "test12",
                    "__v": 0,
                    "text": "test12",
                    "value": "625fed4326e867575a30af35"
                },
                {
                    "banner": {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/-WVnF2Q7S-logo.png",
                        "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/l7dpJG8bD-logo.png",
                        "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/lIZMHK3dV-logo.png"
                    },
                    "seo": {
                        "title": "Title",
                        "description": "Breif description about the collection"
                    },
                    "tags": [],
                    "published": true,
                    "_id": "625feeda26e8670cf630af3c",
                    "collection_category": "extension",
                    "collection_type": "handpicked",
                    "name": "Get 20 % off ",
                    "description": "efsddfcs",
                    "slug": "get-20",
                    "__v": 0,
                    "text": "Get 20 % off ",
                    "value": "625feeda26e8670cf630af3c"
                },
                {
                    "banner": {
                        "logo": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/tz2RG2AqL-logo.png",
                        "portrait": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/ZTo5cEkgo-logo.png",
                        "landscape": "https://hdn-1.addsale.com/x0/misc/pictures/free-icon/original/9aT_xnkVS-logo.png"
                    },
                    "seo": {
                        "title": "Title",
                        "description": "Breif description about the collection"
                    },
                    "tags": [],
                    "published": true,
                    "_id": "625fefa126e867aee330af40",
                    "collection_category": "extension",
                    "collection_type": "handpicked",
                    "name": "get20 % off on summer ",
                    "description": "h",
                    "slug": "get20--off-on-summer",
                    "__v": 0,
                    "text": "get20 % off on summer ",
                    "value": "625fefa126e867aee330af40"
                }
            ],
            "type": "select",
            "multiple": true,
            "search": true,
            "placeholder": "Search Collections",
            "predicate_prop": {
                "item_source": "manual"
            },
            "display": true
        }
    ],
    "item_type": "collection",
    "created_at": "2022-05-20T11:16:31.245Z",
    "modified_at": "2022-05-20T11:16:31.245Z",
    "__v": 0
}
