<template>
    <div class="sections-container">
        <!-- Section Settings Builder -->
        <!-- <nitrozen-dialog
            class="section-settings-dialog"
            ref="section_settings_dialog"
            title="Settings"
            @close="selectedSectionIndex = -1"
        >
            <template slot="body">
                <section-predicate
                    ref="section_settings"
                    v-if="previewUrl !== undefined"
                    :navigationOnly="true"
                    :previewUrl="previewUrl"
                    @scrollBottom="scrollToBottom"
                ></section-predicate>
            </template>
            <template slot="footer">
                <nitrozen-button
                    :theme="'secondary'"
                    v-flatBtn
                    @click="updateSection"
                    >Update Preview
                </nitrozen-button>
            </template>
        </nitrozen-dialog>

        <section-form
            :section="selectedSection"
            :section_schema="selectedSectionSchema"
            :show="showSectionForm"
            :page="page"
            @close="
                selectedSectionIndex = -1;
                showSectionForm = false;
            "
            @update-block="updateBlocks"
        ></section-form>

        <available-sections-list
            :available_sections="available_sections"
            @select="addSectionToPreview($event)"
            @add-section="addSection($event)"
            @remove_preview="removeSectionFromPreview()"
            :show="showAvailableSections"
            @close="
                selectedSectionIndex = -1;
                showAvailableSections = false;
                removeSectionFromPreview();
            "
            :page="page"
        /> -->

        <div class="heading">
            <p>Sections</p>
        </div>

        <!-- <div class="tabs">
            <p 
                v-for="(tab,index) in tabs"
                :key="index"
                @click="activeTab = tab"
                :class="{ 'active-tab': activeTab === tab }">
                {{ tab }}
            </p>
        </div> -->

        <!-- <div class="draggable-items nitrozen-scrollbar"> -->
            <!-- <div class="sections-tab" v-if="activeTab === 'Sections'">
                <div v-if="pageSectionsMeta">
                    <draggable
                        :list="mSections"
                        :move="onMove"
                        v-bind="dragOptions"
                        class="sections"
                        @change="onChange"
                        handle=".handle"
                        @start="
                            dragging=true;
                            $emit('zoom-out');
                        "
                        @end="dragStop"
                        v-if="available_sections.length > 0"
                    >
                        <transition-group
                            type="transition"
                            :name="!dragging ? 'flip-list' : null"
                        >
                            <div
                                v-for="(section, i) in mSections"
                                :key="`${i}`"
                                class="section"
                            >
                                <div
                                    @mouseup="dragStop"
                                    @mousedown="dragStart(i)"
                                >
                                    <adm-inline-svg
                                        class="handle"
                                        :src="'move'"
                                        :class="{ grabbable: dragging }"
                                    />
                                </div>
                                <div 
                                    class="title-container"
                                    :class="{
                                        hide_section:
                                            section.isVisible === undefined ||
                                            section.isVisible
                                                ? false
                                                : true,
                                    }">
                                    <span
                                        @click.stop="onSectionClick(section, i)"
                                        class="title"
                                        :class="{
                                            active_title:
                                                selectedSectionIndex === i,
                                        }"
                                        v-if="sectionSchemaMap[section.name]"
                                        >{{
                                            sectionSchemaMap[section.name].label
                                        }}</span
                                    >
                                </div>

                                <span
                                    @click="
                                        $sectionSettingsBuilder(
                                            {
                                                section: section,
                                                index: i,
                                            },
                                            $event
                                        )
                                    "
                                    class="section-settings"
                                >
                                    <adm-inline-svg
                                        :src="
                                            section.isVisible === undefined ||
                                            section.isVisible
                                                ? 'eye-open'
                                                : 'eye-close'
                                        "
                                    ></adm-inline-svg>
                                </span>
                                <span
                                    @click="copySection(section)"
                                    class="section-settings"
                                >
                                    <adm-inline-svg
                                        class="copy_icon"
                                        :src="'copy'"
                                    />
                                </span>
                                <span
                                    @click="removeSection(i)"
                                    class="section-settings"
                                >
                                    <adm-inline-svg :src="'cross-black'" />
                                </span>
                            </div>
                        </transition-group>
                    </draggable>

                    <div
                        class="add-section"
                        @click="onAddButtonClick($event)"
                        v-if="available_sections.length > 0"
                    >
                        <adm-inline-svg
                            class="add-section-icon"
                            :src="'add-icon'"
                        />
                        <span>Add Section</span>
                    </div>
                </div>

                <div
                    class="no-config"
                    v-if="!available_sections.length || !pageSectionsMeta"
                >
                    <p>No Sections Available</p>
                </div>
            </div> -->

            <!-- <div class="page-settings-tab" v-if="activeTab === 'Page'"> -->
                <!-- <div v-if="getPageConfigSchema(page).length">
                    <dynamic-input
                        v-for="(prop_schema, i) in getPageConfigSchema(page)"
                        :key="i"
                        :prop_schema="prop_schema"
                        :prop="{
                            type: prop_schema.type,
                            value: getPageConfigData(page)[prop_schema.id],
                        }"
                        :page="page"
                        :name="`pagesetting-${prop_schema.id}-${i}`"
                        @change="onPageSettingInputChange(prop_schema, $event)"
                    />
                </div>
                <div class="no-config" v-else>
                    <p>No Page Configuration Available</p>
                </div> -->
            <!-- </div> -->

            <!-- <div class="settings-tab" v-if="activeTab === 'Page'"> -->
                <!-- Settings -->
            <!-- </div> -->
        <!-- </div> -->

        <!-- <div class="actions">
            <nitrozen-button 
                :theme="'secondary'" 
                v-flatBtn 
                @click="onSaveButtonClick($event)" 
                :showProgress="inProgress" 
                :disabled="inProgress"> 
                Save {{ preview ? ' Preview' : '' }}
            </nitrozen-button>
            <nitrozen-menu class="menu" mode="vertical" position="top">
                <nitrozen-menu-item @click="$emit('reset')">
                    Reset
                </nitrozen-menu-item>
            </nitrozen-menu>
        </div> -->
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenDialog, NitrozenButton, NitrozenDropdown,
    NitrozenMenu, NitrozenMenuItem
} from '@gofynd/nitrozen-vue';
import draggable from 'vuedraggable';

/* Constants and Helpers */
import { PREVIEW_EVENTS } from '@/helper/constants.js';

/* Component imports */
import AdmInlineSVG from '@/components/common/adm-inline-svg.vue';
// import SectionPredicate from './section-predicate.vue';
// import SectionForm from './section-form.vue';
// import AvailableSectionsList from './available-sections-list.vue';

const defaultPredicate = {
    screen: {
        mobile: true,
        desktop: true,
        tablet: true,
    },
    user: {
        authenticated: true,
        anonymous: true,
    },
    route: {
        selected: 'none',
        exact_url: '',
        query: {},
    },
};

export default {
    name: 'sections-list',
    components: {
        draggable,
        NitrozenDialog,
        NitrozenButton,
        NitrozenDialog,
        NitrozenDropdown,
        NitrozenMenu,
        NitrozenMenuItem,
        'adm-inline-svg': AdmInlineSVG,
        // 'section-predicate': SectionPredicate,
        // 'section-form': SectionForm,
        // 'available-sections-list': AvailableSectionsList
    },
    props: [
        'sections',
        'available_sections',
        'page',
        'pages',
        'currentfont',
        'previewUrl',
        'pageObject',
        'inProgress'
    ],
    directives: {
        strokeBtn,
        flatBtn,
    },
    data() {
        return {
            mSections: [],
            sectionSchemaMap: {},
            showAvailableSections: false,
            showSectionForm: false,
            selectedSectionIndex: -1,
            selectedSectionSchema: {},
            selectedSectionIndex: -1,
            selectedSection: {},
            tabs: ['Sections', 'Settings'],
            activeTab: 'Sections',
            loading: false,
            dragging: false,
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost',
            },
            movingIndex: -1
        }
    },
    computed: {
        // pageSectionsMeta() {
        //     if(this.page && this.page.type === 'sections') {
        //         return true;
        //     }
        //     return ((this.page && this.page.sections_meta) || []).length;
        // }
    },
    mounted() {
        console.log("this.sections:   ", this.sections);
        // const sectionSchema = this.sections ? this.sections : undefined;
        // this.mSections = sectionSchema ? sectionSchema : [];
        // this.sectionSchemaMap = (this.available_sections || []).reduce(
        //     (a, s) => {
        //         a[s.name] = s;
        //         return a;
        //     },
        //     {}
        // );
    },
    watch: {
        // sections: {
        //     deep: true,
        //     handler() {
        //         const sectionSchema = this.sections ? this.sections : undefined;
        //         this.mSections = sectionSchema ? sectionSchema : [];
        //     }
        // },
        // available_sections: {
        //     deep: true,
        //     handler() {
        //         this.sectionSchemaMap = (this.available_sections || []).reduce(
        //             (a, s) => {
        //                 a[s.name] = s;
        //                 return a;
        //             },
        //             {}
        //         );
        //     },
        // },
        // page: {
        //     deep: true,
        //     handler(n, o) {
        //         if(isEqual(n,o)) return;
        //         const sectionSchema = this.sections
        //             ? this.sections
        //             : undefined;
        //         this.mSections = sectionSchema
        //             ? sectionSchema
        //             : [];
        //         this.sectionSchemaMap = (this.available_sections || []).reduce(
        //             (a, s) => {
        //                 a[s.name] = s;
        //                 return a;
        //             },
        //             {}
        //         );
        //         this.showAvailableSections = false;
        //         this.showSectionForm = false;
        //         this.selectedSectionSchema = {};
        //         this.selectedSection = {};
        //     },
        // },
    },
    methods: {
        // dragStart(index) {
        //     this.$emit('zoom-out');
        //     setTimeout(() => {
        //         this.postMessageToIframe(
        //             PREVIEW_EVENTS.DRAG_SECTION_START,
        //             {
        //                 index,
        //             }
        //         );
        //     }, 100);
        // },
        // updateSection(e) {
        //     this.$refs['section_settings']
        //         .get()
        //         .then((config) => {
        //             this.postMessageToIframe(
        //                 PREVIEW_EVENTS.UPDATE_SECTION,
        //                 {
        //                     section: config.section,
        //                     index: config.index,
        //                 }
        //             );
        //             this.$refs['section_settings_dialog'].close();
        //         })
        //         .catch((err) => {});
        // },
        // onMove(e) {
        //     //check if first move
        //     //track temperory position of the element being dragged
        //     //if first move then original index
        //     //else use index stored
        //     this.movingIndex =
        //         this.movingIndex === -1
        //             ? e.draggedContext.index
        //             : this.movingIndex;
        //     const data = {
        //         index: this.movingIndex,
        //         newIndex: e.draggedContext.futureIndex,
        //     };
        //     this.postMessageToIframe(
        //         PREVIEW_EVENTS.DRAGGING_SECTION,
        //         data
        //     );
        //     //assign temp moving index
        //     this.movingIndex = e.draggedContext.futureIndex;
        // },
        // $sectionSettingsBuilder(config, e) {
        //     e.stopPropagation();
        //     e.preventDefault();
        //     this.$refs['section_settings_dialog'].open({
        //         width: '650px',
        //         height: '450px',
        //         neutralButtonLabel: 'Ok',
        //         showCloseButton: true,
        //         // dismissible: false
        //     });
        //     this.$refs['section_settings'].init(cloneDeep(config));
        //     this.selectedSectionIndex = config.index;
        // },
        // onChange(d) {
        //     let { added, removed, moved } = d;
        // },
        // onEnd(e) {},
        // dragStop() {
        //     this.dragging = false;
        //     this.postMessageToIframe(PREVIEW_EVENTS.DRAG_SECTION_END, {
        //         index: this.movingIndex
        //     });
        //     this.movingIndex = -1;
        //     this.$emit('zoom-in');
        // },
        // onSectionClick(section, idx) {
        //     this.showSectionForm = true;
        //     this.selectedSectionSchema = this.available_sections.find(
        //         (s) => s.name == section.name
        //     );
        //     this.selectedSectionIndex = idx;
        //     this.selectedSection = section;
        //     this.postMessageToIframe(PREVIEW_EVENTS.SELECT_SECTION, {
        //         index: idx,
        //     });
        // },
        // onAddButtonClick(e) {
        //     this.showAvailableSections = true;
        // },
        // onSaveButtonClick(e) {
        //     let t = cloneDeep(this.mSections);
        //     t.forEach((s) => {
        //         s.blocks = s.blocks || [];
        //         delete s.isVisible;
        //         s.blocks.forEach((b) => {
        //             delete b.expand;
        //         });
        //     });
        //     this.$emit('save', {
        //         config: this.config,
        //         sections: t
        //     });
        // },
        // removeSection(index) {
        //     this.mSections.splice(index, 1)
        //     this.selectedSectionIndex = -1;
        //     this.postMessageToIframe(PREVIEW_EVENTS.REMOVE_SECTION, {
        //         removedIndex: index,
        //     });
        // },
        // copySection(section) {
        //     this.postMessageToIframe(PREVIEW_EVENTS.ADD_SECTION, section);
        //     this.mSections.push(section);
        //     const sectionIndex = this.mSections
        //         ? this.mSections.length - 1
        //         : -1;
        //     this.onSectionClick(section, sectionIndex);
        // },
        // addSectionToPreview(sectionSchema) {
        //     this.addedSection = {
        //         name: sectionSchema.name,
        //         props: (sectionSchema.props || []).reduce((a, p) => {
        //             //check if preset available
        //             a[p.id] = {
        //                 value:
        //                     sectionSchema.preset &&
        //                     sectionSchema.preset.props &&
        //                     sectionSchema.preset.props[p.id]
        //                         ? sectionSchema.preset.props[p.id]
        //                         : p.default,
        //                 type: p.type,
        //             };

        //             return a;
        //         }, {}),
        //         blocks: [],
        //         index: sectionSchema.index,
        //         preview: true,
        //         preset: sectionSchema.preset || {},
        //         predicate: defaultPredicate,
        //     };
        //     this.postMessageToIframe(
        //         PREVIEW_EVENTS.ADD_SECTION,
        //         this.addedSection
        //     );
        // },
        // addSection(sectionSchema) {
        //     this.showAvailableSections = false;
        //     this.mSections.push(this.addedSection);
        //     this.selectedSectionSchema = sectionSchema;
        //     this.selectedSection = this.addedSection;
        //     this.selectedSectionIndex = this.mSections.length - 1;
        //     //clear added section
        //     this.addedSection = {};

        //     this.showSectionForm = true;
        // },
        // removeSectionFromPreview() {
        //     if (this.addedSection.name) {
        //         this.postMessageToIframe(THEME_PREVIEW_EVENTS.REMOVE_SECTION, {
        //             removedIndex: this.mSections.length,
        //         });
        //     }
        // },
        // updateBlocks(section) {
        //     if (this.selectedSectionIndex !== -1) {
        //         this.mSections[this.selectedSectionIndex] = section;
        //         this.postMessageToIframe(PREVIEW_EVENTS.UPDATE_SECTION, {
        //             section: this.mSections[this.selectedSectionIndex],
        //             index: this.selectedSectionIndex,
        //         });
        //     }
        //     // this.$emit('post-message',this.mSections);
        // },
        // postMessageToIframe(eventType, data) {
        //     this.$emit('post-message', {
        //         event: eventType,
        //         data: data,
        //         updated: true
        //     });
        // },
        // scrollToBottom() {
        //     var container = this.$el.querySelector('.nitrozen-dialog-body');
        //     setTimeout(function () {
        //         container.scrollTop = container.scrollHeight;
        //     }, 0);
        // },
    }
}
</script>

<style lang="less" scoped>
.sections-container {
    height: 100vh;
    position: relative;
    .no-config {
        color: @Mako;
        font-size: 14px;
        p {
            margin: 10px 0px;
            text-align: center;
        }
    }
    .heading {
        color: #41434c;
        font-size: 20px;
        height: 50px;
        padding: 0 10px;
        box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
            0 1px 3px 0 rgba(63, 63, 68, 0.15);
        display: flex;
        font-weight: bold;
        align-items: center;
        justify-content: flex-start;
        background-color: #fff;
        p {
            width: 100%;
            text-align: center;
        }
    }
    .tabs {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        border-bottom: 1px #dadada solid;
        p {
            cursor: pointer;
            font-size: 14px;
            width: 49%;
            height: 100%;
            .flex-center();
            transition: box-shadow 0.2s;
            &:hover {
                box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.2);
            }
        }
    }
    .active-tab {
        box-shadow: inset 0 -4px 0 0 #4f5ecc !important;
    }
    .draggable-items {
        overflow: hidden;
        overflow-y: scroll;
        height: calc(100vh - 180px);
        position: relative;

        .page-settings-tab {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-between;
            .go-to-link {
                color: @RoyalBlue;
                cursor: pointer;
                font-weight: bold;
                margin: 0px 20px 5px 0px;
                text-align: end;
            }
        }
    }
    .sections {
        width: 100%;
        .hide_section {
            opacity: 0.4;
        }
        .section {
            align-items: center;
            justify-content: space-between;
            display: flex;
            padding: 0px 10px;
            height: 64px;
            box-sizing: border-box;
            background: #fff;
            border-bottom: 1px #dadada solid;
            &:first-of-type {
                border-top: 1px #dadada solid;
            }
            .handle {
                height: 24px;
                cursor: grab;
                margin-right: 10px;
            }
            .title-container {
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                min-width: 0;
                .title {
                    cursor: pointer;
                    height: 17px;
                    // text-overflow: ellipsis;
                    // overflow-x: hidden;
                    // overflow-y: visible;
                    // white-space: nowrap;
                }
                .active_title {
                    color: @RoyalBlue;
                }
            }
            .section-settings {
                margin: 0px 3px;
                cursor: pointer;
            }
            .copy_icon {
                ::v-deep svg {
                    height: 20px;
                    g {
                        fill: #8c8f9d;
                    }
                }
            }
        }
    }
    .add-section {
        display: flex;
        justify-content: center;
        color: #5c6ac4;
        height: 64px;
        align-items: center;
        border-bottom: 1px #dadada solid;
        cursor: pointer;
        .add-section-icon {
            margin-right: 10px;
        }
    }
    .settings-tab {
        p {
            text-align: center;
        }
    }
    .actions {
        display: flex;
        position: fixed;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 10px;
        margin-top: 10px;
        width: 300px;
        bottom: 0;
        box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
            0 -1px 3px 0 rgba(63, 63, 68, 0.15);
        background-color: white;
        align-items: center;
        height: 60px;
        z-index: 5;
        button {
            width: 100%;
        }
        /deep/ .nitrozen-menu-vertical-dropdown {
            top: inherit
        }
    }
}

.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

/* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable {
    // cursor: grabbing !important;
}
/deep/.nitrozen-menu-vertical-dropdown {
    top: -45px;
    right: -200px;
}
</style>
