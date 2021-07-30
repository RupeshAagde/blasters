<template>
    <div class="size-guide">
        <div class="size-guide-dropdown">
            <div class="dropdown-cls mt-sm verify-block ">
                <nitrozen-checkbox
                    :disabled="displayCheck('size_guide')"
                    :checkboxValue="rejectedFields.size_guide"
                    :value="rejectedFields.size_guide ? false:true"
                    id="rejectedFields.size_guide"
                    class="nt-checkbox"
                    @change="emitVerify('size_guide', size_guide)"
                >
                </nitrozen-checkbox>
                <nitrozen-input
                    disabled
                    label="Size Guide Name"
                    v-model="size_guide"
                >
                </nitrozen-input>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>

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
</style>

<script>
import UktInlineSvg from '@/components/common/ukt-inline-svg';
import CompanyService from '../../../../services/company-admin.service';
import {
    NitrozenError,
    NitrozenButton,
    NitrozenBadge,
    NitrozenInput,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';

export default {
    name: 'ProductSizeGuide',
    components: {
        UktInlineSvg,
        NitrozenError,
        NitrozenButton,
        NitrozenBadge,
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
        all_required_fields: {
            type: Array,
            default: () => {
                return []
            }
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
        displayCheck(fieldName){
            return !(this.all_required_fields.includes(fieldName))
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
