<template>
    <div class="user-agent" v-if="deviceInfo && deviceInfo.length">
        <div
            class="device-info"
            v-for="(info, index) in deviceInfo"
            :key="index"
        >
            <span class="sub-heading">{{ info.title }}: </span>{{ info.value }}
        </div>
    </div>
</template>

<script>
/* Service imports */
import UserAgentParser from '@/services/ua-parse.service.js';

export default {
    name: 'user-device-info',
    components: {},
    props: {
        user_agent: {
            type: String,
            default: null,
        },
    },
    computed: {
        deviceInfo() {
            let parsed = new UserAgentParser(this.user_agent);
            let info = [];

            if (parsed.browser && parsed.browser.name) {
                info.push({
                    title: 'Browser',
                    value: `${parsed.browser.name} ${
                        parsed.browser.version
                            ? `(v${parsed.browser.version})`
                            : ''
                    }`,
                });
            }
            // if (parsed.engine && parsed.engine.name) {
            //     info.push({
            //         title: 'Engine',
            //         value: parsed.engine.name,
            //     });
            // }
             if (parsed.os && parsed.os.name) {
                info.push({
                    title: 'OS',
                    value: `${parsed.os.name} ${
                        parsed.os.version ? `(v${parsed.os.version})` : ''
                    }`,
                });
            }
            if (parsed.application && parsed.application.name) {
                info.push({
                    title: 'Application',
                    value: `${parsed.application.name} ${
                        parsed.application.version ? `(v${parsed.application.version})` : ''
                    }`,
                });
            }
            if (parsed.cpu && parsed.cpu.architecture) {
                info.push({
                    title: 'CPU Build',
                    value: parsed.cpu.architecture,
                });
            }

            if (parsed.device && parsed.device.vendor) {
                info.push({
                    title: 'Device',
                    value: parsed.device.vendor
                        ? `${parsed.device.vendor} ${parsed.device.model} ${
                              parsed.device.type
                                  ? `(${parsed.device.type})`
                                  : ''
                          }`
                        : null,
                });
            }

            return info;
        },
    },
};
</script>

<style lang="less" scoped>
.user-agent {
    .device-info {
        font-size: 14px;
        line-height: 22px;
    }
}
.make-a-call {
    cursor: pointer;
    display: inline-block !important;
    margin-left: 6px;
    ::v-deep svg {
        width: 16px;
        height: 16px;
    }
}
</style>
