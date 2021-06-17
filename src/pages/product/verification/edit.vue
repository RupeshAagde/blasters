<template>
    <div>
        <loader class="loading" v-if="pageLoading"></loader>
        <div v-else class="panel">
            <div class="header-position">
                <adm-page-header
                    title="Verify Product"
                    :showContextMenuItemMeta="true"
                    :custom-json="customJSON"
                    @saveMeta=""
                    @backClick=""
                >
                    <div class="button-box">
                        <nitrozen-button
                            class="pad-left"
                            :theme="'secondary'"
                            v-flatBtn
                            @click=""
                            >Edit</nitrozen-button
                        >
                    </div>
                    <template slot="page-slot-mobile-footer">
                        <nitrozen-button
                            class="footer-actions"
                            :theme="'secondary'"
                            v-flatBtn
                            @click=""
                            >Edit</nitrozen-button
                        >
                    </template>
                </adm-page-header>
            </div>
            <loader v-if="pageLoading" class="loading"></loader>
            <page-error
                v-else-if="pageError && !pageLoading"
                @tryAgain="init"
            ></page-error>
            <div v-else class="page-container">

            <div class="right-container">
                <div class="inline top-cards">
                <!-- Basic Details -->
                    <div class="full-width">
                        <div class="base">
                            <!-- <template-type
                                ref="template"
                                :product="product"
                                :editMode="editMode"
                                :product_type="product_type"
                                @change-template="changeTemplateType($event)"
                                @change-product-type="changeProductType($event)"
                                @change-template-schema="fetchTemplateSchema()"
                            >
                            </template-type> -->

                            <div class="cl-Mako bold-md">Details</div>
                             <product-details
                                ref="details"
                                :edit-mode="false"
                                :product="product"
                                :global-schema="globalSchema"
                                :brands="[]"
                                :categories="[]"
                                teaser="teaser_tag"
                                :is_physical="true"
                                :product_type="product_type"
                                :departments="[]"
                                :is_dependent="is_dependent"
                                :no_of_boxes="no_of_boxes"
                                :rejected_fields="rejectedFields"
                                @input-name="name = $event"
                                @trigger-verify="updateVerifiedList"
                            ></product-details> 
                        </div>
                    </div>
                </div>
                <!-- Images -->
                <div class="settings-container horizontal-scroll">
                    <div class="cl-Mako bold-md">Media</div>
                    <div class="mt-md inline ">
                         <media
                            class="mr-md cursor-move"
                            v-for="(m, index) of media"
                            :key="index"
                            label="Product Image"
                            aspectRatio="*"
                            :minimumResolution="{
                                width: 200,
                                height: 200,
                            }"
                            :value="m"
                            :index="index"
                            :fileName="name || 'product'"
                            :tags="getImageTags()"
                            namespace="products-item-image"
                        ></media>
                    </div>
                </div>
                <!-- Highlights -->
                <div class="settings-container">
                    <div class="cl-Mako bold-md">Highlights</div>
                        <div
                            class="row"
                            v-for="(highlight, index) of highlights"
                            :key="index"
                        >
                            <!-- Highlight Input -->
                            <nitrozen-input
                                class="input"
                                placeholder="For eg. All day battery backup"
                                v-model="highlights[index]"
                            ></nitrozen-input>
                            <nitrozen-checkbox
                                 :checkboxValue="rejectedFields.no_of_boxes || false"
                                 v-model="rejectedFields.no_of_boxes || false"
                                 id="rejectedFields.no_of_boxes"
                                 class="nt-checkbox"
                                 @change= "trigger-verify"
                            >
                             </nitrozen-checkbox>
                          
                        </div>
                </div>
                <!-- Dynamic Attributes -->
                <div class="settings-container">
                    <div class="cl-Mako bold-md">Attributes</div>
                    <dynamic-attributes
                        ref="dynamicAttributes"
                        :schema="templateSchema"
                        v-model="product.attributes"
                        @trigger-verify="updateVerifiedList"
                    ></dynamic-attributes>
                </div>

            </div>

             <!--  ----------------------Right Column Starts----------------------------- -->
            <div class="right-column">

                <!-- Product Availability -->
                <div class="available base">
                    <div class="header">
                        <div class="cl-Mako bold-md">
                            Product Availability
                        </div>


                    </div>

                    <availability
                        ref="availability"
                        :product="product"
                    ></availability>

                    <nitrozen-checkbox
                            :checkboxValue="rejectedFields.availability || false"
                            v-model="rejectedFields.availability || false"
                            id="rejectedFields.no_of_boxes"
                            class="nt-checkbox"
                            @change= "trigger-verify"
                            >
                    </nitrozen-checkbox>
                </div>

                <!-- Customs -->
                <div class="customs base">
                    <customs
                        ref="customs"
                        :product="product"
                        :globalSchema="globalSchema"
                        :companyId="companyId"
                        :rejectedFields="rejectedFields"
                        @trigger-verify="updateVerifiedList"
                    >

                    </customs>
                </div>

                <!-- Dependable Product -->
                <div class="dependable base" v-if="product_type.value !== 'set' && product_type.value !== 'composite'">
                    <div class="header">
                        <div class="cl-Mako bold-md">
                            Dependable Product
                        </div>
                    </div>
                    <div class="nt-check">
                        <nitrozen-checkbox
                            :checkboxValue="is_dependent.value"
                            v-model="is_dependent.value"
                            id="is_dependent"
                            class="nt-check"
                            label="Dependable Product"
                        >
                        </nitrozen-checkbox>
                    </div>
                </div>

                <!-- Limit Order Quantity -->
                <div class="moq base" v-if="is_dependent.value === false">
                    <div class="header">
                        <div class="cl-Mako bold-md">
                            Limit Order Quantity
                        </div>
                    </div>

                    <div class="nt-check">
                        <nitrozen-checkbox
                            :checkboxValue="limitQuantity"
                            v-model="limitQuantity"
                            id="limitQuantity"
                            class="nt-checkbox"
                        >
                        </nitrozen-checkbox>
                    </div>
                    <div class="input-quantity">
                        <div class="mt-sm">
                            <nitrozen-input
                                label="Minimum"
                                type="number"
                                :required="true"
                                placeholder="1"
                                v-model="minimum.value"
                                v-if="limitQuantity"
                            >
                            </nitrozen-input>
                        </div>
                        <div class="mt-sm">
                            <nitrozen-input
                                label="Maximum"
                                type="number"
                                v-model="maximum.value"
                                v-if="limitQuantity"
                            >
                            </nitrozen-input>
                        </div>
                    </div>
                    
                </div>

                <!-- Tags -->
                <div class="tags base">
                    <div class="header">
                        <div class="cl-Mako bold-md">
                            Tags
                        </div>
                    </div>                    
                    <div class="chip-wrapper inline tag-chips">
                        <div
                            v-for="(tag, index) of tags"
                            :key="index"
                        >
                            <nitrozen-chips class="chip">
                                {{ tag }}
                            </nitrozen-chips>
                        </div>
                    </div>
                </div>

                <!-- Fulfillment -->
                <div class="fulfillment base" v-if="is_physical">
                    <div class="header">
                        <div class="cl-Mako bold-md">
                            Made to Order
                        </div>
                        <nitrozen-error v-if="fullfillmentError">
                            {{ fullfillmentError }}
                        </nitrozen-error>
                    </div>
                    <div class="container fulfillment-section">
                        <div class="header">
                            <div class="title mf-btn">
                                <div class="mt-title">Manufactured on Demand</div>
                                <nitrozen-toggle-btn
                                    :disabled="true"
                                    class="active-btn"
                                    :value="is_custom_order"
                                />
                            </div>
                        </div>
                        <div class="header" v-if="is_custom_order">
                            <div class="title mf-btn">
                                <div class="mt-title">Manufacturing Time</div>
                                <nitrozen-input
                                    :disabled="true"
                                    type="number"
                                    placeholder="No of days/hours"
                                    v-model="manufacturing_time"
                                    class="mt-input"
                                    :min="1"
                                    :max="maxManufacturingTime"
                                >
                                </nitrozen-input>
                                <nitrozen-dropdown
                                    :disabled="true"
                                    class="mt-dd"
                                    :items="manufacturing_time_unit_list"
                                    v-model="manufacturing_time_unit"
                                ></nitrozen-dropdown>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Return -->
                <div class="fulfillment base">
                    <div class="header">
                        <div class="cl-Mako bold-md">
                            Return Configuration
                        </div>
                    </div>
                    <div class="container fulfillment-section">
                        <div class="header">
                        </div>
                        <div class="header" v-if="returnable">
                            <div class="title mf-btn">
                                <div class="mt-title">Return Time</div>
                                <nitrozen-input
                                    :disabled="true"
                                    type="number"
                                    placeholder="No of days/hours"
                                    v-model="return_time"
                                    class="mt-input"
                                    :min="1"
                                >
                                </nitrozen-input>
                                <nitrozen-checkbox
                                 :checkboxValue="rejectedFields.return_time || false"
                                 v-model="rejectedFields.return_time || false"
                                 id="rejectedFields.return_time"
                                 class="nt-checkbox"
                                 @change= "trigger-verify"
                            >
                             </nitrozen-checkbox>
                                <nitrozen-dropdown
                                    :disabled="true"
                                    class="mt-dd"
                                    :items="manufacturing_time_unit_list"
                                    v-model="return_time_unit"
                                ></nitrozen-dropdown>
                                <nitrozen-checkbox
                                 :checkboxValue="rejectedFields.return_time_unit || false"
                                 v-model="rejectedFields.return_time_unit || false"
                                 id="rejectedFields.return_time_unit"
                                 class="nt-checkbox"
                                 @change= "trigger-verify"
                            >
                             </nitrozen-checkbox>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Trader -->
                <div class="settings-container">
                    <div class="cl-Mako bold-md">Trader</div>
                    <div class="inline mt-md trader">
                        <div class="mr-md full">
                            <nitrozen-input
                                class="input mt-sm"
                                label="Trader Type"
                            ></nitrozen-input>
                            <nitrozen-checkbox
                                 :checkboxValue="rejectedFields.trader_type || false"
                                 v-model="rejectedFields.trader_type || false"
                                 id="rejectedFields.trader_type"
                                 class="nt-checkbox"
                                 @change= "trigger-verify"
                            >
                             </nitrozen-checkbox>
                            <nitrozen-input
                                class="input mt-sm"
                                label="Name"
                                v-model="trader.name"
                            ></nitrozen-input>
                            <nitrozen-checkbox
                                 :checkboxValue="rejectedFields.trader_name || false"
                                 v-model="rejectedFields.trader_name || false"
                                 id="rejectedFields.trader_name"
                                 class="nt-checkbox"
                                 @change= "trigger-verify"
                            >
                             </nitrozen-checkbox>
                            <nitrozen-input
                                class="input"
                                label="Address"
                                type="textarea"
                                v-model="trader.address"
                            ></nitrozen-input>
                            <nitrozen-checkbox
                                 :checkboxValue="rejectedFields.trader_address || false"
                                 v-model="rejectedFields.trader_address || false"
                                 id="rejectedFields.trader_address"
                                 class="nt-checkbox"
                                 @change= "trigger-verify"
                            >
                             </nitrozen-checkbox>
                        </div>
                    </div>
                </div>

                <!-- Product-Bundle -->
           <!--      <div class="settings-container base">
                    <div class="cl-Mako bold-md">Product Bundle</div>
                    <product-bundle
                        ref="product-bundle"
                        :product="product"
                        :brand-id="brandUid"
                        :product_type="product_type.value"
                    ></product-bundle>
                </div> -->
                
                <!-- Size-Guide -->
            <!--     <div class="settings-container">
                    <div class="cl-Mako bold-md">Size Guide</div>
                    <size-guide
                        ref="size-guide"
                        :product="product"
                        :brand-id="brandUid"
                    ></size-guide>
                </div> -->


            </div>

            <div
                class="download_section flex"
               
            >
                <div v-for="(button, index) in actionButtons" :key="index" class="flex download-btn" >
                    <nitrozen-button
                        theme="secondary"
                        v-flatBtn
                        @click="save(index)"
                    >
                        {{button}}
                    </nitrozen-button>
                </div>
            </div>
           </div>
        </div>
    </div>

</template>

<style  lang="less" scoped>
.header-position {
    height: 58.5px;
}
.button-box {
    .pad-left {
        margin-left: 12px;
    }
}
.label {
    color: #9b9b9b !important;
    font-size: 12px !important;
}
.mt-input {
    min-width: 70px !important;
}
.toggle-btn {
    margin-left: 20px;
}
.nt-check {
    padding-top: 15px;
    .title {
        font-size: 14px !important;
    }
    .nt-checkbox {
        padding: 7px 0 7px 0;
    }
}
.download_section {
                    display: flex;
                    justify-content: space-evenly;

                    .download-btn {
                        padding: 0 10px;
    }
}
.flex {
    display: flex;
    padding: 0;
    .inline {
        padding: 0 10px;
        width: 50%;
    }
    .inline_single {
        width: 100% !important;
        padding: 0 10px;
    }
}
.mf-btn {
    display: flex !important;
    align-items: center;
    .mt-title {
        min-width: 150px;
    }
    .mt-dd {
        width: 60% !important;
    }
}

.check-container {
    margin-bottom: 15px;
}

.moq, .tags, .dependable, .customs, .fulfillment {
    margin-top: 24px;
}
.multiSize {
    padding: 20px 0 15px 0;
}
.input-quantity {
    display:flex;
    .mt-sm {
        width: 50%;
        margin: 2px;
    }
}
.page-container {
    display: flex;
    width: auto;
    background-color: @Alabaster2;
    @media @mobile{
        padding: 0;
        width: auto;
    }
    .right-container {
        width: 62.5%;
        margin: 0 12px 24px 0;
        @media @mobile {
            width: 100%;
            margin:0;
        }
    }

    .right-column {
        margin: 0 0 24px 12px;
        width: 35%;
        @media @mobile {
            width: 100%;
            margin:0;
            margin-bottom: 70px;
        }
    }
    .top-cards {
        flex-direction: column;
        padding-bottom: 24px;
    }
    .full-width {
        .header {
            display: flex;
            justify-content: space-between;
            img.template-logo {
                height: 60px;
                object-fit: contain;
            }
            .label {
                margin-top: 10px;
            }
        }
    }
    .base {
        padding: 24px;
        border: 1px solid #f3f3f3;
        border-radius: 8px;
        background-color: #ffffff;
    }
    .plan-upgrade-container {
        width: 50%;
    }
    .settings-container {
        display: block;
        flex: 1;
        padding: 24px;
        border: 1px solid #f3f3f3;
        border-radius: 8px;
        background-color: #ffffff;
        margin-bottom: 24px;
    }

    .shipping-container,
    .payment-container,
    .fulfillment {
        display: block;
        flex: 1;
        padding: 24px;
        border: 1px solid #f3f3f3;
        border-radius: 8px;
        background-color: #ffffff;
        margin-bottom: 24px;

        .mt-sm {
            width: 30%;
        }
    }

    .highlights-container {
        .row {
            margin-top: 12px;page-header
page-header
page-header
            display: flex;
            .input {
                width: 75%;
            }
        }
    }
}

.shipping {
    margin-bottom: 10px;
}

.input {
    &.xs {
        width: 200px;
    }
    &.md {
        width: 260px;
    }
    &.xl {
        width: 380px;
    }
    &.p70 {
        width: 70%;
    }

    .filter {
        &.md {
            width: 120px;
        }
        &.sm {
            width: 70px;
        }
    }
}
.label-text {
    color: @DustyGray2;
    font-size: 12px;
    font-weight: 500;
}

.mt-md {
    margin-top: 24px;
}
.mt-sm {
    margin-top: 12px;
}
.inline {
    display: flex;
}
.margin-left {
    margin-left: 24px;
}
.mr-md {
    padding-right: 12px;
}
.mr-l {
    padding-right: 24px;
}
.mr-xl {
    padding-right: 40px;
}
.mr-xxl {
    padding-right: 60px;
}
.cursor-move {
    cursor: move;
}
.cursor-pointer {
    cursor: pointer;
}
.vertical-align-center {
    display: flex;
    align-items: center;
}
.horizontal-scroll {
    overflow-x: auto;
}
.float-right {
    float: right;
}
.width-fit-content {
    width: fit-content;
}

.border-bottom {
    padding-bottom: 12px;
    border-bottom: 1px solid @Iron;
}
.attr-container {
    display: flex;
    flex-wrap: wrap;
    .attr {
        margin-right: 12px;
    }
}
.toggle {
    display: flex;
    align-items: center;
    .text {
        font-size: 12px;
        font-weight: 700;
        color: @RoyalBlue;
        cursor: pointer;
        &.disabled {
            color: @DustyGray2;
        }
    }
}
::v-deep.delete-icon svg {
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin: 12px 0 0 12px;
    border: 1px solid @Iron;
    border-radius: 2px;
}
::v-deep.reorder-icon svg {
    width: 18px;
    height: 18px;
    cursor: move;
    margin-right: 12px;
}
::v-deep.add-highlight svg {
    cursor: pointer;
    width: 38px;
    margin-left: 12px;
    height: 38px;
    border: 1px solid @Iron;
    border-radius: 3px;
    #prefix__Group {
        stroke: @RoyalBlue;
    }
}
::v-deep.remove-highlight svg {
    width: 32px;
    height: 32px;
    cursor: pointer;
    padding: 3px;
    margin-left: 12px;
    border: 1px solid @Iron;
    border-radius: 3px;
}
::v-deep.remove-highlight-disabled svg {
    opacity: 0.3;
    cursor: not-allowed;
}

.tag-chips {
    display:flex;
    flex-wrap: wrap;
    margin-top: 15px;
}
.full {
    width: 100%;
}

.editor {
    max-height: 850px;
    width: 100%;
    margin-top: 12px;
    // border override
    border-radius: 8px;
    ::v-deep .mce-panel,
    ::v-deep .mce-btn-group:not(:first-child) {
        border: 1px solid @WhiteSmoke;
    }
    ::v-deep .mce-tinymce {
        -webkit-box-shadow: none;
        box-shadow: none;
    }
}

.fulfillment-section {
    .header {
        display: flex;
        justify-content: space-between;
        padding: 10px 0 5px 0;
        .title {
            margin-top: 12px;
            font-size: 14px;
            color: @Mako;
        }
        .btn-container {
            display: flex;
            .active-btn {
                margin-top: 4px;
                padding-left: 12px;
                color: @RoyalBlue;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
            }
        }
    }
}
.trader{
    @media @mobile{
        display: block;
    }
}
</style>
<script type="text/javascript">
import CompanyService from '@/services/company-admin.service';
import CatalogService from '@/services/catalog.service';
import pageerror from '@/components/common/page-error';
import loader from '@/components/common/loader';
import admpageheader from '@/components/common/layout/page-header';
import uktinlinesvg from '@/components/common/ukt-inline-svg';
import inlineSVG from '@/components/common/adm-inline-svg';

import { isEmpty, toLower  } from 'lodash'

import { Availability, Customs, ProductDetails, Media, DynamicAttributes } from './components';

import {
    NitrozenButton,
    NitrozenRadio,
    NitrozenInput,
    NitrozenInline,
    NitrozenToggleBtn,
    NitrozenBadge,
    NitrozenDropdown,
    NitrozenError,
    NitrozenDialog,
    NitrozenTooltip,
    flatBtn,
    strokeBtn,
    NitrozenCheckBox,
    NitrozenChips,
} from '@gofynd/nitrozen-vue';

export default {
    name: "verification-edit",
    components: {
        NitrozenButton,
        NitrozenRadio,
        NitrozenInput,
        NitrozenToggleBtn,
        NitrozenBadge,
        NitrozenInline,
        NitrozenDropdown,
        NitrozenDialog,
        NitrozenTooltip,
        NitrozenError,
        NitrozenChips,
        NitrozenCheckBox,

        'availability': Availability,
        'customs':Customs,
        'adm-page-header': admpageheader,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-button': NitrozenButton,
        'page-error': pageerror,
        'product-details': ProductDetails,
        'ukt-inline-svg': uktinlinesvg,
        'dynamic-attributes': DynamicAttributes,
        'inline-svg': inlineSVG,
        'media': Media,
        loader

    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mounted() {
        const { params: { id, productId: code }, query: { template, uid } } = this.$route;
        if (id) {
            this.companyId = id;
            this.headerText = 'Product Verification Edit';
            this.pageLoading = true;
            this.productId = uid;
            this.productCode = code
            this.saveText = 'Product Updated Successfully';
            this.templateSlug = template;
            this.update = true;

        }
        this.init();
    },

    data() {
        return {
            customJSON: {},
            pageLoading : false,
            miscErrors: {},
            globalSchema: {},
            pageError: false,
            product:{},
            templateSchema: {},
            is_dependent: {value:false, error:""},
            companyId : -1,
            media: [],
            isSet: false,
            highlights: [''],
            sizes: [],
            otherSizes: [],
            customJSON: {},
            hsnDetails: {},

                        name: '',
            brandUid: 0,
            itemCode: '',
            categorySlug: '',
            hsnCode: '',
            trader_type: '',
            trader: {
                name: '',
                address: ''
            },
            traderError:'',
            traderTypeList: [],
            moq: {
                error:''
            },
            fullfillmentError: "",
            is_active: true,
            teaser_tag: {
                type: '',
                tag: ''
            },
            company_tags: [],
            tags: [],
            tagList: [],
            product_online_date: '',

            pay_at_store: false,
            store_pickup: false,
            heavy_equipment: false,
            is_physical: true,

            manufacturing_time_unit: 'hours',
            is_custom_order: false,
            manufacturing_time: 0,
            manufacturing_time_unit_list: [
                { text: 'Hours', value: 'hours' },
                { text: 'Days', value: 'days' }
            ],
            maxManufacturingTime: 360,
            multiSize: true,
            minimum: this.getInitialValue(),
            maximum: this.getInitialValue(),
            limitQuantity: false,
            no_of_boxes: this.getInitialValue(),
            is_dependent: {value:false, error:""},
            product_type: this.getInitialValue(),
            errMsgRequired: 'This field is required',
            errMsgGeneric: 'Something not right here',

            returnConfigError: '',
            returnable: false,
            return_time: 3,
            return_time_unit: 'days',
            verificationDetails: {},
            rejectedFields: {},
            actionButtons : ["Skip", "Verify", "Reject"]


        }
    },

    methods: {

        async init() {
            const promiseArray = [this.fetchProductData(), this.fetchVerificationDetails(), this.fetchTemplateSchema()];
            try{
                const [product, verification, globalSchema] = await Promise.all(promiseArray);

                this.product = product.data.data;
                this.templateSchema = globalSchema.data.data.template_validation;
                this.globalSchema = globalSchema.data.data.global_validation;
                this.templateDetails = globalSchema.data.template_details;
                this.verificationDetails = verification.data;
                this.populateForm();

            }catch(error){
                this.pageError = true;
                console.log(error);
            }
            console.log("response======", this.product);
            this.pageLoading = false;
        },
        getParams(obj = {}){
            return {
                companyId: this.companyId,
                itemId: this.productId,
                ...obj,
            }
        },  
        fetchProductData(){
            const myParams =  {
                uid: this.productId
            }
            return CompanyService.fetchProductDetails(this.getParams(myParams));
        },
        fetchVerificationDetails(){
            const myParams = {
                itemId: this.productCode
            }
            return CatalogService.fetchVerificationProductDetails(this.getParams(myParams));
        },
        fetchTemplateSchema(){
            const myParams = {
                slug: this.templateSlug,
            }
            return CompanyService.fetchTemplateSchema(this.getParams(myParams));
        },
        // redirectToListing(){
        //     this.$router.push({ path: '/administrator/product/category' });
        // },
        redirectToListing() {
            this.$router.go(-1);
        },
        getInitialValue() {
            return {
                value: '',
                error: ''
            };
        },
        
        populateForm() {
            try {
                this.product_type.value = this.product_type.value ? this.product_type.value : (this.product.item_type ? this.product.item_type.toLowerCase() : (
                    this.product.is_set ? 'set' : 'standard'
                )); 
                this.setValues(this.product_type.value);
                // attribute lists
                this.categories = this.templateDetails.category_details;
                // product fields
                this.name = this.product.name || this.name;
                this.brandUid = this.product.brand_uid || this.brandUid;
                this.categorySlug = this.product.category_slug || this.categorySlug;
                this.itemCode = this.product.item_code || this.itemCode;
                this.trader_type = this.product.trader_type || this.trader_type;
                this.trader = this.product.trader || this.trader;
                this.customJSON = this.product._custom_json || this.customJSON;
                this.sizes = this.product.sizes || this.sizes;

                // this.description.value = this.description.value || this.product.description || '';
                // this.short_description.value =
                //     this.short_description.value || this.product.short_description || '';

                // if ('multi_size' in this.product){
                //     this.multiSize = this.product.multi_size;
                // }

                if ('is_set' in this.product){
                    this.isSet = this.product.is_set;
                }

                if ('return_config' in this.product && 
                     !(isEmpty(this.product.return_config)) && 
                     this.product.return_config.returnable) {
                    this.returnable = this.product.return_config.returnable;
                    this.return_time = this.product.return_config.time;
                    this.return_time_unit = this.product.return_config.unit;
                }

                this.teaser_tag = this.product.teaser_tag || this.teaser_tag;
                
                this.is_custom_order = (this.product.custom_order
                    ? this.product.custom_order.is_custom_order
                    : false) || this.is_custom_order
                if  (this.is_custom_order) {
                    this.manufacturing_time_unit = toLower(this.product.custom_order
                    ? this.product.custom_order.manufacturing_time_unit
                    : this.manufacturing_time_unit) || toLower(this.manufacturing_time_unit)
                    this.manufacturing_time = (this.product.custom_order
                        ? this.product.custom_order.manufacturing_time
                        : this.manufacturing_time) || this.manufacturing_time
                }        

                this.tags = !isEmpty(this.product.tags) ? this.product.tags : this.tags;

                if ('moq' in this.product && this.product.moq.is_set) {
                    if (!isEmpty(this.product.moq)) {
                        this.limitQuantity = true;
                        this.minimum.value = this.product.moq.minimum
                            ? this.product.moq.minimum
                            : '';
                        this.maximum.value = this.product.moq.maximum
                            ? this.product.moq.maximum
                            : '';
                    }
                }

                // other sizes
                if (!isEmpty(this.product.attributes))
                    this.otherSizes =
                        this.product.attributes.other_available_sizes || [];

                if (!isEmpty(this.product.media))
                    this.media = this.product.media;

                if (!isEmpty(this.product.highlights))
                    this.highlights = this.product.highlights;

                const { rejected_fields = {} } = this.verificationDetails;
                this.rejectedFields = rejected_fields
                console.log("rejected_fields----", this.rejectedFields);

                // this.$nextTick(() => {
                //     this.$refs.details.populateForm();
                //     this.$refs.availability.populateForm();
                //     this.$refs.sizes.populateForm();
                //     this.$refs.template.populateForm();
                //     this.$refs.customs.populateForm();
                    
                //     // set clean product object for dirty form check
                //     this.cleanProduct = this.getFormData();
                //     this.cleanProduct.variants = this.product.variants || {};
                // });

                
            } catch (err) {
                this.$snackbar.global.showError(err.errMsgGeneric);
                console.log(err);
            }
        },
        setValues(product_type) {
            switch(product_type) {
                case 'standard':
                    this.isSet = false;
                    this.multiSize = false;
                    this.product_type.value = product_type;
                    this.is_physical = true;
                    break;
                case 'set':
                    this.multiSize = true;
                    this.isSet = true;
                    this.product_type.value = product_type;
                    this.is_physical = true;
                    break;
                case 'composite':
                    this.isSet = false;
                    this.multiSize = false;
                    this.product_type.value = product_type;
                    this.is_physical = true;
                    break;
                case 'digital':
                    this.isSet = false;
                    this.multiSize = false;
                    this.is_physical = false;
                    this.product_type.value = product_type;
                    break;
                default:
                    break;
            }
        },
        updateVerifiedList(e){

            if (this.rejectedFields[e]){ 
                this.rejectedFields[e] = false;
            }
            else{
                this.rejectedFields[e] = true;
            }
            console.log("updateveridfeiedList", this.rejectedFields);
        },
        save(e){
            if(e && this.actionButtons[e] === "Verify"){        // Verified
                this.verificationDetails.rejectedFields = this.rejectedFields;
                this.verificationDetails.status = "verified";

            }
            else if(e && this.actionButtons[e] === "Reject"){                             // Rejected
                this.verificationDetails.rejected_fields = {};
                this.verificationDetails.status = "rejected";
            }
            else{                                                // Skip
                return;
            }
            const query = {
                companyId: this.companyId,
                itemId: this.itemCode,
                uid: this.productId,
                brand_uid: this.brandUid
            }
            try{
               const result = CatalogService.saveVerifiedProducts({
                   ...query,
                   body: this.verificationDetails
               })
               console.log("result***************", result);
            }
            catch(e){
                console.log("error", e);
            }

        },
        saveMeta({ meta = [], json = {} }) {
            this.customJSON = json;
        },
        redirect(){
            return;
        },
        getImageTags() {
            return [`company_${this.companyId}`, `brand_${this.productCode}`];
        },
        

    }
}


    
</script>
