<template>
    <div class="panel">
        <div class="header">
            <page-header
                title="Partners Support Configuration"
                :showBackButton="true"
                @backClick = "goBack"
            >
                <nitrozen-button
                    class="saveSupportDetail-btn"
                    v-flat-btn
                    :rounded="false"
                    :theme="'secondary'"
                    @click="savePartner()"
                >
                    Save
                </nitrozen-button>
            </page-header>
        </div>
        <support-Communication
            ref="support"
            class="supportCommunication"
            :type="type"
        ></support-Communication>
    </div>
</template>

<script>
import { PageHeader } from '@/components/common';
import supportCommunication from './supportCommunication.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
export default {
    name: 'support-configuration',
    components: {
        PageHeader,
        'support-Communication': supportCommunication,
        NitrozenButton
    },
    data() {
        return {
            type: 'partner'
        };
    },
    methods: {
        savePartner(){
            this.$refs.support.save();
        },
        goBack(){
            this.$router.push({
                    path: '/administrator/settings/partners'
                });
        }
    }
};
</script>

<style lang="less" scoped>
@import './../../less/page-header.less';

.panel {
    display: flex;
    flex-direction: column;
    .supportCommunication {
        position: relative;
        margin: 24px;
        top: 56.5px;
    }
}
</style>
