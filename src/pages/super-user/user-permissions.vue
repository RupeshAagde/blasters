<template>
    <div v-if="aclPermissions">
        <nitrozen-dropdown
            style="width:300px;"
            :label="'Select Role'"
            :items="
                aclPermissions.roles.map((role) => {
                    return {
                        text: role.title,
                        value: role.key
                    };
                })
            "
            v-model="userData.roles[0]"
        ></nitrozen-dropdown>
        <div class="title-label cl-DustyGray2 dark-xxs">Permissions</div>
        <permissions
            :permissionData="aclPermissions"
            :currentRole="userData.roles[0]"
            :currentPermissions="userPermissions"
            :group="''"
            @permission-data="(value) => (this.userData.permissions = value)"
        ></permissions>
        <div class="title-label cl-DustyGray2 dark-xxs">
            Company Access
            <nitrozen-tooltip
                :tooltipText="
                    'Allow user access for all companies or specific or none on Fynd Platform'
                "
            ></nitrozen-tooltip>
        </div>
        <div style="display: flex;">
            <nitrozen-radio
                class="radio-btn"
                :radioValue="'true'"
                :name="'company_selection'"
                :value="userData.access.all.toString()"
                @input="
                    (value) => {
                        userData.access.all = value === 'true';
                        if (userData.access.all) {
                            userData.access.company = [];
                        }
                    }
                "
                >All</nitrozen-radio
            >
            <nitrozen-radio
                class="radio-btn"
                :radioValue="'false'"
                :name="'company_selection'"
                :value="userData.access.all.toString()"
                @input="(value) => (userData.access.all = value === 'true')"
                >Specific Companies</nitrozen-radio
            >
        </div>
        <nitrozen-dropdown
            v-show="!userData.access.all"
            class="title-label"
            :searchable="true"
            :multiple="true"
            :placeholder="'Search company'"
            style="width: 300px;"
            @searchInputChange="companySearch"
            :value="userData.access.company"
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
        <div
            class="title-label"
            v-if="!userData.access.all && selectedCompany.length"
        >
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
        <div v-else-if="!userData.access.all" class="title-label dark-xxs">
            No company selected
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
    NitrozenInline,
    NitrozenTooltip
} from '@gofynd/nitrozen-vue';
import AuthService from '../../services/auth.service';
import CompanyService from '../../services/company-admin.service';
import { ADMIN_PERMISSIONS } from '../../store/getters.type';
import { FETCH_ADMIN_PERMISSIONS } from '../../store/action.type';
import { mapGetters } from 'vuex';
import { Permissions } from '../../components/common/';
import _ from 'lodash';

export default {
    name: 'user-permissions',
    props: {
        user_data: {
            type: Object,
            required: true
        },
        selected_company: {
            type: Array
        }
    },
    components: {
        permissions: Permissions,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-inline': NitrozenInline,
        'nitrozen-tooltip': NitrozenTooltip
    },
    data() {
        return {
            companies: [],
            selectedCompany: [],
            userData: null
        };
    },
    created() {
        if (!this.aclPermissions) {
            this.$store.dispatch(FETCH_ADMIN_PERMISSIONS);
        }
        this.fetchCompany();
        this.userData = _.cloneDeep(this.user_data);
    },
    computed: {
        userPermissions() {
            return this.userData.permissions;
        },
        ...mapGetters({
            aclPermissions: ADMIN_PERMISSIONS
        })
    },
    watch: {
        selected_company() {
            this.selectedCompany = [...this.selected_company];
        }
    },
    methods: {
        removeChip(index) {
            this.selectedCompany.splice(index, 1);
            this.userData.access.company.splice(index, 1);
        },
        updateSelectedCompany(value) {
            let selectedCompany = this.userData.access.company;
            this.userData.access.company = value;
            for (let companyId of selectedCompany) {
                let itemIndex = value.findIndex((uid) => uid === companyId);
                if (itemIndex < 0) {
                    let index = selectedCompany.indexOf(companyId);
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
                page_no: 1,
                page_size: 10
            };

            if (searchCompany) {
                query.q = searchCompany;
            }
            return CompanyService.getCompanyList(query)
                .then(({ data }) => {
                    this.companies = data.items;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to load companies');
                    console.log(err);
                });
        }
    }
};
</script>
