<template>
    <div>
        <loader v-if="inProgress" class="loading"></loader>
        <nitrozen-dialog
            ref="invoicePreview"
            class="invoice-preview"
            :title="`${selectedType === 'label' ? 'Label' : 'Invoice'}: ${shipment ? shipment.id : ''}`"
        >
            <template slot="body">
                <div
                    class="invoicePreviewIframeContainer"
                    :id="`invoicePreviewIframeContainer-${shipment ? shipment.id : ''}`"
                ></div>
                 
            </template>
        </nitrozen-dialog>
        <!-- Invoice -->
        <div class="menu">
            <div class="menu-header">{{toggleMenu}}</div>
            <ul 
                class="invoice-menu"
                :title="toggleMenu"
            >
                <li class="menu-item" v-for="key in typeKeys" :key="key">
                    {{ mappingType[key] }}
                    <span class="item-icons">
                        <!-- <span 
                            @click="getDocumentURL(toggleMenu + '_a4','view',$event)"
                            :title="`Preview ${toggleMenu}`"
                        >
                            <adm-inline-svg src="eye-open"></adm-inline-svg>
                        </span> -->
                        <span 
                            class="download-invoice-label"
                             @click="getDocumentURL(key,'download')"
                            :title="`Download ${toggleMenu}`"
                        >
                            <ukt-inline-svg src="download"></ukt-inline-svg>
                        </span>
                    </span>
                </li>
                <!-- <li class="menu-item">
                    A6
                    <span class="item-icons"> -->
                        <!-- <span 
                            @click="printInvoice('a6', toggleMenu,'',$event)"
                            :title="`Preview ${toggleMenu}`"
                        >
                            <adm-inline-svg src="eye-open"></adm-inline-svg>
                        </span> -->
                        <!-- <span 
                            @click="getDocumentURL(toggleMenu + '_a6','download')"
                            :title="`Download ${toggleMenu}`"
                        >
                            <ukt-inline-svg src="download"></ukt-inline-svg>
                        </span>
                    </span>
                </li> -->
                <!-- <li class="menu-item">
                    POS
                    <span class="item-icons"> -->
                        <!-- <span 
                            @click="printInvoice('pos', toggleMenu,'',$event)"
                            :title="`Preview ${toggleMenu}`"
                        >
                            <adm-inline-svg src="eye-open"></adm-inline-svg>
                        </span> -->
                        <!-- <span 
                            @click="getDocumentURL(toggleMenu + '_pos','download')"
                            :title="`Download ${toggleMenu}`"
                        >
                            <ukt-inline-svg src="download"></ukt-inline-svg>
                        </span>
                    </span>
                </li> -->
            </ul>
        </div>
    </div>
                              
</template>

<script>
/* Package imports */
import {
    NitrozenDialog,
} from '@gofynd/nitrozen-vue';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import loader from '@/components/common/loader.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AdmInlineSvg from '@/components/common/inline-svg.vue';
import MirageAlert from '@/components/alert/index.vue';

/* Helper imports */
import { downloadFile } from '@/helper/utils';

/* Service imports */
import GrindorService from '@/services/grindor.service';


export default {
    name: "invoice-label-menu",
    props: {
        toggleMenu: {
            type: String,
            required: true,
        },
        shipment: {
            type: Object,
            required: true,
        },
        viewType: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data() {
        return {
            inProgress: false,
            selectedInvoicePageOption: '',
            selectedType: '',
            shipmentInvoicePageOptions:[
                {text:'A4, Portrait (297 x 210 mm)',value:'a4'},
                {text:'A6, Portrait (105 × 148 mm)',value:'a6'},
                {text:'POS, Portrait (80 x 60 mm)',value:'pos'}
            ],
            invoiceMapping: {
                invoice_a4:"A4",
                invoice_a6:"A6",
                invoice_pos:"POS",
                invoice:"A4",
                delivery_challan_a4:"DC"
            },
            labelMapping: {
                label_a4:"A4",
                label_a6:"A6",
                label_pos:"POS",
                label:"A4",
                parent_child_label:"A4"
            },
            companyId: this.$route.params.company_id,
            document_url:{}
        }
    },
    components: {
        loader,
        MirageAlert,
        UktInlineSvg,
        AdmInlineSvg,
        NitrozenDialog,
    },
    computed: {
        typeKeys() {
            if(this.toggleMenu == 'label') {
                return Object.keys(this.labelMapping).filter(k => this.shipment.affiliate_details && this.shipment.affiliate_details.pdf_links[k] )
            }else{
                return Object.keys(this.invoiceMapping).filter(k => this.shipment.affiliate_details && this.shipment.affiliate_details.pdf_links[k] )
            }
        },
        mappingType(){
            return this.toggleMenu == 'label' ? this.labelMapping : this.invoiceMapping
        }
    },
    methods: {
        /**
         * Method to get the source file from the API for downloading
         * 
         * @author: Rushabh Mulraj Shah
         * @param {String} signedUrl The signed URL for downloading
         * @param {String} type The type of the file
         */
        downloadSourceFile(signedUrl, type) {
            try {
                this.$snackbar.global.showInfo(`Your download will begin shortly`);
                const urlObj = new URL(signedUrl);
                fetch(urlObj.href)
                .then(res => res.blob())
                .then(blob => {
                    let link = document.createElement('a');
                    let url = window.URL.createObjectURL(blob);
                    link.href = url;
                    link.download = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/')+1);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    this.$emit('downloadSuccess')
                    setTimeout(() => {
                        this.$snackbar.global.showSuccess(`Your ${type} has been successfully downloaded`, 3000);
                    }, 1000);
                }).catch((err)=> {
                    this.$snackbar.global.showError(`Failed to download consent ${type}`)
                    console.log(`Failed to download ${type}`, err)
                });
            }
            catch(error) {
                console.error(`Error in downloading the ${type} file:   `, error);
                this.$snackbar.global.showError(
                    `Unable to download the ${type} file. Please try again after some time.`,
                    3000
                )
            }
        },

        /**
         * Method to fetch the public URL from the private URL
         * 
         * @author: Rushabh Mulraj Shah
         * @param {String} doc_type The type of document
         * @returns Response of the request or error message
         */
        fetchDocumentURL(doc_type) {
            let affiliateURL = null;
            if(
                !isEmpty(this.shipment) &&
                this.shipment.affiliate_details &&
                this.shipment.affiliate_details.pdf_links &&
                this.shipment.affiliate_details.pdf_links[doc_type]
            ) affiliateURL = this.shipment.affiliate_details.pdf_links[doc_type];

            let type = '';
            if(doc_type.toLowerCase().includes('invoice')) type = 'invoice';
            else if(doc_type.toLowerCase().includes('label')) type = 'label';
            else type = this.toggleMenu;

            if(affiliateURL) {
                return GrindorService.getPublicUrl({
                    expiry: 300,
                    urls: [affiliateURL]
                })
                .then(res => {
                    if(res && res.status == 200 && res.data && res.data.urls[0] && res.data.urls[0].signed_url) {
                        this.downloadSourceFile(res.data.urls[0].signed_url, type);
                    }
                })
                .catch(error => {
                    this.$snackbar.global.showError(`Unable to download your file`);
                    console.error("Error in downloading the file:   ", error);
                })
            } else {
                this.$snackbar.global.showInfo(
                    'Your invoice is currently being generated. Please try again after a few minutes.',
                    2500
                );
                console.error('The link for downloading this PDF is not provided by the API:   ', this.shipment);
                throw 'Link not available from the back-end';
            }
        },

        getDocumentURL(doc_type, get_type, event){
            if(event){
                event.stopPropagation();
            }

            this.selectedType = doc_type;

            /**
             * Code to handle merged type, if it exists
             * in the future.
             */
            let type = doc_type.split('_');
            if(type[0] === 'invoice and label') {
                getDocumentURL(`invoice_${type[1]}`, get_type, event);
                setTimeOut(() => {
                    getDocumentURL(`label_${type[1]}`, get_type, event);
                }, 700);
            }

            this.fetchDocumentURL(doc_type)
            .then((doc_url)=> {
                if(get_type=="view") {
                    fetch(doc_url,{mode:'no-cors'})
                        .then(file_blob=>file_blob.blob())
                        .then((file_blob) =>{
                            //file_blob = file_blob.blob();
                            let b64 = `data:application/pdf;base64,${file_blob}`;
                            let url_f  = window.URL.createObjectURL(file_blob);
                            //const file_url = new window.FileReader().readAsDataURL(file_blob);
                            const targetElement = document.querySelector('#invoicePreviewIframeContainer-' +this.shipment.id);
                            const iframe = document.createElement('iframe');
                            iframe.src = url_f;
                            // iframe.type='application/pdf';
                            targetElement.innerHTML = '';
                            targetElement.appendChild(iframe);
                            this.$refs.invoicePreview.open({
                                width: '80%',
                                height: '90%',
                                showCloseButton: true,
                            });
                        })
                }else{
                    if(doc_url){
                        downloadFile(doc_url,`${get_type}.pdf`)
                    }
                }   
            })
            .catch(() => {
                console.error("File could not be downloaded");
            })
        },


        // Old commented code
        // printInvoice(status, type, viewOption,event) {
        //     if(event){
        //         event.stopPropagation();
        //     }
        //     this.selectedInvoicePageOption = status;
        //     this.selectedType = type;
        //     if (this.shipment.is_affiliate) {
        //         if (this.shipment.affiliate_details.pdf_links.invoice) {
        //             window.open(
        //                 this.shipment.affiliate_details.pdf_links.invoice,
        //                 '_blank'
        //             );
        //         } else {
        //             this.$snackbar.global.showInfo(
        //                 'Invoice is not available for this shipment'
        //             );
        //         }
        //     } else if (status == 'a4') {
        //         this.generatePdf('a4', type, viewOption);
        //     } else if (status == 'a6') {
        //         this.generatePdf('a6', type, viewOption);
        //     } else if (status == 'pos') {
        //         this.generatePdf('pos', type, viewOption);
        //     }

        //     //google analytics events
        //     let gaEvents = {
        //         "label": "LABEL_DOWNLOADED",
        //         "invoice": "INVOICE_DOWNLOADED"
        //     }
        //     let properties = {
        //         paper_size: status,
        //         shipment_ids: `${this.shipment.id}`,
        //         action: viewOption === 'download' ? 'download' : 'preview',
        //         source: this.viewType ? 'quick_view' : 'order_details_view'
        //     }
        //     eventHelper.invoiceLableDownload(EVENTS[gaEvents[type]], getUserInfo(this.userinfo, this.accessDetail), properties)
        // },
        // generatePdf(status, type, viewOption) {
        //     // if (!this.firstBag.current_status.delivery_awb_number) {
        //     //     this.$snackbar.global.showInfo(
        //     //         'AWB no is not generated for this shipment yet'
        //     //     );
        //     //     return;
        //     // }
        //     if (!this.shipment.dp_details.awb_no) {
        //         this.$snackbar.global.showInfo(
        //             'AWB no is not generated for this shipment yet'
        //         );
        //         return;
        //     }
        //     this.inProgress = true;
        //     let invoiceTemplate;
        //     if(type === 'label'){
        //         switch (status) {
        //             case 'a4':
        //                 invoiceTemplate = new LabelA4TemplateService(
        //                     this.shipment
        //                 );
        //                 break;
        //             case 'a6':
        //                 invoiceTemplate = new LabelA6TemplateService(
        //                     this.shipment
        //                 );
        //                 break;
        //             case 'pos':
        //                 invoiceTemplate = new LabelPosTemplateService(
        //                     this.shipment
        //                 );
        //                 break;
        //             default:
        //                 return;
        //         }
        //     }else{
        //         switch (status) {
        //             case 'a4':
        //                 invoiceTemplate = new InvoiceA4TemplateService(
        //                     this.shipment
        //                 );
        //                 break;
        //             case 'a6':
        //                 invoiceTemplate = new InvoiceA6TemplateService(
        //                     this.shipment
        //                 );
        //                 break;
        //             case 'pos':
        //                 invoiceTemplate = new InvoicePosTemplateService(
        //                     this.shipment
        //                 );
        //                 break;
        //             default:
        //                 return;
        //         }
        //     }
            
        //     invoiceTemplate
        //         .getInvoiceTemplate()
        //         .then((template) => {
        //             let pdfGenerator = new PdfGeneratorService();
        //             pdfGenerator.then((res) => {
        //                 if( viewOption == "download" ){
        //                     res.download(
        //                         template,
        //                         `${this.shipment.id}_${this.selectedInvoicePageOption}`
        //                     );
        //                 }
        //                 else {
        //                     res.getDataUrl(template).then((dataUrl) => {
        //                         const targetElement = document.querySelector(
        //                             '#invoicePreviewIframeContainer-' +
        //                                 this.shipment.id
        //                         );
        //                         const iframe = document.createElement('iframe');
        //                         iframe.src = dataUrl;
        //                         targetElement.innerHTML = '';
        //                         targetElement.appendChild(iframe);
        //                         this.inProgress = false;
        //                         this.$refs.invoicePreview.open({
        //                             width: '80%',
        //                             height: '90%',
        //                             showCloseButton: true,
        //                         });
        //                     });
        //                 }
        //             });
        //         })
        //         .finally(() => {
        //             this.inProgress = false;
        //         });
        // },
        // fetchDocumentURL(doc_type){
        //     let presigned_url = '';
        //     const params = {
        //         entity_id:this.shipment.shipment_id,
        //         document_type:doc_type
        //     }
        //     return OrderService.generatePresignedURL(params)
        //         .then(({data})=>{
        //             this.document_url[doc_type]= data;
        //             presigned_url = data.url;
        //             return presigned_url;   
        //         }).catch(err => {
        //             this.$snackbar.global.showError(
        //                 'Invoice is not available for this shipment currently'
        //             );
        //         })
        // }
    },
}
</script>

<style lang="less" scoped>
.menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    //width: 120px; temp
        width: 90px;
    left: -20px;
    top: calc(100% + .25rem);
    background-color: white;
    padding: 5px;
    border-radius: .25rem;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    z-index: 1;
    
     .menu-header{
        padding: 8px 0px;
        font-size: 15px;
        font-weight: 500;
        text-transform: capitalize;
    }
}
.invoice-menu {
    display: flex;
    flex-direction: column;

    .menu-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 5px;
        font-size: 13px;
        cursor: default;

        .item-icons {
            // padding-top: 3px;
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            &:hover {
                ::v-deep svg {
                    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
                    #prefix__Eye_Open {
                        stroke: @RoyalBlue;
                    }
                }
            }
            ::v-deep svg {
                width: 16px;
                height: 16px;
                #prefix__Eye_Open {
                    stroke: @Mako;
                }
            }
        }
    }
}

.invoice-preview {
    ::v-deep svg {
        width: 14px;
        height: 14px;
        cursor: pointer;
    }
    ::v-deep .invoicePreviewIframeContainer {
        width: 100%;
        height: 100%;
        iframe {
            width: 100%;
            height: 100%;

            .mirage-scrollbar;
        }
    }
}
</style>
