<template>
    <div class="page-container" style="min-height:100%">
        <div class="cl-Mako bold-md top-headers">Assign</div>
        <nitrozen-dropdown
            :searchable="true"
            @searchInputChange="staffSearch"
            @change="somethingChanged"
            class="type-filter"
            :label="'Assigned To'"
            v-model="agentID"
            :items="filteredStaff"
        ></nitrozen-dropdown>
        <nitrozen-dropdown
            :searchable="false"
            class="type-filter mt-sm"
            :label="'Status'"
            v-if="isEditOnly && filters"
            v-model="status"
            :items="filters.statuses"
            @change="somethingChanged"
        ></nitrozen-dropdown>
        <div class="mt-sm">
            <nitrozen-dropdown
                :searchable="false"
                class="type-filter"
                :label="'Priority'"
                v-if="filters"
                v-model="priority"
                :items="filters.priorities"
                @change="somethingChanged"
            ></nitrozen-dropdown>
        </div>
        <div class="mt-sm" v-if="isPlatformTicket && filters">
            <nitrozen-dropdown
                :searchable="true"
                class="type-filter"
                :label="'Category'"
                v-model="category"
                :items="filteredCategory"
                @searchInputChange="categorySearch"
                @change="somethingChanged"
            ></nitrozen-dropdown>
        </div>
        <div class="mt-sm" v-if="isPlatformTicket && subCategoryList && subCategoryList.length > 0">
            <nitrozen-dropdown
                :searchable="false"
                class="type-filter"
                :label="'Sub-category'"
                v-model="sub_category"
                :items="subCategoryList"
                @change="somethingChanged"
            ></nitrozen-dropdown>
        </div>
        <!-- <div class="date" v-if="ticket.time_slot">
            <adm-form-input :item="ticket.time_slot" :custom="true">
                <adm-date-picker
                    class="st-date mt-sm"
                    :date_format="'YYYY-MM-DD hh:mm:ss a'"
                    :picker_type="'datetime'"
                    v-model="ticket.time_slot.start"
                    :not_before="new Date().toISOString()"
                    :not_after="ticket.time_slot.end"
                    :label="'Start time'"
                />
            </adm-form-input>
            <adm-form-input :item="ticket.time_slot" :custom="true">
                <adm-date-picker
                    item_id="eDate"
                    class="mt-sm"
                    :picker_type="'datetime'"
                    :date_format="'YYYY-MM-DD hh:mm:ss a'"
                    v-model="ticket.time_slot.end"
                    :not_before="ticket.time_slot.start"
                    :label="'End time'"
                />
            </adm-form-input>
        </div> -->
        <div class="tags-container form-field">
            <div>
                <span class="nitrozen-label">Tags</span>
            </div>
            <div class="input-text tags" @click="focusOnChipInput">
                <div class="chips-input">
                    <nitrozen-chips
                        class="chip-wrapper"
                        v-for="(item, index) in tags"
                        :key="index"
                        >{{ item }}
                        <nitrozen-inline
                            :icon="'cross'"
                            class="nitrozen-icon"
                            v-on:click="removeChip(index)"
                        ></nitrozen-inline>
                    </nitrozen-chips>
                    <input
                        placeholder="Add some tags"
                        ref="chipInput"
                        type="text"
                        class="chip-input cl-Mako light-xs"
                        @keydown.enter="addChip"
                        @keydown.tab="addChip"
                        v-model="chipInput"
                    />
                </div>
            </div>
        </div>
        <div
            class="cl-Mako bold-md top-headers"
            style="margin-top: 12px"
            v-if="attachments.length"
        >
            Attachments
        </div>
        <div>
            <template v-if="attachments.length">
                <div
                    v-for="(attachment, index) in attachments"
                    v-bind:key="index"
                >
                    <attachment
                        :attachment="attachment"
                        :index="index"
                        @deleteAttachmentAt="deleteAttachmentAt"
                    >
                    </attachment>
                </div>
            </template>
            <!-- <mirage-image-uploader
                class="mr-l mt-sm"
                text="Add Image"
                label="banner image"
                aspectRatio="*"
                :minimumResolution="{
                    width: 540
                }"
                @save="
                    attachments.push({
                        display: 'image_file',
                        type: 'image',
                        value: $event
                    });
                    somethingChanged();
                "
                v-model="imageTemp"
                :fileName="name.value"
                namespace="support-ticket-file"
            ></mirage-image-uploader> -->
            <div
                v-if="ticket.context.company_id"
                class="add-attachment mt-sm"
                @click="openAddAttachmentDialogue()"
                :shouldShowProduct="false"
                style="padding-left:8px"
            >
                <span> + Add Attachments</span>
            </div>
        </div>
        <add-attachment-dialog
            ref="addAttachment"
            :company_id="ticket.context.company_id"
            @close="$openAddAttachmentDialogueClosed"
        >
        </add-attachment-dialog>
    </div>
</template>

<style lang="less" scoped>
@import './../../less/form.less';
@import './../../less/page-ui.less';
@import './../../less/page-header.less';

.add-attachment {
    display: flex;
    align-items: center;
    border: 1px solid @Iron;
    border-radius: 4px;
    min-height: 32px;
    font-size: 14px;
    width: 100%;
    align-items: center;
    cursor: pointer;
    color: #9b9b9b;
}

.mt-sm {
    margin-top: 8px;
}
.custom-form-input {
    min-width: 100%;
    ::v-deep label {
        font-size: 12px;
    }
}
.nitrozen-label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
.tags-container {
    margin-top: 8px;
    /deep/label {
        font-size: 12px;
    }
}
.tags {
    border: 1px solid @Iron;
    border-radius: 4px;
    min-height: 72px;
    .nitrozen-chip {
        margin: 5px;
        height: 30px;
        padding: 0 9px;
        font-size: 12px;
        line-height: 30px;
    }
    .chip-input {
        width: 200px;
        border: none;
        font-family: Inter, sans-serif;
        font-size: 11px;
        font-weight: 400;
        margin: 4px;
    }
}

::v-deep .image-uploader-container .image-uploader-meta .meta-info {
    font-size: 12px !important;
}

::v-deep .image-uploader-container .image-uploader .no-image .label {
    font-size: 12px;
}

::v-deep .dark-xs {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}

.date {
    width: 100%;
    ::v-deep .form-row {
        margin: unset;
        ::v-deep .form-error {
            margin: unset;
            padding-bottom: unset;
        }
    }
}
</style>
<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    NitrozenCheckBox,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';

// import mirageimageuploader from '@/components/admin/common/image-uploader/index.vue';
// import admforminput from './../../../../components/admin/common/adm-form-input.vue';
import { getRoute } from '@/helper/get-route';
import attachment from './attachment.vue';
// import datePicker from '@/components/admin/common/date-picker.vue';
import addAttachmentDialogue from './add-attachment.vue';
import { display } from '@/auto_gen/admin-svgs.js';

export default {
    name: 'detail-section',
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-inline': NitrozenInline,
        // 'adm-form-input': admforminput,
        // 'adm-date-picker': datePicker,
        // 'mirage-image-uploader': mirageimageuploader,
        'add-attachment-dialog': addAttachmentDialogue,
        attachment: attachment
    },
    props: {
        filters: {
            type: Object
        },
        ticket: {
            type: Object
        },
        staff: {
            type: Array
        }
    },
    data() {
        return {
            status: '',
            agentID: undefined,
            agentName: undefined,
            priority: '',
            category: '',
            sub_category: '',
            imageTemp: '',
            attachments: [],
            tags: [],
            chipInput: '',
            filteredStaff: [],
            subCategoryList: [],
            name: this.getInitialValue(),
            filteredCategory: this.filters.categories
        };
    },
    computed: {
        isEditOnly() {
            const ticketID = this.$route.params.ticket_id;
            return ticketID != undefined;
        },
        isPlatformTicket() {
            const route = getRoute(this.$route);
            return !route.includes('application');
        }
    },
    mounted() {
        this.filteredStaff = this.staff;
        this.status = this.ticket.status;
        this.category = this.ticket.category;
        this.sub_category = this.ticket.sub_category;
        const selectedCategory = this.filters.categories.find((el) => {
            return (el.key == this.category);
        });
        this.subCategoryList = selectedCategory.sub_categories;
        this.priority = this.ticket.priority;
        this.attachments = this.ticket.content.attachments;
        this.tags = this.ticket.tags || [];

        if (this.ticket.assigned_to && this.ticket.assigned_to.agent_id) {
            this.agentID = this.ticket.assigned_to.agent_id;
        }
    },
    methods: {
        getInitialValue() {
            return {
                showerror: false,
                value: '',
                errortext: '-'
            };
        },
        addChip(event) {
            if (this.chipInput) {
                if (
                    this.tags.filter((it) => it === this.chipInput).length === 0
                ) {
                    this.tags.push(this.chipInput);
                }
                this.chipInput = '';
            }
            event.preventDefault();
        },
        removeChip(index) {
            this.tags.splice(index, 1);
        },
        focusOnChipInput() {
            this.$refs['chipInput'].focus();
        },
        staffSearch(e) {
            if (e && e.text) {
                this.filteredStaff = this.staff.filter(
                    (a) =>
                        a.text.toLowerCase().indexOf(e.text.toLowerCase()) > -1
                );
            } else {
                this.filteredStaff = this.staff;
            }
        },
        categorySearch(e) {
            if (e && e.text) {
                this.filteredCategory = this.filters.categories.filter(
                    (a) =>
                        a.text.toLowerCase().indexOf(e.text.toLowerCase()) > -1
                );
            } else {
                this.filteredCategory = this.filters.categories;
            }
        },
        somethingChanged() {
            this.filteredCategory = this.filters.categories;
            const selectedCategory = this.filters.categories.find((el) => {
                return (el.key == this.category);
            });
            this.subCategoryList = selectedCategory.sub_categories;
            if (this.subCategoryList && this.subCategoryList.length  > 0) {
                var present = this.subCategoryList.find((el) => {
                    return (el.key == this.sub_category);
                });
                if (present == undefined) {
                    this.sub_category = '';
                }
            } else {
                this.sub_category = '';
            }
            this.$emit(`something-changed`, {
                status: this.status,
                priority: this.priority,
                category: this.category,
                sub_category: this.sub_category,
                tags: this.tags,
                assigned_to: this.agentID,
                attachments: this.attachments
            });
        },
        openAddAttachmentDialogue() {
            let isAvailable = false;
            for(let i=0; i < this.attachments.length; i++){
                if(this.attachments[i].type == 'shipment'){
                    isAvailable = true;
                    break;
                }
            }

            if(isAvailable) {
                this.$snackbar.global.showError("You have already added one shipment")
                this.hideActions();
                return;
            }
            this.$refs.addAttachment.open();
        },
        $openAddAttachmentDialogueClosed(attachment) {
            this.attachments.push(attachment);
            this.somethingChanged();
        },
        deleteAttachmentAt(index) {
            this.attachments.splice(index, 1);
            this.somethingChanged();
        }
    }
};
</script>
