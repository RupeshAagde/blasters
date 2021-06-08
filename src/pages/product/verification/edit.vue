<template>
    <div>
        <div>
            <page-header :title="headerText" @backClick="redirectToListing">
                <div class="page-slot">
                    <div class="left-space-txb">
                        <!-- <div v-if="update">
                            <nitrozen-badge v-if="is_active" state="success"
                                >Active</nitrozen-badge
                            >
                            <nitrozen-badge v-if="!is_active" state="warn"
                                >Disabled</nitrozen-badge
                            >
                        </div> -->
                    </div>
                    <div class="button-box">
                        <label
                            :class="is_active ? 'active-dept' : 'disabled-dept'"
                        >
                            <span>{{ is_active ? 'Active' : 'Disabled' }}</span>
                            <nitrozen-toggle-btn
                                v-model="is_active"
                                :title="
                                    is_active
                                        ? 'Disable Category'
                                        : 'Enable Category'
                                "
                            ></nitrozen-toggle-btn>
                        </label>
                        <span>
                            <nitrozen-button
                                class="left-space-txb"
                                :theme="'secondary'"
                                ref="save"
                                @click="save"
                                v-flatBtn
                                >Edit</nitrozen-button
                            >
                        </span>
                    </div>
                </div>
            </page-header>
        </div>
        <img
            src="/public/assets/loader.gif"
            class="cust-loader"
            v-if="pageLoading"
        />
        <page-error
            class="cust-error"
            v-else-if="pageError && !pageLoading"
            @tryAgain="updateData"
        ></page-error>
        <div v-if="!pageLoading && !pageError" class="main-container">
            <product-details
                ref="details"
                :edit-mode="[]"
                :product="{ name: 'Product' }"
                :global-schema="{}"
                :brands="[]"
                :categories="[]"
                teaser="teaser_tag"
                :is_physical="true"
                product_type="product_type"
                :departments="[]"
                :is_dependent="true"
                :no_of_boxes="2"
                @input-name="name = $event"
            ></product-details>
            <media
                class="mr-md cursor-move"
                v-for="(m, index) of []"
                :key="index"
                label="Product Image"
                aspectRatio="*"
                :minimumResolution="{
                    width: 200,
                    height: 200,
                }"
                :value="{}"
                :index="index"
                :fileName="name || 'product'"
                :tags="getImageTags()"
                namespace="products-item-image"
            ></media>
        </div>
    </div>
</template>
<style lang="less" scoped>
::v-deep .page-slot {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center;
}
.button-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .active-dept {
        color: #2e31be;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: 600;
    }

    .disabled-dept {
        color: #9b9b9b;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: 600;
    }
}
.cust-error {
    margin-top: 60px;
}
.cust-loader {
    display: flex;
    align-items: center;
    margin: 120px auto 0 auto;
    justify-content: center;
    height: 100px;
}
.left-space-txb {
    margin-left: 12px;
}
.label {
    color: #9b9b9b;
    font-size: 14px;
    margin-bottom: 6px;
    font-weight: 500;
}
.inline {
    display: flex;
}
.chip-wrapper {
    margin-top: 12px;
    flex-wrap: wrap;
}
.logo-container {
    margin-bottom: 24px;
    .row {
        margin-bottom: 10px;
    }
}
.extra-params-saperator {
    width: 49.5%;
    border-top: 1px dashed #e4e5e6;
    height: 1px;
    margin: 12px 0;
}
.extra-params {
    border: 1px solid #dadada;
    border-radius: 5px;
    padding: 24px;
    flex-direction: column;
    margin-bottom: 24px;
    width: 45%;
    display: flex;
    justify-content: space-between;
    .box-title {
        color: #9b9b9b;
        font-size: 14px;
        margin-bottom: 5px;
    }
    .input-box {
        display: flex;
    }
    .nitrozen-form-input {
        margin-right: 12px;
    }
    .input {
        width: 50%;
    }
    .delete {
        cursor: pointer;
        padding-top: 18px;
        align-self: center;
    }
}
.main-container {
    background-color: #fff;
    border-radius: 4px;
    margin: 85px 24px 24px 24px !important;
    padding: 24px;
    font-family: Inter;

    .row-1 {
        width: 100%;
        margin: 0 0 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .input-box {
            width: 50%;
        }
    }
}
</style>
<script>
import CompanyService from '@/services/company-admin.service';
import CatalogService from '@/services/catalog.service';
import PageHeader from '@/components/common/layout/page-header';
import loader from '@/components/common/loader';
import Shimmer from '@/components/common/shimmer';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import { ImageUploaderTile } from '@/components/common/';
import { convertToSlug } from '@/helper/utils';
import PageError from '@/components/common/page-error';

import { ProductDetails, Media } from './components';
import {
    NitrozenInput,
    NitrozenError,
    NitrozenButton,
    NitrozenChips,
    NitrozenInline,
    NitrozenBadge,
    NitrozenToggleBtn,
    NitrozenDropdown,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';

export default {
    name: 'create-update-category',
    components: {
        'nitrozen-chips': NitrozenChips,
        loader,
        PageHeader,
        PageError,
        Shimmer,
        NitrozenInput,
        NitrozenBadge,
        NitrozenError,
        ImageUploaderTile,
        NitrozenToggleBtn,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenInline,
        'product-details': ProductDetails,
        'adm-inline-svg': adminlinesvg,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    mounted() {
        if (this.$route.params.id) {
            this.pageLoading = true;
            this.companyId = this.$route.params.id;
            this.update = true;
            this.headerText = 'Product Verification Edit';
            this.saveText = 'Product Updated Successfully';
            this.isEdit = this.$route.params.id ? true : false;
        }
        this.init();
    },
    data() {
        return {
            update: false,
            is_active: true,
            pageLoading: false,
            pageError: false,
            isEdit: false,
            productId: this.$route.params.productId,
            errors: {},
            miscErrors: {},
            saveText: 'Category saved successfully',
            headerText: 'Create Category',
            brandId: null,
        };
    },

    methods: {
        async init() {
            const promiseArray = [this.fetchProductData(), this.fetchVerificationDetails()];
            const response = await Promise.all(promiseArray)
            console.log("response======", response);
            try {
            } catch (error) {}
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
            return CompanyService.fetchProductDetails(this.getParams());
        },
        fetchVerificationDetails(){
            return CatalogService.fetchVerificationProductDetails(this.getParams());
        },
        redirectToListing() {
            this.$router.push({ path: '/administrator/product/category' });
        },
        getImageTags() {
            return [`company_${this.companyId}`, `brand_${this.brandId}`];
        },
    },
};
</script>
