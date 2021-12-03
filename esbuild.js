
const esbuild = require("esbuild");

esbuild
    .build({
        entryPoints: ["src/index.ts"],
        outdir: "dist",
        bundle: true,
        sourcemap: false,
        minify: true,
        splitting: false,
        format: "cjs",
        target: ["es6"]
    })
    .catch(() => process.exit(1));