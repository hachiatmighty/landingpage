import path from "path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";

Config.setEntryPoint("src/index.ts");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Share the mockup screens and member portraits instead of copying them.
Config.setPublicDir("../mockups/public");
// ../mockups has no node_modules of its own, so let its imports (react, …) resolve from here.
Config.overrideWebpackConfig((config) => {
  const withTailwind = enableTailwind(config);
  return {
    ...withTailwind,
    resolve: {
      ...withTailwind.resolve,
      modules: [path.join(__dirname, "node_modules"), "node_modules"],
    },
  };
});
