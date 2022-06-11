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
                v-model="data.sender.value"
                :label="'Sender id*'"
                :placeholder="'Enter sender id'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.sender.showerror"
                >{{ data.sender.errortext }}
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
                v-model="data.authkey.value"
                :label="'Authkey*'"
                :placeholder="'Enter Authkey'"
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
            <nitrozen-error v-if="data.authkey.showerror"
                >{{ data.authkey.errortext }}
            </nitrozen-error>
        </div>
        <div class="form-field">
            <nitrozen-input
                v-model="data.entity_id.value"
                :label="'Principal Entity id(PE ID)'"
                :placeholder="'Enter principal entity id(PE ID)'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.entity_id.showerror"
                >{{ data.entity_id.errortext }}
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
import CommunicationServices from '../../../../services/pointblank.service';
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
        },
        id: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            requiredFields: [
                'name',
                'sender',
                'username',
                'authkey',
            ],
            data: {
                name: this.getInitialValue(),
                description: this.getInitialValue(),
                type: this.getInitialValue('application'),
                sender: this.getInitialValue(),
                username: this.getInitialValue(),
                authkey: this.getInitialValue(),
                entity_id: this.getInitialValue(),
            },
            passwordPreview:false,
            smsProvider: {},
        };
    },
    mounted() {
        if (this.id) {
            this.fetchSmsProvider();
        }
    },
    methods: {
        fetchSmsProvider() {
            this.pageLoading = true;
            CommunicationServices.getSmsProviderbyId(this.id).then((data) => {
                this.smsProvider = data.data;
                this.updateForm();
            });
        },
        updateForm() {
        this.data.name.value = this.smsProvider.name;
            this.data.description.value = this.smsProvider.description;
            this.data.type.value = this.smsProvider.type;
            this.data.sender.value = this.smsProvider.sender;
            this.data.username.value = this.smsProvider.username;
            this.data.entity_id.value = this.smsProvider.entity_id;
            this.data.authkey.value = this.smsProvider.authkey;
        },
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
            this.data.type.value = 'platform';
        },
        saveForm() {
            let finalObj = {
                name: this.data.name.value,
                description: this.data.description.value,
                sender: this.data.sender.value,
                username: this.data.username.value,
                entity_id: this.data.entity_id.value,
                authkey: this.data.authkey.value,
                type: this.data.type.value,
                provider: 'telspiel'
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
