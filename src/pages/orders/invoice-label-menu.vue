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
                    :id="`invoicePreviewIframeContainer-${this.shipment.id}`"
                ></div>
                 
            </template>
        </nitrozen-dialog>
        <!-- Invoice -->
        <div class="menu">
            <h3>{{toggleMenu}}</h3>
            <ul 
                class="invoice-menu"
                :title="toggleMenu"
            >
                <li class="menu-item">
                    A4
                    <span class="item-icons">
                        <span 
                            @click="printInvoice('a4', toggleMenu,'',$event)"
                            :title="`Preview ${toggleMenu}`"
                            class="preview-a4"
                        >
                            <adm-inline-svg src="eye-open"></adm-inline-svg>
                        </span>
                        <span 
                            @click="printInvoice('a4', toggleMenu, 'download')"
                            :title="`Download ${toggleMenu}`"
                            class="download-a4"
                        >
                            <ukt-inline-svg src="download"></ukt-inline-svg>
                        </span>
                    </span>
                </li>
                <li class="menu-item">
                    A6
                    <span class="item-icons">
                        <span 
                            @click="printInvoice('a6', toggleMenu,'',$event)"
                            :title="`Preview ${toggleMenu}`"
                            class="preview-a6"
                        >
                            <adm-inline-svg src="eye-open"></adm-inline-svg>
                        </span>
                        <span 
                            @click="printInvoice('a6', toggleMenu, 'download')"
                            :title="`Download ${toggleMenu}`"
                            class="download-a6"
                        >
                            <ukt-inline-svg src="download"></ukt-inline-svg>
                        </span>
                    </span>
                </li>
                <li class="menu-item">
                    POS
                    <span class="item-icons">
                        <span 
                            @click="printInvoice('pos', toggleMenu,'',$event)"
                            :title="`Preview ${toggleMenu}`"
                            class="preview-pos"
                        >
                            <adm-inline-svg src="eye-open"></adm-inline-svg>
                        </span>
                        <span 
                            @click="printInvoice('pos', toggleMenu, 'download')"
                            :title="`Download ${toggleMenu}`"
                            class="download-pos"
                        >
                            <ukt-inline-svg src="download"></ukt-inline-svg>
                        </span>
                    </span>
                </li>
            </ul>
        </div>
    </div>
                              
</template>

<script>
import loader from '@/components/common/loader.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AdmInlineSvg from '@/components/common/adm-inline-svg.vue';
// import MirageAlert from '@/components/alert/index.vue';
import { PdfGeneratorService } from '@/services/pdf-generator.service';
import { InvoiceA4TemplateService } from '@/services/pdf/invoice/a4.service';
import { InvoiceA6TemplateService } from '@/services/pdf/invoice/a6.service';
import { InvoicePosTemplateService } from '@/services/pdf/invoice/pos.service';
import { LabelA4TemplateService } from '@/services/pdf/label/label_a4.service';
import { LabelA6TemplateService } from '@/services/pdf/label/label_a6.service';
import { LabelPosTemplateService } from '@/services/pdf/label/label_pos.service';
import {
    NitrozenDialog,
} from '@gofynd/nitrozen-vue';
import { GET_USER_INFO } from '@/store/getters.type';
import { mapGetters } from 'vuex';

// import { eventHelper } from '../../../analytics/helpers';
// import { EVENTS, getUserInfo } from "../../../analytics/index";

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
        }
    },
    components: {
        loader,
        // MirageAlert,
        UktInlineSvg,
        AdmInlineSvg,
        NitrozenDialog,
    },
    computed: {
        ...mapGetters({
            accessDetail: {},//GET_EMPLOYEE_ACCESS_DETAIL,
            userinfo: GET_USER_INFO,
        }),
    },
    methods: {
        printInvoice(status, type, viewOption, event) {
            if(event){
                event.stopPropagation();
            }
            this.selectedInvoicePageOption = status;
            this.selectedType = type;
            if (this.shipment.is_affiliate) {
                if (this.shipment.affiliate_details.pdf_links.invoice) {
                    window.open(
                        this.shipment.affiliate_details.pdf_links.invoice,
                        '_blank'
                    );
                } else {
                    this.$snackbar.global.showInfo(
                        'Invoice is not available for this shipment'
                    );
                }
            } else if (status == 'a4') {
                this.generatePdf('a4', type, viewOption);
            } else if (status == 'a6') {
                this.generatePdf('a6', type, viewOption);
            } else if (status == 'pos') {
                this.generatePdf('pos', type, viewOption);
            }

            // //google analytics events
            // let gaEvents = {
            //     "label": "LABEL_DOWNLOADED",
            //     "invoice": "INVOICE_DOWNLOADED"
            // }
            // let properties = {
            //     paper_size: status,
            //     shipment_ids: `${this.shipment.id}`,
            //     action: viewOption === 'download' ? 'download' : 'preview',
            //     source: this.viewType ? 'quick_view' : 'order_details_view'
            // }
            // eventHelper.invoiceLableDownload(EVENTS[gaEvents[type]], getUserInfo(this.userinfo, this.accessDetail), properties)
        },
        generatePdf(status, type, viewOption) {
            // if (!this.firstBag.current_status.delivery_awb_number) {
            //     this.$snackbar.global.showInfo(
            //         'AWB no is not generated for this shipment yet'
            //     );
            //     return;
            // }

            if (!this.shipment.dp_details.awb_no) {
                this.$snackbar.global.showInfo(
                    'AWB no is not generated for this shipment yet'
                );
                return;
            }
            this.inProgress = true;
            let invoiceTemplate;
            if(type === 'label'){
                switch (status) {
                    case 'a4':
                        invoiceTemplate = new LabelA4TemplateService(
                            this.shipment
                        );
                        break;
                    case 'a6':
                        invoiceTemplate = new LabelA6TemplateService(
                            this.shipment
                        );
                        break;
                    case 'pos':
                        invoiceTemplate = new LabelPosTemplateService(
                            this.shipment
                        );
                        break;
                    default:
                        return;
                }
            } else{
                switch (status) {
                    case 'a4':
                        invoiceTemplate = new InvoiceA4TemplateService(
                            this.shipment
                        );
                        break;
                    case 'a6':
                        invoiceTemplate = new InvoiceA6TemplateService(
                            this.shipment
                        );
                        break;
                    case 'pos':
                        invoiceTemplate = new InvoicePosTemplateService(
                            this.shipment
                        );
                        break;
                    default:
                        return;
                }
            }
            
            invoiceTemplate
                .getInvoiceTemplate()
                .then((template) => {
                    let pdfGenerator = new PdfGeneratorService();
                    pdfGenerator.then((res) => {
                        if( viewOption == "download" ){
                            res.download(
                                template,
                                `${this.shipment.id}_${this.selectedInvoicePageOption}`
                            );
                        }
                        else {
                            res.getDataUrl(template).then((dataUrl) => {
                                const targetElement = document.querySelector(
                                    '#invoicePreviewIframeContainer-' +
                                        this.shipment.id
                                );
                                const iframe = document.createElement('iframe');
                                iframe.src = dataUrl;
                                targetElement.innerHTML = '';
                                targetElement.appendChild(iframe);
                                this.inProgress = false;
                                this.$refs.invoicePreview.open({
                                    width: '80%',
                                    height: '90%',
                                    showCloseButton: true,
                                });
                            });
                        }
                    });
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },
    }

}
</script>

<style lang="less" scoped>
.menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 120px;
    left: -20px;
    top: calc(100% + .25rem);
    background-color: white;
    padding: 5px;
    border-radius: .25rem;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    
    h3{
        font-size: 16px;
        padding-left: 5px;
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

        .item-icons {
            padding-top: 3px;
            width: 45%;
            display: flex;
            justify-content: space-between;
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