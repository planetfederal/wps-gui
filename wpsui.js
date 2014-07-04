if (!window.wps) {
  window.wps = {};
}
var wps = window.wps;

wps.client = function(options) {
  this.url_ = options.url;
  this.format_ = new OpenLayers.Format.WPSCapabilities();
};

wps.client.prototype.getGroupedProcesses = function(callback) {
  var format = this.format_;
  $.ajax(this.url_ + '?service=WPS&request=GetCapabilities&version=1.0.0').
    then(function(response) {
      var info = format.read(response);
      var groups = {};
      for (var key in info.processOfferings) {
        var names = key.split(':');
        var group = names[0];
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(names[1]);
      }
      callback.call(this, groups, info);
    });
};
