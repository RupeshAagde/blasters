<template>
    <div>
        <div class="settings-head">
            <inline-svg src="settings"></inline-svg>
            <span class="bold-xs cl-Mako title">{{ title }}</span>
        </div>

        <div class="settings-main">
            <span
                class="settings-menu"
                v-for="(menu, index) in menus"
                :key="'general' + index"
                @click="onClick(menu)"
            >
                <div class="settings-body" @click="$emit('click')">
                    <span class="settings-icon">
                        <adm-inline-svg
                            v-if="menu.icon"
                            :src="menu.icon"
                            class="feature-icon"
                        ></adm-inline-svg>
                    </span>
                    <span class="settings-content">
                        <div>
                            <span class="bold-xs cl-Mako">{{ menu.title }}</span>
                        </div>
                        <div class="settings-detail">
                            <span class="cl-Mako">
                                {{ menu.desc }}
                            </span>
                        </div>
                    </span>
                </div>
            </span>
        </div>
    </div>
</template>
<style lang="less" scoped>
.settings-head {
    display: flex;
    align-items: center;
    .title {
        font-size: 18px;
        padding-left: 10px;
    }
}
.settings-main {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 48px;
    .settings-menu {
        flex: 0 33.3%;
    }
    .settings-body {
        border: 1px solid @Iron;
        border-radius: 3px;
        display: flex;
        cursor: pointer;
        margin: 24px 24px 0 0;
        min-height: 84px;
        &:hover {
            box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.1);
        }
        .settings-icon {
            width: 30%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: 1px solid @Alabaster2;
            background-color: @Alabaster2;
            img {
                width: auto;
            }
        }
        .settings-content {
            background-color: @White;
            width: 70%;
            padding: 12px;
            .settings-detail {
                padding-top: 6px;
                font-size: 12px;
                line-height: 1.5;
            }
        }
    }
}
</style>
<script>
import InlineSvg from '@/components/common/inline-svg';
import admInlineSVG from '@/components/common/adm-inline-svg';

export default {
    name: 'settings-group',
    components: {
        InlineSvg,
        'adm-inline-svg': admInlineSVG
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,
        };
    },
    props: ['title', 'menus'],
    methods: {
        onClick(menu){
            if(menu.link){
                this.$router.push(menu.link)
            } else if(menu.eventName) {
                this.$emit(menu.eventName)
            }
        }
    }
};
</script>
