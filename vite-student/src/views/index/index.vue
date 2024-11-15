<template>
  <div>我是index</div>
  <div class="text-center">
    <w-button type="text" status="success">暂停/播放{{ isOpen }}</w-button>
    <a-button type="text" @click="move">暂停/播放{{ index }}</a-button>
    <a-button type="text" @click="ff">防抖{{ index }}</a-button>
    <a-button type="text" @click="jj">节流{{ index }}</a-button>
    <a-button type="text">Default Button</a-button>
  </div>
</template>
<script setup lang="ts">
// console.log("script start");
// // setTimeout(() => {
// //   // 这是下一个宏任务，所以会先执行完这整一个宏任务后，再执行微任务队列，最后执行setTimeout
// //   console.log("setTimeout 内部函数");
// // }, 0);

// async function async1() {
//   console.log("async1 start, 还在同步任务中，直接执行"); // 直接执行，遇到await之前都是同步执行
//   await async2(); // 跳入async2函数
//   // await 之后的代码会作为Promise.then，被放入微任务队列
//   // ----- 第一个微任务

//   await async3(); // 跳入async3函数
//   // 再次加入到微任务中
//   // 原本执行完所有微任务就能执行下一个宏任务（setTimeout里的那个），但是微任务中也能插入微任务，变成了插队
//   // ----- 第三个微任务

//   console.log("async1 end, await 之后的代码");
// }
// async function async2() {
//   console.log("async2, 还在同步任务中，直接执行"); // 直接执行，没有await的async函数等同于同步函数
// }
// async function async3() {
//   console.log("async3, 进行微任务中");
// }
// async1(); // 执行异步函数

// new Promise((resolve) => {
//   // new Promise 回调函数是同步执行的
//   console.log("promise1, 还在同步任务中，直接执行"); // 直接执行
//   resolve(undefined);
// })
//   .then(
//     // ----- 第二个微任务
//     () => {
//       console.log("promise2, Promise then"); // then 会放入微任务队列
//     },
//   )
//   .finally(
//     // ----- 第四个微任务
//     () => {
//       console.log("promise3, Promise finally"); // finally 会等then执行完后，放入微任务队列，插队在下一个宏任务之前
//     },
//   );

// console.log("script end, 直接执行，这个同步任务执行完毕，开始检索微任务队列"); // 直接执行
const isOpen = ref(false);
const index = ref(10);
let interval;
const move = () => {
  if (index.value <= 0) index.value = 10;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    clearInterval(interval);
    interval = setInterval(() => {
      index.value--;
      if (index.value <= 0) {
        clearInterval(interval);
        isOpen.value = false;
      }
    }, 1000);
  } else {
    clearInterval(interval);
  }
};
let aa;
const ff = () => {
  index.value++;
  clearTimeout(aa);
  aa = setTimeout(() => {
    console.log(index.value);
  }, 1000);
};
let bb;
const jj = () => {
  if (bb) return;
  bb = setTimeout(() => {
    index.value++;
    bb = null;
  }, 1000);
};
console.log(111);
</script>
<style lang="scss" scoped></style>
