const fs = require("fs-extra");
const chalk = require("chalk");
const paths = require("../config/paths");

function getFileMapping(SUFFIX_REGEX) {
  return {
    [`login-view${SUFFIX_REGEX}`]: "Login",
    [`home-view${SUFFIX_REGEX}`]: "Home",
    [`registration-view${SUFFIX_REGEX}`]: "Registration",
    [`processed-jobs-view${SUFFIX_REGEX}`]: "Processed Jobs",
    [`public-jd${SUFFIX_REGEX}`]: "Public Jd",
    [`InstaApply-view${SUFFIX_REGEX}`]: "Insta Apply",
    [`InstaCvUpload-view${SUFFIX_REGEX}`]: "Insta CV Upload",
    [`InstaApplyUpdate-view${SUFFIX_REGEX}`]: "Insta Update Apply",
    [`jobs-view${SUFFIX_REGEX}`]: "Jobs View",
    [`DetailedJd-view${SUFFIX_REGEX}`]: "Detailed Jd View",
    [`profile-view${SUFFIX_REGEX}`]: "Profile View",
    [`quick-apply-jd-view${SUFFIX_REGEX}`]: "Quick Apply JD",
    [`temp-profile-view${SUFFIX_REGEX}`]: "Quick Apply Profile View",
    [`quick-apply-profile-edit-view${SUFFIX_REGEX}`]: "Quick Apply Profile Edit View",
    [`collection-view${SUFFIX_REGEX}`]: "Collection View",
    [`practice${SUFFIX_REGEX}`]: "Practice View",
    [`unsubscribe-view${SUFFIX_REGEX}`]: "Unsubscribe View"
  };
}

function createBundleManifest(directoryPath, manifestFilePath, fileMapping) {
  console.log(
    chalk.magenta(
      "============================================================"
    )
  );
  try {
    if (fs.existsSync(directoryPath)) {
      const files = fs.readdirSync(directoryPath);

      const filesRegex = Object.keys(fileMapping);

      const bundleManifest = {};

      filesRegex.forEach(filePathRegx => {
        const regEx = new RegExp(filePathRegx);
        (files || []).find(fileName => {
          if (regEx.test(fileName)) {
            console.log(chalk.bold.yellow(`Writing ${fileName} to file.`));
            bundleManifest[fileMapping[filePathRegx]] = fileName;
            return true;
          }
          return false;
        });
      });

      if (bundleManifest && Object.keys(bundleManifest).length > 0) {
        fs.writeFileSync(manifestFilePath, JSON.stringify(bundleManifest));
      }

      console.log(chalk.bold.green(`Successfully created ${manifestFilePath}`));
    } else {
      console.log(
        chalk.bold.red(
          `Failed to create ${manifestFilePath} as ${directoryPath} doest not exists`
        )
      );
    }
  } catch (e) {
    console.log(chalk.bold.red(`Failed to create  ${manifestFilePath}`));
    console.log(e);
    process.exit(1);
  }

  console.log(
    chalk.magenta(
      "============================================================"
    )
  );
}

function createJSManifest() {
  const directoryPath = `${paths.appBuild}/static/js`;
  const bundleManifestFilePath = `${paths.appBuild}/js-chunk.manifest.json`;
  const SUFFIX_REGEX = "\\.\\w+\\.chunk\\.js$";
  const FILE_MAPPING = getFileMapping(SUFFIX_REGEX);

  createBundleManifest(directoryPath, bundleManifestFilePath, FILE_MAPPING);
}

function createCSSManifest() {
  const directoryPath = `${paths.appBuild}/static/css`;
  const bundleManifestFilePath = `${paths.appBuild}/css-chunk.manifest.json`;
  const SUFFIX_REGEX = "\\.\\w+\\.chunk\\.css$";
  const FILE_MAPPING = getFileMapping(SUFFIX_REGEX);

  createBundleManifest(directoryPath, bundleManifestFilePath, FILE_MAPPING);
}

module.exports = function() {
  createJSManifest();
  createCSSManifest();
};
