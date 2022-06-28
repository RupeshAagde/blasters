import { getFullAddress } from '../common';
import * as JsBarcode from 'jsbarcode';
import moment from 'moment';
const { DOMImplementation, XMLSerializer } = require('xmldom');

export class LabelA4TemplateService {
  	constructor(shipment){
		this.shipment = shipment;
		this.image_url = null;
		this.shipment_image_url = null;
		this.absolute_footer_position = 650;
		this.barcodeWidth = null;
  	}

	getInvoiceTemplate() {
		if (!this.shipment.dp_details.awb_no) {
			return [];
		}
		this.image_url = this.textToBase64Barcode(this.shipment.dp_details.awb_no.toString());
		this.shipment_image_url = this.textToBase64Barcode(this.shipment.id.toString());
		try {
			let a4label = [
				this.getDeliveryPartner(),
				this.getAWBNoDetails(),
				this.getShipmentIdDetails(),
				this.getOrderIdDetails(),
				this.getShippingDetails(),
				this.getSellerDetails(),
				this.getItemDetails(),
				this.getReturnAddress(),
			];
			return Promise.all(a4label).then(data => {
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
                title: this.shipment.id + '_LABEL_A4',
            },
			content: content,
			styles: {
				header: {
					fontSize: 24,
					bold: true,
				},
				large: {
					fontSize: 16,
				},
				medium: {
					fontSize: 12,
				},
			},
			defaultStyle: {
				columnGap: 5,
				font: "Montserrat",
			},
			pageMargins: [200, 30, 200, 30],
			pageSize: "A3",
		};
		return pdfmake_description;
	}

	getDeliveryPartner() {
		let pgTable = {
			style: "tableExample",
			table: {
				widths: ["*", "*"],
				heights: 60,
				margin: [0, 0, 0, 0],
				body: [
					[
						{
							text: `${this.shipment.ordering_channel}`,
							style: "tableHeader",
							alignment: "center",
							bold: true,
							fontSize: 15,
							margin: [10, 20, 10, 10],
						},
						{
							text: `${this.shipment.dp_details.name.toUpperCase()}`,
							style: "tableHeader",
							alignment: "center",
							bold: true,
							fontSize: 15,
							margin: [10, 20, 10, 10],
						},
					],
				],
			},
		};
		return pgTable;
	}

	getAWBNoDetails() {
		let pgTable = {
			style: "tableExample",
			layout: this.getTableLayout(),
			table: {
				widths: ["*"],
				margin: [0, 0, 0, 0],
				body: [
					[
						[
							this.getAWBNo(),
							this.getAWBNoBarcode(),
							this.getDeliveryDetails(),
						],
					],
				],
			},
		};
		return pgTable;
	}

	getAWBNo() {
		return {
			text: `AWB No : ${this.shipment.dp_details.awb_no}`,
			fontSize: 12,
			alignment: "center",
			margin: [2, 4, 2, 2],
			bold: true,
		};
	}
	
	getAWBNoBarcode() {
		return {
			layout: "noBorders",
			table: { body: this.getAWBBarcode() },
			alignment: "center",
			margin: [90, 0, 80, 4],
		};
	}

	getDeliveryDetails() {
		return {
			alignment: "justify",
			layout: "noBorders",
			columns: [
				[
					{
						columns: [
							{
								text: `${this.shipment.order.delivery_address.pincode}`,
								margin: [8, 0, 0, 0],
								fontSize: 20,
							},
						],
					},
				],
				{
					text: `${this.shipment.order.delivery_address.city}`,
					alignment: "right",
					margin: [0, 0, 10, 0],
					fontSize: 20,
				},
			],
		};
	}

	getShipmentIdDetails() {
		let pgTable = {
			style: "tableExample",
			table: {
				widths: ["*"],
				margin: [0, 0, 0, 0],
				body: [[[this.getShipmentId(), this.getShipmentIdBarcode()]]],
			},
		};
		return pgTable;
	}

	getShipmentId() {
		return {
			text: `Shipment ID : ${this.shipment.id}`,
			fontSize: 12,
			alignment: "center",
			margin: [2, 6, 2, 0],
			bold: true,
		};
	}

	getShipmentIdBarcode() {
		return {
			layout: "noBorders",
			table: { body: this.getShipmentBarcode() },
			alignment: "center",
			margin: [90, 0, 80, 2],
		};
	}

	getOrderIdDetails() {
		// need to check for captial case
		if(this.shipment.affiliate_details.company_affiliate_tag !== "FLIPKARTASSURED") {
			return {}
		}
	
		let pgTable = {
			style: "tableExample",
			layout : { hLineWidth: function (i) {return (i === 0) ? 0 : 1}},
			table: {
				widths: ["*"],
				margin: [0, 0, 0, 0],
				body: [[this.getDetails()]],
			},
		};
		return pgTable;
	}

	getDetails() {
		return {
			alignment: "justify",
			columnGap: 15,
			margin: [25, 4, 0, 4],
			columns: [
				{
					text: `Flipkart Order ID : ${this.shipment.affiliate_details.channel_order_id}`,
					fontSize: 8,
					alignment: "center",
					bold: true,
				},
				{
					text: `Flipkart Bag ID : ${this.shipment.affiliate_details.channel_bag_id}`,
					fontSize: 8,
					alignment: "center",
					bold: true,
				}
			],
		};
	}

	getShippingDetails() {
		let pgTable = {
		  style: "tableExample",
		  layout: this.getTableLayout(),
		  table: {
			widths: [243, 180],
			margin: [0, 0, 0, 0],
			body: [
			  [
				[
					{
						text: `Shipping Address`,
						bold: true,
						fontSize: 11,
						margin: [8, 4, 0, 2],
					},
					{
						text: `${this.shipment.order.delivery_address.name} `,
						fontSize: 11,
						margin: [8, 2, 0, 2],
					},
					{
						text:`${getFullAddress(this.shipment.order.delivery_address)}`,
						fontSize: 11,
						margin: [8, 2, 0, 0],
						lineHeight: 1.25,
					},
				],
				[
					{
						text: `${this.shipment.invoice.payment_type} `,
						alignment: "center",
						bold: true,
						fontSize: 12,
						margin: [0, 10, 0, 8],
					},
				  	this.getLineBreak(),
					{
						text:
						`Amount to be collected` +
						`\n₹${this.shipment.invoice.amount_to_collect}`,
						alignment: "center",
						bold: true,
						fontSize: 12,
						margin: [0, 6, 0, 0],
					},
				  	this.getLineBreak(),
					{
						text: `Total Items : ${this.shipment.total_shipment_bags} `,
						alignment: "center",
						bold: true,
						fontSize: 12,
						margin: [0, 10, 0, 8],
					},
				],
			  ],
			],
		  },
		};
	return pgTable;
	}
	
	getSellerDetails() {
		let pgTable = {
			style: "tableExample",
			table: {
				widths: [243, 180],
				margin: [0, 0, 0, 0],
				body: [
					[
						[
							{
								text: `Seller Details`,
								bold: true,
								fontSize: 11,
								margin: [8, 4, 0, 0],
							},
							{
								text: `${this.shipment.fulfilling_store.name} `,
								fontSize: 11,
								margin: [8, 2, 0, 0],
							},
							{
								text: `GSTIN : ${this.shipment.fulfilling_store.meta.gst_number} `,
								fontSize: 11,
								margin: [8, 2, 0, 0],
							},
							{
								text: `${this.shipment.fulfilling_store.address1}`,
								fontSize: 11,
								margin: [8, 2, 0, 2],
							},
						],
						[
							[
								{
								text: `Invoice No`,
								alignment: "center",
								bold: true,
								fontSize: 11,
								margin: [0, 10, 0, 0],
								},
								{
								text: `${this.shipment.invoice.store_invoice_id}`,
								alignment: "center",
								fontSize: 11,
								margin: [0, 2, 0, 0],
								},
							],	
							[
								{
								text: `Invoice Date`,
								alignment: "center",
								bold: true,
								fontSize: 11,
								margin: [0, 10, 0, 0],
								},
								{
								text: moment(
									this.shipment.affiliate_details.shipment_meta.store_invoice_updated_date
								).format("DD/MM/YYYY"),
								alignment: "center",
								fontSize: 11,
								margin: [0, 2, 0, 0],
								},
							],
						],
					],
				],
			},
		};
	return pgTable;
	}

	getItemDetails() {
		let pgTable = {
			style: "tableExample",
			layout: this.getTableLayout(),
			table: {
				widths: [243, 180],
				margin: [0, 0, 0, 0],
				body: [
					[
						[
							{
								text: `Item Type`,
								bold: true,
								fontSize: 11,
								margin: [8, 6, 0, 0],
							},
							{
								text: this.getItemType(),
								fontSize: 11,
								margin: [8, 5, 0, 5],
							},
						],
						[
						// {
						//   alignment: "center",
						//   margin: [0, 6, 60, 0],
						//   stack: [
						//     this.getUpiQrCode()
						//   ],
						// },
						// this.getUpiQrTitle()
						],
					],
				],
			},
		};
	return pgTable;
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

	getReturnAddress() {
		let pgTable = {
			style: "tableExample",
			table: {
				widths: ["*"],
				margin: [0, 0, 0, 0],
				body: [
				[
					[
						{
							text: `Return Address`,
							fontSize: 11,
							margin: [8, 6, 0, 0],
							bold: true,
						},
						{
							text: `${getFullAddress(this.shipment.invoice.rto_address)}`,
							fontSize: 11,
							margin: [8, 2, 0, 6],
						},
					],
				],
				],
			},
		};
	return pgTable;
	}

	getItemType() {
		let itemType = [];
		this.shipment.bags.forEach((bag) => {
		  itemType.push(bag.item.l3_category_name);
		});
	return Array.from(new Set(itemType)).join();
	}
	
	getTableLayout() {
		return {
		  vLineWidth: function () {
			return 1;
		  },
		  hLineColor: function () {
			return "white";
		  },
		};
	}
	
	getLineBreak() {
		return {
			canvas: [
				{
					type: "line",
					x1: -5,
					y1: 7,
					x2: 185,
					y2: 7,
					lineWidth: 0.25,
					lineColor: "#000000",
				},
			],
		};
	}
	
	getAWBBarcode() {
		const content = [[{ svg: this.image_url, width: 250, height: 95 }]];
	
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
	
	getShipmentBarcode() {
		const content = [[{ svg: this.shipment_image_url, width: 250, height: 95 }]];
		return content;
	}
	
	getDpSortCode() {
		const dpSortCode = this.shipment.affiliate_details.shipment_meta && this.shipment.affiliate_details.shipment_meta.sort_code ?this.shipment.affiliate_details.shipment_meta.sort_code : "";
;
		return dpSortCode ? `${dpSortCode}` : "";
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
			font: "Helvetica",
			width: 3,
			fontSize: 20,
			margin: 0,
			fontOptions: "bold",
			xmlDocument: document,
		});

		this.barcodeWidth = svg&& svg.width && svg.width.baseVal && svg.width.baseVal.value ? svg.width.baseVal.value : 0;
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
}