<template>
  <div class="pop" :style="loadingStatus === 'NONE' ? '' : 'display: block;'">
		<div class="loader">
			<div class="spinner"></div>
			<p class="text">{{loadingContent}}</p>
		</div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {loadingStatus} from '../../js/defines'
export default {
  computed: {
    ...mapState({
      loading: state => state.loading,
      loadingStatus: state => state.loadingStatus
    }),
    loadingContent () {
      if (this.loadingStatus === loadingStatus.LOADING) {
        return 'Loading...'
      } else if (this.loadingStatus === loadingStatus.INSTALLING) {
        return 'Installing...'
      } else if (this.loadingStatus === loadingStatus.DELETING) {
        return 'Deleting...'
      }
    }
  }
}
</script>
