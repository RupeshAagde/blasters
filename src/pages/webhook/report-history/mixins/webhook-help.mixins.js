import urlJoin from "url-join";

const WebhookHelpMixins = {
    data: () => ({
        docUrl:
            env.SEARCHLIGHT_MAIN_DOMAIN +
            '/docs/company-settings/webhook/webhook',
    }),
    methods: {
        onCancel() {
            this.$router.push({
                path: urlJoin( 'webhook-report'),
            });
        },
        docRedirect() {
            window.open(this.docUrl, '_blank');
        },
    }
};
export {WebhookHelpMixins}