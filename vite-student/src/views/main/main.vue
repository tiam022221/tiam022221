<template>
  <button @click="sendApi">点我发生请求</button>
  <!-- <router-view /> -->
  <div class="h-full p-[100px]">
    <w-button>我是按钮</w-button>
  </div>
</template>

<script setup lang="ts">
const sendApi = async () => {
  const response = await $api.getCart({});
  switch (response.__error) {
    case undefined:
      $message.success("请求成功");
  }
};
</script>
<style lang="scss" scoped></style>
