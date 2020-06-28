<template>
    <!-- plan-type import  -->
    <nitrozen-dialog
        class="plan-type-selection"
        ref="planTypeSelection"
        title="Choose Plan Type"
    >
        <template slot="body">
            <div class="plan-type-main">
                <span
                    class="plan-type-menu"
                    v-for="(menu, index) in menus"
                    :key="'general' + index"
                >
                    <base-card @click="close(menu.action)">
                        <span class="plan-type-icon">
                            <inline-svg
                                v-if="menu.icon"
                                :src="menu.icon"
                                class="feature-icon"
                            ></inline-svg>
                        </span>
                        <span class="plan-type-content">
                            <div>
                                <span class="bold-xs cl-Mako">
                                    {{ menu.title }}
                                </span>
                            </div>
                            <div class="plan-type-detail">
                                <span class="cl-Mako">
                                    {{
                                        menu.desc ||
                                            'View and Update store details'
                                    }}
                                </span>
                            </div>
                        </span>
                    </base-card>
                </span>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDialog,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import { BaseCard, InlineSvg } from '../common/';

const MENUS = [
    {
        title: 'Private',
        action: 'private',
        icon: '',
        permissions: ['catalogue'],
        active: false,
        desc: 'Private plans for specific users'
    },
    {
        title: 'Public',
        action: 'public',
        icon: '',
        active: true,
        desc: 'Public plans available for all'
    },
    {
        title: 'Company Specific',
        action: 'company-specific',
        icon: '',
        active: true,
        desc: 'Plans available for specified company only'
    }
];
export default {
    name: 'plan-type-dialog',
    components: {
        NitrozenButton,
        NitrozenDialog,
        BaseCard,
        InlineSvg
    },
    props: {},
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {},
    data: function() {
        return { menus: MENUS };
    },
    mounted() {},
    methods: {
        open(data) {
            this.$refs.planTypeSelection.open({
                showCloseButton: true,
                positiveButtonLabel: false,
                negativeButtonLabel: false,
                neutralButtonLabel: false,
                width: '600px'
            });
        },
        close(reason) {
            this.$refs.planTypeSelection.close(reason);
            this.$emit('close', reason);
        }
    }
};
</script>

<style lang="less" scoped>
.plan-type-selection {
    ::v-deep .nitrozen-dialog {
        .nitrozen-dialog-body {
            overflow: unset;

            .plan-type-main {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                .plan-type-menu {
                    flex: 0 48%;
                    .plan-type-body {
                        margin: 0;
                    }
                }
                .plan-type-icon {
                    width: 30%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid @Alabaster2;
                    background-color: @Alabaster2;
                    .feature-icon {
                        svg {
                            width: 50px;
                            height: 50px;
                        }
                    }
                    img {
                        width: auto;
                    }
                }
                .plan-type-content {
                    background-color: @White;
                    width: 70%;
                    padding: 12px;
                    .plan-type-detail {
                        padding-top: 6px;
                        font-size: 12px;
                        line-height: 1.5;
                    }
                }
            }
        }
        .nitrozen-dialog-footer {
            margin-bottom: 0;
        }
    }
}
</style>
