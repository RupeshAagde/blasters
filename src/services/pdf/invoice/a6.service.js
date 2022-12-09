import { getBase64DataURL, getFullAddress } from '../common';
import * as JsBarcode from 'jsbarcode';
import moment from 'moment';
const { DOMImplementation, XMLSerializer } = require('@xmldom/xmldom');


export class InvoiceA6TemplateService {
    constructor(shipment) {
        this.mask_number = true;
        this.shipment = shipment;
        this.image_url = null;
        this.absolute_footer_position = 650;

        this.headers = [
            "Product",
            "HSN Code",
            "MRP (Unit)",
            "Discount (Unit)",
            "Taxable Amount (Unit)",
            "Total Taxable Amount"
        ];
        this.keysMap = {
            Product: 'item_name',
            'HSN Code': 'hsn_code'
        };
        this.header_arr = [];
        this.isGstinAvailable = !!(this.shipment.gst && this.shipment.gst.gstin_code);
    }

    getInvoiceTemplate() {
        if (!this.shipment.dp_details.awb_no) {
            return [];
        }
        this.image_url = this.textToBase64Barcode(
            this.shipment.dp_details.awb_no.toString()
        );
        try {
            let invoice = [
                this.getInvoiceHeader(),
                this.getLineBreak(),
                this.getSellerInfo(),
                this.getGstinInfo(),
                this.getBillingInfo(),
                this.getClientGst(),
                this.getAllProducts(),
                this.getDeclaration(),
                this.getFooterImage(),
            ];
            return Promise.all(invoice).then((data) => {
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
                title: this.shipment.id + '_A6',
            },
            content: content,
            styles: {
                header: {
                    fontSize: 12,
                    bold: true,
                },
                large: {
                    fontSize: 4,
                },
                medium: {
                    fontSize: 3,
                },
            },
            defaultStyle: {
                columnGap: 5,
                font: 'Montserrat',
            },
            pageMargins: [6, 6, 6, 8],
            pageSize: 'A6',
        };
        return pdfmake_description;
    }

    getInvoiceHeader() {
        return {
            alignment: 'justify',
            columns: [
                [
                    {
                        text: `${this.isGstinAvailable ? "Tax " : ""}Invoice`,
                        style: 'header',
                    },
                    {
                        margin: [0, 2],
                        columnGap: 0,
                        columns: [
                            {
                                width: 'auto',
                                text: `${this.shipment.dp_details.name.toUpperCase()}`,
                                fontSize: 6,
                                bold: true,
                            },
                            {
                                width: 'auto',
                                text: '|',
                                fontSize: 6,
                                bold: true,
                                margin: [7, 0],
                            },
                            {
                                width: '50%',
                                text: `AWB: ${this.shipment.dp_details.awb_no}`,
                                fontSize: 6,
                                bold: true,
                            },
                        ],
                    },
                    {
                        text: `Amount to be collected: ₹${
                            this.shipment.invoice.amount_to_collect || 0
                        }`, //todo
                        fontSize: 8,
                        bold: true,
                    },
                    {
                        //todo
                        text: `Invoice: ${this.shipment.invoice.store_invoice_id}  | ${
                            this.shipment.invoice.payment_mode
                        }  |  ${
                            this.shipment.payments.display_name
                        }  |  ${moment(
                            this.shipment.invoice.updated_date
                        ).format('MMMM Do YYYY, h:mm:ss a')}`,
                        fontSize: 6,
                        margin: [0, 2, 0, 5],
                    },
                    {
                        text: `Shipment: ${this.shipment.id}`,
                        fontSize: 7,
                        margin: [0, 0, 0, 3],
                    },
                    this.getUserInfo(),
                    // this.getIrnNumber(),
                    {
                        text: `Total Bags: ${this.shipment.total_shipment_bags}`,
                        fontSize: 7,
                        margin: [0, 0, 0, 3],
                    },
                ],
                {
                    width: this.barcodeWidth,
                    layout: "noBorders",
                    table: { body: this.getTopRightContent() },
                },
            ],
        };
    }

    getTopRightContent() {
        const content = [
            [{ svg: this.image_url, width: this.barcodeWidth, height: 40 }]
        ];
    
        const dpSortCode = this.getDpSortCode();
        if (dpSortCode) {
          content.push([
            {
              text: this.getDpSortCode(),
              style: "large",
              alignment: "center",
              bold: "true",
            },
          ]);
        }
    
        return content;
    }

    getSignedQRCode() {
        const eInvoiceData = this.shipment.einvoice_data;
        let qrCode = {};
        if(!!(eInvoiceData && eInvoiceData.invoice && eInvoiceData.invoice.SignedQRCode)) {
          qrCode = {
                qr: eInvoiceData.invoice.SignedQRCode,
                alignment: "center",
                fit: 120,
          }
        }
        return qrCode; 
    }

    getIrnNumber() {
        const eInvoiceData = this.shipment.einvoice_data;
        let irnData = {};
        if(!!(eInvoiceData&&eInvoiceData.invoice&&eInvoiceData.invoice.Irn)) {
            irnData = {
                text : `IRN: ${eInvoiceData.invoice.Irn}`,
                alignment: "left",
                fontSize: 5,
                margin:[0,5,0,0]
            }    
        }
        return irnData;
    }
    
    getDpSortCode() {
		const dpSortCode = this.shipment.affiliate_details.shipment_meta && this.shipment.affiliate_details.shipment_meta.sort_code ?this.shipment.affiliate_details.shipment_meta.sort_code : "";
;
		return dpSortCode ? `${dpSortCode}` : "";
	}
    
    getNameAndNumber() {
        const { delivery_address } = this.shipment.order;
        const name =
            this.shipment.is_packaging_order &&
            delivery_address.packaging_store_info
                ? `${delivery_address.packaging_store_info.store_id} | ${
                      delivery_address.packaging_store_info.company_name ||
                      delivery_address.packaging_store_info.brand_name
                  }`
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
                fontSize: 8,
                bold: true,
                margin: [0, 0, 0, 2],
            },
            {
                text: `${name} | Mobile: ${phone}`,
                fontSize: 8,
                bold: true,
                margin: [0, 0, 0, 3],
            },
            {
                text: `${getFullAddress(this.shipment.order.delivery_address)}`,
                fontSize: 7,
                margin: [0, 0, 0, 0],
                // lineHeight: 1.25
            },
        ];
    }

    getSellerInfo() {
        const addressList = [
            [
                {
                    text: 'Sold By',
                    bold: true,
                    fontSize: 7,
                },
                {
                    //todo
                    text: `${this.shipment.company.company_name}`,
                    fontSize: 5,
                    margin: [0, 3, 5, 0],
                },
                {
                    text: `C/o ${getFullAddress(
                        this.shipment.fulfilling_store
                    )}`,
                    fontSize: 5,
                    lineHeight: 1.25,
                    margin: [0, 1, 5, 0],
                },
            ],
            [
                {
                    text: 'Return To',
                    bold: true,
                    fontSize: 7,
                },
                {
                    //todo
                    text: `${getFullAddress(
                        this.shipment.invoice.rto_address
                    )}`,
                    fontSize: 5,
                    margin: [0, 3, 0, 0],
                    lineHeight: 1.25,
                },
            ],
        ];

        if(this.shipment.affiliate_details.company_affiliate_tag === "Mysa") {
            addressList.unshift(this.getSoldByAddress());
        };

        return {
            alignment: 'justify',
            columns: addressList,
            margin: [0, 4, 0, 3],
        };
    }


    getSoldByAddress() {
        const parseAddress = this.shipment.company.meta;
        let sold_by_address = [
            parseAddress.address[1].address1,
            parseAddress.address[1].city,
            parseAddress.address[1].state,
            parseAddress.address[1].country,
            parseAddress.address[1].pincode,
        ];
        return [
          {
            text: "Sold By",
            bold: true,
            fontSize: 5,
          },
          {
            text: `${this.shipment.company.company_name}`,
            fontSize: 4,
            margin: [0, 3, 0, 0],
          },
          {
            text: sold_by_address.join(", "),
            fontSize: 4,
            lineHeight: 1.25,
            margin: [0, 1, 0, 0],
          },
        ];
    }

    getGstinInfo() {
        return {
            text: `GSTIN: ${this.shipment.gst.gstin_code}`,
            bold: true,
            fontSize: 7,
        };
    }

    getBillingInfo() {
        const { name, phone } = this.getNameAndNumber();
        return {
            margin: [0, 14, 0, 0],
            columns: [
                {
                    width: '25%',
                    text: 'Billing Address',
                    bold: true,
                    fontSize: 7,
                },
                [
                    {
                        text: `${name} | Mobile: ${phone}`,
                        bold: true,
                        fontSize: 7,
                        margin: [0, 0, 0, 0],
                    },
                    {
                        text: `${getFullAddress(
                            this.shipment.order.delivery_address
                        )}`,
                        fontSize: 5,
                        margin: [0, 3, 0, 0],
                        lineHeight: 1.25,
                    },
                ],
            ],
        };
    }

    getClientGst() {
        if (
            this.shipment.order.tax_details &&
            this.shipment.order.tax_details.gstin
        ) {
            return {
                margin: [5, 2],
                columns: [
                    {
                        width: '25%',
                        text: '',
                        bold: true,
                        fontSize: 5,
                    },
                    {
                        text: `Customer GST: ${this.shipment.order.tax_details.gstin}`,
                        bold: true,
                        fontSize: 6,
                    },
                ],
            };
        }
        return {};
    }

    getDeclaration() {
        let points = [
            {
                text:
                    'Goods sold are meant for end consumption only and should not be resold',
                fontSize: 6,
                margin: [0, 0, 0, 0],
                bold: false,
            },
            {
                text:
                    'This is a computer generated invoice and does not require authorised signatory',
                fontSize: 6,
                margin: [0, 3, 0, 0],
                bold: false,
            },
            {
                text:
                    'We declare that this invoice shows the actual price of the goods described above and that all particulars are true and accurate',
                fontSize: 6,
                margin: [0, 3, 0, 0],
                bold: false,
            },
            {
                text:
                    'In case you have faced any problem, you may reach us at care@fynd.com',
                fontSize: 6,
                margin: [0, 3, 0, 0],
                bold: false,
            },
        ];
        let declaration = [
            {
                text: 'Declaration',
                fontSize: 6,
                bold: true,
                margin: [0, 5, 0, 0],
            },
        ];
        // if (this.shipment.order.channel.name.includes('uniket')) {
        //     points.shift();
        // }
        if (this.shipment.order.channel.name === 'UNIKET') {
            points.shift();
        }
        if (this.shipment.order.channel.name === 'ECOMM') {
            points.pop();
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
            this.getPlatformLogo(),
        ]).then((data) => {
            if (data) {
                let obj = {
                    alignment: 'justify',
                    margin: [0, 6, 0, 0],
                    columns: [
                        [
                            {
                                columns: [
                                    {
                                        image: `${data[0]}`,
                                        width: 40,
                                        //height: 40,
                                        maxHeight: 40
                                    },
                                    {
                                        text: `Invoice: ${this.shipment.invoice.store_invoice_id}`,
                                        fontSize: 6,
                                        margin: [0, 15, 0, 0],
                                    },
                                    // this.getUPIData(),
                                ],
                            },
                        ], 
                        data[1]
                    ],
                };
                return obj;
            } else {
                return {};
            }
        });
    }

    getUPIData() {
        return {
            alignment: "justify",
            width: 60,
            stack: [this.getUpiQrCode(), this.getUpiQrTitle()],
        };
    }

    getUpiQrTitle() {
        if (this.shipment.payments.mode !== "COD") {
            return {};
        }
    
        return {
            text: `Scan to pay`,
            alignment: "center",
            fontSize: 7,
            margin: [0, 3, 0, 3],
        };
    }

    getUpiQrCode() {
        if (this.shipment.payments.mode !== 'COD') {
            return {};
        }

        const upiURI = new URL('upi://pay');
        upiURI.searchParams.append('pa', 'fynd.rzp@hdfcbank');
        upiURI.searchParams.append('pn', 'Fynd');
        upiURI.searchParams.append(
            'tn',
            `Payment for Order ${this.shipment.order.order_id}`
        );
        upiURI.searchParams.append(
            'am',
            `${
                (this.shipment.gst.brand_calculated_amount || 0.0) +
                this.shipment.prices.cod_charges +
                this.shipment.prices.delivery_charge
            }`
        );
        upiURI.searchParams.append('cu', 'INR');

        return {
            qr: upiURI.toString(),
            alignment: 'right',
            fit: 75,
        };
    }

    getAllProducts() {
        return [this.getNewInvoiceTable()];
    }

    // Not Used Inside
    getAllProductDetailsFynd() {
        let products = this.shipment.bags.map((bag) => {
            return this.getProductDetailFynd(bag);
        });
        return {
            margin: [0, 10, 0, 10],
            columns: [
                {
                    width: '25%',
                    text: 'Product Details',
                    bold: true,
                    fontSize: 10,
                },
                products,
            ],
        };
    }

    // Not Used Inside
    getProductDetailFynd(bag) {
        return {
            margin: [0, 0, 0, 20],
            stack: [
                {
                    text: `${bag.item.name} | Size: ${bag.item.size}`,
                    bold: true,
                    fontSize: 11,
                    margin: [0, 3, 0, 0],
                },
                {
                    text: `Bag ID: ${bag.id}`,
                    fontSize: 9,
                    margin: [0, 3, 0, 0],
                },
                {
                    text: this.getItemDetails(bag),
                    fontSize: 9,
                    margin: [0, 3, 0, 0],
                },
                {
                    text: this.getIdentifiers(bag),
                    fontSize: 9,
                    margin: [0, 3, 0, 0],
                },
                {
                    text: `HSN: ${bag.gst_details.hsn_code}`,
                    fontSize: 9,
                    margin: [0, 3, 0, 0],
                },
                {
                    text: this.getFyndInvoiceMath(bag),
                    fontSize: 9,
                    margin: [0, 3, 0, 0],
                },
            ],
        };
    }

    // Not Used Inside
    getItemDetails(bag) {
        let item_details = `Item: ${bag.item.code}`;
        try {
            // todo
            if (bag.article.identifiers['Article']) {
                item_details = `${item_details}  |  Article: ${bag.article.identifiers['Article']}`;
            }
        } finally {
            return item_details;
        }
    }

    // Not Used Inside
    getFyndInvoiceMath(bag) {
        let details = `VOG: ₹${bag.prices.value_of_good}`;
        if (bag.gst_details.gst_tag == 'IGST') {
            details = `${details}  |  IGST(${
                bag.gst_details.gst_tax_percentage
            }%): ₹${this.toFixed(bag.gst_details.gst_fee, 2)}`;
        } else {
            details = `${details}  |  CGST(${
                bag.gst_details.gst_tax_percentage / 2.0
            }%): ₹${this.toFixed(bag.gst_details.gst_fee / 2.0, 2)}`;
            details = `${details}  |  SGST(${
                bag.gst_details.gst_tax_percentage / 2.0
            }%): ₹${this.toFixed(bag.gst_details.gst_fee / 2.0, 2)}`;
        }
        details = `${details}  |  MRP: ₹${bag.prices.price_marked}`;
        return details;
    }

    // Not Used Inside
    getOtherCharges() {
        return {
            margin: [0, 10, 0, 10],
            columns: [
                {
                    width: '25%',
                    text: 'Other Charges',
                    bold: true,
                    fontSize: 10,
                },
                [
                    {
                        text: 'Standard Delivery',
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: `Amount: ₹${
                            this.shipment.prices.delivery_charge || 0.0
                        }`,
                        fontSize: 9,
                        margin: [0, 5, 0, 10],
                    },
                ],
            ],
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
                    fontSize: 4,
                    alignment: 'left',
                    bold: true,
                },
                [
                    {
                        text: `₹${this.shipment.gst.brand_calculated_amount}`,
                        fontSize: 4,
                        bold: true,
                        alignment: 'left',
                    },
                    {
                        margin: [0, 2, 0, 0],
                        text: 'Inclusive of all taxes',
                        fontSize: 4,
                        alignment: 'left',
                        bold: true,
                    },
                ],
            ],
        };
        return total_row;
    }

    getRows() {
        let rows = [];
        this.shipment.bags.forEach((bag) => {
            rows.push([
                {
                    margin: [0, 8, 0, 3],
                    alignment: 'justify',
                    padding: [2, 0, 2, 0],
                    columnGap: 0,
                    columns: this.getInvoiceTableRows(bag),
                },
            ]);
        });
        return rows;
    }

    getPlatformLogo() {
        if (!this.shipment.order.channel) {
            // todo: is_affilate?
            return {};
        }
        return getBase64DataURL(this.shipment.order.channel.logo).then(
            (data) => {
                if (data) {
                    return {
                        image: `${data}`,
                        alignment: 'right',
                        width: 50,
                        maxHeight: 40,
                        margin: [0, 8, 4, 0]
                    };
                } else {
                    return {};
                }
            }
        );
    }

    getLineBreak() {
        return {
            canvas: [
                {
                    type: 'line',
                    x1: 0,
                    y1: 7,
                    x2: 832 - 2 * 30,
                    y2: 7,
                    lineWidth: 0.25,
                    lineColor: '#cccccc',
                },
            ],
        };
    }

    textToBase64Barcode(text) {
        const xmlSerializer = new XMLSerializer();
        const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        JsBarcode(svg, text, {
        font: "Helvetica",
        width: 1,
        height: 50,
        fontSize: 10,
        margin: 0,
        fontOptions: "bold",
        xmlDocument: document,
        });
        // this.barcodeWidth = svg.width.baseVal.value;
        this.barcodeWidth = 100;
        return xmlSerializer.serializeToString(svg);

        // let canvas = document.createElement('canvas');
        // JsBarcode(canvas, text, {
        //     width: 1,
        //     height: 60,
        //     fontSize: 10,
        //     margin: 0,
        // });
        // return canvas.toDataURL('image/png');
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
                width: '25%',
                text: 'Product',
                fontSize: 8,
                alignment: 'left',
                bold: true,
            },
            {
                text: 'MRP',
                fontSize: 8,
                alignment: 'right',
                bold: true,
            },
            {
                text: 'Discount',
                fontSize: 8,
                alignment: 'right',
                bold: true,
            },
            {
                width: '16%',
                text: 'Value of Goods',
                fontSize: 8,
                alignment: 'right',
                bold: true,
            },
            {
                text: 'Total',
                fontSize: 8,
                alignment: 'right',
                bold: true,
            },
        ];
        if (this.shipment.bags[0].gst_details.gst_tag == 'IGST') {
            columns.splice(4, 0, {
                text: 'IGST',
                fontSize: 9,
                alignment: 'right',
                bold: true,
            });
        } else {
            columns.splice(4, 0, {
                text: 'CGST',
                fontSize: 9,
                alignment: 'right',
                bold: true,
            });
            columns.splice(5, 0, {
                text: 'SGST',
                fontSize: 9,
                alignment: 'right',
                bold: true,
            });
        }
        return columns;
    }

    getInvoiceTableRows(bag) {
        let columns = [
            {
                width: '25%',
                stack: this.getProductDetails(bag),
                fontSize: 8,
                alignment: 'left',
            },
            {
                text: `₹${bag.prices.price_marked || 0}`,
                fontSize: 8,
                alignment: 'right',
            },
            {
                text: `₹${
                    this.shipment.is_not_fynd_source
                        ? bag.prices.price_marked -
                          bag.gst_details.brand_calculated_amount
                        : bag.prices.discount || 0
                }`,
                fontSize: 8,
                alignment: 'right',
            },
            {
                width: '16%',
                text: `₹${bag.prices.value_of_good || 0}`,
                fontSize: 8,
                alignment: 'right',
            },
        ];
        let brandCalculatedAmountColumn = {
            text: `₹${bag.gst_details.brand_calculated_amount || 0}`,
            fontSize: 8,
            alignment: 'right',
        };
        let gstColumns = [];
        if (this.shipment.bags[0].gst_details.gst_tag == 'IGST') {
            gstColumns = [
                [
                    {
                        text: `₹${this.toFixed(bag.gst_details.gst_fee, 2)}`,
                        fontSize: 8,
                        alignment: 'right',
                    },
                    {
                        text: `(${bag.gst_details.gst_tax_percentage}%)`,
                        fontSize: 8,
                        alignment: 'right',
                    },
                ],
            ];
        } else {
            let gst_tax_amount = bag.gst_details.gst_fee / 2.0;
            let gst_tag_percentage = bag.gst_details.gst_tax_percentage / 2.0;
            gstColumns = [
                [
                    {
                        text: `₹${this.toFixed(gst_tax_amount, 2)}`,
                        fontSize: 8,
                        alignment: 'right',
                    },
                    {
                        text: `(${gst_tag_percentage}%)`,
                        fontSize: 8,
                        alignment: 'right',
                    },
                ],
                [
                    {
                        text: `₹${this.toFixed(gst_tax_amount, 2)}`,
                        fontSize: 8,
                        alignment: 'right',
                    },
                    {
                        text: `(${gst_tag_percentage}%)`,
                        fontSize: 8,
                        alignment: 'right',
                    },
                ],
            ];
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
                    bold: true,
                },
                {
                    width: '50%',
                    text: `₹${this.shipment.prices.delivery_charge || 0.0}`,
                    fontSize: 10,
                    alignment: 'right',
                    bold: true,
                },
            ],
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
                        bold: true,
                    },
                    {
                        width: '50%',
                        // text: `₹${this.shipment.prices.coupon_value || 0.0}`,
                        text: `₹${
                            (this.shipment.coupon &&
                                this.shipment.coupon.value) ||
                            0.0
                        }`,
                        fontSize: 10,
                        alignment: 'right',
                        bold: true,
                    },
                ],
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
                bold: true,
            },
            {
                text: `${this.getIdentifiers(bag)}`,
                fontSize: 7,
                alignment: 'left',
            },
            {
                text: `HSN: ${bag.gst_details.hsn_code} | Bag Id: ${bag.id}`,
                fontSize: 7,
                alignment: 'left',
            },
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
            return ''; //todo
        }
        return identifier;
    }

    getNewInvoiceTable() {
        const headers = this.tableheaders();
        
        let pgTable = {
            style: 'tableExample',
            table: {
                dontBreakRows: true,
                headerRows: 1,
                widths: ["*", ...Array(headers.length - 1).fill("auto")],
                body: [headers],
            },
        };

        this.getTableProducts(pgTable);
        this.getTableFooters(pgTable);

        return pgTable;
    }

    tableheaders() {
        if (this.shipment.order.channel.name === 'FYND') {
            this.headers = this.headers.filter(
                (header) => header != 'Discount (Unit)'
            );
        }

        this.header_arr = this.headers.map((header) => ({
            text: header,
            style: 'tableHeader',
            alignment: 'center',
            bold: true,
            fontSize:4
        }));

        if (this.isGstinAvailable) {
            if (this.shipment.bags[0].financial_breakup[0].gst_tag === 'IGST') {
                this.header_arr.push({
                    text: 'IGST',
                    style: 'tableHeader',
                    alignment: 'center',
                    bold: true,
                    fontSize:4
                });
            } else {
                this.header_arr.push(
                    {
                        text: 'CGST',
                        style: 'tableHeader',
                        alignment: 'center',
                        bold: true,
                        fontSize:4
                    },
                    {
                        text: 'SGST',
                        style: 'tableHeader',
                        alignment: 'center',
                        bold: true,
                        fontSize:4
                    }
                );
            }
        }else{
            this.header_arr = this.header_arr.filter(
                (col) =>
                  ![
                    "HSN Code",
                    "Taxable Amount (Unit)",
                    "Total Taxable Amount",
                  ].includes(col.text)
              );
        }
        
        this.header_arr.push({
            text: 'Total',
            style: 'tableHeader',
            alignment: 'center',
            bold: true,
            fontSize:4
        });

        return this.header_arr;
    }

    getTableProducts(pgTable) {
        this.shipment.bags.forEach((bag) => {
            bag.financial_breakup.forEach((finObj) => {
                const data = this.header_arr.map((header) => {
                    if (header.text === 'Total Taxable Amount') {
                        const obj = {
                            text: `₹${finObj.value_of_good}`,
                            alignment: 'left',
                            fontSize:  4,
                        };

                        return obj;
                    } else if (header.text === 'MRP (Unit)') {
                        const obj = {
                            text: `₹${this.toFixed(
                                finObj.price_marked / finObj.total_units,
                                2
                            )}`,
                            alignment: 'left',
                            fontSize:  4,
                        };

                        return obj;
                    } else if (header.text === 'Taxable Amount (Unit)') {
                        const obj = {
                            text: `₹${this.toFixed(
                                finObj.value_of_good / finObj.total_units,
                                2
                            )}`,
                            alignment: 'left',
                            fontSize:  4,
                        };

                        return obj;
                    } else if (header.text === 'Total') {
                        const obj = {
                            text: `₹${finObj.brand_calculated_amount}`,
                            alignment: 'left',
                            fontSize:  4,
                        };

                        return obj;
                    } else if (['CGST', 'SGST'].includes(header.text)) {
                        const gst_percent = finObj.gst_tax_percentage / 2;
                        const gst_amt = Number(finObj.gst_fee) / 2;
                        const obj = {
                            text:
                                `₹${this.toFixed(gst_amt, 2)}` +
                                `\n(${this.toFixed(gst_percent, 2)}%)`,
                            alignment: 'left',
                            fontSize: 4,
                        };

                        return obj;
                    } else if (['IGST'].includes(header.text)) {
                        const obj = {
                            text:
                                `₹${Number(finObj.gst_fee)}` +
                                `\n(${finObj.gst_tax_percentage}%)`,
                            alignment: 'left',
                            fontSize:  4,
                        };

                        return obj;
                    } else if (header.text === 'Seller Identifier') {
                        let identifier = 0;
                        if (bag.article.seller_identifier) {
                            identifier = bag.article.seller_identifier;
                        } else {
                            if (finObj.identifiers.sku_code) {
                                identifier = finObj.identifiers.sku_code.slice(
                                    0,
                                    -3
                                );
                            } else {
                                const keys = Object.keys(finObj.identifiers);
                                identifier = finObj.identifiers[keys[0]];
                            }
                        }
                        const obj = {
                            text: identifier,
                            alignment: 'left',
                            fontSize:  4,
                        };

                        return obj;
                    } else if (
                        this.shipment.order.channel.name != 'FYND' &&
                        header.text === 'Discount (Unit)'
                    ) {
                        const obj = {
                            text: `₹${
                                this.shipment.is_not_fynd_source
                                    ? (
                                          finObj.price_marked -
                                          finObj.brand_calculated_amount
                                      ).toFixed(2)
                                    : finObj.discount || 0
                            }`,
                            alignment: 'left',
                            fontSize: 4,
                        };

                        return obj;
                    }

                    const obj = {
                        text: ['MRP (Unit)', 'Taxable Amount (Unit)'].includes(
                            header.text
                        )
                            ? `₹${finObj[this.keysMap[header.text]]}`
                            : finObj[this.keysMap[header.text]],
                        alignment: 'left',
                        fontSize: 4,
                    };

                    return obj;
                });

                pgTable.table.body.push(data);
            });
        });
    }

    getTableFooters(pgTable) {
        const totalColSpan = this.header_arr.length - 1;
        const emptyCols = Array(totalColSpan - 1).fill("");
        let total = [
            {
                text: 'Total',
                fontSize: 5,
                alignment: 'left',
                bold: true,
                colSpan: totalColSpan,
            },
            ...emptyCols,
            {
                text: `₹${Math.round(
                    this.shipment.gst.brand_calculated_amount
                )}`,
                fontSize: 5,
                alignment: 'left',
                bold: true,
            },
        ];

        const footers = [];

        footers.push([
            {
                text: 'Standard Delivery Charges',
                fontSize: 5,
                alignment: 'left',
                bold: true,
                colSpan: totalColSpan,
            },
            ...emptyCols,
            {
                text: `₹${
                    Math.round(this.shipment.prices.delivery_charge) || 0.0
                }`,
                fontSize: 5,
                alignment: 'left',
                bold: true,
            },
        ]);

        if (this.shipment.is_not_fynd_source && this.shipment.is_fynd_coupon) {
            footers.push([
                {
                    text: 'Fynd Discounts',
                    fontSize: 5,
                    alignment: 'left',
                    bold: true,
                    colSpan: totalColSpan,
                },
                ...emptyCols,
                {
                    // text: `₹${this.shipment.prices.coupon_value || 0.0}`,
                    text: `₹${
                        (this.shipment.coupon && this.shipment.coupon.value) ||
                        0.0
                    }`,
                    fontSize: 5,
                    alignment: 'left',
                    bold: true,
                },
            ]);
        }

        if (this.shipment.payments.mode === 'COD') {
            footers.push([
                {
                    text: 'COD charges',
                    fontSize: 5,
                    alignment: 'left',
                    bold: true,
                    colSpan: totalColSpan,
                },
                ...emptyCols,
                {
                    text: `₹${Math.round(this.shipment.prices.cod_charges)}`,
                    fontSize: 5,
                    alignment: 'left',
                    bold: true,
                },
            ]);

            const total_with_cod =
                (this.shipment.gst.brand_calculated_amount || 0.0) +
                this.shipment.prices.cod_charges +
                this.shipment.prices.delivery_charge;

            Object.assign(total[total.length - 1], {
                text: `₹${total_with_cod.toFixed(2)}`,
                fontSize: 5,
                alignment: 'left',
                bold: true,
            });
            footers.push(total);
        } else {
            footers.push(total);
        }
        pgTable.table.body.push(...footers);
    }
}
