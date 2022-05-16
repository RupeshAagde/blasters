<template>
    <div class="user-agent">
        <div class="title bold-sm">Employee Details</div>
        <div
            class="employee-info"
            v-for="(info, index) in employeeInfo"
            :key="index"
        >
            <span class="sub-heading">{{ info.title }}: </span>{{ info.value }}
        </div>
    </div>
</template>

<script>

export default {
    name: 'employee-info',
    props: {
        employee: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        employeeInfo() {
            let info = [];

            if (this.employee.hasOwnProperty('name')) {
                info.push({
                    title: 'Name',
                    value: `${this.employee.name}`,
                });
            }
            if (this.employee.hasOwnProperty('email')) {
                info.push({
                    title: 'Email',
                    value: `${this.employee.email.length ? this.employee.email : '-'}`,
                });
            }
            if (this.employee.hasOwnProperty('mobile_no')) {
                info.push({
                    title: 'Phone No',
                    value: `${this.employee.mobile_no.length ? this.employee.mobile_no : '-'}`,
                });
            }
            if (this.employee.hasOwnProperty('employee_code')) {
                info.push({
                    title: 'Employee Code',
                    value: `${this.employee.employee_code.length ? this.employee.employee_code : '-'}`,
                });
            }

            return info;
        },
    },
};
</script>

<style lang="less" scoped>
.title {
    color: @Mako;
    font-size: 14px;
    margin-bottom: 12px;
}
.user-agent {
    .employee-info {
        .sub-heading {
            font-weight: 700;
        }
        color: @DustyGray2;
        font-size: 14px;
        line-height: 22px;
    }
}
</style>