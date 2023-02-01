<template>
    <div class="container">
            <confirmation-popup ref="confirmationPopup" @onUpdate="saveSettings"></confirmation-popup>
        <div>
            <page-header title="Seller Navigation" @backClick="$router.push({ name: 'settings' })">
                <nitrozen-button ref="save-settings"  v-flatBtn theme="secondary" @click.stop="openConfirmationPopup('Save Changes?', 'If you save the changes here, it will change the navigation panel for all the sellers.', 'Yes', 'No')"> Save </nitrozen-button>
            </page-header>
        </div>
        <loader class="loading" v-if="isLoading"></loader>
        <div class="customise-container" v-if="settingsObj">
            <div class="customise-title">
                <div class="jumbotron-container">
                    <jumbotron
                        :title="'Customise'"
                        :desc="'Arrange, add, edit navigation menu items'"                  
                    ></jumbotron>
                </div>
                <div class="tabs">
                    <nitrozen-tab ref="tab" @tab-change="tabChange" :tabItem="tabs"></nitrozen-tab>
                </div>
                <sales-channel-settings ref="settings" :type="'company_level'" :permissions="permissionObj" :settings="settingsObj[deviceType].menu.company_level" @seller-panel-show="editPanel"></sales-channel-settings>
                <sales-channel-settings :type="'application_level'" :appSettings="settingsObj[deviceType].menu.sales_channel" :permissions="permissionObj" :settings="settingsObj[deviceType].menu.application_level" @seller-panel-show="editPanel"></sales-channel-settings>
                <other-sellers :settings="settingsObj[deviceType].menu.other_seller"></other-sellers>
                <footer-content :settings="settingsObj[deviceType].menu.footer_content" ></footer-content>
            </div>
            <div class="side-bar">
                <side-panel ref='sidePanel' @onSave="onSave"> </side-panel>
            </div>
            <div class="preview">
                <div class="heading">
                    <div class="title">
                        Preview
                    </div>
                    <div class="subtitle">
                        Preview of seller navigation panel
                    </div>
                </div>
                <div class="preview-container">
                    <div class="preview-setting">
                        <preview-setting :type="'company_level'" :settings="settingsObj[deviceType].menu.company_level"></preview-setting>
                    </div>

                    <div class="preview-setting">
                        <preview-setting :type="'application_level'" :appSettings="settingsObj[deviceType].menu.sales_channel" :settings="settingsObj[deviceType].menu.application_level"></preview-setting>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* Component imports */

import { PageHeader } from '@/components/common/';
import  Jumbotron from '@/components/common/jumbotron';
import SalesChannelSetting from '@/components/settings/navigation/sales-channel-settings.vue';
import PreviewSetting from '@/components/settings/navigation/preview-settings.vue';
import OtherSellers from '@/components/settings/navigation/other-sellers.vue';
import footerContentVue from '@/components/settings/navigation/footer-content.vue';
import ConfirmationPopup from '@/components/settings/navigation/confirmation-popup.vue'
import sidePanelVue from '@/components/settings/navigation/side-panel.vue';
import SellerPanleService from '@/services/seller-panel.service.js';
import loader from '@/components/common/loader';

import {
    NitrozenButton,
    flatBtn,
    NitrozenTab
} from '@gofynd/nitrozen-vue';

export default {
    name: 'seller-panel',
    components: {
        NitrozenButton,
        NitrozenTab,
        PageHeader,
        Jumbotron,
        'sales-channel-settings': SalesChannelSetting,
        'other-sellers': OtherSellers,
        'footer-content': footerContentVue,
        'side-panel': sidePanelVue,
        'preview-setting': PreviewSetting,
        'confirmation-popup': ConfirmationPopup,
        loader
    },
    mounted() {
        this.fetchSettings();
    },
    data() {
        return {
            deviceType: 'desktop',
            settingsObj: null,
            permissionObj: null,
            tabs : ['Desktop', 'Mobile'],
            isLoading: false,
        }
    },
    methods: {
        async fetchSettings() {
            this.isLoading = true;
            const [settings, permission] = await Promise.all([SellerPanleService.getPanelSettings(), SellerPanleService.getPermission()])
            this.settingsObj = settings.data
            this.permissionObj = permission.data
            this.isLoading = false;
        },
        
        editPanel(payload) {
            if (payload.isEdit) 
                this.$refs['sidePanel'].openSidePanel({ data: this.settingsObj[this.deviceType]['menu'][payload.type][payload.index], isEdit: true, type: payload.type, index: payload.index, permissions: this.permissionObj})
            else {
                this.$refs['sidePanel'].openSidePanel({ data: payload.data, isEdit: false, type: payload.type, permissions: this.permissionObj })
            }
        },
        openConfirmationPopup(header, info, confirmButtonName, cancleButtonName) {
            this.$refs["confirmationPopup"].open({
                header: header,
                info: info,
                confirmButtonName: confirmButtonName,
                cancleButtonName: cancleButtonName,
                type: 'main'
            });
        },
        saveSettings(isSave) {
            if (isSave) {
                this.isLoading = true;
                SellerPanleService.savePanelSettings(this.settingsObj).then(()=>{
                    this.fetchSettings().then(()=>{
                        this.isLoading = false;
                        this.$snackbar.global.showSuccess(`Navigation item saved successfully`, { duration: 2000 });
                    }).catch((err) => {
                        this.isLoading = false;
                        this.$snackbar.global.showError(err.message)
                    })
                }).catch((err) => {
                    this.isLoading = false;
                    this.$snackbar.global.showError(err.message)
                })
            }
        },
        tabChange(data) {
            this.deviceType = data.item === 'Desktop' ? 'desktop' : 'mobile';
        },
        onSave(payload) {
            if (payload.isEdit)
                this.$set(this.settingsObj[this.deviceType]['menu'][payload.type], payload.index, payload.data)   
            else
                this.settingsObj[this.deviceType]['menu'][payload.type].push(payload.data)                
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
        background-color: @White;
        margin-left: 22px;
        margin-right: 22px;
        margin-top: 80px;
        padding: 24px;
        position: relative;
        min-height: 400px;
        width: 75%;

        .tabs  {
            margin: 20px 0px 10px 0px;
        }
    }


}

.preview {
    cursor: pointer;
    background-color: @White;
    margin-right: 22px;
    margin-top: 80px;
    padding: 24px;
    position: relative;
    min-height: 400px;
    border-radius: 10px;
    width: 25%;

    .preview-container{
        border: 1px solid @LightGray;
        margin-top: 24px;
    }

    .heading {
        .title {
            font-weight: 700;
            font-size: 24px;
        }
        .subtitle {
            margin-top: 14px;
            font-weight: 400;
            font-size: 12px;
            color: @DarkGray;
        }

    }
}
</style>
