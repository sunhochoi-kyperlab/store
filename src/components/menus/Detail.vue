<template>
  <div id="detail" class="contents full">
    <div class="fix-item">
      <div class="preview">
        <div class="icon">
            <img :src="detailApplication ? detailApplication.iconSrc || '' : ''" alt="" width="100px" height="100px">
            <!--  v-if="badge" -->
            <span class="new"><span>N</span></span>
        </div>
        <div class="summary">
          <h2>{{appName}}</h2>
          <p>Version {{appVersion}}</p>
        </div>
      </div>
      <div class="btn-zone">
          <button class="btn" @click="onButtonClick">{{buttonName}}</button>
          <button class="btn" :class="isUninstallDisable" @click="onUninstallClick" v-if="detailApplication ? detailApplication.status === 'LOCAL' || detailApplication.status === 'SERVER' : false">Uninstall</button>
      </div>
    </div>
    <div class="app-detail">
      <div class="title" v-if="appNewDesc">
        <h3>What’s new</h3>
        <p v-html="appNewDesc"></p>
      </div>
      <div class="description">
        <h3>Description</h3>
        <p v-html="appDesc"></p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {appStatus, defaultApp} from '../../js/defines'
export default {
  computed: {
    ...mapState({
      lang: (state) => state.lang
    }),
    ...mapGetters([
      'detailApplication'
    ]),
    buttonName () {
      if (!this.detailApplication) return
      if (this.detailApplication.status === appStatus.LOCAL) {
        return 'Open'
      } else if (this.isInstall) {
        return 'Install'
      } else if ([appStatus.SERVER].indexOf(this.detailApplication.status) >= 0) {
        return 'Update'
      }
    },
    isInstall () {
      return [appStatus.NEW, appStatus.DOWNLOADED].indexOf(this.detailApplication.status) >= 0
    },
    isUninstallDisable () {
      return this.detailApplication && !defaultApp.isDefault(this.detailApplication.id) ? '' : 'dis'
    },
    appName () {
      if (this.detailApplication) {
        return this.detailApplication.getName()
      } else {
        return ''
      }
    },
    appVersion () {
      return this.detailApplication && this.detailApplication.version ? this.detailApplication.version : ''
    },
    appNewDesc () {
      if (this.detailApplication) {
        return this.detailApplication.getNewDesc()
      } else {
        return ''
      }
    },
    appDesc () {
      if (this.detailApplication) {
        return this.detailApplication.getDesc()
      } else {
        return ''
      }
    }
  },
  methods: {
    onButtonClick () {
      if (!this.detailApplication) {
        return
      }
      if (this.detailApplication.remove) {
        this.$store.dispatch('uninstallApplication', {type: 'remove'})
      } else if (this.detailApplication.blacklist) {
        this.$store.dispatch('msgBlacklist')
      } else {
        if (this.detailApplication.status === appStatus.LOCAL) {
          this.$store.dispatch('openApplication', this.detailApplication.id)
        } else if ([appStatus.NEW, appStatus.SERVER, appStatus.DOWNLOADED].indexOf(this.detailApplication.status) >= 0) {
          this.$store.dispatch('installApplication')
        }
      }
    },
    onUninstallClick () {
      if (this.isUninstallDisable) {
        this.$store.dispatch('disUninstallApplication')
      } else {
        this.$store.dispatch('uninstallApplication')
      }
    }
  }
}
</script>
