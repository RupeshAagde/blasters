import urlJoin from "url-join";

const WebhookHelpMixins = {
    data: () => ({
        docUrl:
            env.SEARCHLIGHT_MAIN_DOMAIN +
            '/docs/company-settings/webhook/webhook',
    }),
    methods: {
        onCancel() {
            let url = urlJoin('webhook-report');
            if (this.$route.params.subscriberId) {
                url = urlJoin(url, this.$route.params.subscriberId);
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