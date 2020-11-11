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
        <div v-else class="main-container">
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
                <div>
                    <div class="n-input-label">Category Logo*</div>
                    <image-uploader-tile
                        label="Logo"
                        aspectRatio="1:1"
                        @delete="logo.value = ''"
                        @save="logo.value = $event"
                        v-model="logo.value"
                        :fileName="logo.value"
                        namespace="category-square-logo"
                    ></image-uploader-tile>
                    <nitrozen-error v-if="logo.showerror">{{
                        logo.errortext
                    }}</nitrozen-error>
                </div>
                <div>
                    <div class="n-input-label">Category Potrait</div>
                    <image-uploader-tile
                        label="Potrait Image"
                        aspectRatio="13:20"
                        @delete="banner = ''"
                        @save="banner = $event"
                        v-model="banner"
                        :fileName="banner"
                        namespace="category-portrait-banner"
                    ></image-uploader-tile>
                </div>
                <div>
                    <div class="n-input-label">Category Landscape</div>
                    <image-uploader-tile
                        label="Landscape Image"
                        aspectRatio="27:20"
                        @delete="landscape = ''"
                        @save="landscape = $event"
                        v-model="landscape"
                        :fileName="landscape"
                        namespace="category-landscape-banner"
                    ></image-uploader-tile>
                </div>
            </div>
            <div v-if="level.value === '3' || level.value === 3">
                <div class="row-2">
                    <nitrozen-dropdown
                        class="tryouts w-l"
                        label="Marketplaces"
                        :items="marketplaces.list"
                        v-model="marketplaces.value"
                        :required="false"
                        :multiple="false"
                        :searchable="false"
                    ></nitrozen-dropdown>
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
                <div>
                    <div
                        v-if="marketplaces.value.length"
                        class="extra-params-saperator"
                    ></div>
                    <div class="extra-params" v-if="marketplaces.value.length">
                        <!-- KEY -->
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
                            <!--     <nitrozen-error v-if="ep.key.showerror">
                    {{ ep.key.errortext }}
                </nitrozen-error> -->
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
                            <!--  <nitrozen-error v-if="ep.value.showerror">
                    {{ ep.value.errortext }}
                </nitrozen-error> -->
                        </div>
                        <div class="delete" @click="deleteMarketplace">
                            <adm-inline-svg src="delete"></adm-inline-svg>
                        </div>
                    </div>
                </div>
                <div class="n-input-label" v-if="hierarchy.length > 0">
                    Category Mapping
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
                                :items="levelList.one"
                                v-model="item['l1']"
                                :required="true"
                                :multiple="false"
                                :searchable="true"
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="item.showerrorl1"
                                >Level 1 required. Please select a
                                value</nitrozen-error
                            >
                        </div>
                        <div class="col-three child">
                            <nitrozen-dropdown
                                class="input w-l"
                                label="Level 2"
                                :items="levelList.two"
                                v-model="item['l2']"
                                :required="true"
                                :multiple="false"
                                :searchable="true"
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="item.showerrorl2"
                                >Level 2 required. Please select a
                                value</nitrozen-error
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
}
.extra-params-saperator {
    width: 49.5%;
    border-top: 1px dashed #e4e5e6;
    height: 1px;
    margin: 12px 0;
}
.extra-params {
    margin-bottom: 24px;
    width: 49.5%;
    display: flex;
    justify-content: space-between;
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
    name: 'create-update-department',
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
            errors: {},
            data: {
                level: ''
            },
            departmentsList: [], // department dropdown list list data
            hierarchy: [],
            departments: [], //  department dropdown list intitial data
            tryoutList: [
                { text: 'Eyebrow', value: 'Eyebrow' },
                { text: 'Lipstic', value: 'Lipstic' },
                { text: 'Eyeliner', value: 'Eyeliner' },
                { text: 'Blush', value: 'Blush' }
            ],
            tryouts: [],
            landscape: '',
            banner: '',
            saveText: 'Category saved successfully',
            headerText: 'Create Category',
            synonymText: '',
            priority: {
                value: '',
                showerror: false,
                errortext: 'Priority is required, Please enter a priority'
            },
            name: {
                value: '',
                showerror: false,
                errortext: 'Name is required, Please enter name'
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
                errortext: 'Level is required, Please select a level'
            },
            logo: {
                value: '',
                showerror: false,
                errortext: 'Logo is required, Please upload a logo'
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
                errortext: 'Department is required, Please select a department',
                mapping: []
            },
            synonym: {
                value: [],
                showerror: false,
                errortext: 'Synonyms are required, Please enter synonym'
            }
        };
    },
    methods: {
        async init() {
            const promiseArray = [CompanyService.fetchDepartments()];
            if (this.uid) {
                promiseArray.push(
                    CompanyService.fetchCategory_v2({ id: this.uid })
                );
            }
            this.levelChange(3)
                .then(() =>
                    Promise.all([promiseArray])
                        .then((data) => {
                            this.pageLoading = false;
                            data[0][0].then((res) => {
                                if (res.data.data.length) {
                                    this.departments = res.data.data;
                                    this.setDepartmentList();
                                    data[0][1].then((res) =>
                                        this.updateData(res.data.data[0])
                                    );
                                }
                            });
                        })
                        .catch((error) => {
                            this.pageLoading = false;
                            this.$snackbar.global.showError(
                                `${error.response.data.errors.error}`
                            );
                        })
                )
                .catch(() => (this.pageError = true));
        },
        removeItem(index, department) {
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
            this.initDepartment(list);
            this.updateHierarchy(list);
        },
        updateHierarchy(list, append = false) {
            if (list.length > this.hierarchy.length || append) {
                //added
                this.hierarchy.push({
                    department: list[list.length - 1],
                    l1: '',
                    l2: '',
                    showerrorl1: false,
                    showerrorl2: false
                });
            } else {
                const indexToRemove = this.hierarchy.findIndex(
                    (item) => !list.includes(item.department)
                );
                this.hierarchy.splice(indexToRemove, 1);
            }
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
                data.media && data.media.potrait ? data.media.potrait : '';
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
        levelChange(e) {
            if (e == 3) {
                if (
                    this.selectedDepartments.value &&
                    this.selectedDepartments.value.length
                ) {
                    this.hierarchy = [];
                    this.selectedDepartments.value.forEach((item) =>
                        this.updateHierarchy([item], true)
                    );
                }
                const params = {
                    level: [1, 2]
                };
                this.levelList.one = [];
                this.levelList.two = [];
                return new Promise((resolve, reject) => {
                    return CompanyService.fetchCategory_v2(params)
                        .then(({ data }) => {
                            if (data && data.data && data.data.length) {
                                data.data.forEach((item) => {
                                    if (item.level === 1) {
                                        this.levelList.one.push({
                                            text: item.name,
                                            value: item.uid
                                        });
                                    } else {
                                        this.levelList.two.push({
                                            text: item.name,
                                            value: item.uid
                                        });
                                    }
                                });
                            }
                            resolve('success');
                        })
                        .catch((err) => {
                            this.pageError = true;
                            reject(err);
                        });
                });
            }
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
                postdata['media'].potrait = this.banner;
            }
            if (this.landscape !== '') {
                postdata['media'].landscape = this.landscape;
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
                !hierarchyError
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
                    `Please fill in the required values`
                );
            }
        }
    }
};
</script>
