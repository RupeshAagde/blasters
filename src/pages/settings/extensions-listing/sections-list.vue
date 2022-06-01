<template>
    <div class="sections-container">
        <!-- Section Settings Builder -->
        <nitrozen-dialog
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
                    class="update-preview-btn"
                    v-flatBtn
                    @click="updateSection"
                    >Update Preview
                </nitrozen-button>
            </template>
        </nitrozen-dialog>

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
        />

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
            @search-input="onSearchInputChange($event)"
        ></section-form>

        <div class="heading">
            <p>Sections</p>
        </div>

        <div class="tabs">
            <p
                v-for="(tab, index) in tabs"
                :key="index"
                @click="activeTab = tab"
                :class="{'active-tab': activeTab === tab}">
                {{ tab }}
            </p>
        </div>

        <div class="draggable-items nitrozen-scrollbar">
            <div class="sections-tab" v-if="activeTab === 'Sections'">
                <!-- <div v-if="pageSectionsMeta"> -->
                <div>
                    <!-- draggable will come here --> 
                    <draggable
                        :list="mSections"
                        :move="onMove"
                        v-bind="dragOptions"
                        class="sections"
                        @change="onChange"
                        handle=".handle"
                        @start="
                            dragging = true;
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
                                <div @mouseup="dragStop" @mousedown="dragStart(i)">
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
                                    }"
                                >
                                    <span
                                        @click.stop="onSectionClick(section, i)"
                                        class="title"
                                        :class="{
                                            active_title:
                                                selectedSectionIndex === i,
                                        }"
                                        v-if="sectionSchemaMap[section.type]"
                                    >
                                        {{
                                            sectionSchemaMap[section.type].name
                                        }}
                                    </span>
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
                                    class="section-settings visibility"
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
                                    class="section-settings copy"
                                >
                                    <adm-inline-svg
                                        class="copy_icon"
                                        :src="'copy'"
                                    />
                                </span>

                                <span
                                    @click="removeSection(i)"
                                    class="section-settings remove"
                                >
                                    <adm-inline-svg :src="'cross-black'" />
                                </span>
                            </div>
                        </transition-group>
                    </draggable>   

                    <div 
                        class="add-section"
                        @click="onAddButtonClick($event)"
                        v-if="available_sections.length > 0">
                        <adm-inline-svg
                            class="add-section-icon"
                            :src="'add-icon'"
                        />
                        <span>Add Section</span>
                    </div>
                </div>

                <!-- <div
                    class="no-config"
                    v-if="!available_sections.length || !pageSectionsMeta"
                > -->
                <div
                    class="no-config"
                    v-if="!available_sections.length"
                >
                    <p>No Sections Available</p>
                </div>
            </div>

            <div class="settings-tab" v-if="activeTab === 'Settings'">
                <p class="coming-soon">Coming soon</p>
            </div>            
        </div>

        <div class="actions">
            <nitrozen-button
                :theme="'secondary'"
                class="save-button"
                v-flatBtn
                @click="onSaveButtonClick($event)"
                :showProgress="inProgress"
                :disabled="inProgress">
                Save {{ preview ? 'Preview' :  '' }}
            </nitrozen-button>

            <nitrozen-menu class="menu" mode="vertical" position="top">
                <nitrozen-menu-item @click="$emit('reset')">
                    Reset
                </nitrozen-menu-item>
            </nitrozen-menu>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    strokeBtn, flatBtn, NitrozenButton,
    NitrozenMenu, NitrozenMenuItem, 
    NitrozenDialog
} from '@gofynd/nitrozen-vue';
import { cloneDeep } from 'lodash';
import draggable from 'vuedraggable';

/* Component imports */
import AdmInlineSVG from '@/components/common/adm-inline-svg.vue';
import AvailableSectionsList from './available-sections-list.vue';
import SectionForm from './section-form.vue';
import SectionPredicate from './section-predicate.vue';

/* Constants and Helpers */
import { PREVIEW_EVENTS } from '@/helper/constants.js';

const defaultPredicate = {
    screen: {
        mobile: true,
        desktop: true,
        tablet: true,
    }
};

export default {
    name: 'sections-list',
    props: [
        'sections',
        'available_sections',
        'page',
        'config',
        'pages',
        'previewUrl',
        'pageObject',
        'inProgress'
    ],
    components: {
        'adm-inline-svg': AdmInlineSVG,
        NitrozenButton,
        NitrozenMenu, 
        NitrozenMenuItem,
        NitrozenDialog,
        'available-sections-list': AvailableSectionsList,
        'section-form': SectionForm,
        'section-predicate': SectionPredicate,
        draggable
    },
    directives: {
        strokeBtn,
        flatBtn,
    },
    data() {
        return {
            tabs: ['Sections', 'Settings'],
            activeTab: 'Sections',
            preview: this.$route.query.preview,
            showAvailableSections: false,
            addedSection: {},
            selectedSectionIndex: -1,
            mSections: [],
            selectedSectionSchema: {},
            selectedSection: {},
            showSectionForm: false,
            movingIndex: -1,
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost',
            },
            dragging: false,
            sectionSchemaMap: {}
        }
    },
    computed: {
        pageSectionsMeta() {
            if(this.page && this.page.sections_meta) {
                return this.page.sections_meta.length;
            } else {
                return [].length;
            }
        }
    },
    mounted() {
        const sectionSchema = this.sections ? this.sections : undefined;
        this.mSections = sectionSchema ? sectionSchema : [];
        this.sectionSchemaMap = (this.available_sections || []).reduce(
            (a, s) => {
                a[s.type] = s;
                return a;
            },
            {}
        );
    },
    watch: {
        sections: {
            deep: true,
            handler() {
                const sectionSchema = this.sections ? this.sections : undefined;
                this.mSections = sectionSchema ? sectionSchema : [];

                for(let section of this.mSections) {
                    if(section.item_type) {
                        if(!section.data[section.item_type]) {
                            section.data[section.item_type] = section.items;
                        }
                    }
                }
            }
        },
        available_sections: {
            deep: true,
            handler() {
                this.sectionSchemaMap = (this.available_sections || []).reduce(
                    (a, s) => {
                        a[s.type] = s;
                        return a;
                    },
                    {}
                );
            },
        },
    },
    methods: {
        onSaveButtonClick(e) {
            let t = cloneDeep(this.mSections);
            t.forEach((s) => {
                s.blocks = s.blocks || [];
                delete s.isVisible;

                // s.blocks.forEach((b) => {
                    //     delete b.expand;
                // });
                delete s.blocks;
                delete s.index;
                delete s.props;
                delete s.name;
            });

            this.showSectionForm = false;

            this.$emit('save', {
                config: this.config,
                sections: t
            });
        },
        onAddButtonClick() {
            this.showAvailableSections = true;
        },
        addSectionToPreview(sectionSchema) {
            this.addedSection = {
                name: sectionSchema.name,
                props: (sectionSchema.props || []).reduce((a, p) => {
                    //check if preset available
                    a[p.id] = {
                        value:
                            sectionSchema.preset &&
                            sectionSchema.preset.props &&
                            sectionSchema.preset.props[p.id]
                                ? sectionSchema.preset.props[p.id]
                                : p.default,
                        type: p.type,
                    };

                    return a;
                }, {}),
                index: sectionSchema.index,
                preview: true,
                predicate: defaultPredicate,
                tags: sectionSchema.tags,
                page_type: sectionSchema.page_type,
                type: sectionSchema.type,
                visible: true,
                data: (sectionSchema.props || []).reduce((a, p) => {
                    a[p.id] = sectionSchema.preset &&
                            sectionSchema.preset.props &&
                            sectionSchema.preset.props[p.id]
                                ? sectionSchema.preset.props[p.id]
                                : p.default;
                    return a;
                }, {})
            };

            this.postMessageToIframe(
                PREVIEW_EVENTS.ADD_SECTION,
                this.addedSection
            )
        },
        addSection(sectionSchema) {
            this.showAvailableSections = false;
            this.mSections.push(this.addedSection);
            this.selectedSectionSchema = sectionSchema;
            this.selectedSection = this.addedSection;
            this.selectedSectionIndex = this.mSections.length - 1;
            //clear added section
            this.addedSection = {};

            this.showSectionForm = true;
        },
        removeSectionFromPreview() {
            if (this.addedSection.name) {
                this.postMessageToIframe(
                    PREVIEW_EVENTS.REMOVE_SECTION, 
                    {
                        removedIndex: this.mSections.length,
                    }
                );
            }
        },
        postMessageToIframe(eventType, data) {
            this.$emit('post-message', {
                event: eventType,
                data: data,
                updated: true
            })
        },
        updateBlocks(section) {
            if(this.selectedSectionIndex !== -1) {
                this.mSections[this.selectedSectionIndex] = section;
                this.postMessageToIframe(
                    PREVIEW_EVENTS.UPDATE_SECTION,
                    {
                        section: this.mSections[this.selectedSectionIndex],
                        index: this.selectedSectionIndex
                    }
                );
            }
            // this.$emit('post-message',this.mSections);
        },
        scrollToBottom() {
            var container = this.$el.querySelector('.nitrozen-dialog-body');
            setTimeout(function () {
                container.scrollTop = container.scrollHeight;
            }, 0);
        },
        updateSection(e) {
            this.$refs['section_settings']
                .get()
                .then((config) => {
                    this.postMessageToIframe(
                        PREVIEW_EVENTS.UPDATE_SECTION,
                        {
                            section: config.section,
                            index: config.index,
                        }
                    );
                    this.sections[config.index].predicate = cloneDeep(config.options);
                    this.$refs['section_settings_dialog'].close();
                })
                .catch((err) => {
                    console.log("err:   ", err);
                });
        },
        onMove(e) {
            //check if first move
            //track temperory position of the element being dragged
            //if first move then original index
            //else use index stored
            this.movingIndex =
                this.movingIndex === -1
                    ? e.draggedContext.index
                    : this.movingIndex;
            const data = {
                index: this.movingIndex,
                newIndex: e.draggedContext.futureIndex,
            };
            this.postMessageToIframe(
                PREVIEW_EVENTS.DRAGGING_SECTION,
                data
            );
            //assign temp moving index
            this.movingIndex = e.draggedContext.futureIndex;
        },
        onChange(d) {
            let { added, removed, moved } = d;
        },
        dragStop() {
            this.dragging = false;
            this.postMessageToIframe(
                PREVIEW_EVENTS.DRAG_SECTION_END, 
                {
                    index: this.movingIndex,
                }
            );
            this.movingIndex = -1;
            this.$emit('zoom-in');
        },
        dragStart(index) {
            this.$emit('zoom-out');
            setTimeout(() => {
                this.postMessageToIframe(
                    PREVIEW_EVENTS.DRAG_SECTION_START,
                    {
                        index,
                    }
                );
            }, 100);
        },
        onSectionClick(section, idx) {
            this.showSectionForm = true;
            this.selectedSectionSchema = this.available_sections.find(
                (s) => s.type == section.type
            );
            this.selectedSectionIndex = idx;
            this.selectedSection = section;
            this.selectedSection['props'] = {};
            for(let key in section.data) {
                let type = this.selectedSectionSchema.props.find(item => item.id === key);
                this.selectedSection.props[key] = {
                    type: type.type,
                    value: section.data[key]
                };
            }
            this.postMessageToIframe(
                PREVIEW_EVENTS.SELECT_SECTION, 
                {
                    index: idx,
                }
            );
        },
        $sectionSettingsBuilder(config, e) {
            e.stopPropagation();
            e.preventDefault();
            this.$refs['section_settings_dialog'].open({
                width: '650px',
                height: '450px',
                neutralButtonLabel: 'Ok',
                showCloseButton: true,
                // dismissible: false
            });
            this.$refs['section_settings'].init(cloneDeep(config));
            this.selectedSectionIndex = config.index;
        },
        copySection(section) {
            this.postMessageToIframe(PREVIEW_EVENTS.ADD_SECTION, section);
            this.mSections.push(section);
            const sectionIndex = this.mSections
                ? this.mSections.length - 1
                : -1;
            this.onSectionClick(section, sectionIndex);
        },
        removeSection(index) {
            this.mSections.splice(index, 1)
            this.selectedSectionIndex = -1;
            this.postMessageToIframe(
                PREVIEW_EVENTS.REMOVE_SECTION, 
                {
                    removedIndex: index,
                }
            );
        },
        onSearchInputChange(event) {
            let obj = {
                ...event,
                sectionIdx: this.selectedSectionIndex
            }
            this.$emit('search-input', obj);
        }
    }
}
</script>

<style lang="less" scoped>
.sections-container {
    height: 100vh;
    position: relative;

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

    .coming-soon {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>