<template>
    <div class="download-template-drawer-head">
        <nitrozen-dropdown
            class="call-to"
            label="Select Template"
            :items="differentTemplates"
            v-model="selectedTemplate"
            placeholder="Select"
            @change="changeTemplate"
        />        
    </div>
</template>

<script>

/* Package imports */
import { NitrozenDropdown, NitrozenError, NitrozenInput } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';

/* Components import */
import InlineSvg from '@/components/common/inline-svg.vue';

/* Service imports */
import OrderService from '@/services/orders.service.js';

export default {
    name: "download-template-drawer",
    data() {
        return {
            differentTemplates: [],
            selectedTemplate: '',
        }
    },
    props: {
        shipment: {
            type: Object
        } 
    },
    components: {
        InlineSvg,
        NitrozenDropdown,
        NitrozenError,
        NitrozenInput
    },
    mounted() {
        this.$emit('toggleDownloadBtn', true)
        this.fetchTemplateList();
    },
    methods: {
        changeTemplate() {
            this.$emit('toggleDownloadBtn')
        }, 
        callDownloadApi() {
            if(this.selectedTemplate) {
                let params = { template_slug: this.selectedTemplate };
                OrderService.getDownloadTemplate(params)
                .then((res) => {
                    if(res && res.data && res.data.cdn && res.data.cdn.url && res.data.file_name) {
                        this.$snackbar.global.showSuccess(`Download started`, 1000);
                        const url = res.data.cdn.url;
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', res.data.file_name);
                        document.body.appendChild(link);
                        link.click();
                        setTimeout(() => {
                            this.$snackbar.global.showSuccess(`Your file has been successfully downloaded`, 3000);
                        }, 1000);
                    }
                    else {
                        console.error(`Unable to download template`);
                        this.$snackbar.global.showError(
                            `Unable to download template`,
                            3000
                        );
                    }
                })
                .catch(error => {
                    console.error(`Unable to download template`, error);
                    this.$snackbar.global.showError(
                        `Unable to download template`,
                        3000
                    );
                })
            }
        },
        fetchTemplateList() {
            const list =  OrderService.fetchBulkDownloadTemplateList()
            return list
            .then((data) => {
                this.differentTemplates = data.data.template_x_slug;
            })
            .catch((error) => {
                this.$snackbar.global.showError('Unable to get the list of templates');
                console.error("Error in getting the template list:   ", error);
            })
        }
    }
}
</script>

<style lang="less" scoped> 
.donwload-template-drawer-head{
    display: flex;
    flex-direction: column;
    gap: 24px;
}

::v-deep .nitrozen-form-input {
    .nitrozen-input-grp {
        .n-input-textarea {
            height: unset;
        }
    }
}

</style>