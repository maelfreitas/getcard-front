<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  setup(){
    const route = useRoute();

    const pagesWithoutHeader = ["/login", "/register"];

    const showHeader = computed(() => !pagesWithoutHeader.includes(route.path));

    return { showHeader };
  },
};
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  background-color: #14181C;
  min-height: 100vh;
  color: #d6d5d5;
  display: flex;
  flex-direction: column;
}

router-view {
  flex: 1;
  width: 100%;
}


</style>