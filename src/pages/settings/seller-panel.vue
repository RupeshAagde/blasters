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
                <sales-channel-settings v-if="settingsObj" :type="'company_level'" :permissions="permissionObj" :settings="settingsObj[deviceType].menu.company_level" @seller-panel-show="editPanel"></sales-channel-settings>
                <sales-channel-settings v-if="settingsObj" :type="'application_level'" :permissions="permissionObj" :settings="settingsObj[deviceType].menu.application_level" @seller-panel-show="editPanel"></sales-channel-settings>
                <other-sellers></other-sellers>
                <footer-content></footer-content>
            </div>
            <div class="side-bar">
                <side-panel ref='sidePanel' @onSave="onSave"> </side-panel>
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
import SalesChannelSetting from '@/components/settings/navigation/sales-channel-settings.vue';
import OtherSellers from '@/components/settings/navigation/other-sellers.vue';
import footerContentVue from '@/components/settings/navigation/footer-content.vue';
import sidePanelVue from '@/components/settings/navigation/side-panel.vue';
import SellerPanleService from '@/services/seller-panel.service.js';

import {
    NitrozenButton,
    flatBtn,
} from '@gofynd/nitrozen-vue';
import { cloneDeep } from "lodash";
export default {
    name: 'seller-panel',
    components: {
        NitrozenButton,
        PageHeader,
        Jumbotron,
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
            permissionObj: null
        }
    },
    methods: {
        async fetchSettings() {
           const [settings, permission] = await Promise.all([SellerPanleService.getPanelSettings(), SellerPanleService.getPermission()])
            this.settingsObj = settings.data
            this.permissionObj = permission.data
        },
        
        editPanel(payload) {
            if (payload.isEdit) 
                this.$refs['sidePanel'].openSidePanel({ data: this.settingsObj[this.deviceType]['menu'][payload.type][payload.index], isEdit: true, type: payload.type, index: payload.index, permissions: this.permissionObj})
            else {
                this.$refs['sidePanel'].openSidePanel({ data: payload.data, isEdit: false, type: payload.type, permissions: this.permissionObj })
            }
        },

        saveSettings(payload) {
            SellerPanleService.savePanelSettings(payload).then(()=>{
                this.fetchSettings()
                this.$snackbar.global.showSuccess(`Navigation item saved successfully`, { duration: 2000 });
            })
        },

        onSave(payload) {
            const data = cloneDeep(this.settingsObj)

            if (payload.isEdit) 
                data[this.deviceType]['menu'][payload.type][payload.index] = payload.data;
            else
                data[this.deviceType]['menu'][payload.type].push(payload.data)

            this.saveSettings(data)
        }
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
