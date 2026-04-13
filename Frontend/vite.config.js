import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Đây mới là tên đúng của plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Cách này giúp fix lỗi "global is not defined" của SockJS
    global: "window",
  },
})
