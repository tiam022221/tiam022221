<template>
  <button
    class="w-btn"
    :class="`w-btn-${type}-${status}`"
    @mouseup="mouseup"
    @mousedown="mousedown"
  >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
import "./btn-init.scss";
const props = withDefaults(
  defineProps<{
    type?: "text" | "dashed" | "outline" | "primary" | "secondary";
    status?: "normal" | "success" | "warning" | "danger";
  }>(),
  {
    type: "secondary",
    status: "normal",
  },
);
const type = toRef(props, "type");
const status = toRef(props, "status");
const emits = defineEmits<{
  click: [];
}>();
const mousedown = () => {
  console.log("鼠标按下");
};
const mouseup = () => {
  console.log("鼠标弹起");
  emits("click");
};
</script>
<style lang="scss" scoped></style>
