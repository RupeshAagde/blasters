<template>
    <div>
        <ukt-modal
            :isOpen="isOpen"
            :title="title"
            :childHandleFocus="true"
            @closedialog="closeModal"
        >
            <div class="form">
                <div v-if="!scheduleActive" class="schd-warning regular-xxs">
                    Schedule will be saved, but will not be used *
                </div>
                <div class="cl-DustyGray2 regular-xxs helper-text">
                    {{
                        `To make ${entity} live immediately choose Live Now option
                    and to schedule it on specific time, day, month choose
                    schedule later option and create schedule.`
                    }}
                </div>
                <div class="cron-status cl-mako">
                    <div
                        v-bind:class="[
                            {
                                schedule: activeStatus === SCHEDULE_TYPES.LIVE
                            },
                            'sch-btn regular-xs cl-Mako live-now'
                        ]"
                        @click="onLiveNow()"
                    >
                        Live Now
                    </div>

                    <div
                        v-bind:class="[
                            {
                                schedule: activeStatus === SCHEDULE_TYPES.LATER
                            },
                            'sch-btn regular-xs cl-Mako sch-later'
                        ]"
                        @click="onScheduleNow()"
                    >
                        Schedule Later
                    </div>
                </div>
                <div
                    :class="[
                        { disabled: activeStatus === SCHEDULE_TYPES.LIVE }
                    ]"
                >
                    <div class="date">
                        <adm-form-input :item="start" :custom="true">
                            <adm-date-picker
                                class="st-date"
                                :date_format="'YYYY-MM-DD hh:mm:ss a'"
                                :picker_type="'datetime'"
                                v-model="start.value"
                                :not_before="new Date().toISOString()"
                                :not_after="end.value"
                                :label="'Start time'"
                            />
                        </adm-form-input>
                        <adm-form-input :item="end" :custom="true">
                            <adm-date-picker
                                item_id="eDate"
                                :picker_type="'datetime'"
                                :date_format="'YYYY-MM-DD hh:mm:ss a'"
                                v-model="end.value"
                                :not_before="start.value"
                                :label="'End time'"
                            />
                        </adm-form-input>
                    </div>
                    <div v-if="showCronTabs">
                        <div class="form-row">
                            <div class="sch-box">
                                <!-- <div class="crontext" @click="toggleCron()">
                                    <ukt-inline-svg
                                        :src="
                                            isCron
                                                ? 'check-box-selected'
                                                : 'regular'
                                        "
                                    ></ukt-inline-svg>
                                    <span class="dark-xs cl-DustyGray2">
                                        Schedule Time
                                    </span>
                                </div> -->
                                <nitrozen-checkbox v-model="isCron">
                                    Schedule Time
                                </nitrozen-checkbox>
                                <div v-if="isCron">
                                    <cron-generate
                                        @generate="onCronExpGenerate"
                                        :cronExp="
                                            cron && cron.value
                                                ? cron.value
                                                : '* * * * *'
                                        "
                                        class="cron-sch"
                                    >
                                    </cron-generate>
                                    <adm-form-input
                                        :type="'number'"
                                        :item="duration"
                                        :label="'Duration (minutes)'"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <nitrozen-button
                    :theme="'secondary'"
                    class="btn-save"
                    @click="onSave"
                >
                    Save
                </nitrozen-button>
            </div>
        </ukt-modal>
    </div>
</template>

<style lang="less" scoped>
@import '../../../pages/admin/less/form.less';
@import '../../../pages/admin/less/page-ui.less';
.helper-text {
    line-height: 1.5;
}
.schd-warning {
    margin-bottom: 15px;
    color: @Required;
}
.schedule {
    color: @White !important;
    background-color: #2E31BE;
}
.disabled {
    // background: @WhiteSmoke;
    opacity: 0.5;
    pointer-events: none;
}
.cron-status {
    display: flex;
    // border: 1px solid @Iron;
    // border-radius: @BorderRadius;
    margin-top: 24px;
    cursor: pointer;
    height: 40px;
    justify-content: center;
    line-height: 40px;
    .sch-btn {
        // border-radius: 4px;
        text-align: center;
        padding: 0px 40px;
        // flex: 0.5;
        color: @RoyalBlue;
        font-weight: bold;
    }
    .sch-later {
        border-width: 1px;
        border-color: @RoyalBlue;
        border-top-right-radius: 4px;
        border-style: solid;
        border-bottom-right-radius: 4px;
    }
    .live-now {
        border-width: 1px;
        border-color: @RoyalBlue;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-style: solid;
        padding: 0px 62px;
    }
}
.error {
    margin: 0px 0px 10px 10px;
    visibility: hidden;
    color: @Required;
}
::v-deep .modal-container {
    overflow: unset !important;
    width: 570px;
    max-height: 900px !important;
}
::v-deep .modal-header {
    padding: 15px 24px;
    font-size: 16px;
    font-weight: 600;
}
.form {
    padding: 24px;
}
.sch-box {
    margin-bottom: 15px;
}
.st-date {
    margin-right: 20px;
}
.date {
    margin-top: 24px;
    display: flex;
    margin-top: 24px;
    ::v-deep .form-row {
        margin: unset;
        ::v-deep .form-error {
            margin: unset;
            padding-bottom: unset;
        }
    }
}
::v-deep .form-error {
    margin-bottom: unset !important;
    padding: 5px 0px 0px !important;
}
.btn-save {
    margin-top: 0px;
    margin-bottom: 20px;
    float: right;
}
.crontext {
    display: inline-flex;
    align-items: center;
    margin: 10px 0px;
    cursor: pointer;
}
.cron-sch {
    margin: 15px 0px;
}
</style>

<script>
import admforminput from './form-input.vue';
import uktmodal from './ukt-modal.vue';
import datePicker from './date-picker.vue';
import uktinlinesvg from './ukt-inline-svg.vue';
import cronstrue from 'cronstrue';
import crongenerate from '@/components/admin/cron-generator/index.vue';
import {
    NitrozenButton,
    flatBtn,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
// import * as _ from 'lodash';
import isEmpty from 'lodash/isEmpty';

const DEFAULT_CRON_EXPRESSION = '* * * * *';
const SCHEDULE_TYPES = {
    LIVE: 'live',
    LATER: 'later'
};

export default {
    name: 'schedule-modal',
    components: {
        'adm-form-input': admforminput,
        'adm-date-picker': datePicker,
        'ukt-modal': uktmodal,
        'ukt-inline-svg': uktinlinesvg,
        'cron-generate': crongenerate,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-button': NitrozenButton
    },
    props: {
        isOpen: false,
        title: '',
        schedule: {
            default: () => {
                return {};
            }
        },
        showCronTabs: {
            default: true
        },
        isEditMode: '',
        entity: {
            type: String,
            default: ''
        },
        scheduleActive: ''
    },
    directives: {
        flatBtn
    },
    data: function() {
        return {
            cron: this.getInitialValue(),
            start: this.getInitialValue(),
            end: this.getInitialValue(),
            duration: this.getInitialValue(),
            isCron: this.schedule && this.schedule.cron,
            activeStatus: SCHEDULE_TYPES.LIVE,
            SCHEDULE_TYPES: SCHEDULE_TYPES
        };
    },
    watch: {
        schedule() {
            if (!isEmpty(this.schedule)) {
                this.populateSchedule(this.schedule);
                this.hideError();
                this.activeStatus = this.SCHEDULE_TYPES.LATER;
                return;
            }
            this.activeStatus = this.SCHEDULE_TYPES.LIVE;
        }
    },
    mounted() {
        if (!isEmpty(this.schedule)) {
            this.populateSchedule(this.schedule);
            this.hideError();
            this.activeStatus = this.SCHEDULE_TYPES.LATER;
        } else {
            this.onLiveNow();
        }
    },
    methods: {
        populateSchedule(schedule) {
            this.cron.value = schedule['cron'] || '';
            this.isCron = this.showCronTabs && !!this.cron.value;
            this.start.value = schedule['start'] || '';
            this.end.value = schedule['end'] || '';
            this.duration.value =
                (schedule['duration'] && schedule['duration'] / 60) || '';
        },
        isEmpty(schedule) {
            return isEmpty(schedule);
        },
        onLiveNow() {
            this.activeStatus = this.SCHEDULE_TYPES.LIVE;
            this.populateSchedule({ start: new Date().toISOString() });
        },
        onScheduleNow() {
            this.activeStatus = this.SCHEDULE_TYPES.LATER;
            this.populateSchedule(this.schedule || {});
        },
        onCronExpGenerate(cronExp) {
            this.cron.value = cronExp;
        },
        closeModal() {
            this.$emit('closedialog');
        },
        toggleCron(event) {
            this.isCron = !this.isCron;
        },
        getInitialValue(val = '') {
            return {
                showerror: false,
                value: val,
                errortext: '-'
            };
        },
        onSave() {
            this.hideError();
            if (!this.validateForm()) return;
            this.$emit('saveSchedule', {
                cron: this.isCron
                    ? this.cron.value
                        ? this.cron.value
                        : DEFAULT_CRON_EXPRESSION
                    : undefined,
                start: this.start.value || undefined,
                end: this.end.value || undefined,
                duration: this.duration.value
                    ? Number(this.duration.value) * 60
                    : undefined
            });
        },
        validateForm() {
            let formValid = true;

            formValid = this.checkEmpty('start') && formValid;

            if (this.isCron) {
                formValid = this.checkDuration('duration') && formValid;
            }
            return formValid;
        },
        checkEmpty(key) {
            if (this[key].value.trim() === '') {
                this[key].showerror = true;
                this[key].errortext = 'Enter ' + key;
                return false;
            }
            return true;
        },
        checkDuration(key) {
            if (isNaN(this[key].value) || this[key].value == 0) {
                this[key].showerror = true;
                this[key].errortext = 'Enter valid ' + key;
                return false;
            }
            return true;
        },
        hideError() {
            this.cron.showerror = false;
            this.start.showerror = false;
            this.duration.showerror = false;
        }
    }
};
</script>
