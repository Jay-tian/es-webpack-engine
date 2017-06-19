import path from 'path';

import { searchEntries, searchDirs, fsExistsSync, isArray } from '../utils';
import options  from './options';

// 存放源文件路径
const pluginAssetsDirs = [];
const themeAssetsDirs = [];
const bundleAssetsDirs = [];

// 设置别名
const configAlias = {
  libs: `${options.globalDir}/libs`,
  common: `${options.globalDir}/common`,
  app: `${options.globalDir}/app`,
};

/*
  * 输出格式
  * let pluginEntry = {
  *   'crmplugin': {
  *     'crmplugin/js/main': '/plugins/CrmPlugin/Resources/static-src/js/main.js',
  *     'crmplugin/js/default/index': '/plugins/CrmPlugin/Resources/static-src/js/default/index.js',
  *     ...
  *   },
  *   'viplugin': {
  *     'viplugin/js/main': '/plugins/VipPlugin/Resources/static-src/main.js',
  *     'viplugin/js/default/index': '/plugins/VipPlugin/Resources/static-src/js/default/index.js',
  *     ...
  *   },
  * };
*/
let pluginEntry = {};
let pluginSrcEntry = {};
if (options.isOpenPluginModule) {

  let pluginsName = [];

  if(options.openPluginsModule.length) {
    pluginsName = options.openPluginsModule;

  } else {
    pluginsName = searchDirs(options.pluginsDir, 'Resources/static-src');
  }

  pluginsName.forEach((plugin) => {
    const pluginDir = `${options.rootDir}/${plugin}/Resources/static-src`;
    const pluginName = plugin.split(path.sep).pop().toLowerCase();

    pluginEntry[pluginName] = {};

    Object.assign(
      pluginEntry[pluginName],
      searchEntries({
        fileName: options.extryCssName,
        entryPath: `${pluginDir}/less`,
        fileNamePrefix: `${pluginName}/css/`,
        fileType: 'less',
      }),
      searchEntries({
        fileName: options.entryMainName,
        entryPath: `${pluginDir}/js`,
        fileNamePrefix: `${pluginName}/js/`,
      }),
      searchEntries({
        fileName: options.entryFileName,
        entryPath: `${pluginDir}/js`,
        fileNamePrefix: `${pluginName}/js/`,
        isFuzzy: true,
      })
    );

    configAlias[pluginName] = pluginDir;
    pluginSrcEntry[pluginName] = pluginDir;
    pluginAssetsDirs.push(pluginDir);
  });
}


/*
  * 输出格式
  * let bundleEntry = {
  *   'custom': {
  *     'custom/js/main': '/src/Custom/Resources/static-src/js/main.js',
  *     'custom/js/default/index': '/src/Custom/Resources/static-src/js/default/index.js',
  *     ...
  *   },
  *   'appbundle': {
  *     'appbundle/js/main': '/src/AppBundle/Resources/static-src/main.js',
  *     'appbundle/js/default/index': '/src/AppBundle/Resources/static-src/js/default/index.js',
  *     ...
  *   },
  * };
*/
let bundleEntry = {};
let bundleSrcEntry = {};
if (options.isOpenBundleModule) {

  let bundlesName = [];
  
  if(options.openBundlesModule.length) {
    bundlesName = options.openBundlesModule;

  } else {
    bundlesName = searchDirs(options.bundlesDir, 'Resources/static-src');
  }

  bundlesName.forEach((bundle) => {
    const bundleDir = `${options.rootDir}/${bundle}/Resources/static-src`;
    const bundleName = bundle.split(path.sep).pop().toLowerCase();

    bundleEntry[bundleName] = {};

    Object.assign(
      bundleEntry[bundleName],
      searchEntries({
        fileName: options.extryCssName,
        entryPath: `${bundleDir}/less`,
        fileNamePrefix: `${bundleName}/css/`,
        fileType: 'less',
      }),
      searchEntries({
        fileName: options.entryMainName,
        entryPath: `${bundleDir}/js`,
        fileNamePrefix: `${bundleName}/js/`,
      }),
      searchEntries({
        fileName: options.entryFileName,
        entryPath: `${bundleDir}/js`,
        fileNamePrefix: `${bundleName}/js/`,
        isFuzzy: true,
      })
    );

    configAlias[bundleName] = bundleDir;
    bundleSrcEntry[bundleName] = bundleDir;
    bundleAssetsDirs.push(bundleDir);
  });
}

/*
  * 输出格式
  * let themeEntry = {
  *   'defaulttheme': {
  *     'defaulttheme/js/default/index': '/web/themes/default/static-src/js/default/index.js',
  *     ...
  *   },
  *   'defaultbtheme': {
  *     'defaultbtheme/js/default/index': '/web/themes/default-b/static-src/js/default/index.js',
  *     ...
  *   },
  * };
*/

let themeEntry = {};
let themeSrcEntry = {};
if(options.isOpenThemeModule) {
  let themesName = [];

  if(options.openThemesModule.length) {
    themesName = options.openThemesModule;
  } else {
    themesName = searchDirs(options.themesDir, 'static-src');
  }

  themesName.forEach((theme) => {
    const themeDir = `${options.webDir}/${theme}/static-src`;
    const themeName = theme.split(path.sep).pop().replace('-','').toLowerCase() + 'theme';

    themeEntry[themeName] = {};

    Object.assign(
      themeEntry[themeName],
      searchEntries({
        fileName: options.extryCssName,
        entryPath: `${themeDir}/less`,
        fileNamePrefix: `${themeName}/css/`,
        fileType: 'less',
      }),
      searchEntries({
        fileName: options.entryMainName,
        entryPath: `${themeDir}/js`,
        fileNamePrefix: `${themeName}/js/`,
      }),
      searchEntries({
        fileName: options.entryFileName,
        entryPath: `${themeDir}/js`,
        fileNamePrefix: `${themeName}/js/`,
        isFuzzy: true,
      })
    );

    configAlias[themeName] = themeDir;
    themeSrcEntry[themeName] = themeDir;
    themeAssetsDirs.push(themeDir);

  })
}

let libEntry = {};
if (options.isOpenLibModule) {
  for (let key in options.libs) {
    libEntry[`libs/${key}`] = [];
    
    options.libs[key].forEach((le) => {
      libEntry[`libs/${key}`].push(le);
    });
  }
}

let appEntry = {};
if (options.isOpenAppModule) {
  const appDir = `${options.globalDir}/app`;
  appEntry['app'] = {};

  Object.assign(
    appEntry['app'],
    searchEntries({
      fileName: options.extryCssName,
      entryPath: `${appDir}/less`,
      fileNamePrefix: `app/css/`,
      fileType: 'less',
    }),
    searchEntries({
      fileName: options.entryMainName,
      entryPath: `${appDir}/js`,
      fileNamePrefix: `app/js/`,
    }),
    searchEntries({
      fileName: options.entryFileName,
      entryPath: `${appDir}/js`,
      fileNamePrefix: `app/js/`,
      isFuzzy: true,
    })
  );
}

let onlyCopys = [];
if (options.onlyCopys && options.onlyCopys.length) {
  let copyitem = {};
  options.onlyCopys.forEach((item) => {
    copyitem = {
      from : `${options.nodeModulesDir}/${item.name}`,
      to: `libs/${item.name}`,
      ignore: item.ignore,
      copyUnmodified: true,
      force: true
    }
    onlyCopys.push(copyitem);
  })
}

export {
  pluginEntry,
  bundleEntry,
  libEntry,
  appEntry,
  pluginSrcEntry,
  bundleSrcEntry,
  themeEntry,
  themeSrcEntry,

  onlyCopys,

  configAlias,

  bundleAssetsDirs,
  themeAssetsDirs,
  pluginAssetsDirs
}
