<template>
  <div class="avatar-circle">
    {{ this.initials }}
  </div>
</template>

<style lang="less" scoped>
.avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  text-align: center;
  line-height: 60px;
  background: @RoyalBlue;
  color: white;
  font-weight: 700;
  font-size: 18px;
  @media @mobile {
        width: 100%;
        height: 100%;
        line-height: 55px;
        min-width: 50px;
    }
}
</style>

<script>
export default {
  name: 'text-avatar',
  components: {},
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      initials: ''
    }
  },
  mounted() {
    if (this.text) {
      let text = String(this.text)
      let initials = text.replace(/[^a-zA-Z- ]/g, '').match(/\b\w/g)
      if (!initials || (initials && initials.length < 2 && text.length >= 2)) {
        initials = [text[0].toUpperCase(), text[1].toUpperCase()]
      }
      this.initials = initials
        .filter((a, i) => i <= 1)
        .map((a) => a.toUpperCase())
        .join('')
    }
  },
  methods: {}
}
</script>
