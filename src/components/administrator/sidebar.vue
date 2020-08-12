<template>
    <div>
        <template v-for="(navs, type) in getNavItems">
            <div v-if="navs.child && navs.child.length == 0" :key="type">
                <div class="bold-sm cl-Mako menu-item">
                    <router-link :to="navs.link">
                        <inline-svg :src="navs.icon" class="icon"></inline-svg>
                        <span class="title regular-xs cl-Mako">{{
                            navs.display
                        }}</span>
                    </router-link>
                </div>
            </div>
            <div v-if="navs.child && navs.child.length > 0" :key="'key' + type">
                <!-- <div class="bold-sm cl-Mako parent-ele" @click="checkOpen(navs)" :class="open ? 'router-link-exact-active' : ''"> 
                    <inline-svg :src="navs.icon" class="icon"></inline-svg>
                    <span class="title regular-xs cl-Mako">{{ navs.display }}</span>
                    <span
                        class="filter"
                        v-bind:class="{'filter-arrow-down': !open, 'filter-arrow-up': open}"
                    >
                        <inline-svg :src="'arrow-dropdown-black'"></inline-svg>
                    </span>
                </div> -->
                <dropdown :list="navs" />
            </div>
        </template>
    </div>
</template>

<style lang="less" scoped>
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
    position: relative;
    height: calc(100% - 60px);
    background-color: #ffffff;
    width: 250px;
    left: 0px;
    overflow: auto;
    transition: all 0.25s ease-in-out;
    box-shadow: 1px 1px 1px 1px #eeeeee;
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
            max-height: 24px;
            max-width: 24px;
        }
        .title {
            padding-left: 5px;
        }
    }
}
.parent-ele {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: left;
    padding: 10px 0px 10px 10px;
    .icon {
        margin-right: 16px;
        max-height: 24px;
        max-width: 24px;
    }
    .title {
        padding-left: 5px;
    }
}

.router-link-exact-active {
    background-color: rgba(92, 107, 221, 0.12);
    .title {
        color: #5c6bdd;
    }
}
</style>

<script>
import inlineSvgVue from './../common/inline-svg.vue';
import { getNavigations } from './../../pages/administrator/navigations';
import dropdown from './dropdown.vue';
export default {
    name: 'side-menu',
    components: {
        'inline-svg': inlineSvgVue,
        dropdown
    },
    props: {},
    computed: {
        getNavItems() {
            return getNavigations(this.$route);
        }
    },
    data() {
        return {
            open: false
        };
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
        },
        checkOpen(item) {
            this.open = !open;
        }
    }
};
</script>
