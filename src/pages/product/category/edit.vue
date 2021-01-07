<template>
    <div>
        <div>
            <page-header :title="headerText" @backClick="redirectToListing">
                <div class="page-slot">
                    <div class="left-space-txb">
                        <div v-if="update">
                            <nitrozen-badge v-if="is_active" state="success"
                                >Active</nitrozen-badge
                            >
                            <nitrozen-badge v-if="!is_active" state="warn"
                                >Disabled</nitrozen-badge
                            >
                        </div>
                    </div>
                    <div class="button-box">
                        <label
                            :class="is_active ? 'active-dept' : 'disabled-dept'"
                        >
                            <span>{{ is_active ? 'Active' : 'Disabled' }}</span>
                            <nitrozen-toggle-btn
                                v-model="is_active"
                                :title="
                                    is_active
                                        ? 'Disable Category'
                                        : 'Enable Category'
                                "
                            ></nitrozen-toggle-btn>
                        </label>
                        <span>
                            <nitrozen-button
                                class="left-space-txb"
                                :theme="'secondary'"
                                ref="save"
                                @click="save"
                                v-flatBtn
                                >Save</nitrozen-button
                            >
                        </span>
                    </div>
                </div>
            </page-header>
        </div>
        <img
            src="/public/assets/loader.gif"
            class="cust-loader"
            v-if="pageLoading"
        />
        <page-error
            class="cust-error"
            v-else-if="pageError && !pageLoading"
            @tryAgain="updateData"
        ></page-error>
        <div v-if="!pageLoading && !pageError" class="main-container">
            <div class="row-1">
                <div class="input-box">
                    <nitrozen-input
                        label="Category Name*"
                        v-model="name.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="name.showerror">{{
                        name.errortext
                    }}</nitrozen-error>
                </div>

                <div class="input-box left-space-txb">
                    <div>
                        <nitrozen-dropdown
                            class="input w-l"
                            label="Level"
                            :disabled="isEdit"
                            :items="levelList.levels"
                            v-model="level.value"
                            :required="true"
                            :multiple="false"
                            :searchable="false"
                            @change="levelChange"
                        ></nitrozen-dropdown>
                        <nitrozen-error v-if="level.showerror">{{
                            level.errortext
                        }}</nitrozen-error>
                    </div>
                </div>
            </div>
            <div class="row-2">
                <div class="dept">
                    <div class="dept-input">
                        <nitrozen-dropdown
                            class="input w-l"
                            label="Departments"
                            :items="departmentsList"
                            v-model="selectedDepartments.value"
                            :required="true"
                            :multiple="true"
                            :searchable="true"
                            @change="updateMapping"
                            @searchInputChange="setDepartmentList"
                        ></nitrozen-dropdown>
                        <nitrozen-error v-if="selectedDepartments.showerror">{{
                            selectedDepartments.errortext
                        }}</nitrozen-error>
                    </div>
                    <div class="chip-wrapper inline">
                        <div
                            v-for="(department,
                            index) of selectedDepartments.mapping"
                            :key="index"
                        >
                            <nitrozen-chips class="chip">
                                {{ department.text }}
                                <nitrozen-inline
                                    icon="cross"
                                    class="nitrozen-icon"
                                    @click="removeItem(index, department)"
                                ></nitrozen-inline>
                            </nitrozen-chips>
                        </div>
                    </div>
                </div>
                <div class="dept">
                    <nitrozen-input
                        label="Priority*"
                        v-model="priority.value"
                        type="number"
                        hint=""
                    ></nitrozen-input>
                    <nitrozen-error v-if="priority.showerror">{{
                        priority.errortext
                    }}</nitrozen-error>
                </div>
            </div>
            <div class="row-3">
                <div class="n-input-label">Add Synonyms</div>
                <div class="input-text tags" @click="$refs.synonymText.focus()">
                    <nitrozen-chips
                        v-for="(item, index) in synonym.value"
                        :key="'synonymText_' + index"
                    >
                        {{ item }}
                        <nitrozen-inline
                            :icon="'cross'"
                            class="nitrozen-icon"
                            v-on:click="removeSearchInput(index)"
                        ></nitrozen-inline>
                    </nitrozen-chips>
                    <input
                        type="text"
                        class="chip-input cl-Mako light-xs"
                        @keydown="getSearchText()"
                        @focusout="addSearchText()"
                        ref="synonymText"
                        v-model="synonymText"
                    />
                </div>
            </div>
            <div class="logo-container">
                <div class="row">
                    <div class="n-input-label">Logo*</div>
                    <image-uploader-tile
                        label="Logo"
                        aspectRatio="1:1"
                        @delete="logo.value = ''"
                        @save="logo.value = $event"
                        v-model="logo.value"
                        fileName="logo"
                        namespace="category-square-logo"
                    ></image-uploader-tile>
                    <nitrozen-error v-if="logo.showerror">{{
                        logo.errortext
                    }}</nitrozen-error>
                </div>
                <div class="row">
                    <div class="n-input-label">Portrait*</div>
                    <image-uploader-tile
                        label="Portrait Image"
                        aspectRatio="13:20"
                        @delete="banner = ''"
                        @save="banner = $event"
                        v-model="banner"
                        fileName="banner"
                        namespace="category-portrait-banner"
                    ></image-uploader-tile>
                    <nitrozen-error v-if="miscErrors.portrait.showerror">{{
                        miscErrors.portrait.errortext
                    }}</nitrozen-error>
                </div>
                <div>
                    <div class="n-input-label">Landscape*</div>
                    <image-uploader-tile
                        label="Landscape Image"
                        aspectRatio="27:20"
                        @delete="landscape = ''"
                        @save="landscape = $event"
                        v-model="landscape"
                        fileName="landscape"
                        namespace="category-landscape-banner"
                    ></image-uploader-tile>
                    <nitrozen-error v-if="miscErrors.landscape.showerror">{{
                        miscErrors.landscape.errortext
                    }}</nitrozen-error>
                </div>
            </div>
            <div v-if="level.value === '3' || level.value === 3">
                <div class="row-3">
                    <nitrozen-dropdown
                        class="tryouts w-l"
                        label="Tryouts"
                        :items="tryoutList"
                        v-model="tryouts"
                        :required="false"
                        :multiple="true"
                        :searchable="false"
                    ></nitrozen-dropdown>
                </div>
                <div class="row-3">
                    <nitrozen-dropdown
                        class="tryouts w-l"
                        label="Marketplaces"
                        :items="marketplaces.list"
                        v-model="marketplaces.value"
                        :required="false"
                        :multiple="false"
                        :searchable="false"
                    ></nitrozen-dropdown>
                </div>
                <div>
                    <div class="extra-params" v-if="marketplaces.value.length">
                        <div class="box-title">
                            {{ marketplaces.list[0]['text'] }}
                        </div>
                        <!-- KEY -->
                        <div class="input-box">
                            <div class="input">
                                <nitrozen-input
                                    label="Key"
                                    type="number"
                                    placeholder="Enter key"
                                    v-model="
                                        marketplaces.subvalues['google'][
                                            'catalog_id'
                                        ]
                                    "
                                ></nitrozen-input>
                            </div>
                            <!-- VALUE -->
                            <div class="input">
                                <nitrozen-input
                                    label="Value"
                                    placeholder="Enter value"
                                    v-model="
                                        marketplaces.subvalues['google']['name']
                                    "
                                ></nitrozen-input>
                            </div>
                            <div class="delete" @click="deleteMarketplace">
                                <adm-inline-svg src="delete"></adm-inline-svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="n-input-label" v-if="hierarchy.length > 0">
                    Hierarchy
                </div>
                <div class="row-1" v-for="(item, i) in hierarchy">
                    <div class="subscription-container">
                        <div class="col-one child">
                            <nitrozen-input
                                label="Department"
                                :value="getDepartmentName(item.department)"
                                disabled
                            ></nitrozen-input>
                        </div>
                        <div class="col-two child">
                            <nitrozen-dropdown
                                class="input w-l"
                                label="Level 1"
                                :items="getItems(item.department, 'one')"
                                v-model="item['l1']"
                                :required="true"
                                :multiple="false"
                                :searchable="true"
                                :ref="'level1' + item.department"
                                @searchInputChange="
                                    (e) => searchLevel(e, 1, item.department)
                                "
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="item.showerrorl1"
                                >Level 1 required</nitrozen-error
                            >
                        </div>
                        <div class="col-three child">
                            <nitrozen-dropdown
                                class="input w-l"
                                label="Level 2"
                                :items="getItems(item.department, 'two')"
                                v-model="item['l2']"
                                :required="true"
                                :multiple="false"
                                :searchable="true"
                                :ref="'level2' + item.department"
                                @searchInputChange="
                                    (e) => searchLevel(e, 2, item.department)
                                "
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="item.showerrorl2"
                                >Level 2 required</nitrozen-error
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
::v-deep .page-slot {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center;
}
.button-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .active-dept {
        color: #5c6bdd;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: 600;
    }

    .disabled-dept {
        color: #9b9b9b;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: 600;
    }
}
.cust-error {
    margin-top: 60px;
}
.cust-loader {
    display: flex;
    align-items: center;
    margin: 120px auto 0 auto;
    justify-content: center;
    height: 100px;
}
.left-space-txb {
    margin-left: 12px;
}
.label {
    color: #9b9b9b;
    font-size: 14px;
    margin-bottom: 6px;
    font-weight: 500;
}
.inline {
    display: flex;
}
.chip-wrapper {
    margin-top: 12px;
    flex-wrap: wrap;
}
.logo-container {
    margin-bottom: 24px;
    .row {
        margin-bottom: 10px;
    }
}
.extra-params-saperator {
    width: 49.5%;
    border-top: 1px dashed #e4e5e6;
    height: 1px;
    margin: 12px 0;
}
.extra-params {
    border: 1px solid #dadada;
    border-radius: 5px;
    padding: 24px;
    flex-direction: column;
    margin-bottom: 24px;
    width: 45%;
    display: flex;
    justify-content: space-between;
    .box-title {
        color: #9b9b9b;
        font-size: 14px;
        margin-bottom: 5px;
    }
    .input-box {
        display: flex;
    }
    .nitrozen-form-input {
        margin-right: 12px;
    }
    .input {
        width: 50%;
    }
    .delete {
        cursor: pointer;
        padding-top: 18px;
        align-self: center;
    }
}
.main-container {
    background-color: #fff;
    border-radius: 4px;
    margin: 85px 24px 24px 24px !important;
    padding: 24px;
    font-family: Poppins;

    .row-1 {
        width: 100%;
        margin: 0 0 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .input-box {
            width: 50%;
        }
    }
    .dept-input {
        width: 60%;
    }
    .tryouts {
        width: 49.5%;
    }
    .dept {
        width: 49.5%;
    }
    .row-2 {
        width: 100%;
        margin: 0 0 24px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .input-box {
            width: 49.5%;
        }
    }
    .row-3 {
        width: 100%;
        margin: 24px 0 24px 0;
        .input-text {
            border: 1px solid #eee;
            padding: 12px;
            input {
                padding: 8px 0px 5px 10px;
                border-radius: @BorderRadius;
            }
        }
        .tags {
            min-height: 100px;
            width: 97%;
            cursor: text;
            .chip-input {
                border: none !important;
                &:focus {
                    outline: none;
                }
            }
        }
    }
}
.subscription-container {
    position: relative;
    border: 1px solid #dadada;
    border-radius: 5px;
    padding: 24px;
    margin-bottom: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    .child {
        width: 30%;
        max-width: 30%;
    }
}
</style>
<script>
import CompanyService from '@/services/company-admin.service';
import CatalogService from '@/services/catalog.service';
import PageHeader from '@/components/common/layout/page-header';
import loader from '@/components/common/loader';
import Shimmer from '@/components/common/shimmer';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import { ImageUploaderTile } from '@/components/common/';
import { convertToSlug } from '@/helper/utils';
import PageError from '@/components/common/page-error';
import {
    NitrozenInput,
    NitrozenError,
    NitrozenButton,
    NitrozenChips,
    NitrozenInline,
    NitrozenBadge,
    NitrozenToggleBtn,
    NitrozenDropdown,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

export default {
    name: 'create-update-category',
    components: {
        'nitrozen-chips': NitrozenChips,
        loader,
        PageHeader,
        PageError,
        Shimmer,
        NitrozenInput,
        NitrozenBadge,
        NitrozenError,
        ImageUploaderTile,
        NitrozenToggleBtn,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenInline,
        'adm-inline-svg': adminlinesvg
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mounted() {
        if (this.$route.params.id) {
            this.pageLoading = true;
            this.uid = this.$route.params.id;
            this.update = true;
            this.headerText = 'Update Category';
            this.saveText = 'Category updated successfully';
            this.isEdit = this.$route.params.id ? true : false;
        }
        this.init();
    },
    data() {
        return {
            uid: null,
            update: false,
            is_active: true,
            pageLoading: false,
            pageError: false,
            isEdit: false,
            errors: {},
            data: {
                level: ''
            },
            departmentsList: [], // department dropdown list list data
            hierarchy: [],
            departments: [], //  department dropdown list intitial data
            tryoutList: [
                { text: 'Eyebrow', value: 'Eyebrow' },
                { text: 'Lipstick', value: 'Lipstick' },
                { text: 'Eyeliner', value: 'Eyeliner' },
                { text: 'Blush', value: 'Blush' }
            ],
            tryouts: [],
            landscape: '',
            banner: '',
            miscErrors: {
                landscape: {
                    showerror: false,
                    errortext: 'Landscape Image is required'
                },
                portrait: {
                    showerror: false,
                    errortext: 'Portrait Image is required'
                }
            },
            saveText: 'Category saved successfully',
            headerText: 'Create Category',
            synonymText: '',
            priority: {
                value: '',
                showerror: false,
                errortext: 'Priority is required'
            },
            name: {
                value: '',
                showerror: false,
                errortext: 'Name is required'
            },
            levelList: {
                levels: [
                    { text: 'Level 1', value: 1 },
                    { text: 'Level 2', value: 2 },
                    { text: 'Level 3', value: 3 }
                ],
                one: [],
                two: []
            },
            level: {
                value: '',
                showerror: false,
                errortext: 'Level is required'
            },
            logo: {
                value: '',
                showerror: false,
                errortext: 'Logo is required'
            },
            marketplaces: {
                subvalues: {
                    google: { catalog_id: '', name: '' }
                },
                list: [
                    {
                        text: 'Google',
                        value: 'google'
                    }
                ],
                value: []
            },
            initialSelectedDepartments: [],
            selectedDepartments: {
                //departments selected
                value: [],
                showerror: false,
                errortext: 'Department is required',
                mapping: [],
                previousValue: []
            },
            synonym: {
                value: []
            }
        };
    },

    methods: {
        async init() {
            const promiseArray = [CompanyService.fetchDepartments()];
            if (this.isEdit) {
                promiseArray.push(
                    CompanyService.fetchCategory_v2({ uid: this.uid })
                );
            }
            try{
            const promiseResult = await Promise.all(promiseArray);
            if(promiseResult[0].data.data.length){
                this.departments = promiseResult[0].data.data;
                this.setDepartmentList();
            }
            if(this.isEdit && promiseResult[1].data && promiseResult[1].data.data[0]){
                const categoryData = promiseResult[1].data.data[0];
                await this.levelChange(3, categoryData.departments, true);
                this.updateData(categoryData)
            }
            }
            catch(error){
                console.log(error)
                this.pageError = true
            }
            this.pageLoading = false;
        },
        getItems(department, level) {
            if (
                this.levelList[department] &&
                this.levelList[department][level]
            ) {
                return this.levelList[department][level];
            } else {
                return [];
            }
        },
        removeItem(index, department) {
            if (
                this.isEdit &&
                this.initialSelectedDepartments.includes(department.value)
            ) {
                return this.$snackbar.global.showError(
                    `Invalid Operation. Cannot unselect the existing department`
                );
            }
            const { value } = department;
            this.selectedDepartments.value.splice(
                this.selectedDepartments.value.findIndex(
                    (item) => item === value
                ),
                1
            );
            this.selectedDepartments.mapping.splice(index, 1);
            this.updateHierarchy(this.selectedDepartments.value);
        },
        deleteMarketplace(e) {
            this.marketplaces.subvalues['google']['catalog_id'] = '';
            this.marketplaces.subvalues['google']['name'] = '';
            this.marketplaces.value = [];
        },
        setDepartmentList(e) {
            this.departmentsList = [];
            this.departments.forEach(({ name, uid }) => {
                if (
                    !e ||
                    !e.text ||
                    name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.departmentsList.push({
                        text: name,
                        value: uid
                    });
                }
            });
        },
        updateMapping(list) {
            if (
                this.isEdit &&
                list.length < this.selectedDepartments.mapping.length &&
                this.initialSelectedDepartments.some(
                    (item) => !list.includes(item)
                )
            ) {
                this.$snackbar.global.showError(
                    `Invalid Operation. Cannot delete department`
                );
                this.$set(this.selectedDepartments, 'value', []);
                this.selectedDepartments.previousValue.forEach(
                    (value, index) => {
                        this.$set(this.selectedDepartments.value, index, value);
                    }
                );
                return;
            }
            this.initDepartment(list);
            this.updateHierarchy(list);
        },
        updateHierarchy(list, append = false) {
            if (list.length > this.hierarchy.length || append) {
                //added
                const lastElem = list[list.length - 1];
                this.hierarchy.push({
                    department: list[list.length - 1],
                    l1: '',
                    l2: '',
                    showerrorl1: false,
                    showerrorl2: false
                });
                this.levelChange(-1, [lastElem]);
            } else {
                const indexToRemove = this.hierarchy.findIndex(
                    (item) => !list.includes(item.department)
                );
                this.hierarchy.splice(indexToRemove, 1);
            }
            this.$set(this.selectedDepartments, 'previousValue', list);
        },
        initDepartment(received) {
            this.selectedDepartments.mapping = [];
            const value = [];
            this.departments.forEach((d) => {
                if (received.includes(d.uid)) {
                    value.push(d.uid);
                    this.selectedDepartments.mapping.push({
                        text: d.name,
                        value: d.uid
                    });
                }
            });
            return value;
        },
        updateData(data = {}) {
            this.is_active = data.is_active;
            this.level.value = data.level ? data.level : '';
            this.name.value = data.name ? data.name : '';
            this.logo.value =
                data.media && data.media.logo ? data.media.logo : '';
            this.landscape =
                data.media && data.media.landscape ? data.media.landscape : '';
            this.banner =
                data.media && data.media.portrait ? data.media.portrait : '';
            this.synonym.value = data.synonyms ? data.synonyms : [];
            this.priority.value = data.priority ? data.priority : '';
            if (this.level.value && this.level.value === 3) {
                this.tryouts = data.tryouts ? data.tryouts : [];
                this.hierarchy = data.hierarchy ? data.hierarchy : [];
                if (
                    data.marketplaces &&
                    data.marketplaces.google &&
                    data.marketplaces.google.catalog_id &&
                    data.marketplaces.google.name
                ) {
                    this.marketplaces.value = ['google'];
                    this.marketplaces.subvalues['google']['catalog_id'] =
                        data.marketplaces['google']['catalog_id'] || '';
                    this.marketplaces.subvalues['google']['name'] =
                        data.marketplaces['google']['name'] || '';
                }
            }
            this.selectedDepartments.value = data.departments
                ? this.initDepartment(data.departments)
                : [];
            this.selectedDepartments.previousValue = this.selectedDepartments.value;
            this.initialSelectedDepartments = data.departments
                ? this.initDepartment(data.departments)
                : [];
        },
        searchDepartment(e) {
            this.setDepartmentList(this.departmentsList, e);
        },
        removeSearchInput(index) {
            this.synonym.value.splice(index, 1);
        },
        getSearchText() {
            if (
                event.keyCode == 32 ||
                event.keyCode == 13 ||
                event.keyCode == 44 ||
                event.keyCode == 9 ||
                event.keyCode == 188
            ) {
                this.addSearchText(event);
                event.target.value = '';
            }
            if (event.keyCode == 8 && !this.synonymText) {
                if (this.synonym.value.length) {
                    this.synonym.value.pop();
                }
            }
        },
        getDepartmentName(id) {
            const found = this.departments.find(
                (item) => item.uid === parseInt(id)
            );
            return found && found.name;
        },
        searchLevel(e, level, department) {
            const params = {};
            params['level'] = [level];
            if (e && e.text) {
                params['q'] = e.text;
            }
            if (department) {
                params['department'] = department;
            }
            params['page_size'] = 200;
            CompanyService.fetchCategory_v2(params)
                .then(({ data }) => {
                    if (data && data.data && data.data.length) {
                        // return data.data.map((item) => ({'text': item.name, 'value': item.uid}))
                        if (level === 1) {
                            this.levelList[department].one = [];
                            data.data.forEach((item) => {
                                this.levelList[department].one.push({
                                    text: item.name,
                                    value: item.uid
                                });
                            });
                        } else {
                            this.levelList[department].two = [];
                            data.data.forEach((item) => {
                                this.levelList[department].two.push({
                                    text: item.name,
                                    value: item.uid
                                });
                            });
                        }
                    }
                })
                .catch((err) => {
                    this.pageError = true;
                });
        },
        async levelChange(e, departments = [], initial = false) {
            if (e == 3) {
                if (
                    // when level changes from L2 to L3 and departments are already selected
                    this.selectedDepartments.value &&
                    this.selectedDepartments.value.length
                ) {
                    this.hierarchy = [];
                    this.selectedDepartments.value.forEach((item) =>
                        this.updateHierarchy([item], true)
                    );
                }
            }
            const params = {
                level: [1, 2]
            };
            params['page_size'] = 500;
            const promiseArray = []
            departments.forEach((dept, index) => {
                params['department'] = dept;
                promiseArray.push(CompanyService.fetchCategory_v2(params))
            });
            try{
            const promiseresult = await Promise.all(promiseArray)
            departments.forEach((dept,index) => {
                this.$set(this.levelList, dept, {});
                this.$set(this.levelList[dept], 'one', []);
                this.$set(this.levelList[dept], 'two', []);
                if(promiseresult && promiseresult[index] && promiseresult[index].data &&
                    promiseresult[index].data.data){
                    promiseresult[index].data.data.forEach((item, index) => {
                                if (item.level === 1) {
                                    this.levelList[dept].one.push({
                                        text: item.name,
                                        value: item.uid
                                    }); 
                                } else {
                                    this.levelList[dept].two.push({
                                        text: item.name,
                                        value: item.uid
                                    });
                                }
                            });
                }
                else{
                    pageError = true;
                }
            })
            }
            catch(error){
                console.log(error);
                this.pageError = true;
            }
            this.pageLoading = false;
        },
        addSearchText(event) {
            if (this.synonymText) {
                if (
                    this.synonym.value.filter((it) => it === this.synonymText)
                        .length === 0
                ) {
                    let splitString = this.synonymText.split(',');
                    for (let i = 0; i < splitString.length; i++) {
                        this.synonym.value.push(splitString[i]);
                    }
                }
                this.synonymText = '';
            }
        },
        redirectToListing() {
            this.$router.push({ path: '/administrator/product/category' });
        },
        validate() {
            let isInvalid = true;
            let message = 'Invalid Value';
            if (this.priority.value !== '' && this.priority.value >= 1) {
                isInvalid = false;
            }
            isInvalid &&
                this.$snackbar.global.showError(
                    `Invalid Priority. Value should be greater than 0`
                );
            return isInvalid;
        },
        save() {
            let postdata = {
                is_active: this.is_active
            };
            if (this.update && this.uid) postdata.id = this.uid;
            if (this.name.value !== '') {
                this.name.showerror = false;
                postdata.name = this.name.value;
            } else {
                this.name.showerror = true;
            }

            postdata['tryouts'] = this.tryouts ? this.tryouts : [];
            postdata['synonyms'] = this.synonym.value ? this.synonym.value : [];
            postdata['media'] = {};

            if (this.priority.value !== '') {
                this.priority.showerror = false;
                postdata['priority'] = this.priority.value;
            } else {
                this.priority.showerror = true;
            }
            if (this.logo.value !== '') {
                this.logo.showerror = false;
                postdata['media'].logo = this.logo.value;
            } else {
                this.logo.showerror = true;
            }
            if (this.banner !== '') {
                this.miscErrors.portrait.showerror = false;
                postdata['media'].portrait = this.banner;
            } else {
                this.miscErrors.portrait.showerror = true;
            }
            if (this.landscape !== '') {
                this.miscErrors.landscape.showerror = false;
                postdata['media'].landscape = this.landscape;
            } else {
                this.miscErrors.landscape.showerror = true;
            }
            if (this.level.value !== '') {
                this.level.showerror = false;
                postdata['level'] = this.level.value;
            } else {
                this.level.showerror = true;
            }
            if (
                this.selectedDepartments.value &&
                this.selectedDepartments.value.length !== 0
            ) {
                this.selectedDepartments.showerror = false;
                postdata['departments'] = this.selectedDepartments.value;
            } else {
                this.selectedDepartments.showerror = true;
            }
            let hierarchyError = false;
            if (this.level.value === 3) {
                if (this.marketplaces.value && this.marketplaces.value.length) {
                    postdata['marketplaces'] = this.marketplaces.subvalues;
                } else {
                    postdata['marketplaces'] = {};
                }
                postdata['hierarchy'] = this.hierarchy;
                this.hierarchy &&
                    this.hierarchy.length &&
                    this.hierarchy.forEach((item, index) => {
                        if (item['l1'] === '') {
                            hierarchyError = true;
                            item['showerrorl1'] = true;
                        } else {
                            item['showerrorl1'] = false;
                        }
                        if (item['l2'] === '') {
                            hierarchyError = true;
                            item['showerrorl2'] = true;
                        } else {
                            item['showerrorl2'] = false;
                        }
                        if (
                            index === this.hierarchy.length - 1 &&
                            !hierarchyError === true
                        ) {
                            hierarchyError = false;
                        }
                    });
            }

            if (
                !this.name.showerror &&
                !this.logo.showerror &&
                !this.level.showerror &&
                !this.selectedDepartments.showerror &&
                !this.priority.showerror &&
                !this.miscErrors.portrait.showerror &&
                !this.miscErrors.landscape.showerror &&
                !hierarchyError &&
                !this.validate()
            ) {
                this.pageLoading = true;
                CompanyService.updateCategory_v2(postdata)
                    .then((res) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showSuccess(`${this.saveText}`, {
                            duration: 2000
                        });
                        setTimeout(() => {}, 2000);
                        this.$router.push({
                            path: '/administrator/product/category'
                        });
                    })
                    .catch((err) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showError(
                            err &&
                                err.response &&
                                err.response.data &&
                                err.response.data.message
                                ? err.response.data.message
                                : err
                        );
                    });
            } else {
                this.$snackbar.global.showError(
                    `Fill in the required fields`
                );
            }
        }
    }
};
</script>
