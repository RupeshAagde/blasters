<template>
    <div class="sections-container">
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
                Coming soon
            </div>            
        </div>

        <div class="actions">
            <nitrozen-button
                :theme="'secondary'"
                v-flatBtn
                @click="onSaveButtonClick($event)"
                :showProgress="inProgress"
                :disabled="inProgress">
                Save {{ preview ? 'Preview' :  '' }}
            </nitrozen-button>

            <nitrozen-menu class="menu" mode="vertical" position="top">
                <nitrozen-menu-item>
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
    NitrozenMenu, NitrozenMenuItem
} from '@gofynd/nitrozen-vue';
import { cloneDeep } from 'lodash';

/* Component imports */
import AdmInlineSVG from '@/components/common/adm-inline-svg.vue';
import AvailableSectionsList from './available-sections-list.vue';
import SectionForm from './section-form.vue';

/* Constants and Helpers */
import { PREVIEW_EVENTS } from '@/helper/constants.js';

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
        'available-sections-list': AvailableSectionsList,
        'section-form': SectionForm
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
            showSectionForm: false
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
                a[s.name] = s;
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
            }
        },
        available_sections: {
            deep: true,
            handler() {
                this.sectionSchemaMap = (this.available_sections || []).reduce(
                    (a, s) => {
                        a[s.name] = s;
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
                s.blocks.forEach((b) => {
                    delete b.expand;
                });
            });
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
                blocks: [],
                index: sectionSchema.index,
                preview: true,
                preset: sectionSchema.preset || {},
                predicate: defaultPredicate,
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
}
</style>