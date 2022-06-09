import commonPlugins from "./rollup.plugins.js";
import {terser} from "rollup-plugin-terser";

export default {
	input: "src/script.js",
	output: {
		file: "dist/App.js",
		format: "esm"
	},
	plugins: [
		...commonPlugins,
		terser()
	]
};