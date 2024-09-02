import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        {
          "@/apis": [["default", "$api"]],
          "@/stores": [["default", "$store"]],
          "@/hooks/notify": [["default", "$notify"]],
          "@/hooks/message": [["default", "$message"]],
          "@/hooks/message-box": [["default", "$messageBox"]],
        },
      ],
      resolvers: [ArcoResolver()],
      dts: fileURLToPath(
        new URL("./src/types/auto-imports.d.ts", import.meta.url),
      ),
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: "readonly",
      },
    }),
    Components({
      dirs: ["src/components"],
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
      dts: fileURLToPath(
        new URL("./src/types/components.d.ts", import.meta.url),
      ),
    }),
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
