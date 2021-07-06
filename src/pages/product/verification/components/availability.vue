<template>
    <div class="container">
        <div class="header mt-sm">
           
            <div class="title bold">Available</div>
            <div class="btn-container">
                <!-- toogle button -->
                <nitrozen-toggle-btn
                    class="active-btn"
                    :value="is_active.value"
                    @change="onToggleActive"
                />
            </div>
            <nitrozen-error v-if="product_online_date.error">
                {{ product_online_date.error }}
            </nitrozen-error>
        </div>
        <div class="display_date" v-if="is_set && is_active.value">
             <nitrozen-checkbox
                            :checkboxValue="rejectedFields.availability"
                            v-model="rejectedFields.availability"
                            id="rejectedFields.no_of_boxes"
                            class="nt-checkbox"
                            @change="trigger - verify"
                        >
            </nitrozen-checkbox>
            <div class="title bold">
                {{ published ? "Published on : " : "Will be Available on : "}}
            </div>
            <div class="info">
                <div class="title">{{ dateString }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>

.title {
    margin-top: 12px;
    font-size: 14px;
    color: @Mako;
}
.bold {
    font-weight: 500;
}

.container {
    white-space: nowrap;
    .header {
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
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

.display_date {
    margin-top: 24px;
    .title {
        font-size: 14px;
    }
}

.st-date {
    margin-left: 20px;
}
.date {
    display: flex;
    ::v-deep .form-row {
        margin: unset;
    }
}
</style>

<script>
import { NitrozenError, NitrozenToggleBtn, NitrozenCheckBox } from '@gofynd/nitrozen-vue';
import isEmpty from 'lodash/isEmpty';
import admInlineSvg from '@/components/common/adm-inline-svg.vue';

const VALIDATE_FIELDS = [
    'is_active',
    'product_online_date',
    'is_set'
];

export default {
    name: 'ProductDetails',
    components: {
        NitrozenError,
        NitrozenToggleBtn,
        'adm-inline-svg': admInlineSvg,
        'nitrozen-checkbox': NitrozenCheckBox
    },

    data() {
        return {
            is_active: this.getInitialValue(),
            product_online_date: this.getInitialValue(),
            errMsgGeneric: 'Something went wrong',
            dateString: '',
            is_set: false,
            published: false
        };
    },
    props: {
        product: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {
        isEmpty: isEmpty,
        getInitialValue() {
            return {
                value: '',
                error: ''
            };
        },
        populateForm() {
            try {
                if (this.product.product_publish && !this.product_online_date.value) {
                    if (this.product.product_publish.is_set) {
                        this.product_online_date.value = this.product.product_publish.product_online_date;
                    }
                    this.is_set = this.product.product_publish.is_set;
                    this.published = new Date(this.product_online_date.value)  < new Date();
                    this.dateString = new Date(
                        this.product.product_publish.product_online_date
                    ).toDateString() + ', '  + new Date(
                        this.product.product_publish.product_online_date
                    ).toLocaleString().substring(11)
                }
                if ('is_active' in this.product) {
                    this.is_active.value = this.product.is_active;
                } else {
                    this.is_active.value = true;
                }
            } catch (err) {
                this.$snackbar.global.showError('Something not right here');
                console.error(err);
            }
        },
        onToggleActive() {
            this.is_active.value = !this.is_active.value;
        },

    }
};
</script>
