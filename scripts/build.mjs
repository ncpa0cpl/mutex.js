import { build } from "@ncpa0cpl/nodepack";
import path from "path";
import process from "process";

try {
  await build({
    target: "es2018",
    srcDir: path.resolve(process.cwd(), "src"),
    outDir: path.resolve(process.cwd(), "dist"),
    tsConfig: path.resolve(process.cwd(), "tsconfig.build.json"),
    formats: ["cjs", "esm", "legacy"],
    declarations: true,
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
