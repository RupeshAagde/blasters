<template>
<div>
<loader v-if="loading"></loader>
<div v-else class="top">
    <div>
        <div class="cust-head">{{appData.name}}</div>
        <div class="details">
     <div class="brand-img-div" ref="adminDialog" v-if="appData.logo">
                    <img
                        :src="appData.logo.secure_url | imagetransform({ width: 130 })"
                        class="brand-img"
                    />
                </div>
                <div class="app-deatils">
                        <div class="line-2" v-if="appData.token">
                            <div class="cust-head-1">Token</div>
                            <div
                                class="cust-pointer"
                                :title="`${appData.token} (Click to copy)`"
                                @click="copy(appData.token)"
                            >
                                {{ appData.token }}
                            </div>
                        </div>
                        <div class="line-2" v-if="appData.id">
                            <div class="cust-head-1">Application ID</div>
                            <div
                                class="cust-app cust-pointer"
                                :title="`${appData.id} (Click to copy)`"
                                @click="copy(appData.id)"
                            >
                                {{ appData.id }}
                            </div>
                        </div>
                        <div class="line-2" v-if="appData.domain">
                            <div class="cust-head-1" v-if="appData.domain.name">
                                Domain
                            </div>
                            <div
                                v-if="appData.domain.name"
                                class="cust-domain"
                                :title="appData.domain.name"
                            >
                                <a
                                    :href="`https://${appData.domain.name}`"
                                    target="_blank"
                                    >{{ appData.domain.name }}</a
                                >
                            </div>
                        </div>
                        <div class="line-2" v-if="appData.description">
                            <div class="cust-head-1">Description</div>
                            <div
                                class="cust-app cust-pointer"
                                :title="`${appData.Description}`"
                                @click="copy(appData.description)"
                            >
                                {{ appData.description }}
                            </div>
                        </div>
                        <div class="card-content-line-3">
                {{
                    `Created on ${new Date(
                        appData.created_at
                    ).toDateString()}`
                }}
            </div>
            <div class="card-content-line-3">
                {{
                    `Modified on ${new Date(
                        appData.modified_at
                    ).toDateString()}`
                }}
            </div>
               
                </div>
                </div>
    </div>

    
</div>
</div>
    
</template>
<script>
import CompanyService from '@/services/company-admin.service';
import { copyToClipboard } from '@/helper/utils.js';
import loader from '@/components/common/loader.vue';

export default {
    name: "application-info",
    components:{
    loader,
    },
    data(){
        return{
loading: false,
appData: {}
        }
    },
    mounted(){
        this.getApplication()
    },
    methods: {
        getApplication(){
            this.loading = true;
            let appId = this.$route.params.appId
           CompanyService.getApplication(appId)
           .then(res=>{
               this.appData = res.data
               this.loading = false
               this.$emit('emitApplication', { appName: this.appData.name });
           })
           .catch(err=>{
               console.log(err);
           })
        },
          copy(text) {
            copyToClipboard(text);
            if (text) {
                this.$snackbar.global.showInfo('Copied to clipboard');
            } else {
                this.$snackbar.global.showError('Failed to Copy');
            }
        },

    }

}
</script>
<style scoped>
.top{
background-color: white;
padding: 24px;
}
.brand-img-div {
                height: 80px;
                width: 80px;
                cursor: pointer;
                margin-right: 14px;
                
            }
            .brand-img {
                    width: 100%;
                    height: 100%;
                }
                .brand-img:hover {
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                }
                 .cust-head {
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 160px;
                font-size: 24px;
                color: #2e31be;
                font-weight: bold;
                cursor: pointer; 
                margin-bottom: 12px;
            }
            .cust-head-1 {
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 160px;
                font-size: 14px;
                color: #2e31be;
                font-weight: bold;
                cursor: pointer; 
                margin-bottom: 12px;
            }
            .details{
                display: flex;
            }
             .line-2 {
            margin: 12px 0;
            display: flex;
            font-size: 14px;
            line-height: 20px;
            color: #41434c;
            font-weight: 200;
            justify-content: space-between;
            
             }
             .card-content-line-3 {
    color: #9B9B9B;
    line-height: 22px;
    font-size: 12px;
    justify-content: flex-end;
    display: flex;
}

</style>