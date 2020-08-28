<template>
    <div class="permission-div">
        <div
            class="permission-menu"
            :class="{ 'permission-hide': group ? item.group != group : false }"
            v-for="(item, index) in permissionData.permissions"
            :key="index"
            @change="selectPermission(item.key)"
        >
            <div
                v-if="group ? item.group == group : true"
                class="main-div"
                :class="{ 'disable-div': currentRole != 'custom' }"
            >
                <nitrozen-checkbox
                    :checkboxValue="item.key"
                    v-model="checkedPermissions"
                    :disabled="currentRole != 'custom'"
                >
                    <div class="access">
                        <span class="title">
                            {{ item.title }}
                            <nitrozen-tooltip :position="'top'">
                                <span class="desc">{{ item.description }}</span>
                            </nitrozen-tooltip>
                        </span>

                        <!-- <span class="desc">{{ item.description }}</span> -->
                    </div>
                </nitrozen-checkbox>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.disable-div {
    background: @WhiteSmoke;
    cursor: default;
    opacity: 0.8;
}
.permission-div {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -24px 0 0;
    .permission-menu {
        flex: 0 45%;
        margin: 12px 24px 0 0;
        .main-div {
            display: flex;
            // justify-content: flex-start;
            box-sizing: border-box;
            border: 1px solid @Iron;
            border-radius: 4px;
            // margin-top: 12px;
            width: 100%;
            height: 100%;
            cursor: pointer;
            & > div {
                width: 100%;
            }
            &:hover {
                box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
            }

            ::v-deep .nitrozen-container {
                padding: 16px;
                padding-left: 30px;
                margin-bottom: 0;
            }
            ::v-deep .nitrozen-checkbox {
                top: 14px;
                left: 14px;
            }
            .access {
                color: @Mako;
                font-size: 16px;
                font-weight: bold;
                line-height: 25px;
                display: flex;
                flex-direction: column;
                padding: 12px;
                .desc {
                    margin-top: 0px;
                    font-size: 12px;
                    line-height: 20px;
                    font-weight: 400;
                }
                .title {
                    // margin-top: -5px;
                }
            }
        }
    }
    .permission-hide {
        display: none;
    }
}
</style>

<script>
import { NitrozenCheckBox, NitrozenTooltip } from '@gofynd/nitrozen-vue';
export default {
    name: 'permissions',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-tooltip': NitrozenTooltip
    },
    data() {
        return {
            checkedPermissions: this.currentPermissions
        };
    },
    props: {
        permissionData: {
            type: Object,
            required: true
        },
        currentRole: {
            type: String
        },
        currentPermissions: {
            type: Array
        },
        group: {
            type: String
        }
    },
    watch: {
        currentRole() {
            this.setPermissionData();
        }
    },
    methods: {
        selectPermission(key) {
            this.$emit('permission-data', this.checkedPermissions);
        },
        setPermissionData() {
            if (this.currentRole != 'custom') {
                let data = this.permissionData.roles.filter((ele) => {
                    return ele.key == this.currentRole;
                });

                this.checkedPermissions = data[0].permissions;
            } else {
                this.checkedPermissions = [];
            }
            this.$emit('permission-data', this.checkedPermissions);
        }
    }
};
</script>
