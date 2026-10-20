import { bdTokens } from "../mockups/tailwind.tokens";

export default {
  content: ["./src/**/*.{ts,tsx}", "../mockups/src/**/*.{ts,tsx}"],
  theme: { extend: { ...bdTokens } },
  plugins: [],
};
