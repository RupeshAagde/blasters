<template>
    <div class="create-deployment-container">
        <page-header title="Assign Deployment" @backClick="backClick">
            <nitrozen-button
                :theme="'secondary'"
                v-flatBtn
                @click="onSave"
                >Save</nitrozen-button>
        </page-header>
        <div class="main-container">
            <div class="create-deployment-form">
                <h2 class="deployment-form-title">Assign Deployment</h2>
                <nitrozen-dropdown
                    class="company-name"
                    label="Company Name"
                    :items="companyListFiltered"
                    v-model="selectedCompany"
                    :searchable="true"
                    placeholder="Company name"
                    @searchInputChange="onSearchInputUpdateCompanyList"
                    :required="true"
                ></nitrozen-dropdown>

                <nitrozen-dropdown
                    class="deployment-name"
                    label="Deployment Name"
                    :items="deploymentListFiltered"
                    v-model="selectedDeployment"
                    :searchable="true"
                    placeholder="Deployment name"
                    @searchInputChange="onSearchInputUpdateDeploymentList"
                    :required="true"
                >
                </nitrozen-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/common/layout/page-header';
import { NitrozenButton, NitrozenDropdown, NitrozenInput, flatBtn } from '@gofynd/nitrozen-vue';
import CompanyService from '@/services/company-admin.service';

export default {
    name: 'create-deployment',
    components: {
        PageHeader,
        'nitrozen-button': NitrozenButton,
        'nitrozen-dropdown' :NitrozenDropdown,
        'nitrozen-input': NitrozenInput,
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            deploymentDetails: [],
            companyList: [],
            companyListFiltered: [],
            deploymentList: [],
            deploymentListFiltered: [],
            selectedCompany: '',
            selectedDeployment: ''
        }
    },
    beforeMount() {
        const REQUEST_PARAMS = {
            page_size: 999
        }

        CompanyService.getCompanyList(REQUEST_PARAMS)
            .then(({data}) => {
                this.deploymentDetails = data.items;
                this.companyList = data.items.map(element => {
                    return {
                        "text": element.name,
                        "value": element.name,
                    }
                });

                this.companyListFiltered = this.companyList;
            });

        CompanyService.getDeploymentList()
            .then(({data}) => {
                this.deploymentList = data.map(element => {
                    const deploymentName = Object.keys(element)[0];
                    return {
                        "text": deploymentName,
                        "value": element[deploymentName]
                    }
                });
                
                this.deploymentListFiltered  = this.deploymentList;
            });
    },
    methods: {
        backClick() {
            this.$router.push({
                path: '/administrator/settings/deployments'
            });
        },
        onSearchInputUpdateCompanyList(e) {
            if (e && e.text) {
                this.companyListFiltered = this.companyList.filter(x => {
                    let text = x.text.toLowerCase();
                    let searchText = e.text.toLowerCase()
                    return text.indexOf(searchText) > -1;
                });
            } else {
                this.companyListFiltered = this.companyList;
            }
        },
        onSearchInputUpdateDeploymentList(e) {
            if (e && e.text) {
                this.deploymentListFiltered = this.deploymentList.filter(x => {
                    let text = x.text.toLowerCase();
                    let searchText = e.text.toLowerCase()
                    return text.indexOf(searchText) > -1;
                });
            } else {
                this.deploymentListFiltered = this.deploymentList;
            }
        },
        onSave() {
            const { uid: companyId } = this.deploymentDetails.find(element => element.name === this.selectedCompany);
            const DEPLOYMENT_CONFIG = this.deploymentList.find(element => element.value === this.selectedDeployment);

            const payLoad = {
                "company_id": companyId,
                "deployment_ingress": DEPLOYMENT_CONFIG.value,
                "deployment_name": DEPLOYMENT_CONFIG.text
            };

            CompanyService.createDeploymentMapping(payLoad)
                .then(() => {
                    this.$snackbar.global.showSuccess('Deployment Mapping created successfully');
                    
                    this.$router.push({
                       path: '/administrator/settings/deployments'
                    });
                })
                .catch(err => {
                    this.$snackbar.global.showError('Error creating deployment mapping');
                });
        }
    }
}
</script>

<style lang="less" scoped>

.main-container {
    margin: 24px;
    padding: 24px;
    position: relative;
    top: 58px;
    min-height: 200px;

    .create-deployment-form {
        background: white;
        padding: 24px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
    }

    .deployment-form-title {
        font-size: 18px;
        font-weight: 600;
    }

    .deployment-name, .company-name {
        margin-top: 12px;
    }
}

</style>
