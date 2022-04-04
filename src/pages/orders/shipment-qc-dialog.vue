<template>
    <nitrozen-dialog class="qc-shipment" ref="shipmentQC" :title="title">
        <template slot="body">
            <div class="qc-options">
                <nitrozen-radio
                    v-for="(item, index) in qualityCondition"
                    :key="index"
                    :radioValue="item.value"
                    v-model="quality"
                    :name="'quality-check'"
                    >{{ item.text }}</nitrozen-radio
                >
            </div>
            <div class="comment-box" v-if="quality == 'bad'">
                <nitrozen-dropdown
                    :items="returnReasons"
                    v-model="selectedReason"
                    placeholder="Select Reason"
                    label="Select Reason*"
                    class="comment-box"
                ></nitrozen-dropdown>
                <nitrozen-input
                    type="textarea"
                    v-model="comment"
                    label="Comments"
                    placeholder="Enter Comments"
                    class="comment-box"
                ></nitrozen-input>
                <nitrozen-error v-if="commentError && !comment"
                    >Please enter comment</nitrozen-error
                >
            </div>
        </template>
        <template slot="footer">
            <nitrozen-button theme="secondary" v-flat-btn @click="confirm">
                Confirm
            </nitrozen-button>
        </template>
    </nitrozen-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    NitrozenButton,
    NitrozenDialog,
    NitrozenRadio,
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
import OrderService from '@/services/orders.service';
import { GET_USER_INFO } from '@/store/getters.type';
import find from 'lodash/find';
import { RETURN_ACCEPTED_REASONS } from '@/helper/constants';
// import { GET_EMPLOYEE_ACCESS_DETAIL } from '@/store/getters.type';
import map from 'lodash/map';

export default {
    name: 'shipment-cancellation-dialog',
    components: {
        NitrozenButton,
        NitrozenDialog,
        NitrozenRadio,
        NitrozenInput,
        NitrozenError,
        NitrozenDropdown,
    },
    props: {
        title: {
            type: String,
            default: 'Shipment Quality Check',
        },
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    computed: {
        ...mapGetters({
            userinfo: GET_USER_INFO,
            accessDetail:{},// GET_EMPLOYEE_ACCESS_DETAIL,
        }),
    },
    data: function () {
        return {
            qualityCondition: [
                {
                    text: 'Good',
                    value: 'good',
                },
                {
                    text: 'Bad',
                    value: 'bad',
                },
            ],
            quality: 'good',
            comment: '',
            commentError: false,
            returnReasons: [...RETURN_ACCEPTED_REASONS],
            selectedReason: '',
            shipmentBags: []
        };
    },
    mounted() {
        this.resetForm();
    },
    methods: {
        open(bags = []) {
            this.shipmentBags = bags;
            this.resetForm();
            this.$refs.shipmentQC.open({
                showCloseButton: true,
                width: '500px',
            });
        },
        close(data = null) {
            this.$refs.shipmentQC.close();
            this.$emit('close', data);
        },
        resetForm() {
            this.comment = '';
            this.quality = 'good';
        },
        confirm() {
            if (
                this.quality == 'bad' &&
                (this.comment.trim() == '' || this.selectedReason == '')
            ) {
                this.commentError = true;
                return;
            }
            const reasonObj = {};
            reasonObj[this.selectedReason] = map(this.shipmentBags, 'id');
            const data = {
                reason: this.quality == 'bad' ? reasonObj : {},
                action: 'submit',
                reason_text: this.quality == 'bad' ? this.comment.trim() : '',
            };
            this.close(data);
        },
    },
};
</script>

<style lang="less" scoped>
.qc-shipment {
    ::v-deep .nitrozen-dialog {
        .nitrozen-dialog-footer {
            padding-top: 12px;
        }
    }
    .qc-options {
        display: flex;
        justify-content: flex-start;
        .nitrozen-radio-group {
            margin-right: 10px;
        }
    }
    .comment-box {
        margin-top: 12px;
    }
}
</style>
