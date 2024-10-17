<template>
  <!-- <button @click="sendApi">点我发生请求</button> -->
  <router-view></router-view>
</template>

<script setup lang="ts">
const sendApi = async () => {
  const response = await $api.getCart({});
  switch (response.__error) {
    case undefined:
      $message.success("请求成功");
  }
};
const router = useRouter();
const toIndex = () => {
  router.push({
    name: "index-page",
  });
};
const toUser = () => {
  router.push({
    name: "user-page",
  });
};
</script>
<style lang="scss" scoped></style>
