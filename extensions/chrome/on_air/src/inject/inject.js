// if the extension is installed, add an empty div so
// we know that the extension is installed.
var isInstalledNode = document.createElement('div');
isInstalledNode.id = 'onair-extension-is-installed';
document.body.appendChild(isInstalledNode);