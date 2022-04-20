import fs from "fs";
import path from "path";
import jsdom from "jsdom";
const JSDOM = new jsdom.JSDOM();

const LAYERS_PATH = "./layers/";
const IMAGES_PATH = "./images/";
const METADATA_PATH = "./metadata/";

const LAYER_NAMES = ["skin_color", "face", "props"];

interface Attribute {
  trait_type: string;
  display_type?: string;
  value: string | number;
}

interface MetaData {
  title: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<Attribute>;
}

const TITLE = "Eggciting";
const NAME_PREFIX = "Eggciting #";
const DESCRIPTION =
  "Eggciting is a developing and growing collection of algorithmically generated cute eggs. " +
  "The 1st generation of egg will be created from 11 different traits including body colors, faces, props. " +
  "Each egg comes with ownership and commercial usage rights.";
const IMAGE_PREFIX = "https://ipfs.io/ipfs/CID_TO_BE_UPDATED_LATER/images/";

function main() {
  // get all layers' svg data
  let svg_layers = new Map<string, Map<string, string>>();
  for (const layer of LAYER_NAMES) {
    let layer_svgs = new Map();
    const curPath = path.join(LAYERS_PATH, layer);
    fs.readdirSync(curPath).forEach((fileName) => {
      const svgPath = path.join(curPath, fileName);
      console.log(`Reading ${svgPath}`);
      const data = fs.readFileSync(svgPath, "utf8");
      const fileNameShort = path.basename(fileName, path.extname(fileName));
      layer_svgs.set(fileNameShort, data);
      console.log(`Loaded ${fileNameShort} with ${data.length} chars`);
    });
    svg_layers.set(layer, layer_svgs);
  }

  // combine svg layers and generate meta data
  const skin_colols = svg_layers.get(LAYER_NAMES[0]);
  const faces = svg_layers.get(LAYER_NAMES[1]);
  const props = svg_layers.get(LAYER_NAMES[2]);
  if (!skin_colols || !faces || !props) {
    throw new Error("Failed to get layers data");
  }
  let idx = 1;
  for (const skin_kv of skin_colols.entries()) {
    for (const face_kv of faces.entries()) {
      for (const props_kv of props.entries()) {
        const skinName = toTitleCase(skin_kv[0].replace(/_/g, " "));
        const skinSvg = skin_kv[1];
        const skinAttribute: Attribute = {
          trait_type: "Skin Color",
          value: skinName,
        };
        const faceName = toTitleCase(face_kv[0].replace(/_/g, " "));
        const faceSvg = face_kv[1];
        const faceAttribute: Attribute = {
          trait_type: "Face",
          value: faceName,
        };
        const propsName = toTitleCase(props_kv[0].replace(/_/g, " "));
        const propsSvg = props_kv[1];
        const porpsAttribute: Attribute = {
          trait_type: "Props",
          value: propsName,
        };

        // generate metadata file
        let newMetaData: MetaData = {
          title: TITLE,
          name: NAME_PREFIX + idx.toString(),
          description: DESCRIPTION,
          image: IMAGE_PREFIX + `${idx}.svg`,
          attributes: [skinAttribute, faceAttribute, porpsAttribute],
        };
        const metaDataSavePath = path.join(METADATA_PATH, idx.toString());
        fs.writeFileSync(metaDataSavePath, JSON.stringify(newMetaData));
        console.log(`Save metadata: ${metaDataSavePath}`);
        // generate combined svg file
        const combinedSvg = addSVGs([skinSvg, faceSvg, propsSvg]);
        const svgSavePath = path.join(IMAGES_PATH, `${idx}.svg`);
        fs.writeFileSync(svgSavePath, combinedSvg.outerHTML);
        console.log(
          `Save Combined ${[
            skinName,
            faceName,
            propsName,
          ]} svg to ${svgSavePath}`
        );
        idx += 1;
      }
    }
  }
}

function toTitleCase(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
}

function cloneAttributes(target: Element, source: Element) {
  [...source.attributes].forEach((attr) => {
    target.setAttribute(attr.nodeName, attr.nodeValue || "");
  });
}

function addSVGs(inputStrings: string[]) {
  // takes a list of strings of SVGs to merge together into one large element
  let svgMain = JSDOM.window.document.createElement("svg");
  for (let stringI = 0; stringI < inputStrings.length; stringI++) {
    let domParser = new JSDOM.window.DOMParser();
    let svgDOM = domParser
      .parseFromString(inputStrings[stringI], "text/xml")
      .getElementsByTagName("svg")[0];
    if (stringI == 0) {
      cloneAttributes(svgMain, svgDOM);
    }
    while (svgDOM.childNodes.length > 0) {
      svgMain.appendChild(svgDOM.childNodes[0]);
    }
  }
  return svgMain;
}

main();
