import {mapGetters} from "vuex";
import {GET_ALL_FILTERS} from "../../../../store/getters.type";
import {ANALYTICS_STATE} from "../../../../store/modules/admin-analytics.module";

const loadingMixins = {
    data: () => ({_page: null}),
    computed: {
        ...mapGetters({
            allFilters: GET_ALL_FILTERS,
            refreshAll: ANALYTICS_STATE.REFRESH_ALL_PAGE
        }),
        isLoading() {
            return this.loadingCondition();
        },
        _pageName: {
            get() {
                return this._page;
            },
            set(page) {
                this._page = page;
            }
        }
    },
    watch: {
        isLoading(value) {
            this.$emit('loading', value);
            if (value) {
                this.loadData();
            }
        },
        refreshAll: {
            handler(value) {
                if (this.refreshToken && value[this._pageName] && value[this._pageName][this.refreshToken]) {
                    this.resetData();
                }
            },
            deep: true
        }
    },
    mounted() {
        if (this.isLoading) {
            this.loadData();
        }
        this.setPageName();
    }
};

export {loadingMixins};
