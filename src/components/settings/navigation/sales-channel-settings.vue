<template>
    <div class="company">
        <div class="company-title">
            <div class="company-menu">
                <div>
                    Seller Channel Settings
                </div>
                <div id="company-setting">
                    <inline-svg :src="'edit_pen'" class="icon"></inline-svg>
                </div>
            </div>
            <div class="grp-btn-close">
                <div class="check">
                    <nitrozen-checkbox> Show Create Button </nitrozen-checkbox>
                </div>
                <div class="add-menu-btn">
                    <nitrozen-button  v-strokeBtn size:='small' theme="secondary"> Add Menu Item </nitrozen-button>
                </div>
                <div class="menu-close">
                    <inline-svg :src="'arrow_down'" class="icon"></inline-svg>
                </div>
            </div>
        </div>
        <hr class="line">
        <div>
            <seller-navigation-list></seller-navigation-list>
            <seller-navigation-list></seller-navigation-list>
        </div>
    </div>
</template>

<script>


import {
    NitrozenButton,
    strokeBtn,
    NitrozenToggleBtn,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SellerNavigationList from './seller-navigation-list.vue'

export default {
    name: 'seller-channel-settings',
    components: {
        NitrozenButton,
        'inline-svg': inlineSvgVue,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'seller-navigation-list': SellerNavigationList,
        'nitrozen-checkbox': NitrozenCheckBox
    },
    directives: {
        strokeBtn
    },
};
</script>

<style lang="less" scoped>
    .company {
        margin-top: 22px;
        border-radius: 3px;
        border: 1px solid #E4E5E6;
        .company-title {
            display: flex;
            align-content: center;
            align-items: center;
            padding: 16px 20px;
            justify-content: space-between;
            .company-menu {
                font-weight: 600;
                font-size: 18px;
                display: flex;
            }

            .company-menu #company-setting {
                margin-left: 15px;
            }
            .grp-btn-close{
                display: flex;
                align-items: center;
                .menu-close{
                    padding-left: 25px;
                }
            }

            .check {
                margin-right: 10px;
            }

        }
        .line {
            border: 0.5px solid #E4E5E6;
            margin: 0px;
        }

    }
</style>
