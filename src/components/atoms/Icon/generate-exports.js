/* eslint-env node */
const path = require("path");
const fs = require("fs");

const glob = require("glob");
const changeCase = require("change-case");

const generate = (dirname, output, suffix = "Icon") => {
  //console.log(glob.sync("**/*.svg", { cwd: dirname }).length);
  const icons = glob
    .sync("**/*.svg", { cwd: dirname })
    // TODO: add deduplication instead
    .filter(filename => !/apple-mask-icon\.svg$/.test(filename))
    .map(filename => ({
      //importPath: path.join(dirname, filename),
      importPath: "./" + dirname + "/" + filename,
      // eslint-disable-next-line no-magic-numbers
      name: path.basename(filename).slice(0, -4)
      // name: changeCase.camelCase(
      //   path.basename(filename).slice(0, -4),
      //   null,
      //   true
      // )
    }));

  let source = "";

  // Suppress the max-len check when it's known to fail
  if (dirname === "iconsList") {
    source += "/* eslint-disable max-len */\n";
  }

  source +=
    "/* This is a generated file. If you want to change it, edit generate-exports instead. */\n\n";
  icons.forEach(({ importPath, name }) => {
    source += `import ${name} from '${importPath}';\n`;
  });
  source += "\nimport {iconHOC} from './icon';\n\n";
  icons.forEach(({ name }) => {
    // const displayName = changeCase.pascalCase(name) + suffix;
    const displayName = name + suffix;
    source += `export const ${displayName} = iconHOC(${name}.toString(), '${displayName}');\n`;
  });

  fs.writeFileSync(path.resolve(__dirname, output), source);
};

generate("iconsList", "icons.js");
