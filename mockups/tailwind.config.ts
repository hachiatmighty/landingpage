import type { Config } from "tailwindcss";
import { bdTokens } from "./tailwind.tokens";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: bdTokens },
} satisfies Config;
