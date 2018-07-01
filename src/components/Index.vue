<template>
  <div class="wrapper">

    <header class="header"></header>

    <main class="main">
      <div class="container">
        {{ msg }}
      </div>
    </main>

    <div is='IndexFooter'></div>

  </div>
</template>

<script>
// import { mapState, mapGetters, mapMutations } from 'vuex';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import IndexFooter from './IndexFooter';

export default {
  name: 'Index',
  components: {
    FontAwesomeIcon,
    IndexFooter
  },
  data() {
    return {
      msg: 'Index'
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lagn="scss">
</style>
