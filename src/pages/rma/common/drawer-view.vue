<template>
    <div class="drawer-container">
        <div class="header">
            <h4 class="header-caption">Rule Details</h4>
            <ukt-inline-svg
                class="cross-icon"
                @click.stop.native="close"
                :src="'cross-black'"
            ></ukt-inline-svg>
        </div>
        <div class="content">
            <div class="group">
                <h4>Department</h4>
                <span>{{ department }}</span>
            </div>
            <div class="group">
                <h4>Category</h4>
                <span>{{ category }}</span>
            </div>
            <div class="reasons-container">
                <h4>Reasons</h4>
                <div
                    v-for="(reason, reasonIndex) of reasons"
                    :key="reason.id"
                    class="reason-item-container"
                >
                    <div class="reason-question-accordion">
                        <div class="question-accordion-header">
                            <div class="reason-name-container">
                                <span class="reason-display-name">{{
                                    reason.display_name
                                }}</span>
                            </div>
                            <div class="reason-item-buttons">
                                <nitrozen-badge
                                    :state="
                                        reason.is_active ? 'success' : 'warn'
                                    "
                                >
                                    {{
                                        reason.is_active ? 'Active' : 'Inactive'
                                    }}
                                </nitrozen-badge>
                                <ukt-inline-svg
                                    v-if="reason.display_name !== 'others'"
                                    class="collapse-button"
                                    @click.stop.native="
                                        toggleParentReason(reasonIndex)
                                    "
                                    :src="
                                        reason.collapse
                                            ? 'arrow-top-black'
                                            : 'arrow-dropdown-black'
                                    "
                                ></ukt-inline-svg>
                                <span v-else class="blank-button"></span>
                            </div>
                        </div>
                        <div
                            class="reason-content-wrapper"
                            v-if="reason.collapse"
                        >
                            <div v-if="reason.reasons.length === 0">
                                <div class="sub-reason-container">
                                    <div class="sub-reason-content">
                                        <div class="sub-reason-group">
                                            <span class="caption">QC Type</span>
                                            <span class="value">
                                                :
                                                {{
                                                    reason.qc_type.length === 2
                                                        ? 'Pre & Doorstep QC'
                                                        : reason.qc_type
                                                              .length === 1
                                                        ? 'Doorstep QC'
                                                        : 'No QC'
                                                }}</span
                                            >
                                        </div>
                                        <div class="sub-reason-group">
                                            <span class="caption"
                                                >Questions</span
                                            >
                                            <span class="value">
                                                :
                                                {{
                                                    reason.question_set.length
                                                        ? reason.question_set
                                                              .map(
                                                                  (ques) =>
                                                                      ques.display_name
                                                              )
                                                              .join(', ')
                                                        : 'None'
                                                }}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-for="childReason of reason.reasons"
                                :key="childReason.id"
                                v-else
                            >
                                <div class="sub-reason-container">
                                    <div class="sub-reason-content">
                                        <div class="sub-reason-group">
                                            <span class="caption"
                                                >Sub Reason</span
                                            >
                                            <span class="value">
                                                :
                                                {{
                                                    childReason.display_name
                                                }}</span
                                            >
                                        </div>
                                        <div class="sub-reason-group">
                                            <span class="caption">QC Type</span>
                                            <span class="value">
                                                :
                                                {{
                                                    childReason.qc_type
                                                        .length === 2
                                                        ? 'Pre & Doorstep QC'
                                                        : childReason.qc_type
                                                              .length === 1
                                                        ? 'Doorstep QC'
                                                        : 'No QC'
                                                }}</span
                                            >
                                        </div>
                                        <div class="sub-reason-group">
                                            <span class="caption"
                                                >Questions</span
                                            >
                                            <span class="value">
                                                :
                                                {{
                                                    childReason.question_set
                                                        .length
                                                        ? childReason.question_set
                                                              .map(
                                                                  (ques) =>
                                                                      ques.display_name
                                                              )
                                                              .join(', ')
                                                        : 'None'
                                                }}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import { NitrozenBadge } from '@gofynd/nitrozen-vue';

export default {
    name: 'rule-drawer',
    components: {
        'ukt-inline-svg': uktinlinesvg,
        NitrozenBadge
    },
    data() {
        return {
            reasons: []
        };
    },
    mounted() {
        this.reasons = this.drawerData.actions
            ? this.drawerData.actions.reasons.map((res) => ({
                  ...res,
                  collapse: false
              }))
            : [];
    },
    computed: {
        department() {
            return this.drawerData.meta && this.drawerData.meta.department
                ? this.drawerData.meta.department.display_name
                    ? this.drawerData.meta.department.display_name
                    : ''
                : 'All';
        },
        category() {
            return this.drawerData.meta && this.drawerData.meta.l3
                ? this.drawerData.meta.l3.display_name
                : 'All';
        }
    },
    props: {
        drawerData: {
            type: Object,
            required: true,
            default: {}
        },
        close: {
            type: Function,
            required: true
        }
    },
    methods: {
        toggleParentReason(reasonIndex) {
            this.reasons[reasonIndex].collapse = !this.reasons[reasonIndex]
                .collapse;
        }
    }
};
</script>

<style scoped lang="less">
@import './../../less/page-header.less';
@import './../../less/page-ui.less';
.drawer-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .header {
        height: 7.5%;
        width: 100%;
        border-bottom: 1px solid @Iron;
        display: flex;
        justify-content: space-between;
        .header-caption {
            font-weight: 600;
            margin: 1.75vh 0 0 1.5vw;
        }
        .cross-icon {
            margin-right: 10px;
            cursor: pointer;
        }
    }
    .content {
        height: 92.5%;
        display: flex;
        flex-direction: column;
        padding: 1.75vh 0 0 1.5vw;
        .group {
            height: 10vh;
            width: 100%;
            span {
                color: #9b9b9b;
            }
        }
        h4 {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 10px;
        }
        .reasons-container {
            .reason-item-container {
                display: flex;
                width: 95%;
                border: 1px solid @Iron;
                border-radius: 4px;
                margin-bottom: 12px;
                padding: 12px;
                color: @Mako;
                font-size: 14px;
                font-weight: 500;
                background-color: #ffffff;
                .reason-question-accordion {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    .question-accordion-header {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .reason-item-buttons {
                            display: flex;
                            .collapse-button {
                                margin-left: 10px;
                                cursor: pointer;
                                height: 25px;
                                width: 25px;
                                &:hover {
                                    background-color: @Iron;
                                    border-radius: 50%;
                                }
                            }
                            .active-toggle {
                                font-size: 14px;
                                font-weight: 600;
                                align-self: center;
                                text-align: center;
                            }
                        }
                        .reason-name-container {
                            display: flex;
                            .reason-display-name {
                                align-self: center;
                                margin-left: 16px;
                            }
                        }
                    }
                    .reason-content-wrapper {
                        width: 95%;
                        display: flex;
                        flex-direction: column;
                        margin: 8px 0 8px 1.5vw;
                        font-weight: 400;
                        .sub-reason-container {
                            width: 97.5%;
                            padding: 8px;
                            background: #fafafa;
                            border: 1px solid #e0e0e0;
                            border-radius: 4px;
                            display: flex;
                            flex-direction: column;
                            margin: 5px 0;
                            .sub-reason-content {
                                margin: 0px 0 0 8px;
                                .sub-reason-group {
                                    height: fit-content;
                                    width: 100%;
                                    display: flex;
                                    margin-bottom: 8px;
                                    .caption {
                                        width: 90px;
                                    }
                                    .value {
                                        width: calc(100% - 90px);
                                        word-wrap: break-word;
                                    }
                                }
                                .question-dropdown {
                                    margin-left: 2%;
                                    width: 67.5vw;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
