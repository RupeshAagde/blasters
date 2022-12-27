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
                <seller-navigation v-if="settingsObj" :settings="settingsObj[deviceType].menu.company_level" @change-list="updateList" @seller-panel-show="editPanel"></seller-navigation>
                <sales-channel-settings v-if="settingsObj" :settings="settingsObj[deviceType].menu.application_level" @change-list="updateList" @seller-panel-show="editPanel"></sales-channel-settings>
                <other-sellers></other-sellers>
                <footer-content></footer-content>
            </div>
            <div class="side-bar">
                <side-panel> </side-panel>
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
import SellerPanleService from '@/services/seller-panel.service.js';

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
    mounted() {
        this.fetchSettings();
    },
    data() {
        return {
            deviceType: 'desktop',
            settingsObj: null,
        }
    },
    methods: {
        async fetchSettings() {
            const { data } = await SellerPanleService.getPanelSettings()
            this.settingsObj = data
        },
        updateList(payload) {
            
            this.settingsObj[this.deviceType][payload.type === 'company' ? 'menu.company_level' : 'menu.application_level'] = payload.data
            console.log(this.settingsObj);
        },
        editPanel(payload) {
            console.log(payload);
            let arr = this.settingsObj[this.deviceType][payload.type === 'company' ? 'menu.company_level' : 'menu.application_level']
            for (let index = 0; index < arr.length; index++) {
                if (arr[index]['title'] === payload.id) {
                    this.$root.$emit('seller-panel-navigation', arr[index]);
                    break;
                }
            }   
        },
        
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
