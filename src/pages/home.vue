<template>
  <div>
    <section class="league-of-experts">
      <div class="left">
        <h1>League of experts helping businesses</h1>
        <p>
          Inviting professionals and experts to provide their valuable skills
          and expertise to the merchants of Fynd Platform.
        </p>
        <nitrozen-button v-flat-btn :theme="'secondary'" @click="openLogin">
          Get Started
        </nitrozen-button>
      </div>
      <div class="right">
        <img src="/public/assets/pngs/home/league-of-experts.png" />
      </div>
    </section>
    <section class="elevate-merchat-experience">
      <h1 class="content-header">Elevating merchant experience</h1>
      <p class="content-desc">
        Join the wide pool of coders, designers, developers, marketer,
        influencer, freelancers and many more! Here’s few of the innumerable
        ways you can allow the merchants to capitalize on your creativity.
      </p>
      <div class="cards-container">
        <div class="card">
          <div class="card-image">
            <div class="img">
              <img src="/public/assets/pngs/home/build-themes.png" />
            </div>
          </div>
          <div class="card-content">
            <div class="card-title">Build Themes</div>
            <div class="card-text">
              Scale the aesthetics of a merchant business by building themes for
              applications.
            </div>
          </div>
        </div>
        <div class="card" v-if="false">
          <div class="card-image">
            <div class="img">
              <img src="/public/assets/pngs/home/develop-plugins.png" />
            </div>
          </div>
          <div class="card-content">
            <div class="card-title">Develop Plugins</div>
            <div class="card-text">
              Integrate extensible functionalities by offering social media,
              chat, analytics and custom plugins.
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-image">
            <div class="img">
              <img src="/public/assets/pngs/home/integrate-mini-apps.png" />
            </div>
          </div>
          <div class="card-content">
            <div class="card-title">Integrate Mini Apps</div>
            <div class="card-text">
              Develop mini apps for your consumers to connect and explore
              multiple businesses on a single platform.
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="accelerate-your-success">
      <h1 class="content-header">Accelerate your success</h1>
      <p class="content-desc">
        Join the wide pool of coders, designers, developers, marketer,
        influencer, freelancers and many more! Here’s few of the innumerable
        ways you can allow the merchants to capitalize on your creativity.
      </p>
      <div class="cards-container">
        <div class="card">
          <div class="card-image">
            <div class="img">
              <img src="/public/assets/svgs/home/gain-mastery.svg" />
            </div>
          </div>
          <div class="card-content">
            <div class="card-title">Gain Mastery</div>
            <div class="card-text">
              Lots of user documentation, resources and guides to familiarize
              yourselves with Fynd Platform.
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-image">
            <div class="img">
              <img src="/public/assets/svgs/home/achieve-reputation.svg" />
            </div>
          </div>
          <div class="card-content">
            <div class="card-title">Achieve Reputation</div>
            <div class="card-text">
              You gain immensely when merchants point you as their preferred
              partner.
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-image">
            <div class="img">
              <img src="/public/assets/svgs/home/independence.svg" />
            </div>
          </div>
          <div class="card-content">
            <div class="card-title">Independence</div>
            <div class="card-text">
              You are your own master. Enjoy and market your services
              uninterruptedly to your clients.
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-image">
            <div class="img">
              <img src="/public/assets/svgs/home/independence.svg" />
            </div>
          </div>
          <div class="card-content">
            <div class="card-title">Unmatched Incentives</div>
            <div class="card-text">
              Earning on auto-pilot mode when you become a Fynd Platform
              Partner.
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-image">
            <div class="img">
              <img src="/public/assets/svgs/home/opportunities.svg" />
            </div>
          </div>
          <div class="card-content">
            <div class="card-title">Opportunities</div>
            <div class="card-text">
              Your growth compounds as the merchant business expands
              progressively.
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="fynd-partner">
      <div class="left">
        <img src="/public/assets/pngs/home/fynd-partner.png" />
      </div>
      <div class="right">
        <h1>Fynd Partner</h1>
        <p>
          A large number of merchants rely on Platform Partners for assistance.
          Whether it's marketing, development or coding, there's a constant
          demand for partners to grow businesses.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import {
  NitrozenButton,
  NitrozenInput,
  strokeBtn,
  flatBtn
} from '@gofynd/nitrozen-vue'
import { mapGetters } from 'vuex'
import { IS_LOGGED_IN } from '@/store/getters.type'
import { SIGNOUT_USER, OPEN_LOGIN_MODAL } from '@/store/action.type'
export default {
  components: {
    'nitrozen-button': NitrozenButton,
    'nitrozen-input': NitrozenInput
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  computed: {
    ...mapGetters({
      isLoggedIn: IS_LOGGED_IN
    })
  },
  methods: {
    signOut() {
      this.$store.dispatch(SIGNOUT_USER)
    },
    openLogin() {
      if (this.isLoggedIn) {
        return this.$router.push('/organizations')
      }
      this.$store.dispatch(OPEN_LOGIN_MODAL)
    }
  }
}
</script>

<style lang="less" scoped>
section {
  width: 100%;
  max-width: 1400px;
  min-height: 50px;
}
section:first-child {
  margin-top: 100px;
}
section:nth-child(2n + 1) {
  background-color: #f4f8fb;
}

section.league-of-experts {
  margin-top: 100px;
  padding: 80px 0;
  display: flex;
  .left {
    width: 58%;
    padding-left: 40px;
    color: @HomePageText;
    h1 {
      font-size: 60px;
      line-height: 83px;
      font-weight: bold;
      font-family: Montserrat;
    }
    p {
      max-width: 350px;
      font-size: 14px;
      line-height: 21px;
      font-family: Poppins;
      margin: 45px 0;
    }
  }
  .right {
    width: 42%;
    padding-right: 40px;
    img {
      width: 100%;
    }
  }
}

section.elevate-merchat-experience {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
  text-align: center;
  .cards-container {
    display: flex;
    justify-content: space-evenly;
    margin-top: 50px;
    .card {
      width: 30%;
      // height: 590px;
      background-color: white;
      box-shadow: 8px 8px 8px #0000000d;

      float: left;
      .card-image {
        width: 90%;
        position: relative;
        padding: 40px 5%;
        .img {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 90%;
          }
        }
      }
      .card-image:before {
        content: '';
        display: block;
        padding-top: 100%;
      }
      .card-content {
        text-align: left;
        color: @HomePageText;
        padding: 20px;
        border-top: 1px solid @Iron;

        .card-title {
          font-size: 20px;
          line-height: 30px;
          font-weight: bold;
        }
        .card-text {
          padding: 18px 0;
          font-size: 14px;
          line-height: 21px;
        }
      }
    }
  }
}
section.accelerate-your-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
  text-align: center;
  .cards-container {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    .card {
      margin-top: 50px;
      width: 25%;
      background-color: white;
      border: 1px solid @Iron;
      padding: 20px;

      float: left;
      .card-image {
        width: 100%;
        position: relative;
        .img {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 130px;
          height: 130px;
          background-color: #f4f8fb;
          img {
            width: 82px;
            height: 82px;
            width: 90%;
          }
        }
      }
      .card-content {
        text-align: left;
        padding: 20px;

        .card-title {
          font-size: 22px;
          line-height: 33px;
          font-weight: 500;
          color: black;
        }
        .card-text {
          color: @HomePageText;
          padding: 9px 0;
          font-size: 18px;
          line-height: 27px;
        }
      }
    }
  }
}
section.fynd-partner {
  display: flex;
  padding: 80px 0;
  .left {
    width: 42%;
    padding-left: 120px;
    img {
      width: 90%;
    }
  }
  .right {
    width: 58%;
    padding: 80px 0;
    padding-right: 120px;
    h1 {
      font-family: Poppins;
      font-size: 36px;
      line-height: 55px;
      font-weight: bold;
      color: @Mako;
    }
    p {
      max-width: 635px;
      font-size: 14px;
      line-height: 21px;
      margin: 18px 0;
      color: @HomePageText;
    }
  }
}
</style>
