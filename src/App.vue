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
#app{
  background-color: #14181C;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  color: #d6d5d5;

}
router-view {
  flex: 1; /* Deixa o conteúdo ocupar o espaço restante */
}

</style>