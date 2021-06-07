<template>
    <div>
        <div
            class="overlay-header"
            v-if="!isMobile() && config && config.application"
        >
            <a href="/" target="blank" class="logo">
                <img
                    :src="
                        config.application.logo &&
                        config.application.logo.secure_url
                    "
                />
                <div class="app-name">
                    {{ config.application.name }}
                </div>
            </a>
        </div>
        <div class="whole-container">
            <div v-if="error" class="waiting">
                {{ 'Error while connecting: ' + error.message }}
                <div
                    class="error-help"
                    v-if="error.message.includes('ermission')"
                >
                    <div class="error-help-text">
                        Please do click on 'Aa' in url box and then allow media
                        permissions
                    </div>
                    <img src="https://i.stack.imgur.com/9aUij.png" />
                </div>
            </div>
            <div v-else-if="!TwilioVideo" class="waiting">Loading...</div>
            <div v-else-if="!TwilioVideo.isSupported" class="waiting">
                This browser is not supported, please do try with any other
                browser you have.
                <div @click="onCancel" style="padding: 20px">
                    <div class="home-button">Go To Home</div>
                </div>
            </div>
            <template v-else-if="localTrack" class="whole-container">
                <div id="video-joining-self" class="video-joining-self">
                    <div v-if="!isVideoEnabled" class="camera-message">
                        Camera is off
                    </div>
                    <div class="self-controls" v-if="!detectMobileWidth()">
                        <div
                            v-bind:class="[
                                'action-button',
                                { off: !isAudioEnabled },
                            ]"
                            @click="toggleAudio"
                        >
                            <template v-if="isAudioEnabled">
                                <ukt-inline-svg
                                    class="action-button-svg"
                                    :src="'microphone-on'"
                                ></ukt-inline-svg>
                            </template>
                            <template v-else>
                                <ukt-inline-svg
                                    class="action-button-svg"
                                    :src="'microphone-off'"
                                ></ukt-inline-svg>
                            </template>
                        </div>
                        <div
                            v-bind:class="[
                                'action-button',
                                { off: !isVideoEnabled },
                            ]"
                            @click="toggleVideo"
                            style="margin-left: 24px"
                        >
                            <template v-if="isVideoEnabled">
                                <ukt-inline-svg
                                    class="action-button-svg"
                                    :src="'video-on'"
                                ></ukt-inline-svg>
                            </template>
                            <template v-else>
                                <ukt-inline-svg
                                    class="action-button-svg"
                                    :src="'video-off'"
                                ></ukt-inline-svg>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="join-section">
                    <div class="self-controls-in-joining-section" v-if="detectMobileWidth()">
                        <div
                            v-bind:class="[
                                'action-button',
                                { off: !isAudioEnabled },
                            ]"
                            @click="toggleAudio"
                        >
                            <template v-if="isAudioEnabled">
                                <ukt-inline-svg
                                    class="action-button-svg"
                                    :src="'microphone-on'"
                                ></ukt-inline-svg>
                            </template>
                            <template v-else>
                                <ukt-inline-svg
                                    class="action-button-svg"
                                    :src="'microphone-off'"
                                ></ukt-inline-svg>
                            </template>
                        </div>
                        <div
                            v-bind:class="[
                                'action-button',
                                { off: !isVideoEnabled },
                            ]"
                            @click="toggleVideo"
                            style="margin-left: 24px"
                        >
                            <template v-if="isVideoEnabled">
                                <ukt-inline-svg
                                    class="action-button-svg"
                                    :src="'video-on'"
                                ></ukt-inline-svg>
                            </template>
                            <template v-else>
                                <ukt-inline-svg
                                    class="action-button-svg"
                                    :src="'video-off'"
                                ></ukt-inline-svg>
                            </template>
                        </div>
                    </div>
                    <div v-if="ticket" class="join-section-real">
                        <div class="request-id" v-if="ticket.created_by">Customer Details</div>
                        <div class="assignee" v-if="ticket.created_by">
                            <div class="avatar-circle">
                                <span class="initials">
                                    {{ createdBy().substring(0, 1) }}
                                </span>
                            </div>
                            <div class="assignee-info">
                                <div class="assignee-name">
                                    {{ createdBy() }}
                                </div>
                                <div class="assignee-app">
                                    {{ 'Request ID: ' + ticket.ticket_id }}
                                </div>
                            </div>
                        </div>
                        <div
                            v-bind:class="[
                                { 'join-button-inactive': !canJoin },
                                'join-button',
                            ]"
                            @click="joinRoom"
                        >
                            <div style="margin: auto">Join Call</div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import admInlineSvg from '@/components/common/adm-inline-svg';
import { detectMobileWidth } from '@/helper/utils';
import SupportService from '@/services/support.service';

export default {
    name: 'video-joining',
    data() {
        return {
            isAudioEnabled: true,
            isVideoEnabled: true,
            numberOfParticipants: 0,
            TwilioVideo: undefined,
            error: undefined,
            alreadyRunning: false,
            canJoin: true,
            ticket: undefined,
            config: undefined,
            localTrack: undefined,
        };
    },
    components: {
        'ukt-inline-svg': admInlineSvg,
    },
    methods: {
        detectMobileWidth,
        createdBy() {
            let subtitle = '';
            const ticket = this.ticket;
            let username = '';

            if (ticket.created_by && ticket.created_by.user) {
                username =
                    ticket.created_by.user.first_name +
                    ' ' +
                    ticket.created_by.user.last_name;

                subtitle = subtitle + username;
            } else if (ticket.created_by && ticket.created_by.details && ticket.created_by.details.name) {
                subtitle = subtitle + ticket.created_by.details.name;
            } else {
                subtitle = 'Anonymous';
            }

            return subtitle;
        },
        isMobile() {
            return detectMobileWidth();
        },
        closeRoomAndVideo() {
            if (this.localTrack) this.localTrack.stop();
            this.localTrack = undefined;
        },
        onCancel() {
            this.closeRoomAndVideo();
            this.$router.push('/');
        },
        toggleAudio() {
            this.isAudioEnabled = !this.isAudioEnabled;
        },
        toggleVideo() {
            if (this.isVideoEnabled) {
                this.localTrack.stop();
                document
                    .getElementById('video-joining-self')
                    .style.setProperty('--self-video-opacity', '0');
            } else {
                this.localTrack.restart();
                document
                    .getElementById('video-joining-self')
                    .style.setProperty('--self-video-opacity', '1');
            }
            this.isVideoEnabled = !this.isVideoEnabled;
        },
        joinRoom() {
            if (this.canJoin) {
                this.$emit(`joinRoom`, {
                    audio: this.isAudioEnabled,
                    video: this.isVideoEnabled,
                });
            }
        },
        setupEverything() {
            this.error = undefined;
            this.alreadyRunning = true;

            const promises = [
                SupportService.getTokenForVideoRoom(
                    this.$route.params.ticket_id
                ),
                import('twilio-video'),
                SupportService.getTicket(
                    this.$route.params.ticket_id
                ),
            ];

            Promise.all(promises)
                .then((responses) => {
                    const token = responses[0].data.access_token;
                    this.TwilioVideo = responses[1];
                    this.ticket = responses[2].data;

                    if (!this.TwilioVideo.isSupported) {
                        return;
                    }

                    setTimeout(function () {}, 100);

                    this.TwilioVideo.createLocalTracks({
                        audio: true,
                        video: { facingMode: 'user' },
                    })
                        .then((tracks) => {
                            const track = tracks.find((a) => a.kind == 'video');
                            this.localTrack = track;

                            setTimeout(function () {
                                let container = document.getElementById(
                                    'video-joining-self'
                                );

                                const element = track.attach();

                                track.once('started', () => {
                                    container.style.setProperty(
                                        '--self-video-min-height',
                                        container.clientHeight + 'px'
                                    );
                                });

                                element.style.setProperty(
                                    'opacity',
                                    'var(--self-video-opacity)'
                                );

                                element.style.setProperty('height', 'auto');

                                container.prepend(element);

                                container.style.setProperty(
                                    '--self-video-min-height',
                                    container.clientHeight + 'px'
                                );
                            }, 500);
                        })
                        .catch((err) => {
                            this.error = err;
                            console.log(err);
                        });
                })
                .catch((err) => {
                    this.error = err;
                    console.log(err);
                });
        },
        askForPermissions() {
            navigator.getUserMedia(
                {
                    video: true,
                    audio: true,
                },
                function (localMediaStream) {},
                function (err) {}
            );
        },
    },
    mounted() {
        this.setupEverything();
    },
    destroyed() {
        this.closeRoomAndVideo();
    },
};
</script>

<style lang="less" scoped>
.overlay-header {
    position: absolute;
    z-index: 2;
    height: 80px;
    width: 100%;
    padding: 8px;
    opacity: 1;
    box-sizing: border-box;

    @media @mobile {
        height: 40px;
    }

    a {
        cursor: pointer;
        height: 100%;
        width: fit-content;
        display: flex;

        img {
            height: 100%;
        }

        .app-name {
            height: 100%;
            color: #41434c;
            margin-left: 6px;
            padding-top: 15px;
            font-weight: 700;
            font-size: 27px;

            @media @mobile {
                padding-top: 4px;
                font-size: inherit;
            }
        }
    }
}

.whole-container {
    height: 100%;
    padding-top: 100px;
    box-sizing: border-box;

    @media @mobile {
        padding-top: 0px;
    }
}

.join-section {
    @media @mobile {
        position: absolute;
        bottom: 0;
        width: 100%;
    }
    .self-controls-in-joining-section {
        justify-content: center;
        display: flex;
        padding: 16px;
        height: auto;

        .action-button {
            height: 100%;
            width: auto;
            cursor: pointer;

            .action-button-svg {
                ::v-deep svg {
                    width: 60px;
                    height: 60px;

                    #prefix__Group-9 {
                        stroke: white;
                    }

                    #prefix__Group-21 {
                        stroke: white;
                    }
                }
            }
        }
        .action-button:hover {
            box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
        }
    }

    .join-section-real {
        padding: 24px 20px 16px;
        text-align: center;
        z-index: 100;

        @media screen {
            width: 100%;
            box-sizing: border-box;
        }

        @media @mobile {
            text-align: left;
            background-color: white;
            border-top-left-radius: 30px;
            border-top-right-radius: 30px;
        }
    }
    .request-id {
        color: #41434c;
        font-weight: 600;
        font-size: 13px;
    }

    .call-will {
        color: #c9c9c9;
        font-weight: 500;
        font-size: 14px;
        margin: 15px 0px;
        margin-bottom: 12px;
    }

    .assignee {
        color: #41434c;
        font-weight: 500;
        margin: 12px 0px;
        display: flex;
        justify-content: center;
        text-align: left;
        @media @mobile {
            justify-content: left;
        }

        .avatar-circle {
            width: 50px;
            height: 50px;
            background-color: #41434c;
            text-align: center;
            border-radius: 50%;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
        }

        .initials {
            position: relative;
            top: 0px;
            font-size: 18px;
            line-height: 50px;
            color: #fff;
            font-weight: 500;
        }

        .assignee-info {
            margin-left: 12px;
            margin-top: 6px;

            .assignee-name {
                font-size: 16px;
                margin-bottom: 6px;
                font-weight: 700;
            }

            .assignee-app {
                font-size: 13px;
                font-weight: 300;
            }
        }
    }

    .join-text {
        color: #c9c9c9;
        font-weight: 500;
        font-size: 13px;
        margin-top: 12px;
        display: flex;
        justify-content: center;
        align-items: center;

        @media @mobile {
            justify-content: left;
        }

        .join-text-icon {
            height: 14px;
            width: 20px;
            margin-right: 4px;
        }
    }

    .join-text-positive {
        color: #27ae60;
    }

    .join-button {
        margin: auto;
        border-radius: 5px;
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
            0 1px 3px 1px rgba(60, 64, 67, 0.15);
        display: flex;
        height: 40px;
        background: #2036de;
        color: #fff;
        width: inherit;
        align-items: center;
        max-width: 400px;

        @media @mobile {
            max-width: 4000px;
        }
    }

    .join-button-inactive {
        background: lightgray;
        box-shadow: none;
    }
}

.camera-message {
    position: absolute;
    top: calc(50% - 100px);
    left: 0;
    right: 0;
    text-align: center;
    color: white;
    font-weight: 700;
}

.home-button {
    padding: 10px;
    background-color: @Mako;
    border: 1px solid @Mako;
    border-radius: @BorderRadius;
    cursor: pointer;
    color: @White;
    width: fit-content;
    margin: auto;
}

.video-joining-self {
    width: 100%;
    display: flex;
    flex-direction: column;
    --self-video-opacity: 1;
    --self-video-min-height: 240px;
    position: relative;
    background-color: rgb(41, 41, 41);
    margin: auto;
    max-width: 700px;
    min-height: var(--self-video-min-height);

    @media @mobile {
        height: 100%;
    }
}

.self-controls {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    justify-content: center;
    display: flex;
    padding: 16px;
    height: auto;

    @media @mobile {
        bottom: 230px;
    }
    .action-button {
        height: 100%;
        width: auto;
        cursor: pointer;

        .action-button-svg {
            ::v-deep svg {
                width: 60px;
                height: 60px;

                #prefix__Group-9 {
                    stroke: white;
                }

                #prefix__Group-21 {
                    stroke: white;
                }
            }
        }
    }
    .action-button:hover {
        box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
    }
}

.waiting {
    margin-top: 20px;
    text-align: center;
    width: 100%;
    height: 100px;
    color: #41434c;
    padding: 20px;
    box-sizing: border-box;

    .error-help {
        padding-top: 20px;
        height: auto;
        margin: auto;

        .error-help-text {
            color: #41434c;
            font-size: 12px;
            margin-bottom: 20px;
        }

        img {
            width: 60%;
            max-width: 300px;
            height: auto;
            box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
                0 1px 3px 1px rgba(60, 64, 67, 0.15);
        }
    }
}
</style>
