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
                v-model="data.feedid.value"
                :label="'Feed id*'"
                :placeholder="'Enter feed id'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.feedid.showerror"
                >{{ data.feedid.errortext }}
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
                v-model="data.entityid.value"
                :label="'Entity id'"
                :placeholder="'Enter Entity id'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.entityid.showerror"
                >{{ data.entityid.errortext }}
            </nitrozen-error>
        </div>

        <div class="form-field">
            <div class="nitrozen-label">Override DND</div>
            <nitrozen-radio
                class="radio-inline"
                name="override_dnd"
                v-model="data.override_dnd.value"
                radioValue="true"
                title="True"
                >Yes
            </nitrozen-radio>
            <nitrozen-radio
                class="radio-inline"
                name="override_dnd"
                v-model="data.override_dnd.value"
                radioValue="false"
                title="False"
                >No
            </nitrozen-radio>
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
                'feedid',
                'username',
                'password',
                'senderid'
            ],
            data: {
                name: this.getInitialValue(),
                description: this.getInitialValue(),
                type: this.getInitialValue('platform'),
                feedid: this.getInitialValue(),
                username: this.getInitialValue(),
                password: this.getInitialValue(),
                senderid: this.getInitialValue(),
                entityid : this.getInitialValue(),
                override_dnd: this.getInitialValue()

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
        getInitialValue(val = null) {
            return {
                showerror: false,
                value: val,
                errortext: ''
            };
        },
        updateForm() {
            this.data.name.value = this.smsProvider.name;
            this.data.description.value = this.smsProvider.description;
            this.data.type.value = this.smsProvider.type;
            this.data.feedid.value = this.smsProvider.feedid;
            this.data.username.value = this.smsProvider.username;
            this.data.password.value = this.smsProvider.password;
            this.data.senderid.value = this.smsProvider.senderid;
            this.data.entityid.value = this.smsProvider.entityid;
            this.data.override_dnd.value = this.smsProvider.override_dnd;
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
                feedid: this.data.feedid.value,
                username: this.data.username.value,
                password: this.data.password.value,
                senderid: this.data.senderid.value,
                entityid: this.data.entityid.value,
                override_dnd: this.data.override_dnd.value,
                type: this.data.type.value,
                provider: 'netcore'
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
