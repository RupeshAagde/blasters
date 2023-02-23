<template>
    <div class="slide-fade side-drawer" ref="slide-fade" @click="close($event)">
        <div class="sidedrawer-container" :style="css">
            <div class="sidedrawer-header">
                <div class="sidedrawer-header-title">
                    <p class="title">{{ title }}</p>
                    <a class="cancel-btn" @click.stop.prevent="onCloseBtnClick($event)">
                        <ukt-inline-svg :src="'cross-black'"></ukt-inline-svg>
                    </a>
                </div>
                
                <div class="header-content">
                    <slot name="header"></slot>
                </div>
            </div>
            <div class="sidedrawer-content">
                <slot></slot>
            </div>
            <div class="sidedrawer-footer" v-if="footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';

export default {
    name: 'side-drawer',
    components: {
        UktInlineSvg
    },
    props: {
        title: String,
        footer: {
            type: Boolean,
            default: false
        },
        css: {
            type: Object
        }
    },
    methods: {
        /**
         * Function to emit close if the user has clicked anywhere but the content container
         * 
         * @author: Rushabh Mulraj Shah
         * @param {object} e The event object
         */
        close: function (e) {
            /* Stop the event from propagating */
            e.stopPropagation();

            /* 
                Check if the click originates in the content container.
                The 'close' method will be emitted if the origin is not content.
            */
            let isSideDrawerContainerClicked = e.target.closest('.sidedrawer-container');
            if(!isSideDrawerContainerClicked) {
                this.$emit('close');
            }
        },

        /**
         * Function to emit close when user clicks on close button
         * 
         * @author: Rushabh Mulraj Shah
         */
        onCloseBtnClick() {
            this.$emit('close');
        }
    }
}
</script>

<style lang="less" scoped>
@import './../../less/page-header.less';
@import './../../less/page-ui.less';
@import './../../../less/common.less';
@import './../../../less/theme.less';

.slide-fade {
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;
    overflow-x: hidden;


    .sidedrawer-container {
        position: absolute;
        right: 0px;
        top: 0px;
        min-width: 30%;
        height: 100%;
        background: @White;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);

        &::-webkit-scrollbar {
            display: none;
        }

        @media @mobile {
            position: fixed;
            width: 100%;
        }

        .sidedrawer-header {
            display: flex;
            flex-direction: column;
            padding: 24px;
            border-bottom: 1px solid #E0E0E0;

            .sidedrawer-header-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .title {
                font-size: 20px;
                font-weight: 500;
                line-height: 31px;
                color: @Mako;
            }

            .cancel-btn {
                cursor: pointer;
            }
        }

        .sidedrawer-content {
            /* @ToDo: The below calcualted height was for making the content piece scrollable. */
            height: calc(100% - 80px - 48px);
            // height: auto;
            padding: 24px;
            overflow-y: scroll;
            box-sizing: border-box;
        }

        .sidedrawer-footer {
            position: absolute;
            bottom: 0;
            padding: 16px;
            border-top: 1px solid #E0E0E0;
            background: @White;
            width: 100%;
            box-shadow: 0px -1px 12px rgba(0, 0, 0, 0.05);
            box-sizing: border-box;
        }
    }
}
</style>
