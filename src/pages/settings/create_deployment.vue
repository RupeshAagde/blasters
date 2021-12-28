<template>
    <div class="create-deployment-container">
        <page-header title="Customize Deployment" @backClick="backClick">
            <nitrozen-button
                :theme="'secondary'"
                v-flatBtn
                @click="onSave"
                >Save</nitrozen-button>
        </page-header>
        <div class="main-container">
            <div class="create-deployment-form">
                <h2 class="deployment-form-title">Custom Deployment Form</h2>
                <nitrozen-dropdown
                    class="company-name"
                    label="Company*"
                    :items="companyListFiltered"
                    v-model="selectedCompany"
                    :searchable="true"
                    placeholder="Company name"
                    @searchInputChange="onSearchInputUpdateList"
                ></nitrozen-dropdown>

                <nitrozen-input
                    class="deployment-name"
                    v-model="deploymentName"
                    label="Deployment Name*"
                    placeholder="Deployment name"
                    type="string"
                >
                </nitrozen-input>
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
            deploymentList: [],
            companyList: [],
            companyListFiltered: [],
            selectedCompany: '',
            deploymentName: ''
        }
    },
    beforeMount() {
        CompanyService.getCompanyList()
            .then(({data}) => {
                this.deploymentList = data.items;
                this.companyList = data.items.map(element => {
                    return {
                        "text": element.name,
                        "value": element.name,
                    }
                });

                this.companyListFiltered = this.companyList;
            });
    },
    methods: {
        backClick() {
            this.$router.push({
                path: '/administrator/settings/deployments'
            });
        },
        onSearchInputUpdateList(e) {
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
        onSave() {
            const { uid: companyId } = this.deploymentList.find(element => element.name === this.selectedCompany);

            const payLoad = {
                "company_id": companyId,
                "deployment_ingress": this.deploymentName
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
        font-size: 20px;
        font-weight: 500;
    }

    .deployment-name, .company-name {
        margin-top: 12px;
    }
}

</style>
