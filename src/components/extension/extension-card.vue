<template>
    <div class="container" @click="onClick" v-if="extension">
        <div class="card-top">
            <div class="left-container">
                <img
                    v-if="extension.listing_info.icon"
                    :src="extension.listing_info.icon"
                    class="default-image circle-clip"
                />
                <adm-text-avatar
                    v-else
                    :text="extension.name"
                    class="default-image circle-clip"
                ></adm-text-avatar>

                <div class="extension-details">
                    <div class="darker-sm cl-Mako text-ellipsis">
                        {{ extension.listing_info.name }}
                    </div>
                </div>
            </div>
            <div class="right-container">
                <nitrozen-badge v-if="extension.current_status==='pending'" state="warn">
                    Pending
                </nitrozen-badge>
                <nitrozen-badge v-if="extension.current_status==='rejected'" state="default">
                    Rejected
                </nitrozen-badge>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '../../pages/less/form.less';
.page-buttons {
    margin: 10px;
}
.container {
    border: 1px solid #e4e5e6;
    cursor: pointer;
    padding: 0px 24px;
    transition: box-shadow 0.3s;
    .text-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .space-between {
        justify-content: space-between;
        display: flex;
        position: relative;
        margin-top: 6px;
    }
    .red-btn {
        color: @Required;
    }
    .card-desc{
            font-size: 14px;

    }
    .card-footer {
        justify-content: space-between;
        display: flex;
        position: relative;
        margin-top: 6px;
        align-items: center;
    }
    .card-top {
        display: flex;
        height: 60px;
        margin: 24px 0px;
        .left-container {
            display: flex;
            flex: 4;
            position: relative;
            width: calc(100% - 60px);
            .banner-image {
                width: 144px;
                height: 72px;
                position: absolute;
                left: -41px;
                top: -6px;
            }
            .default-image {
                width: auto;
                height: 60px;
                position: absolute;
                left: -10px;
                top: 0px;
            }
            .circle-clip {
                clip-path: circle(30px at center);
            }
            .image-spacer {
                min-height: 60px;
                max-height: 60px;
                min-width: 60px;
                max-width: 60px;
            }
            .extension-details {
                margin-left: 70px;
                // padding: 0px 24px;
                line-height: 24px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: calc(100% - 108px);
            }
        }
        .right-container {
            flex: 1;
            display: flex;
            flex: 1;
            flex-direction: row-reverse;
            position: relative;
            align-items: center;
        }
    }
    .card-bottom {
        line-height: 19px;
        margin: 5px 0px 10px 0px;
    }
}
.container:hover {
    box-shadow: 0px 9px 13px 0px rgba(221, 221, 221, 0.5);
}
.slug {
    padding: 4px 0px 0px;
    line-height: 1;
}
.domain-highlight {
    :hover {
        text-decoration: underline;
    }
}
.card-avatar {
    overflow: hidden;
}
</style>

<script>
import moment from 'moment';
import inlineSvg from '@/components/common/inline-svg.vue';
import admTextAvatar from '@/components/common/text-avatar.vue';
import {
    NitrozenBadge,
    NitrozenButton,
    NitrozenToggleBtn,
    NitrozenMenu,
    NitrozenMenuItem
} from '@gofynd/nitrozen-vue';

export default {
    name: 'extension-list-card',
    components: {
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-button': NitrozenButton,
        'nitrozen-toggle': NitrozenToggleBtn,
        'nitrozen-menu' : NitrozenMenu,
        'nitrozen-menu-item' : NitrozenMenuItem,
        'inline-svg': inlineSvg,
        'adm-text-avatar': admTextAvatar,
    },
    props: {
        extension: {
            type: Object,
        },
    },
    methods: {
        onClick(event) {
            this.$emit('click', event);
        },
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        },
        changeActive(e) {
            e.stopPropagation();
            this.$emit('change_state');
        },
        preventClick(e) {
            if (
                e.target.nodeName.toLowerCase() === 'label' ||
                e.target.parentElement.nodeName.toLowerCase() === 'label'
            ) {
                e.stopPropagation();
            }
        },
    },
};
</script>
