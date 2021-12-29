<template>
    <div class="deployment-listing-container">
        <div class="main-container">
            <div class="jumbotron-container">
                <jumbotron
                    title="Deployments"
                    desc="By default, company will be in default deployment. Map company to custom dedployment."
                    btnLabel="Assign Deployment"
                    @btnClick="createDeployment"
                ></jumbotron>
            </div>

            <div>
                <page-error
                    class="cust-error"
                    v-if="pageError"
                    text="errorMessage"
                >
                </page-error>
                <ul v-else-if="deploymentMapping.length > 0">
                    <li v-for="deployment in deploymentMapping" class="blaster-list-card-container" :key="deployment.name">
                        <div class="card-content-section">
                            <div class="card-content-line-1">
                                <div class="card-content">
                                    <span class="card-content__label">Company</span>
                                    <span class="cst-clr">{{deployment.name}}</span>
                                    <span class="card-content__timestamp">Created at: {{getDeploymentDate(deployment.created_at)}} - {{getDeploymentTime(deployment.created_at)}}</span>
                                </div>
                                <ukt-inline-svg
                                    src="arrow-right-black"
                                    class="arrow-right"
                                ></ukt-inline-svg>
                                <div class="card-content">
                                    <span class="card-content__label">Deployment</span>
                                    <span class="cst-clr">{{deployment.deployment_name}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-badge-section" :id="deployment._id" @click="openConfirmationDialog(deployment._id, $event)">
                            <ukt-inline-svg
                                src="delete"
                                class="delete-icon"
                            ></ukt-inline-svg>
                        </div>
                    </li>
                </ul>
                <adm-no-content
                    v-else
                    text="No Deployment Mappings Available."
                ></adm-no-content>
            </div>
        </div>

        <!-- Confirmation Dialog -->
        <nitrozen-dialog ref="confirm-dialog" title="Confirmation">
            <template slot="body">
                <p>Are you sure you want to delete this deployment mapping ?</p>
            </template>
            <template slot="footer">
                <div class="footer-actions-buttons">
                    <nitrozen-button
                        theme="secondary"
                        @click="closeConfirmationDialog"
                        v-strokeBtn
                        >Cancel
                    </nitrozen-button>
                    <nitrozen-button
                        theme="secondary"
                        class="mr-24"
                        @click="deleteMapping"
                        v-flatBtn
                        ref="delete-btn"
                        >Delete
                    </nitrozen-button>
                </div>
            </template>
        </nitrozen-dialog>
    </div>
</template>

<script>
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import Jumbotron from '@/components/common/jumbotron';
import {
    NitrozenButton,
    NitrozenDialog,
    strokeBtn,
    flatBtn
} from '@gofynd/nitrozen-vue';
import { PageHeader } from '@/components/common/';
import CompanyService from '@/services/company-admin.service';
import PageError from '@/components/common/page-error';
import AdmNoContent from '@/components/common/page-empty';

export default {
    name: 'deployment',
    data() {
        return {
            deploymentMapping: [],
            deploymentMappingId: '',
            errorMessage: 'No deployment Mappings found.!',
            pageError: false
        }
    },
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-dialog': NitrozenDialog,
        'page-error': PageError,
        'adm-no-content': AdmNoContent,
        Jumbotron,
        PageHeader,
        UktInlineSvg
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    beforeMount() {
        this.getDeployments();
    },
    methods: {
        getDeployments() {
            CompanyService.getDeploymentMappings()
                .then(({data}) => {
                    this.deploymentMapping = data;
                })
                .catch(err => {
                    this.pageError = true;
                })
        },
        createDeployment() {
            this.$router.push({
                path: '/administrator/settings/deployments/create'
            });
        },
        deleteMapping() {
            CompanyService.deleteDeploymentMappingById(this.deploymentMappingId)
                .then(() => {
                    this.$snackbar.global.showSuccess('Deployment Mapping deleted successfully');
                    
                    this.closeConfirmationDialog();
                    this.getDeployments();
                })
                .catch(err => {
                    console.log('Error', err);
                    this.$snackbar.global.showError('Error deleting deployment mapping');
                });
        },
        openConfirmationDialog(deploymentId, event) {
            this.deploymentMappingId = deploymentId;
            
            this.$refs['confirm-dialog'].open({
                width: '400px',
                height: '215px',
                showCloseButton: true
            });
        },
        closeConfirmationDialog() {
            this.$refs['confirm-dialog'].close();
        },
        getDeploymentDate(dateString) { return dateString.split('T')[0]; },
        getDeploymentTime(dateString) { return dateString.split('T')[1].slice(0, -1)}
    }
};
</script>

<style lang="less" scoped>

.deployment-listing-container {
    height: 100%;

    .main-container {
        background-color: white;
        margin: 24px;
        padding: 24px;
        position: relative;
        height: 100%;
    }
    
    .blaster-list-card-container{
        height: auto;
        cursor: default;
    }

    .card-content-line-1 {
        display: flex;
    }

    .card-content {
        display: flex;
        flex-direction: column;
    }

    .card-content__label {
        font-size: 12px;
        color: #aaa;
    }

    .card-content__timestamp {
        font-size: 12px;
        color: #aaa;
        margin-top: 12px;
    }

    .arrow-right {
        margin-left: 12px;
        margin-right: 12px;
    }

    .card-badge-section {
        cursor: pointer;
    }
}

</style>
