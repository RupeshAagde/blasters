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
                v-model="data.host.value"
                :label="'Host*'"
                :placeholder="'Enter host'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.host.showerror"
                >{{ data.host.errortext }}
            </nitrozen-error>
        </div>
        <div class="form-field">
            <nitrozen-input
                v-model="data.port.value"
                :label="'Port*'"
                :placeholder="'Enter port'"
                type="number"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.port.showerror"
                >{{ data.port.errortext }}
            </nitrozen-error>
        </div>
        <div class="form-field">
            <div class="nitrozen-label">Secure*</div>
            <nitrozen-radio
                class="radio-inline"
                name="secure"
                v-model="data.secure.value"
                radioValue="true"
                title="True"
                >Yes
            </nitrozen-radio>
            <nitrozen-radio
                class="radio-inline"
                name="secure"
                v-model="data.secure.value"
                radioValue="false"
                title="False"
                >No
            </nitrozen-radio>
            <nitrozen-error v-if="data.secure.showerror"
                >{{ data.secure.errortext }}
            </nitrozen-error>
        </div>
        <div class="title">Authentication</div>
        <!-- <div class="form-field">
            <div class="nitrozen-label">Type</div>
            <nitrozen-radio
                class="radio-inline"
                name="authType"
                v-model="data.auth.type.value"
                radioValue="login"
                >Login
            </nitrozen-radio>
            <nitrozen-radio
                class="radio-inline"
                name="authType"
                v-model="data.auth.type.value"
                radioValue="oauth2"
                >Oauth2
            </nitrozen-radio>
            <nitrozen-error v-if="data.auth.type.showerror"
                >{{ data.auth.type.errortext }}
            </nitrozen-error>
        </div> -->
        <div class="form-field">
            <nitrozen-input
                v-model="data.auth.user.value"
                :label="'Username'"
                :placeholder="'Enter username'"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.auth.user.showerror"
                >{{ data.auth.user.errortext }}
            </nitrozen-error>
        </div>
        <div class="form-field">
            <nitrozen-input
                v-model="data.auth.pass.value"
                :label="'Password'"
                :placeholder="'Enter password'"
                :type="passwordPreview ? 'text' : 'password'"
            >
            </nitrozen-input>
            <span id="password-preview" @click="showPassword">
                <adm-inline-svg
                    :src="passwordPreview ? 'eye-open' : 'eye-close'"
                    class="height-20"
                >
                </adm-inline-svg>
            </span>
            <nitrozen-error v-if="data.auth.pass.showerror"
                >{{ data.auth.pass.errortext }}
            </nitrozen-error>
        </div>
        <div class="title">From</div>
        <div class="form-field from-container">
            <div
                :class="{ default: from_address.is_default }"
                class="flex-container align-baseline container"
                :key="index"
                v-for="(from_address, index) in data.from_address.value"
            >
                <div @click="removeFrom(index)" class="link mg-r-24 remove">
                    <adm-inline-svg src="delete"></adm-inline-svg>
                </div>
                <div class="field-wrap mg-r-24">
                    <nitrozen-input
                        v-model="from_address.name"
                        :label="'Name*'"
                        :placeholder="'Enter from name'"
                    >
                    </nitrozen-input>
                    <nitrozen-error v-if="from_address.nameError"
                        >{{ from_address.nameError }}
                    </nitrozen-error>
                </div>
                <div class="field-wrap mg-r-24">
                    <nitrozen-input
                        v-model="from_address.email"
                        :label="'Email*'"
                        :placeholder="'Enter from email'"
                    >
                    </nitrozen-input>
                    <nitrozen-error v-if="from_address.emailError"
                        >{{ from_address.emailError }}
                    </nitrozen-error>
                </div>

                <div
                    @click="makeFromDefault(index)"
                    class="link mg-r-24"
                    :class="{ hidden: from_address.is_default }"
                >
                    Use as default
                </div>
            </div>
            <div @click="addMoreFrom" class="bold-link">Add more</div>
        </div>
        <!-- <div class="title">Connection Pooling</div>
        <div class="form-field">
            <div class="nitrozen-label">Pooling*</div>
            <nitrozen-radio
                class="radio-inline"
                name="pool"
                v-model="data.pool.value"
                radioValue="true"
                title="True"
                >Yes
            </nitrozen-radio>
            <nitrozen-radio
                class="radio-inline"
                name="pool"
                v-model="data.pool.value"
                radioValue="false"
                title="False"
                >No
            </nitrozen-radio>
        </div>
        <div class="form-field">
            <nitrozen-input
                v-model="data.maxConnections.value"
                :label="'Max connections'"
                :placeholder="'Enter maximum number of connections(0-1000)'"
                type="number"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.maxConnections.showerror"
                >{{ data.maxConnections.errortext }}
            </nitrozen-error>
        </div>

        <div class="form-field">
            <nitrozen-input
                v-model="data.maxMessages.value"
                :label="'Max messages'"
                :placeholder="'Enter maximum number of messages(0-10000000)'"
                type="number"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.maxMessages.showerror"
                >{{ data.maxMessages.errortext }}
            </nitrozen-error>
        </div>

        <div class="form-field">
            <nitrozen-input
                v-model="data.rateDelta.value"
                :label="'Rate delta'"
                :placeholder="'Enter rate delta'"
                type="number"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.rateDelta.showerror"
                >{{ data.rateDelta.errortext }}
            </nitrozen-error>
        </div>

        <div class="form-field">
            <nitrozen-input
                v-model="data.rateLimit.value"
                :label="'Rate limit'"
                :placeholder="'Enter rate limit'"
                type="number"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.rateLimit.showerror"
                >{{ data.rateLimit.errortext }}
            </nitrozen-error>
        </div>

        <div class="title">Timeouts</div>
        <div class="form-field">
            <nitrozen-input
                v-model="data.connectionTimeout.value"
                :label="'Connection timeout'"
                :placeholder="'Enter connection timeout'"
                type="number"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.connectionTimeout.showerror"
                >{{ data.connectionTimeout.errortext }}
            </nitrozen-error>
        </div>

        <div class="form-field">
            <nitrozen-input
                v-model="data.greetingTimeout.value"
                :label="'Greeting timeout'"
                :placeholder="'Enter greeting timeout'"
                type="number"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.greetingTimeout.showerror"
                >{{ data.greetingTimeout.errortext }}
            </nitrozen-error>
        </div>

        <div class="form-field">
            <nitrozen-input
                v-model="data.socketTimeout.value"
                :label="'Socket timeout'"
                :placeholder="'Enter socket timeout'"
                type="number"
            >
            </nitrozen-input>
            <nitrozen-error v-if="data.socketTimeout.showerror"
                >{{ data.socketTimeout.errortext }}
            </nitrozen-error>
        </div> -->
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
    NitrozenDropdown,
} from '@gofynd/nitrozen-vue';
import CommunicationServices from '../../../../services/pointblank.service';
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
        'adm-inline-svg': adminlinesvg,
    },
    computed: {},
    props: {
        isEditMode: {
            type: Boolean,
            default: false,
        },
        isCloneMode: {
            type: Boolean,
            default: false,
        },
        isCreateMode: {
            type: Boolean,
            default: false,
        },
        id: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            requiredFields: ['name', 'host', 'port', 'secure'],
            data: {
                name: this.getInitialValue(),
                description: this.getInitialValue(),
                type: this.getInitialValue('platform'),
                host: this.getInitialValue(),
                port: this.getInitialValue(),
                secure: this.getInitialValue(),
                auth: {
                    type: this.getInitialValue('login'),
                    user: this.getInitialValue(),
                    pass: this.getInitialValue(),
                },
                pool: false,
                maxConnections: 5,
                maxMessages: 1000000,
                rateDelta: 10000,
                rateLimit: 10000,
                connectionTimeout: 50000,
                greetingTimeout: 40000,
                socketTimeout: 20000,
                from_address: this.getInitialValue([
                    {
                        name: null,
                        email: null,
                        nameError: '',
                        emailError: '',
                        is_default: true,
                    },
                ]),
            },
            passwordPreview: false,
            emailProvider: {},
        };
    },
    mounted() {
        if (this.id) {
            this.fetchEmailProvider();
        }
    },
    methods: {
        fetchEmailProvider() {
            this.pageLoading = true;
            CommunicationServices.getEmailProviderbyId(this.id).then((data) => {
                this.emailProvider = data.data;
                this.updateForm();
            });
        },
        updateForm() {
            this.data.name.value = this.emailProvider.name;
            this.data.description.value = this.emailProvider.description;
            this.data.host.value = this.emailProvider.host;
            this.data.port.value = this.emailProvider.port;
            this.data.secure.value = String(this.emailProvider.secure);

            this.data.auth.type.value = this.emailProvider.auth.type;
            this.data.auth.user.value = this.emailProvider.auth.user;
            this.data.auth.pass.value = this.emailProvider.auth.pass;

            this.data.pool = String(this.emailProvider.pool);
            this.data.maxConnections = this.emailProvider.maxConnections;
            this.data.maxMessages = this.emailProvider.maxMessages;
            this.data.rateDelta = this.emailProvider.rateDelta;
            this.data.rateLimit = this.emailProvider.rateLimit;
            this.data.connectionTimeout =
                this.emailProvider.connectionTimeout;
            this.data.greetingTimeout =
                this.emailProvider.greetingTimeout;
            this.data.socketTimeout = this.emailProvider.socketTimeout;

            this.data.from_address.value = this.emailProvider.from_address;
            if (this.data.from_address.value) {
                this.data.from_address.value = this.data.from_address.value.map(
                    (a) => {
                        a.nameError = '';
                        a.emailError = '';
                        return a;
                    }
                );
            }
        },
        removeFrom(index) {
            if (this.data.from_address.value.length > 1) {
                this.data.from_address.value.splice(index, 1);
            } else if (this.data.from_address.value.length == 1 && index == 0) {
                this.data.from_address.value[0].name = null;
                this.data.from_address.value[0].email = null;
            }
        },
        showPassword() {
            this.passwordPreview = !this.passwordPreview;
        },
        makeFromDefault(index) {
            this.data.from_address.value = this.data.from_address.value.map(
                (a) => {
                    a.is_default = false;
                    return a;
                }
            );
            this.data.from_address.value[index].is_default = true;
        },
        addMoreFrom() {
            this.data.from_address.value.push({
                name: null,
                email: null,
                nameError: '',
                emailError: '',
                is_default: false,
            });
        },
        getInitialValue(val = null) {
            return {
                showerror: false,
                value: val,
                errortext: '',
            };
        },
        validate() {
            let isValid = true;
            this.requiredFields.forEach((field) => {
                if (!get(this.data, `${field}.value`)) {
                    isValid = false;
                    this.data[field].showerror = true;
                    this.data[field].errortext = 'Required field';
                } else {
                    this.data[field].showerror = false;
                    this.data[field].errortext = '';
                }
            });
            this.data.from_address.value.forEach((from) => {
                from.nameError = '';
                from.emailError = '';
                var emailRegex =
                    /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/g;
                if (!emailRegex.test(from.email)) {
                    from.emailError = 'Invalid email';
                    isValid = false;
                }
                if (!from.name) {
                    from.nameError = 'Required Field';
                    isValid = false;
                }
                if (!from.email) {
                    from.emailError = 'Required Field';
                    isValid = false;
                }
            });
            return isValid;
        },
        saveForm() {
            let finalObj = {
                name: this.data.name.value,
                description: this.data.description.value,
                host: this.data.host.value,
                port: this.data.port.value,
                secure: this.data.secure.value,
                auth: {
                    type: this.data.auth.type.value,
                    user: this.data.auth.user.value,
                    pass: this.data.auth.pass.value,
                },
                pool: this.data.pool.value,
                maxConnections: this.data.maxConnections.value,
                maxMessages: this.data.maxMessages.value,
                rateDelta: this.data.rateDelta.value,
                rateLimit: this.data.rateLimit.value,
                connectionTimeout: this.data.connectionTimeout.value,
                greetingTimeout: this.data.greetingTimeout.value,
                socketTimeout: this.data.socketTimeout.value,
                type: this.data.type.value,
                provider: 'smtp',
                from_address: this.data.from_address.value.map((a) => ({
                    name: a.name,
                    email: a.email,
                    is_default: a.is_default,
                })),
            };
            //finalObj = omitBy(finalObj, isNil);
            //finalObj.auth = omitBy(finalObj.auth, isNil);
            return finalObj;
        },
        validateAndSaveForm() {
            if (this.validate()) {
                return this.saveForm();
            }
        },
    },
};
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
.title {
    color: @Mako;
    font-weight: bold;
    font-size: 18px;
    line-height: 27px;
    text-align: left;
    margin-bottom: 24px;
}
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
.mg-r-24 {
    margin-right: 24px;
}
.align-baseline {
    align-items: baseline;
}
.hidden {
    visibility: hidden;
}
.flex-container {
    display: flex;
    margin-bottom: 12px;
    .flex-1 {
        flex: 1;
    }
}
</style>
