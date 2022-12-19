import { FILTER_VIEW } from "./constants";

const valueFormatterDummy = {
  prefixSymbol: "₹",
  suffixSymbol: "K",
  divisor: 1000
};
export const ChartData = {
  dlayout: {
    panels: [
      {
        cards: [
          {
            id: 0,
            hidden: false,
            pinned: true,
            position: {
              x: 0,
              y: 0,
              w: 12,
              h: 4
            },
            heading: "",
            navLink: "reports",
            filters: {
              filterView: "CARDS",
              data: [
                {
                  cardIndex: 0,
                  toolTip: "Sales descripyion go here",
                  value: 143000,
                  changeInValue: 1,
                  isVisible: true,
                  name: "Sales",
                  isSelected: true,
                  isClosable: false,
                  valueFormatter: {
                    prefixSymbol: "₹",
                    suffixSymbol: "K",
                    divisor: 1000,
                    value: 10000
                  }
                },
                {
                  cardIndex: 1,
                  toolTip: "Sales descripyion go here",
                  value: 32,
                  changeInValue: 5,
                  isVisible: true,
                  name: "Sessions",
                  isSelected: false,
                  isClosable: false
                },
                {
                  cardIndex: 2,
                  toolTip: "Sales descripyion go here",
                  value: 324,
                  changeInValue: 9,
                  isVisible: true,
                  name: "Orders",
                  isSelected: false,
                  isClosable: false
                },
                {
                  cardIndex: 3,
                  toolTip: "Sales descripyion go here",
                  value: 32,
                  changeInValue: 13,
                  isVisible: true,
                  name: "Customer return",
                  isSelected: false,
                  isClosable: false,
                  valueFormatter: { prefixSymbol: "", suffixSymbol: "%", divisor: 1 }
                },
                {
                  cardIndex: 4,
                  toolTip: "Sales descripyion go here",
                  value: 1400,
                  changeInValue: 17,
                  isVisible: true,
                  name: "Average order value",
                  isSelected: false,
                  isClosable: false,
                  valueFormatter: {
                    prefixSymbol: "₹",
                    suffixSymbol: "K",
                    divisor: 1000,
                    value: 10000
                  }
                }
              ]
            },
            toolTipInfo: "Tooltip info",
            isClosable: false,
            graphInfo: {
              graphType: "line",
              yAxes: [
                {
                  label: "In Rupees",
                  backgroundColor: "#E7EEFF",
                  borderColor: "#2E31BE",
                  fill: true,
                  data: [0, 12, 15, 11, 8, 14, 25],
                  valueFormatter: {
                    prefixSymbol: "₹",
                    suffixSymbol: "K",
                    divisor: 1000
                  }
                }
              ],
              xAxes: [
                "Apr 12",
                "Apr 15",
                "Apr 18",
                "Apr 21",
                "Apr 24",
                "Apr 30"
              ]
            },
            extraProps: {
              height: 300,
              hideGraphOptions: { display: true, navLink: "" }
            }
          }
        ],
        maxColumnCount: 12,
        maxRowCount: 1,
        bubbleUp: true,
        margin: 5,
        boxCount: 4,
        containerClass: "header",
        gridClasses: "header-grid-box",
        dragSelector: "div.card-header",
        fixLayoutOnLoad: true,
        resizeVisible: false
      },
      {
        cards: [
          {
            id: 1,
            hidden: false,
            pinned: false,
            position: {
              x: 0,
              y: 0,
              w: 5.5,
              h: 3
            },
            heading: "Session by location",
            resizable: false,
            navLink: "reports",
            filters: {},
            toolTipInfo: "purchase funnel graph is useful way of representing data, this text can be customized",
            isClosable: false,
            graphInfo: {
              graphType: "progress-bar",
              yAxes: [
                {
                  label: "In Rupees",
                  backgroundColor: "#f87979",
                  data: [67, 15, 12, 65, 11, 88]
                }
              ],
              xAxes: [
                "Mumbai",
                "Delhi",
                "Bangalore",
                "Madhya Pradesh",
                "Assam"
              ]
            },
            extraProps: {
              height: 200
            }
          },
          {
            id: 2,
            hidden: false,
            pinned: false,
            position: {
              x: 5.5,
              y: 0,
              w: 5.5,
              h: 3
            },
            heading: "Purchase funnel",
            resizable: false,
            navLink: "reports",
            filters: {},
            toolTipInfo: "Tooltip info",
            isClosable: false,
            graphInfo: {
              graphType: "bar",
              yAxes: [
                {
                  label: "Purchase funnel",
                  backgroundColor: "#E7EEFF",
                  borderColor: "#2E31BE",
                  fill: true,
                  data: [161, 116, 76, 2.2]
                }
              ],
              xAxes: [
                "Sessions",
                "Product viewed",
                "Added to cart",
                "Purchased"
              ]
            },
            extraProps: {
              height: 200,
              options: {}
            }
          },
          {
            id: 3,
            hidden: false,
            pinned: false,
            position: {
              x: 0,
              y: 3,
              w: 5.5,
              h: 3
            },
            heading: "Session by device type",
            resizable: false,
            isClosable: false,
            navLink: "reports",
            filters: {},
            toolTipInfo: "Tooltip info",
            graphInfo: {
              graphType: "progress-bar",
              yAxes: [
                {
                  label: "Purchase funnel",
                  backgroundColor: "#E7EEFF",
                  borderColor: "#2E31BE",
                  fill: true,
                  data: [40, 12, 15]
                }
              ],
              xAxes: [
                "Web",
                "Mobile",
                "Tablet"
              ]
            },
            extraProps: {
              height: 200
            }
          },
          {
            id: 4,
            hidden: false,
            pinned: false,
            position: {
              x: 5.5,
              y: 3,
              w: 5.5,
              h: 3
            },
            heading: "Top products sold by units",
            resizable: false,
            navLink: "reports",
            filters: {},
            toolTipInfo: "Tooltip info",
            isClosable: false,
            graphInfo: {
              graphType: "table",
              showPagination: true,
              columns: [
                {
                  headerName: "Product Name",
                  field: "Product",
                  type: "image",
                },
                {
                  headerName: "SKU",
                  field: "SKU",
                  type: "string",
                },
                {
                  headerName: "Qty",
                  field: "Qty",
                  type: "growth",
                }
              ],
              rows: [
                {
                  Product: {
                    // image: "https://hdn-1.addsale.com/addsale/products/pictures/item/free/50x0/play-clan/BNYSG-2832/0/1VL6zaD-FC-az-ii-shoes.jpg",
                    text: "Total"
                  },
                  SKU: "324",
                  Qty: {
                    growth_value: 42300, growth_percentage: 2, valueFormatter: {
                      prefixSymbol: "$",
                      suffixSymbol: "K",
                      divisor: 1000
                    }
                  },
                  extraConfig: {
                    styles: {
                      "font-weight": "bold",
                      color: "#41434C",
                      "font-size": "12px",
                      "background-color": "#F5F8FF"
                    }
                  }
                },
                {
                  Product: {
                    image: "https://hdn-1.addsale.com/addsale/products/pictures/item/free/50x0/play-clan/BNYSG-2832/0/1VL6zaD-FC-az-ii-shoes.jpg",
                    text: "Aeropostale Red full - sleeves backstreet tshirt "
                  },
                  SKU: "FYNDSALDMA22121",
                  Qty: {
                    growth_value: 2200, growth_percentage: 2, valueFormatter: {
                      suffixSymbol: "K",
                      divisor: 1000,
                      value: 10000
                    }
                  }
                },
                {
                  Product: {
                    image: "https://hdn-1.addsale.com/addsale/products/pictures/item/free/50x0/Hz5wAkG0gZ-The-Allbirds-shoe-brand-co-founded-in-2016-by-our-alumnus-Tim-Brown-Class-of-2005_Q320.jpg",
                    text: "American Eagle Blue Capri Jeans "
                  },
                  SKU: "FYNDSALDMA22121",
                  Qty: {
                    growth_value: 1200, growth_percentage: 2, valueFormatter: {
                      suffixSymbol: "K",
                      divisor: 1000,
                      value: 10000
                    }
                  }
                },
                {
                  Product: {
                    image: "https://hdn-1.addsale.com/addsale/products/pictures/item/free/50x0/play-clan/BNYSG-2832/0/1VL6zaD-FC-az-ii-shoes.jpg",
                    text: "Alan Solley green full - sleeves chartiso"
                  },
                  SKU: "FYNDSALDMA22121",
                  Qty: {
                    growth_value: 200, growth_percentage: -2, valueFormatter: {
                      suffixSymbol: "K",
                      divisor: 1000,
                      value: 10000
                    }
                  }
                }
              ]
            },
            extraProps: {
              height: 200
            }
          },
          {
            id: 5,
            hidden: false,
            pinned: false,
            position: {
              x: 11,
              y: 0,
              w: 5.5,
              h: 3
            },
            heading: "Product not available",
            growth: { changeInGrowth: 2, value: 30 },
            resizable: false,
            navLink: "reports",
            filters: {},
            toolTipInfo: "purchase funnel graph is useful way of representing data, this text can be customized",
            isClosable: false,
            graphInfo: {
              graphType: "line",
              yAxes: [
                {
                  label: "In Rupees",
                  backgroundColor: "#E7EEFF",
                  borderColor: "#2E31BE",
                  fill: true,
                  data: [0, 12, 15, 11, 8, 14, 25],
                  valueFormatter: {
                    suffixSymbol: "%"
                  }
                }
              ],
              xAxes: [
                "Apr 12",
                "Apr 15",
                "Apr 18",
                "Apr 21",
                "Apr 24",
                "Apr 30"
              ]
            },
            extraProps: {
              height: 200
            }
          },
          {
            id: 6,
            hidden: false,
            pinned: false,
            position: {
              x: 11,
              y: 5.5,
              w: 5.5,
              h: 3
            },
            heading: "Stale inventory",
            growth: { changeInGrowth: -3, value: 56 },
            resizable: false,
            navLink: "reports",
            filters: {},
            toolTipInfo: "purchase funnel graph is useful way of representing data, this text can be customized",
            isClosable: false,
            graphInfo: {
              graphType: "line",
              yAxes: [
                {
                  label: "Purchase funnel",
                  backgroundColor: "#E7EEFF",
                  borderColor: "#2E31BE",
                  fill: true,
                  data: [0, 12, 15, 11, 8, 14, 25],
                  valueFormatter: {
                    suffixSymbol: "%"
                  }
                }
              ],
              xAxes: [
                "Apr 12",
                "Apr 15",
                "Apr 18",
                "Apr 21",
                "Apr 24",
                "Apr 30"
              ]
            },
            extraProps: {
              height: 200
            }
          },
          {
            id: 7,
            hidden: false,
            pinned: false,
            position: {
              x: 16.5,
              y: 0,
              w: 5.5,
              h: 3
            },
            heading: "Session by traffic source",
            resizable: false,
            isClosable: false,
            navLink: "reports",
            filters: {},
            toolTipInfo: "Tooltip info",
            graphInfo: {
              graphType: "progress-bar",
              yAxes: [
                {
                  label: "Purchase funnel",
                  backgroundColor: "#E7EEFF",
                  borderColor: "#2E31BE",
                  fill: true,
                  data: [67, 15, 12]
                }
              ],
              xAxes: [
                "Google Search",
                "External",
                "Others"
              ]
            },
            extraProps: {
              height: 200
            }
          }
        ],
        maxColumnCount: 11,
        maxRowCount: Infinity,
        bubbleUp: false,
        margin: 5,
        boxCount: 4,
        containerClass: "",
        gridClasses: "sub-panel-grid-box",
        dragSelector: "div",
        fixLayoutOnLoad: false,
        resizeVisible: false
      }
    ]
  }
};

export const reportFilters = {
  filterView: FILTER_VIEW.DROP_DOWN,
  data: {
    graphFilters: [
      {
        text: "Sales",
        name: "sales"
      },
      {
        text: "Sessions",
        name: "sessions"
      },
      {
        text: "Orders",
        name: "orders"
      },
      {
        text: "Customer return",
        name: "customer_return"

      },
      {
        text: "Average order value",
        name: "average_order"
      }
    ],
    timeFilters: [
      {
        name: "daily",
        text: "Daily"
      }, {
        name: "weekly",
        text: "Weekly"
      }, {
        name: "monthly",
        text: "Monthly"
      }, {
        name: "yearly",
        text: "Yearly"
      }
    ]
  }
};

export const reportChartData = {
  layoutHeader: {
    id: 0,
    hidden: false,
    pinned: true,
    position: {
      x: 0,
      y: 0,
      w: 12,
      h: 4
    },
    heading: "",
    navLink: "reports",
    filters: {
      filterView: "DROP_DOWN",
      data: {
        graphFilters: [
          {
            text: "Sales",
            name: "sales"
          },
          {
            text: "Sessions",
            name: "sessions"
          },
          {
            text: "Orders",
            name: "orders"
          },
          {
            text: "Customer return",
            name: "customer_return"

          },
          {
            text: "Average order value",
            name: "average_order"
          }
        ],
        timeFilters: [
          {
            name: "daily",
            text: "Daily"
          }, {
            name: "weekly",
            text: "Weekly"
          }, {
            name: "monthly",
            text: "Monthly"
          }, {
            name: "yearly",
            text: "Yearly"
          }
        ]
      }
    },
    toolTipInfo: "Tooltip info",
    isClosable: false,
    graphInfo: {
      graphType: "line",
      // dataSource: "https://623940dd043817a543dfe6ae.mockapi.io/analytics/api/v1/data?id=sales_report",
      yAxes: [
        {
          label: "In Rupees",
          backgroundColor: "#E7EEFF",
          borderColor: "#2E31BE",
          fill: true,
          data: [0, 12, 15, 11, 8, 14, 25],
          valueFormatter: {
            prefixSymbol: "₹",
            suffixSymbol: "K",
            divisor: 1000
          }
        }
      ],
      xAxes: [
        "Apr 12",
        "Apr 15",
        "Apr 18",
        "Apr 21",
        "Apr 24",
        "Apr 30"
      ]
    },
    extraProps: {
      height: 200
    }
  },
  table: {
    id: 1,
    hidden: false,
    pinned: false,
    position: {
      x: 5.5,
      y: 3,
      w: 5.5,
      h: 3
    },
    heading: "Session by traffic source",
    resizable: false,
    navLink: "reports",
    filters: {},
    toolTipInfo: "Tooltip info",
    isClosable: false,
    graphInfo: {
      graphType: "table",
      showPagination: true,
      dataSource: "https://623940dd043817a543dfe6ae.mockapi.io/analytics/api/v1/data?id=top_products_sales",
      columns: [
        {
          headerName: "Product Name",
          field: "Product",
          type: "image",
          cellStyle: {
            "font-family": "Inter",
            "font-style": "normal",
            "font-weight": "normal",
            "font-size": "11px",
            "line-height": "17px",
            "color": "#41434C"
          }
        },
        {
          headerName: "SKU",
          field: "SKU",
          type: "string",
          cellStyle: {
            "font-family": "Inter",
            "font-style": "normal",
            "font-weight": "normal",
            "font-size": "11px",
            "line-height": "17px",
            "color": "#41434C"
          }
        },
        {
          headerName: "Qty",
          field: "Qty",
          type: "growth",
          cellStyle: {
            "font-family": "Inter",
            "font-style": "normal",
            "font-weight": "500",
            "font-size": "11px",
            "line-height": "17px",
            "color": "#41434C"
          }
        }
      ],
      rows: [
        {
          Product: {
            // image: "https://hdn-1.addsale.com/addsale/products/pictures/item/free/50x0/play-clan/BNYSG-2832/0/1VL6zaD-FC-az-ii-shoes.jpg",
            text: "Total",
            extraConfigs: {
              styles: {
                color: "#666666",
                "font-weight": "600"
              }
            }
          },
          SKU: {
            value: "324",
            extraConfigs: {
              styles: {
                "font-weight": "600"
              }
            }
          },
          Qty: {
            growth_value: 42300,
            growth_percentage: 2,
            valueFormatter: {
              prefixSymbol: "$",
              suffixSymbol: "K",
              divisor: 1000
            }
          },
          extraConfigs: {
            styles: {
              "font-size": "12px",
              "background-color": "#F5F8FF",
              "padding-block": "1.5em",
              color: "#41434C"
            }
          }
        },
        {
          Product: {
            image: "https://hdn-1.addsale.com/addsale/products/pictures/item/free/50x0/play-clan/BNYSG-2832/0/1VL6zaD-FC-az-ii-shoes.jpg",
            text: "Aeropostale Red full - sleeves backstreet tshirt "
          },
          SKU: "FYNDSALDMA22121",
          Qty: {
            growth_value: 2200, growth_percentage: 2, valueFormatter: {
              suffixSymbol: "K",
              divisor: 1000,
              value: 10000
            }
          }
        },
        {
          Product: {
            image: "https://hdn-1.addsale.com/addsale/products/pictures/item/free/50x0/Hz5wAkG0gZ-The-Allbirds-shoe-brand-co-founded-in-2016-by-our-alumnus-Tim-Brown-Class-of-2005_Q320.jpg",
            text: "American Eagle Blue Capri Jeans "
          },
          SKU: "FYNDSALDMA22121",
          Qty: {
            growth_value: 1200, growth_percentage: 2, valueFormatter: {
              suffixSymbol: "K",
              divisor: 1000,
              value: 10000
            }
          }
        },
        {
          Product: {
            image: "https://hdn-1.addsale.com/addsale/products/pictures/item/free/50x0/play-clan/BNYSG-2832/0/1VL6zaD-FC-az-ii-shoes.jpg",
            text: "Alan Solley green full - sleeves chartiso"
          },
          SKU: "FYNDSALDMA22121",
          Qty: {
            growth_value: 200, growth_percentage: -2, valueFormatter: {
              suffixSymbol: "K",
              divisor: 1000,
              value: 10000
            }
          }
        }
      ]
    },
    extraProps: {
      height: 200
    }
  }
};

export const graphIds = {};
export const REPORT_TABS = {
  "Sales": {
    "graphFilters": reportFilters.data.graphFilters.map((x, i) => ({
      ...x, id: i, "layoutHeader": reportChartData.layoutHeader,
      "table": reportChartData.table
    })),
    "timeFilters": reportFilters.data.timeFilters
  },
  "Acquisition": {
    "graphFilters": reportFilters.data.graphFilters.map((x, i) => ({
      ...x, id: i, "layoutHeader": reportChartData.layoutHeader,
      "table": reportChartData.table
    })),
    "timeFilters": reportFilters.data.timeFilters
  }
};

export const SEED_FILTERS = [{
  id : 1,
  name: 'Brand',
  filterType : 'MULTI_SELECT_DROPDOWN',
  values : [{text: 'brand1', value: 'brand1'}, {text: 'brand2', value: 'brand2'}, {text: 'brand3', value: 'brand3'},{text: 'brand4', value: 'brand4'}],
  isClosed : false,
  defaultValue : 'brand1',
  priority : 0,
  hasClearOption: true
}, {
  id : 2,
  name: 'Order Status',
  filterType : 'CHECK_BOX',
  values : [{text: 'brand1', value: 'brand1'}, {text: 'brand2', value: 'brand2'}, {text: 'brand3', value: 'brand3'},{text: 'brand4', value: 'brand4'}],
  isClosed : false,
  defaultValue : 'brand1',
  priority : 1,
  hasClearOption: true
}, {
  id : 3,
  name: 'Store',
  filterType : 'SINGLE_SELECT_DROPDOWN',
  values : [{text: 'brand1', value: 'brand1'}, {text: 'brand2', value: 'brand2'}, {text: 'brand3', value: 'brand3'},{text: 'brand4', value: 'brand4'}],
  isClosed : false,
  defaultValue : 'brand1',
  priority : 2,
  hasClearOption: true
}, {
  id : 4,
  name: 'Category',
  filterType : 'SINGLE_SELECT_DROPDOWN',
  values : [{text: 'brand1', value: 'brand1'}, {text: 'brand2', value: 'brand2'}, {text: 'brand3', value: 'brand3'},{text: 'brand4', value: 'brand4'}],
  isClosed : false,
  defaultValue : 'brand1',
  priority : 3,
  hasClearOption: true
}, {
  id : 5,
  name: 'Values',
  filterType : 'CHECK_BOX',
  values : [{text: 'brand1', value: 'brand1'}, {text: 'brand2', value: 'brand2'}, {text: 'brand3', value: 'brand3'},{text: 'brand4', value: 'brand4'}],
  isClosed : false,
  defaultValue : 'brand1',
  priority : 4,
  hasClearOption: true
}]
