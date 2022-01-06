<template>
    <div>
        <page-header
            :title="editMode ? 'Edit Page' : 'Create Page'"
            @backClick="$router.push({ name: 'coupons' })"
        >
            <div
                v-if="editMode"
                class="pad-right"
                @click.stop="show_schedule_modal = true"
            >
                <adm-inline-svg :src="'schedule_'" class="schedule-btn">
                </adm-inline-svg>
            </div>
            <div>
                <div
                    class="publish-status status-text bold-xs"
                    :class="{ 'publish-status-disabled': !published }"
                    @click="
                        published = !published;
                        changePublish();
                    "
                >
                    {{ published ? 'Published' : 'Unpublished' }}
                </div>
            </div>
            <nitrozen-toggle-btn
                id="publish"
                v-model="published"
                @change="changePublish"
            ></nitrozen-toggle-btn>
            <span class="actions"
                ><nitrozen-button
                    id="actions"
                    v-flatBtn
                    theme="secondary"
                    @click.stop="onSaveCoupon"
                >
                    {{ editMode ? 'Save' : 'Create' }}
                </nitrozen-button></span
            >
        </page-header>
        <loader v-if="pageLoading" class="loading"></loader>
        <div class="section-content">
            <div class="main">
                <!--Coupon Form--->
                <div class="coupon-form-container">
                    <div class="left-form-container">
                        <div class="page-container">
                            <div class="type-container">
                                <div class="header middle-align">
                                    <div class="container">
                                        <div
                                            class="
                                                type-name
                                                middle-align
                                                cl-Mako
                                                bold-md
                                            "
                                        >
                                            <div class="name">
                                                <div class="text-content">
                                                    {{ title }}
                                                </div>
                                                <div
                                                    class="
                                                        text-btn
                                                        cl-RoyalBlue
                                                        bold-xs
                                                    "
                                                    id="create"
                                                    @click="openModal"
                                                >
                                                    Change
                                                </div>
                                            </div>
                                            <div
                                                class="
                                                    example
                                                    cl-DustyGray2
                                                    regular-xs
                                                "
                                            >
                                                {{ subtitle }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="discount">
                                    <div class="half">
                                        <div
                                            class="pair uni"
                                            v-if="couponType === 'amount_off'"
                                        >
                                            <nitrozen-input
                                                label="Amount*"
                                                v-model="amount.value"
                                                @keydown.native="allowNumbers"
                                            />
                                            <nitrozen-error
                                                v-if="amount.showerror"
                                            >
                                                {{ amount.errortext }}
                                            </nitrozen-error>
                                        </div>
                                        <div
                                            class="pair uni"
                                            v-if="
                                                couponType === 'percentage_off'
                                            "
                                        >
                                            <nitrozen-input
                                                label="Percentage*"
                                                v-model="percentage.value"
                                                @keydown.native="allowNumbers"
                                            />
                                            <nitrozen-error
                                                v-if="percentage.showerror"
                                            >
                                                {{ percentage.errortext }}
                                            </nitrozen-error>
                                        </div>

                                        <nitrozen-input
                                            style="margin-left: 24px"
                                            label="Max Discount"
                                            v-model="discount.value"
                                            @keydown.native="allowNumbers"
                                        />
                                    </div>

                                    <div class="half base">
                                        <div class="form-input-item uni">
                                            <nitrozen-dropdown
                                                label="Duration"
                                                :items="selectedDuration"
                                                v-model="durationDrop.value"
                                                required
                                            />
                                            <nitrozen-error
                                                v-if="durationDrop.showerror"
                                            >
                                                {{ durationDrop.errortext }}
                                            </nitrozen-error>
                                        </div>

                                        <div
                                            class="form-input-item uni"
                                            style="margin-left: 24px"
                                        >
                                            <nitrozen-input
                                                label="Duration in Months*"
                                                v-model="duration.value"
                                                :disabled="
                                                    durationDrop.value == 'once'
                                                "
                                            />

                                            <nitrozen-error
                                                v-if="duration.showerror"
                                            >
                                                {{ duration.errortext }}
                                            </nitrozen-error>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="form-row app">
                                        <div class="form-input-item">
                                            <div
                                                class="
                                                    bold-md
                                                    cl-Mako
                                                    top-headers
                                                "
                                            >
                                                Applicable On
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-input-item app-item">
                                            <nitrozen-dropdown
                                                :searchable="true"
                                                id="dropplan"
                                                label="Plans"
                                                :items="selectPlan"
                                                v-model="selected_plan"
                                                :multiple="true"
                                                @change="pushPlan"
                                                @searchInputChange="searchPlan"
                                            >
                                            </nitrozen-dropdown>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-input-item">
                                            <div
                                                class="chip-container"
                                                v-for="(
                                                    item, index
                                                ) in selectedPlan.value"
                                                :key="index"
                                            >
                                                <nitrozen-chip
                                                    class="normal-chip"
                                                >
                                                    <div
                                                        class="
                                                            regular-xs
                                                            cl-Mako
                                                        "
                                                    >
                                                        {{ item.text }}
                                                    </div>

                                                    <div
                                                        @click="
                                                            () => {
                                                                let selected = [
                                                                    ...selectedPlan.value,
                                                                ];
                                                                selected.splice(
                                                                    index,
                                                                    1
                                                                );
                                                                selectedPlan.value =
                                                                    selected;
                                                                let vm =
                                                                    selectedPlan.value.map(
                                                                        (i) =>
                                                                            i.value
                                                                    );
                                                                selected_plan =
                                                                    vm;
                                                            }
                                                        "
                                                    >
                                                        <inline-svg
                                                            :src="'cross-black'"
                                                            class="
                                                                nitrozen-icon
                                                            "
                                                            title="Remove"
                                                        ></inline-svg>
                                                    </div>
                                                </nitrozen-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-input-item app-item">
                                            <nitrozen-dropdown
                                                :searchable="true"
                                                label="Subscribers"
                                                v-model="selected_Subs"
                                                :multiple="true"
                                                :items="selectSubscriber"
                                                @change="pushSubs"
                                                @searchInputChange="
                                                    searchSubscriber
                                                "
                                            >
                                            </nitrozen-dropdown>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-input-item">
                                            <div
                                                class="chip-container"
                                                v-for="(
                                                    item, index
                                                ) in selectedSubs.value"
                                                :key="index"
                                            >
                                                <nitrozen-chip
                                                    class="normal-chip"
                                                >
                                                    <div
                                                        class="
                                                            regular-xs
                                                            cl-Mako
                                                        "
                                                    >
                                                        {{ item.text }}
                                                    </div>

                                                    <div
                                                        @click="
                                                            () => {
                                                                let selected = [
                                                                    ...selectedSubs.value,
                                                                ];
                                                                selected.splice(
                                                                    index,
                                                                    1
                                                                );
                                                                selectedSubs.value =
                                                                    selected;
                                                                let vm =
                                                                    selectedSubs.value.map(
                                                                        (i) =>
                                                                            i.value
                                                                    );
                                                                selected_Subs =
                                                                    vm;
                                                            }
                                                        "
                                                    >
                                                        <inline-svg
                                                            :src="'cross-black'"
                                                            class="
                                                                nitrozen-icon
                                                            "
                                                            title="Remove"
                                                        ></inline-svg>
                                                    </div>
                                                </nitrozen-chip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="restriction">
                                    <div class="form-row">
                                        <div class="form-input-item">
                                            <div
                                                class="
                                                    bold-md
                                                    cl-Mako
                                                    top-headers
                                                "
                                            >
                                                Restriction
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-row res-item">
                                        <div
                                            class="
                                                form-input-item
                                                inline-content
                                            "
                                        >
                                            <nitrozen-checkbox
                                                v-model="maxUses"
                                            >
                                                Max. Uses
                                            </nitrozen-checkbox>
                                            <nitrozen-tooltip
                                                :position="'top'"
                                                :tooltipText="'Maximum uses for coupon'"
                                            ></nitrozen-tooltip>
                                        </div>
                                        <div class="form-input-item res-inp">
                                            <nitrozen-input
                                                :disabled="!maxUses"
                                                :type="'number'"
                                                :item_id="'max_item_price'"
                                                :placeholder="'Eg. 1,2,10,100'"
                                                v-model="maxUsesVal"
                                                @keydown.native="allowNumbers"
                                            >
                                            </nitrozen-input>
                                        </div>
                                    </div>
                                    <div class="form-row res-item">
                                        <div
                                            class="
                                                form-input-item
                                                inline-content
                                            "
                                        >
                                            <nitrozen-checkbox
                                                v-model="subscriberSpecific"
                                            >
                                                Subscriber Specific Uses
                                            </nitrozen-checkbox>
                                            <nitrozen-tooltip
                                                :position="'top'"
                                                :tooltipText="'Subscriber specific for coupon'"
                                            ></nitrozen-tooltip>
                                        </div>
                                        <div class="form-input-item res-inp">
                                            <nitrozen-input
                                                :disabled="!subscriberSpecific"
                                                :type="'number'"
                                                :item_id="'max_item_price'"
                                                :placeholder="'Eg. 1,2,10,100'"
                                                v-model="subscriberSpecificVal"
                                                @keydown.native="allowNumbers"
                                            >
                                            </nitrozen-input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right-form-container">
                        <div class="form-row">
                            <div class="form-input-item">
                                <div class="bold-md cl-Mako top-headers">
                                    Details
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-input-item full">
                                <nitrozen-input
                                    id="unique"
                                    :disabled="this.editMode"
                                    label="Code *"
                                    v-model="code.value"
                                    @keydown.native="alphanumric"
                                    @input="checkUnique"
                                />
                                <nitrozen-error v-if="code.showerror">
                                    {{ code.errortext }}
                                </nitrozen-error>
                                <nitrozen-error v-if="unique">
                                    Coupon code already exists
                                </nitrozen-error>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-input-item full">
                                <nitrozen-input
                                    label="Title *"
                                    v-model="titleCoupon.value"
                                />
                                <nitrozen-error v-if="titleCoupon.showerror">
                                    {{ titleCoupon.errortext }}
                                </nitrozen-error>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-input-item full">
                                <nitrozen-input
                                    type="textarea"
                                    label="Description"
                                    :maxlength="100"
                                    v-model="descriptionCoupon"
                                    placeholder="Enter Page Description"
                                ></nitrozen-input>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-input-item" style="width: 100%">
                                <nitrozen-dropdown
                                    label="Currency"
                                    :items="currency_options"
                                    v-model="currency"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <nitrozen-dialog
                class="remove_staff_dialog desc-dialog"
                ref="coupon_create_dialog"
                title="Create Coupon"
            >
                <template slot="header">
                    <div class="cross">Create Page</div>
                </template>
                <template slot="header">
                    <div class="cross" @click="closeModal">
                        <inline-svg :src="'cross-black'"></inline-svg>
                    </div>
                </template>
                <template slot="body" class="desc-dialog">
                    <div class="parent">
                        <div class="left">
                            <div class="sidebar">
                                <div
                                    class="childNameContainer"
                                    v-bind:class="{
                                        childSelected: selectedType == x.key,
                                    }"
                                    v-for="x in typeList"
                                    :key="x.key"
                                >
                                    <div
                                        class="childName"
                                        @click="
                                            () => {
                                                selectedType = x.key;
                                            }
                                        "
                                    >
                                        {{ x.title }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="right">
                            <div>
                                <div class="page-content global-font-family">
                                    <div class="title bold-sm cl-Mako">
                                        {{ title }}
                                    </div>
                                    <div
                                        class="
                                            subtitle
                                            regular-xs
                                            cl-DustyGray2
                                        "
                                    >
                                        {{ subtitle }}
                                    </div>
                                    <div class="title dark-xs cl-Mako">
                                        Example:
                                    </div>
                                    <pre
                                        class="sample-text"
                                        v-html="descriptions"
                                    ></pre>
                                </div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </template>
                <template slot="footer">
                    <div>
                        <nitrozen-button
                            v-flatBtn
                            class="mr24"
                            id="approve"
                            :theme="'secondary'"
                            @click="onCreate"
                            >Select and Proceed</nitrozen-button
                        >
                    </div>
                </template>
            </nitrozen-dialog>
        </div>
        <adm-schedule-modal
            v-if="show_schedule_modal"
            :isEditMode="editMode"
            :entity="'coupon'"
            :schedule="schedule"
            :scheduleActive="published"
            :isOpen="show_schedule_modal"
            :title="`${editMode ? 'Update' : 'Set'} Schedule`"
            @closedialog="show_schedule_modal = false"
            @saveSchedule="scheduleCoupon"
            class="schedule"
        ></adm-schedule-modal>
    </div>
</template>

<style lang="less" scoped>
::v-deep .inline-content {
    display: flex;
    flex-direction: row;
    align-items: center;
}
::v-deep .nitrozen-tooltip {
    margin-left: 10px;
}
.section-content {
    background-color: @Alabaster2;
    margin-top: 58.5px;
    //margin: 24px;
    @media @mobile {
        margin: 36px 0 0 0;
    }
}

::v-deep .coupon-form-container {
    box-sizing: border-box;
    min-width: 100%;
    display: flex;
    @media @mobile {
        display: block;
    }

    .page-container {
        margin-right: 12px;
        width: 95%;
        box-sizing: border-box;
    }

    .left-form-container {
        flex: 1;
        border-radius: 4px;
    }
    .right-form-container {
        padding: 24px;
        margin: 24px;
        margin-left: 12px;
        background-color: @White;
        border-radius: @BorderRadius;
        width: 348px;
        border-radius: 4px;
        @media @mobile {
            width: 100%;
            margin-left: 0;
            margin-top: 24px;
            margin-bottom: 48px;
        }
    }
}
.type-container {
    width: 100%;
    border-radius: @BorderRadius;
    box-sizing: border-box;
    margin: 6px 0;
    .header {
        box-sizing: border-box;
        width: 100%;
        .container {
            display: flex;
            .radio-item {
                display: flex;

                input {
                    display: none;
                }
                .radio-content {
                    display: flex;
                    align-items: center;
                    padding: 5px;
                    ::v-deep label {
                        padding-left: 20px;
                        height: 19px;
                    }
                }
            }
            .type-logo {
                min-width: 52px;
                height: 52px;
                background-color: #820000;
                border-radius: 50%;
                margin: 0 24px 0 16px;
            }

            .type-name {
                width: 100%;
                .name {
                    display: flex;
                    min-height: 27px;
                    .text-content {
                        flex: 1;
                    }
                }
                .example {
                    min-height: 27px;
                    line-height: 18px;
                    margin-bottom: 6px;
                }
            }
        }
    }

    + .type-container {
        margin-top: 12px;
    }

    .right-align {
        display: flex;
        justify-content: flex-end;
    }

    .text-btn {
        cursor: pointer;
    }

    .form-row.rule-row {
        padding-right: 60px;
        box-sizing: border-box;
        position: relative;
        align-items: baseline;
        border-bottom: 1px solid @Iron;
        flex-wrap: wrap;
        @media @mobile {
            padding-right: 0;
        }

        + .form-row.rule-row {
            padding-top: 24px;
        }

        .form-input-item {
            position: relative;
            display: flex;
            @media @mobile {
                width: 100%;
            }
            .input-container {
                display: flex;
                flex-direction: column;
                flex: 1;
                @media @mobile {
                    width: 100%;
                }
            }
        }
        .remove-btn {
            position: absolute;
            right: 12px;
            cursor: pointer;
            height: 28px;
            width: 28px;
            border-color: transparent;
            outline-color: transparent;
            margin-top: 24px; /* Todo: need to find better approach for positioning btn */

            ::v-deep svg {
                width: 100%;
                height: 100%;
            }
        }
    }
}
.form-row {
    width: 100%;
    display: flex;
    padding: 8px 0;
    margin: 0;
}
.half {
    display: flex;
    padding-right: 60px;
    padding-bottom: 30px;
}
.base {
    padding-bottom: 32px;
    border-bottom: 1px solid #e4e5e6;
}
.chip-container {
    display: inline-block;
    margin-bottom: 8px;
    .user-chip {
        border-radius: 4px;
        height: 60px;
        display: flex;
        align-items: center;
        .text-container {
            line-height: 17px;
        }
    }
    .normal-chip {
        display: flex;
        align-items: center;
        .text-container {
            line-height: 17px;
        }
    }
}
.app-item {
    width: 100%;
}
.res-item {
    justify-content: space-between;
    padding-right: 60px;
    .res-inp {
        width: 50%;
    }
}
.app {
    padding-top: 24px;
}
.publish-status {
    line-height: 56.5px;
    cursor: pointer;
    color: @RoyalBlue;
    // font-weight: 700;
    // font-size: 12px;
    -webkit-font-smoothing: antialiased;
    @media @mobile {
        line-height: 20px;
    }
}
.publish-status-disabled {
    color: @DustyGray2;
}
.actions {
    margin-top: 8.75px;
    padding-left: 24px;
}
.main-container {
    background-color: white;
    margin: 24px;
    padding: 24px;
}

.custom-header {
    ::v-deep .n-flat-button-secondary {
        margin-top: 110px !important;
    }
}
.left {
    flex-basis: 300px;
    border-right: 1px solid #d0d0d0;
    overflow: hidden;
    padding-top: 12px;
    .sidebar {
        position: fixed;
        width: 14.3%;
        .group {
            margin-bottom: 12px;
        }
        .groupNameContainer {
            padding: 6px 0px;
            width: 100%;
            color: #9b9b9b;
            font-family: Inter;
            font-size: 12px;
            letter-spacing: 0;
            line-height: 17px;
            .groupName {
                margin: 0px 12px;
            }
        }
        .childNameContainer {
            display: flex;
            padding: 6px 6px;
            color: #212121;
            font-family: Inter;
            font-size: 14px;
            letter-spacing: 0;
            line-height: 23px;
            cursor: pointer;
            .childName {
                margin: 0px 12px;
                flex: 4;
            }
            .child-linked {
                flex: 1;
            }
        }
        .childNameContainer:hover {
            background-color: rgba(92, 107, 221, 0.12);
        }
        .childSelected {
            background-color: rgba(92, 107, 221, 0.12);
        }
        .page-error {
            width: auto;
            img {
                width: 100%;
                height: auto;
            }
        }
    }
}
.right {
    flex-basis: 100%;
    display: flex;
    height: 100%;
    flex-direction: column;
    overflow: auto;
    height: auto;
    max-height: 100%;
    padding: 24px;
    flex-basis: 100%;
    border-bottom: 1px solid #d0d0d0;
}
.parent {
    display: flex;
}
.page-content {
    font-family: Inter, sans-serif;
}
.title {
    margin-bottom: 12px;
}
.subtitle {
    margin-bottom: 20px;
}
.sample-text {
    font-family: inherit;
    .font-size(@font-xs);
    background: #f2f2f2;
    line-height: 20px;
    ::v-deep b {
        font-weight: 600;
    }
}
.desc-dialog {
    ::v-deep.nitrozen-dialog-body {
        padding: 0px;
    }
    ::v-deep.nitrozen-dialog-header {
        margin-bottom: 0px;
    }
}
.cross {
    margin: 0px;
}
.pair {
    display: flex;
    flex-direction: column;
}
.uni {
    width: 246.5px;
}
.full {
    width: 100%;
}
.schedule-btn {
    // width: 24px;
    // height: 24px;
    margin-top: 8.5px;
    margin-right: 8px;
    cursor: pointer;
}
.pad-right {
    width: 40px;
    height: 30px;
}
</style>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenDropdown,
    NitrozenDialog,
    NitrozenRadio,
    NitrozenPagination,
    NitrozenToggleBtn,
    NitrozenChips,
    NitrozenCheckBox,
    NitrozenTooltip,
    NitrozenError,
} from '@gofynd/nitrozen-vue';
import { PageHeader, Loader } from '@/components/common/';
import { TYPE_DATA } from '@/helper/coupon-helper';
//import { allowNumbersOnly } from '@/helper/utils'
import { allowNumbersOnly, allowAlphaNumbericOnly } from '@/helper/utils';
import inlinesvg from '@/components/common/ukt-inline-svg.vue';
import schedulemodal from '@/components/common/schedule-modal.vue';
import admInlineSVG from '@/components/common/adm-inline-svg';
import BillingService from '@/services/billing.service.js';
import { debounce } from '../../helper/utils';

export default {
    name: 'coupon-create-update',
    components: {
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox,
        PageHeader,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-chip': NitrozenChips,
        'inline-svg': inlinesvg,
        'adm-inline-svg': admInlineSVG,
        'adm-schedule-modal': schedulemodal,
        NitrozenError,
        Loader,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    computed: {
        title() {
            return TYPE_DATA[this.selectedType].title;
        },
        subtitle() {
            return TYPE_DATA[this.selectedType].subtitle;
        },
        descriptions() {
            return TYPE_DATA[this.selectedType].description;
        },
    },
    data() {
        return {
            editMode: false || !!this.$route.params.couponId,
            published: true,
            currency_options: [
                {
                    text: 'INR',
                    value: 'INR',
                },
            ],
            selectedPlan: {
                value: [],
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            selectedSubs: {
                value: [],
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            selectPlan: [],
            selectSubscriber: [],
            selectedDuration: [
                { text: 'Once', value: 'once' },
                { value: 'repeating', text: 'Repeating' },
            ],
            typeList: [...TYPE_DATA],
            selectedType: '0',
            amount: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            percentage: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            discount: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            duration: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            durationDrop: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            code: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            titleCoupon: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            descriptionCoupon: '',
            selected_plan: ['all'],
            selected_Subs: ['all'],
            maxUses: false,
            maxUsesVal: '',
            subscriberSpecific: false,
            subscriberSpecificVal: '',
            currency: 'INR',
            couponType: this.$route.params.couponType,
            value_type: '',
            pageLoading: false,
            inProgress: false,
            unique: false,
            remaining: '',
            show_schedule_modal: false,
            schedule: {},
        };
    },
    mounted() {
        Promise.all([this.fetchPlans(), this.fetchSubscriber()]).then(() => {
            if (this.editMode) {
                this.updateFields();
            }
            this.couponType == 'amount_off'
                ? (this.selectedType = '1')
                : (this.selectedType = '0');

            this.value_type = this.typeList[this.selectedType].value_type;
           

            let currentplans = this.selectPlan.filter((it) =>
                this.selected_plan.includes(it.value)
            );
            this.selectedPlan.value = currentplans;
            let currentsubs = this.selectSubscriber.filter((it) =>
                this.selected_Subs.includes(it.value)
            );
            this.selectedSubs.value = currentsubs;
        });
    },
    methods: {
        openModal: function () {
            this.$refs['coupon_create_dialog'].open({
                width: '1100px',
                height: '600px',
            });
        },
        closeModal() {
            this.$refs['coupon_create_dialog'].close();
        },
        fetchPlans(plan) {
            return BillingService.getPlans({ name: plan, page_size: 50 }).then(
                (res) => {
                    let docs = res.data.items;
                    let drop = [{ text: 'All', value: 'all' }];
                    for (let i = 0; i < docs.length; i++) {
                        let abc = { text: '', value: '' };
                        let name =
                            docs[i].name +
                            ' ' +
                            docs[i].amount +
                            ' per ' +
                            docs[i].recurring.interval;
                        abc.text = name;
                        abc.value = docs[i]._id;
                        drop.push(abc);
                    }
                    this.selectPlan = drop;
                }
            );
        },
        fetchSubscriber(subscriber) {
            return BillingService.getSubscribers({
                name: subscriber,
                page_size: 50,
            }).then((res) => {
                let docs = res.data.items;

                let drop = [{ text: 'All', value: 'all' }];
                for (let i = 0; i < docs.length; i++) {
                    let abc = { text: '', value: '' };
                    abc.text = docs[i].unique_id + ' ' + docs[i].name;
                    abc.value = docs[i]._id;
                    drop.push(abc);
                }
                this.selectSubscriber = drop;
            });
        },
        searchSubscriber(e) {
            if (e && e.text) {
                debounce(() => {
                    this.fetchSubscriber(e.text);
                }, 400)();
            }
            this.fetchSubscriber('');
        },
        searchPlan(e) {
            if (e && e.text) {
                debounce(() => {
                    this.fetchPlans(e.text);
                }, 400)();
            }
            this.fetchPlans('');
        },
        updateFields() {
            BillingService.getCouponId(this.$route.params.couponId).then(
                (res) => {
                    let data = res.data;
                    this.published = data.published;
                    data.rule_definition.duration
                        ? (this.durationDrop.value =
                              data.rule_definition.duration)
                        : (this.durationDrop.value = '');
                    data.rule_definition.duration_in_months
                        ? (this.duration.value =
                              data.rule_definition.duration_in_months)
                        : (this.duration.value = '');
                    data.display_meta.title
                        ? (this.titleCoupon.value = data.display_meta.title)
                        : (this.titleCoupon.value = '');
                    data.rule_definition.max_discount
                        ? (this.discount.value =
                              data.rule_definition.max_discount)
                        : (this.discount.value = '');

                    data.restrictions.uses.maximum.total !== -1
                        ? ((this.maxUsesVal =
                              data.restrictions.uses.maximum.total),
                          (this.maxUses = true))
                        : (this.maxUsesVal = '');
                    data.restrictions.uses.maximum.user !== -1
                        ? ((this.subscriberSpecificVal =
                              data.restrictions.uses.maximum.user),
                          (this.subscriberSpecific = true))
                        : (this.subscriberSpecificVal = '');
                    data.code
                        ? (this.code.value = data.code)
                        : (this.code.value = '');
                    data.display_meta.description
                        ? (this.descriptionCoupon =
                              data.display_meta.description)
                        : (this.descriptionCoupon = '');
                    if (data.type == 'percentage_off') {
                        data.rule_definition.value
                            ? (this.percentage.value =
                                  data.rule_definition.value * 100)
                            : (this.percentage.value = '');
                    } else {
                        data.rule_definition.value
                            ? (this.amount.value = data.rule_definition.value)
                            : (this.amount.value = '');
                    }
                    data.identifiers.plans.length === 0
                        ? (this.selected_plan = ['all'])
                        : (this.selected_plan = data.identifiers.plans);
                    data.identifiers.subscribers.length === 0
                        ? (this.selected_Subs = ['all'])
                        : (this.selected_Subs = data.identifiers.subscribers);

                    let currentplans = this.selectPlan.filter((it) =>
                        this.selected_plan.includes(it.value)
                    );
                    this.selectedPlan.value = currentplans;

                    
                    let currentsubs = this.selectSubscriber.filter((it) =>
                        this.selected_Subs.includes(it.value)
                    );
                    this.selectedSubs.value = currentsubs;

                    //this.remaining = data.restrictions.uses.remaining.total;
                    //console.log(this.remaining);
                }
            );

            this.pushPlan();
            this.pushSubs();
        },
        onCreate() {
            this.couponType = this.typeList[this.selectedType].value_title;
            this.$router
                .push({
                    path: `/administrator/subscription/coupons/create/${this.couponType}`,
                })
                .catch(() => {});
            this.closeModal();
        },
        checkform() {
            let isValid = true;

            if (this.amount.value > 0) {
                this.amount.showerror = false;
            } else if (this.couponType == 'amount_off') {
                this.amount.showerror = true;
                isValid = false;
            }

            if (this.percentage.value > 0) {
                this.percentage.showerror = false;
            } else if (this.couponType == 'percentage_off') {
                this.percentage.showerror = true;
                isValid = false;
            }

            if (
                this.couponType == 'percentage_off' &&
                this.percentage.value > 100
            ) {
                this.percentage.showerror = true;
                this.percentage.errortext = 'cannot exceed more than 100';
                isValid = false;
            }

            if (this.duration.value > 0) {
                this.duration.showerror = false;
            }
            if (
                this.durationDrop.value == 'repeating' &&
                this.duration.value < 0
            ) {
                this.duration.showerror = true;
                isValid = false;
            }

            if (this.durationDrop.value !== '') {
                this.durationDrop.showerror = false;
            } else {
                this.durationDrop.showerror = true;
                isValid = false;
            }

            if (this.titleCoupon.value !== '') {
                this.titleCoupon.showerror = false;
            } else {
                this.titleCoupon.showerror = true;
                isValid = false;
            }

            if (this.code.value !== '') {
                this.code.showerror = false;
            } else {
                this.code.showerror = true;
                isValid = false;
            }
            return isValid;
        },
        saveForm() {
            let val, plan, subscriber;
            let maxuses = '-1',
                specific = '-1';
            this.value_type == 'absolute'
                ? (val = this.amount.value)
                : (val = this.percentage.value / 100);
            this.selected_plan == 'all'
                ? (plan = [])
                : (plan = this.selected_plan);
            this.selected_Subs == 'all'
                ? (subscriber = [])
                : (subscriber = this.selected_Subs);

            if (this.maxUses) {
                maxuses = this.maxUsesVal;
            }
            if (this.subscriberSpecific) {
                specific = this.subscriberSpecificVal;
            }
            let data = {
                code: this.code.value,
                type: this.couponType,
                restrictions: {
                    uses: {
                        maximum: {
                            user: specific,
                            total: maxuses,
                        },
                        remaining: {},
                    },
                },
                rule_definition: {
                    type: this.value_type,
                    value: val,
                    duration: this.durationDrop.value,
                    duration_in_months: this.duration.value,
                    max_discount: this.discount.value,
                },
                display_meta: {
                    title: this.titleCoupon.value,
                    description: this.descriptionCoupon,
                },
                identifiers: {
                    plans: plan,
                    subscribers: subscriber,
                },
                published: this.published,
                author: {},
                _schedule: this.schedule,
            };

            if (!this.checkform()) {
                return;
            }
            this.pageLoading = true;

            if (!this.editMode) {
                BillingService.postCouponList(data)
                    .then((res) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showSuccess(
                            'Coupon created successfully',
                            {
                                duration: 2000,
                            }
                        );
                        this.$router
                            .push({
                                path: `/administrator/subscription/coupons`,
                            })
                            .catch(() => {});
                    })
                    .catch((error) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showError(
                            `${
                                error.response.data.message
                                    ? error.response.data.message
                                    : JSON.stringify(error.response.data)
                            }`
                        );
                    });
            }
            if (this.editMode) {
                BillingService.putCouponList(data, this.$route.params.couponId)
                    .then((res) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showSuccess(
                            'Coupon updated successfully',
                            {
                                duration: 2000,
                            }
                        );
                        this.$router
                            .push({
                                path: `/administrator/subscription/coupons`,
                            })
                            .catch(() => {});
                    })
                    .catch((error) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showError(
                            `${
                                error.response.data.message
                                    ? error.response.data.message
                                    : JSON.stringify(error.response.data)
                            }`
                        );
                    });
            }
        },
        pushPlan() {
            if (this.selected_plan.includes('all')) {
                for (var i = 0; i < this.selected_plan.length; i++) {
                    if (this.selected_plan[i] === 'all') {
                        this.selected_plan.splice(i, 1);
                    }
                    if (
                        this.selected_plan[this.selected_plan.length - 1] ===
                        'all'
                    ) {
                        this.selected_plan = ['all'];
                        break;
                    }
                }
                if (this.selected_plan.length === 0) {
                    this.selected_plan = ['all'];
                }
            }

            let selected_stores = this.selectPlan.map((it) => it.value);
            let newplan = selected_stores.filter((item) =>
                this.selected_plan.includes(item)
            );
            this.selectedPlan.value = [];
            this.selectedPlan.value.push(
                ...this.selectPlan.filter((it) => newplan.includes(it.value))
            );

            let current = this.selectPlan.filter((it) =>
                this.selected_plan.includes(it.value)
            );
        },
        pushSubs() {
            if (this.selected_Subs.includes('all')) {
                for (var i = 0; i < this.selected_Subs.length; i++) {
                    if (
                        this.selected_Subs[this.selected_Subs.length - 1] ===
                        'all'
                    ) {
                        this.selected_Subs = ['all'];
                        break;
                    }
                    if (this.selected_Subs[i] === 'all') {
                        this.selected_Subs.splice(i, 1);
                    }
                }
            }

            let selected_stores = this.selectSubscriber.map((it) => it.value);
            let newsubs = selected_stores.filter((item) =>
                this.selected_Subs.includes(item)
            );
            this.selectedSubs.value = [];
            this.selectedSubs.value.push(
                ...this.selectSubscriber.filter((it) =>
                    newsubs.includes(it.value)
                )
            );
        },
        allowNumbers(event) {
            allowNumbersOnly(event);
        },
        alphanumric(event) {
            allowAlphaNumbericOnly(event);
        },
        checkUnique() {
            BillingService.getUniqueCoupon(this.code.value)
                .then((res) => {
                    this.unique = !res.data.is_unique;
                })
                .catch((res) => {
                    this.unique = false;
                });
        },
        changePublish() {
            if (this.editMode) {
                this.inProgress = true;
                let data = {
                    code: this.code.value,
                    published: this.published,
                };
                BillingService.putCouponList(data, this.$route.params.couponId)
                    .then((res) => {
                        this.$snackbar.global.showSuccess(
                            this.published
                                ? 'Page published successfully'
                                : 'Page unpublished successfully'
                        );
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(
                            `Failed to ${
                                this.published ? 'publish' : 'unpublish'
                            } page`
                        );
                        this.published = !this.published;
                        console.error(err);
                    })
                    .finally(() => {
                        this.inProgress = false;
                    });
            }
        },
        scheduleCoupon(schedule) {
            // this._schedule.cron = schedule.cron || null;
            // this._schedule.start = schedule.start;
            // this._schedule.end = schedule.end || null;
            // this._schedule.duration =
            //     (schedule.duration && Number(schedule.duration)) || null;
            this.schedule = schedule;
            this.saveForm();
        },
        onSaveCoupon(){
            if(this.editMode){
                this.saveForm()
                return;
            }
            this.show_schedule_modal = true;
        }
    },
};
</script>