<template>
    <div>
        <div>
            <page-header :title="headerText" @backClick="redirectToListing">
                <div class="page-slot">
                    <div class="left-space-txb">
                        <div v-if="update">
                            <nitrozen-badge v-if="is_active" state="success"
                                >Active</nitrozen-badge
                            >
                            <nitrozen-badge v-if="!is_active" state="warn"
                                >Disabled</nitrozen-badge
                            >
                        </div>
                    </div>
                    <div class="button-box">
                        <label
                            :class="is_active ? 'active-dept' : 'disabled-dept'"
                        >
                            <span>{{ is_active ? 'Active' : 'Disabled' }}</span>
                            <nitrozen-toggle-btn
                                v-model="is_active"
                                :title="
                                    is_active
                                        ? 'Disable department'
                                        : 'Enable department'
                                "
                            ></nitrozen-toggle-btn>
                        </label>
                        <span>
                            <nitrozen-button
                                class="left-space-txb"
                                :theme="'secondary'"
                                @click="save"
                                v-flatBtn
                                >Save</nitrozen-button
                            >
                        </span>
                    </div>
                </div>
            </page-header>
        </div>
        <img
            src="/public/assets/loader.gif"
            class="cust-loader"
            v-if="pageLoading"
        />
        <!-- <loader v-if="isLoading"></loader> -->
        <div class="main-container" v-else>
            <div class="row-1">
                <div class="input-box">
                    <nitrozen-input
                        label="Display *"
                        placeholder="e.g. Electronics"
                        v-model="display.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="display.showerror">{{
                        display.errortext
                    }}</nitrozen-error>
                </div>
                <div class="input-box left-space-txb">
                    <nitrozen-dropdown
                        label="Display Type *"
                        class="filter-dropdown"
                        :items="displayType.value"
                        placeholder="Choose Display type"
                        v-model="displayType.selectedtype"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="displayType.showerror">{{
                        displayType.errortext
                    }}</nitrozen-error>
                </div>
            </div>
            <div class="dept-box">
                <div class="input-box">
                    <nitrozen-dropdown
                        :label="'Department'"
                        class="filter-dropdown"
                        :multiple="true"
                        :searchable="true"
                        :required="true"
                        :items="department.value"
                        placeholder="Choose departments"
                        v-model="department.selectedtype"
                        @change="getAttribute"
                        @searchInputChange="setDepartmentsList"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="department.showerror">{{
                        department.errortext
                    }}</nitrozen-error>
                </div>
                <div :class="department.showerror ? 'cust-mt' : 'dcb'">
                    <a
                        class="txt-btn"
                        href="/administrator/product/department/create"
                        target="_blank"
                        title="Go to 'Create Department' page"
                        >Create Department</a
                    >
                </div>
            </div>
            <div class="chip-wrapper inline">
                <div
                    v-for="(item, index) of department.selectedtype"
                    :key="index"
                >
                    <nitrozen-chips class="chip">
                        {{ item }}
                        <nitrozen-inline
                            icon="cross"
                            class="nitrozen-icon"
                            @click="department.selectedtype.splice(index, 1)"
                        ></nitrozen-inline>
                    </nitrozen-chips>
                </div>
            </div>
            <div class="row-2">
                <nitrozen-dropdown
                    label="Attribute *"
                    class="filter-dropdown"
                    :disabled="!department.selectedtype.length"
                    :items="deptkey.value"
                    placeholder="Choose Attribute"
                    v-model="deptkey.selectedtype"
                ></nitrozen-dropdown>
                <nitrozen-error v-if="deptkey.showerror">{{
                    deptkey.errortext
                }}</nitrozen-error>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.txt-btn {
    color: @RoyalBlue;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}
.mt-md {
    margin-top: 24px;
}
.chip-wrapper {
    flex-wrap: wrap;
    height: fit-content;
    max-height: 200px;
    overflow-y: auto;
    margin-top: -12px;
    margin-bottom: 20px;
    .blaster-scrollbar;
    .chip {
        margin: 8px 8px 0 0;
    }
}
.inline {
    display: flex;

    &.apart {
        justify-content: space-between;
    }
    .inline-left {
        width: 50%;
    }
    .inline-right {
        flex: 1;
        margin-left: 24px;
    }
}
.left-space-txb {
    margin-left: 12px;
}
.label {
    color: #9b9b9b;
    font-size: 14px;
    margin-bottom: 6px;
    font-weight: 500;
}
.cust-loader {
    display: flex;
    align-items: center;
    margin: 120px auto 0 auto;
    justify-content: center;
    height: 100px;
}
::v-deep .page-slot {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center;
}
.button-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .active-dept {
        color: #2E31BE;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: 600;
    }

    .disabled-dept {
        color: #9b9b9b;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: 600;
    }
}
.main-container {
    background-color: #fff;
    border-radius: 4px;
    margin: 85px 24px 24px 24px !important;
    padding: 24px;
    font-family: Inter;

    .row-1 {
        width: 100%;
        margin: 0 0 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .input-box {
            width: 50%;
        }
    }
    .dept-box {
        width: 100%;
        margin: 0 0 20px 0;
        display: flex;
        // justify-content: space-between;
        // align-items: center;

        .input-box {
            width: 50%;
            margin-right: 20px;
        }
        .dcb {
            align-self: center;
            margin-top: 16px;
        }
        .cust-mt {
            align-self: center;
        }
    }
    .row-2 {
        width: 50%;
        margin: 0 0 20px 0;
        display: flex;
        flex-direction: column;
        align-items: baseline;

        .input-box {
            width: 90%;
        }
    }
    .row-3 {
        width: 100%;
        margin: 24px 0 24px 0;
        .input-text {
            border: 1px solid #eee;
            padding: 12px;
            input {
                padding: 8px 0px 5px 10px;
                border-radius: @BorderRadius;
            }
        }
        .tags {
            min-height: 100px;
            width: 97%;
            cursor: text;
            .chip-input {
                border: none !important;
                &:focus {
                    outline: none;
                }
            }
        }
    }
}
</style>
<script>
import CatalogService from '@/services/catalog.service';
import loader from '@/components/common/loader';
import { debounce } from '@/helper/utils';
import Shimmer from '@/components/common/shimmer';
import PageHeader from '@/components/common/layout/page-header';
import PageError from '@/components/common/page-error';
import {
    NitrozenInput,
    NitrozenError,
    NitrozenButton,
    NitrozenChips,
    NitrozenInline,
    NitrozenBadge,
    NitrozenToggleBtn,
    NitrozenDropdown,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

export default {
    name: 'create-update-variant',
    components: {
        loader,
        Shimmer,
        PageHeader,
        PageError,
        NitrozenInput,
        NitrozenError,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenChips,
        NitrozenInline,
        NitrozenBadge,
        NitrozenToggleBtn
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            uid: null,
            headerText: 'Create Variant',
            saveText: 'Variant created successfully',
            data: [],
            is_active: true,
            searchText: '',
            update: false,
            isLoading: false,
            pageLoading: false,
            pageError: false,
            pagination: {
                total: 0,
                current: 1,
                limit: 100
            },
            display: {
                value: '',
                showerror: false,
                errortext: 'Display name is required, please enter display name'
            },
            displayType: {
                selectedtype: '',
                value: [],
                showerror: false,
                errortext:
                    'Display Type is required, please choose a display type'
            },
            department: {
                selectedtype: [],
                value: [],
                showerror: false,
                errortext: 'Department is required, please choose departments'
            },
            deptkey: {
                selectedtype: '',
                value: [],
                showerror: false,
                errortext: 'Key is required, please choose a key'
            },
            priority: {
                value: 1,
                showerror: false,
                errortext: 'Priority is required, Please enter priority'
            },
            departmentList: []
        };
    },
    mounted() {
        if (this.$route.params.uid) {
            this.pageLoading = true;
            this.uid = this.$route.params.uid;
            this.update = true;
            this.headerText = 'Update Variant';
            this.saveText = 'Variant updated successfully';
            this.getDisplayType();
            this.init();
            this.updateData();
        } else {
            this.getDisplayType();
            this.init();
        }
    },
    methods: {
        init() {
            const pArr = [this.getDepartment()];
            if (this.update) pArr.push(this.updateData());

            Promise.all(pArr)
                .then(() => {
                    this.setDepartmentsList();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getDisplayType() {
            let params = {
                choice_type: 'variants'
            };
            CatalogService.fetchChoices(params)
                .then((res) => {
                    this.displayType.value = res.data.items;
                    this.displayType.value.map((element) => {
                        element.text = element.value;
                        element.value = element.key;
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getDepartment() {
            return new Promise((resolve, reject) => {
                CatalogService.fetchDepartment()
                    .then(({ data }) => {
                        this.departmentList = data.items;
                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        searchDepartment: debounce(function(e) {
            if (e && e.text) {
                this.searchText = e.text;
            }
            this.getDepartment();
        }, 700),
        setDepartmentsList(e = {}) {
            this.department.value = [];
            this.departmentList.forEach((d) => {
                if (
                    !e ||
                    !e.text ||
                    d.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.department.value.push({
                        text: d.name,
                        value: d.slug
                    });
                }
            });
        },
        getAttribute() {
            let params = {
                page_no: 1,
                page_size: 100000,
                department: this.department.selectedtype
            };
            this.isLoading = true;
            CatalogService.fetchAttributes(params)
                .then((res) => {
                    this.deptkey.value = res.data.items;
                    this.deptkey.value.map((element) => {
                        element.text = element.name;
                        element.value = element.slug;
                    });
                    this.isLoading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.pageLoading = false;
                });
        },
        updateData() {
            if (this.uid) {
                let params = {
                    uid: this.uid
                };
                CatalogService.fetchVariants(params)
                    .then((res) => {
                        this.data = res.data.data;
                        this.is_active = this.data[0].is_active;
                        this.display.value = this.data[0].display;
                        this.displayType.selectedtype = this.data[0].display_type;
                        this.department.selectedtype = this.data[0].departments;
                        this.getAttribute();
                        this.deptkey.selectedtype = this.data[0].key;
                        this.priority.value = this.data[0].priority;
                        this.pageLoading = false;
                    })
                    .catch((error) => {
                        console.log(error);
                        this.pageLoading = false;
                        this.pageError = false;
                    });
            }
        },
        redirectToListing() {
            this.$router.push({ path: '/administrator/product/variants' });
        },
        save() {
            let postData = {
                is_active: this.is_active,
                priority: this.priority.value
            };
            if (this.uid && this.update) postData.uid = this.uid;
            if (this.display.value != '') {
                this.display.showerror = false;
                postData.display = this.display.value;
            } else {
                this.display.showerror = true;
            }

            if (this.displayType.selectedtype != '') {
                this.displayType.showerror = false;
                postData.display_type = this.displayType.selectedtype;
            } else {
                this.displayType.showerror = true;
            }

            if (this.department.selectedtype.length > 0) {
                this.department.showerror = false;
                postData.departments = this.department.selectedtype;
            } else {
                this.department.showerror = true;
            }

            if (this.deptkey.selectedtype != '') {
                this.deptkey.showerror = false;
                postData.key = this.deptkey.selectedtype;
            } else {
                this.deptkey.showerror = true;
            }

            // if (this.priority.value >= '0') {
            //     this.priority.showerror = false;
            //     postData.priority = this.priority.value;
            // } else {
            //     this.priority.showerror = true;
            // }

            if (
                !this.display.showerror &&
                !this.displayType.showerror &&
                !this.department.showerror &&
                !this.deptkey.showerror &&
                !this.priority.showerror
            ) {
                CatalogService.saveVariant(postData)
                    .then((res) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showSuccess(`${this.saveText}`, {
                            duration: 2000
                        });
                        setTimeout(() => {}, 2000);
                        this.$router.push({
                            path: '/administrator/product/variants'
                        });
                    })
                    .catch((error) => {
                        this.pageLoading = false;
                        console.error(error);
                        this.$snackbar.global.showError(
                            `${error.response.data.errors.error}`
                        );
                    });
            }
        }
    }
};
</script>
