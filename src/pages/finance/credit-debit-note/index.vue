<template>
    <div class="panel">
        <!-- <page-header
            title="Credit Note"
        >
        @backClick="$router.push({ name: 'settings' })"
        @click="save"
        </page-header> -->
        <div class="jumbotron-container">
            <jumbotron
                :title="'Credit/Debit Note Issuance'"
                :desc="'Credit/Debit Note Issuance'"
            ></jumbotron>
        </div>
        <div class="main-container">
            <div class="page-container">
                <div class="group-name-container">
                    <nitrozen-tab
                        class="group-tab"
                        :activeIndex="activeGroupIndex"
                        @tab-change="changeGroupIndex"
                        :tabItem="tabs"
                        :label="'name'"
                    ></nitrozen-tab>
                </div>
                <div v-if="activeGroupIndex === 0">
                    <credit-note-component note-type = "credit" :key="0" @is-bulk-upload-open="handleBulkUpload($event)" :isBulkUpload="isBulkUpload"></credit-note-component>
                </div>
                <div v-if="activeGroupIndex === 1">
                    <credit-note-component note-type = "debit" :key="1"  @is-bulk-upload-open="handleBulkUpload($event)" :isBulkUpload="isBulkUpload"></credit-note-component>
                </div>
            </div>
            <!-- <credit-note-component></credit-note-component> -->
        </div>
    </div>
</template>

<script>
import PageEmpty from '@/components/common/page-empty';
import Jumbotron from '@/components/common/jumbotron';
import PageError from '@/components/common/page-error';
/* import InlineSvg from '@/components/common/inline-svg';
import AdmInlineSvg from '@/components/common/inline-svg'; */
//import InternalSettingsService from '@/services/internal-settings.service';
import { Loader, PageHeader } from '@/components/common/';
//import { validUrl } from '@/helper/utils';
import CreditNoteComponent from './cn-dn-home.vue';
import {
    //NitrozenInput,
    //NitrozenError,
    //NitrozenButton,
    //NitrozenDropdown,
    //strokeBtn,
    //flatBtn,
    //NitrozenBadge,
    //NitrozenDialog,
    //NitrozenCheckBox,
    NitrozenTab
} from '@gofynd/nitrozen-vue';
export default {
    name: 'credit-note',
    components: {
        PageEmpty,
        //InlineSvg,
        PageError,
        //NitrozenInput,
        //NitrozenBadge,
        //NitrozenDialog,
        //NitrozenError,
        //NitrozenDropdown,
        //NitrozenButton,
        PageHeader,
        Loader,
        //AdmInlineSvg,
        //NitrozenCheckBox,
        CreditNoteComponent,
        'nitrozen-tab': NitrozenTab,
        Jumbotron,
    },
    /* directives: {
        strokeBtn,
        flatBtn
    }, */
    data() {
        return {
            activeGroupIndex: Number(this.$route.query.activeTab) ?  Number(this.$route.query.activeTab) : 0,
            //componentKey: 0,
            tabs: [{ name: 'Credit Note' }, {name: 'Debit Note'}],
            isBulkUpload : false,
        };
    },
    mounted(){
        if (this.$route.query.hasOwnProperty('activeTab')) {
            this.changeGroupIndex({
                index: Number(this.$route.query.activeTab)
            });
        }
    },
    methods: {
        changeGroupIndex(item) {
            this.activeGroupIndex = item.index;
            this.$router.replace({
            name: 'credit-debit-note',
            query: { ...this.$route.query, activeTab: item.index }
            }).catch(()=>{});
        },
        handleBulkUpload(e){
          this.isBulkUpload = e;
        },
    }
}
</script>

<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;

    .main-container {
        margin: 12px;
        //top: 56.5px;
        position: relative;
        .page-container {
            width: 95%;
            margin: 0 auto;
            display: block;
            //background: transparent;
            padding: 24px 16px;
            .group-name-container {
                margin-bottom: 24px;
                .group-tab {
                    border-bottom: 1px solid #e4e5e6;
                    /deep/.nitrozen-tab {
                        padding: 0px;
                    }
                }
            }
        }
    }
}


</style>
