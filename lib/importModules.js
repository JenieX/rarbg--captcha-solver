const fs = require('fs');
const path = require('path');

const regex = {
  // import: /^import(?: \w+ from)? '([^']+\.js)';/gm,
  import: /^import(?: [{ ,\w\n/\-}]+ from)? '([^']+\.js)';/gm,
  include: /include: ([^'\n]+)/g,
};

function importModules(
  moduleContent,
  currentModulePath,
  file,
  loadedModules = []
) {
  // console.log(loadedModules);
  // console.log(currentModulePath);
  return moduleContent.replace(regex.import, (match, relativeModulePath) => {
    const modulePath = path.resolve(
      path.dirname(currentModulePath),
      relativeModulePath
    );
    if (loadedModules.includes(modulePath)) {
      console.warn(`Already imported ${modulePath}`);
      return '';
    }

    loadedModules.push(modulePath);
    // console.info(modulePath);
    const chunk = fs.readFileSync(modulePath, 'utf8');
    if (regex.import.test(chunk)) {
      return importModules(chunk, modulePath, null, loadedModules);
    }
    return chunk;
  });
}

exports.importModules = importModules;
