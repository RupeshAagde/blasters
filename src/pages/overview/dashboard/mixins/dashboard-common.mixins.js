import {mapGetters} from "vuex";
import {GET_USER_INFO} from "@/store/getters.type";

const DashboardCommonMixins = {
    computed: {
        ...mapGetters({
            userData: GET_USER_INFO
        }), emailId() {
            /**
             * this functions primarily considers email, but if not available, then will return mobile number
             */
            const emails = this.userData.user.emails
            if (emails.length > 0) {
                return this.userData.user.emails[0].email;
            }
            return null
        },
        mobileNumber() {
            if (this.userData.user.phone_numbers.length > 0) {
                return this.userData.user.phone_numbers[0].phone
            }
            return null
        },
        appId() {
            if (this.$route.params.applicationId) {
                return this.$route.params.applicationId
            }
            return this.$route.params.marketplaceName;
        }
    }
}

export {DashboardCommonMixins}