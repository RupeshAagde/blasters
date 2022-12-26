<template>
    <div class="container">
        <div>
            <page-header title="Seller Navigation" @backClick="$router.push({ name: 'settings' })">
                <nitrozen-button  v-flatBtn theme="secondary" @click.stop="showNavigationSection"> Save </nitrozen-button>
            </page-header>
        </div>
        <div class="customise-container">
            <div class="customise-title">
                <div class="jumbotron-container">
                    <jumbotron
                        :title="'Customise'"
                        :desc="'Arrange, add, edit navigation menu items'"                  
                    ></jumbotron>
                </div>
                <seller-navigation></seller-navigation>
                <sales-channel-settings></sales-channel-settings>
                <other-sellers></other-sellers>
                <footer-content></footer-content>
            </div>
            <div class="side-bar">
                <side-panel > </side-panel>
            </div>
            <div class="preview">
                preview
            </div>
        </div>
    </div>
</template>

<script>
/* Component imports */

import { PageHeader } from '@/components/common/';
import  Jumbotron from '@/components/common/jumbotron';
import SellerNavigation from '@/components/settings/navigation/seller-navigation.vue';
import SalesChannelSetting from '@/components/settings/navigation/sales-channel-settings.vue';
import OtherSellers from '@/components/settings/navigation/other-sellers.vue';
import footerContentVue from '@/components/settings/navigation/footer-content.vue';
import sidePanelVue from '@/components/settings/navigation/side-panel.vue';

import {
    NitrozenButton,
    flatBtn,
} from '@gofynd/nitrozen-vue';

export default {
    name: 'seller-panel',
    components: {
        NitrozenButton,
        PageHeader,
        Jumbotron,
        'seller-navigation': SellerNavigation,
        'sales-channel-settings': SalesChannelSetting,
        'other-sellers': OtherSellers,
        'footer-content': footerContentVue,
        'side-panel': sidePanelVue
    },
    data() {
        return {

        }
    },
    methods: {
     },
    directives: {
        flatBtn
    },
}
</script>


<style lang="less" scoped>


.customise-container {
    display: flex;
    .customise-title {
        cursor: pointer;
        background-color: white;
        margin-left: 22px;
        margin-right: 22px;
        margin-top: 80px;
        padding: 24px;
        position: relative;
        min-height: 400px;
        width: 75%;
    }


}

.preview {
    cursor: pointer;
    background-color: white;
    margin-right: 22px;
    margin-top: 80px;
    padding: 24px;
    position: relative;
    min-height: 400px;
    border-radius: 10px;
    width: 25%;
}
</style>
