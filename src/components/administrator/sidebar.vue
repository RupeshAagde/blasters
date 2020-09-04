<template>
    <div class="menu-block">
        <div
            class="bold-sm cl-Mako menu-item"
            v-for="(item, index) in getNavItems"
            :key="index"
        >
            <router-link
                :to="item.link"
                :class="
                    currentPath.includes(item.title) ? 'link-exact-active' : ''
                "
            >
                <inline-svg :src="item.icon" class="icon"></inline-svg>
                <span class="title regular-xs cl-Mako">{{ item.display }}</span>
                <inline-svg
                    src="arrow-dropdown-black"
                    class="dropdown-icon"
                    :class="{
                        'rotate-arrow': currentPath.includes(item.title)
                    }"
                    v-if="item.children.length > 0"
                ></inline-svg>
            </router-link>
            <div
                class="sub-menu"
                :class="{
                    'toggle-dropdown':
                        item.children && currentPath.includes(item.title)
                }"
            >
                <div
                    class="bold-sm cl-Mako submenu-item menu-item"
                    v-for="(submenu, index) in item.children"
                    :key="index"
                >
                    <router-link
                        :to="submenu.link"
                        :class="
                            currentPath.includes(submenu.title)
                                ? 'link-active'
                                : ''
                        "
                    >
                        <span class="title regular-xs cl-Mako">
                            {{ submenu.display }}
                        </span>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="foot-desc">
            <span>#MadeInIndia © 2020</span>
            <span>Shopsense Retail Technologies</span>
        </div>
    </div>
</template>

<style lang="less" scoped>
.foot-desc {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    line-height: 20px;
    min-height: 100px;
    padding: 24px;
    font-size: 12px;
    color: #41434c;
}
.filter {
    position: absolute;
    right: 20px;
}
.filter-arrow-up {
    margin-left: auto;
    transform: rotate(180deg);
}
.filter-arrow-down {
    margin-left: auto;
}
.menu-block {
    position: fixed;
    height: calc(100% - 60px);
    background-color: #ffffff;
    width: 250px;
    left: 0px;
    overflow: auto;
    transition: all 0.25s ease-in-out;
    box-shadow: 1px 1px 1px 1px #eeeeee;
    // z-index: 16;
    display: flex;
    flex-direction: column;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}
.menu-item {
    cursor: pointer;
    a {
        display: flex;
        align-items: center;
        justify-content: left;
        padding: 10px 0px 10px 10px;
        .icon {
            margin-right: 16px;
            height: 24px;
            width: 24px;
        }
        .title {
            padding-left: 5px;
        }
        .dropdown-icon {
            display: inline-block;
            margin-left: auto;
            padding: 0 10px;
            transition: all 0.5s ease;
        }
    }
}
.submenu-item {
    a {
        padding: 10px 0 10px 50px;
    }
}
.rotate-arrow {
    transform: rotate(180deg);
}
.sub-menu {
    max-height: 0;
    opacity: 0;
    transition: all 0.3s ease-out;
    transition-delay: 0.1s;
    position: relative;
    overflow: hidden;
}
.toggle-dropdown {
    opacity: 1;
    max-height: 360px;
}
.link-exact-active {
    background-color: rgba(92, 107, 221, 0.12);
    .title {
        color: #5c6bdd;
    }
    .icon {
        color: #5c6bdd;
    }
}
.link-active {
    background-color: #ffffff;
    .title {
        color: #5c6bdd;
    }
}
.blaster-scrollbar {
    /* scrollbar */
    &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background-color: @White;
    }
    /* Track */
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
        background-color: @White;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
        border-radius: 2.5px;
        background-color: @DoveGray;
    }
}
</style>

<script>
import inlineSvgVue from './../common/inline-svg.vue';
import { getNavigations } from './../../pages/administrator/navigations';
import { mapGetters } from 'vuex';
import { GET_USER_PERMISSIONS } from '../../store/getters.type';
export default {
    name: 'sidebar',
    components: {
        'inline-svg': inlineSvgVue
    },
    props: {},
    computed: {
        getNavItems() {
            let permissions = this.userPermissions
                ? this.userPermissions.permissions
                : [];
            return getNavigations(this.$route).filter((navItem) =>
                permissions.includes(navItem.permission)
            );
        },
        currentPath() {
            return this.$route.path;
        },
        ...mapGetters({
            userPermissions: GET_USER_PERMISSIONS
        })
    },
    methods: {
        beforeEnter: function(el) {
            el.style.height = '0';
        },
        enter: function(el) {
            el.style.height = el.scrollHeight + 'px';
        },
        beforeLeave: function(el) {
            el.style.height = el.scrollHeight + 'px';
        },
        leave: function(el) {
            el.style.height = '0';
        },
        toggle: function() {
            this.$emit('click');
        }
    }
};
</script>
