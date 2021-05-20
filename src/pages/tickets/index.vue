<template>
    <div class="panel">
        <div class="main-container">
            <div style="width: 100%">
                <jumbotron
                    :title="'Support Center'"
                    :desc="'View and solve open tickets logged in by the users'"
                    :btnLabel="'Add new category'"
                    @btnClick="redirectToAddCategory"
                ></jumbotron>
                <ticket-list style="margin-top: 16px"> </ticket-list>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.main-container {
    background-color: white;
    margin: 24px;
    padding: 24px;
}

.custom-header {
    ::v-deep .n-flat-button-secondary {
        margin-top: 110px !important;
    }
}
</style>

<script>
import Jumbotron from '@/components/common/jumbotron';
import TicketList from './ticket-list.vue';
import { getRoute } from '@/helper/get-route';
import { mapGetters } from 'vuex';

export default {
    name: 'adm-support',
    components: {
        jumbotron: Jumbotron,
        'ticket-list': TicketList
    },
    computed: {
        ...mapGetters({
            //
        }),
        jumbotronData() {
            if (this.helpData && this.helpData.length) {
                return this.helpData.find((it) => {
                    return this.$route.path.includes(it.path);
                });
            }
        }
    },
    data() {
        return {
            not_found: false,
            isInitialLoad: false,
            initial_count: 0
        };
    },
    mounted() {
        //
    },
    methods: {
        redirectToAddCategory() {
            this.$router.push({
                path: `${getRoute(this.$route)}/administrator/support/add-category`
            });
        }
    }
};
</script>
