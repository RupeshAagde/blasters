<template>
    <div class="form-wrapper">
        <div class="title">Details</div>
        <div class="form-field">
            <nitrozen-input
                v-model="data.name.value"
                :label="'Name*'"
                :placeholder="'Enter name'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.name.showerror"
                >{{ data.name.errortext }}
            </nitrozen-error>
        </div>
        <div class="form-field">
            <nitrozen-input
                v-model="data.description.value"
                :label="'Description'"
                :placeholder="'Enter description'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.description.showerror"
                >{{ data.description.errortext }}
            </nitrozen-error>
        </div>
        <div class="form-field">
            <nitrozen-input
                v-model="data.senderid.value"
                :label="'Sender id*'"
                :placeholder="'Enter sender id'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.senderid.showerror"
                >{{ data.senderid.errortext }}
            </nitrozen-error>
        </div>

        <div class="form-field">
            <nitrozen-input
                v-model="data.username.value"
                :label="'Username*'"
                :placeholder="'Enter username'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.username.showerror"
                >{{ data.username.errortext }}
            </nitrozen-error>
        </div>

        <div class="form-field">
            <nitrozen-input
                v-model="data.password.value"
                :label="'Password*'"
                :placeholder="'Enter password'"
                :type="passwordPreview ? 'text':'password'"
            >
            </nitrozen-input>
            <span
                id="password-preview"
                @click="showPassword"
                >
            <adm-inline-svg 
                :src="passwordPreview ? 'eye-open' : 'eye-close'" 
                class="height-20"
                >
            </adm-inline-svg>
            </span>
            <nitrozen-error v-if="data.password.showerror"
                >{{ data.password.errortext }}
            </nitrozen-error>
        </div>
        <div class="form-field">
            <nitrozen-input
                v-model="data.cdmaheader.value"
                :label="'CDMA Header*'"
                :placeholder="'Enter CDMA Header'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.cdmaheader.showerror"
                >{{ data.cdmaheader.errortext }}
            </nitrozen-error>
        </div>
    </div>
</template>

<script>
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    strokeBtn,
    NitrozenRadio,
    NitrozenCheckBox,
    NitrozenDropdown
} from '@gofynd/nitrozen-vue';
//import { ADMIN_COMMS_GET_SMS_PROVIDER } from '../../../../../store/admin/getters.type';
import { mapGetters } from 'vuex';
// import * as _ from 'lodash';
import get from 'lodash/get';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';

export default {
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown,
        'adm-inline-svg': adminlinesvg
    },
    computed: {
      
    },
    props: {
        isEditMode: {
            type: Boolean,
            default: false
        },
        isCloneMode: {
            type: Boolean,
            default: false
        },
        isCreateMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            requiredFields: [
                'name',
                'senderid',
                'username',
                'password',
                'cdmaheader',
            ],
            data: {
                name: this.getInitialValue(),
                description: this.getInitialValue(),
                type: this.getInitialValue('application'),
                senderid: this.getInitialValue(),
                username: this.getInitialValue(),
                password: this.getInitialValue(),
                cdmaheader:this.getInitialValue(),
            },
            passwordPreview:false,

        };
    },
    mounted() {
        if (this.isEditMode && this.smsProviderStore) {
            this.data.name.value = this.smsProviderStore.name;
            this.data.description.value = this.smsProviderStore.description;
            this.data.type.value = this.smsProviderStore.type;
            this.data.senderid.value = this.smsProviderStore.senderid;
            this.data.username.value = this.smsProviderStore.username;
            this.data.password.value = this.smsProviderStore.password;
            this.data.cdmaheader.value = this.smsProviderStore.cdmaheader;
            
        }
    },
    methods: {
        getInitialValue(val = null) {
            return {
                showerror: false,
                value: val,
                errortext: ''
            };
        },
        showPassword(){
            this.passwordPreview=!this.passwordPreview;
        },
        validate() {
            let isValid = true;
            this.requiredFields.forEach(field => {
                if (!get(this.data, `${field}.value`)) {
                    isValid = false;
                    this.data[field].showerror = true;
                    this.data[field].errortext = 'Required field';
                } else {
                    this.data[field].showerror = false;
                    this.data[field].errortext = '';
                }
            });
            return isValid;
        },
        makeDefault() {
            this.data.type.value = 'default';
        },
        saveForm() {
            let finalObj = {
                name: this.data.name.value,
                description: this.data.description.value,
                senderid: this.data.senderid.value,
                username: this.data.username.value,
                password: this.data.password.value,
                type: this.data.type.value,
                cdmaheader:this.data.cdmaheader.value,
                provider: 'vivaconnect'
            };
            finalObj = omitBy(finalObj, isNil);

            return finalObj;
        },
        validateAndSaveForm() {
            if (this.validate()) {
                return this.saveForm();
            }
        }
    }
};
</script>

<style lang="less" scoped>
    .form-wrapper {
    width: 100%;
    .form-field {
        position: relative;
        margin-bottom: 24px;
        #password-preview {
            cursor: pointer;
            position: absolute;
            right: 7px;
            top: 31px;
        }
        .height-20 {
            height: 20px;
        }
    }
}
</style>
