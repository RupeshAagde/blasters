<template>
    <div class="size-guide" v-if="sizeGuideLoaded">
        <div class="size-guide-dropdown">
            <div class="dropdown-cls mt-sm verify-block ">
                <nitrozen-checkbox
                    :checkboxValue="rejectedFields.size_guide"
                    :value="rejectedFields.size_guide ? false:true"
                    id="rejectedFields.size_guide"
                    class="nt-checkbox, checkbox-align"
                    @change="emitVerify('size_guide', size_guide)"
                >
                </nitrozen-checkbox>
                <!-- <nitrozen-input
                    disabled
                    label="Size Guide Name"
                    v-model="size_guide"
                >
                </nitrozen-input> -->
                <nitrozen-dropdown
                    disabled
                    label="Size Guide Name"
                    placeholder="Choose size guide"
                    :items="sizeGuideList"
                    v-model="size_guide"
                    autocomplete="off"
                    :searchable="true"
                    @searchInputChange="searchSizeGuide"
                >
                    <template slot="option" slot-scope="slotProps">
                        <div
                            class="custom-size-guide-dropdown"
                            :class="{ selected: slotProps.selected }"
                        >
                            <div class="text">
                                {{ slotProps.item.text }}
                            </div>
                            <nitrozen-badge
                                :state="
                                    slotProps.item.active ? 'success' : 'error'
                                "
                            >
                                {{
                                    slotProps.item.active
                                        ? 'Active'
                                        : 'InActive'
                                }}
                            </nitrozen-badge>
                        </div>
                    </template>
                </nitrozen-dropdown>
            </div>
        </div>
        <div class="add-size-guide">

            <div v-if="size_guide" class="preview-cls alignLeft">
                <div class="cl-RoyalBlue darker-xxs" @click="openPreview">
                    Preview
                </div>
            </div>
        </div>
        <SizeGuidePreview ref="size-guide-preview"></SizeGuidePreview>    
    </div>
</template>

<style lang="less" scoped>

.alignLeft {
    float: left;
    cursor: pointer;
}
.size-guide {
    margin-bottom: 12px;
    .size-guide-dropdown {
        align-items: center;
        justify-content: left;
        margin-top: 12px;

        .dropdown-cls {
            width: 100%;
        }
    }
    .add-size-guide {
        width: 100%;
        justify-content: flex-end;
        line-height: 22px;
        margin: 5px 0px;
    }
}
.custom-size-guide-dropdown {
    display: flex;
    justify-content: space-between;
    padding: 6px;
    &.selected {
        color: @White;
        background-color: @RoyalBlue;
    }
}
.preview-cls {
            margin-left: 30px;
            cursor: pointer;
        }

.mt-sm {
    margin-top: 10px;

    .nitrozen-form-input {
        width: 100%;
    }
}
.verify-block {
    display: flex;

    .block {
        display: block;
        width: 100%;
    }
}
.checkbox-align {
    margin-top: 30px;
}
</style>

<script>
import UktInlineSvg from '@/components/common/ukt-inline-svg';
import CompanyService from '../../../../services/company-admin.service';
import SizeGuidePreview from './size-guide-preview.vue';
import {
    NitrozenError,
    NitrozenButton,
    NitrozenBadge,
    NitrozenInput,
    NitrozenCheckBox,
    NitrozenDropdown
} from '@gofynd/nitrozen-vue';

export default {
    name: 'ProductSizeGuide',
    components: {
        UktInlineSvg,
        NitrozenDropdown,
        NitrozenError,
        NitrozenButton,
        NitrozenBadge,
        SizeGuidePreview,
        'nitrozen-input': NitrozenInput,
        'nitrozen-checkbox': NitrozenCheckBox,
    },
    data() {
        return {
            showAddButton: true,
            pageLoading: false,
            pageError: false,
            sizeGuideList: [],
            size_guide: '',
            sizeGuideLoaded: false,
        };
    },
    props: {
        product: {
            type: Object,
            default: () => {
                return {};
            }
        },
        brandId: {
            type: Number
        },
        companyId: {
            type: String
        },
        rejectedFields: {
            type: Object,
            default: () => {return {}}
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getSizeGuideList();
        },
        setParams() {
            if (
                this.product &&
                this.product.size_guide
            ) {
                if (this.sizeGuideList.some(tag => tag.value != this.product.size_guide)){
                    this.addSizeGuideIfAbsent(this.product.size_guide)
                }
                else {
                    this.sizeGuideLoaded = true    
                }
                this.showAddButton = false;
                this.size_guide = this.product.size_guide;
            } else {
                this.showAddButton = true;
                this.sizeGuideLoaded = true
            }
        },
        getSizeGuideList() {
            var obj = { brand_id: this.brandId };
            this.fetchSizeGuide(obj, true);
        },
        mapNameTag(obj) {
            return { text: obj.name, value: obj.tag, active: obj.active };
        },
        searchSizeGuide(e) {
            if (e.text) {
                var obj = {  company_id: this.companyId, brand_id: this.brandId, q: e.text };
                this.fetchSizeGuide(obj);
            } else {
                this.size_guide = '';
                var obj = {  company_id: this.companyId, brand_id: this.brandId };
                this.fetchSizeGuide(obj);
            }
        },
        fetchSizeGuide(obj, set = false) {
            if (this.companyId  < 1) {
                return
            }
            obj = {
                companyId: this.companyId,
                ...obj
            }
            CompanyService.getSizeGuide(obj)
                .then(({ data }) => {
                    if (data.items) {
                        this.sizeGuideList = data.items.map(this.mapNameTag);
                        this.fullSizeGuideMeta = data.items;
                        if (set) {
                            this.setParams();
                        }
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        openPreview() {
            if (!this.size_guide) {
                this.$snackbar.global.showError(
                    'To preview please select a particular size guide'
                );
                return;
            }
            let size_guide_meta = '';
            this.fullSizeGuideMeta.forEach(ele => {
                if (ele.tag === this.size_guide) {
                    size_guide_meta = ele;
                }
            });
            if (!size_guide_meta) {
                this.$snackbar.global.showError('No Preview found!');
                return;
            }
            this.$refs['size-guide-preview'].open(
                this.size_guide,
                size_guide_meta
            );
        },
        addSizeGuideIfAbsent(tag){
            if (this.companyId  < 1) {
                return
            }
            let obj = {
                tag : tag,
                companyId: this.companyId
            }
            SellerService.getSizeGuide(obj)
                .then(({ data }) => {
                    if (data.items.length > 0) {
                        console.log(data)
                        let add_obj = {
                            text: data.items[0].name,
                            value: data.items[0].tag,
                            active: data.items[0].active,
                        }
                        this.sizeGuideList.unshift(add_obj);
                        this.fullSizeGuideMeta.unshift(data.items[0]);
                        this.sizeGuideLoaded = true
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        emitVerify(name, value){
            this.$emit('trigger-verify', {'key': name, value})
        }
    }
};
</script>
