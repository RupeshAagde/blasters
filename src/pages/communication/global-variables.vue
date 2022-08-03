<template>
    <div>
        <adm-page-header title="Global Variable" @backClick="backRedirect">
            <div class="header-button-container">
                <nitrozen-button
                    :theme="'secondary'"
                    v-flatBtn
                    @click="save(false)"
                    class="btn-wrapper"
                    >Save</nitrozen-button
                >
            </div>
        </adm-page-header>
        <div class="main-body">
            <div class="container">
                <span class="title">Editable</span>
                <div class="form-field">
                    <div
                        class="object"
                        :key="index"
                        v-for="(from_address, index) in from_address.value"
                    >
                        <div class="field-wrap">
                            <nitrozen-input v-model="variable" :disabled="true">
                            </nitrozen-input>
                        </div>
                        <div class="field-wrap value">
                            <nitrozen-input
                                v-model="from_address.key"
                                :label="'Key*'"
                                :placeholder="'Enter your key'"
                            >
                            </nitrozen-input>
                            <nitrozen-error v-if="from_address.nameError"
                                >{{ from_address.nameError }}
                            </nitrozen-error>
                        </div>
                        <div
                            id="pageLink"
                            class="copy"
                            @click="
                                copyToClipboard(from_address.key, $event, true)
                            "
                        >
                            <adm-inline-svg src="copy"></adm-inline-svg>
                        </div>
                        <div class="field-wrap value">
                            <nitrozen-input
                                v-model="from_address.value"
                                :label="'Value*'"
                                :placeholder="'Enter your value'"
                            >
                            </nitrozen-input>
                            <nitrozen-error v-if="from_address.emailError"
                                >{{ from_address.emailError }}
                            </nitrozen-error>
                        </div>
                        <div
                            id="pageLink"
                            class="copy"
                            @click="copyToClipboard(from_address.value, $event)"
                        >
                            <adm-inline-svg src="copy"></adm-inline-svg>
                        </div>

                        <div
                            @click="openDialog(index)"
                            class="link mg-r-24 remove"
                        >
                            <adm-inline-svg src="delete"></adm-inline-svg>
                        </div>
                    </div>
                    <div @click="addMoreFrom" class="bold-link">Add more</div>
                </div>
            </div>
        </div>
        <div class="main-body-1">
            <div class="container">
                <span class="title">Read Only</span>
                <div class="form-field">
                    <div
                        class="object"
                        :key="index"
                        v-for="(from_address, index) in read_only"
                    >
                        <div class="field-wrap read">
                            <nitrozen-input
                                v-model="from_address.key"
                                :label="'Key*'"
                                :placeholder="'Enter your key'"
                                :disabled="true"
                            >
                            </nitrozen-input>
                        </div>
                        <div
                            id="pageLink"
                            class="copy"
                            @click="copyToClipboard(from_address.key, $event)"
                        >
                            <adm-inline-svg src="copy"></adm-inline-svg>
                        </div>
                        <div class="field-wrap value">
                            <nitrozen-input
                                v-model="from_address.value"
                                :label="'Value*'"
                                :placeholder="'Enter your value'"
                                :disabled="true"
                            >
                            </nitrozen-input>
                        </div>
                        <div
                            id="pageLink"
                            class="copy"
                            @click="copyToClipboard(from_address.value, $event)"
                        >
                            <adm-inline-svg src="copy"></adm-inline-svg>
                        </div>
                        <div @click="editRedirection(from_address.key)">
                            <adm-inline-svg
                                class="remove"
                                src="edit"
                            ></adm-inline-svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nitrozen-dialog
            ref="confirm_delete_payout"
            title="Confirm"
            @close="closeDialog"
        >
            <template slot="body" name="body"
                >Are you sure you want to delete variable?</template
            >
            <template slot="footer">
                <div>
                    <nitrozen-button
                        class="mr24"
                        @click="save(true)"
                        v-flatBtn
                        :theme="'secondary'"
                        >Delete</nitrozen-button
                    >
                    <nitrozen-button
                        @click="closeDialog()"
                        v-strokeBtn
                        :theme="'secondary'"
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>
    </div>
</template>
<script>
import Jumbotron from '@/components/common/jumbotron';
import loader from '@/components/common/loader.vue';
import PageHeader from '@/components/common/layout/page-header';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import CommunicationServices from '../../services/pointblank.service';
import { copyToClipboard } from '@/helper/utils.js';

import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenError,
    NitrozenDialog,
} from '@gofynd/nitrozen-vue';
export default {
    name: 'global-variables',
    components: {
        loader: loader,
        'nitrozen-button': NitrozenButton,
        'adm-page-header': PageHeader,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'adm-inline-svg': adminlinesvg,
        'nitrozen-dialog': NitrozenDialog,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            from_address: this.getInitialValue([
                {
                    name: null,
                    email: null,
                    nameError: '',
                    emailError: '',
                    is_default: true,
                },
            ]),
            read_only: [],
            loading: true,
            delete: '',
            index: '',
            variable: 'global_variables.',
        };
    },
    mounted() {
        this.getVariables();
    },
    methods: {
        copyToClipboard(data, event, key = false) {
            if (key) {
                copyToClipboard('global_variables.' + data);
            } else {
                copyToClipboard(data);
            }
            this.$snackbar.global.showInfo('Copied to clipboard');
            event.stopPropagation();
        },
        editRedirection(entity) {
            if(entity == 'support_mobile' || entity == 'support_email'){
                this.$router.push({
                             path: `/administrator/support/configuration`
                        });
            }
            else{
                this.$router.push({
                             path: `/administrator/settings/basic`
                        });
            }
        },

        getVariables() {
            let data = {};
            CommunicationServices.getGlobalVariables().then((res) => {
                data = res.data;
                let editable = Object.entries(data.editable).map(
                    ([key, value]) => ({ key, value })
                );
                let readOnly = Object.entries(data.read_only).map(
                    ([key, value]) => ({ key, value })
                );
                this.from_address.value = editable;
                if (this.from_address.value.length == 0) {
                    this.addMoreFrom();
                }
                this.read_only = readOnly;
            });
        },
        backRedirect() {
            this.$router.back();
        },
        getInitialValue(val = null) {
            return {
                showerror: false,
                value: val,
                errortext: '',
            };
        },
        addMoreFrom() {
            this.from_address.value.push({
                name: null,
                email: null,
                nameError: '',
                emailError: '',
                is_default: false,
            });
        },
        removeFrom(index) {
            this.from_address.value.splice(index, 1);
            if (this.from_address.value.length == 0) {
                this.addMoreFrom();
            }
            this.closeDialog();
        },
        closeDialog() {
            this.$refs['confirm_delete_payout'].close({});
        },
        openDialog(index) {
            this.index = index;
            this.$refs['confirm_delete_payout'].open({
                width: '400px',
                positiveButtonLabel: 'Yes',
                negativeButtonLabel: 'No',
                neutralButtonLabel: false,
            });
        },
        save(del) {
            if (del) {
                this.removeFrom(this.index);
            }
            const res = {};
            this.from_address.value.forEach(({ key, value }) =>
                Object.assign(res, { [key]: value })
            );
            let data = { global_variables: res };
            CommunicationServices.postGlobalVariables(data)
                .then((data) => {
                    this.$snackbar.global.showSuccess(
                        'Email provider updated successfully'
                    );
                    return data;
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
    },
};
</script>
<style lang="less" scoped>
.main-body {
    margin: 78.5px 24px 24px 24px;
    @media @mobile {
        margin: 0 0 48px 0;
    }
}
.main-body-1 {
    margin: 12px 24px 24px 24px;
}
.container {
    background: @White;
    border-radius: 4px;
    padding: 24px;
    width: 95%;
}
.object {
    display: flex;
    margin-bottom: 12px;
    align-items: flex-end;
}
.value {
    width: 45%;
    //margin-left: 36px;
}
.title {
    font-weight: bold;
}
.form-field{
margin-top: 12px;
}
::v-deep .from-container {
    margin-top: 12px;
}
.remove {
    margin-bottom: 10px;
    cursor: pointer;
}
.copy {
    padding: 2px 10px 14px 8px;
    cursor: pointer;
    /deep/ svg {
        width: 16px;
        height: 16px;
    }
}
/deep/ .bold-link {
    text-align: left;
}
.bold-link {
    color: #2e31be;
    cursor: pointer;
    margin-bottom: 0px;
    margin-top: 12px;
    font-weight: 700;
    font-size: 13px;
}
.read {
    width: 50%;
}
</style>