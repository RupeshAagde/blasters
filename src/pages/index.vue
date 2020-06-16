<template>
  <div class="container">
    <static-header></static-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>

    <section class="create-partner-account">
      <h1 class="content-header">Create your free partner account today</h1>
      <p class="content-desc">
        Everything you need to go from where you are, to where you want to be.
      </p>
      <div class="email-get-started">
        <nitrozen-input type="email" placeholder="Enter your email address">
        </nitrozen-input>
        <nitrozen-button v-flat-btn :theme="'secondary'" @click="openLogin">
          Get Started
        </nitrozen-button>
      </div>
    </section>
    <section class="footer-link">
      <div class="about-us">
        <div class="logo">
          <img src="/public/assets/pngs/logo.png" alt="Fynd Partners" />
        </div>
        <div class="desc">
          Fynd Partners is an auxiliary channel of Fynd Platform which intends
          to support merchant businesses through the assistance of partners. We
          strive to deliver a seamless experience to sellers via experts, who
          can build themes, plugins, mini-apps and provide influencer services.
          Become a Fynd Partner today.
        </div>
        <div class="links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact Us</a>
          <a href="#">FAQs</a>
        </div>
      </div>
    </section>
    <footer>
      <div class="copyright">
        #MadeInIndia | &copy; {{ new Date().getFullYear() }} Shopsense Retail
        Technologies
      </div>
      <div class="social">
        <!-- TODO: fix this using recursive svg gen -->
        <a
          href="https://www.facebook.com/gofynd"
          target="_blank"
          title="Facebook"
        >
          <img src="/public/assets/svgs/social/facebook.svg" />
        </a>
        <a
          href="https://www.twitter.com/GoFynd"
          target="_blank"
          title="Twitter"
        >
          <img src="/public/assets/svgs/social/twitter.svg" />
        </a>
        <a
          href="https://www.instagram.com/gofynd/"
          target="_blank"
          title="Instafram"
        >
          <img src="/public/assets/svgs/social/instagram.svg" />
        </a>
        <a
          href="https://www.youtube.com/channel/UCk0fmGcZYDwGk_8mD4DE5Gg/featured"
          target="_blank"
          title="YouTube"
        >
          <img src="/public/assets/svgs/social/youtube.svg" />
        </a>
        <a
          href="https://www.pinterest.com/gofynd/"
          target="_blank"
          title="Pinterest"
        >
          <img src="/public/assets/svgs/social/pinterest.svg" />
        </a>
        <a
          href="https://www.linkedin.com/company/fynd-shopsense/"
          target="_blank"
          title="Linked In"
        >
          <img src="/public/assets/svgs/social/linkedin.svg" />
        </a>
        <!-- <inline-svg src="social/facebook" /> -->
      </div>
    </footer>
  </div>
</template>

<script>
import { NitrozenButton, NitrozenInput, flatBtn } from '@gofynd/nitrozen-vue'
import { mapGetters } from 'vuex'
import { IS_LOGGED_IN } from '@/store/getters.type'
import { SIGNOUT_USER, OPEN_LOGIN_MODAL } from '@/store/action.type'
import StaticHeaderVue from '@/components/header/static.vue'
import inlineSVG from '@/components/common/inline-svg.vue'
export default {
  components: {
    'static-header': StaticHeaderVue,
    'nitrozen-button': NitrozenButton,
    'nitrozen-input': NitrozenInput,
    'inline-svg': inlineSVG
  },
  directives: {
    flatBtn
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
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  .child-container {
    width: 100%;
  }
  section.create-partner-account {
    width: 100%;
    background-color: #f4f8fb;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0;
    text-align: center;
    .email-get-started {
      display: flex;
      width: 100%;
      justify-content: center;
      margin-top: 50px;
      .nitrozen-form-input {
        margin-right: 10px;
        min-width: 300px;
      }
    }
  }
  section.footer-link {
    padding: 20px 0;
    .about-us {
      display: flex;
      color: @DustyGray2;
      .logo {
        width: 15%;
        padding-left: 20px;
      }
      .desc {
        width: 50%;
        font-size: 14px;
        line-height: 21px;
      }
      .links {
        width: 35%;
        display: flex;
        justify-content: space-evenly;
        a {
        }
      }
    }
  }
  footer {
    display: flex;
    height: 40px;
    padding: 20px 0;
    width: 100%;
    border-top: 1px solid @Iron;

    max-width: 1400px;
    .copyright {
      font-size: 12px;
      line-height: 40px;
      color: @DustyGray2;
      margin-left: 20px;
    }
    .social {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      margin-right: 20px;
      a {
        margin: 0 5px;
      }
      .link {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 0 10px;
        background-color: @DustyGray2;
      }
    }
  }
}
</style>
