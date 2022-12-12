import { getFullAddress, getBase64DataURL } from '../common';
import * as JsBarcode from 'jsbarcode';
import moment from 'moment';
const { DOMImplementation, XMLSerializer } = require('@xmldom/xmldom');

export class LabelPosTemplateService {

  constructor(shipment) {
	this.mask_number = true;
    this.shipment = shipment;
    this.image_url = null;
    this.shipment_image_url = null;
    this.absolute_footer_position = 650;
    this.isGstinAvailable = !!(this.shipment.gst &&this.shipment.gst.gstin_code);
    this.pageSizeWidth = 3 * 72
    this.pageLeftRightMargin = 24
  }

  getInvoiceTemplate() {
    if (!this.shipment.dp_details.awb_no) {
      return [];
    }
    this.image_url = this.textToBase64Barcode(
      this.shipment.dp_details.awb_no.toString(), 2
    );
    this.shipment_image_url = this.textToBase64Barcode(
      this.shipment.id.toString() , 1
    );
    try {
      let poslabel = [
        this.getLabelHeader(),
        this.getUserInfo(),
        this.getLineBreak(),
        this.getSellerInfo(),
        this.getLineBreak(),
        this.getItemDetails(),
        this.getFooterImage(),
      ];
      return Promise.all(poslabel).then(data => {
		return this.getBaseTemplate(data);
	  });
    } catch (err) {
      console.log(err);
      console.error(
        `Error occurred in template for shipment id: ${this.shipment.id}`
      );
      return [];
    }
  }

  getBaseTemplate(content){
    let pdfmake_description = {
		info: {
			title: this.shipment.id + '_LABEL_POS',
		},
		content,
		styles: {
			header: {
				fontSize: 18,
				bold: true,
			},
			large: {
				fontSize: 13,
			},
			medium: {
				fontSize: 10,
			},
		},
		defaultStyle: {
			columnGap: 20,
			font: "Montserrat",
		},
		pageMargins: [12, 16, 12, 8],
		pageSize: {
			width: this.pageSizeWidth,
			height: 13.5 * 72,
		},
	};
	return pdfmake_description;
  };

  getLabelHeader() {
    return {
      stack: [
        {
          text: `${this.isGstinAvailable ? "Shipping" : ""} Label`,
          style: "header",
        },
        {
          stack: [
            `${
				this.shipment.ordering_channel
            } | ${this.shipment.dp_details.name.toUpperCase()}`,
            `AWB: ${this.shipment.dp_details.awb_no}`,
          ],
          fontSize: 11,
          margin: [0, 6],
          bold: true,
        },
        {
          margin: [0, 8, 0, 8],
          columns: this.getBarcodeAndSortCodeTable(),
        },
        this.getSortCode(),
        this.getDeliveryDetails(),
        this.getLineBreak(),
        this.getShipmentIdDetails(),
        {
          text: `Amount to be collected: ₹${this.shipment.invoice.amount_to_collect}`,
          fontSize: 11,
          bold: true,
          margin: [0, 4, 0, 0],
        },
        {
          text: `Invoice ID: ${this.shipment.invoice.store_invoice_id} | ${
            this.shipment.invoice.payment_type
          } | ${moment(this.shipment.affiliate_details.shipment_meta.store_invoice_updated_date).format(
            "DD/MM/YYYY"
          )}`,
          fontSize: 8,
          margin: [0, 0, 0, 3],
        },
        {
          text: `Total Items : ${this.shipment.total_shipment_bags} `,
          fontSize: 8,
          margin: [0, 0, 0, 3],
        },
      ],
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

  getShipmentIdDetails() {
    return {
      stack: [

        {
          stack: [
            `Shipment: ${this.shipment.id}`,
          ],
          fontSize: 11,
          margin: [0, 6],
          bold: true,
        },
        {
          margin: [0, 4],
          columns: this.getShipmentIdBarcode(),
        },
      ],
    };
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

  getShipmentIdBarcode() {
    const table = { body: [[{ svg: this.shipment_image_url , height: 100}]] };
    return [
      { text: "", width: "*" },
      {
        width: "auto",
        layout: "noBorders",
        table,
      },
      { text: "", width: "*" },
    ];
  }

  getDpSortCode() {
	const dpSortCode = this.shipment.affiliate_details.shipment_meta && this.shipment.affiliate_details.shipment_meta.sort_code ? this.shipment.affiliate_details.shipment_meta.sort_code:"";
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
        text: "DELIVERY ADDRESS",
        fontSize: 11,
        bold: true,
        margin: [0, 3, 0, 2],
      },
      {
        text: `${name} | Mobile: ${phone}`,
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 3],
      },
      {
        text: `${getFullAddress(this.shipment.order.delivery_address)}`,
        fontSize: 10,
        margin: [0, 0, 0, 3],
        lineHeight: 1,
      },
    ];
  }

  getSellerInfo() {
    return {
      alignment: "justify",
      stack: [
        {
          margin: [0, 8, 0, 0],
          text: "Sold By",
          bold: true,
          fontSize: 10,
        },
        {
          text: `${this.shipment.company.company_name}`,
          fontSize: 9,
          margin: [0, 4, 5, 0],
        },
        {
          text: `C/o ${getFullAddress(this.shipment.fulfilling_store)}`,
          fontSize: 9,
          lineHeight: 1,
          margin: [0, 3, 5, 0],
        },
        this.getGstinInfo(),
        {
          text: "Return To",
          bold: true,
          fontSize: 10,
          margin: [0, 8, 0, 0],
        },
        {
          text: `${getFullAddress(this.shipment.invoice.rto_address)}`,
          fontSize: 9,
          margin: [0, 4, 0, 0],
          lineHeight: 1,
        },
      ],
    };
  }

  getGstinInfo() {
    if (this.isGstinAvailable) {
      return {
        text: `GSTIN: ${this.shipment.gst.gstin_code}`,
        bold: true,
        fontSize: 9,
        margin: [0, 3, 0, 0],
      };
    }

    return {};
  }

  getFooterImage() {
	return Promise.all([
		getBase64DataURL(this.shipment.brand.logo),
	]).then((data) => {
		if(data){
			let obj = {
				alignment: "justify",
				margin: [0, 24, 0, 0],
				columns: [
					[
						{
							columns: [
								{
									image: data[0],
									alignment: "left",
									width: 60,
								},
							],
						},
					],
					// this.getUPIData(),
      			],
			}
			return obj
		}else{
			return {};
		}
	})
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

  getDeliveryDetails() {
    return {
      alignment: "justify",
      margin: [0, 6, 0, 0],
      columns: [
        [
          {
            columns: [
              {
                text: `${this.shipment.order.delivery_address.pincode}`,
                alignment: "left",
              },
            ],
          },
        ],
        {
          text: `${this.shipment.order.delivery_address.city}`,
          alignment: "right",
        },
      ],
    };
  }

  getLineBreak() {
    return {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 7,
          x2: 3 * 72 - 2 * 12,
          y2: 7,
          lineWidth: 0.25,
          lineColor: "#cccccc",
        },
      ],
    };
  }

  textToBase64Barcode(text, width) {
    const xmlSerializer = new XMLSerializer();
	const document = new DOMImplementation().createDocument(
		'http://www.w3.org/1999/xhtml',
		'html',
		null
	);
	let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svg, text, {
      font: "Helvetica",
      width: width,
      fontSize: 12,
      margin: 0,
      fontOptions: "bold",
      xmlDocument: document,
    });

    this.barcodeWidth = svg&& svg.width && svg.width.baseVal && svg.width.baseVal.value ? svg.width.baseVal.value : 0;
    svg.setAttribute("width", (this.pageSizeWidth - this.pageLeftRightMargin).toString());
    return xmlSerializer.serializeToString(svg);
  }

  toFixed(value, n) {
    const v = value.toString().split(".");
    if (n <= 0) return v[0];
    let f = v[1] || "";
    if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
    while (f.length < n) f += "0";
    return `${v[0]}.${f}`;
  }

  getUpiQrCode() {
    if (this.shipment.payment_mode !== "COD") {
      return {};
    }

    let gstBrkUp;
    if (this.shipment.gst_details.gst_tag == "IGST") {
      gstBrkUp = `GST:${this.shipment.gst_details.gst_fee}|IGST:${this.shipment.gst_details.gst_fee}`;
    } else {
      gstBrkUp = `GST:${this.shipment.gst_details.gst_fee}|CGST:${this.toFixed(
        this.shipment.gst_details.gst_fee / 2.0,
        2
      )}|SGST:${this.toFixed(this.shipment.gst_details.gst_fee / 2.0, 2)}`;
    }

    const upiURI = new URL("upi://pay");
    upiURI.searchParams.append("pa", "fynd.rzp@hdfcbank");
    upiURI.searchParams.append("pn", "Fynd");
    upiURI.searchParams.append(
      "tn",
      `Payment for Order ${this.shipment.order.fynd_order_id}`
    );
    upiURI.searchParams.append(
      "invoiceNo",
      this.shipment.invoice.store_invoice_id
    );
    upiURI.searchParams.append(
      "invoiceDate",
      this.shipment.meta.store_invoice_updated_date
    );
    upiURI.searchParams.append("gstIn", this.shipment.gst_details && this.shipment.gst_details.gstin_code ? this.shipment.gst_details.gstin_code : "");
    upiURI.searchParams.append("gstBrkUp", gstBrkUp);
    upiURI.searchParams.append(
      "am",
      `${
        (this.shipment.gst_details.brand_calculated_amount || 0.0) +
        this.shipment.prices.cod_charges
      }`
    );
    upiURI.searchParams.append("cu", "INR");

    return {
      qr: upiURI.toString(),
      alignment: "right",
      fit: 75,
    };
  }

  getItemDetails() {
    return {
      alignment: "justify",
      stack: [
        {
          margin: [0, 8, 0, 0],
          text: "Item Details",
          bold: true,
          fontSize: 10,
        },
        {
          text: this.getItemType(),
          fontSize: 9,
          margin: [0, 4, 5, 0],
        },
      ],
    };
  }

  getItemType() {
    let itemType = [];
    this.shipment.bags.forEach((bag) => {
      itemType.push(bag.item.l3_category_name);
    });
    return Array.from(new Set(itemType)).join();
  }

}