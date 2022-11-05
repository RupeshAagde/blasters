<template>
    <div>
        <table class="plans-table">
            <thead>
                <template v-for="(row, rowIndex) in tableRows.slice(0, 3)">
                    <tr :key="rowIndex">
                        <td :key="dataIndex" v-for="(data, dataIndex) in row">
                            <div v-if="data.text === true">&#10004;</div>
                            <div v-else-if="data.text === false"></div>
                            <div v-else class="flex-justify-align-center">
                                <div class="inline-block padding-td">
                                    {{ data.text }}
                                </div>
                                <div
                                    v-if="data.tags && data.tags.length >= 1"
                                    class="box inline-block"
                                >
                                    <div class="ribbon">
                                        <span>{{ data.tags[0] }}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </thead>
            <tbody :class="{ 'with-scroll': withScroll }">
                <template v-for="(row, rowIndex) in tableRows.slice(3)">
                    <tr :key="rowIndex">
                        <td
                            class="padding-td"
                            :key="dataIndex"
                            v-for="(data, dataIndex) in row"
                        >
                            <div v-if="data.text === true">&#10004;</div>
                            <div v-else-if="data.text === false"></div>
                            <div v-else>{{ data.text }}</div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import { NitrozenButton, flatBtn, strokeBtn } from '@gofynd/nitrozen-vue';
import * as _ from 'lodash';
export default {
    name: 'compare-plans-modal',
    components: {
        'nitrozen-button': NitrozenButton
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props: {
        plans: {
            type: Array,
            default() {
                return [];
            }
        },
        showSelectPlan: {
            type: Boolean,
            default: false
        },
        withScroll: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {};
    },
    computed: {
        tableRows() {
            if (this.plans.length == 0) {
                return [];
            }

            let firstRow = [
                { text: '' },
                ...this.plans.map((plan) => ({
                    text: plan.name,
                    tags: plan.tags
                }))
            ];
            // let secondRow = [
            //     { text: null },
            //     ...this.plans.map(plan => ({ text: null, tags: plan.tags }))
            // ];
            let secondRow = [
                { text: 'Pricing' },
                ...this.plans.map((plan) => ({
                    text: `${this.amountFormat(plan)} ${this.recurringText(
                        plan.recurring.interval_count,
                        plan.recurring.interval
                    )}`
                }))
            ];
            let thirdRow = [
                { text: '' },
                ...this.plans.map((plan) => ({
                    text: null,
                    id: plan._id,
                    is_current_active_plan: plan.is_current_active_plan
                }))
            ];
            let tableRows = [firstRow, secondRow, thirdRow];

            let components = this.plans[0].components.map((c) => c.name);

            components.forEach((component) => {
                let row = [{ text: component }];
                this.plans.forEach((plan) => {
                    let planComponent = plan.components.find(
                        (c) => c.name == component
                    );

                    if (
                        planComponent &&
                        planComponent.enabled &&
                        planComponent.display_text
                    ) {
                        row.push({ text: planComponent.display_text });
                    } else {
                        row.push({ text: false });
                    }
                });
                tableRows.push(row);
            });
            return tableRows;
        }
    },
    mounted() {
        if (this.$route && this.$route.path.indexOf('pricing') == -1) {
            var body = document.getElementsByTagName('body');
            body[0].style.overflow = 'hidden';
        }
        // _.set(body,"0.style.overflow","hidden")
    },
    methods: {
        amountFormat(plan) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: plan.currency
            }).format(plan.amount);
        },
        recurringText(interval_count, interval) {
            if (interval_count == 1) {
                return `per ${interval}`;
            }
            return `per ${interval_count} ${interval}`;
        },
        selectPlan(id) {
            this.$emit('selectPlan', id);
            this.$emit('closeComparePlansModal');
        },
        closeComparePlansModal() {
            this.$emit('closeComparePlansModal');
        }
    }
};
</script>

<style scoped lang="less">
.box {
    position: relative;
    width: 75px;
    height: 70px;
}
.flex-justify-align-center {
    display: flex;
    justify-content: center;
    align-items: center;
}
.padding-td {
    padding: 14px 5px;
}
.inline-block {
    display: inline-block;
}
.ribbon {
    position: absolute;
    top: -3px;
    z-index: 1;
    overflow: hidden;
    width: 75px;
    height: 75px;
    text-align: right;
}
.ribbon span {
    font-size: 10px;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;
    text-align: center;
    line-height: 20px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    width: 100px;
    display: block;
    background: #79a70a;
    background: linear-gradient(#57c5a1 0%, #57c5a1 100%);
    box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
    position: absolute;
    top: 19px;
    right: -21px;
}
.ribbon span::before {
    content: '';
    position: absolute;
    left: 0px;
    top: 100%;
    z-index: -1;
    border-left: 3px solid #56c29e;
    border-right: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-top: 3px solid #56c29e;
}
.ribbon span::after {
    content: '';
    position: absolute;
    right: 0px;
    top: 100%;
    z-index: -1;
    border-left: 3px solid transparent;
    border-right: 3px solid #56c29e;
    border-bottom: 3px solid transparent;
    border-top: 3px solid #56c29e;
}

.plans-table {
    width: 100%;
    margin-bottom: 24px;
    font-family: Poppins, sans-serif;
    font-size: 14px;
    .tag {
        border: 1px solid white;
        color: black;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        background: white;
    }
    thead {
        // tr:not(:nth-child(2)) {
        //     background: #5c6bdd;
        //     color: white;
        // }
        // tr:not(:nth-child(3)) {
        //     background: #5c6bdd;
        //     color: white;
        // }

        tr:first-child {
            font-size: 19px;
            font-weight: 800;
            background: #5c6bdd;
            color: white;
            td:first-child {
                border-top-left-radius: 5px;
            }
            td:last-child {
                border-top-right-radius: 5px;
            }
        }
        tr:nth-child(2) {
            color: black;
            font-weight: 500;
            td:first-child {
                font-weight: 400;
            }
        }
        tr:not(:first-child) {
            border-bottom: 1px solid lightgray;
        }
    }
    tbody {
        line-height: 18px;
        tr:nth-child(odd) {
            background: #f8f8f870;
        }
        tr {
            border-bottom: 1px solid lightgray;
        }
    }

    tbody {
        display: block;
    }
    .with-scroll {
        height: 400px;
        overflow: auto;
    }

    thead,
    tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed; /* even columns width , fix width of table too*/
    }
    td {
        text-align: center;
    }
}

// .compare-plans-modal.modal {
//     ::v-deep .modal-container {
//         width: 1200px;
//         max-width: 1200px;
//         min-height: 500px;
//         .modal-body {
//             margin: 24px;
//         }

//     }
// }
</style>
