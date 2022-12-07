import { getBase64DataURL, getFullAddress } from '../common';
import * as JsBarcode from 'jsbarcode';
import moment from 'moment';
const { DOMImplementation, XMLSerializer } = require('@xmldom/xmldom');

export class InvoicePosTemplateService {
    constructor(shipment) {
        this.mask_number = false;
        this.shipment = shipment;
        this.image_url = null;
        this.absolute_footer_position = 650;
        this.barcodeWidth = 100;
        this.isGstinAvailable = !!this.shipment.gst_details && this.shipment.gst_details.gstin_code ? this.shipment.gst_details.gstin_code : "";
        this.pageSizeWidth = 3 * 72
        this.pageLeftRightMargin = 24
    }

    getInvoiceTemplate() {
        if (!this.shipment.dp_details.awb_no) {
            return [];
        }
        this.image_url = this.textToBase64Barcode(this.shipment.dp_details.awb_no.toString());
        try {
            let invoice = [
                this.getInvoiceHeader(),
                this.getUserInfo(),
                this.getLineBreak(),
                this.getSellerInfo(),
                this.getBillingInfo(),
                this.getClientGst(),
                this.getAllProducts(),
                this.getDeclaration(),
                this.getFooterImage(),
                this.getInvoiceDetails()
            ];
            return Promise.all(invoice).then(data => {
                return this.getBaseTemplate(data);
            });
        } catch (err) {
            console.error(
                `Error occurred in template for shipment id: ${this.shipment.id}`,
                err
            );
            return [];
        }
    }

    getBaseTemplate(content) {
        let pdfmake_description = {
            info: {
                title: this.shipment.id + '_POS'
            },
            content,
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                large: {
                    fontSize: 13
                },
                medium: {
                    fontSize: 10
                }
            },
            defaultStyle: {
                columnGap: 20,
                font: 'Montserrat'
            },
            pageMargins: [12, 16, 12, 8],
            pageSize: {
                width: this.pageSizeWidth,
                height: 13.5 * 72
            }
        };
        return pdfmake_description;
    }

    getInvoiceHeader() {
        return {
            alignment: 'justify',
            stack: [
                {
                    text: `${this.isGstinAvailable ? "Tax " : ""}Invoice`,
                    style: 'header'
                },
                {   
                    stack: [
                        this.shipment.dp_details.name.toUpperCase(),
                        `AWB: ${this.shipment.dp_details.awb_no}`,
                    ],          
                    fontSize: 11,
                    margin: [0, 6],
                    bold: true
                },
                {
                    margin: [0, 8, 0, 8],
                    columns: this.getBarcodeAndSortCodeTable(),
                },
                this.getSortCode(),
                {
                    text: `Amount to be collected: ₹${this.shipment.invoice
                        .amount_to_collect || 0}`,
                    fontSize: 11,
                    bold: true,
                    margin: [0, 5, 0, 0],
                },
                {
                    text: `Invoice ID: ${
                        this.shipment.invoice.store_invoice_id
                    }  |  ${
                        this.shipment.payments.display_name
                    }  |  ${this.shipment.invoice.payment_type}  |  ${moment(
                        this.shipment.invoice.updated_date
                    ).format('MMMM Do YYYY, h:mm:ss a')}`, // was from order created time
                    fontSize: 8,
                    margin: [0, 0, 0, 3]
                },
                {
                    text: `Shipment: ${this.shipment.id}`,
                    fontSize: 8,
                    margin: [0, 0, 0, 3]
                },
            ]
        };
    }

    getSortCode() {
        const dpSortCode = this.getDpSortCode();
        if(dpSortCode) {
            return {
                stack: [
                    {
                        text: this.getDpSortCode(),
                        style: "large",
                        alignment: "center",
                        bold: "true",
                    }
                ],
            };
        }
        return {}
    }
    
    getBarcodeAndSortCodeTable() {
        const table = { body: [[{ svg: this.image_url , height: 100}]] };
        return [
            {
                width: "auto",
                layout: "noBorders",
                table,
            },
        ];
    }

    getDpSortCode() {
		const dpSortCode = this.shipment.affiliate_details.shipment_meta && this.shipment.affiliate_details.shipment_meta.sort_code ?this.shipment.affiliate_details.shipment_meta.sort_code : "";
;
		return dpSortCode ? `${dpSortCode}` : '';
	}


    getNameAndNumber() {
        const { delivery_address } = this.shipment.order;
        const name =
            this.shipment.is_packaging_order &&
            delivery_address.packaging_store_info
                ? `${
                      delivery_address.packaging_store_info.store_id
                  } | ${delivery_address.packaging_store_info.company_name ||
                      delivery_address.packaging_store_info.brand_name}`
                : `${delivery_address.name}`;

        const phone = this.mask_number
            ? `XXXXXXX${delivery_address.phone.slice(-3)}`
            : delivery_address.phone;
        return { name, phone };
    }

    getUserInfo() {
        const { name, phone } = this.getNameAndNumber();
        return [
            {
                text: 'DELIVERY ADDRESS',
                fontSize: 11,
                bold: true,
                margin: [0, 3, 0, 2]
            },
            {
                text: `${name} | Mobile: ${phone}`,
                fontSize: 10,
                bold: true,
                margin: [0, 0, 0, 3]
            },
            {
                text: `${getFullAddress(this.shipment.order.delivery_address)}`,
                fontSize: 10,
                margin: [0, 0, 0, 3],
                lineHeight: 1
            }
        ];
    }

    getSellerInfo() {
        return {
            alignment: 'justify',
            stack: [
                {
                    margin: [0, 8, 0, 0],
                    text: 'Sold By',
                    bold: true,
                    fontSize: 10
                },
                {
                    text: `${this.shipment.company.company_name}`,
                    fontSize: 9,
                    margin: [0, 4, 5, 0]
                },
                {
                    text: `C/o ${getFullAddress(
                        this.shipment.fulfilling_store
                    )}`,
                    fontSize: 9,
                    lineHeight: 1,
                    margin: [0, 3, 5, 0]
                },
                {
                    text: `GSTIN: ${this.shipment.gst.gstin_code}`,
                    bold: true,
                    fontSize: 9,
                    margin: [0, 3, 0, 0]
                },
                {
                    text: 'Return To',
                    bold: true,
                    fontSize: 10,
                    margin: [0, 8, 0, 0]
                },
                {
                    text: `${getFullAddress(
                        this.shipment.invoice.rto_address
                    )}`,
                    fontSize: 9,
                    margin: [0, 4, 0, 0],
                    lineHeight: 1
                }
            ]
        };
    }

    getBillingInfo() {
        const { name, phone } = this.getNameAndNumber();
        return {
            margin: [0, 14, 0, 10],
            stack: [
                {
                    text: 'Billing Address',
                    bold: true,
                    fontSize: 10
                },
                {
                    text: `${name} | Mobile: ${phone}`,
                    bold: true,
                    fontSize: 11,
                    margin: [0, 6, 4, 0]
                },
                {
                    text: `${getFullAddress(
                        this.shipment.order.delivery_address
                    )}`,
                    fontSize: 10,
                    lineHeight: 1
                }
            ]
        };
    }

    getClientGst() {
        if (
            this.shipment.order.tax_details && this.shipment.order.tax_details.gstin
        ) {
            return {
                margin: [0, 0, 0, 10],
                columns: [
                    {
                        width: '25%',
                        text: '',
                        bold: true,
                        fontSize: 10
                    },
                    {
                        text: `Customer GST: ${this.shipment.order.tax_details.gstin}`,
                        bold: true,
                        fontSize: 9
                    }
                ]
            };
        }
        return {};
    }

    getDeclaration() {
        let points = [
            {
                text:
                    'Goods sold are meant for end consumption only and should not be resold',
                fontSize: 8,
                margin: [0, 10, 0, 0],
                bold: false
            },
            {
                text:
                    'This is a computer generated invoice and does not require authorised signatory',
                fontSize: 8,
                margin: [0, 5, 0, 0],
                bold: false
            },
            {
                text:
                    'We declare that this invoice shows the actual price of the goods described above and that all particulars are true and accurate',
                fontSize: 8,
                margin: [0, 5, 0, 0],
                bold: false
            },
            {
                text:
                    'In case you have faced any problem, you may reach us at care@fynd.com',
                fontSize: 8,
                margin: [0, 5, 0, 0],
                bold: false
            }
        ];
        let declaration = [
            {
                text: 'Declaration',
                fontSize: 8,
                bold: true,
                margin: [0, 15, 0, 0]
            }
        ];
        // if (this.shipment.order.source.includes('uniket')) {
        //     points.shift();
        // }
        if (this.shipment.order.channel.name === 'UNIKET') {
            points.shift();
        }
        points.forEach((point, index) => {
            point.text = `${index + 1} ${point.text}`;
            declaration.push(point);
        });

        return declaration;
    }

    getFooterImage() {
        return Promise.all([
            getBase64DataURL(this.shipment.brand.logo),
            this.getPlatformLogo()
        ]).then(data => {
            if (data) {
                let obj = {
                    alignment: 'justify',
                    margin: [0, 24, 0, 0],
                    columns: [
                        [
                            {
                                columns: [
                                    {
                                        image: data[0],
                                        alignment: 'left',
                                        width: 60
                                    },
                                ]
                            }
                        ],
                        data[1]
                    ]
                };
                return obj;
            } else {
                return {};
            }
        });
    }

    getInvoiceDetails() {
        return {
            alignment: 'justify',
            margin: [0, 24, 0, 0],
            columns: [
              [
                {
                  columns: [
                    {
                        text: `Invoice: ${this.shipment.invoice.store_invoice_id}`,
                        fontSize: 8,
                        margin: [0, 0, 0, 0]
                    }
                  ]
                }
              ],
              // this.getUPIData()
            ]
        }
    }

    getUPIData() {
        return {
            alignment: "justify",
            width: 60,
            stack: [
                this.getUpiQrCode(), this.getUpiQrTitle()
            ],
        }
    }

    getUpiQrCode() {
        if (this.shipment.payments.mode !== "COD") {
          return {};
        }
    
        const upiURI = new URL("upi://pay");
        upiURI.searchParams.append("pa", "fynd.rzp@hdfcbank");
        upiURI.searchParams.append("pn", "Fynd");
        upiURI.searchParams.append(
          "tn",
          `Payment for Order ${this.shipment.order.order_id}`
        );
        upiURI.searchParams.append(
          "am",
          `${
            (this.shipment.gst.brand_calculated_amount || 0.0) +
            this.shipment.prices.cod_charges 
            + this.shipment.prices.delivery_charge
          }`
        );
        upiURI.searchParams.append("cu", "INR");
    
        return {
          qr: upiURI.toString(),
          alignment: "right",
          fit: 60,
        };
    }

    getUpiQrTitle() {
        if (this.shipment.payments.mode !== "COD") {
          return {};
        }
    
        return {
            text: `Scan to pay`,
            alignment: 'center',
            fontSize: 7,
            margin: [0, 3, 0, 3],
        }
    }
    
    getInvoiceTable() {
        return [
            this.getLineBreak(),
            {
                margin: [0, 5, 0, 3],
                alignment: 'justify',
                padding: [2, 0, 2, 0],
                columnGap: 0,
                columns: this.getInvoiceTableHeaders()
            },
            this.getLineBreak(),
            this.getRows(),
            this.getFyndDiscount(),
            this.getDeliveryRow(),
            this.getLineBreak(),
            this.getTotalRow(),
            this.getLineBreak()
        ];
    }

    getAllProducts() {
        if (
            ['ios', 'android', 'desktop'].indexOf(this.shipment.order.source) >
            -1
        ) {
            return [
                this.getLineBreak(),
                this.getAllProductDetailsFynd(),
                this.getOtherCharges()
            ];
        } else {
            return [this.getLineBreak(), this.getAllProductDetailsFynd(true)];
        }
    }

    getAllProductDetailsFynd(isNotFynd = false) {
        let products = this.shipment.bags.map(bag => {
            return bag.financial_breakup.map(fin_obj => {
                return this.getProductDetailFynd(fin_obj, bag, isNotFynd);
            });
        });
        return {
            margin: [0, 15, 0, 10],
            stack: [
                {
                    text: 'Product Details',
                    bold: true,
                    fontSize: 10
                },
                products
            ]
        };
    }

    getProductDetailFynd(bag, bag_data, isNotFynd = false) {
        return {
            margin: [0, 0, 0, 10],
            stack: [
                {
                    text: `${bag.item_name} | Size: ${bag.size}`,
                    bold: true,
                    fontSize: 11,
                    margin: [0, 3, 0, 0]
                },
                {
                    text: `Bag ID: ${bag_data.bag_id || bag_data.id}`,
                    fontSize: 9,
                    margin: [0, 3, 0, 0]
                },
                {
                    text: this.getItemDetails(bag_data),
                    fontSize: 9,
                    margin: [0, 3, 0, 0]
                },
                {
                    text: this.getIdentifiers(bag_data),
                    fontSize: 9,
                    margin: [0, 3, 0, 0]
                },
                this.isGstinAvailable ? {
                    text: `HSN: ${bag.hsn_code}`,
                    fontSize: 9,
                    margin: [0, 3, 0, 0],
                }: {},
                {
                    text: isNotFynd
                        ? this.getOtherInvoiceMath(bag)
                        : this.getFyndInvoiceMath(bag),
                    fontSize: 9,
                    margin: [0, 3, 0, 0]
                }
            ]
        };
    }

    getItemDetails(bag) {
        let item_details = `Item: ${bag.item.code}`;
        try {
            if (bag.article.identifiers['Article']) {
                item_details = `${item_details}  |  Article: ${
                    bag.article.identifiers['Article']
                }`;
            }
        } finally {
            return item_details;
        }
    }

    getFyndInvoiceMath(bag) {
        let details = `VOG: ₹${bag.value_of_good}`;
        if (bag.gst_tag == 'IGST') {
            details = `${details}  |  IGST(${
                bag.gst_tax_percentage
            }%): ₹${this.toFixed(Number(bag.gst_fee), 2)}`;
        } else {
            details = `${details}  |  CGST(${bag.gst_tax_percentage /
                2.0}%): ₹${this.toFixed(Number(bag.gst_fee) / 2.0, 2)}`;
            details = `${details}  |  SGST(${bag.gst_tax_percentage /
                2.0}%): ₹${this.toFixed(Number(bag.gst_fee) / 2.0, 2)}`;
        }
        details = `${details}  |  Discount: ₹${
            this.shipment.is_not_fynd_source
                ? bag.price_marked - bag.brand_calculated_amount
                : bag.discount || 0
        }`;
        return details;
    }

    getOtherInvoiceMath(bag) {
        let details = `VOG: ₹${bag.value_of_good}`;
        if (bag.gst_tag == 'IGST') {
            details = `${details}  |  IGST(${
                bag.gst_tax_percentage
            }%): ₹${this.toFixed(Number(bag.gst_fee), 2)}`;
        } else {
            details = `${details}  |  CGST(${bag.gst_tax_percentage /
                2.0}%): ₹${this.toFixed(Number(bag.gst_fee) / 2.0, 2)}`;
            details = `${details}  |  SGST(${bag.gst_tax_percentage /
                2.0}%): ₹${this.toFixed(Number(bag.gst_fee) / 2.0, 2)}`;
        }
        details = `${details}  |  MRP: ₹${bag.price_marked}`;
        details = `${details}  |  Discount: ₹${
            this.shipment.is_not_fynd_source
                ? bag.price_marked - bag.brand_calculated_amount
                : bag.discount || 0
        }`;
        details = `${details}  |  Total: ₹${bag.brand_calculated_amount}`;
        return details;
    }

    getOtherCharges() {
        return {
            stack: [
                {
                    text: 'Other Charges',
                    bold: true,
                    fontSize: 10
                },
                {
                    text: `Standard Delivery Charge: ₹${this.shipment.prices
                        .delivery_fee || 0.0}`,
                    bold: true,
                    fontSize: 10,
                    margin: [0, 5, 0, 10]
                }
            ]
        };
    }

    getTotalRow() {
        let total_row = {
            margin: [0, 8, 0, 8],
            alignment: 'justify',
            padding: [2, 0, 2, 0],
            columnGap: 0,
            columns: [
                {
                    width: '75%',
                    text: 'Total',
                    fontSize: 10,
                    alignment: 'right',
                    bold: true
                },
                [
                    {
                        text: `₹${this.shipment.gst.brand_calculated_amount}`,
                        fontSize: 10,
                        bold: true,
                        alignment: 'right'
                    },
                    {
                        margin: [0, 2, 0, 0],
                        text: 'Inclusive of all taxes',
                        fontSize: 8,
                        alignment: 'right',
                        bold: true
                    }
                ]
            ]
        };
        return total_row;
    }

    getRows() {
        let rows = [];
        this.shipment.bags.forEach(bag => {
            rows.push([
                {
                    margin: [0, 8, 0, 3],
                    alignment: 'justify',
                    padding: [2, 0, 2, 0],
                    columnGap: 0,
                    columns: this.getInvoiceTableRows(bag)
                }
            ]);
        });
        return rows;
    }

    getPlatformLogo() {
        if (!this.shipment.order.channel) {
            return {};
        }
        return getBase64DataURL(this.shipment.order.channel.logo).then(data => {
            if (data) {
                return {
                    image: data,
                    alignment: 'right',
                    width: 40
                };
            } else {
                return {};
            }
        });
    }

    getLineBreak() {
        return {
            canvas: [
                {
                    type: 'line',
                    x1: 0,
                    y1: 7,
                    x2: 3 * 72 - 2 * 12,
                    y2: 7,
                    lineWidth: 0.25,
                    lineColor: '#cccccc'
                }
            ]
        };
    }

    textToBase64Barcode(text) {
        const xmlSerializer = new XMLSerializer();
        const document = new DOMImplementation().createDocument(
            'http://www.w3.org/1999/xhtml',
            'html',
            null
        );
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        JsBarcode(svg, text, {
            font: 'Helvetica',
            width: 2,
            fontSize: 12,
            margin: 0,
            fontOptions: 'bold',
            xmlDocument: document,
        });
        this.barcodeWidth = svg&& svg.width && svg.width.baseVal && svg.width.baseVal.value ? svg.width.baseVal.value : 0;
        svg.setAttribute("width", (this.pageSizeWidth - this.pageLeftRightMargin).toString());
        return xmlSerializer.serializeToString(svg);
    }

    toFixed(value, n) {
        const v = value.toString().split('.');
        if (n <= 0) return v[0];
        let f = v[1] || '';
        if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
        while (f.length < n) f += '0';
        return `${v[0]}.${f}`;
    }

    getInvoiceTableHeaders() {
        let columns = [
            {
                width: '20%',
                text: 'Product',
                fontSize: 8,
                alignment: 'left',
                bold: true
            },
            {
                text: 'MRP',
                fontSize: 8,
                alignment: 'right',
                bold: true
            },
            {
                text: 'Disc',
                fontSize: 8,
                alignment: 'right',
                bold: true
            },
            {
                text: 'VOG',
                fontSize: 8,
                alignment: 'right',
                bold: true
            },
            {
                text: 'Total',
                fontSize: 8,
                alignment: 'right',
                bold: true
            }
        ];
        if (this.isGstinAvailable) {
            if (this.shipment.bags[0].gst_details.gst_tag == 'IGST') {
                columns.splice(4, 0, {
                    text: 'IGST',
                    fontSize: 8,
                    alignment: 'right',
                    bold: true
                });
            } else {
                columns.splice(4, 0, {
                    text: 'CGST',
                    fontSize: 8,
                    alignment: 'right',
                    bold: true
                });
                columns.splice(5, 0, {
                    text: 'SGST',
                    fontSize: 8,
                    alignment: 'right',
                    bold: true
                });
            }
        }
        return columns;
    }

    getInvoiceTableRows(bag) {
        let columns = [
            {
                width: '20%',
                stack: this.getProductDetails(bag),
                fontSize: 8,
                alignment: 'left'
            },
            {
                text: `₹${bag.prices.price_marked || 0}`,
                fontSize: 8,
                alignment: 'left'
            },
            {
                text: `₹${bag.prices.discount || 0}`,
                fontSize: 8,
                alignment: 'left'
            },
            {
                width: '10%',
                text: `₹${bag.prices.value_of_good || 0}`,
                fontSize: 8,
                alignment: 'left'
            }
        ];
        let brandCalculatedAmountColumn = {
            text: `₹${bag.gst_details.brand_calculated_amount || 0}`,
            fontSize: 8,
            alignment: 'left'
        };
        let gstColumns = [];
        if (this.isGstinAvailable) {
            if (bag.gst_details.gst_tag != 'IGST') {
                gstColumns = [
                    [
                        {
                            text: `₹${this.toFixed(bag.gst_details.gst_fee, 2)}`,
                            fontSize: 8,
                            alignment: 'left'
                        },
                        {
                            text: `(${bag.gst_details.gst_tax_percentage}%)`,
                            fontSize: 8,
                            alignment: 'left'
                        }
                    ]
                ];
            } else {
                let gst_tax_amount = bag.gst_details.gst_fee / 2.0;
                let gst_tag_percentage = bag.gst_details.gst_tax_percentage / 2.0;
                gstColumns = [
                    [
                        {
                            text: `₹${this.toFixed(gst_tax_amount, 2)}`,
                            fontSize: 8,
                            alignment: 'left'
                        },
                        {
                            text: `(${gst_tag_percentage}%)`,
                            fontSize: 8,
                            alignment: 'left'
                        }
                    ],
                    [
                        {
                            text: `₹${this.toFixed(gst_tax_amount, 2)}`,
                            fontSize: 8,
                            alignment: 'left'
                        },
                        {
                            text: `(${gst_tag_percentage}%)`,
                            fontSize: 8,
                            alignment: 'left'
                        }
                    ]
                ];
            }
        }
        columns = columns
            .concat(gstColumns)
            .concat(brandCalculatedAmountColumn);
        return columns;
    }

    getDeliveryRow() {
        return {
            margin: [0, 8, 0, 3],
            alignment: 'justify',
            padding: [2, 0, 2, 0],
            columnGap: 0,
            columns: [
                {
                    width: '50%',
                    text: 'Standard Delivery Charges',
                    fontSize: 10,
                    alignment: 'left',
                    bold: true
                },
                {
                    width: '50%',
                    text: `₹${this.shipment.prices.delivery_fee || 0.0}`,
                    fontSize: 10,
                    alignment: 'right',
                    bold: true
                }
            ]
        };
    }

    getFyndDiscount() {
        if (this.shipment.is_not_fynd_source && this.shipment.is_fynd_coupon) {
            return {
                margin: [0, 8, 0, 3],
                alignment: 'justify',
                padding: [2, 0, 2, 0],
                columnGap: 0,
                columns: [
                    {
                        width: '50%',
                        text: 'Fynd Discount',
                        fontSize: 10,
                        alignment: 'left',
                        bold: true
                    },
                    {
                        width: '50%',
                        text: `₹${this.shipment.prices.coupon_value || 0.0}`,
                        fontSize: 10,
                        alignment: 'right',
                        bold: true
                    }
                ]
            };
        }
        return {};
    }

    getProductDetails(bag) {
        return [
            {
                text: `${bag.item.name} | Size: ${bag.item.size}`,
                fontSize: 7,
                alignment: 'left',
                bold: true
            },
            {
                text: `${this.getIdentifiers(bag)}`,
                fontSize: 7,
                alignment: 'left'
            },
            {
                text: `${this.isGstinAvailable ? 'HSN: $' + bag.gst_details.hsn_code + '|': ""} Bag Id: ${bag.id}`,
                fontSize: 7,
                alignment: 'left'
            }
        ];
    }

    getIdentifiers(bag) {
        let identifier = '';
        try {
            for (let key in bag.article.identifiers) {
                if (
                    bag.article.identifiers.hasOwnProperty(key) &&
                    bag.article.identifiers[key] &&
                    key != 'Article'
                ) {
                    identifier =
                        identifier +
                        `${key.replace('_', ' ').toUpperCase()}: ${
                            bag.article.identifiers[key]
                        }  |  `;
                }
            }
            if (identifier.length > 0) {
                return identifier.slice(0, -3);
            }
        } catch (err) {
            console.error(err);
        }
        return identifier;
    }
}
