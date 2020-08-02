const fs = require("fs");
const globby = require("globby");
const chalk = require("chalk");
const sleep = (timeout) =>
  new Promise((res) => setTimeout(() => res(), timeout || 1));
let pkgs = [];
let pkg;

const pkg_base = require("../package.json");

sleep().then(async () => {
  pkgs = await globby("./packages/*/package.json");
  for (let pkg_file of pkgs) {
    console.log(chalk.red(`... ${pkg_file}`));
    pkg = require(`.${pkg_file}`);
    for (let [dep_base, version_base] of Object.entries(
      pkg_base.devDependencies
    )) {
      if (pkg.dependencies) {
        for (let [dep, version] of Object.entries(pkg.dependencies)) {
          if (dep === dep_base) {
            if (version !== version_base) {
              console.log(
                chalk.green(
                  `\treplacing dependencies.${dep} from ${version} to ${version_base}`
                )
              );
              pkg.dependencies[dep] = version_base;
            } else {
              console.log(
                `\tfound ${dep}, versions ${version_base} and ${version}`
              );
            }
          }
        }
      }
      for (let [dep, version] of Object.entries(pkg.devDependencies)) {
        if (dep === dep_base) {
          if (version !== version_base) {
            console.log(
              chalk.green(
                `\treplacing devDependencies.${dep} from ${version} to ${version_base}`
              )
            );
            pkg.devDependencies[dep] = version_base;
          } else {
            console.log(
              `\tfound ${dep}, versions ${version_base} and ${version}`
            );
          }
        }
      }
    }
    fs.writeFileSync(`${pkg_file}`, JSON.stringify(pkg, "", 2));
  }
});
