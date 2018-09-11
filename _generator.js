var vendorScriptMap = {
	bootstrap: 				'bootstrap-3.3.7.min.js',
	html5shiv: 				'html5shiv-3.7.3.min.js',
	respond:				'respond-1.4.2.min.js',
	jquery:					'jquery-3.3.1.min.js',
	modernizr:				'modernizr-3.6.0.min.js'
};

generator.applyToOutputNode = function(outputFolderNode, inputFolderNode) {
	
	// Read config and set default values	
	var config = generator.config || {};
	config.base = config.base || 'none';
	config.polyfill = config.polyfill || 'modernizr';
	config.serverExtras = !!config.serverExtras;
	config.ieTags = (config.ieTags === undefined) ? true : !!config.ieTags;
	config.ga = !!config.ga;
	config.ga_siteId = config.ga ? config.ga_siteId || '' : undefined;
	
	// Add common files from H5BP
	var boilerplateInputNode = inputFolderNode.folderForPath('html5-boilerplate_v6.1.0');
	var boilerplateOutputNode = outputFolderNode.addFolderAtPath(boilerplateInputNode, './', OverwriteOnConflict);
	
    var excludePaths = ['css/', 'doc/', 'js/vendor/', 'index.html' ];
	if (!config.serverExtras) {
		excludePaths = excludePaths.concat(['.htaccess', '404.html', 'humans.txt', 'robots.txt']);
	}
	
	excludePaths.forEach(function(excludePath) { 
		var currentNode = null;
		
		if (excludePath.slice(-1) === '/') {
			currentNode = boilerplateInputNode.folderForPath(excludePath);
		}
		else {
			currentNode = boilerplateInputNode.fileForPath(excludePath);
		}
		
		boilerplateOutputNode.excludeNode(currentNode);
	});
	
	// Add vendor script libraries
	function addVendorScript(vendorFileName) {
		if (vendorFileName) {
			var vendorInputFile = inputFolderNode.fileForPath('vendor-scripts/' + vendorFileName);
			outputFolderNode.addFileAtPath(vendorInputFile, 'js/vendor/' + vendorFileName, OverwriteOnConflict);
		}
	};
	
	addVendorScript(vendorScriptMap.jquery);
	addVendorScript(vendorScriptMap[config.polyfill]);
	
	if (config.base === 'responsive' || config.base === 'bootstrap') {
		addVendorScript(vendorScriptMap.respond);
	}
		
	if (config.base === 'bootstrap') {
		addVendorScript(vendorScriptMap.bootstrap);
	}
	
	// Add template styles
	var styleInputFolderNode = inputFolderNode.folderForPath('templates/' + config.base);
		
	if (styleInputFolderNode !== null) {
		for (var i = 0, styleChildNodes = styleInputFolderNode.childNodes; i < styleChildNodes.length; i++) {
			var childNode = styleChildNodes[i];
			var childNodePath = childNode.path.split('/').slice(2).join('/');
			
			if (childNode.type === FolderNode) {
				outputFolderNode.addFolderAtPath(childNode, childNodePath);
			}
			else {
				outputFolderNode.addFileAtPath(childNode, childNodePath);
			}
		}
	}
	
	// Translate our configuration to the index page
	var boilerplateIndexNode = outputFolderNode.fileForPath('index.html');
	
	if (boilerplateIndexNode !== null) {
		boilerplateIndexNode.assignVariable(config.polyfill, 'true');
		
		if (config.ieTags) {
			boilerplateIndexNode.assignVariable('ieTags', true);
		}
		
		if (config.ga) {
			boilerplateIndexNode.assignVariable('googleAnalytics', true);
		}
		
		if (config.ga_siteId) {
			boilerplateIndexNode.assignVariable('googleAnalyticsSiteID', config.ga_siteId);
		}
	}
	
	return true;
};
