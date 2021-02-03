<template>
    <div class="menu">
        <div
            class="bold-sm cl-Mako parent-ele"
            @click="checkOpen"
            :class="open ? 'router-link-exact-active' : ''"
        >
            <inline-svg :src="list.icon" class="icon"></inline-svg>
            <span class="title regular-xs cl-Mako">{{ list.display }}</span>
            <span
                class="filter"
                v-bind:class="{
                    'filter-arrow-down': !open,
                    'filter-arrow-up': open
                }"
            >
                <inline-svg :src="'arrow-dropdown-black'"></inline-svg>
            </span>
        </div>
        <div v-if="open">
            <div
                class="bold-sm cl-Mako menu-item"
                v-for="(item, index) in list.child"
                :key="index"
            >
                <router-link :to="item.link">
                    <!-- <inline-svg :src="item.icon" class="icon"></inline-svg> -->
                    <span class="title regular-xs cl-Mako">
                        {{ item.display }}
                    </span>
                </router-link>
            </div>
        </div>
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
.menu {
    // height: calc(100% - 60px);
    background-color: #ffffff;
    width: 100%;
    left: 0px;
    overflow: auto;
    transition: all 0.25s ease-in-out;
}
.menu-item {
    cursor: pointer;
    a {
        display: flex;
        align-items: center;
        justify-content: left;
        padding: 10px 0px 10px 51px;
        height: 20px;
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
        color: #2E31BE;
    }
}
</style>

<script>
import inlineSvgVue from './../common/inline-svg.vue';
import { getNavigations } from './../../pages/administrator/navigations';
export default {
    name: 'dropdown',
    components: {
        'inline-svg': inlineSvgVue
    },
    data() {
        return {
            open: false,
            navigation: {}
        };
    },
    computed: {
        // getMenu: {
        //     get: function() {
        //         return getNavigations();
        //     },
        //     set:function(value){
        //     }
        // },
        // getList() {
        //     return this.list;
        // },
        // // active: {
        // //     get: function() {
        // //         return this.list.active;
        // //     },
        // //     set: function(value) {
        // //         this.list.active = value;
        // //     }
        // },
        // getLast: {
        //     get: function(){
        //         return this.lastTab;
        //     },
        //     set: function(value){
        //         this.lastTab = value;
        //     }
        // }
    },
    mounted() {
        this.navigation = getNavigations();
    },
    props: {
        list: {},
        active: Boolean
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
        checkOpen() {
            if (this.active) this.open = !this.open;
            this.$emit('opened');
        }
        // if (this.lastTab != this.list.title) {
        //     this.active = true;
        //     this.open = this.active;
        //     console.log(this.list.title, 'list');
        // console.log(this.lastTab, 'lasttab');
        // for(var key in this.navigation){
        //     if(key != this.lastTab){
        // var obj = this.navigation[key];
        // obj.active = true;
        // console.log(obj , 'obj');
        // console.log(key, 'key');
        // }
        // }
        // if (this.getMenu.hasOwnProperty(this.lastTab))
        //     console.log(this.getMenu[this.lastTab]),
        //         'safsdfsdfsfsdggfsgsgf';
        // }
        // else {
        //     if (this.navigation.hasOwnProperty(this.lastTab)) {
        //         this.open = false;
        //         this.navigation[this.lastTab].active = false;
        //     }
        // }
        // this.getLast = this.list.title;
        // console.log(this.getLast, 'lasttab');
    }
};
</script>
