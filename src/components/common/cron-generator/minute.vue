<template>
    <div class="cron-time">
        <adm-radio-group
            @on-change="changeOption($event)"
            :options="options"
            :selectedOpt="selectedOpt"
        ></adm-radio-group>
        <div>
            <ukt-select
                :disabled="selectedOpt && selectedOpt.value === '*'"
                :options="durationOptions"
                :selectedOpt="selectedDurationOpt"
                @change-selection="changeTime($event)"
            ></ukt-select>
        </div>
    </div>
</template>

<script>
import uktselect from './../select.vue';
import admradiogroup from './../radio-group.vue';
export default {
    name: 'cron-minute',
    components: {
        'ukt-select': uktselect,
        'adm-radio-group': admradiogroup
    },
    props: {
        cron_exp: {}
    },
    data() {
        const arrOpt = [];
        for (let i = 0; i <= 59; i++) {
            arrOpt.push({
                display: i,
                value: i
            });
        }
        const options = [
            {
                display: 'Every Minute',
                value: '*'
            },
            {
                display: 'Custom',
                value: 'custom'
            }
        ];
        return {
            options: options,
            selectedOpt: this.cron_exp === '*' ? options[0] : options[1],
            durationOptions: arrOpt,
            selectedDurationOpt: this.cron_exp === '*' ? '0' : this.cron_exp
        };
    },
    computed: {},
    methods: {
        changeOption(data) {
            this.selectedOpt = data;
            this.$emit('change-cron', {
                type: 'minute',
                option: this.selectedOpt,
                value: this.selectedDurationOpt
            });
        },
        changeTime(event) {
            this.selectedDurationOpt = event.target.value;
            this.$emit('change-cron', {
                type: 'minute',
                option: this.selectedOpt,
                value: this.selectedDurationOpt
            });
        }
    }
};
</script>

<style lang="less" scoped>
.cron-time {
    margin: 10px 0px;
    .custom-select {
        max-width: 150px;
        margin: 0px 10px;
    }
}
</style>
