<template>
  <img alt="Vue logo" src="./assets/logo.png"/>
  <HelloWorld msg="Hello Vue 3.0 + Vite"/>
  <MinUpload/>
</template>

<!--<script lang="ts" setup>-->
<!--import HelloWorld from './components/HelloWorld.vue'-->
<!--</script>-->

<script>
import HelloWorld from "./components/HelloWorld.vue";
import MinUpload from "./components/MinUpload.vue";

export default {
  name: 'App',
  components: {
    HelloWorld,
    MinUpload
  }
}
</script>
