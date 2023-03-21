<template>
    <div>
        <div v-if="!isCategoryMappingSync" class="container">
            <div class="heading-container">
                <div class="heading">
                    <span class="sub-heading">Category Mapping API</span>
                    <p class="decs">
                        This links the category-levels of ticket types defined
                        in Kapture, with the Platform
                    </p>
                </div>
                <div class="btn-container">
                    <nitrozen-button
                        v-if="!isIntegrated"
                        class="integrate-btn"
                        v-flat-btn
                        :rounded="false"
                        :theme="'secondary'"
                        :disabled="isIntegrationDisable"
                        @click="integrate()"
                    >
                        Integrate
                    </nitrozen-button>
                    <nitrozen-button
                        v-if="isReconfigure"
                        class="reconfigure-btn"
                        v-stroke-btn
                        :rounded="false"
                        :theme="'secondary'"
                        :disabled="false"
                        @click="reconfigure()"
                    >
                        Reconfigure
                    </nitrozen-button>
                </div>
            </div>
            <div class="url-field">
                <div class="link-container">
                    <div class="link-icon">
                        <inline-svg :src="'link_icon'"></inline-svg>
                        <span class="link">{{ link }}</span>
                    </div>
                </div>
                <div
                    class="sync-status-container"
                    v-if="isReconfigure || showStatus"
                >
                    <div class="indicator-container">
                        <div class="left-sync-status-container">
                            <inline-svg :src="'done-indicator'"></inline-svg>
                            <div class="status">
                                <span class="status-label">Status</span>
                                <span class="state">Completed</span>
                            </div>
                        </div>
                        <div class="right-sync-status-container">
                            <div class="refresh" @click="sync()">
                                <inline-svg :src="'refresh'"></inline-svg>
                                <span class="refresh-label">Refresh</span>
                            </div>
                            <span class="last-sync-decs"
                                >Last synced at 23 Jan 2022</span
                            >
                        </div>
                    </div>
                    <div class="sync-status-decs">
                        <span class="decs"
                            >All the categories has been sycned from
                            Kapture</span
                        >
                    </div>
                </div>
                <nitrozen-input
                    class="api-key"
                    label="API Key*"
                    v-model="categorySyncApikey"
                ></nitrozen-input>
            </div>
            <div class="sync-container" v-if="!isReconfigure && !showStatus">
                <div class="sync-sub-container">
                    <inline-svg :src="'warning'"></inline-svg>
                    <span class="sync-decs"
                        >In order to integrate, the categories must be
                        synced</span
                    >
                </div>
                <div class="sync-btn">
                    <span @click="sync()">Sync</span>
                </div>
            </div>
            <div
                class="category-container"
                v-if="isReconfigure || showStatus"
                @click="categories()"
            >
                <div class="category-sub-container">
                    <span class="category-label">Categories Mapping</span>
                    <span class="category-decs">1 line of description</span>
                </div>
                <inline-svg :src="'arrow-right-black'"></inline-svg>
            </div>
            <pop-up
                v-if="warningPopUp"
                :infoText="popupDecs"
                :textHeading="popupHeading"
                @cancel="warningPopUp = !warningPopUp"
                @confirm="confirmPopUp"
            />
        </div>
        <div v-if="isCategoryMappingSync" class="sync-data-conatiner">
            <div class="sync-data-conatiner right">
                <div class="categoryHeader">
                    <span class="title">Categories Mapping</span>
                    <div class="close-btn" @click="closeSyncCategory()">
                        <inline-svg
                            class="close-btn-svg"
                            :src="'cross-black'"
                        ></inline-svg>
                    </div>
                </div>
                <div class="categoryLevel-container">
                    <div class="categoryLevel-sub-container">
                        <div class="level-container">
                            <div class="level">
                                <span class="levelTitle">LEVEL 1</span>
                            </div>
                        </div>
                        <div class="show-list">
                            <div
                                v-for="(item, index) in categoryList"
                                :key="index"
                                class="list_category"
                                :class="{
                                    active_list_category:
                                        selectedLevelOneindex === index
                                }"
                                @click="openLevelTwoCategory(item, index)"
                            >
                                {{ item.display }}
                            </div>
                        </div>
                    </div>
                    <div class="categoryLevel-sub-container">
                        <div class="level-container">
                            <div class="level">
                                <span class="levelTitle">LEVEL 2</span>
                            </div>
                        </div>
                        <div class="show-list">
                            <div
                                v-for="(item, index) in leveltwoCategory"
                                :key="index"
                                class="list_category"
                                :class="{
                                    active_list_category:
                                        selectedLevelTwoindex === index
                                }"
                                @click="openLevelThreeCategory(item, index)"
                            >
                                {{ item.display }}
                            </div>
                        </div>
                    </div>
                    <div class="categoryLevel-sub-container">
                        <div class="level-container">
                            <div class="level">
                                <span class="levelTitle">LEVEL 3</span>
                            </div>
                        </div>
                        <div class="show-list">
                            <div
                                v-for="(item, index) in levelThreeCategory"
                                :key="index"
                                class="list_category"
                                @click="
                                    () => {
                                        closeSyncCategory();
                                    }
                                "
                            >
                                {{ item.display }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sync-data-conatiner left"></div>
        </div>
    </div>
</template>

<script>
import { PageHeader } from '@/components/common';
import PopUp from '../common/PopUp.vue';
import { NitrozenButton, NitrozenInput } from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SupportService from '../../../../services/support.service';

export default {
    name: 'Category_Mapping',
    props: ['type', 'categorySyncApikey', 'categoryData', 'isReconfigure'],

    components: {
        PageHeader,
        NitrozenButton,
        NitrozenInput,
        'inline-svg': inlineSvgVue,
        'pop-up': PopUp
    },

    data() {
        return {
            step: 'Category_Mapping',
            categoryList: [],
            leveltwoCategory: [],
            levelThreeCategory: [],
            isIntegrationDisable: true,
            isReconfigure: false,
            isIntegrated: false,
            warningPopUp: false,
            isCategoryMappingSync: false,
            link:
                'https://stagingreliance.kapturecrm.com/add-ticket-from-other',
            showStatus: false,
            level_one_selected_category: {},
            level_two_selected_category: {},
            selectedLevelOneindex: 0,
            selectedLevelTwoindex: 0
        };
    },
    async mounted() {
        if (this.isReconfigure) {
            this.isIntegrated = true;
            await this.sync();
            this.showStatus = false;
        }
    },
    methods: {
        async integrate() {
            if (!this.categorySyncApikey && !this.category_data)
                return this.$snackbar.global.showError('Invalid details');
            let body = {
                category_sync_apikey: this.categorySyncApikey,
                category_data: {
                    list: [this.categoryData]
                },
                config_completed: true
            };
            await SupportService.updateIntegrationDetails(body, this.type)
                .then((response) => {
                    this.isIntegrated = true;
                    this.$emit('integration', this.isIntegrated, this.step);
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        'Fail to update kapture details'
                    );
                });
        },
        reconfigure() {
            this.warningPopUp = true;
            this.popupHeading = `Are you sure?`;
            this.popupDecs = `It is a working pipeline with Kapture. If you update the configuration, It may affect the integration.`;
        },
        confirmPopUp() {
            this.warningPopUp = false;
            this.isReconfigure = false;
            this.isIntegrated = false;
        },
        async sync() {
            await SupportService.categorySync(this.type)
                .then((response) => {
                    this.categoryList = response.data.items;
                    this.categoryData = response.data.items;
                    this.showStatus = true;
                    this.isIntegrationDisable = false;

                    this.categoryList[0].sub_categories.length
                        ? (this.leveltwoCategory = this.categoryList[0].sub_categories)
                        : (this.leveltwoCategory = []);
                    this.categoryList[0].sub_categories[0].sub_categories.length
                        ? (this.levelThreeCategory = this.categoryList[0].sub_categories[0].sub_categories)
                        : (this.levelThreeCategory = []);
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to sync category');
                });
        },
        categories() {
            this.isCategoryMappingSync = true;
        },
        closeSyncCategory() {
            this.isCategoryMappingSync = false;
        },
        openLevelTwoCategory(item, index) {
            this.selectedLevelOneindex = index;
            this.selectedLevelTwoindex = '';
            this.levelThreeCategory = [];
            this.leveltwoCategory = item.sub_categories;
        },
        openLevelThreeCategory(item, index) {
            this.selectedLevelTwoindex = index;
            this.levelThreeCategory = item.sub_categories;
        }
    }
};
</script>

<style lang="less" scoped>
.container {
    .heading-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .heading {
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
    .url-field {
        margin-top: 16px;
        .link-container {
            display: flex;
            margin-top: 16px;
            .link-icon {
                display: flex;
                align-items: center;
            }
            .link {
                margin-left: 8px;
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 24px;
                color: #9b9b9b;
            }
        }
        .sync-status-container {
            margin-top: 24px;
            padding: 28px 14px 18px;
            border-radius: 12px;
            background: #f8f8f8;
            .indicator-container {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #e0e0e0;
                padding: 0px 0px 18px;
                .left-sync-status-container {
                    display: flex;
                    .status {
                        margin-left: 14px;
                        display: flex;
                        flex-direction: column;
                        .status-label {
                            font-family: Inter, sans-serif;
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 20px;
                            color: #9b9b9b;
                        }
                        .state {
                            font-family: Inter, sans-serif;
                            font-style: normal;
                            font-weight: 600;
                            font-size: 16px;
                            line-height: 140%;
                            color: #41434c;
                        }
                    }
                }
                .right-sync-status-container {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    .refresh {
                        display: flex;
                        color: #2e31be;
                        margin-bottom: 8px;
                        cursor: pointer;
                        .refresh-label {
                            margin-left: 5px;
                        }
                    }
                    .last-sync-decs {
                        font-family: Inter, sans-serif;
                        font-style: normal;
                        font-weight: 400;
                        font-size: 12px;
                        line-height: 140%;
                        color: #828282;
                    }
                }
            }
            .sync-status-decs {
                margin-top: 17px;
                .decs {
                    font-family: Inter, sans-serif;
                    font-style: normal;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 22px;
                    color: #666666;
                }
            }
        }
    }

    .api-key {
        margin-top: 24px;
    }

    .sync-container {
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
        background: #e7eeff;
        border-radius: 4px;
        padding: 12px;
        .sync-sub-container {
            display: flex;
            .sync-decs {
                display: flex;
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 160%;
                color: #1f1f1f;
                align-items: center;
                margin-left: 12px;
            }
        }
        .sync-btn {
            display: flex;
            font-family: Inter, sans-serif;
            margin-right: 12px;
            font-style: normal;
            font-weight: 700;
            font-size: 12px;
            line-height: 140%;
            color: #2e31be;
            align-items: center;
            cursor: pointer;
        }
    }
    .category-container {
        margin-top: 24px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px 24px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        .category-sub-container {
            display: flex;
            flex-direction: column;
            .category-label {
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 600;
                font-size: 16px;
                line-height: 140%;
                color: #41434c;
            }
            .category-decs {
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 20px;
                color: #9b9b9b;
            }
        }
    }
}
.sync-data-conatiner {
    height: 100%;
    width: 100%;
    z-index: 13;
    position: fixed;
    top: 0;
    .right {
        right: 0;
        z-index: 14;
        width: 65%;
        background: #ffffff;
        .categoryHeader {
            display: flex;
            padding: 24px 24px 27px;
            justify-content: space-between;
            align-items: center;
            .title {
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 700;
                font-size: 20px;
                line-height: 31px;
                color: #41434c;
            }
            .close-btn {
                cursor: pointer;
            }
            .categoryHeader {
                border-bottom: 1px solid #e0e0e0;
            }
        }
        .categoryLevel-container {
            padding: 24px;
            display: grid;
            gap: 27px;
            grid-template-columns: 1fr 1fr 1fr;
            .categoryLevel-sub-container {
                .level-container {
                    display: flex;
                    justify-content: space-between;
                    .level {
                        padding: 8px 16px;
                        width: 100%;
                        background: #f8f8f8;
                        border: 1px solid black;
                    }
                }
                .show-list {
                    .list_category {
                        padding: 12px 16px;
                        // width: 76%;
                        cursor: pointer;
                        border: 1px solid #e0e0e0;
                    }
                    .active_list_category {
                        background: #f0f4ff;
                    }
                }
            }
        }
    }
    .left {
        left: 0;
        background-color: rgba(0, 0, 0, 0.7);
    }
}
</style>
