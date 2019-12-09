<template>
<div id="app">
  <div id='container' :class="`${pageShow}${progressShow ? ' progress' : ''}`">
    <loader></loader>
    <progress-popup v-if="progressShow"></progress-popup>
    <navigation></navigation>
    <side-menu></side-menu>
    <main-content></main-content>
  </div>
</div>
</template>

<script>
import Navigation from './components/container/Navigation'
import SideMenu from './components/container/SideMenu'
import MainContent from './components/container/MainContent'
import Loader from './components/container/Loader'
import ProgressPopup from './components/container/ProgressPopup'
import {mapState} from 'vuex'

export default {
  name: 'home',
  components: {
    Navigation,
    SideMenu,
    MainContent,
    Loader,
    ProgressPopup
  },
  computed: {
    ...mapState({
      progressShow: state => state.progressShow,
      pageShow: state => state.pageShow
    })
  },
  mounted () {
    this.$store.dispatch('initialize')
      .catch(err => {
        if (err && err.indexOf('cancel Network Connection') >= 0) {
          this.$store.dispatch('backward')
        }
      })
  },
  watch: {
    '$route' (to, from) {
    }
  }
}
</script>

<style lang="scss" scoped>
#app{
  width: 1280px;
  height: 650px;
}
</style>

<style lang="scss">
.overlay{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.65);
  z-index: 1000;
  .popup{
    position: absolute;
    top: 121px;
    left: 50%;
    margin-left: -330px;
    width: 658px !important;
    height: 350px;
    color: #acacac;
    text-align: center;
    background-color: #13161b;
    border: 1px solid #616161;
    overflow: hidden;
    .title-inner{
      padding-top: 47px;
      margin: 0 auto;
      width: 90%;
      font-size: 33px;
      line-height: 150%;
      overflow: hidden;
    }
    .text{
      padding-top: 27px;
      margin: 0 auto;
      width: 90%;
      height: 98px;
      font-size: 33px;
      line-height: 152%;
      overflow: hidden;
      white-space: pre;
    }
    .btn-area{
      position: relative;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 99px;
      &::before{
        position: absolute;
        top: -1px;
        left: 0;
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background-color: #616161;
      }
      button{
        width: 100%;
        height: 100%;
        float: left;
        display: block;
        text-align: center;
        color: #acacac;
        font-size: 33px;
        line-height: 94px;
        &:active{
          background-color: #424549;
          color: #ffffff;
        }
        & + button {
          border-left: 1px solid #616161;
        }
      }
    }
  }
}
</style>