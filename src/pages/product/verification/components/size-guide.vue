<template>
    <div class="size-guide" v-if="sizeGuideLoaded">
        <nitrozen-error v-if="rejectedFields.size_guide">
                {{ errMsgRequired }}
        </nitrozen-error>
        <div class="size-guide-dropdown">
            <div class="dropdown-cls mt-sm verify-block ">
                <nitrozen-checkbox
                    :checkboxValue="rejectedFields.size_guide"
                    :value="isCheckboxSelected(rejectedFields.size_guide)"
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
                <nitrozen-input
                    disabled
                    label="Size Guide Name"
                    v-model="size_guide_name"
                >
                </nitrozen-input>
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
            pageLoading: false,
            pageError: false,
            sizeGuideList: [],
            size_guide: '',
            sizeGuideLoaded: false,
            errMsgRequired: "This field is not verified",
            size_guide_name:''
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
            this.sizeGuideLoaded = true
            if (
                this.product &&
                this.product.size_guide
            ) {
                let values = this.sizeGuideList.filter(sizeguide =>
                    sizeguide.value === this.product.size_guide
                );
                this.size_guide =  this.product.size_guide;
                this.size_guide_name = values.length > 0 ? values[0].text : this.product.size_guide;
            }
        },
        getSizeGuideList() {
            var obj = { brand_id: this.brandId };
            this.fetchSizeGuide(obj, true);
        },
        mapNameTag(obj) {
            return { text: obj.name, value: obj.tag, active: obj.active };
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
        isCheckboxSelected(value, optional = null) {
            if (Array.isArray(value)) {
                return !value.includes(optional);
            }
            return value ? false : true;
        },
        emitVerify(name, value){
            this.$emit('trigger-verify', {'key': name, value})
        }
    }
};
</script>
