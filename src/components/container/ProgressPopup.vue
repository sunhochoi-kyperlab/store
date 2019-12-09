<template>
  <div class="pop" :class="`${progressShow ? ' progress' : ''}`">
    <div class="pop-up">
      <div class="pop-con">
        <div class="pop-tittle">{{title}}</div>
        <div class="pop-textarea" :class="`${popupType.APPINFO === type ? ' detail' : ''}`">
          <div class="preview">
            <div class="icon"><img :src="detailApplication ? detailApplication.iconSrc : ''" alt=""></div>
            <div class="summary">
              <h2>{{detailApplication ? detailApplication.getName() : ''}}</h2>
              <!-- <p class="sub-info">{{detailApplication ? detailApplication.getDesc() : ''}}</p> -->
            </div>
          </div>
          <div class="detail-text" v-if="popupType.APPINFO === type">{{contents}}</div>
          <div class="progress" v-if="popupType.PROGRESS === type">
            <div class="bar">
              <div class="value" :style="`width:${detailApplication ? detailApplication.getPercent() : '0%'}`"></div>
            </div>
            <!-- <div class="rate"> -->
              <!-- <span v-if="detailApplication" class="size"><em>{{' ' + detailApplication.getPercentSize()}}</em> / {{detailApplication.getFileSize()}}</span> -->
              <span v-if="detailApplication" class="percentage">{{detailApplication.getPercent()}}</span>
            <!-- </div> -->
          </div>
        </div>
      </div>
      <div class="pop-btnarea" v-if="buttons.length === 1">
        <button class="pop-btn" @click="buttons[0].onClick">{{buttons[0].label}}</button>
      </div>
      <div class="pop-btnarea dual" v-if="buttons.length === 2">
        <button class="pop-btn" @click="buttons[0].onClick" v-if="buttons[0].label === 'INSTALL'">{{installStatus === 'PAUSE' ? 'Pause' : 'Resume'}}</button>
        <button class="pop-btn" @click="buttons[0].onClick" v-if="buttons[0].label !== 'INSTALL'">{{buttons[0].label}}</button>
        <button class="pop-btn" @click="buttons[1].onClick">{{buttons[1].label}}</button>
      </div>
    </div>
  </div>
</template>
 
<script>
import {mapState, mapGetters} from 'vuex'
import {popupType} from '../../js/defines'
export default {
  mounted () {
    if (this.onOpen) {
      this.onOpen()
    }
  },
  data () {
    return {
      popupType: popupType
    }
  },
  computed: {
    ...mapState({
      title: state => state.popupData.title,
      contents: state => state.popupData.content,
      buttons: state => state.popupData.buttons,
      onOpen: state => state.popupData.onOpen,
      type: state => state.popupData.type,
      progressShow: state => state.progressShow,
      lang: state => state.lang,
      installStatus: state => state.installStatus
    }),
    ...mapGetters(['detailApplication'])
  }
}
</script>
 
<style lang="scss" scoped>
.show > .pop{
  display: block !important;
}
.loading > .pop{
  display: none !important;
}
.pop {
  display: none;
}
.pop-btnarea:before {
  top: 0px;
}
.pop-textarea {
  height: auto;
}
.rate .size {
  left: 0px
}
.rate .percentage {
  left: 520px
}
.sub-info {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  max-width: 450px;
}
.progress .detail-text {
  display: block;
}
</style>