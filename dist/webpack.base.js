'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _path=require('path');var _path2=_interopRequireDefault(_path);var _webpack=require('webpack');var _webpack2=_interopRequireDefault(_webpack);var _happypack=require('happypack');var _happypack2=_interopRequireDefault(_happypack);var _webpackMerge=require('webpack-merge');var _webpackMerge2=_interopRequireDefault(_webpackMerge);var _esExtractTextWebpackPlugin=require('es-extract-text-webpack-plugin');var _esExtractTextWebpackPlugin2=_interopRequireDefault(_esExtractTextWebpackPlugin);var _chunkManifestWebpackPlugin=require('chunk-manifest-webpack-plugin');var _chunkManifestWebpackPlugin2=_interopRequireDefault(_chunkManifestWebpackPlugin);var _optimizeModuleidAndChunkidPlugin=require('optimize-moduleid-and-chunkid-plugin');var _optimizeModuleidAndChunkidPlugin2=_interopRequireDefault(_optimizeModuleidAndChunkidPlugin);var _copyWebpackPlugin=require('copy-webpack-plugin');var _copyWebpackPlugin2=_interopRequireDefault(_copyWebpackPlugin);var _es3ifyWebpackPlugin=require('es3ify-webpack-plugin');var _es3ifyWebpackPlugin2=_interopRequireDefault(_es3ifyWebpackPlugin);var _webpackBundleAnalyzer=require('webpack-bundle-analyzer');var _friendlyErrorsWebpackPlugin=require('friendly-errors-webpack-plugin');var _friendlyErrorsWebpackPlugin2=_interopRequireDefault(_friendlyErrorsWebpackPlugin);var _watchIgnoreWebpackPlugin=require('watch-ignore-webpack-plugin');var _watchIgnoreWebpackPlugin2=_interopRequireDefault(_watchIgnoreWebpackPlugin);var _options=require('./config/options');var _options2=_interopRequireDefault(_options);var _entry=require('./config/entry');var entry=_interopRequireWildcard(_entry);var _loader=require('./config/loader');var loaders=_interopRequireWildcard(_loader);var _uglify=require('./config/uglify');var _uglify2=_interopRequireDefault(_uglify);var _utils=require('./utils');function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// 基础配置
var config={output:Object.assign(_options2.default.output,{filename:'[name].js'}),externals:_options2.default.externals,resolve:{alias:entry.configAlias,extensions:['','.js','.jsx']},module:{noParse:[],loaders:[loaders.jsLoader('babelJs',[_options2.default.nodeModulesDir]),loaders.cssLoader(),loaders.lessLoader(),loaders.jsonLoader(),loaders.importsLoader(_options2.default.noParseDeps)]},plugins:[new _happypack2.default({id:'babelJs',threadPool:_happypack2.default.ThreadPool({size:6}),verbose:false,loaders:['babel-loader'],tempDir:_options2.default.happypackTempDir}),new _esExtractTextWebpackPlugin2.default('[name].css',{allChunks:true}),new _es3ifyWebpackPlugin2.default(),new _webpack2.default.ProvidePlugin(_options2.default.global),new _webpack2.default.optimize.AggressiveMergingPlugin(),new _webpack2.default.DefinePlugin({__DEBUG__:_options2.default.__DEBUG__,__DEV__:_options2.default.__DEV__}),new _optimizeModuleidAndChunkidPlugin2.default(),new _webpack2.default.optimize.OccurrenceOrderPlugin(),new _watchIgnoreWebpackPlugin2.default(_options2.default.ignoredDirs)]};_options2.default.noParseDeps.forEach(function(dep){var depPath=_path2.default.resolve(_options2.default.nodeModulesDir,dep);config.resolve.alias[dep.split(_path2.default.sep)[0].replace('.','-')]=depPath;config.module.noParse.push(depPath);});if(_options2.default.__DEV__){config.plugins.push(new _friendlyErrorsWebpackPlugin2.default());}if(!_options2.default.__DEV__&&!_options2.default.__DEBUG__){config.plugins.push(new _webpack2.default.optimize.UglifyJsPlugin(_uglify2.default));}else{config.devtool=_options2.default.__DEVTOOL__;}var minChunks=function minChunks(module,count){// let pattern = new RegExp(options.regExp);
// return module.resource && !pattern.test(module.resource) && count >= options.minChunks;
return count>=_options2.default.minChunks;};// lib 配置
var libConfigs=[];if(_options2.default.isBuildAllModule){var libEntry=(0,_utils.filterObject)(entry.libEntry,_options2.default.vendorName);var vendorEntry=libEntry.filterObj;var newLibEntry=libEntry.newObj;var vendorConfig={};var newConfig={};var _module={loaders:[loaders.imageLoader('libs',_options2.default.imgName,_options2.default.imglimit),loaders.fontLoader('libs',_options2.default.fontName,_options2.default.fontlimit),loaders.mediaLoader('libs',_options2.default.mediaName)]};vendorConfig=(0,_webpackMerge2.default)(config,{name:'vendor',entry:vendorEntry,module:_module,plugins:[]});vendorConfig.externals={};if(_options2.default.__OPTIMIZE__){vendorConfig.plugins.push(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:3997}));};libConfigs.push(vendorConfig);newConfig=(0,_webpackMerge2.default)(config,{name:'libs',entry:newLibEntry,module:_module,plugins:[new _copyWebpackPlugin2.default(entry.onlyCopys)]});if(_options2.default.__OPTIMIZE__){newConfig.plugins.push(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:3998}));};libConfigs.push(newConfig);}// app 配置
var appConfig={};if(_options2.default.isBuildAllModule){appConfig=(0,_webpackMerge2.default)(config,{name:'app',entry:entry.appEntry['app'],module:{loaders:[loaders.imageLoader('app',_options2.default.imgName,_options2.default.imglimit),loaders.fontLoader('app',_options2.default.fontName,_options2.default.imglimit),loaders.mediaLoader('app',_options2.default.mediaName)]},plugins:[new _webpack2.default.optimize.CommonsChunkPlugin({name:'app',filename:'app/js/'+_options2.default.commonsChunkFileName+'.js',chunks:Object.keys(entry.appEntry['app']),minChunks:minChunks}),new _chunkManifestWebpackPlugin2.default({filename:'app/chunk-manifest.json',manifestVariable:"webpackManifest"})]});if(_options2.default.__OPTIMIZE__){appConfig.plugins.push(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:3999}));};if((0,_utils.fsExistsSync)(_options2.default.globalDir+'/app/'+_options2.default.copyName)){appConfig.plugins.push(new _copyWebpackPlugin2.default([{from:_options2.default.globalDir+'/app/'+_options2.default.copyName,to:'app/'+_options2.default.copyName,toType:'dir'}]));}}// 通用配置 - 包括插件、bundle、主题
var commonConfigs=[];if(_options2.default.isBuildAllModule||_options2.default.buildModule.length){var commonEntry=entry.commonEntry;var commonEntryKeys=Object.keys(commonEntry);var index=0;commonEntryKeys.forEach(function(key){var commonConfig={};if((0,_utils.isEmptyObject)(commonEntry[key])){return;};commonConfig=(0,_webpackMerge2.default)(config,{name:''+key,entry:commonEntry[key],module:{loaders:[loaders.imageLoader(key,_options2.default.imgName,_options2.default.imglimit),loaders.fontLoader(key,_options2.default.fontName,_options2.default.fontlimit),loaders.mediaLoader(key,_options2.default.mediaName)]},plugins:[new _chunkManifestWebpackPlugin2.default({filename:key+'/chunk-manifest.json',manifestVariable:"webpackManifest"})]});var commonSrcEntry=entry.commonSrcEntry;if((0,_utils.fsExistsSync)(commonSrcEntry[key]+'/'+_options2.default.copyName)){commonConfig.plugins.push(new _copyWebpackPlugin2.default([{from:commonSrcEntry[key]+'/'+_options2.default.copyName,to:key+'/'+_options2.default.copyName,toType:'dir'}]));}if((0,_utils.fsExistsSync)(commonSrcEntry[key]+'/'+_options2.default.isNeedCommonChunk)){commonConfig.plugins.push(new _webpack2.default.optimize.CommonsChunkPlugin({name:key,filename:key+'/js/'+_options2.default.commonsChunkFileName+'.js',chunks:Object.keys(commonEntry[key]),minChunks:minChunks}));}if(_options2.default.__OPTIMIZE__){commonConfig.plugins.push(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({analyzerPort:'400'+index}));};commonConfigs.push(commonConfig);index++;});}// 总配置
var configs=[];[libConfigs,appConfig,commonConfigs].forEach(function(item){if(item.constructor===Object&&!(0,_utils.isEmptyObject)(item)){configs.push(item);}else if(item.constructor===Array&&item.length){configs=configs.concat(item);}});exports.default=configs;