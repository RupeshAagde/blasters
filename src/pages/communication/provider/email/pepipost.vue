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
                v-model="data.api_key.value"
                :label="'Provider API key*'"
                :placeholder="'Enter API key'"
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
            <nitrozen-error v-if="data.api_key.showerror"
                >{{ data.api_key.errortext }}
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
// import * as _ from 'lodash';
import get from 'lodash/get';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import adminlinesvg from '@/components/common/inline-svg.vue';

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
    mounted() {
        if (this.id) {
            this.fetchEmailProvider();
        }
        if (this.isEditMode && this.emailProvider) {
            this.data.name.value = this.emailProvider.name;
            this.data.description.value = this.emailProvider.description;
            this.data.api_key.value = this.emailProvider.api_key;
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
        }
    },
    data() {
        return {
            requiredFields: ['name', 'api_key'],
            data: {
                name: this.getInitialValue(),
                description: this.getInitialValue(),
                api_key: this.getInitialValue(),
                type: this.getInitialValue('application'),
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
            this.data.api_key.value = this.emailProvider.api_key;
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
        getInitialValue(val = '') {
            return {
                showerror: false,
                value: val,
                errortext: '',
            };
        },
        validate() {
            console.log('hi');
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
                api_key: this.data.api_key.value,
                type: 'platform',
                provider: 'pepipost',
                from_address: this.data.from_address.value.map((a) => ({
                    name: a.name,
                    email: a.email,
                    is_default: a.is_default,
                })),
            };
            finalObj = omitBy(finalObj, isNil);
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
.form-wrapper {
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
