<template>
    <div class="extension-card">
        <div v-if="show_selection">
            <div class="extension-checkbox">
                <nitrozen-checkbox
                    :name="extension.slug"
                    v-model="extension.is_selected"
                >
                </nitrozen-checkbox>
            </div>
        </div>
        <div v-if="remove_button" @click="$emit('remove')" class="cross-icon">
            <nitrozen-inline
                :icon="'cross'"
                class="nitrozen-icon"
            ></nitrozen-inline>
        </div>
        <div class="extension-inner">
            <div class="base-card-left">
                <img class="ext-icon" :src="extension.listing_info.icon" />
            </div>
            <div class="base-card-right">
                <div
                    class="extension-name"
                    :title="extension.listing_info.name"
                >
                    {{
                        extension.listing_info.name.length > 28
                            ? extension.listing_info.name.substr(0, 28) + '...'
                            : extension.listing_info.name
                    }}
                </div>
                <div class="extension-creator">
                    by
                    {{ extension.organization? extension.organization.name: '' }}
                </div>
                <div class="extension-price">
                    <span
                        v-if="
                            extension.plans &&
                                extension.plans.length &&
                                extension.plans[0].price.amount
                        "
                        >{{ extension.plans[0].price.amount | currencyformat }}
                    </span>
                    <span v-else>Free</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.extension-card {
    min-width: 200px;
    display: flex;
    align-items: center;
    margin: 10px;
    padding: 10px;
    transition: all 0.5s ease;
    border: 1px solid #e0e0e0;
    position: relative;
    .extension-checkbox {
        pointer-events: none;
    }
    .cross-icon {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 30px;
        height: 29px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 100%;
        opacity: 1;
        transition: all 0.5s ease;
        cursor: pointer;
        .nitrozen-icon {
            top: -5px;
            position: relative;
        }
    }
    .extension-inner {
        min-width: calc(100% - 20px);
        display: flex;
    }
    &:hover {
        .cross-icon {
            transition: all 0.5s ease;
            opacity: 1;
        }
        box-shadow: 0 9px 13px 0 rgb(221 221 221);
        transition: all 0.5s ease;
    }
}
.base-card-left {
    .ext-icon {
        width: 48px;
    }
}
.base-card-right {
    flex: 1;
    padding-left: 24px;
    word-break: break-all;
    .extension-name {
        color: @RoyalBlue;
        font-weight: 500;
        margin-bottom: 6px;
        line-height: 1.5;
        font-size: 16px;
        // white-space: nowrap;
    }
    .extension-creator {
        color: @Mako;
        margin-bottom: 12px;
        font-size: 12px;
        font-weight: 400;
    }
    .extension-tag-line {
        color: @Mako;
        margin-bottom: 18px;
        line-height: 19px;
        font-size: 14px;
        font-weight: 300;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .extension-price {
        color: @Mako;
        font-weight: 300;
        margin-bottom: 6px;
    }
}
</style>

<script>
import {
    NitrozenInline,
    NitrozenCheckBox,
} from '@gofynd/nitrozen-vue';
export default {
    name: 'public-extension-card',
    props: {
        extension: {
            type: Object,
            required: true
        },
        show_selection: {
            type: Boolean,
            default: false
        },
        remove_button: {
            type: Boolean,
            default: false
        }
    },
    components: {
       'nitrozen-inline' : NitrozenInline,
       'nitrozen-checkbox' : NitrozenCheckBox
    }
};
</script>
