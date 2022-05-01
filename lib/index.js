"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const vite_1 = require("vite");
module.exports = function svgrPlugin({ svgrOptions, esbuildOptions, } = {}) {
    return {
        name: 'vite:svgr',
        async transform(code, id) {
            var _a, _b;
            if (id.endsWith('.svg')) {
                const { transform: convert } = await Promise.resolve().then(() => __importStar(require('@svgr/core')));
                const svgCode = await fs_1.default.promises.readFile(id, 'utf8');
                const componentCode = await convert(svgCode, Object.assign(Object.assign({}, svgrOptions), { plugins: [...((_a = svgrOptions === null || svgrOptions === void 0 ? void 0 : svgrOptions.plugins) !== null && _a !== void 0 ? _a : []), '@svgr/plugin-svgo', '@svgr/plugin-jsx'], svgoConfig: Object.assign(Object.assign({}, ((_b = svgrOptions === null || svgrOptions === void 0 ? void 0 : svgrOptions.svgoConfig) !== null && _b !== void 0 ? _b : {})), { plugins: [
                            {
                                name: 'preset-default',
                                params: {
                                    overrides: {
                                        inlineStyles: {
                                            onlyMatchedOnce: false
                                        }
                                    }
                                }
                            },
                            'removeStyleElement'
                        ] }) }), {
                    componentName: 'ReactComponent',
                    filePath: id
                }).then((res) => {
                    return res.replace('export default ReactComponent', `export { ReactComponent }`);
                });
                const res = await (0, vite_1.transformWithEsbuild)(componentCode + '\n' + code, id, Object.assign({ loader: 'jsx' }, esbuildOptions));
                return {
                    code: res.code,
                    map: null
                };
            }
        },
    };
};
