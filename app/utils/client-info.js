function getPlatform(object) {
  var _window = object || window;
  var platform = _window.navigator.platform;
  return platform.replace(/ /g, '');
}

function isTablet(object) {
  var platform = getPlatform(object);
  return tabletPlatforms.contains(platform);
}

var tabletPlatforms = ["Linuxarmv7l", "iPad", "iPadSimulator"];

export { getPlatform, isTablet };
