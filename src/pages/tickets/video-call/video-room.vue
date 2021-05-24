<template>
    <div class="">
        <div class="main">
            <div class="video-room" id="video-room">
                <video-rating v-if="isCallEnded" @done="goHome" />
                <video-joining v-else-if="!isJoined" @joinRoom="joinRoom" />
                <template v-else>
                    <div v-if="error" class="waiting">
                        {{ 'Error while connecting: ' + error.message }}
                    </div>
                    <div v-else-if="!TwilioVideo" class="waiting">
                        Loading...
                    </div>
                    <template v-else>
                        <div v-if="!TwilioVideo.isSupported" class="waiting">
                            This browser is not supported, please do try with
                            any other browser you have.
                            <div @click="goHome" style="padding: 20px">
                                <button>Go To Home</button>
                            </div>
                        </div>
                        <template v-else>
                            <div class="video-sections" id="video-sections">
                                <template>
                                    <div class="all-vid" id="Vid-Others">
                                        <span
                                            class="waiting"
                                            style="color: white"
                                            v-if="
                                                room &&
                                                numberOfParticipants == 0
                                            "
                                        >
                                            Waiting for Others to Join...
                                        </span>
                                        <span
                                            class="waiting"
                                            style="color: white"
                                            v-if="!room"
                                        >
                                            Connecting
                                        </span>
                                    </div>
                                    <div id="Vid-Self" class="video-self">
                                        <div class="chat-section"></div>
                                    </div>
                                </template>
                            </div>
                            <div class="self-controls">
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
                                    class="action-button"
                                    @click="onCancel"
                                    style="
                                        margin-left: 16px;
                                        margin-right: 16px;
                                    "
                                >
                                    <ukt-inline-svg
                                        class="action-button-svg end-call"
                                        :src="'end-call'"
                                    ></ukt-inline-svg>
                                </div>
                                <div
                                    v-bind:class="[
                                        'action-button',
                                        { off: !isVideoEnabled },
                                    ]"
                                    @click="toggleVideo"
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
                        </template>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import admInlineSvg from '@/components/common/adm-inline-svg';
import { detectMobileWidth } from '@/helper/utils';
import VideoJoining from './video-joining.vue';
import VideoRating from './video-rating.vue';
import SupportService from '@/services/support.service';
import { getRoute } from '@/helper/get-route';

export default {
    name: 'video-room',
    data() {
        return {
            room: undefined,
            isAudioEnabled: true,
            isVideoEnabled: true,
            shouldEnableAudioOnJoin: true,
            shouldEnableVideoOnJoin: true,
            numberOfParticipants: 0,
            isJoined: false,
            TwilioVideo: undefined,
            error: undefined,
            isCallEnded: false,
            token: undefined,
            config: undefined,
            localTrack: undefined,
        };
    },
    components: {
        'video-joining': VideoJoining,
        VideoRating,
        'ukt-inline-svg': admInlineSvg,
    },
    methods: {
        isMobile() {
            return detectMobileWidth();
        },
        participantConnected(participant) {
            this.numberOfParticipants = this.numberOfParticipants + 1;

            const initials = document.createElement('div');
            initials.classList.add('initials');

            const circle = document.createElement('div');
            circle.classList.add('circle');
            circle.appendChild(initials);

            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            overlay.appendChild(circle);

            const div = document.createElement('div');
            div.id = participant.sid;
            div.appendChild(overlay);

            const muteDiv = document.createElement('img');
            muteDiv.classList.add('mute');
            muteDiv.src =
                'https://iconsetc.com/icons-watermarks/flat-circle-white-on-red/raphael/raphael_microphone-mute/raphael_microphone-mute_flat-circle-white-on-red_512x512.png';
            div.append(muteDiv);

            participant.on('trackSubscribed', (track) =>
                this.trackSubscribed(div, track)
            );
            participant.on('trackUnsubscribed', this.trackUnsubscribed);

            participant.tracks.forEach((publication) => {
                if (publication.isSubscribed) {
                    this.trackSubscribed(div, publication.track);
                }
            });
            document.getElementById('Vid-Others').appendChild(div);

            this.numberOfParticipantsChanged();

            if (participant.identity.includes('anon')) {
                let name = `Participant # ${this.numberOfParticipants}`;
                initials.innerText = '# ' + this.numberOfParticipants;
                this.addNameto(name, div);
            } else {
                SupportService.getParticipantsForVideoRoom(
                    this.$route.params.ticket_id
                )
                    .then((res) => {
                        const user = res.data.participants.find(
                            (a) => a.identity == participant.identity
                        ).user;

                        let name = `Participant # ${this.numberOfParticipants}`;
                        initials.innerText = '# ' + this.numberOfParticipants;
                        if (user) {
                            name = user.first_name + ' ' + user.last_name;
                            initials.innerText =
                                user.first_name.substring(0, 1) +
                                user.last_name.substring(0, 1);
                        }

                        this.addNameto(name, div);
                    })
                    .catch((err) => {
                        let name = `Participant # ${this.numberOfParticipants}`;
                        initials.innerText = '# ' + this.numberOfParticipants;
                        this.addNameto(name, div);
                    });
            }
        },
        addNameto(name, div) {
            const nameDiv = document.createElement('p');
            nameDiv.classList.add('name');
            nameDiv.append(document.createTextNode(name));
            div.append(nameDiv);
        },
        numberOfParticipantsChanged() {
            let height = 100;
            let width = 100;
            switch (this.numberOfParticipants) {
                case 1:
                    height = 100;
                    width = 100;
                    break;
                case 2:
                    height = 50;
                    width = 100;
                    break;
                case 3:
                    height = 50;
                    width = 50;
                    break;
                case 4:
                    height = 50;
                    width = 50;
                    break;
                case 5:
                    height = 50;
                    width = 30;
                    break;
                default:
                    height = 30;
                    width = 30;
                    break;
            }

            document
                .getElementById('Vid-Others')
                .style.setProperty('--height-percentage', height + '%');
            document
                .getElementById('Vid-Others')
                .style.setProperty('--width-percentage', width + '%');
        },
        participantDisconnected(participant) {
            this.numberOfParticipants = this.numberOfParticipants - 1;
            document.getElementById(participant.sid).remove();
            this.numberOfParticipantsChanged();
        },
        trackSubscribed(div, track) {
            div.appendChild(track.attach());

            if (track.kind == 'video') {
                if (track.isEnabled) {
                    div.style.setProperty('--overlay-opacity', '0');
                } else {
                    div.style.setProperty('--overlay-opacity', '1');
                }
            } else if (track.kind == 'audio') {
                if (track.isEnabled) {
                    div.style.setProperty('--mute-display', 'none');
                } else {
                    div.style.setProperty('--mute-display', 'block');
                }
            }

            track.on('enabled', (a) => {
                if (a.kind == 'video') {
                    div.style.setProperty('--overlay-opacity', '0');
                } else if (a.kind == 'audio') {
                    div.style.setProperty('--mute-display', 'none');
                }
            });
            track.on('disabled', (a) => {
                if (a.kind == 'video') {
                    div.style.setProperty('--overlay-opacity', '1');
                } else if (a.kind == 'audio') {
                    div.style.setProperty('--mute-display', 'block');
                }
            });
        },
        trackUnsubscribed(track) {
            track.detach().forEach((element) => element.remove());
        },
        closeRoomAndVideo() {
            if (this.room) this.room.disconnect();
            this.room = undefined;
            if (this.localTrack) this.localTrack.stop();
            this.localTrack = undefined;
        },
        onCancel() {
            this.closeRoomAndVideo();
            this.isCallEnded = true;
        },
        goHome() {
            this.$router.push({
                path: `${getRoute(this.$route)}/administrator/support/ticket/${this.$route.params.ticket_id}/edit`,
            });
        },
        toggleAudio() {
            this.isAudioEnabled = !this.isAudioEnabled;
            this.room.localParticipant.audioTracks.forEach(function (
                audioTrack
            ) {
                if (audioTrack.track.isEnabled) {
                    audioTrack.track.disable();
                } else {
                    audioTrack.track.enable();
                }
            });
        },
        toggleVideo() {
            const selfVideo = document.getElementById('local-track');
            if (this.isVideoEnabled) {
                this.localTrack.stop();
                selfVideo.style.setProperty('opacity', '0');

                if (!detectMobileWidth()) {
                    document
                        .getElementById('video-sections')
                        .style.setProperty(
                            '--width-percentage-of-all-vid',
                            '100%'
                        );
                }
            } else {
                this.localTrack.restart();
                selfVideo.style.setProperty('opacity', '1');

                if (!detectMobileWidth()) {
                    document
                        .getElementById('video-sections')
                        .style.setProperty(
                            '--width-percentage-of-all-vid',
                            '80%'
                        );
                }
            }
            this.isVideoEnabled = !this.isVideoEnabled;
            this.room.localParticipant.videoTracks.forEach(function (
                videoTrack
            ) {
                if (videoTrack.track.isEnabled) {
                    videoTrack.track.disable();
                    videoTrack.track.stop();
                } else {
                    videoTrack.track.enable();
                    videoTrack.track.restart();
                }
            });
        },
        shareScreen() {
            navigator.mediaDevices.getDisplayMedia().then((stream) => {
                const screenTrack = new LocalVideoTrack(stream.getTracks()[0]);
                this.room.localParticipant.publishTrack(screenTrack);
            });
        },
        joinRoom(options) {
            this.isJoined = true;
            this.shouldEnableAudioOnJoin = options.audio;
            if (!this.shouldEnableAudioOnJoin) {
                this.isAudioEnabled = false;
            }
            this.shouldEnableVideoOnJoin = options.video;
            if (!this.shouldEnableAudioOnJoin) {
                this.isVideoEnabled = false;
            }
            const promises = [
                SupportService.getTokenForVideoRoom(
                    this.$route.params.ticket_id
                ),
                import('twilio-video'),
            ];

            Promise.all(promises)
                .then((responses) => {
                    this.token = responses[0].data.access_token;
                    this.TwilioVideo = responses[1];
                    
                    if (!this.TwilioVideo.isSupported) {
                        return;
                    }

                    this.connectToRoom();
                })
                .catch((err) => {
                    this.error = err;
                    console.log(err);
                });
        },
        connectToRoom() {
            this.TwilioVideo.connect(this.token, {
                name: this.$route.params.ticket_id,
            })
                .then((room) => {
                    this.room = room;

                    room.participants.forEach(this.participantConnected);
                    room.on('participantConnected', this.participantConnected);

                    room.on(
                        'participantDisconnected',
                        this.participantDisconnected
                    );
                    room.once('disconnected', (error) =>
                        room.participants.forEach(this.participantDisconnected)
                    );

                    if (!this.localTrack) {
                        room.localParticipant.videoTracks.forEach(
                            (publication) => {
                                const localMediaContainer = document.getElementById(
                                    'local-media'
                                );
                                this.localTrack = publication.track;
                                const element = this.localTrack.attach();
                                element.id = 'local-track';

                                if (detectMobileWidth()) {
                                    let localMediaContainer = document.getElementById(
                                        'video-room'
                                    );

                                    element.setAttribute(
                                        'style',
                                        'width: 100px; height: auto; position: fixed; top: 10px; left: calc(100% - 114px); z-index: 1; background-color: transparent;'
                                    );

                                    localMediaContainer.prepend(element);
                                } else {
                                    let localMediaContainer = document.getElementById(
                                        'Vid-Self'
                                    );

                                    element.setAttribute(
                                        'style',
                                        'width: 100%; height: auto;'
                                    );

                                    localMediaContainer.prepend(element);
                                }
                            }
                        );
                    }

                    if (!this.shouldEnableVideoOnJoin) {
                        this.isVideoEnabled = true;
                        this.toggleVideo();
                    }

                    if (!this.shouldEnableAudioOnJoin) {
                        this.isAudioEnabled = true;
                        this.toggleAudio();
                    }

                    room.on('disconnected', (room, error) => {
                        if (error && error.code != 53118) {
                            this.connectToRoom();
                        } else {
                            this.isCallEnded = true;
                        }

                        this.localTrack = undefined;

                        room.localParticipant.tracks.forEach((publication) => {
                            const attachedElements = publication.track.detach();
                            attachedElements.forEach((element) =>
                                element.remove()
                            );
                        });
                    });
                })
                .catch((err) => {
                    this.error = err;
                    console.log(err);
                });
        },
    },
    mounted() {
        // this.joinRoom()
    },
    destroyed() {
        this.closeRoomAndVideo();
    },
};
</script>

<style lang="less" scoped>
.video-room {
    width: 100%;
    height: 100%;
    background-color: white;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
    --name-font-size: 16px;

    @media @mobile {
        --name-font-size: 12px;
        background-color: black;
    }
}

.video-sections {
    display: flex;
    width: 100%;
    height: calc(100% - 92px);
    gap: 0px;
    --width-percentage-of-all-vid: 80%;

    @media @mobile {
        --width-percentage-of-all-vid: 100%;
    }

    .all-vid {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        background-color: #292929;
        width: var(--width-percentage-of-all-vid);
        height: 100%;
        --height-percentage: 100%;
        --width-percentage: 100%;
        ::v-deep div {
            position: relative;
            width: var(--width-percentage);
            height: var(--height-percentage);
            display: flex;

            .overlay {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                height: 100%;
                width: 100%;
                opacity: var(--overlay-opacity);
                transition: 0.5s ease;
                background-color: #292929;
                display: flex;

                .circle {
                    height: auto;
                    width: auto;
                    margin: 0 auto;
                    align-self: center;

                    .initials {
                        color: white;
                        padding: 10%;
                        font-size: 10vw;
                        text-align: center;
                        vertical-align: middle;
                    }
                }
            }
        }
    }

    .video-self {
        width: calc(100% - var(--width-percentage-of-all-vid));
        height: fit-content;
        position: relative;
        background-color: #292929;
    }
}

::v-deep .mute {
    position: absolute;
    bottom: 20px;
    opacity: 0.7;
    right: 0;
    margin-bottom: -8px;
    margin-right: 14px;
    color: #fff;
    height: 43px;
    display: var(--mute-display);
}

::v-deep video {
    width: 100%;
    height: 100%;
    background-color: rgb(41, 41, 41);
}

::v-deep .name {
    position: absolute;
    bottom: 20px;
    opacity: 0.7;
    left: 0;
    margin: 0;
    padding: 0.5em 0.5em 0.5em 2em;
    background: rgba(242, 47, 70, 0.8);
    color: #fff;
    font-size: var(--name-font-size);
    line-height: 1;
}

::v-deep .name:hover {
    opacity: 1;
}

::v-deep .name::after {
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    top: 0;
    right: -2em;
    border: 1em solid rgba(242, 47, 70, 0.8);
    border-right-color: transparent;
    border-bottom-color: transparent;
}

.chat-section {
    height: 100%;
}

.self-controls {
    justify-content: center;
    display: flex;
    padding: 16px;
    height: auto;
    background-color: #2036ded1;

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

        .end-call {
            ::v-deep svg {
                #prefix__call-end {
                    fill: #dd4b39;
                }
            }
        }
    }

    .action-button:hover {
        box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
        @media screen {
            box-shadow: none;
        }
    }
}

.waiting {
    margin-top: 180px;
    text-align: center;
    width: 100%;
    height: 100px;
    color: #41434c;
    padding: 20px;
    box-sizing: border-box;
}
</style>
