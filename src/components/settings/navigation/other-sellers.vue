<template>
        <div class="company-title">
            <div class="company-menu">
                    <div class="company-name">
                        {{ settings.title }}
                    </div>
                    <edit-header ref="editPopUp" :title="settings.title" @saveTitle="settings.title = $event"></edit-header>
                    <div class="company-edit" @click="editHeader">
                        <inline-svg :src="'edit_pen'" class="icon"></inline-svg>
                    </div>
            </div>
            <div class="grp-btn-close">
                <div class="add-menu-btn">
                    <nitrozen-toggle-btn v-model="settings.is_visible"> </nitrozen-toggle-btn>
                </div>
            </div>
        </div>
</template>

<script>


import {
    NitrozenButton,
    strokeBtn,
    NitrozenToggleBtn
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SellerNavigationList from './seller-navigation-list.vue'
import EditHeader from './edit-header.vue'


export default {
    name: 'other-seller',
    props: ['settings'],
    components: {
        NitrozenButton,
        'inline-svg': inlineSvgVue,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'seller-navigation-list': SellerNavigationList,
        'edit-header': EditHeader, 
    },
    methods: {
        editHeader() {
            this.$refs["editPopUp"].open(this.settings.title)
        },
    },

    directives: {
        strokeBtn
    },
};
</script>

<style lang="less" scoped>

        
        .company-title {
            margin-top: 22px;
            border-radius: 3px;
            border: 1px solid @Gray;
            height: 71px;
            padding: 0px 20px 0px 20px;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            display: flex;
            .company-menu {
                font-weight: 600;
                font-size: 18px;
                display: flex;
            }

        }

        .company-edit {
            margin-left: 15px;
        }


    
</style>
