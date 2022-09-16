<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
  <h2 class="left-align">Agora Voice Web SDK Quickstart</h2>
  <div class="row">
    <div>
      <button type="button" id="join">JOIN</button>
      <button type="button" id="leave">LEAVE</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  }
}
</script>
