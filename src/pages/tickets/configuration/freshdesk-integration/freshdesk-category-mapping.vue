<template>
    <div class="panel">
        <div class="heading-container">
            <div class="heading-flex">
                <span class="sub-heading">Category Mapping</span>
                <p v-if="type === 'freshdesk'" class="decs">
                    Create category-levels of ticket types as defined by you in Freshdesk
                    </p>
                    <p v-else class="decs">
                        Create the categorisation of tickets based on the types of issues
                    </p>
            </div>
            <div class="btn-container">
                <nitrozen-button
                    v-if="!isIntegrated"
                    class="integrate-btn"
                    v-flat-btn
                    :rounded="false"
                    :theme="'secondary'"
                    @click="integrate()"
                >
                        Save Mapping
                </nitrozen-button>
            </div>
        </div>
        <div class="container">
            <div class="level-container">
                <div class="heading">
                    <div class="level_heading">
                        <span class="level-heading">LEVEL 1</span>
                    </div>
                    <div class="categoryList-container">
                        <div class="show-list">
                            <draggable v-model="categoryList">
                                <transition-group>
                                    <div
                                        v-for="(item, index) in categoryList"
                                        :key="`${index}`"
                                        class="list_category"
                                        :class="{
                                            active_list_category:
                                                selectedLevelOneindex === index
                                        }"
                                        @click="
                                            openLevelTwoCategory(item, index)
                                        "
                                    >
                                        <div class="item-container">
                                            <inline-svg
                                                class="drag-indicator"
                                                :src="'drag_indicator'"
                                            ></inline-svg>
                                            <div class="add-category">
                                                <nitrozen-input
                                                    class="title"
                                                    v-model="item.display"
                                                    :maxlength="50"
                                                    @blur="
                                                        editCategory(
                                                            item,
                                                            level[0]
                                                        )
                                                    "
                                                    @focus="
                                                        openLevelTwoCategory(
                                                            item,
                                                            index
                                                        )
                                                    "
                                                    @keyup.enter="
                                                        editCategory(
                                                            item,
                                                            level[0]
                                                        )
                                                    "
                                                    @click.stop="() => true"
                                                ></nitrozen-input>
                                            </div>
                                            <div
                                                class="delete-category"
                                                @click.stop="
                                                    deleteConfirmation(
                                                        item.key,
                                                        level[0]
                                                    )
                                                "
                                            >
                                                <inline-svg
                                                    class="delete_category"
                                                    :src="'delete'"
                                                ></inline-svg>
                                            </div>
                                        </div>
                                        <div
                                            v-if="type === Integration_type"
                                            class="group-container"
                                        >
                                            <inline-svg
                                                v-if="!item.group_id"
                                                class="warning-icon"
                                                :src="'red-warning-icon'"
                                            ></inline-svg>
                                            <span class="group-label"
                                                >Group ID</span
                                            >
                                            <div
                                                class="group-dropdown"
                                                :class="{
                                                    closedDropdown:
                                                        item.key ===
                                                        checkGroupID
                                                }"
                                                @click.stop="
                                                    showGroup(item.key)
                                                "
                                            >
                                                <inline-svg
                                                    class="dropdown"
                                                    :src="
                                                        'arrow-dropdown-black'
                                                    "
                                                ></inline-svg>
                                            </div>
                                        </div>
                                        <div
                                            v-if="type === Integration_type"
                                            class="group-input-box"
                                        >
                                            <nitrozen-input
                                                v-if="item.key === checkGroupID"
                                                class="group_id_input"
                                                v-model="item.group_id"
                                                :maxlength="50"
                                                @blur="
                                                    editCategory(item, level[0])
                                                "
                                                @focus="
                                                    openLevelTwoCategory(
                                                        item,
                                                        index
                                                    )
                                                "
                                                @keyup.enter="
                                                    editCategory(item, level[0])
                                                "
                                                @click.stop="() => true"
                                            ></nitrozen-input>
                                            <nitrozen-error
                                                class="error"
                                                :style="{
                                                    visibility:
                                                        item.group_id &&
                                                        !validateGroupID(
                                                            item.group_id
                                                        )
                                                            ? 'visible'
                                                            : 'hidden',
                                                    display: 'flex'
                                                }"
                                                ><inline-svg
                                                    class="groupId-warning-icon"
                                                    :src="'red-warning-icon'"
                                                ></inline-svg
                                                >{{
                                                    'Enter only numeric values'
                                                }}</nitrozen-error
                                            >
                                        </div>
                                    </div>
                                </transition-group>
                            </draggable>
                        </div>
                        <div class="show-list">
                            <div class="list_category">
                                <!-- @click="openLevelTwoCategory()" -->
                                <div class="item-container">
                                    <inline-svg
                                        class="drag-indicator"
                                        :src="'drag_indicator'"
                                    ></inline-svg>
                                    <div class="add-category">
                                        <nitrozen-input
                                            class="title"
                                            v-model="levelOneDisplay"
                                            :maxlength="50"
                                            @blur="addCategory(level[0])"
                                            @focus="
                                                openLevelTwoCategory(
                                                    item,
                                                    index
                                                )
                                            "
                                            @keyup.enter="addCategory(level[0])"
                                            @click.stop="() => true"
                                        ></nitrozen-input>
                                    </div>

                                    <inline-svg
                                        class="delete-category"
                                        :src="'delete'"
                                        @click.stop="deleteCategory()"
                                    ></inline-svg>
                                </div>
                                <div
                                    v-if="type === Integration_type"
                                    class="group-container"
                                >
                                    <span class="group-label">Group Id</span>
                                    <div
                                        class="group-dropdown"
                                        @click.stop="
                                            () =>
                                                (showGroupDropdown = !showGroupDropdown)
                                        "
                                    >
                                        <inline-svg
                                            class="dropdown"
                                            :class="{
                                                closedDropdown: showGroupDropdown
                                            }"
                                            :src="'arrow-dropdown-black'"
                                        ></inline-svg>
                                    </div>
                                </div>
                                <div
                                    v-if="type === Integration_type"
                                    class="group-input-box"
                                >
                                    <nitrozen-input
                                        v-if="showGroupDropdown"
                                        class="group_id_input"
                                        :maxlength="50"
                                        v-model="LevelOneGroupID"
                                        @click.stop="() => true"
                                    ></nitrozen-input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="heading">
                    <div class="level_heading">
                        <span class="level-heading">LEVEL 2</span>
                    </div>
                    <div class="categoryList-container">
                        <div class="show-list">
                            <draggable>
                                <transition-group>
                                    <div
                                        v-for="(item,
                                        index) in levelTwoCategoryList"
                                        :key="`${index}`"
                                        class="list_category"
                                        :class="{
                                            active_list_category:
                                                selectedLevelTwoindex === index
                                        }"
                                        @click="
                                            openLevelThreeCategory(item, index)
                                        "
                                    >
                                        <div class="item-container">
                                            <inline-svg
                                                class="drag-indicator"
                                                :src="'drag_indicator'"
                                            ></inline-svg>
                                            <div class="add-category">
                                                <nitrozen-input
                                                    class="title"
                                                    v-model="item.display"
                                                    :maxlength="50"
                                                    @blur="
                                                        editCategory(
                                                            item,
                                                            level[1]
                                                        )
                                                    "
                                                    @focus="
                                                        openLevelThreeCategory(
                                                            item,
                                                            index
                                                        )
                                                    "
                                                    @keyup.enter="
                                                        editCategory(
                                                            item,
                                                            level[1]
                                                        )
                                                    "
                                                    @click.stop="() => true"
                                                ></nitrozen-input>
                                            </div>
                                            <div
                                                class="delete-category"
                                                @click.stop="
                                                    deleteConfirmation(
                                                        item.key,
                                                        level[1]
                                                    )
                                                "
                                            >
                                                <inline-svg
                                                    class="delete_category"
                                                    :src="'delete'"
                                                ></inline-svg>
                                            </div>
                                        </div>
                                    </div>
                                </transition-group>
                            </draggable>
                        </div>
                        <div
                            v-if="enabledLevelTwoToAddCategory"
                            class="show-list"
                        >
                            <div class="list_category">
                                <!-- @click="openLevelThreeCategory()" -->
                                <div class="item-container">
                                    <inline-svg
                                        class="drag-indicator"
                                        :src="'drag_indicator'"
                                    ></inline-svg>
                                    <div class="add-category">
                                        <nitrozen-input
                                            class="title"
                                            v-model="levelTwoDisplay"
                                            :maxlength="50"
                                            @blur="addCategory(level[1])"
                                            @focus="
                                                openLevelThreeCategory(
                                                    item,
                                                    index
                                                )
                                            "
                                            @keyup.enter="addCategory(level[1])"
                                            @click.stop="() => true"
                                        ></nitrozen-input>
                                    </div>

                                    <inline-svg
                                        class="delete-category"
                                        :src="'delete'"
                                        @click.stop="deleteCategory()"
                                    ></inline-svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="heading">
                    <div class="level_heading">
                        <span class="level-heading">LEVEL 3</span>
                    </div>
                    <div class="categoryList-container">
                        <div class="show-list">
                            <draggable>
                                <transition-group>
                                    <div
                                        v-for="(item,
                                        index) in levelThreeCategoryList"
                                        :key="`${index}`"
                                        class="list_category"
                                    >
                                        <!-- @click="openLevelThreeCategory(item)" -->
                                        <div class="item-container">
                                            <inline-svg
                                                class="drag-indicator"
                                                :src="'drag_indicator'"
                                            ></inline-svg>
                                            <div class="add-category">
                                                <nitrozen-input
                                                    class="title"
                                                    v-model="item.display"
                                                    :maxlength="50"
                                                    @blur="
                                                        editCategory(
                                                            item,
                                                            level[2]
                                                        )
                                                    "
                                                    @keyup.enter="
                                                        editCategory(
                                                            item,
                                                            level[2]
                                                        )
                                                    "
                                                    @click.stop="() => true"
                                                ></nitrozen-input>
                                            </div>
                                            <div
                                                class="delete-category"
                                                @click.stop="
                                                    deleteConfirmation(
                                                        item.key,
                                                        level[2]
                                                    )
                                                "
                                            >
                                                <inline-svg
                                                    class="delete_category"
                                                    :src="'delete'"
                                                ></inline-svg>
                                            </div>
                                        </div>
                                    </div>
                                </transition-group>
                            </draggable>
                        </div>
                        <div
                            v-if="enabledLevelThreeToAddCategory"
                            class="show-list"
                        >
                            <div class="list_category">
                                <!-- @click="openLevelThreeCategory()" -->
                                <div class="item-container">
                                    <inline-svg
                                        class="drag-indicator"
                                        :src="'drag_indicator'"
                                    ></inline-svg>
                                    <div class="add-category">
                                        <nitrozen-input
                                            class="title"
                                            v-model="levelThreeDisplay"
                                            :maxlength="50"
                                            @blur="addCategory(level[2])"
                                            @keyup.enter="addCategory(level[2])"
                                            @click.stop="() => true"
                                        ></nitrozen-input>
                                    </div>

                                    <inline-svg
                                        class="delete-category"
                                        :src="'delete'"
                                        @click.stop="deleteCategory()"
                                    ></inline-svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <pop-up
                v-if="warningPopUp"
                :infoText="popupDecs"
                :textHeading="popupHeading"
                @cancel="warningPopUp = !warningPopUp"
                @confirm="confirmPopUp"
            />
    </div>
</template>

<script>
import { PageHeader } from '@/components/common';
import PopUp from '../common/PopUp.vue';
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SupportService from '../../../../services/support.service';
// import { freshdesk } from '../../../../auto_gen/svgs';
import draggable from 'vuedraggable';

export default {
    name: 'Freshdesk_Category_Mapping',
    props: ['type', 'id', 'categoryList'],

    components: {
        PageHeader,
        NitrozenButton,
        NitrozenInput,
        'inline-svg': inlineSvgVue,
        'pop-up': PopUp,
        draggable,
        'nitrozen-error': NitrozenError
    },

    data() {
        return {
            step: 'Category_Mapping',
            level: ['levelOne', 'levelTwo', 'levelThree'],
            leveltwoCategory: [],
            levelThreeCategory: [],
            isIntegrated: false,
            warningPopUp: false,
            link:
                'https://stagingreliance.kapturecrm.com/add-ticket-from-other',
            showStatus: false,
            level_one_selected_category: {},
            levelTwoCategoryList: [],
            levelThreeCategoryList: [],
            level_two_selected_category: {},
            showGroupID: false,
            showGroupDropdown: false,
            groupID: '',
            checkGroupID: '',
            levelOneDisplay: '',
            levelTwoDisplay: '',
            levelThreeDisplay: '',
            key: '',
            sub_categories: [],
            LevelOneGroupID: '',
            enabledLevelTwoToAddCategory: true,
            enabledLevelThreeToAddCategory: true,
            selectedLevelOneindex: 0,
            selectedLevelTwoindex: 0,
            Integration_type: 'freshdesk',
            isCategoryDuplicate: false,
            deleteSelectedCategory:'',
            deletedCategoryFromLevel:'',
            item:{},
            groupIdAbsent:false,
            index:'',        };
    },
    mounted() {
        if (this.categoryList.length) {
            this.categoryList = this.categoryList.map((item) => { 
                if (item.group_id === null) { item.group_id = ''; } 
                return item; 
            });
            this.categoryList[0].sub_categories.length
                ? (this.levelTwoCategoryList = this.categoryList[0].sub_categories)
                : (this.levelTwoCategoryList = []);

            this.level_one_selected_category = this.categoryList[0];
            if (this.categoryList[0].sub_categories.length) {
                this.categoryList[0].sub_categories[0].sub_categories.length
                    ? (this.levelThreeCategoryList = this.categoryList[0].sub_categories[0].sub_categories)
                    : (this.levelThreeCategoryList = []);

                this.level_two_selected_category = this.categoryList[0].sub_categories[0];
            }
        }
    },
    methods: {
        validateGroupID(groupId) {
            const id = groupId.toString()
            const re = /^[0-9]*$/;
            return id && id.length && re.test(id.trim());
        },
        addCategory(level) {
            this.switchToLevel(level);
            // this.updateCategory();
            this.resetValues();
        },
        switchToLevel(level) {
            switch (level) {
                case 'levelOne':
                    if (!this.levelOneDisplay) {
                        return;
                    }
                    this.duplicateCategory(
                        this.categoryList,
                        this.levelOneDisplay
                    );
                    if (this.isCategoryDuplicate) {
                        this.isCategoryDuplicate = false;
                        return this.$snackbar.global.showError(
                            'Category already exist'
                        );
                    }
                    let levelOnepayload = this.createPayload(
                        this.levelOneDisplay
                    );
                    this.categoryList.push(levelOnepayload);
                    this.levelTwoCategoryList = [];
                    this.enabledLevelTwoToAddCategory = false;
                    this.enabledLevelThreeToAddCategory = false;
                    break;
                case 'levelTwo':
                    if (!this.levelTwoDisplay) {
                        return;
                    }
                    let levelTwopayload = this.createPayload(
                        this.levelTwoDisplay
                    );

                    let updatelevelTwoCategoryList = this.categoryList.map(
                        (item) => {
                            if (
                                item.key ===
                                this.level_one_selected_category.key
                            ) {
                                this.duplicateCategory(
                                    item.sub_categories,
                                    this.levelTwoDisplay
                                );
                                if (this.isCategoryDuplicate) {
                                    this.isCategoryDuplicate = false;
                                    return this.$snackbar.global.showError(
                                        'Category already exist'
                                    );
                                }
                                item.sub_categories.push(levelTwopayload);
                            }
                        }
                    );
                    this.levelThreeCategoryList = [];
                    this.enabledLevelTwoToAddCategory = true;
                    this.enabledLevelThreeToAddCategory = false;
                    break;
                case 'levelThree':
                    if (!this.levelThreeDisplay) {
                        return;
                    }
                    let levelThreepayload = this.createPayload(
                        this.levelThreeDisplay
                    );

                    let updatelevelThreeCategoryList = this.categoryList.map(
                        (item) => {
                            if (
                                item.key ===
                                this.level_one_selected_category.key
                            ) {
                                item.sub_categories.map((item) => {
                                    if (
                                        item.key ===
                                        this.level_two_selected_category.key
                                    ) {
                                        this.duplicateCategory(
                                            item.sub_categories,
                                            this.levelThreeDisplay
                                        );
                                        if (this.isCategoryDuplicate) {
                                            this.isCategoryDuplicate = false;
                                            return this.$snackbar.global.showError(
                                                'Category already exist'
                                            );
                                        }
                                        item.sub_categories.push(
                                            levelThreepayload
                                        );
                                    }
                                });
                            }
                        }
                    );
                    break;
            }
        },
        editCategory(category, categoryLevel) {
            if (categoryLevel === 'levelThree') {
                let editCategory = this.levelThreeCategoryList.map((item) => {
                    if (item.key === category.key) {
                        let slug = category.display.toLowerCase();
                        slug = slug.replace(/\s*$/g, '');
                        slug = slug.replace(/\s+/g, '_');
                        item.key = slug;
                        (item.display = category.display),
                            (item.sub_categories = category.sub_categories),
                            (item.group_id = category.group_id);
                    }
                });
            } else if (categoryLevel === 'levelTwo') {
                let editCategory = this.levelTwoCategoryList.map((item) => {
                    if (item.key === category.key) {
                        let slug = category.display.toLowerCase();
                        slug = slug.replace(/\s*$/g, '');
                        slug = slug.replace(/\s+/g, '_');
                        item.key = slug;
                        (item.display = category.display),
                            (item.sub_categories = category.sub_categories),
                            (item.group_id = category.group_id);
                    }
                });
            } else if (categoryLevel === 'levelOne') {
                let editCategory = this.categoryList.map((item) => {
                    if (item.key === category.key) {
                        let slug = category.display.toLowerCase();
                        slug = slug.replace(/\s*$/g, '');
                        slug = slug.replace(/\s+/g, '_');
                        item.key = slug;
                        (item.display = category.display),
                            (item.sub_categories = category.sub_categories),
                            (item.group_id = category.group_id);
                    }
                });
            }
            // this.updateCategory();
        },
        duplicateCategory(categoryList, display) {
            const checkDuplicate = categoryList.map((item) => {
                if (item.display === display) {
                    this.isCategoryDuplicate = true;
                }
            });
        },
        createPayload(display) {
            let slug = display.toLowerCase();
            // Trim the last whitespace
            slug = slug.replace(/\s*$/g, '');
            // Change whitespace to "-"
            slug = slug.replace(/\s+/g, '_');
            
            if (this.type === 'freshdesk') {
                let category = {
                    display: display,
                    key: slug,
                    sub_categories: [],
                    group_id: this.LevelOneGroupID
                };
                return category;
            }
            let category = {
                display: display,
                key: slug,
                sub_categories: []
                // group_id: this.LevelOneGroupID
            };
            return category;
        },
        resetValues() {
            this.levelOneDisplay = '';
            this.levelTwoDisplay = '';
            this.levelThreeDisplay = '';
            this.LevelOneGroupID = '';
        },
        showGroup(key) {
            key === this.checkGroupID
                ? (this.checkGroupID = '')
                : (this.checkGroupID = key);
        },
        deleteCategory(key, categoryLevel) {
            if (categoryLevel === 'levelThree') {
                let deleteCategory = this.levelThreeCategoryList.map((item) => {
                    if (item.key === key) {
                        this.levelThreeCategoryList.splice(
                            this.levelThreeCategoryList.findIndex(
                                (item) => item.key === key
                            ),
                            1
                        );
                    }
                });
            } else if (categoryLevel === 'levelTwo') {
                let deleteCategory = this.levelTwoCategoryList.map((item) => {
                    if (item.key === key) {
                        this.levelTwoCategoryList.splice(
                            this.levelTwoCategoryList.findIndex(
                                (item) => item.key === key
                            ),
                            1
                        );
                        this.levelThreeCategoryList = [];
                    }
                });
            } else if (categoryLevel === 'levelOne') {
                let deleteCategory = this.categoryList.map((item) => {
                    if (item.key === key) {
                        this.categoryList.splice(
                            this.categoryList.findIndex(
                                (item) => item.key === key
                            ),
                            1
                        );
                        this.levelTwoCategoryList = [];
                        this.levelThreeCategoryList = [];
                    }
                });
            }
            // this.updateCategory();
        },
        // async updateCategory() {
        //     let body = {
        //         category_data: {
        //             list: this.categoryList
        //         },
        //         config_completed: true
        //     };
        //     if (this.id) {
        //         return await SupportService.updateIntegrationDetails(
        //             body,
        //             this.type
        //         )
        //             .then((response) => {})
        //             .catch((err) => {
        //                 this.$snackbar.global.showError(
        //                     `Fail to update ${this.type} details`
        //                 );
        //             });
        //     }
        //     return await SupportService.createIntegration(body, this.type)
        //         .then((response) => {
        //             this.id = response.data.items._id;
        //             // this.isIntegrated = true;
        //             // this.$emit('integration', this.isIntegrated, this.step);
        //         })
        //         .catch((err) => {
        //             this.$snackbar.global.showError(
        //                 `Fail to create ${this.type}`
        //             );
        //         });
        // },
        async integrate() {
            if (!this.categoryList.length)
                return this.$snackbar.global.showError('Please provide category');
            this.groupIdAbsent = this.categoryList.some(item => !item.group_id);
            if(this.groupIdAbsent){
                return this.$snackbar.global.showError('Please provide group ID')
            }
            let body = {
                category_data: {
                    list: this.categoryList
                },
                config_completed: true
            };

            if (this.id) {
                return await SupportService.updateIntegrationDetails(
                    body,
                    this.type
                )
                    .then((response) => {
                        this.isIntegrated = true;
                        this.$emit('integration', this.isIntegrated, this.step);
                        this.$emit('updatedData', response);
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(
                            `Fail to update ${this.type} details`
                        );
                    });
            }

            return await SupportService.createIntegration(body, this.type)
                .then((response) => {
                    this.id = response.data._id;
                    this.isIntegrated = true;
                    this.$emit('integration', this.isIntegrated, this.step);
                    this.$emit('updatedData', response);
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Fail to create ${this.type}`
                    );
                });
        },
        deleteConfirmation(key, categoryLevel) {
            this.deleteSelectedCategory = key
            this.deletedCategoryFromLevel = categoryLevel
            this.warningPopUp = true;
            this.popupHeading = `Are you sure?`;
            this.popupDecs = `You are trying to delete to support category?
            This action will remove the current category and all downward branches.`;
        },
        confirmPopUp() {
            this.deleteCategory(this.deleteSelectedCategory, this.deletedCategoryFromLevel)
            this.warningPopUp = false;
            this.resetValue()
        },
        resetValue(){
            this.deleteSelectedCategory = ''
            this.deletedCategoryFromLevel = ''
        },
        openLevelTwoCategory(item, index) {
            this.selectedLevelOneindex = index;
            this.selectedLevelTwoindex = '';
            this.enabledLevelTwoToAddCategory = true;
            this.enabledLevelThreeToAddCategory = false;
            this.level_one_selected_category = item;
            this.levelThreeCategoryList = [];
            this.levelTwoCategoryList = (item && item.sub_categories) ? item.sub_categories : [];
        },
        openLevelThreeCategory(item, index) {
            this.selectedLevelTwoindex = index;
            this.enabledLevelThreeToAddCategory = true;
            this.level_two_selected_category = item;
            this.levelThreeCategoryList = (item && item.sub_categories) ? item.sub_categories : [];
        }
    }
};
</script>

<style lang="less" scoped>
.container {
    margin-top: 24px;
    .heading-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .heading-flex {
            .sub-heading {
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 600;
                font-size: 16px;
                line-height: 140%;
                color: #41434c;
            }
            .decs {
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 20px;
                color: #9b9b9b;
            }
        }
        .btn-container {
        }
    }
    .level-container {
        width: 100%;
        display: grid;
        gap: 24px;
        grid-template-columns: 1fr 1fr 1fr;

        .heading {
            .level_heading {
                padding: 8px 16px;
                box-sizing: border-box;
                border: 1px solid #e0e0e0;
                background: #f8f8f8;
                border-radius: 4px;
            }
            .categoryList-container {
                position: relative;
                height: 50vh;
                overflow: auto;
            }
            .show-list {
                .list_category {
                    border: 1px solid #e0e0e0;
                    border-radius: 2px;
                    .item-container {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0px 10px 8px 4px;
                        .add-category {
                            margin-left: 4px;
                            margin-right: 10px;
                        }
                        .delete-category {
                            cursor: pointer;
                        }
                    }
                    .group-container {
                        display: flex;
                        align-items: center;
                        padding: 0px 10px 0px 20px;
                        .group-label {
                            margin-left: 13px;
                            font-family: Inter, sans-serif;
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 160%;
                            color: #41434c;
                        }
                        .dropdown {
                            cursor: pointer;
                        }
                        .closedDropdown {
                            cursor: pointer;
                            transform: rotate(180deg);
                        }
                    }
                    .group-input-box {
                        margin: 0px 40px 8px 32px;
                        .groupID-error {
                            margin-top: 4px;
                            display: flex;
                            .error-message {
                                margin-left: 8px;
                            }
                        }
                    }
                }
                .active_list_category {
                    background: #f0f4ff;
                }
            }
        }
    }
}

.btn-container {
    // margin-top: 24px;
    display: flex;
    justify-content: flex-end;
}
.groupId-warning-icon {
    margin-right: 8px;
}
::v-deep .n-input-label-container {
    display: none;
}
</style>
