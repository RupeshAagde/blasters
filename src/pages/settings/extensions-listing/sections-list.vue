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
                    v-flatBtn
                    @click="updateSection"
                    >Update Preview
                </nitrozen-button>
            </template>
        </nitrozen-dialog>



        <div class="heading">
            <p>Sections</p>
        </div>

        <div class="tabs">
            <p 
                v-for="(tab,index) in tabs"
                :key="index"
                @click="activeTab = tab"
                :class="{ 'active-tab': activeTab === tab }">
                {{ tab }}
            </p>
        </div>

        <div class="draggable-items nitrozen-scrollbar">
            <div class="sections-tab" v-if="activeTab === 'Sections'">
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
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenDialog
} from '@gofynd/nitrozen-vue';
import draggable from 'vuedraggable';

/* Constants and Helpers */
import { PREVIEW_EVENTS } from '@/helper/constants.js';

/* Component imports */
import AdmInlineSVG from '@/components/common/adm-inline-svg.vue';
import SectionPredicate from './section-predicate.vue';

export default {
    name: 'sections-list',
    components: {
        draggable,
        NitrozenDialog,
        'adm-inline-svg': AdmInlineSVG,
        SectionPredicate
    },
    props: [
        'sections',
        'available_sections',
        'page',
        'config',
        'pages',
        'currentfont',
        'previewUrl',
        'pageObject',
        'inProgress'
    ],
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
            tabs: ['Sections', 'Page', 'Settings'],
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
        pageSectionsMeta() {
            if(this.page?.type === 'sections') {
                return true;
            }
            return (this.page?.sections_meta || []).length;
        }
    },
    methods: {
        onChange(d) {
            let { added, removed, moved } = d;
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
        dragStop() {
            this.dragging = false;
            this.postMessageToIframe(PREVIEW_EVENTS.DRAG_SECTION_END, {
                index: this.movingIndex
            });
            this.movingIndex = -1;
            this.$emit('zoom-in');
        },
        postMessageToIframe(eventType, data) {
            this.$emit('post-message', {
                event: eventType,
                data: data,
                updated: true
            });
        },
        onSectionClick(section, idx) {
            this.showSectionForm = true;
            this.selectedSectionSchema = this.available_sections.find(
                (s) => s.name == section.name
            );
            this.selectedSectionIndex = idx;
            this.selectedSection = section;
            this.postMessageToIframe(PREVIEW_EVENTS.SELECT_SECTION, {
                index: idx,
            });
        },
        onAddButtonClick(e) {
            this.showAvailableSections = true;
        },
        removeSection(index) {
            this.mSections.splice(index, 1)
            this.selectedSectionIndex = -1;
            this.postMessageToIframe(PREVIEW_EVENTS.REMOVE_SECTION, {
                removedIndex: index,
            });
        },
        copySection(section) {
            this.postMessageToIframe(PREVIEW_EVENTS.ADD_SECTION, section);
            this.mSections.push(section);
            const sectionIndex = this.mSections
                ? this.mSections.length - 1
                : -1;
            this.onSectionClick(section, sectionIndex);
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
                    this.$refs['section_settings_dialog'].close();
                })
                .catch((err) => {});
        },
    }
}
</script>

<style lang="less" scoped>

</style>
