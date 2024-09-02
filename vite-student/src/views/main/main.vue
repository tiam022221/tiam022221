<template>
  <button @click="sendApi">点我发生请求</button>
  <!-- <router-view /> -->
</template>

<script setup lang="ts">
const sendApi = async () => {
  const response = await $api.getCart({
    accountingId: "1",
  });
  switch (response.__error) {
    case undefined:
      $message.success("请求成功");
  }
};
</script>
<style lang="scss" scoped></style>
