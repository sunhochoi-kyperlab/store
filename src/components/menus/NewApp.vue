<template>
<div style="height:inherit;">
  <div id="noapp" class="contents">
    <p class="info-text">No apps to show.</p>
  </div>
  <div id="apps" class="contents">
    <div class="list st2" ref="mainScroll">
      <ul>
        <template v-for="item in newAppsApplication">
          <app-item
            :key="item.id"
            :id="item.id || ''"
            :status="item.status || ''"
            :title="item.getName()"
            :imgSrc="item.iconSrc || ''"
          ></app-item>
        </template>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import Iscroll from 'obigo-js-ui/features/iscroll'

import AppItem from './AppItem'
export default {
  components: {
    AppItem
  },
  data () {
    return {
      currentPageUrl: '',
      clickPoint: {
        range_x: 140,
        range_y: 40,
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    ...mapState({
      lang: (state) => state.lang
    }),
    ...mapGetters({
      newAppsApplication: 'newAppsApplication'
    })
  },
  methods: {
    onStart (e) {
      console.log('[Store] Touch onStart')
      e = e.touches ? e.touches[0] : e
      this.clickPoint.x = e.clientX
      this.clickPoint.y = e.clientY
    },
    onEnd (title, url, e) {
      console.log('[Store] Touch onEnd')
      e = e.changedTouches ? e.changedTouches[0] : e
      let deltaX = Math.abs(e.clientX - this.clickPoint.x)
      let deltaY = Math.abs(e.clientY - this.clickPoint.y)
      if (deltaX > this.clickPoint.range_x || deltaY > this.clickPoint.range_y) {
        return
      }
      // this.movePage(title, url)
    },
    movePage (title, url) {
    },
    makeScroll () {
      this.$scroll = new Iscroll(this.$refs.mainScroll, {
        probeType: 2,
        scrollY: true,
        bounce: false,
        mouseWheel: false,
        scrollbars: true,
        fadeScrollbars: true,
        interactiveScrollbars: false,
        click: true,
        disableMouse: !('onmousedown' in window),
        disablePointer: true,
        disableTouch: !('ontouchstart' in window)
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path === from.path) return
      if (to.path.split('/').length === 2) {
        this.currentPageUrl = to.path
      }
    }
  },
  mounted () {
    this.makeScroll()
  },
  updated () {
    this.$scroll.refresh()
  }
}
</script>

<style lang="scss" scoped>
  ::-webkit-scrollbar {
    display: none;
  }
</style>

<style lang="scss">
.iScrollIndicator {
  width: 9px !important;
  background-color: #aaaaaa !important;
  border-radius: 0 !important;
}
</style>
