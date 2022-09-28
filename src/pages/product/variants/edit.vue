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
                <div class="input-box">
                    <nitrozen-dropdown
                        :label="'Choose Template'"
                        class="filter-dropdown"
                        :multiple="true"
                        :searchable="true"
                        :required="true"
                        :items="filteredTemplateList"
                        placeholder="select departments"
                        v-model="selectedTemplates.value"
                        @change="getAttributes"
                        @searchInputChange="setFilteredTemplateList"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="selectedTemplates.showerror"
                        >{{ selectedTemplates.errortext }}
                    </nitrozen-error>
                </div>
                <div
                    v-for="(item, index) of selectedTemplates.value"
                    :key="index"
                >
                    <nitrozen-chips class="chip">
                        {{ item }}
                        <nitrozen-inline
                            icon="cross"
                            class="nitrozen-icon"
                            @click="removeTemplate()"
                        ></nitrozen-inline>
                    </nitrozen-chips>
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
    FETCH_TEMPLATES
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
            displayTypeList: [],
            attributeList: []
        };
    },
    mounted() {
        this.init();
        if (this.$route.params.uid) {
            this.pageLoading = true;
            this.uid = this.$route.params.uid;
            this.headerText = 'Update Variant';
            // this.getDisplayType();
            // this.init();
            // this.updateData();
        } else {
            // this.getDisplayType();
            // this.init();
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
                        this.templateList = res[1];
                        this.filteredTemplateList = cloneDeep(
                            this.templateList
                        );
                    }
                })
                .catch((err) => {
                    console.log('Something is wrong');
                })
                .finally(() => {
                    this.pageLoading = true;
                });
        },
        // getDepartment() {
        //     const query = {
        //         page_size: 9999,
        //         page_no: 1
        //     };
        //     CatalogService.fetchDepartment(query)
        //         .then(({ data }) => {
        //             this.departmentList = data.items;
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         });
        // },
        save() {},
        setFilteredTemplateList() {},
        removeTemplate(index) {
            this.selectedTemplates.value.splice(index, 1);
            this.getAttributes();
        },
        getAttributes: debounce(function() {
            console.log('Got attributes');
        }, 500),

        redirectToListing() {
            this.$router.push({ path: '/administrator/product/variants' });
        }
    }
};
</script>
