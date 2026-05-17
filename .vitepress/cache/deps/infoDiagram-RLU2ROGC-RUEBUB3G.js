import {
  parse
} from "./chunk-KILNKT4N.js";
import "./chunk-OWPUYL2N.js";
import "./chunk-7ACUBXSW.js";
import "./chunk-VJLDEHFW.js";
import "./chunk-6VE3SO7E.js";
import "./chunk-ZC5L4UHN.js";
import "./chunk-IU5PMGP4.js";
import "./chunk-HUGTHZF3.js";
import "./chunk-GRTGIKZM.js";
import {
  package_default
} from "./chunk-VFHZICDI.js";
import {
  selectSvgElement
} from "./chunk-XEE33GGQ.js";
import "./chunk-3KOL2IQZ.js";
import "./chunk-NBWFZMTS.js";
import {
  __name,
  configureSvgSize,
  log
} from "./chunk-FT5GUYLF.js";
import "./chunk-ST3SR5TB.js";
import "./chunk-BX4S5LCH.js";
import "./chunk-FDBJFBLO.js";

// node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-RLU2ROGC.mjs
var parser = {
  parse: __name(async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }, "parse")
};
var DEFAULT_INFO_DB = {
  version: package_default.version + (true ? "" : "-tiny")
};
var getVersion = __name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};
var draw = __name((text, id, version) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
}, "draw");
var renderer = { draw };
var diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
//# sourceMappingURL=infoDiagram-RLU2ROGC-RUEBUB3G.js.map
