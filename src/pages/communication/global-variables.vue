<template>
    <div>
        <adm-page-header title="Global Variable" @backClick="backRedirect">
            <div class="header-button-container">
                <!-- <nitrozen-button
                    :theme="'secondary'"
                    v-flatBtn
                    class="btn-wrapper"
                    >Save</nitrozen-button
                > -->
            </div>
        </adm-page-header>
        <div class="main-body">
            <div class="container">
                <span class="title">Editable</span>
                <div class="form-field from-container">
            <div
                class="object"
                :key="index"
                v-for="(from_address, index) in from_address.value"
            >
                <div class="field-wrap mg-r-24">
                    <nitrozen-input
                        v-model="from_address.key"
                        :label="'Key*'"
                        :placeholder="'Enter your key'"
                    >
                    </nitrozen-input>
                    <nitrozen-error v-if="from_address.nameError"
                        >{{ from_address.nameError }}
                    </nitrozen-error>
                </div>
                <div class="field-wrap value">
                    <nitrozen-input
                        v-model="from_address.value"
                        :label="'Value*'"
                        :placeholder="'Enter your value'"
                    >
                    </nitrozen-input>
                    <nitrozen-error v-if="from_address.emailError"
                        >{{ from_address.emailError }}
                    </nitrozen-error>
                </div>
                <div @click="removeFrom(index)" class="link mg-r-24 remove">
                    <adm-inline-svg src="delete"></adm-inline-svg>
                </div>
            </div>
            <div @click="addMoreFrom" class="bold-link">Add more</div>
        </div>
            </div>
        </div>
        <div class="main-body-1">
            <div class="container">
                <span class="title">Read Only</span>
                <div class="form-field from-container">    
            <div
                class="object"
                :key="index"
                v-for="(from_address, index) in read_only"
            >
                <div class="field-wrap mg-r-24">
                    <nitrozen-input
                        v-model="from_address.key"
                        :label="'Key*'"
                        :placeholder="'Enter your key'"
                        :disabled="true"
                    >
                    </nitrozen-input>
                </div>
                <div class="field-wrap value">
                    <nitrozen-input
                        v-model="from_address.value"
                        :label="'Value*'"
                        :placeholder="'Enter your value'"
                        :disabled="true"
                    >
                    </nitrozen-input>
                </div>
            </div>
        </div>
            </div>
        </div>
    </div>
</template>
<script>
import Jumbotron from '@/components/common/jumbotron';
import loader from '@/components/common/loader.vue';
import PageHeader from '@/components/common/layout/page-header';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import CommunicationServices from '../../services/pointblank.service';

import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
     NitrozenInput,
    NitrozenError,
} from '@gofynd/nitrozen-vue';
export default {
    name: 'global-variables',
    components: {
        loader: loader,
        'nitrozen-button': NitrozenButton,
        'adm-page-header': PageHeader,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'adm-inline-svg': adminlinesvg
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            from_address: this.getInitialValue([
                    {
                        name: null,
                        email: null,
                        nameError: '',
                        emailError: '',
                        is_default: true
                    }
                ]),
            read_only : []    
        };
    },
    mounted(){
     this.getVariables()
    },
    methods: {
        getVariables(){
          let data = {}  
          CommunicationServices.getGlobalVariables()
          .then(res=>{
              data = res.data
              var editable = Object.entries(data.editable).map(([key, value]) => ({key,value}));
              var readOnly = Object.entries(data.read_only).map(([key, value]) => ({key,value}));
              this.from_address.value = editable
              this.read_only = readOnly;
          })
        },
        backRedirect() {
            this.$router.back();
        },
        getInitialValue(val = null) {
            return {
                showerror: false,
                value: val,
                errortext: ''
            };
        },
         addMoreFrom() {
            this.from_address.value.push({
                name: null,
                email: null,
                nameError: '',
                emailError: '',
                is_default: false
            });
        },
        removeFrom(index) {
            if (this.from_address.value.length > 1) {
                this.from_address.value.splice(index, 1);
            } else if (this.from_address.value.length == 1 && index == 0) {
                this.from_address.value[0].name = null;
                this.from_address.value[0].email = null;
            }
        },
    },
};
</script>
<style lang="less" scoped>
.main-body {
    margin: 78.5px 24px 24px 24px;
    @media @mobile {
        margin: 0 0 48px 0;
    }
}
.main-body-1{
    margin: 12px 24px 24px 24px;
}
.container {
    background: @White;
    border-radius: 4px;
    padding: 24px;
    width: 95%;
}
.object{
    display: flex;
    margin-bottom: 12px;
    align-items: flex-end;
}
.value{
    width: 30%;
    margin-right: 36px;
    margin-left: 36px;
}
.title{
    font-weight: bold; 
}
::v-deep .from-container{
    margin-top: 12px;
}
</style>