<template>
    <div class="panel">
        <div class="header-position">
            <page-header
                :title="pageTitle"
                @backClick="$goBack('/administrator/settings/platform')"
                :noContextMenu="true"
            >
                <div class="button-box">
                    <nitrozen-button
                        class="pad-left"
                        :theme="'secondary'"
                        v-flatBtn
                        ref="save-button"
                        id="save"
                        @click="saveForm"
                    >
                        Save
                    </nitrozen-button>
                </div>
            </page-header>
        </div>
        <loader v-if="pageLoading" />
        <page-error v-else-if="pageError" @tryAgain="init()" />
        <div class="page-container" v-else>
            <div class="form-container">
                <div v-for="item in lineItems" :key="item.id" class="border">
                    <component-factory
                        ref="getData"
                        :lineItem="item"
                        :parentState="true"
                        textClass="group-header"
                        @btnClicked="addProgramType"
                    />

                    <div class="margin">
                        <div
                            v-for="(type, index) in programTypes"
                            :key="index"
                            class="mb24 inner-border"
                        >
                            <div :class="`inner-title inline apart p16`">
                                <div class="inline v-center">
                                    <span v-if="type.name.length == 0">
                                        Untitled
                                    </span>
                                    {{ type.name }}
                                </div>
                                <div
                                    v-if="!type.disabled"
                                    class="pointer"
                                    @click="removeProgram(index)"
                                >
                                    <inline-svg
                                        title="close"
                                        src="cross-black"
                                    />
                                </div>
                            </div>
                            <div class="border-top inline apart p16">
                                <div class="input-cell">
                                    <div class="cell-value">
                                        <nitrozen-input
                                            label="Program Name"
                                            type="text"
                                            v-model="type.name"
                                            placeholder="Enter Program Name"
                                            :required="true"
                                            :disabled="type.disabled"
                                            @input="clearError(type, 'nameErr')"
                                        />
                                        <nitrozen-error v-if="type.nameErr">
                                            {{ type.nameErr }}
                                        </nitrozen-error>
                                    </div>
                                </div>
                                <div class="input-cell">
                                    <div class="cell-value">
                                        <nitrozen-input
                                            label="Program Short Code"
                                            type="text"
                                            v-model="type.short_code"
                                            placeholder="Enter Short Code"
                                            :required="true"
                                            :showTooltip="true"
                                            tooltipText="Display name in seller panel"
                                            :disabled="type.disabled"
                                            @input="clearError(type, 'codeErr')"
                                        />
                                        <nitrozen-error v-if="type.codeErr">
                                            {{ type.codeErr }}
                                        </nitrozen-error>
                                    </div>
                                </div>
                            </div>
                            <div class="border-top inline apart p16">
                                <div class="text inline apart">
                                    <div class="inline v-center">
                                        Location auto verification
                                    </div>
                                </div>
                                <nitrozen-checkbox
                                    :id="type.short_code"
                                    :checkboxValue="type.auto_verify"
                                    v-model="type.auto_verify"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { NitrozenButton, flatBtn, NitrozenInput, NitrozenError } from '@gofynd/nitrozen-vue';
import PageHeader from '@/components/common/layout/page-header';
import PageError from '@/components/common/page-error';
import Loader from '@/components/common/loader';
import { getButtonComponent } from '@/helper/admin-config.util';
import ComponentFactory from './components/component-factory.vue';
import { NitrozenCheckBox } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/ukt-inline-svg';
import InternalSettings from '@/services/internal-settings.service';
import safeAccess from 'safe-access';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

const SERVERCONFIGIDENTIFIER = 'location';
export default {
    name: 'location-config',
    components: {
        'nitrozen-button': NitrozenButton,
        'page-header': PageHeader,
        loader: Loader,
        'page-error': PageError,
        ComponentFactory,
        'nitrozen-checkbox': NitrozenCheckBox,
        NitrozenInput,
        NitrozenError,
        InlineSvg
    },
    directives: {
        flatBtn
    },
    mixins: [dirtyCheckMixin],

    data() {
        return {
            pageLoading: false,
            pageError: false,
            pageTitle: 'Locations',
            lineItems: [],
            programTypes: [],
            errors: {},
            checkboxItem: {},
            originalData: []
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.lineItems = [];
            this.lineItems.push(this.getProgrammeTypeComponent());
            this.fetchPrograms();
        },
        fetchPrograms() {
            this.pageLoading = true;
            this.pageError = false;
            this.programTypes = [];
            this.fetchData()
                .then((data) => {
                    this.pageLoading = false;
                    this.programTypes =
                        safeAccess(data, 'configuration.program_types') || [];
                    this.programTypes = this.programTypes.map((type) => {
                        return { ...type, disabled: true };
                    });
                    this.originalData = cloneDeep(this.programTypes)
                })
                .catch(() => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        fetchData() {
            return new Promise((resolve, reject) => {
                InternalSettings.getAdminConfig(SERVERCONFIGIDENTIFIER)
                    .then(({ data }) => {
                        return resolve(data);
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(
                            'Failed to Load Config',
                            { duration: 2000 }
                        );
                        return reject(err);
                    });
            });
        },
        getProgrammeTypeComponent() {
            return getButtonComponent('programme_type', 'Program Type', [], {
                btnLabel: '+ Add Program Type'
            });
        },
        addProgramType(id) {
            this.programTypes.push({
                name: '',
                short_code: '',
                auto_verify: false,
                disabled: false
            });
        },
        removeProgram(index) {
            this.programTypes.splice(index, 1);
        },
        clearError(location, key){
            if (location[key]){
                delete location[key]
            }
        },
        validateProgramType(programTypes) {
            const nameRegex = /^[A-Za-z0-9 _-]{1,100}$/;
            const codeRegex = /^[A-Za-z0-9]{1,100}$/;
            let isValid = true;
            programTypes.forEach((location) => {
                if (location.name && location.name.trim()) {
                    if (!nameRegex.test(location.name.trim())) {
                        isValid = false;
                        this.$set(location,'nameErr', 'field validation failed')
                    }
                } else {
                    isValid = false;
                    this.$set(location,'nameErr', 'program name is required')
                }

                if (location.short_code && location.short_code.trim()) {
                    if (!codeRegex.test(location.short_code.trim())) {
                        isValid = false;
                        this.$set(location,'codeErr', 'field validation failed')
                    }
                } else {isValid = false; this.$set(location,'codeErr', 'program short code is required')}
            });

            return isValid;
        },
        saveForm() {
            let isValid = this.validateProgramType(this.programTypes);
            if (!isValid) return;
            const updateData = {
                configuration: {
                    program_types: this.programTypes.map((type) => {
                        return {
                            name: type.name.trim(),
                            short_code: type.short_code.trim(),
                            auto_verify: type.auto_verify
                        };
                    })
                }
            };

            InternalSettings.saveAdminConfig(SERVERCONFIGIDENTIFIER, updateData)
                .then(() => {
                    this.$snackbar.global.showSuccess(
                        'Config Updated Successfully',
                        { duration: 2000 }
                    );
                    this.fetchPrograms();
                })
                .catch(() => {
                    this.$snackbar.global.showError('Failed to Update Config', {
                        duration: 2000
                    });
                });
        },
        // dirtyForm check
        isFormDirty() {
            return !isEqual(this.originalData, this.programTypes);
        }
    }
};
</script>

<style lang="less" scoped>
.pointer {
    cursor: pointer;
}
.inner-title {
    font-weight: 500;
    font-size: 14px;
    color: @Mako;
}
.border-top {
    border-top: 1px solid @Iron;
}
.header-position {
    height: 58.5px;
}
.margin {
    margin: 24px;
}
.input-cell {
    width: 48%;
}
.p16 {
    padding: 16px;
}
.page-container {
    flex-direction: row;
    width: auto;
    padding: 0;
    background-color: @Alabaster2;

    .form-container {
        display: block;
        flex: 1;
        border-radius: 8px;
        background-color: @White;
    }
}

.border {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 24px;
}
.inner-border {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}
.inline {
    display: flex;

    &.apart {
        justify-content: space-between;
    }
    &.v-center {
        align-items: center;
    }
}
.mb24 {
    margin-bottom: 24px;
}
.text {
    font-weight: 400;
    font-size: 14px;
}
::v-deep .nitrozen-tooltiptext {
    background: #333333;
    color: #f9f9f9;
    font-size: 12px;
    min-width: 170px;
}
</style>
