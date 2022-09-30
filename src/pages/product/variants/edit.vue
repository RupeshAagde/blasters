<template>
    <div>
        <div>
            <page-header :title="headerText" @backClick="redirectToListing">
                <div class="page-slot">
                    <nitrozen-toggle-btn
                        v-model="is_active"
                        :title="
                            is_active
                                ? 'Disable department'
                                : 'Enable department'
                        "
                    ></nitrozen-toggle-btn>

                    <span>
                        <nitrozen-button
                            class="left-space-txb"
                            :theme="'secondary'"
                            @click="save"
                            v-flatBtn
                            >Save</nitrozen-button
                        >
                    </span>
                </div>
            </page-header>
        </div>
        <div class="v-edit-page">
            <div class="template-box">
                <div>
                    <nitrozen-dropdown
                        :label="'Template'"
                        class="filter-dropdown"
                        :multiple="true"
                        :searchable="true"
                        :required="true"
                        :items="filteredTemplateList"
                        placeholder="select templates"
                        v-model="selectedTemplates.value"
                        @change="getCurrentDep"
                        @searchInputChange="setFilteredTemplateList"
                        :enable_select_all="true"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="selectedTemplates.showerror"
                        >{{ selectedTemplates.errortext }}
                    </nitrozen-error>
                </div>

                <div v-if="selectedTemplates.value" class="label-data">
                    <span
                        v-for="(temp, index) of selectedTemplates.value"
                        class="chips mr-s mt-s"
                    >
                        {{ temp }}
                        <nitrozen-inline
                            icon="cross"
                            class="pointer ml-xs"
                            @click="removeTemplate(index)"
                        ></nitrozen-inline>
                    </span>
                </div>
            </div>
            <div class="input-row mt-l">
                <div class="row-item">
                    <nitrozen-dropdown
                        :label="'Attribute'"
                        :required="true"
                        class="filter-dropdown"
                        :disabled="
                            !selectedTemplates.value.length ||
                                !attributeList.length
                        "
                        :items="attributeList"
                        placeholder="Choose Attribute"
                        v-model="selectedAttribute.value"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="selectedAttribute.showerror"
                        >{{ selectedAttribute.errortext }}
                    </nitrozen-error>
                </div>
                <div class="row-item">
                    <nitrozen-input
                        label="Display Name *"
                        placeholder="Give a name to the variant"
                        v-model="name.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="name.showerror"
                        >{{ name.errortext }}
                    </nitrozen-error>
                </div>
            </div>

            <div class="mt-l">
                <nitrozen-dropdown
                    :label="'Display type '"
                    class="filter-dropdown"
                    :searchable="true"
                    :multiple="true"
                    :required="true"
                    :items="displayTypeList"
                    placeholder="Select display type"
                    v-model="selectedDisplayType.value"
                    :enable_select_all="true"
                ></nitrozen-dropdown>
                <nitrozen-error v-if="selectedDisplayType.showerror"
                    >{{ selectedDisplayType.errortext }}
                </nitrozen-error>
            </div>

            <!-- image configuration based on display type -->
            <div v-if="isSwatchSSelected" class="mt-xl">
                <div class="cust-sh2">Image Configurations</div>

                <div class="input-row mt-l">
                    <!-- minimum height -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Minimum Height *"
                            placeholder=""
                            v-model="image_config.min_height.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.min_height.showerror"
                            >{{ image_config.min_height.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- minimum width -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Minimum Width *"
                            placeholder=""
                            v-model="image_config.min_width.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.min_width.showerror"
                            >{{ image_config.min_width.errortext }}
                        </nitrozen-error>
                    </div>
                </div>

                <div class="input-row mt-l">
                    <!-- maximum height -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Maximum Height *"
                            placeholder=""
                            v-model="image_config.max_height.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.showerror"
                            >{{ image_config.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- maximum width -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Maximum Width *"
                            placeholder=""
                            v-model="image_config.max_width.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.max_width.showerror"
                            >{{ image_config.max_width.errortext }}
                        </nitrozen-error>
                    </div>
                </div>

                <div class="input-row mt-l">
                    <!-- maximum file size -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Maximum File Size *"
                            placeholder=""
                            v-model="image_config.max_size.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.max_size.showerror"
                            >{{ image_config.max_size.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- file type selection -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Choose File Type *"
                            placeholder=""
                            v-model="image_config.file_type.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.file_type.showerror"
                            >{{ image_config.file_type.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                <!-- maintain aspect ratio  -->
                <div>
                    <span>maintain aspect ratio</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped></style>
<script>
import CatalogService from '@/services/catalog.service';
import loader from '@/components/common/loader';
import { debounce } from '@/helper/utils';
import Shimmer from '@/components/common/shimmer';
import PageHeader from '@/components/common/layout/page-header';
import PageError from '@/components/common/page-error';
import {
    FETCH_VARIANT_DISPLAY_TYPE,
    FETCH_TEMPLATES,
    FETCH_ATTRIBUTES
} from '@/store/action.type.js';
import cloneDeep from 'lodash/cloneDeep';
import {
    flatBtn,
    NitrozenBadge,
    NitrozenButton,
    NitrozenChips,
    NitrozenDropdown,
    NitrozenError,
    NitrozenInline,
    NitrozenInput,
    NitrozenToggleBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
const FILE_TYPE = [
    { text: 'PNG', value: 'png' },
    { text: 'JPEG', value: 'jpeg' },
    { text: 'PDF', value: 'pdf' }
];

export default {
    name: 'create-update-variant',
    components: {
        loader,
        Shimmer,
        PageHeader,
        PageError,
        NitrozenInput,
        NitrozenError,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenChips,
        NitrozenInline,
        NitrozenBadge,
        NitrozenToggleBtn
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            pageLoading: false,
            PageError: false,
            uid: null,
            is_active: true,
            headerText: 'Create Variant',
            selectedTemplates: this.getInitialValue(),
            templateList: [],
            filteredTemplateList: [],
            temp_dep_set: {},
            selectedDisplayType: this.getInitialValue(),
            displayTypeList: [],
            selectedAttribute: this.getInitialValue(''),
            attributeList: [],
            name: this.getInitialValue(''),
            image_config: this.getInitialImageConfig(),
            fileTypeList: FILE_TYPE
        };
    },
    computed: {
        isSwatchSSelected() {
            return this.selectedDisplayType.value.includes('color');
        }
    },
    mounted() {
        this.init();
        if (this.$route.params.uid) {
            this.pageLoading = true;
            this.uid = this.$route.params.uid;
            this.headerText = 'Update Variant';
        }
    },
    methods: {
        getInitialValue(val = []) {
            return {
                value: val,
                showerror: false,
                errortext: ''
            };
        },
        getInitialImageConfig(
            minH = 0,
            maxH = 0,
            minW = 0,
            maxW = 0,
            maxS = 0,
            fileT = '',
            mAR = false
        ) {
            return {
                min_height: this.getInitialValue(minH),
                max_height: this.getInitialValue(maxH),
                min_width: this.getInitialValue(minW),
                max_width: this.getInitialValue(maxW),
                max_size: this.getInitialValue(maxS),
                file_type: this.getInitialValue(fileT),
                maintain_aspect_ratio: mAR
            };
        },
        init() {
            this.pageLoading = true;
            this.pageError = false;
            const templateParams = {
                page_no: 1,
                page_size: 9999,
                sort: 'created_desc'
            };
            Promise.all([
                this.$store
                    .dispatch(FETCH_VARIANT_DISPLAY_TYPE, {
                        choice_type: 'variants'
                    })
                    .catch(() => {
                        console.log('Error in fetching display type');
                    }),
                this.$store
                    .dispatch(FETCH_TEMPLATES, templateParams)
                    .catch(() => {
                        console.log('Error in fetching display type');
                    })
            ])
                .then((res) => {
                    //display type
                    if (res[0]) this.displayTypeList = res[0];

                    //template list
                    if (res[1]) {
                        this.templateList = res[1].temp;
                        this.filteredTemplateList = cloneDeep(
                            this.templateList
                        );
                        this.temp_dep_set = res[1].temp_dep_set;
                    }
                })
                .catch((err) => {
                    console.log('Something is wrong');
                })
                .finally(() => {
                    this.pageLoading = true;
                });
        },

        // template listing, adding removing template, calculating departments and then getting related attributes
        setFilteredTemplateList: debounce(function(e) {
            this.filteredTemplateList = [];
            this.templateList.forEach((t) => {
                if (
                    !e ||
                    !e.text ||
                    t.text.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.filteredTemplateList.push(t);
                }
            });
        }, 400),
        removeTemplate(index) {
            this.selectedTemplates.value.splice(index, 1);
            this.getCurrentDep();
        },
        getCurrentDep() {
            let departments = [];
            this.selectedTemplates.value.forEach((temp) => {
                if (this.temp_dep_set[temp]) {
                    departments.push(this.temp_dep_set[temp]);
                }
            });
            if (this.selectedTemplates.value.length > 0)
                this.getAttributes(departments);
        },
        getAttributes: debounce(function(dep) {
            this.pageLoading = true;
            const params = {
                page_no: 1,
                page_size: 9999,
                department: dep
            };
            this.$store
                .dispatch(FETCH_ATTRIBUTES, params)
                .then((res) => {
                    this.attributeList = res;
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        }, 500),

        save() {},

        redirectToListing() {
            this.$router.push({ path: '/administrator/product/variants' });
        }
    }
};
</script>
