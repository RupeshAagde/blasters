<template>
    <div class="sections-container">
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


                            </div>
                        </transition-group>
                    </draggable>
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

export default {
    name: 'sections-list',
    components: {
        draggable,
        NitrozenDialog,
        'adm-inline-svg': AdmInlineSVG
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
    }
}
</script>

<style lang="less" scoped>

</style>
