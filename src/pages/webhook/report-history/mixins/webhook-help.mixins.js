import urlJoin from "url-join";

const WebhookHelpMixins = {
    data: () => ({
        docUrl:
            env.SEARCHLIGHT_MAIN_DOMAIN +
            '/docs/company-settings/webhook/',
    }),
    methods: {
        onCancel() {
            let url = 'webhook-report';
            if (this.$route.params.subscriberId) {
                url= `/administrator`+ `/${url}`+`/${this.$route.params.subscriberId}`
            }
            this.$router.push({
                path: url,
            });
        },
        docRedirect() {
            window.open(this.docUrl, '_blank');
        },
    }
};
export {WebhookHelpMixins}