<template>
  <div class="gnb">
    <ul class="gnb_li">
      <li class="back" @click="onBack"></li>
      <li class="home" @click="onHome"></li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
export default {
  name: 'navigator',
  data () {
    return {
      // hardkeyCodes: this.$hardkey.getCodes()
    }
  },
  computed: {
    ...mapState({
      depthInfo: state => state.depthInfo
    }),
    ...mapGetters({
      newAppsApplication: 'newAppsApplication'
    })
  },
  methods: {
    onBack () {
      this.$store.dispatch('backward')
    },
    onHome () {
      if (window.applicationFramework) {
        window.applicationFramework.applicationManager.getOwnerApplication(window.document).home()
      }
    },
    initHardKeyAction () {
      this.$hardkey.addHardkeyListener(this.hardkeyCodes.code.HARDKEY_BUTTON_BACK, (e) => {
        this.onBack()
      })
    },
    mounted () {
      this.initHardKeyAction()
    }
  }
}
</script>
