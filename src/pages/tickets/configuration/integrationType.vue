<template>
    <div class="panel">
        <page-header
            title="Choose Integration Type"
            @backClick="
                $router.push({
                    path: '/administrator/support/category-listing',
                })
            "
        >
        </page-header>
        <div class="container">
            <div class="left-section">
                <div v-if="type.length" class="category">
                    <div
                        v-for="(item, index) in type"
                        v-bind:key="index"
                        class="category-list"
                        @click="selectedItem(index)"
                    >
                        <div class="card">
                            <div class="card-logo">
                                <inline-svg
                                    v-if="item.logo && item.logo.svg"
                                    :src="'' + item.logo.svg"
                                ></inline-svg>
                            </div>
                            <div class="card-content">
                                <span v-if="item.name" class="item-name">{{
                                    item.name
                                }}</span>
                                <span v-if="item.description" class="item-decs">
                                    {{ item.description }}
                                </span>
                            </div>
                        </div>
                        <div class="selected-action-radio-group">
                            <nitrozen-radio
                                name="selectedAction"
                                v-model="item.value"
                                :radioValue="item.value"
                            >
                            </nitrozen-radio>
                        </div>
                        <!-- <div class="card-content-section">
                            <span class="category-name">{{ item.name }}</span>
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="right-section">
                <div class="learning-links">
                    <div class="ll-heading">Learning links</div>
                    <div class="ll-list">
                        <div
                            class="ll-item"
                            v-for="(item, i) in this.learningLinksArray"
                            :key="i"
                        >
                            <div class="item-left">
                                <img
                                    class="ll-item-preview"
                                    :src="item.preview"
                                />
                                <inline-svg
                                    class="ll-item-button"
                                    :src="
                                        item.type == 'video'
                                            ? 'video-play-btn'
                                            : 'doc-read-btn'
                                    "
                                ></inline-svg>
                            </div>
                            <div class="item-right">
                                <div class="ll-item-title">
                                    {{ item.title }}
                                </div>
                                <div class="ll-item-time">
                                    {{
                                        item.type == 'video'
                                            ? 'WATCH : ' + item.time
                                            : 'READ : ' + item.time
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="view-more">
                        <span class="more-text">View More</span>
                        <inline-svg
                            class="back-arrow"
                            :src="'long-left-arrow'"
                        ></inline-svg>
                    </div>
                </div>
            </div>
            <div class="btn-container">
                <nitrozen-button
                    class="save-tags-btn"
                    v-flat-btn
                    :rounded="false"
                    :theme="'secondary'"
                    @click="selectAndContinue()"
                >
                    Select & Continue
                </nitrozen-button>
            </div>
        </div>
    </div>
</template>
<script>
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenRadio,
    NitrozenToggleBtn,
} from '@gofynd/nitrozen-vue';
import { PageHeader } from '@/components/common';
import inlinesvg from './../../../components/common/inline-svg.vue';
export default {
    name: 'integration-type',
    components: {
        'inline-svg': inlinesvg,
        NitrozenButton,
        PageHeader,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-input': NitrozenInput,
        'nitrozen-radio': NitrozenRadio,
    },
    data() {
        return {
            // selectedAction: false,
            learningLinksArray: [
                {
                    title: 'How to install Asset Manager?',
                    type: 'video',
                    time: '2min 30sec',
                    preview:
                        'https://hdn-1.addsale.com/x0/platform/extensions/android_app_builder/free/original/Tzvs_ZJ-T-Rectangle-183.png',
                },
                {
                    title: 'Get to know more about this extension.',
                    type: 'document',
                    time: '5min',
                    preview:
                        'https://hdn-1.addsale.com/x0/platform/extensions/android_app_builder/free/original/fYUhuVha0-Screenshot-2021-08-19-at-12.11-1.png',
                },
                {
                    title: 'How to setup and use this extension?',
                    type: 'document',
                    time: '4min',
                    preview:
                        'https://hdn-1.addsale.com/x0/platform/extensions/android_app_builder/free/original/fYUhuVha0-Screenshot-2021-08-19-at-12.11-1.png',
                },
            ],
            type: [
                {
                    name: 'Kapture Integrations',
                    logo: { svg: 'kapture' },
                    description:
                        'Select from the various choices available for similar products',
                    value: false,
                },
                {
                    name: 'Freshdesk Integrations',
                    logo: { svg: 'headphone' },
                    description:
                        'Select from the various choices available for similar products',
                    value: false,
                },
                // {
                //     name: 'None',
                //     logo: { svg: 'product-icon' },
                //     description:
                //         'Select from the various choices available for similar products',
                // },
            ],
        };
    },
    methods: {
        save() {
            console.log('>>save');
        },
        selectedItem(id) {

            let selected = this.type.map((instance, index) => {
                if (index === id) {
                    let payload = { ...instance };
                    payload.value = !payload.value;
                    return { ...payload };
                }
                return instance;
            });

            this.type = selected;

        },
    },
};
</script>
<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
}
.container {
    margin: 24px;
    margin-top: 105.5px;
    height: 100%;
    display: grid;
    grid-template-columns: 75% 23%;
    column-gap: 2%;
}
.learning-links {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
}

.ll-heading,
.tm-heading {
    font-weight: 600;
    font-size: 15px;
    line-height: 140%;
    color: #41434c;
    margin-bottom: 12px;
}
.ll-item {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f2f2f2;
}

.ll-item-preview {
    height: 40px;
    width: 48px;
    border-radius: 8px;
    object-fit: cover;
}

.ll-item-button {
    margin-top: -31px;
    margin-left: 35px;
    cursor: pointer;
}

.item-right {
    margin-left: 15px;
}

.ll-item-title {
    font-weight: 500;
    font-size: 12px;
    line-height: 140%;
}

.ll-item-time {
    font-weight: 400;
    font-size: 10px;
    line-height: 140%;
    color: #828282;
}

.view-more {
    color: #2e31be;
    display: flex;
    font-size: 12px;
    font-weight: 500;
    margin-top: 16px;
    cursor: pointer;
}

.more-text {
    display: flex;
    align-items: center;
}

.back-arrow {
    transform: scaleX(-1);
    width: 14px;
    margin-left: 5px;
}
.card-logo {
    display: flex;
}
.category-list {
    display: flex;
    justify-content: space-between;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 16px;
    height: 75px;
    margin-top: 16px;
    cursor: pointer;
}
.category-list:hover {
    box-shadow: 5px 5px 5px 0 rgba(221, 221, 221, 0.5);
}
.right-section {
    margin-top: 16px;
}
.card-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 8px;
}
.item-name {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 140%;
    color: #41434c;
}
.item-decs {
    margin-top: 4px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 140%;
    color: #828282;
}
.card {
    display: flex;
}
.selected-action-radio-group {
    display: flex;
    align-items: center;
}
.btn-container {
    display: flex;
    justify-content: flex-end;
}
</style>

