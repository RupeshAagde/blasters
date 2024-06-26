<template>
    <div class="container">
        <div class="sidebar" :class="{ 'hide-sidebar': !showSidebar }">
            <loader v-if="loading || !selectedPage" class="loading"></loader>
            <sections-list
                ref="section_list"
                :available_sections="available_sections"
                :sections="sections"
                :page="selectedPage"
                :pages="pages"
                :previewUrl="previewUrl"
                :pageObject="getCurrentPage"
                @save="onSave(selectedPage, $event)"
                @post-message="onPostMessage($event)"
                @zoom-out="zoomOut = true"
                @zoom-in="
                    zoomOut = false;
                    hideRect();
                "
                @search-input="onSearchInputChange($event)"
                :inProgress="loading"
            />
        </div>

        <div class="main" :class="{'full-width': !showSidebar || upgrade}">
            <div class="viewport-header">
                <div class="drop-down">
                    <nitrozen-dropdown
                        :items="getGroupByPages"
                        @change="onPageChange($event)"
                        :value="selectedPage ? selectedPage.slug : ''"
                    >
                        <template slot="option" slot-scope="slotProps">
                            <div
                                class="page-item"
                                v-if="slotProps.item.value !== '__add_page'">
                                <div
                                    class="option-text"
                                    :value="slotProps.item.slug">
                                    {{ slotProps.item.text }}
                                </div>
                            </div>
                        </template>
                    </nitrozen-dropdown> 
                </div>
                <div class="viewport-icons" :class="{ 'hide-icons': upgrade }">
                    <div
                        @click="updateViewport(viewport.value)"
                        class="viewport-icon"
                        :class="{
                            ' active-icon': selectedViewport === viewport.value,
                        }"
                        v-for="(viewport, index) in viewports"
                        :key="index"
                    >
                        <img :src="viewport.image_url" alt="desktop" />
                    </div>
                </div>
                 <div @click="closeEditor()" class="close-icon">
                    <adm-inline-svg :src="'cross-black'" />
                </div>
            </div>
            <div
                ref="iframe_wrapper"
                class="iframe-wrapper"
                :class="{
                    'iframe-wrapper__mobile': selectedViewport === 'mobile',
                    'iframe-wrapper__tablet': selectedViewport === 'tablet',
                    'iframe-wrapper__desktop': selectedViewport === 'desktop',
                    'preview-zoom-out': zoomOut,
                }"
            >
                <div v-if="isIframeLoaded" class="iframe-loader-wrapper"><loader class="iframe-loader"></loader></div>
                <iframe
                    class="preview"
                    ref="iframe"
                    v-if="iframeUrl"
                    :src="iframeUrl"
                    @load="onIframeLoaded"
                />
                <div class="preview-outline" ref="preview-outline"></div>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenDropdown, NitrozenDialog, NitrozenButton,
    NitrozenInput, flatBtn, strokeBtn
} from '@gofynd/nitrozen-vue';
import { cloneDeep } from 'lodash';
import root from 'window-or-global';

/* Component imports */
import Loader from '@/components/common/loader.vue';
import AdmInlineSvg from '@/components/common/adm-inline-svg.vue';
import SectionsList from './sections-list.vue';

/* Helper imports */
import { convertKebabCaseToString } from '../../../helper/utils';

/* Service imports */
import ExtensionPageService from '@/services/extension-page.service.js';
import ExtensionService from '@/services/extension.service.js';

const devicesViewport = {
    desktop: { maxWidth: 1024 },
    tablet: { maxWidth: 1023 },
    mobile: { maxWidth: 480 },
};

const PAGE_GROUP_INFO = [
    {
        text: 'EXTENSION PAGES',
        type: 'extension'
    }
];

const env = root.env || {};

export default {
    name: 'listing-container',
    components: {
        NitrozenButton,
        NitrozenDialog,
        NitrozenDropdown,
        NitrozenInput,
        Loader,
        'adm-inline-svg': AdmInlineSvg,
        SectionsList
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            config: {},
            loading: false,
            zoomOut: false,
            dragging: false,
            pageToDelete: null,
            pageToEdit: null,
            iframeUrl: '',
            selectedPage: null,
            selectedViewport: 'desktop',
            showSidebar: true,
            available_sections: [],
            available_pages: [],
            sections: [],
            pages: [],
            viewports: [
                {
                    value: 'desktop',
                    image_url: '/public/assets/admin/pngs/monitor.png',
                },
                {
                    value: 'tablet',
                    image_url: '/public/assets/admin/pngs/tablet.png',
                },
                {
                    value: 'mobile',
                    image_url: '/public/assets/admin/pngs/phone.png',
                },
                {
                    value: 'expand',
                    image_url: '/public/assets/admin/pngs/expand.png',
                },
            ],
            upgrade: this.$route.query.upgrade,
            isIframeLoaded: false,
            publicExtensions: [],
            category: [],
            collection: []
        }
    },
    mounted() {
        let basicRequests = [
            this.getPublicExtensions(),
            this.getCollections(),
            this.getCategories(),
        ];

        Promise.all(basicRequests)
        .then(() => {
            this.getAvailablePages();
            this.getAvailableSections();
        })
        .catch(error => {
            this.$snackbar.global.showError('Error in fetching data');
        })
    },
    computed: {
        getCurrentPage() {
            return this.selectedPage;
        },
        getGroupByPages() {
            let arrPages = [];
            for (let i = 0; i < PAGE_GROUP_INFO.length; i++) {
                let arrTypePages = this.pages.filter((it) => {
                    return it.type === PAGE_GROUP_INFO[i].type;
                });
                arrTypePages = arrTypePages.map(item => {
                    if(!item.value) {
                        item.value = item.slug;
                    }
                    if(!item.text) {
                        item.text = convertKebabCaseToString(item.slug);
                    }
                    return item;
                })
                if (arrTypePages.length) {
                    arrPages = arrPages.concat(arrTypePages);
                }
            }
            return arrPages;
        },
        previewUrl() {
            return `${env.BRAINSTORM_EXTENSION_DOMAIN}`;
        },
    },
    methods: {
        getPublicExtensions(params = {}) {
            let finalParamsObj = {
                ...params,
                published: true
            };

            return ExtensionPageService.getPublicExtensions(finalParamsObj)
            .then(response => {
                let extensions = cloneDeep(response.data.items);
                this.publicExtensions = extensions.map(item => {
                    item.text = item.name;
                    item.value = item._id;
                    item.label = 'Extensions';
                    item.logo = item.logo.small;
                    return item;
                });
                return extensions;
            })
            .catch(error => {
                console.log("Error in fetching public extensions:   ", error);
            })
        },
        getCollections(params = {}) {
            // Collections will be received here
            return ExtensionPageService.getCollections({...params, category: 'extension', items: 'true'})
            .then(response => {
                let collections = cloneDeep(response.data.items);
                this.collection = collections.map(item => {
                    item.text = item.name;
                    item.value = item._id;
                    return item;
                })
                return collections;
            })
            .catch(error => {
                console.log("error:   ", error);
            })
        },
        getCategories() {
            // Categories will be received here
            return ExtensionPageService.getCategories()
            .then(response => {
                let categories = cloneDeep(response.data.filters[1].values);
                this.category = categories.map(item => {
                    item.text = item.display;
                    item.value = item._id;
                    return item;
                })
                return categories;
            })
            .catch(error => {
                console.log("error:   ", error);
            })
        },
        getAvailableSections() {
            ExtensionPageService.getAvailableSections()
            .then(response => {
                let sections = cloneDeep(response.data.items);
                for(let section of sections) {
                    let isImagePosition = section.props.find(t => t.id === 'image_position');
                    if(isImagePosition) {
                        isImagePosition.default = 'right';
                    }

                    if(section.item_type === 'extension') {
                        section.props.push(
                            {
                                default: [],
                                id: "extension",
                                label: "Extensions",
                                options: this.publicExtensions,
                                type: "select",
                                multiple: true,
                                search: true,
                                predicate_prop: {
                                    item_source: ['collection' ,'manual']
                                },
                                placeholder: 'Search Extensions',
                                value: []
                            }
                        )
                        let collectionSourceProp = section.props.find(p => p.id === 'collection_source');
                        if (collectionSourceProp) {
                            collectionSourceProp.options = this.collection;
                            collectionSourceProp.placeholder = 'Search Collections';
                            collectionSourceProp.search = true;
                        }

                        let extensionProp = section.props.find(p => p.id === 'extension');
                        if (extensionProp) {
                            extensionProp.options = [];
                        }

                    } else if(section.item_type === 'category') {
                        section.props.push(
                            {
                                default: [],
                                id: "category",
                                label: "Categories",
                                options: this.category,
                                type: "select",
                                multiple: true,
                                placeholder: 'Search Categories'
                            }
                        )
                    } else if(section.item_type === 'collection') {
                        section.props.push(
                            {
                                default: [],
                                id: "collection",
                                label: "Collections",
                                options: this.collection,
                                type: "select",
                                multiple: true,
                                search: true,
                                placeholder: 'Search Collections'
                            }
                        )
                    }
                }

                this.available_sections = cloneDeep(sections);
            })
            .catch(err => {
                console.log(err);
            })

            // setTimeout(() => {
            //     this.available_sections = cloneDeep(available_sections);
            // }, 1000);
        },
        setRectSize(rect) {
            if (this.$refs['preview-outline'] && this.zoomOut) {
                this.$refs['preview-outline'].style.height = rect.height + 'px';
                this.$refs['preview-outline'].style.width = rect.width + 'px';
                this.$refs['preview-outline'].style.display = 'block';
                const iframe = this.$refs.iframe;
                if (iframe) {
                    const topMargin = getComputedStyle(
                        iframe
                    ).marginTop.replace('px', '');
                    const leftMargin = getComputedStyle(
                        iframe
                    ).marginLeft.replace('px', '');
                    this.$refs['preview-outline'].style.top =
                        rect.top + Number(topMargin) + 'px';
                    this.$refs['preview-outline'].style.left =
                        rect.left + Number(leftMargin) + 10 + 'px';
                }
            }
        },
        onPageChange(page) {
            if(this.selectedPageIndex !== -1) {
                this.pages[this.selectedPageIndex].sections = this.sections;
            }
            page = page.value
                ? page.value
                : this.pages.find((it) => {
                      return it.value === page;
                  });
        },
        getSectionsForPage(pageType) {
            this.loading = true
            let pageIndex = this.pages.findIndex((it) => {
                return it.type == pageType;
            });

            if(this.pages[pageIndex].sections) {
                this.sections = this.pages[pageIndex].sections;

                for(let section of this.sections) {
                    let data = section.data;
                    for(let key in data) {
                        if(typeof data[key] === 'string') {
                            data[key] = data[key].trim();
                        }
                    }

                    if(section.item_type) {
                        if(section.item_type === 'category') {
                            if(section.items.length) {
                                let selectedItems = cloneDeep(section.items).map(i => i.value);
                                let itemDetails = cloneDeep(this.category).filter(i => selectedItems.includes(i._id));
                                section.data[section.item_type] = cloneDeep(selectedItems);
                                section.data[`${section.item_type}_details`] = itemDetails;
                            }
                        } else if(section.item_type === 'collection') {
                            if(section.items.length) {
                                let selectedItems = cloneDeep(section.items).map(i => i.value);
                                section.data[section.item_type] = cloneDeep(selectedItems);
                                ExtensionService.getExtensionCollectionDetails('', {_id: selectedItems, category: 'extension', items: 'true'})
                                .then(response => {
                                    let orderedItems = [];
                                    for(let item of selectedItems) {
                                        orderedItems.push(response.data.items.find(i => i._id === item));
                                    }

                                    section.data[`${section.item_type}_details`] = cloneDeep(orderedItems);
                                })
                                .catch(error => {
                                    this.$snackbar.global.showError(
                                        `Unable to fetch collection details.`
                                    );
                                    console.log("error:   ", error);
                                })
                            }
                        } else if(section.item_type === 'extension') {
                            if(section.items.length) {
                                let selectedItems = cloneDeep(section.items).map(i => i.value);
                                section.data[section.item_type] = cloneDeep(selectedItems);
                                this.getPublicExtensions({_id: selectedItems})
                                .then(extension => {
                                    let orderedItems = [];
                                    for(let item of selectedItems) {
                                        orderedItems.push(extension.find(i => i._id === item));
                                    }

                                    section.data[`${section.item_type}_details`] = cloneDeep(orderedItems);
                                })
                                .catch(error => {
                                    this.$snackbar.global.showError(
                                        `Unable to fetch extension details.`
                                    );
                                    console.log("error:   ", error);
                                })
                            }
                        }

                    }
                }

                setTimeout(() => {
                    this.onPostMessage({
                        config: this.config,
                        sections: this.sections
                    })
                }, 50)
                this.loading = false;
            }
        },
        getAvailablePages() {
            this.iframeUrl = '';

            ExtensionPageService.getSections()
            .then(({data}) => {
                this.pages = [cloneDeep(data)];
                let pageVal = 'extension';
                if(this.selectedPage && this.selectedPage.type) {
                    pageVal = this.selectedPage.type;
                };
                let pageConfigIdx = this.pages.findIndex((it) => {
                    return it.type === pageVal;
                });
                this.selectedPageIndex = pageConfigIdx;
                this.selectedPage = this.selectedPage
                    ? cloneDeep(this.selectedPage)
                    : cloneDeep(this.pages[this.selectedPageIndex])
                    ? cloneDeep(this.pages[this.selectedPageIndex])
                    : '';
                if(this.selectedPage.type) {
                    this.getSectionsForPage(this.selectedPage.type);
                    this.iframeUrl = this.previewUrl;
                }
            })
            .catch(err => {
                console.log(err);
                this.$snackbar.global.showError(
                    "Failed to load data"
                );
                this.loading = false;
            });
        },
        onSave(page, e) {
            this.loading = true;
            if(this.selectedPageIndex !== -1) {
                this.pages[this.selectedPageIndex].sections = e.sections;
            }
            delete e.sections;
            let pagesToUpdate = [];
            pagesToUpdate = this.pages.filter(ele => ele.updated);
            pagesToUpdate = pagesToUpdate.map(p => {
                delete p.updated;
                return p;
            });

            let pageObj = cloneDeep(this.pages[0]);
            delete pageObj.created_at;
            delete pageObj.updated_at;

            for(let section of pageObj.sections) {
                if(section.item_type) {
                    let key = section.item_type;
                    
                    delete section.items;

                    section.items = section.data[key].map(item => {
                        return {value: item};
                    });

                    delete section.data[`${key}_details`];
                    delete section.data[`collection_source_details`];
                    delete section.data[key];
                }
            }

            return ExtensionPageService.updateSections(pageObj)
            .then(response => {
                this.$snackbar.global.showSuccess('Your configuration is saved successfully.');
                this.getAvailablePages();
            })
            .catch(error => {
                console.log("error:   ", error);
                this.$snackbar.global.showError('Failed to save configuration');
            })
            .finally(() => {this.loading = false;});
        },
        updateViewport(viewport) {
            this.isIframeLoaded = true;

            if (viewport === 'expand') {
                this.showSidebar = false;
            } else {
                this.showSidebar = true;
            }
            this.selectedViewport = viewport;
            if(this.selectedPageIndex !== -1) {
                this.pages[this.selectedPageIndex].sections = this.sections;
            }

            this.$refs['iframe'].src = this.postMessageUrl || this.previewUrl;
            this.setIframeViewport();
        },
        closeEditor() {
            this.$router.push({
                path: `/administrator/settings/partners`,
            });
        },
        onPostMessage(e) {
            if(e && e.updated) {
                this.pages[this.selectedPageIndex].updated = true;
                delete e.updated
            }
            e.partner_event = true;
            e.page_content = cloneDeep(this.pages[this.selectedPageIndex]);
            for(let key in e.page_content) {
                if(typeof e.page_content[key] === 'string') {
                    e.page_content[key] = e.page_content[key].trim();
                }
            }

            for(let section of e.page_content.sections) {
                if(section.item_type) {
                    let key;
                    if(section.type === 'collection_grid') key = 'collection_details';
                    else if(section.type === 'extension_grid' || section.type === 'extension_item_list') key = 'extension_details';
                    else if(section.type === 'category_item_list') key = 'category_details';
                    delete section.items;

                    if(section.item_type === 'extension' && section.data[key]) {
                        let extensionPublicData = cloneDeep(section.data[key]).map(i => {
                            return i.extension_public_data || i;
                        });
                        section.items = cloneDeep(extensionPublicData)
                        delete section.data[key];
                    } else {
                        section.items = cloneDeep(section.data[key]);
                        delete section.data[key];
                    }
                    delete section.data[section.item_type];
                }
            }
            
            if (this.$refs.iframe && this.$refs.iframe.contentWindow) {
                this.$refs.iframe.contentWindow.postMessage(e, this.previewUrl);
            }
        },
        hideRect() {
            this.$refs['preview-outline'].style.display = 'none';
        },
        setIframeViewport() {
            if (
                this.selectedViewport !== 'expand' &&
                this.$refs.iframe_wrapper
            ) {
                const currentWidth = this.$refs.iframe_wrapper.clientWidth;
                if (
                    currentWidth <
                    devicesViewport[this.selectedViewport].maxWidth
                ) {
                    this.$refs.iframe_wrapper.style.overflow = 'auto hidden';
                }
            }
        },
        onIframeLoaded() {
            this.isIframeLoaded = false;
        },
        onSearchInputChange(event) {
            if(event.type === 'collection') {
                this.getCollections({name: event.value.text})
                .then(() => {
                    let section = this.available_sections.find(sec => sec.type === event.section_type);
                    let extensionProp = section.props.find(pr => pr.type === 'select' && pr.id === event.type);
                    extensionProp.options = this.collection;
                })
                .catch(error => {
                    console.log(error);
                });
            } else if(event.type === 'collection_source') {
                this.getCollections({name: event.value.text})
                .then(() => {
                    const sections = this.available_sections.filter(sec => {
                        return sec.item_type === event.type && sec.type === event.section_type;
                    });
                    sections.forEach( section => {
                        let collectionProp = section.props.find(pr => pr.type === 'select' && pr.id === event.type);
                        collectionProp.options = this.collection;
                    });
                })
                .catch(error => {
                    console.log(error);
                })
            } else if(event.type === 'extension') {
                this.getPublicExtensions({name: event.value.text})
                .then(() => {
                    let section = this.available_sections.find(sec => {
                        return sec.item_type === event.type && sec.type === event.section_type;
                    });
                    let extensionProp = section.props.find(pr => pr.type === 'select' && pr.id === event.type);
                    extensionProp.options = this.publicExtensions;
                })
                .catch(error => {
                    console.log(error);
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
.remove-page-btn {
    margin: 0px 15px;
}
::v-deep .nitrozen-options {
    min-width: 180px;
}
.container {
    flex: 1;
    display: flex;
    overflow: hidden;
    .page-builder-dialog {
        /deep/ .nitrozen-dialog-body {
            overflow: unset;
        }
    }
    .sidebar {
        width: 300px;
        border-right: 1px solid #dfe3e8;
        position: relative;
        overflow-y: hidden;
        transition: all 1s;
        /deep/.loading {
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            height: 100%;
            width: 100%;
        }
    }

    .main {
        width: calc(100% - 300px);
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.5s;
        position: relative;
        .viewport-header {
            height: 50px;
            width: 100%;
            background-color: #fff;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            box-sizing: border-box;
            padding: 0 10px;
            box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
                0 1px 3px 0 rgba(63, 63, 68, 0.15);
            .hide-icons {
                visibility: hidden;
            }
            .viewport-icons {
                width: 100%;
                height: 100%;
                // margin-left: -100px;
                .flex-center();
                .viewport-icon {
                    height: 100%;
                    cursor: pointer;
                    .flex-center();
                    &:not(:last-child) {
                        margin-right: 25px;
                    }
                    img {
                        height: 20px;
                    }
                    transition: all 0.4s;
                }
                .active-icon {
                    box-shadow: inset 0 -4px 0 0 #4f5ecc;
                }
            }
            .close-icon {
                cursor: pointer;
            }
            .drop-down {
                /deep/ .nitrozen-select {
                    border: none;
                    /deep/ .nitrozen-options {
                        width: 250px;
                    }
                }
                .page-item {
                    padding: 8px 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .option-text {
                        flex: 70;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .page-options {
                        display: flex;
                        flex: 30;
                        justify-content: space-between;
                        .icon-space {
                            padding-right: 4px;
                        }
                    }
                }
                .add-btn {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    .icon {
                        margin: 0px 10px;
                    }
                }
            }
        }
        .iframe-wrapper {
            padding: 10px;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            transform-origin: 50% 50%;
            position: relative;
            display: flex;
            .preview {
                height: 100%;
                width: 100%;
                margin: auto;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.1),
                    0 0 12px rgba(0, 0, 0, 0.1);
            }
        }
        .iframe-wrapper__mobile {
            max-height: 667px !important;
            transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
            iframe {
                transition: width 1s cubic-bezier(0.19, 1, 0.22, 1);
                width: 375px !important;
                min-width: 375px;
            }
        }
        .iframe-wrapper__tablet {
            transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
            iframe {
                transition: width 1s cubic-bezier(0.19, 1, 0.22, 1);
                width: 768px !important;
                min-width: 768px;
            }
        }
        .iframe-wrapper__desktop {
            transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
            iframe {
                transition: width 1s cubic-bezier(0.19, 1, 0.22, 1);
                min-width: 1024px !important;
            }
        }
        .iframe-loader-wrapper {
            height: 100%;
            width: 100%;
            z-index: 1;
            position: absolute;
            background-color: #f8f8f8;
        }
        .iframe-loader {
            z-index: 2;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
.full-width {
    width: 100% !important;
}
.hide-sidebar {
    margin-left: -300px;
}
.preview-zoom-out {
    transform: scale(0.5) translateY(-46%);
    overflow: unset !important;
    iframe {
        height: 200% !important;
    }
}

.preview-outline {
    box-shadow: inset 0 0 0 3px white, 0 0 6px 0 rgba(0, 0, 0, 0.25),
        0 0 40px 0 rgba(0, 0, 0, 0.15), 0 0 80px 0 rgba(0, 0, 0, 0.35);
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    border: 3px solid #5c6ac4;
    border-radius: 3px;
}
/deep/ .nitrozen-options {
    min-width: 200px;
}
</style>
