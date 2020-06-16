<template>
  <div class="panel">
    <div class="main-container">
      <div class="page-container common-container">
        <div class="left-container">
          <div class="user-name">Hi {{ fullName }},</div>
          <div class="welcome-message">
            Get ready to build with Fynd. Try these tips to get started.
          </div>
          <div class="feature-div">
            <div class="home-feature">
              <div
                class="home-feature-div"
                v-for="(item, index) in homeFeature"
                :key="index"
              >
                <div class="home-feature-icon">
                  <div>
                    <inline-svg
                      class="icon-placeholder"
                      :src="item.icon"
                    ></inline-svg>
                  </div>
                  <div class="home-feature-title">
                    {{ item.display || 'Lorem Ispum' }}
                  </div>
                </div>

                <div class="home-feature-desc">
                  <p>
                    {{ item.desc || 'Lorem Ispum Lorem Ispum Lorem Ispum' }}
                  </p>
                </div>
                <div class="home-feature-link" @click="navigateToFeature(item)">
                  <nitrozen-button :theme="'secondary'"
                    >Go to {{ item.display }}</nitrozen-button
                  >
                  <inline-svg
                    class="navigate-icon"
                    :src="'right-arrow'"
                  ></inline-svg>
                </div>
              </div>
            </div>

            <div class="new-feature">
              <div class="new-feature-head">
                What's New
              </div>
              <div class="new-feature-points">
                <ol>
                  <li v-for="(item, index) in whatsNew" :key="'points' + index">
                    {{ item.desc }}
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div class="tips-div">
            <div class="home-tips">
              <div class="home-tips-div">
                <div class="home-tips-head">
                  <span>More</span>
                </div>
                <div class="home-tips-body">
                  <span
                    class="home-tips-menu"
                    v-for="(item, index) in tips"
                    :key="'tips' + index"
                  >
                    <a :href="item.link" target="_blank">
                      <div class="settings-body">
                        <div class="home-tips-img">
                          <img :src="item.icon" class="tips-img" />
                        </div>
                        <div class="home-tips-desc">
                          {{ item.desc }}
                        </div>
                      </div>
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.main-container {
  margin-right: 0;
  .common-container {
    padding-right: 0;
    background-color: @Alabaster2;
    .user-name {
      color: @Mako;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
    }
    .welcome-message {
      color: @Mako;
      font-size: 16px;
      line-height: 35px;
    }
    .feature-div {
      margin-top: 24px;
      display: flex;
      flex-wrap: wrap;
    }
  }
}
.home-feature {
  display: flex;
  flex-wrap: wrap;
  flex: 0 70%;
  .home-feature-div {
    flex: 0 40%;
    margin: 0 12px 24px 0;
    border-radius: 8px;
    background-color: @White;
    // min-height: 300px;
    border: 1px solid @WhiteSmoke;
    padding: 24px;
    &:hover {
      box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
    }
    .home-feature-icon {
      display: flex;
      // justify-content: space-between;
      .icon-placeholder {
        height: 60px;
        width: 60px;
        background-color: #f8f8f8;
        // border: 1px solid @Iron;
        border-radius: 50%;
        ::v-deep svg {
          width: 30px;
          height: 30px;
        }
      }
    }
    .home-feature-title {
      color: @Mako;
      font-size: 18px;
      font-weight: 600;
      line-height: 27px;
      padding-top: 12px;
      margin-left: 24px;
    }
    .home-feature-desc {
      color: @Mako;
      font-size: 16px;
      line-height: 24px;
      padding-top: 12px;
      height: 70px;
    }
    .home-feature-link {
      padding-top: 12px;
      display: flex;
      align-items: center;
      cursor: pointer;
      float: right;
      .navigate-icon {
        display: inherit;
      }
    }
  }
}
.new-feature {
  background-color: #5c6bdd;
  padding: 24px;
  border-radius: 8px;
  flex: 0 22%;
  margin: 0 12px 24px 0;
  color: @White;
  .new-feature-head {
    font-weight: bold;
    font-size: 16px;
  }
  .new-feature-points {
    margin-top: 24px;
    ol {
      list-style: decimal;
      margin-left: 12px;
      li {
        margin-top: 24px;
        line-height: 20px;
        font-size: 14px;
      }
    }
  }
  &:hover {
    box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
  }
}

.tips-div {
  display: flex;
  flex-wrap: wrap;
  .home-tips {
    display: flex;
    flex-wrap: wrap;
    flex: 0 70%;
    .home-tips-div {
      background-color: @White;
      border-radius: 8px;
      padding: 24px;
      width: 100%;
      margin-right: 24px;
      .home-tips-head {
        display: flex;
        justify-content: space-between;
        color: @Mako;
        font-size: 18px;
        font-weight: 600;
      }
      .home-tips-body {
        display: flex;
        flex-wrap: wrap;
        margin-right: -24px;
        height: 185px;
        .home-tips-menu {
          flex: 0 33.3%;
          .settings-body {
            border: 1px solid @Iron;
            border-radius: 3px;
            height: 100px;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            margin: 24px 24px 0 0;
            &:hover {
              box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.1);
            }
          }
          .home-tips-img {
            background-color: @Alabaster2;
            height: 105px;
            width: 100%;
            .tips-img {
              width: 100%;
              height: 105px;
            }
          }
          .home-tips-desc {
            height: 50px;
            display: flex;
            margin-top: 16px;
            color: @Mako;
            font-weight: 500;
            font-size: 14px;
            line-height: 22px;
          }
        }
      }
    }
  }
}
</style>

<script>
import inlinesvg from '@/components/common/inline-svg.vue'
import { mapGetters } from 'vuex'
import { GET_USER_INFO, GET_USER_ACCESS } from '@/store/getters.type'
import { getNavigations } from '@/pages/partner/navigations'

import { NitrozenButton } from '@gofynd/nitrozen-vue'

export default {
  name: 'partner-home',
  components: {
    'inline-svg': inlinesvg,
    'nitrozen-button': NitrozenButton
  },
  computed: {
    ...mapGetters({
      userdata: GET_USER_INFO,
      accessDetail: GET_USER_ACCESS
    }),
    fullName() {
      if (this.userdata.user && this.userdata.user.firstName) {
        return `${this.userdata.user.firstName}`
      }
      return 'Team Member'
    }
  },
  data() {
    return {
      homeFeature: [],
      whatsNew: [
        {
          desc: `Incepted Fynd Partners, an auxiliary merchant-centric channel of Fynd Platform`
        },
        {
          desc: `Brand new UI, crisp features and enhanced support for our partners`
        },
        {
          desc: `Now create websites, themes  for Fynd merchants` //and mini-apps
        },
        {
          desc: `Effortless management of applications that converge into one place`
        },
        {
          desc: `Support for creating and exploring desirable themes to improve elegance of your applications  `
        }
        // {
        //   desc: `Support for mini-apps which integrate multiple businesses in a single platform`
        // }
      ],
      tips: [
        {
          desc: 'Partners to help you grow',
          icon: '/public/assets/pngs/more-services/partner.png',
          link: 'https://partners.fynd.com/'
        },
        {
          desc: 'Learn everything about Fynd Platform',
          icon: '/public/assets/pngs/more-services/platform.png',
          link: 'https://platform.fynd.com/'
        },
        {
          desc: 'Build and contribute to the community',
          icon: '/public/assets/pngs/more-services/community.png',
          link: 'https://community.fynd.com/'
        }
      ]
    }
  },
  mounted() {
    this.getHomeFeature()
  },
  methods: {
    getHomeFeature() {
      let navPanel = {}
      for (let [key, value] of Object.entries(getNavigations(this.$route))) {
        const isValid = this.checkPermissions(value[0].permissions)
        if (isValid) {
          navPanel[key] = value
        }
      }
      delete navPanel.Home
      delete navPanel.About
      let randomArr = this.getRandomKey(Object.keys(navPanel), 4)

      let arr = []
      for (let i = 0; i < randomArr.length; i++) {
        if (navPanel[randomArr[i]]) {
          arr.push(_.sample(navPanel[randomArr[i]]))
        }
      }
      this.homeFeature = arr
    },
    getRandomKey(arr, key = 1) {
      return _.sampleSize(arr, key)
      // let data = {};
      // for(let i = 0; i<4; i++){

      // }
      // return obj[keys[(keys.length * Math.random()) << 0]];
    },
    navigateToFeature(item) {
      if (item.target) {
        window.open(item.link, '_blank')
      } else {
        this.$router.push(item.link)
      }
    },
    checkPermissions: function(permission) {
      const userPermissions = this.accessDetail.permissions
      let isValid = true
      if (permission && permission.length) {
        isValid = userPermissions.some((item) => permission.includes(item))
      }
      return isValid
    }
  }
}
</script>
