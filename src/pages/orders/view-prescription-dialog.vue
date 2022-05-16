<template>
    <nitrozen-dialog ref="prescriptionList" :title="title">
        <template slot="body">
            <div
                class="prescription-list"
                v-for="pres in prescriptionArray"
                :key="pres.id"
            >
                <div>Bag ID: {{ pres.id }}</div>
                <div v-for="(img, index) in pres.file.values" :key="index">
                    <img
                        :src="img"
                        :ref="`prescrition-${pres.id}-${index}`"
                        alt="Prescription"
                    />
                </div>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDialog,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
import loader from '@/components/common/loader.vue';
import ApiService from '@/services/api.service';
import GrindorService from '@/services/grindor.service';

export default {
    name: 'bank-details',
    components: {
        NitrozenButton,
        NitrozenDialog,
        NitrozenInput,
        NitrozenError,
        loader,
    },
    props: {
        title: {
            type: String,
            default: 'Prescription',
        },
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            prescriptionArray: [],
            imageLoaded: false,
        };
    },
    mounted() {},
    methods: {
        open(data) {
            this.prescriptionArray = data;
            this.prescriptionArray.map((ele, bagIndex) => {
                ele.file.values.map((val, fileIndex) => {
                    if (!this.checkURL(val)) {
                        this.getImage(val, bagIndex, fileIndex);
                    }
                });
            });
            this.$refs.prescriptionList.open({
                showCloseButton: true,
                height: '800px',
                width: '550px',
            });
        },
        close(reason) {
            this.$refs.prescriptionList.close();
            this.$emit('close');
        },
        getImage(url, bagIndex, fileIndex) {
            try {
                return ApiService.get(
                    `${GrindorService.getProxyURL()}?url=${url}`,
                    {},
                    {}
                ).then((res) => {
                    this.$set(this.prescriptionArray[bagIndex].file.values, fileIndex, res.data)
                });
            } catch (err) {
                console.log(err, 'errrrrr');
                return url;
            }
        },
        checkURL(url) {
            return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
        },
    },
};
</script>

<style lang="less" scoped>
.prescription-list {
    div {
        color: @Mako;
        font-weight: bold;
        margin-bottom: 12px;
    }
    img {
        margin-top: 6px;
        width: 500px;
        height: 500px;
        border-bottom: 1px dotted @GrayShade;
    }
}
</style>
