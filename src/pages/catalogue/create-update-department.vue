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
        <page-error
            class="cust-error"
            v-else-if="pageError && !pageLoading"
            @tryAgain="updateData"
        ></page-error>
        <div v-else class="main-container">
            <div class="row-1">
                <div class="input-box">
                    <nitrozen-input
                        label="Name *"
                        v-model="name.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="name.showerror">
                        {{ name.errortext }}
                    </nitrozen-error>
                </div>
                <div class="input-box left-space-txb">
                    <nitrozen-input
                        label="Slug *"
                        pattern="[a-z0-9]+(?:--?[a-z0-9]+)*"
                        v-model="slug.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="slug.showerror">
                        {{ slug.errortext }}
                    </nitrozen-error>
                    <nitrozen-error
                        v-else-if="
                            slug.value &&
                                !/^[a-z0-9]+(?:--?[a-z0-9]+)*$/.test(
                                    slug.value.trim()
                                )
                        "
                        >Slug Invalid</nitrozen-error
                    >
                </div>
            </div>
            <div class="row-2">
                <nitrozen-input
                    class="input-box"
                    label="Priority *"
                    v-model="priority.value"
                    type="number"
                ></nitrozen-input>
                <nitrozen-error v-if="priority.showerror">
                    {{ priority.errortext }}
                </nitrozen-error>
            </div>
            <div class="row-3">
                <div class="n-input-label">Synonyms *</div>
                <div class="input-text tags" @click="$refs.synonymText.focus()">
                    <nitrozen-chips
                        v-for="(item, index) in synonym.value"
                        :key="'synonymText_' + index"
                    >
                        {{ item }}
                        <nitrozen-inline
                            :icon="'cross'"
                            class="nitrozen-icon"
                            v-on:click="removeSearchInput(index)"
                        ></nitrozen-inline>
                    </nitrozen-chips>
                    <input
                        type="text"
                        class="chip-input cl-Mako light-xs"
                        @keydown="getSearchText()"
                        @focusout="addSearchText()"
                        ref="synonymText"
                        v-model="synonymText"
                    />
                </div>
            </div>
            <div>
                <div class="n-input-label">Logo *</div>
                <image-uploader-tile
                    label="Logo *"
                    aspectRatio="1:1"
                    @delete="logo.value = ''"
                    @save="logo.value = $event"
                    v-model="logo.value"
                    :fileName="logo.value"
                    namespace="platform-free-logo"
                ></image-uploader-tile>
                <nitrozen-error v-if="logo.showerror">
                    {{ logo.errortext }}
                </nitrozen-error>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
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
        color: #5c6bdd;
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
.cust-error {
    margin-top: 60px;
}
.cust-loader {
    display: flex;
    align-items: center;
    margin: 120px auto 0 auto;
    justify-content: center;
    height: 100px;
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
.main-container {
    background-color: #fff;
    border-radius: 4px;
    margin: 85px 24px 24px 24px !important;
    padding: 24px;
    font-family: Poppins;

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
    .row-2 {
        width: 100%;
        margin: 0 0 24px 0;
        display: flex;
        flex-direction: column;
        align-items: baseline;

        .input-box {
            width: 49.5%;
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
import PageHeader from '@/components/common/layout/page-header';
import loader from '@/components/common/loader';
import Shimmer from '@/components/common/shimmer';
import { ImageUploaderTile } from '@/components/common/';
import { convertToSlug } from '@/helper/utils';
import PageError from '@/components/common/page-error';
import {
    NitrozenInput,
    NitrozenError,
    NitrozenButton,
    NitrozenChips,
    NitrozenInline,
    NitrozenBadge,
    NitrozenToggleBtn,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

export default {
    name: 'create-update-department',
    components: {
        'nitrozen-chips': NitrozenChips,
        loader,
        PageHeader,
        PageError,
        Shimmer,
        NitrozenInput,
        NitrozenBadge,
        NitrozenError,
        ImageUploaderTile,
        NitrozenToggleBtn,
        NitrozenButton,
        NitrozenInline
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mounted() {
        if (this.$route.params.deptId) {
            this.pageLoading = true;
            this.uid = this.$route.params.deptId;
            this.update = true;
            this.headerText = 'Update Department';
            this.saveText = 'Department updated successfully';
            this.updateData();
        }
        this.attachNameWatcher();
    },
    data() {
        return {
            uid: null,
            update: false,
            data: [],
            is_active: true,
            pageLoading: false,
            pageError: false,
            saveText: 'Department saved successfully',
            headerText: 'Create Department',
            synonymText: '',
            name: {
                value: '',
                showerror: false,
                errortext: 'Name is required, Please enter name'
            },
            slug: {
                value: '',
                showerror: false,
                errortext: 'Slug is required, Please enter slug'
            },
            priority: {
                value: '',
                showerror: false,
                errortext: 'Priority is required, Please enter priority'
            },
            logo: {
                value: '',
                showerror: false,
                errortext: 'Logo is required, Please upload a logo'
            },
            synonym: {
                value: [],
                showerror: false,
                errortext: 'Synonyms are required, Please enter synonym'
            }
        };
    },
    methods: {
        updateData() {
            if (this.uid) {
                let params = {
                    uid: this.uid
                };
                CatalogService.fetchDepartment(params)
                    .then((res) => {
                        this.data = res.data.data;
                        this.is_active = this.data[0].is_active;
                        this.name.value = this.data[0].name
                            ? this.data[0].name
                            : '';
                        this.slug.value = this.data[0].slug
                            ? this.data[0].slug
                            : '';
                        this.priority.value = this.data[0].priority_order
                            ? this.data[0].priority_order
                            : '';
                        this.logo.value = this.data[0].logo
                            ? this.data[0].logo
                            : '';
                        this.synonym.value = this.data[0].synonyms
                            ? this.data[0].synonyms
                            : [];
                        this.pageLoading = false;
                    })
                    .catch((error) => {
                        console.error(error);
                        this.pageLoading = false;
                        this.pageError = true;
                    });
            }
        },
        attachNameWatcher() {
            // if (!this.update) {
            this.$watch(
                'name',
                function handler(val) {
                    this.slug.value = convertToSlug(this.name.value.trim());
                },
                { deep: true }
            );
            // }
        },
        removeSearchInput(index) {
            this.synonym.value.splice(index, 1);
        },
        getSearchText() {
            if (
                event.keyCode == 32 ||
                event.keyCode == 13 ||
                event.keyCode == 44 ||
                event.keyCode == 9 ||
                event.keyCode == 188
            ) {
                this.addSearchText(event);
                event.target.value = '';
            }
            if (event.keyCode == 8 && !this.synonymText) {
                if (this.synonym.value.length) {
                    this.synonym.value.pop();
                }
            }
        },
        addSearchText(event) {
            if (this.synonymText) {
                if (
                    this.synonym.value.filter((it) => it === this.synonymText)
                        .length === 0
                ) {
                    let splitString = this.synonymText.split(',');
                    for (let i = 0; i < splitString.length; i++) {
                        this.synonym.value.push(splitString[i]);
                    }
                }
                this.synonymText = '';
            }
        },
        redirectToListing() {
            this.$router.push({ path: '/administrator/catalog/department' });
        },
        save() {
            let postdata = {
                is_active: this.is_active,
                synonyms: []
            };
            if (this.update && this.uid) postdata.uid = this.uid;
            if (this.name.value !== '') {
                this.name.showerror = false;
                postdata.name = this.name.value;
            } else {
                this.name.showerror = true;
            }

            if (this.slug.value !== '') {
                this.slug.showerror = false;
                postdata.slug = this.slug.value;
            } else {
                this.slug.showerror = true;
            }

            if (this.priority.value > '-1') {
                this.priority.showerror = false;
                postdata.priority_order = this.priority.value;
            } else {
                this.priority.showerror = true;
            }

            if (this.logo.value) {
                this.logo.showerror = false;
                postdata.logo = this.logo.value;
            } else {
                this.logo.showerror = true;
            }

            if (this.synonym.value.length > 0) {
                postdata.synonyms = this.synonym.value;
            }

            if (
                !this.name.showerror &&
                !this.slug.showerror &&
                !this.priority.showerror &&
                !this.logo.showerror
            ) {
                this.pageLoading = true;
                CatalogService.saveDepartment(postdata)
                    .then((res) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showSuccess(`${this.saveText}`, {
                            duration: 2000
                        });
                        setTimeout(() => {}, 2000);
                        this.$router.push({
                            path: '/administrator/catalog/department'
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
