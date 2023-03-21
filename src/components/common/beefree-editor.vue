<template>
    <div>
        <div id="bee-plugin-container"></div>
    </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';

import Bee from '@mailupinc/bee-plugin';
import ApiService from '../../services/api.service';

// const Bee = () =>
//     import(/*webpackChunkName:"@mailupinc/bee-plugin" */ '@mailupinc/bee-plugin');
export default {
    name: 'beefree-editor',
    props: {
        template: Object
    },
    components: {
        // 'no-ssr': NoSSR,
    },
    mounted() {
        this.fetchBeeFreeToken()
            .then(token => {
                const beeTest = new Bee(token);
                const beeConfig = {
                    uid: 'test1-clientside', //needed for identify resources of the that user and billing stuff
                    container: 'bee-plugin-container', //Identifies the id of div element that contains BEE Plugin
                    language: 'en-US',
                    trackChanges: true,
                    onSave: (jsonFile, htmlFile) => {
                        this.$emit('onSave', { jsonFile, htmlFile });
                    },
                    onSaveAsTemplate: jsonFile => {
                        this.$emit('onSaveAsTemplate', jsonFile);
                    },
                    onSend: htmlFile => {
                        this.$emit('onSend', htmlFile);
                    },
                    onError: errorMessage => {
                        this.$emit('onError', errorMessage);
                    },
                    onChange: (jsonFile, response) => {
                        this.$emit('onChange', { jsonFile, response });
                    },
                    onLoad: jsonFile => {
                        this.$emit('onLoad', jsonFile);
                    }
                };

                let templateJSON = {};
                if (!this.template) {
                    templateJSON = {
                        page: {
                            title: '',
                            description: '',
                            template: {
                                name: 'template-base',
                                type: 'basic',
                                version: '0.0.1'
                            },
                            body: {
                                type: 'mailup-bee-page-proprerties',
                                container: {
                                    style: {
                                        'background-color': '#FFFFFF'
                                    }
                                },
                                content: {
                                    style: {
                                        'font-family':
                                            "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                                        color: '#000000'
                                    },
                                    computedStyle: {
                                        linkColor: '#0068A5',
                                        messageBackgroundColor: 'transparent',
                                        messageWidth: '500px'
                                    }
                                }
                            },
                            rows: [
                                {
                                    type: 'one-column-empty',
                                    container: {
                                        style: {
                                            'background-color': 'transparent'
                                        }
                                    },
                                    content: {
                                        style: {
                                            'background-color': 'transparent',
                                            color: '#000000',
                                            width: '500px'
                                        }
                                    },
                                    columns: [
                                        {
                                            'grid-columns': 12,
                                            modules: [
                                                {
                                                    type:
                                                        'mailup-bee-newsletter-modules-empty',
                                                    descriptor: {}
                                                }
                                            ],
                                            style: {
                                                'background-color':
                                                    'transparent',
                                                'padding-top': '5px',
                                                'padding-right': '0px',
                                                'padding-bottom': '5px',
                                                'padding-left': '0px',
                                                'border-top':
                                                    '0px dotted transparent',
                                                'border-right':
                                                    '0px dotted transparent',
                                                'border-bottom':
                                                    '0px dotted transparent',
                                                'border-left':
                                                    '0px dotted transparent'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    };
                } else {
                    templateJSON = this.template;
                }

                var config = {
                    uid: 'string',
                    container: 'string'
                };
                beeTest.start(beeConfig, templateJSON);
                this.beePluginInstance = beeTest;
            })
            .catch(err => {
                console.error(err);
            });
    },
    data: function() {
        return {
            beePluginInstance: null
        };
    },
    methods: {
        fetchBeeFreeToken() {
            return ApiService.get(
                window.location.origin + '/admin/getBeeFreeToken',
                {}
            ).then(res => {
                return res.data
                });
        },
        save() {
            this.beePluginInstance.instance.save();
        },
        send() {
            this.beePluginInstance.instance.send();
        }
    }
};
</script>

<style lang="less" scoped>
#bee-plugin-container {
    height: 600px;
}
</style>
