<template>
    <div class="panel">
        <div class="main-container">
            <div style="width: 100%">
                <jumbotron :title="'Coupons'" :desc="'View All Coupons'">
                    <nitrozen-button
                        id="create"
                        :theme="'secondary'"
                        @click="openModal"
                        v-flatBtn
                        >Create</nitrozen-button
                    >
                </jumbotron>
                <coupon-listing style="margin-top: 24px"></coupon-listing>
            </div>
            <nitrozen-dialog
                class="remove_staff_dialog desc-dialog"
                ref="coupon_create_dialog"
                title="Create Coupon"
            >
                 <template slot="header">
                <div class="cross">Create Page</div>
            </template>
                <template slot="header">
                <div class="cross" @click="closeModal">
                    <inline-svg :src="'cross-black'"></inline-svg>
                </div>
            </template>
                <template slot="body" class="desc-dialog">
                    <div class="parent">
                        <div class="left">
                            <div class="sidebar">
                                 
                        <div class="childNameContainer"
                         v-bind:class="{
                            childSelected: selectedType == x.key
                        }"
                         v-for="x in typeList" :key="x.key">
                        <div class="childName" @click="()=>{ selectedType = x.key   }">{{x.title}}</div>
                        
                    </div>
                            </div>
                        </div>
                        <div class="right">
                            <div>
                                <div
                                    class="page-content global-font-family"
                                    
                                >
                                    <div class="title bold-sm cl-Mako">
                                        {{ title }}
                                    </div>
                                    <div
                                        class="
                                            subtitle
                                            regular-xs
                                            cl-DustyGray2
                                        "
                                    >
                                        {{ subtitle }}
                                    </div>
                                    <div class="title dark-xs cl-Mako">
                                        Example:
                                    </div>
                                    <pre
                                        class="sample-text"
                                        v-html="description"
                                    ></pre>
                                </div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </template>
                <template slot="footer">
                    <div>
                        <nitrozen-button
                            v-flatBtn
                            class="mr24"
                            id="approve"
                            :theme="'secondary'"
                            @click="onCreate"
                            >Select and Proceed</nitrozen-button
                        >
                    </div>
                </template>
            </nitrozen-dialog>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
.main-container {
    background-color: white;
    margin: 24px;
    padding: 24px;
}

.custom-header {
    ::v-deep .n-flat-button-secondary {
        margin-top: 110px !important;
    }
}
.left {
    flex-basis: 300px;
    border-right: 1px solid #d0d0d0;
    overflow: hidden;
    padding-top: 12px;
    .sidebar {
        position: fixed;
        width: 225px;
        
        .group {
            margin-bottom: 12px;
        }
        .groupNameContainer {
            padding: 6px 0px;
            width: 100%;
            color: #9b9b9b;
            font-family: Inter;
            font-size: 12px;
            letter-spacing: 0;
            line-height: 17px;
            .groupName {
                margin: 0px 12px;
            }
        }
        .childNameContainer {
            display: flex;
            padding: 6px 6px;
            color: #212121;
            font-family: Inter;
            font-size: 14px;
            letter-spacing: 0;
            line-height: 23px;
            cursor: pointer;
            .childName {
                margin: 0px 12px;
                flex: 4;
            }
            .child-linked {
                flex: 1;
            }
        }
        .childNameContainer:hover {
            background-color: rgba(92, 107, 221, 0.12);
        }
        .childSelected {
            background-color: rgba(92, 107, 221, 0.12);
        }
        .page-error {
            width: auto;
            img {
                width: 100%;
                height: auto;
            }
        }
    }
}
.right {
    flex-basis: 100%;
    display: flex;
    height: 100%;
    flex-direction: column;
    overflow: auto;
    height: auto;
    max-height: 100%;
    padding: 24px;
    flex-basis: 100%;
    border-bottom: 1px solid #d0d0d0;
}
.parent {
    display: flex;
}
.page-content {
    font-family: Inter, sans-serif;
}
.title {
    margin-bottom: 12px;
}
.subtitle {
    margin-bottom: 20px;
}
.sample-text {
    font-family: inherit;
    .font-size(@font-xs);
    background: #f2f2f2;
    line-height: 20px;
    ::v-deep b {
        font-weight: 600;
    }
}
.desc-dialog{
    ::v-deep.nitrozen-dialog-body{
     padding: 0px;
     //overflow: hidden;
    }
    ::v-deep.nitrozen-dialog-header{
        margin-bottom: 0px;
    }
}
.cross {
    margin: 0px;
}
    
</style>

<script>
import Jumbotron from '@/components/common/jumbotron';
import CouponsListing from './coupons-listing';
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenDropdown,
    NitrozenDialog,
    NitrozenRadio,
    NitrozenPagination,
} from '@gofynd/nitrozen-vue';
import { TYPE_DATA } from '@/helper/coupon-helper';
import inlinesvg from '@/components/common/ukt-inline-svg.vue';

export default {
    name: 'coupon-listing-main',
    components: {
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-radio': NitrozenRadio,
        'inline-svg': inlinesvg,
        jumbotron: Jumbotron,
        'coupon-listing': CouponsListing,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    computed: {
        title() {
            return TYPE_DATA[this.selectedType].title;
        },
        subtitle() {
            return TYPE_DATA[this.selectedType].subtitle;
        },
        description() {
            return TYPE_DATA[this.selectedType].description;
        },
    },
    data() {
        return {
            selectedType: 0,
            typeList: [...TYPE_DATA],
            couponType: ''
        };
    },
    mounted() {
         
    },
    methods: {
        openModal: function () {
           
            this.$refs['coupon_create_dialog'].open({
                width: '1100px',
                height: '600px',
            });
        },
        closeModal() {
            this.$refs['coupon_create_dialog'].close();
        },
        onCreate(){
            this.couponType = this.typeList[this.selectedType].value_title
            setTimeout(() => {
             this.$router.push({
                        path: `/administrator/subscription/coupons/create/${this.couponType}`
                        }).catch(()=>{})
            })
                        this.closeModal();
        }
    },
};
</script>