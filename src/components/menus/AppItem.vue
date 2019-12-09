<template>
  <li  @click="onListClick">
    <div class="thumb">
      <span class="new" v-if="badge"><span>N</span></span>
      <img :src="imgSrc" alt="" width="70px" height="70px">
    </div>
    <div class="name-area">
        <h3>{{title}}</h3>
        <span>Catergory Name</span>
    </div>
    <div class="btn-area">
      <button class="btn" @click.stop="onButtonClick">{{buttonName}}</button>
    </div>
  </li>
</template>

<script>
import {appStatus} from '../../js/defines'
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'detailApplication'
    ]),
    buttonName () {
      if (this.status === appStatus.LOCAL) {
        return 'Open'
      } else if ([appStatus.NEW, appStatus.DOWNLOADED].indexOf(this.status) >= 0) {
        return 'Install'
      } else if ([appStatus.SERVER].indexOf(this.status) >= 0) {
        return 'Update'
      }
    }
  },
  methods: {
    onButtonClick () {
      this.$store.commit('setAppSelectID', this.id)
      if (!this.detailApplication) {
        return
      }
      if (this.remove) {
        this.$store.dispatch('uninstallApplication', {type: 'remove'})
      } else if (this.blacklist) {
        this.$store.dispatch('msgBlacklist')
      } else {
        if (this.detailApplication.status === appStatus.LOCAL) {
          this.$store.dispatch('openApplication', this.detailApplication.id)
        } else if ([appStatus.NEW, appStatus.SERVER, appStatus.DOWNLOADED].indexOf(this.detailApplication.status) >= 0) {
          this.$store.dispatch('installApplication')
        }
      }
    },
    onListClick () {
      this.$store.commit('setAppSelectID', this.id)
      this.$store.commit('setPageShow', 'detail')
      this.$router.push('/detail')
    }
  },
  props: {
    id: String,
    title: String,
    status: {
      default: appStatus.LOCAL
    },
    imgSrc: {
      type: String,
      default: ''
    },
    badge: Boolean,
    remove: Boolean,
    blacklist: Boolean
  }
}
</script>

<style lang="scss" scoped>
.list .thumb:before {
  border: 0
}
</style>
