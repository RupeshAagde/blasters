import {mapGetters} from "vuex";
import {GET_DASHBOARD_CARD_NAV_LINK} from "../../../../store/getters.type";
import {ANALYTICS_STATE} from "../../../../store/modules/admin-analytics.module";
import {ANALYTICS_PAGES} from "../../data/constants";

const navLinkMixins = {
    props: {
        extraProps: {
            type: Object,
            default() {
                return {height: 200, options: {}};
            }
        },
    },
    computed: {
        ...mapGetters({
            navlink: GET_DASHBOARD_CARD_NAV_LINK
        }),
        navLink() {
            return this.navlink(ANALYTICS_PAGES.DASHBOARD);
        }
    }
}

export {navLinkMixins}