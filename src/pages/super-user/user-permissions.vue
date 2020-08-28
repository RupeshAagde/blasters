<template>
    <div>
        <nitrozen-dropdown
            style="width:300px;"
            :label="'Select Role'"
            :items="
                aclData.roles.map((role) => {
                    return {
                        text: role.title,
                        value: role.key
                    };
                })
            "
            v-model="user_data.roles[0]"
        ></nitrozen-dropdown>
        <div class="title-label cl-DustyGray2 dark-xxs">Permissions</div>
        <permissions
            :permissionData="this.aclData"
            :currentRole="user_data.roles[0]"
            :currentPermissions="userPermissions"
            :group="''"
            @permission-data="(value) => (this.user_data.permissions = value)"
        ></permissions>
        <div class="title-label cl-DustyGray2 dark-xxs">Company Access</div>
        <div style="display: flex;">
            <nitrozen-radio
                class="radio-btn"
                :radioValue="'true'"
                :name="'company_selection'"
                :value="user_data.access.all.toString()"
                @input="(value) => (user_data.access.all = value === 'true')"
                >All</nitrozen-radio
            >
            <nitrozen-radio
                class="radio-btn"
                :radioValue="'false'"
                :name="'company_selection'"
                :value="user_data.access.all.toString()"
                @input="(value) => (user_data.access.all = value === 'true')"
                >Specific Companies</nitrozen-radio
            >
        </div>
        <nitrozen-dropdown
            v-show="!user_data.access.all"
            class="title-label"
            :searchable="true"
            :multiple="true"
            :placeholder="'Search company'"
            style="width: 300px;"
            @searchInputChange="companySearch"
            :value="user_data.access.company"
            :items="
                companies.map((item) => {
                    return {
                        text: `${item.name} (${item.uid})`,
                        value: item.uid
                    };
                })
            "
            @input="updateSelectedCompany"
        ></nitrozen-dropdown>
        <div class="title-label" v-if="selectedCompany.length">
            <nitrozen-chips
                style="margin-bottom: 8px;"
                v-for="(company, index) in selectedCompany"
                :key="index"
                >{{ company.name }}
                <nitrozen-inline
                    :icon="'cross'"
                    class="nitrozen-icon"
                    v-on:click="removeChip(index)"
                ></nitrozen-inline>
            </nitrozen-chips>
        </div>
    </div>
</template>

<style lang="less" scoped>
.title-label {
    margin-top: 16px;
    position: relative;
}

.radio-btn {
    margin-top: 12px;
    + .radio-btn {
        margin-left: 24px;
    }
}
</style>

<script>
import {
    NitrozenDropdown,
    NitrozenRadio,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';
import AuthService from '../../services/auth.service';
import CompanyService from '../../services/company-admin.service';
import { ADMIN_PERMISSIONS } from '../../store/getters.type';
import { FETCH_ADMIN_PERMISSIONS } from '../../store/action.type';
import { mapGetters } from 'vuex';
import { Permissions } from '../../components/common/';

export default {
    name: 'user-permissions',
    props: {
        user_data: {
            type: Object,
            default: function() {
                return {
                    meta: {},
                    permissions: [
                        'company',
                        'plans',
                        'admin-access',
                        'support',
                        'settings'
                    ],
                    roles: ['admin'],
                    access: {
                        all: true,
                        company: []
                    }
                };
            }
        }
    },
    components: {
        permissions: Permissions,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-inline': NitrozenInline
    },
    data() {
        return {
            companies: [],
            selectedCompany: [],
            aclData: {
                permissions: [
                    {
                        title: 'Company',
                        key: 'company',
                        description:
                            'Get access to verify the brands and selling locations of the company.'
                    },
                    {
                        title: 'Subscription Plans',
                        key: 'plans',
                        description:
                            'Access to creating new plan and editing existing plans'
                    },
                    {
                        title: 'Admin User Access',
                        key: 'admin-access',
                        description: 'Allow to add or edit Admin user access'
                    },
                    {
                        title: 'Support Center',
                        key: 'support',
                        description: 'See and resolve assigned tickets'
                    },
                    {
                        title: 'Settings',
                        key: 'settings',
                        description:
                            'Change settings to configure and customize platform'
                    }
                ],
                roles: [
                    {
                        title: 'Full Access',
                        key: 'admin',
                        permissions: [
                            'company',
                            'plans',
                            'admin-access',
                            'support',
                            'settings'
                        ]
                    },
                    {
                        title: 'Custom',
                        key: 'custom',
                        permissions: []
                    }
                ]
            }
        };
    },
    created() {
        if (!this.aclPermissions) {
            this.$store.dispatch(FETCH_ADMIN_PERMISSIONS);
        }
        this.fetchCompany();
    },
    computed: {
        userPermissions() {
            return this.user_data.permissions;
        },
        ...mapGetters({
            aclPermissions: ADMIN_PERMISSIONS
        })
    },
    methods: {
        removeChip(index) {
            this.selectedCompany.splice(index, 1);
            this.user_data.access.company.splice(index, 1);
        },
        updateSelectedCompany(value) {
            let selectedCompany = this.user_data.access.company;
            this.user_data.access.company = value;
            for (let companyId of selectedCompany) {
                let itemIndex = value.findIndex((uid) => uid === companyId);
                if (itemIndex < 0) {
                    this.selectedCompany.splice(index, 1);
                }
            }
            for (let companyId of value) {
                let itemIndex = selectedCompany.findIndex(
                    (uid) => uid === companyId
                );
                if (itemIndex < 0) {
                    this.selectedCompany.push(
                        this.companies.find((comp) => comp.uid === companyId)
                    );
                }
            }
        },
        companySearch(e) {
            _.debounce((text) => {
                this.fetchCompany(text);
            }, 600)(e.text);
        },
        fetchCompany(searchCompany) {
            const query = {
                page_no: 0,
                page_size: 10
            };

            if (searchCompany) {
                query.name = searchCompany;
            }
            return CompanyService.getCompanyList(query)
                .then(({ data }) => {
                    this.companies = data.data;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to load companies');
                    console.log(err);
                });
        }
    }
};
</script>
