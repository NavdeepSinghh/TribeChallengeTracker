/**
 * patch-native-plugins.js
 *
 * Runs after `cap sync` to inject custom in-app Swift plugins into
 * packageClassList so Capacitor's bridge can discover them via NSClassFromString.
 *
 * Background: Capacitor's autoRegisterPlugins reads packageClassList from
 * ios/App/App/capacitor.config.json and ignores registerPluginType() calls
 * when autoRegisterPlugins=true. This script ensures our custom plugins
 * survive every cap sync.
 */

const fs = require('fs');
const path = require('path');

const NATIVE_PLUGINS = ['GoogleSignInPlugin'];
const CONFIG_PATH = path.join(__dirname, '../ios/App/App/capacitor.config.json');

if (!fs.existsSync(CONFIG_PATH)) {
  console.log('patch-native-plugins: iOS config not found, skipping.');
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
config.packageClassList = config.packageClassList || [];

let changed = false;
for (const plugin of NATIVE_PLUGINS) {
  if (!config.packageClassList.includes(plugin)) {
    config.packageClassList.unshift(plugin);
    changed = true;
    console.log(`patch-native-plugins: added ${plugin} to packageClassList`);
  }
}

if (changed) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, '\t'));
  console.log('patch-native-plugins: capacitor.config.json updated.');
} else {
  console.log('patch-native-plugins: nothing to add.');
}
