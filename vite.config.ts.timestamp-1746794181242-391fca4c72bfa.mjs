// vite.config.ts
import { defineConfig } from "file:///C:/Users/Lucas%20Vitorino/PluralMed/Tecnologia%20e%20Inova%C3%A7%C3%A3o%20-%20BI%20-%20Documentos/BI/SOFTWARES%20AI/compra-certa-flow/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Lucas%20Vitorino/PluralMed/Tecnologia%20e%20Inova%C3%A7%C3%A3o%20-%20BI%20-%20Documentos/BI/SOFTWARES%20AI/compra-certa-flow/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/Lucas%20Vitorino/PluralMed/Tecnologia%20e%20Inova%C3%A7%C3%A3o%20-%20BI%20-%20Documentos/BI/SOFTWARES%20AI/compra-certa-flow/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Lucas Vitorino\\PluralMed\\Tecnologia e Inova\xE7\xE3o - BI - Documentos\\BI\\SOFTWARES AI\\compra-certa-flow";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdWNhcyBWaXRvcmlub1xcXFxQbHVyYWxNZWRcXFxcVGVjbm9sb2dpYSBlIElub3ZhXHUwMEU3XHUwMEUzbyAtIEJJIC0gRG9jdW1lbnRvc1xcXFxCSVxcXFxTT0ZUV0FSRVMgQUlcXFxcY29tcHJhLWNlcnRhLWZsb3dcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEx1Y2FzIFZpdG9yaW5vXFxcXFBsdXJhbE1lZFxcXFxUZWNub2xvZ2lhIGUgSW5vdmFcdTAwRTdcdTAwRTNvIC0gQkkgLSBEb2N1bWVudG9zXFxcXEJJXFxcXFNPRlRXQVJFUyBBSVxcXFxjb21wcmEtY2VydGEtZmxvd1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTHVjYXMlMjBWaXRvcmluby9QbHVyYWxNZWQvVGVjbm9sb2dpYSUyMGUlMjBJbm92YSVDMyVBNyVDMyVBM28lMjAtJTIwQkklMjAtJTIwRG9jdW1lbnRvcy9CSS9TT0ZUV0FSRVMlMjBBSS9jb21wcmEtY2VydGEtZmxvdy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiZcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNmhCLFNBQVMsb0JBQW9CO0FBQzFqQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQ1QsZ0JBQWdCO0FBQUEsRUFDbEIsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
