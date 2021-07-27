<template>
    <div>
        <loader class="loading" v-if="pageLoading"></loader>
        <div v-else class="panel">
            <div class="header-position">
                <adm-page-header
                    title="Verify Product"
                    @backClick="redirectToListing"
                >
                    <div class="button-box">
                        <nitrozen-button
                            class="pad-left"
                            :theme="'secondary'"
                            v-flatBtn
                            @click="redirect({ platform: true })"
                            >Edit</nitrozen-button
                        >
                    </div>
                    <template slot="page-slot-mobile-footer">
                        <nitrozen-button
                            class="footer-actions"
                            :theme="'secondary'"
                            v-flatBtn
                            @click="redirect({ platform: true })"
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

                                <div class="cl-Mako bold-md">Details</div>

                                <product-details
                                    :key="start"
                                    ref="details"
                                    :edit-mode="false"
                                    :product="product"
                                    :global-schema="globalSchema"
                                    :brands="brands"
                                    :categories="[]"
                                    teaser="teaser_tag"
                                    :is_physical="true"
                                    :product_type="product_type"
                                    :departments="departmentsList"
                                    :is_dependent="is_dependent"
                                    :no_of_boxes="no_of_boxes"
                                    :rejected_fields="rejectedFields"
                                    :errMsgRequired="errMsgRequired"
                                    @input-name="name = $event"
                                    @trigger-verify="updateVerifiedList"
                                ></product-details>
                            </div>
                        </div>
                    </div>
                    <!-- Images -->
                    <div class="settings-container horizontal-scroll">
                        <div class="cl-Mako bold-md">Media</div>
                        <div class="header"></div>
                        <nitrozen-error v-if="rejectedFields.media">
                            {{ errMsgRequired }}
                        </nitrozen-error>

                        <div class="mt-md inline" :key="start" v-if="!isEmpty(media)">
                            <div
                                v-for="(m, index) of media"
                                :key="index"
                                class="image-verify-block"
                            >
                                <nitrozen-checkbox
                                    :value="
                                        isCheckboxSelected(
                                            rejectedFields.media,
                                            m && m.url
                                        )
                                    "
                                    id="rejectedFields.media"
                                    class="nt-checkbox"
                                    @change="
                                        updateVerifiedList({
                                            key: 'media',
                                            value: m && m.url,
                                            type: 'array',
                                            index: index
                                        })
                                    "
                                >
                                </nitrozen-checkbox>
                                    <media
                                        class="mr-md cursor-move"
                                        :key="start.toString()+index.toString()"
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
                        <div class="no-data" v-else>
                            No media files are uploaded for this product.
                        </div>
                    </div>
                    <!-- Highlights -->
                    <div class="settings-container">
                        <div class="cl-Mako bold-md">Highlights</div>
                        <nitrozen-error v-if="rejectedFields.highlights">
                            {{ errMsgRequired }}
                        </nitrozen-error>
                        <template v-if="!isEmpty(highlights)">
                            <div
                                class="mt-sm verify-block"
                                v-for="(highlight, index) of highlights"
                                :key="index"
                            >
                                <!-- Highlight Input -->
                                <nitrozen-checkbox
                                    :value="
                                        isCheckboxSelected(
                                            rejectedFields.highlights,
                                            highlight
                                        )
                                    "
                                    id="rejectedFields.no_of_boxes"
                                    class="nt-checkbox"
                                    @change="
                                        updateVerifiedList({
                                            key: 'highlights',
                                            value: highlight,
                                            type: 'array',
                                            index: index
                                        })
                                    "
                                >
                                </nitrozen-checkbox>
                                <nitrozen-input
                                    disabled
                                    :key="start"
                                    placeholder="For eg. All day battery backup"
                                    v-model="highlights[index]"
                                ></nitrozen-input>
                            </div>
                        </template>
                        <div class="no-data" v-else>
                            No highlights for this product.
                        </div>
                        
                        
                    </div>
                    <!-- Dynamic Attributes -->
                    <div class="settings-container">
                        <div class="cl-Mako bold-md">Attributes</div>
                        <dynamic-attributes
                            :key="start"
                            :rejectedFields="rejectedFields"
                            ref="dynamicAttributes"
                            :schema="templateSchema"
                            :errMsgRequired="errMsgRequired"
                            v-model="product.attributes"
                            @trigger-verify="updateVerifiedList"
                        ></dynamic-attributes>
                    </div>
                </div>

                <!--  ----------------------Right Column Starts----------------------------- -->
                <div class="right-column">

                    <!-- Customs -->
                    <div class="customs base">
                        <customs
                            ref="customs"
                            :key="start"
                            :product="product"
                            :globalSchema="globalSchema"
                            :companyId="companyId"
                            :rejectedFields="rejectedFields"
                            :errMsgRequired="errMsgRequired"
                            @trigger-verify="updateVerifiedList"
                        >
                        </customs>
                    </div>

                    <!-- Limit Order Quantity -->
                    <div
                        class="moq base"
                        v-if="is_dependent.value === false && limitQuantity"
                    >
                        <div class="header">
                            <div class="cl-Mako bold-md">
                                Limit Order Quantity
                            </div>
                        </div>
                        <div class="input-quantity">
                            <div class="mt-sm verify-block">
                                <nitrozen-checkbox
                                    :value="
                                        isCheckboxSelected(
                                            rejectedFields.minimum
                                        )
                                    "
                                    :checkboxValue="rejectedFields.minimum"
                                    id="rejectedFields.no_of_boxes"
                                    class="nt-checkbox"
                                    @change="
                                        updateVerifiedList({
                                            key: 'minimum',
                                            value: minimum.value,
                                        })
                                    "
                                >
                                </nitrozen-checkbox>
                                <div class="block">
                                    <nitrozen-input
                                        :key="start"
                                        label="Minimum"
                                        type="number"
                                        :required="true"
                                        placeholder="1"
                                        v-model="minimum.value"
                                        v-if="limitQuantity"
                                    >
                                </nitrozen-input>
                                    <nitrozen-error v-if="rejectedFields.minimum">
                                        {{ errMsgRequired }}
                                    </nitrozen-error>
                                </div>
                                
                            </div>
                            <div class="mt-sm verify-block">
                                <nitrozen-checkbox
                                    :value="
                                        isCheckboxSelected(
                                            rejectedFields.maximum
                                        )
                                    "
                                    :checkboxValue="rejectedFields.maximum"
                                    id="rejectedFields.no_of_boxes"
                                    class="nt-checkbox"
                                    @change="
                                        updateVerifiedList({
                                            key: 'maximum',
                                            value: maximum.value,
                                        })
                                    "
                                >
                                </nitrozen-checkbox>
                                <div class="block">
                                    <nitrozen-input
                                        :key="start"
                                        label="Maximum"
                                        type="number"
                                        v-model="maximum.value"
                                        v-if="limitQuantity"
                                    >
                                </nitrozen-input>
                                    <nitrozen-error v-if="rejectedFields.maximum">
                                        {{ errMsgRequired }}
                                    </nitrozen-error>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    <!-- Tags -->
                    <div class="tags base" v-if="tags && tags.length">
                        <div class="header">
                            <div class="cl-Mako bold-md">Tags</div>
                        </div>
                        <div class="mt-sm verify-block">
                            <nitrozen-checkbox
                                    :value="isCheckboxSelected(rejectedFields.tags)"
                                    :checkboxValue="rejectedFields.tags"
                                    id="rejectedFields.tags"
                                    class="nt-checkbox"
                                    @change="
                                        updateVerifiedList({
                                            key: 'tags',
                                            value: tags,
                                        })
                                    "
                                >
                            </nitrozen-checkbox>
                            <div class="block">
                                <div class="chip-wrapper inline tag-chips">
                                    <div v-for="(tag, index) of tags" :key="index">
                                        <nitrozen-chips class="chip">
                                            {{ tag }}
                                        </nitrozen-chips>
                                    </div>
                                </div>
                                <nitrozen-error v-if="rejectedFields.tags">
                                    {{ errMsgRequired }}
                                </nitrozen-error>
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
                                <div class="title mf-btn">
                                    <div class="mt-title">Return Time</div>
                                    <div class="header"></div>
                                    <div class="inline">
                                        <div class="verify-block">
                                            <nitrozen-checkbox
                                                :value="
                                                    isCheckboxSelected(
                                                        rejectedFields.return_time
                                                    )
                                                "
                                                :checkboxValue="
                                                    rejectedFields.return_time
                                                "
                                                id="rejectedFields.return_time"
                                                class="nt-checkbox"
                                                @change="
                                                    updateVerifiedList({
                                                        key: 'return_time',
                                                        value: return_time,
                                                    })
                                                "
                                            >
                                            </nitrozen-checkbox>
                                            <nitrozen-input
                                                :disabled="true"
                                                type="number"
                                                placeholder="No of days/hours"
                                                v-model="return_time"
                                                class="mt-input"
                                                :min="1"
                                            >
                                            </nitrozen-input>
                                        </div>
                                        <div class="verify-block ml-15">
                                            <nitrozen-checkbox
                                                :value="
                                                    isCheckboxSelected(
                                                        rejectedFields.return_time_unit
                                                    )
                                                "
                                                :checkboxValue="
                                                    rejectedFields.return_time_unit
                                                "
                                                id="rejectedFields.return_time_unit"
                                                class="nt-checkbox"
                                                @change="
                                                    updateVerifiedList({
                                                        key: 'return_time_unit',
                                                        value: return_time_unit,
                                                    })
                                                "
                                            >
                                            </nitrozen-checkbox>
                                            <nitrozen-input
                                                :disabled="true"
                                                type="string"
                                                placeholder="Manufacturing time Unit"
                                                v-model="return_time_unit"
                                                class="mt-dd"
                                            >
                                            </nitrozen-input>
                                        </div>
                                    </div>
                                    <div class="header"></div>
                                    <nitrozen-error v-if="rejectedFields.return_time || rejectedFields.return_time_unit">
                                        {{ errMsgRequired }}
                                    </nitrozen-error>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Trader -->
                    <div class="settings-container">
                        <div class="cl-Mako bold-md">Trader</div>
                        <div class="inline mt-md trader">
                            <div class="mr-md full">
                                <div class="mt-sm verify-block">
                                    <nitrozen-checkbox
                                        :value="
                                            isCheckboxSelected(
                                                rejectedFields.trader_type
                                            )
                                        "
                                        :checkboxValue="
                                            rejectedFields.trader_type
                                        "
                                        id="rejectedFields.trader_type"
                                        class="nt-checkbox"
                                        @change="
                                            updateVerifiedList({
                                                key: 'trader_type',
                                                value: trader_type || true
                                            })
                                        "
                                    >
                                    </nitrozen-checkbox>
                                    <div class="block">
                                        <nitrozen-input
                                            class="input"
                                            label="Trader Type"
                                            disabled
                                        ></nitrozen-input>
                                        <nitrozen-error v-if="rejectedFields.trader_type">
                                            {{ errMsgRequired }}
                                        </nitrozen-error>
                                    </div>
                                </div>
                                <div class="mt-sm verify-block">
                                    <nitrozen-checkbox
                                        :value="
                                            isCheckboxSelected(
                                                rejectedFields.trader_name
                                            )
                                        "
                                        :checkboxValue="
                                            rejectedFields.trader_name
                                        "
                                        id="rejectedFields.trader_name"
                                        class="nt-checkbox"
                                        @change="
                                            updateVerifiedList({
                                                key: 'trader_name',
                                                value: trader.name,
                                            })
                                        "
                                    >
                                    </nitrozen-checkbox>
                                    <div class="block">
                                        <nitrozen-input
                                            class="input"
                                            label="Name"
                                            v-model="trader.name"
                                            disabled
                                        ></nitrozen-input>
                                        <nitrozen-error v-if="rejectedFields.trader_name">
                                            {{ errMsgRequired }}
                                        </nitrozen-error>
                                    </div>
                                </div>
                                <div class="mt-sm verify-block">
                                    <nitrozen-checkbox
                                        :value="
                                            isCheckboxSelected(
                                                rejectedFields.trader_address
                                            )
                                        "
                                        :checkboxValue="
                                            rejectedFields.trader_address
                                        "
                                        id="rejectedFields.trader_address"
                                        class="nt-checkbox"
                                        @change="
                                            updateVerifiedList({
                                                key: 'trader_address',
                                                value: trader.address,
                                            })
                                        "
                                    >
                                    </nitrozen-checkbox>
                                    <div class="block">
                                        <nitrozen-input
                                            class="input"
                                            label="Address"
                                            type="textarea"
                                            v-model="trader.address"
                                            disabled
                                        ></nitrozen-input>
                                        <nitrozen-error v-if="rejectedFields.trader_address">
                                            {{ errMsgRequired }}
                                        </nitrozen-error>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="download_section">
                    <nitrozen-input
                        v-if="isRejected"
                        class="input reject-input"
                        label="Remark"
                        type="textarea"
                        v-model="remark"
                        placeholder="Add a remark"
                    ></nitrozen-input>
                    <div class="flex">
                        <div class="download-btn">
                            <nitrozen-button
                                theme="secondary"
                                :disabled="isEmpty(verificationDetails.next_product)"
                                v-flatBtn
                                @click="skipProduct()"
                            >
                                Skip
                            </nitrozen-button>
                        </div>
                        <div
                            v-for="(button, index) in actionButtons"
                            :key="index"
                            class="download-btn"
                        >
                            <nitrozen-button
                                theme="secondary"
                                v-flatBtn
                                @click="save(button)"
                            >
                                {{ button }}
                            </nitrozen-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style  lang="less" scoped>

.no-data {
    padding: 24px;
    width: 100%;
    text-align: center;
    color: @DustyGray2;
    font-size: 14px;
}
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
    width: 100%;

    .reject-input {
        max-width: 62.5%;
        min-width: 50px;
        margin-bottom: 10px;
    }

    .download-btn {
        padding: 0 10px;
    }
}
.block {
    display: block;
    width: 100%;
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
    display: block;
    align-items: center;
    .mt-title {
        min-width: 150px;
    }
    .mt-dd {
        width: 60% !important;
    }
    .ml-15 {
        margin-left:15px;
    }
}

.check-container {
    margin-bottom: 15px;
}

.moq,
.tags,
.dependable,
.customs {
    margin-top: 0px;
}
.fulfillment, .tags, .moq{
    margin-top: 24px;
}
.multiSize {
    padding: 20px 0 15px 0;
}
.input-quantity {
    display: flex;
    .mt-sm {
        width: 50%;
        margin: 2px;

        .nitrozen-form-input {
            width: 100% !important;
        }
    }
}
.page-container {
    display: flex;
    width: auto;
    background-color: @Alabaster2;
    padding: 12px;
    margin: 12px;
    @media @mobile {
        padding: 0;
        width: auto;
    }
    .right-container {
        width: 62.5%;
        margin: 0 12px 24px 0;
        @media @mobile {
            width: 100%;
            margin: 0;
        }
    }

    .right-column {
        margin: 0 0 24px 12px;
        width: 35%;
        @media @mobile {
            width: 100%;
            margin: 0;
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
            margin-top: 12px;
        }
    }
}

.verify-block {
    display: flex;
    align-items: center;
    .nitrozen-form-input {
        width: 100%;
    }
}
.image-verify-block {
    display: flex;
}

.shipping {
    margin-bottom: 10px;
}

.input {
    width: 100%;
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
    display: flex;
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
.trader {
    @media @mobile {
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

import { isEmpty, toLower, cloneDeep } from 'lodash';

import {
    Customs,
    ProductDetails,
    Media,
    DynamicAttributes,
} from './components';

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
    NitrozenChips
} from '@gofynd/nitrozen-vue';

export default {
    name: 'verification-edit',
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

        customs: Customs,
        'adm-page-header': admpageheader,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-button': NitrozenButton,
        'page-error': pageerror,
        'product-details': ProductDetails,
        'ukt-inline-svg': uktinlinesvg,
        'dynamic-attributes': DynamicAttributes,
        'inline-svg': inlineSVG,
        media: Media,
        loader,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    mounted() {
        this.init();
    },

    data() {
        return {
            customJSON: {},
            pageLoading: false,
            miscErrors: {},
            globalSchema: {},
            pageError: false,
            product: {},
            templateSchema: {},
            is_dependent: { value: false, error: '' },
            companyId: -1,
            media: [],
            isSet: false,
            highlights: [''],
            sizes: [],
            otherSizes: [],
            customJSON: {},
            hsnDetails: {},
            isRejected: false,
            isEdit: true,
            name: '',
            brands: [],
            brandUid: 0,
            itemCode: '',
            categorySlug: '',
            hsnCode: '',
            trader_type: '',
            trader: {
                name: '',
                address: '',
            },
            departments: [],
            departmentsList: [],
            remark: '',
            traderError: '',
            traderTypeList: [],
            moq: {
                error: '',
            },
            fullfillmentError: '',
            is_active: true,
            teaser_tag: {
                type: '',
                tag: '',
            },
            company_tags: [],
            tags: [],
            tagList: [],
            product_online_date: '',
            saveText: 'Saved Successfully',
            errorText: 'Verification Failed. Please verify all fields.',

            manufacturing_time_unit: 'hours',
            is_custom_order: false,
            manufacturing_time: 0,
            manufacturing_time_unit_list: [
                { text: 'Hours', value: 'hours' },
                { text: 'Days', value: 'days' },
            ],
            maxManufacturingTime: 360,
            multiSize: true,
            minimum: this.getInitialValue(),
            maximum: this.getInitialValue(),
            limitQuantity: false,
            no_of_boxes: this.getInitialValue(),
            is_dependent: { value: false, error: '' },
            product_type: this.getInitialValue(),
            errMsgRequired: "This field is required to verify the product",
            errMsgGeneric: 'Something not right here',

            returnConfigError: '',
            returnable: false,
            return_time: 3,
            return_time_unit: 'days',
            verificationDetails: {},
            rejectedFields: {},
            actionButtons: ['Verify', 'Reject'],
            start: -1
        };
    },

    methods: {
        async init() {

            const {
                params: { id: companyId, productId:itemCode  },
                query: { id, template, uid: itemId },
            } = this.$route;
            if (companyId) {
                this.companyId = companyId;
                this.headerText = 'Product Verification Edit';
                this.pageLoading = true;
                this.itemId = itemId;
                this.itemCode = itemCode;
                this.saveText = 'Verification Status Updated';
                this.templateSlug = template;
                this.update = true;
                this.id = id
                this.start += 1;
            }

            const promiseArray = [
                this.fetchProductData(),
                this.fetchVerificationDetails(),
                this.fetchTemplateSchema(),
                this.fetchBrands(),
                this.getDepartment()
            ];

            try {
                const [
                    product,
                    verification,
                    globalSchema,
                    brandsResponse,
                    departmentsResponse
                ] = await Promise.allSettled(promiseArray);
                

                if (
                    product.status === 'rejected' ||
                    globalSchema.status === 'rejected'
                ) {
                    throw new Error('Failed');
                }
                this.product = product.value.data.data;
                this.templateSchema =
                    globalSchema.value.data.data.template_validation;
                this.globalSchema = globalSchema.value.data.data.global_validation;
                this.templateDetails = globalSchema.value.data.template_details;

                if (verification.value && verification.value.data) {
                    this.verificationDetails = verification.value.data;
                } else {
                    this.isEdit = false;
                    this.verificationDetails = {
                        company_id: this.companyId,
                        item_code: this.product.item_code,
                        rejected_fields: {},
                        remark: '',
                        status: 'pending',
                        brand_uid: this.product.brand_uid,
                        slug: this.product.slug
                    };
                }
                this.populateForm();
            } catch (error) {
                this.pageError = true;
            }
            this.pageLoading = false;
        },
        getParams(obj = {}) {
            return {
                companyId: this.companyId,
                itemId: this.itemId,
                ...obj,
            };
        },
        isEmpty(obj) {
            return isEmpty(obj);
        },
        fetchBrands() {
            const params = {
                page_size: 9999,
                company_id: this.companyId
            };
            return new Promise((resolve, reject) => {
                CompanyService.fetchBrands(params)
                    .then(({ data }) => {
                        this.brands = data.items;
                        return resolve();
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        },
        getDepartment() {
            return new Promise((resolve, reject) => {
                CatalogService.fetchDepartment()
                    .then(({ data }) => {
                        this.departments = data.items;
                        this.setDepartmentsList();
                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        fetchProductData() {
            const myParams = {
                uid: this.itemId,
            };
            return CompanyService.fetchProductDetails(this.getParams(myParams));
        },
        fetchVerificationDetails() {
            const myParams = {
                companyId: this.companyId,
                itemId: this.itemId,
                _id: this.id
            };
            return CatalogService.fetchVerificationProductDetails(
                this.getParams(myParams)
            );
        },
        fetchTemplateSchema() {
            const myParams = {
                slug: this.templateSlug,
                companyId: this.companyId
            };
            return CompanyService.fetchTemplateSchema(this.getParams(myParams));
        },
        redirectToListing(){
            this.$router.push({ path: `/administrator/product/verification/${this.companyId}/products`});
        },
        // redirectToListing() {
        //     this.$router.go(-1);
        // },
        getInitialValue() {
            return {
                value: '',
                error: '',
            };
        },
        setDepartmentsList(e = {}) {
            this.departmentsList = [];
            this.departments.forEach((d) => {
                if (
                    !e.text ||
                    d.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.departmentsList.push({
                        text: d.name,
                        value: d.uid
                    });
                    // this.departmentMap[d.uid] = d.slug;
                }
            });
            // this.setDepartmentAndCategories();
        },
        populateForm() {
            try {
                this.product_type.value = this.product_type.value
                    ? this.product_type.value
                    : this.product.item_type
                    ? this.product.item_type.toLowerCase()
                    : this.product.is_set
                    ? 'set'
                    : 'standard';
                this.setValues(this.product_type.value);
                this.categories = this.templateDetails.category_details;
                this.name = this.product.name || this.name;
                this.brandUid = this.product.brand_uid;
                this.categorySlug =
                    this.product.category_slug || this.categorySlug;
                this.itemCode = this.product.item_code || this.itemCode;
                this.trader_type = this.product.trader_type || this.trader_type;
                this.trader = this.product.trader || this.trader;
                this.customJSON = this.product._custom_json || this.customJSON;
                this.sizes = this.product.sizes || this.sizes;
                this.isRejected = this.verificationDetails.status === "rejected";
                this.remark = this.isRejected ? this.verificationDetails.remark : "";

                if ('is_set' in this.product) {
                    this.isSet = this.product.is_set;
                }

                if (
                    'return_config' in this.product &&
                    !isEmpty(this.product.return_config) &&
                    this.product.return_config.returnable
                ) {
                    this.returnable = this.product.return_config.returnable;
                    this.return_time = this.product.return_config.time;
                    this.return_time_unit = this.product.return_config.unit;
                }

                this.teaser_tag = this.product.teaser_tag || this.teaser_tag;

                this.is_custom_order =
                    (this.product.custom_order
                        ? this.product.custom_order.is_custom_order
                        : false) || this.is_custom_order;
                if (this.is_custom_order) {
                    this.manufacturing_time_unit =
                        toLower(
                            this.product.custom_order
                                ? this.product.custom_order
                                      .manufacturing_time_unit
                                : this.manufacturing_time_unit
                        ) || toLower(this.manufacturing_time_unit);
                    this.manufacturing_time =
                        (this.product.custom_order
                            ? this.product.custom_order.manufacturing_time
                            : this.manufacturing_time) ||
                        this.manufacturing_time;
                }

                this.tags = !isEmpty(this.product.tags)
                    ? this.product.tags
                    : this.tags;

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
                this.rejectedFields = rejected_fields;

            } catch (err) {
                this.$snackbar.global.showError(err.errMsgGeneric);
            }
        },
        isCheckboxSelected(value, optional = null) {
            if (Array.isArray(value)) {
                return !value.includes(optional);
            }
            return value ? false : true;
        },
        setValues(product_type) {
            switch (product_type) {
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
        updateVerifiedList(e) {
            const { key, value = '', type = 'text', index = -1} = e;

            if (type === 'array') {
                // saving values in array for array type keys
                let val_array = cloneDeep(this.rejectedFields[key] || []);
                if (!Object.keys(this.rejectedFields).includes(key)) {
                    val_array = [value]
                }
                else {
                    let current_val = new Set(val_array)
                    if (current_val.has(value)) {
                        current_val.delete(value)
                    } else {
                        current_val.add(value)
                    }
                    val_array = [...current_val]
                }
                if (!val_array.length) {
                    this.$delete(this.rejectedFields, key)
                } else {
                    this.$set(this.rejectedFields, key, val_array)
                }

            } else {
                if (Object.keys(this.rejectedFields).includes(key)) {
                    this.$delete(this.rejectedFields, key)
                } else {
                    this.$set(this.rejectedFields, key, true)
                }
            }
        },
        async save(action) {
            if (action === 'Verify') {
                // Verified
                let isValid = this.$refs['dynamicAttributes'].validateForm()
                if (Object.keys(this.rejectedFields).length) {
                    // if all fields are not verified
                    this.$snackbar.global.showError(`${this.errorText}`, {
                        duration: 2000,
                    });
                    return;

                }
                this.verificationDetails.status = 'verified';
                this.verificationDetails['rejected_fields'] = {};
            } else if (action === 'Reject') {
                // Rejected
                if (!this.isRejected) {
                    this.isRejected = true;
                    return;
                }
                this.verificationDetails['remark'] = this.remark;
                this.verificationDetails[
                    'rejected_fields'
                ] = this.rejectedFields;
                this.verificationDetails.status = 'rejected';
            }
            const query = {
                companyId: this.companyId,
                itemId: this.itemId,
            };
            const { brand_uid, item_code, item_id, slug, status, remark} = this.verificationDetails;
            const body = { brand_uid, item_code, item_id, slug, status, remark, rejected_fields: this.rejectedFields }
            try {
                const result = await CatalogService.saveVerifiedProducts({
                    ...query,
                    body: body,
                }, this.isEdit);
                if (!result) {
                    throw Error('Not Updated');
                }
                this.$snackbar.global.showSuccess(`${this.saveText}`, {
                    duration: 2000,
                });
                this.redirectToListing();
            } catch (e) {
                this.$snackbar.global.showError(`${this.errMsgGeneric}`, {
                    duration: 500,
                });
            }
        },
        saveMeta({ meta = [], json = {} }) {
            this.customJSON = json;
        },
        redirect(param) {
            const { platform } = param;
            if (platform) {
                window.open(
                    `https://platform.${env.FYND_PLATFORM_DOMAIN}/company/${this.companyId}/products/list/?search=${this.itemCode}&limit=10`,
                    '_blank'
                );
            }
            this.redirectToListing();
        },
        getImageTags() {
            return [`company_${this.companyId}`, `brand_${this.item_code}`];
        },
        
        skipProduct() {
            let nextProduct = this.verificationDetails.next_product
            if (isEmpty(nextProduct)) {
                this.$snackbar.global.showSuccess(
                    'No next product found. Redirecting to product listing.', 
                    {duration: 2000}
                );
            }
            const params = {
                id: nextProduct.id,
                uid: nextProduct.item_id,
                template: nextProduct.product.template_tag
            }
            this.$router.push({
                path: `/administrator/product/verification/${this.companyId}/products/edit/${nextProduct.item_code}`,
                query: params,
            })
            .then(success => {
                // this.init();
                this.$router.go()
            });
            
        }
    },
};
</script>
