if (!window.wps) {
  window.wps = {};
}
var wps = window.wps;

wps.process = function(options) {
  this.client = null;
  this.server = null;
  this.identifier = null;
  this.description = null;
  this.localWPS = 'http://geoserver/wps';
  this.chained = 0;
  for (var prop in options)   {
    if (this.hasOwnProperty(prop)) {
      this[prop] = options[prop];   
    }
  }
  this.executeCallbacks = [];
  this.formats = {
    'application/wkt': new OpenLayers.Format.WKT(),
    'application/json': new OpenLayers.Format.GeoJSON()
  };
};

wps.process.prototype.describe = function(options) {
  options = options || {};
  if (!this.description) {
    this.client.describeProcess(this.server, this.identifier, function(description) {
      if (!this.description) {
        this.parseDescription(description);
      }
      if (options.callback) {
        options.callback.call(options.scope, this.description);
      }
    }, this);
  } else if (options.callback) {
    var description = this.description;
    window.setTimeout(function() {
      options.callback.call(options.scope, description);
    }, 0);
  }
};

wps.process.prototype.configure = function(options) {
  this.describe({
    callback: function() {
      var description = this.description,
        inputs = options.inputs,
        input, i, ii;
      for (i=0, ii=description.dataInputs.length; i<ii; ++i) {
        input = description.dataInputs[i];
        this.setInputData(input, inputs[input.identifier]);
      }
      if (options.callback) {
        options.callback.call(options.scope);
      }
    },
    scope: this
  });
  return this;
};

wps.process.prototype.execute = function(options) {
  this.configure({
    inputs: options.inputs,
    callback: function() {
      var me = this;
      //TODO For now we only deal with a single output
      var outputIndex = this.getOutputIndex(
        me.description.processOutputs, options.output);
      me.setResponseForm({outputIndex: outputIndex});
      (function callback() {
        var idx = me.executeCallbacks.indexOf(callback);
        if (idx > -1) {
          me.executeCallbacks.splice(idx, 1);
        }
        if (me.chained !== 0) {
          // need to wait until chained processes have a
          // description and configuration - see chainProcess
          me.executeCallbacks.push(callback);
          return;
        }
        // all chained processes are added as references now, so
        // let's proceed.
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', me.client.servers[me.server].url, true);
        xmlhttp.setRequestHeader('Content-type', 'application/xml');
        xmlhttp.onload = function() {
          var output = me.description.processOutputs[outputIndex]; 
          var result;
          if (output.literalOutput) {
            if (output.literalOutput.dataType === "boolean") {
              result = (this.responseText.trim().toLowerCase() === 'true');
            } else if (output.literalOutput.dataType === "double") {
              result = parseFloat(this.responseText);
            } else {
              result = this.responseText;
            }
          } else if (output.complexOutput) {
            var mimeType = me.findMimeType(output.complexOutput.supported.formats);
            //TODO For now we assume a spatial output if complexOutput
            result = me.formats[mimeType].read(this.responseText);
            if (result instanceof OpenLayers.Feature.Vector) {
              result = [result];
            }
          }
          if (options.success) {
            var outputs = {};
            outputs[options.output || 'result'] = result;
            options.success.call(options.scope, outputs);
          }
        };
        xmlhttp.send(new OpenLayers.Format.WPSExecute().write(me.description));
      })();
    },
    scope: this
  });
};

wps.process.prototype.output = function(identifier) {
  return new wps.process.chainlink({
    process: this,
    output: identifier
  });
};

wps.process.prototype.parseDescription = function(description) {
  var server = this.client.servers[this.server];
  this.description = new OpenLayers.Format.WPSDescribeProcess().
    read(server.processDescription[this.identifier]).
    processDescriptions[this.identifier];
};

wps.process.prototype.setInputData = function(input, data) {
  // clear any previous data
  delete input.data;
  delete input.reference;
  if (data instanceof wps.process.chainlink) {
    ++this.chained;
    input.reference = {
      method: 'POST',
      href: data.process.server === this.server ?
        this.localWPS : this.client.servers[data.process.server].url
    };
    data.process.describe({
      callback: function() {
        --this.chained;
        this.chainProcess(input, data);
      },
      scope: this
    });
  } else {
    input.data = {};
    var complexData = input.complexData;
    if (complexData) {
      var format = this.findMimeType(complexData.supported.formats);
      input.data.complexData = {
        mimeType: format,
        value: this.formats[format].write(this.toFeatures(data))
      };
    } else {
      input.data.literalData = {
        value: data
      };
    }
  }
};

wps.process.prototype.setResponseForm = function(options) {
  options = options || {};
  var output = this.description.processOutputs[options.outputIndex || 0];
  var mimeType;
  if (output.complexOutput) {
    mimeType = this.findMimeType(output.complexOutput.supported.formats, options.supportedFormats);
  }
  this.description.responseForm = {
    rawDataOutput: {
      identifier: output.identifier,
      mimeType: mimeType
    }
  };
};

wps.process.prototype.getOutputIndex = function(outputs, identifier) {
  var output;
  if (identifier) {
    for (var i=outputs.length-1; i>=0; --i) {
      if (outputs[i].identifier === identifier) {
        output = i;
        break;
      }
    }
  } else {
    output = 0;
  }
  return output;
};

wps.process.prototype.chainProcess = function(input, chainLink) {
  var output = this.getOutputIndex(
    chainLink.process.description.processOutputs, chainLink.output);
  input.reference.mimeType = this.findMimeType(
    input.complexData.supported.formats,
    chainLink.process.description.processOutputs[output].complexOutput.supported.formats);
  var formats = {};
  formats[input.reference.mimeType] = true;
  chainLink.process.setResponseForm({
    outputIndex: output,
    supportedFormats: formats
  });
  input.reference.body = chainLink.process.description;
  while (this.executeCallbacks.length > 0) {
    this.executeCallbacks[0]();
  }
};

wps.process.prototype.toFeatures = function(source) {
  var isArray = toString.call(source) === "[object Array]";
  if (!isArray) {
    source = [source];
  }
  var target = new Array(source.length), current;
  for (var i=0, ii=source.length; i<ii; ++i) {
    current = source[i];
    target[i] = current instanceof OpenLayers.Feature.Vector ?
      current : new OpenLayers.Feature.Vector(current);
  }
  return isArray ? target : target[0];
};

wps.process.prototype.findMimeType = function(sourceFormats, targetFormats) {
  targetFormats = targetFormats || this.formats;
  for (var f in sourceFormats) {
    if (f in targetFormats) {
      return f;
    }
  }
  return null;
};

wps.process.chainlink = function(options) {
  this.process = null;
  this.output = null;
  for (var prop in options)   {
    if (this.hasOwnProperty(prop)) {
      this[prop] = options[prop];
    }
  }
};

wps.client = function(options) {
  this.version = options.version || "1.0.0";
  this.lazy = options.lazy !== undefined ? options.lazy : false;
  for (var s in options.servers) {
    this.servers[s] = typeof options.servers[s] == 'string' ? {
      url: options.servers[s],
      version: this.version,
      processDescription: {}
    } : options.servers[s];
  }
};

wps.client.prototype.execute = function(options) {
  var process = this.getProcess(options.server, options.process);
  process.execute({
    inputs: options.inputs,
    success: options.success,
    scope: options.scope
  });
};

wps.client.prototype.getProcess = function(serverID, processID, options) {
  var process = new wps.process({
    client: this,
    server: serverID,
    identifier: processID
  });
  if (!this.lazy) {
    process.describe(options);
  }
  return process;
};

wps.client.prototype.describeProcess = function(serverID, processID, callback, scope) {
  var server = this.servers[serverID];
  if (!server.processDescription[processID]) {
    if (!(processID in server.processDescription)) {
      // set to null so we know a describeFeature request is pending
      server.processDescription[processID] = null;
      var xmlhttp = new XMLHttpRequest();
      var url = server.url + 'service=WPS&VERSION=' + server.version + '&request=DescribeProcess&identifier=' + processID;
      xmlhttp.open("GET", url, true);
      var me = this;
      xmlhttp.onload = function() {
        server.processDescription[processID] = this.responseText;
        var evt = document.createEvent("Event");
        evt.initEvent("describeprocess");
        evt.identifier = processID;
        evt.raw = this.responseText;
        // TODO is there a better target than document?
        document.dispatchEvent(evt);
        callback.call(scope, this.responseText);
      };
      xmlhttp.send();
    } else {
      // pending request
      document.addEventListener("describeprocess", function describe(evt) {
        if (evt.identifier === processID) {
          this.events.unregister('describeprocess', this, describe);
          callback.call(scope, evt.raw);
        }
      }, true);
    }
  } else {
    window.setTimeout(function() {
      callback.call(scope, server.processDescription[processID]);
    }, 0);
  }
};

