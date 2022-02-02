<template>
    <div>
        <div class="tabs">
            <div
                v-for="(item, index) in tabsList"
                :key="index"
                :class="['tab-item', { active: item === activeTab }]"
                @click="activeTab = item"
            >
                <div class="cl-Mako regular-xxs">{{ item.display }}</div>
            </div>
        </div>
        <div class="time">
            <component
                :is="activeTab.component"
                :cron_exp="cronMap[activeTab.value]"
                @change-cron="changeCronText($event)"
            ></component>
        </div>
        <div v-if="flag" class="cron-string  regular-xs">
            Expression : {{ getCronExpression }}
        </div>
        <div class="cron-string  regular-xs">
            Statment : {{ getCronReadable }}
        </div>
    </div>
</template>

<script>
import minute from './minute.vue';
import date from './date.vue';
import day from './day.vue';
import hour from './hour.vue';
import month from './month.vue';
import cronstrue from 'cronstrue';

export default {
    name: 'cron-gen',
    components: {
        minute,
        date,
        day,
        hour,
        month
    },
    props: {
        cronExp: {
            type: String,
            default: '* * * * *'
        },
        flag: {
            default: true
        }
    },

    data() {
        const tabComponents = [
            {
                display: 'Minute',
                value: 'minute',
                component: minute
            },
            {
                display: 'Hour',
                value: 'hour',
                component: hour
            },
            {
                display: 'Date Of Month',
                value: 'date',
                component: date
            },
            {
                display: 'Month',
                value: 'month',
                component: month
            },
            {
                display: 'Day Of Week',
                value: 'day',
                component: day
            }
        ];
        const arrSplitCron = this.cronExp.split(' ');
        const cronMap = {
            minute: arrSplitCron[0],
            hour: arrSplitCron[1],
            date: arrSplitCron[2],
            month: arrSplitCron[3],
            day: arrSplitCron[4]
        };
        return {
            activeTab: tabComponents[0],
            tabs: tabComponents,
            cronMap: cronMap
        };
    },
    computed: {
        tabsList() {
            return this.tabs;
        },
        getCronExpression() {
            let arrCron = [];
            for (let key in this.cronMap) {
                arrCron.push(this.cronMap[key]);
            }
            return arrCron.join(' ');
        },
        getCronReadable() {
            let arrCron = [];
            for (let key in this.cronMap) {
                arrCron.push(this.cronMap[key]);
            }
            try {
                return cronstrue.toString(arrCron.join(' '));
            } catch (err) {
                return err;
            }
        }
    },
    methods: {
        selectTab(item) {
            for (let i = 0; i < this.tabs.length; i++) {
                this.tabs[i].active = false;
            }
            item.active = true;
        },
        changeCronText(data) {
            console.log('Cron update');
            this.cronMap[data.type] =
                data.option.value === 'custom' ? data.value : '*';
            this.$emit('generate', this.getCronExpression);
        }
    }
};
</script>

<style lang="less" scoped>
.tabs {
    display: flex;
    .tab-item {
        flex: 1;
        justify-content: center;
        display: flex;
        padding: 5px 0px;
        cursor: pointer;
    }
    .active {
        border-bottom: 1px solid @RoyalBlue;
    }
}
.time {
    border-bottom: 1px solid @LightGray;
}
.cron-string {
    color: @PurpleHeart;
    margin: 10px;
}
</style>
