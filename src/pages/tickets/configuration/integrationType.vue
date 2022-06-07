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
                        v-for="(integration, index) in type"
                        v-bind:key="index"
                        class="category-list"
                        @click="selected(integration)"
                    >
                        <!-- <nitrozen-radio
                            name="metaType"
                            class="radio-spacing"
                            :radioValue="'json'"

                        >
                            
                        </nitrozen-radio> -->
                        <div class="card-content-section">
                            <span class="category-name">{{
                                integration.name
                            }}</span>
                        </div>
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
        </div>
    </div>
</template>
<script>
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenToggleBtn,
} from '@gofynd/nitrozen-vue';
import { PageHeader } from '@/components/common';
export default {
    name: 'integration-type',
    components: {
        NitrozenButton,
        PageHeader,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-input': NitrozenInput,
    },
    data() {
        return {
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
                    name: 'System categories',
                },
                {
                    name: 'General configurations',
                },
                {
                    name: 'Choose integration type',
                },
            ],
        };
    },
    methods: {
        save() {
            console.log('>>save');
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
.left-section {
}
.category-list {
    display: flex;
    flex-direction: column;
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
</style>

