// JSONIX overrides
WCS_1_1.defaultElementNamespaceURI = 'http:\/\/www.opengis.net\/wcs\/1.1.1';
// end of JSONIX overrides

if (!window.wps) {
  window.wps = {};
}
var wps = window.wps;

wps.htmlEncode = function(value) {
  return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
};

wps.hiddenForm = function(unmarshaller, options, url, fields, body) {
  if ($('#hiddenform-iframe').length) {
    $('#hiddenform-iframe').remove();
  }
  $('body').append('<iframe class="x-hidden" id="hiddenform-iframe" name="iframe"></iframe>');
  $('#hiddenform-iframe').on('load', function(evt) {
    var info = unmarshaller.unmarshalDocument(evt.target.contentDocument).value;
    var exception = wps.client.getExceptionText(info);
    if (options.failure) {
      options.failure.call(options.scope, exception, body);
    }
  });
  if ($('#hiddenform-form').length) {
    $('#hiddenform-form').remove();
  }
  $('body').append('<form classs="x-hidden" action="'+url+'" method="POST" target="iframe" encType="multipart/form-data" id="hiddenform-form"></form>');
  $.each(fields,function(i,values){
    $('#hiddenform-form').append('<input type="text" class="x-hidden" id="' + 'hiddenform-' + values[0] + '" name="'+values[0]+'" value="'+wps.htmlEncode(values[1])+'" />');
  });
  $('form#hiddenform-form').submit();
  if (options.success) {
    var outputs = {};
    outputs[options.output || 'result'] = '';
    options.success.call(options.scope, outputs, body);
  }
};

wps.process = function(options) {
  this.client = null;
  this.server = null;
  this.identifier = null;
  this.description = null;
  this.localWPS = 'http://geoserver/wps';
  this.localWFS = 'http://geoserver/wfs';
  this.localWCS = 'http://geoserver/wcs';
  this.WKT = new ol.format.WKT();
  this.chained = 0;
  for (var prop in options)   {
    if (this.hasOwnProperty(prop)) {
      this[prop] = options[prop];   
    }
  }
  this.executeCallbacks = [];
  this.formats = [{
    mimeType: 'text/xml; subtype=wfs-collection/1.1',
    format: new ol.format.WFS()
  }, {
    mimeType: 'application/wkt',
    format: this.WKT
  }, {
    mimeType: 'application/json',
    format: new ol.format.GeoJSON()
  }];
};

wps.process.prototype.describe = function(options) {
  options = options || {};
  if (!this.description) {
    this.client.describeProcess(this.server, this.identifier, function(description) {
      if (!this.description) {
        this.parseDescription(description);
      }
      if (options.callback) {
        options.callback.call(options.scope || this, this.description);
      }
    }, this);
  } else if (options.callback) {
    var description = this.description;
    window.setTimeout(function() {
      options.callback.call(options.scope || this, description);
    }, 0);
  }
};

// check the values against the required inputs
wps.process.prototype.isComplete = function(values) {
  if (this.description) {
    var hasUndefined = false;
    var inputs = this.description.dataInputs.input;
    for (var i=0, ii=inputs.length; i<ii; ++i) {
      var input = inputs[i];
      if (input.minOccurs > 0) {
        if (values[input.identifier.value] === undefined) {
          hasUndefined = true;
          break;
        }
      }
    }
    return !hasUndefined;
  } else {
    return false;
  }
};

wps.process.prototype.configure = function(options) {
  this.info = {
    name: {
      localPart: "Execute",
      namespaceURI: "http://www.opengis.net/wps/1.0.0"
    },
    value: {
      service: "WPS",
      version: "1.0.0",
      identifier: {
        value: this.description.identifier.value
      },
      dataInputs: {
        input: []
      }
    }
  };
  this.describe({
    callback: function() {
      var description = this.description,
        inputs = options.inputs,
        input, i, ii;
      for (i=0, ii=description.dataInputs.input.length; i<ii; ++i) {
        input = description.dataInputs.input[i];
        if (inputs[input.identifier.value] !== undefined) {
          if (!input.boundingBoxData && $.isArray(inputs[input.identifier.value])) {
            for (var j=0, jj=inputs[input.identifier.value].length; j<jj; ++j) {
              this.setInputData(input, inputs[input.identifier.value][j]);
            }
          } else {
            this.setInputData(input, inputs[input.identifier.value]);
          }
        }
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
      var outputIndex = this.getOutputIndex(
        me.description.processOutputs.output, options.output);
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

        var desc = me.description;
        var hasTiffOutput = false;
        if (desc.processOutputs) {
          for (var i=0, ii=desc.processOutputs.output.length; i<ii; ++i) {
            var output = desc.processOutputs.output[i];
            if (output.complexOutput && output.complexOutput.supported && output.complexOutput.supported.format) {
              for (var j=0, jj=output.complexOutput.supported.format.length; j<jj; ++j) {
                if (output.complexOutput.supported.format[j].mimeType === 'image/tiff') {
                  hasTiffOutput = true;
                  break;
                }
              }
            }
          }
        }
        var body = me.client.marshaller.marshalString(me.info);
        if (hasTiffOutput) {
          new wps.hiddenForm(me.client.unmarshaller, options, me.client.servers[me.server].url,
              [['body', body]], body);
          if (options.startdownload) {
            options.startdownload.call(options.scope);
          }
        } else {
          var xmlhttp = new XMLHttpRequest();
          xmlhttp.open('POST', me.client.servers[me.server].url, true);
          xmlhttp.setRequestHeader('Content-type', 'application/xml');
          xmlhttp.onload = function() {

            // check for exceptions
            if (this.responseText.indexOf('ExceptionText') !== -1) {
              var info = me.client.unmarshaller.unmarshalDocument(this.responseXML).value;
              var exception = wps.client.getExceptionText(info);
              if (options.failure) {
                options.failure.call(options.scope, exception, body);
                return;
              }
            }
            var output = me.description.processOutputs.output[outputIndex]; 
            var result;
            if (output.literalOutput) {
              if (output.literalOutput.dataType === "boolean") {
                result = (this.responseText.trim().toLowerCase() === 'true');
              } else if (output.literalOutput.dataType === "double") {
                result = parseFloat(this.responseText);
              } else {
                result = this.responseText;
              }
            } else if (output.boundingBoxOutput) {
              var box = me.client.unmarshaller.unmarshalDocument(this.responseXML).value;
              var feature = new ol.Feature();
              var geom = new ol.geom.Polygon([
                [
                  box.lowerCorner,
                  [box.lowerCorner[0], box.upperCorner[1]],
                  box.upperCorner,
                  [box.upperCorner[0], box.lowerCorner[1]],
                  box.lowerCorner
                ]
              ]);
              feature.setGeometry(geom);
              result = [feature];
            } else if (output.complexOutput) {
              if (output.complexOutput._default.format.mimeType === 'text/xml') {
                result = this.responseText;
              } else {
                var mimeType = me.findMimeType(output.complexOutput.supported.format);
                for (var i=0, ii=me.formats.length; i<ii; ++i) {
                  if (me.formats[i].mimeType === mimeType) {
                    try {
                      result = me.formats[i].format.readFeatures(this.responseText);
                    } catch(e) {
                      if (window.console) {
                        window.console.warn(e);
                      }
                      result = this.responseText;
                    }
                    break;
                  }
                }
              }
            }
            if (options.success) {
              var outputs = {};
              outputs[options.output || 'result'] = result;
              options.success.call(options.scope, outputs, body, this.responseText);
            }
          };
          xmlhttp.send(body);
        }
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
  this.description = this.client.unmarshaller.unmarshalString(
    server.processDescription[this.identifier]).value.processDescription[0];
};

wps.process.prototype.setInputData = function(input, data) {
  var inputValue;
  if (data instanceof wps.process.chainlink) {
    ++this.chained;
    inputValue = {
      identifier: {
        value: input.identifier.value
      },
      reference: {
        method: 'POST',
        href: data.process.server === this.server ?
          this.localWPS : this.client.servers[data.process.server].url
      }
    };
    this.info.value.dataInputs.input.push(inputValue);
    data.process.describe({
      callback: function() {
        --this.chained;
        this.chainProcess(input, inputValue, data);
      },
      scope: this
    });
  } else if (data instanceof wps.process.localWCS) {
    inputValue = {
      identifier: {
        value: input.identifier.value
      },
      reference: {
        method: 'POST',
        mimeType: 'image/tiff',
        href: this.localWCS
      }
    };
    inputValue.reference.body = {
      content: [{
        name: {
          namespaceURI: "http://www.opengis.net/wcs/1.1.1",
          localPart: "GetCoverage"
        },
        value: {
          domainSubset: {
            boundingBox: {
              name: {
                namespaceURI: "http://www.opengis.net/ows/1.1",
                localPart: "BoundingBox"
              },
              value: {
                crs: 'http://www.opengis.net/gml/srs/epsg.xml#4326',
                lowerCorner: data.lowerCorner,
                upperCorner: data.upperCorner
              }
            }
          },
          identifier: {
            value: data.identifier
          },
          output: {
            format: "image/tiff"
          },
          service: "WCS",
          version: "1.1.1"
        }
      }]
    };
    this.info.value.dataInputs.input.push(inputValue);
  } else if (data instanceof wps.process.localWFS) {
    inputValue = {
      identifier: {
        value: input.identifier.value
      },
      reference: {
        method: 'POST',
        mimeType: 'text/xml',
        href: this.localWFS
      }
    };
    inputValue.reference.body = {
      content: [{
        name: {
          namespaceURI: "http://www.opengis.net/wfs",
          localPart: "GetFeature"
        },
        value: {
          outputFormat: "GML2",
          service: "WFS",
          version: "1.1.0",
          query: [{
            srsName: data.srsName,
            filter: data.bbox ? {
              spatialOps: {
                name: {
                  namespaceURI: "http://www.opengis.net/ogc",
                  localPart: "BBOX"
                },
                value: {
                  envelope: {
                    name: {
                      namespaceURI: "http://www.opengis.net/gml",
                      localPart: "Envelope"
                    },
                    value: {
                      lowerCorner: {
                        value: [data.bbox.split(',')[0], data.bbox.split(',')[1]]
                      },
                      upperCorner: {
                        value: [data.bbox.split(',')[2], data.bbox.split(',')[3]]
                      },
                      srsName: data.srsName
                    }
                  }
                }
              }
            }: undefined,
            typeName: [data.typeName]
          }]
        }
      }]
    };
    this.info.value.dataInputs.input.push(inputValue);
  } else {
    var complexData = input.complexData;
    if (complexData) {
      // ol.format.WFS has no writeFeatures so skip it
      var formats = [{
        mimeType: 'application/wkt',
        format: new ol.format.WKT()
      }, {
        mimeType: 'application/json',
        format: new ol.format.GeoJSON()
      }];
      var format = this.findMimeType(complexData.supported.format, formats);
      var content;
      if ($.isXMLDoc(data)) {
        content = data.childNodes[0];
        format = 'application/gml-3.1.1';
      } else {
        for (var i=0, ii=this.formats.length; i<ii; ++i) {
          if (this.formats[i].mimeType === format) {
            if (typeof(data) === "string") {
              if (format === "application/wkt") {
                content = data;
              } else {
                content = this.formats[i].format.writeFeatures(this.WKT.readFeatures(data));
                if (format === 'application/json') {
                  content = JSON.stringify(content);
                }
              }
            } else {
              content = this.formats[i].format.writeFeatures(this.toFeatures(data));
            }
            break;
          } 
        }
      }
      this.info.value.dataInputs.input.push({
        identifier: {
          value: input.identifier.value
        },
        data: {
          complexData: {
            mimeType: format,
            content: [content]
          }
        }
      });
    } else {
      if (input.boundingBoxData) {
        this.info.value.dataInputs.input.push({
          identifier: {
            value: input.identifier.value
          },
          data: {
            boundingBoxData: {
              crs: "EPSG:4326",
              lowerCorner: [data[0], data[1]],
              upperCorner: [data[2], data[3]]
            }
          }
        });
      } else {
        this.info.value.dataInputs.input.push({
          identifier: {
            value: input.identifier.value
          },
          data: {
            literalData: {
              value: data
            }
          }
        });
      }
    }
  }
};

wps.process.prototype.setResponseForm = function(options) {
  options = options || {};
  var output = this.description.processOutputs.output[options.outputIndex || 0];
  var mimeType;
  if (output.complexOutput) {
    mimeType = this.findMimeType(output.complexOutput.supported.format, options.supportedFormats);
  }
  this.info.value.responseForm = {
    rawDataOutput: {
      identifier: {
        value: output.identifier.value
      },
      mimeType: mimeType
    }
  };
};

wps.process.prototype.getOutputIndex = function(outputs, identifier) {
  var output;
  if (identifier) {
    for (var i=outputs.length-1; i>=0; --i) {
      if (outputs[i].identifier.value === identifier) {
        output = i;
        break;
      }
    }
  } else {
    output = 0;
  }
  return output;
};

wps.process.prototype.chainProcess = function(input, inputValue, chainLink) {
  var output = this.getOutputIndex(
    chainLink.process.description.processOutputs.output, chainLink.output);
  inputValue.reference.mimeType = this.findMimeType(
    input.complexData.supported.format,
    chainLink.process.description.processOutputs.output[output].complexOutput.supported.format);
  var formats = {};
  formats[inputValue.reference.mimeType] = true;
  chainLink.process.setResponseForm({
    outputIndex: output,
    supportedFormats: formats
  });
  inputValue.reference.body = {
    content: [chainLink.process.info]
  };
  while (this.executeCallbacks.length > 0) {
    this.executeCallbacks[0]();
  }
};

wps.process.prototype.toFeatures = function(source) {
  if (!$.isArray(source)) {
    source = [source];
  }
  return source;
};

wps.process.prototype.findMimeType = function(sourceFormats, targetFormats) {
  targetFormats = targetFormats || this.formats;
  for (var i=0, ii=sourceFormats.length; i<ii; ++i) {
    var f = sourceFormats[i].mimeType;
    for (var j=0, jj=targetFormats.length; j<jj; ++j) {
      if (targetFormats[j].mimeType === f) {
        return f;
      }
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

wps.process.localWCS = function(options) {
  this.lowerCorner = null;
  this.upperCorner = null;
  this.identifier = null;
  for (var prop in options)   {
    if (this.hasOwnProperty(prop)) {
      this[prop] = options[prop];
    }
  }
};

wps.process.localWFS = function(options) {
  this.srsName = null;
  this.typeName = null;
  this.bbox = null;
  for (var prop in options)   {
    if (this.hasOwnProperty(prop)) {
      this[prop] = options[prop];
    }
  }
};

wps.client = function(options) {
  this.version = options.version || "1.0.0";
  this.lazy = options.lazy !== undefined ? options.lazy : false;
  this.servers = {};
  for (var s in options.servers) {
    this.servers[s] = typeof options.servers[s] == 'string' ? {
      url: options.servers[s],
      version: this.version,
      processDescription: {}
    } : options.servers[s];
  }
};

wps.client.getExceptionText = function(info) {
  var exception = '', i, ii;
  if (info['status'] && info['status'].processFailed && info['status'].processFailed.exceptionReport && info['status'].processFailed.exceptionReport.exception) {
    for (i=0, ii=info['status'].processFailed.exceptionReport.exception.length; i<ii; ++i) {
      exception += info['status'].processFailed.exceptionReport.exception[i].exceptionText.join('<br/>');
    }
  } else if (info.exception) {
    for (i=0, ii=info.exception.length; i<ii; ++i) {
      exception += info.exception[i].exceptionText.join('<br/>');
    }
  }
  return exception;
};

wps.client.prototype.setNamespacePrefixes = function(namespacePrefixes) {
  this.context = new Jsonix.Context([XLink_1_0, OWS_1_1_0, WPS_1_0_0, Filter_2_0, OWS_1_0_0, Filter_1_1_0, GML_2_1_2, GML_3_1_1, WFS_1_1_0, SMIL_2_0, SMIL_2_0_Language, WCS_1_1], {
    namespacePrefixes: namespacePrefixes
  });
  this.unmarshaller = this.context.createUnmarshaller();
  this.marshaller = this.context.createMarshaller();
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

wps.client.prototype.getFeatureTypes = function(serverID, callback) {
  var context = new Jsonix.Context([OWS_1_0_0, Filter_1_1_0, SMIL_2_0, SMIL_2_0_Language, XLink_1_0, GML_3_1_1, WFS_1_1_0]);
  var unmarshaller = context.createUnmarshaller();
  var server = this.servers[serverID];
  var xmlhttp = new XMLHttpRequest();
  var url = server.url + '?service=WFS&VERSION=1.1.0&request=GetCapabilities';
  var me = this;
  xmlhttp.open("GET", url, true);
  var namespaces = {};
  xmlhttp.onload = function() {
    var featureTypes = [];
    if (this.responseXML !== null) {
      var info = unmarshaller.unmarshalDocument(this.responseXML).value;
      if (info && info.featureTypeList && info.featureTypeList.featureType) {
        for (var i=0, ii=info.featureTypeList.featureType.length; i<ii; ++i) {
          var featureType = {};
          var ft = info.featureTypeList.featureType[i];
          namespaces[ft.name.namespaceURI] = ft.name.prefix;
          featureType.name = ft.name.prefix + ':' + ft.name.localPart;
          featureType.lowerCorner = ft.wgs84BoundingBox[0].lowerCorner;
          featureType.upperCorner = ft.wgs84BoundingBox[0].upperCorner;
          featureTypes.push(featureType);
        }
        me.setNamespacePrefixes(namespaces);
      } else if (window.console) {
        window.console.warn('No featureTypes found on WFS server: ' + server.url);
      }
    } else if (window.console) {
      window.console.error('There was an error loading WFS 1.1.0 GetCapabilities from: ' + server.url);
    }
    callback.call(me, featureTypes);
  };
  xmlhttp.send();
};

wps.client.prototype.getCoverages = function(serverID, callback) {
  var context = new Jsonix.Context([SMIL_2_0, SMIL_2_0_Language, GML_3_1_1, XLink_1_0, OWS_1_1_0, WCS_1_1]);
  var unmarshaller = context.createUnmarshaller();
  var server = this.servers[serverID];
  var xmlhttp = new XMLHttpRequest();
  var url = server.url + '?service=WCS&VERSION=1.1.0&request=GetCapabilities';
  var me = this;
  xmlhttp.open("GET", url, true);
  xmlhttp.onload = function() {
    var coverages = [];
    if (this.responseXML !== null) {
      var info = unmarshaller.unmarshalDocument(this.responseXML).value;
      if (info && info.contents && info.contents.coverageSummary) {
        for (var i=0, ii=info.contents.coverageSummary.length; i<ii; ++i) {
          var coverage = {};
          var covsum = info.contents.coverageSummary[i];
          coverage.name = covsum.identifier;
          if (covsum.wgs84BoundingBox && covsum.wgs84BoundingBox.length > 0) {
            coverage.lowerCorner = covsum.wgs84BoundingBox[0].lowerCorner;
            coverage.upperCorner = covsum.wgs84BoundingBox[0].upperCorner;
          }
          if (coverage.name && coverage.lowerCorner && coverage.upperCorner) {
            coverages.push(coverage);
          }
        }
      } else if (window.console) {
        window.console.warn('No coverages found on WCS server: ' + server.url);
      }
    } else if (window.console) {
      window.console.error('There was an error loading WCS 1.1.0 GetCapabilities from: ' + server.url);
    }
    callback.call(me, coverages);
  };
  xmlhttp.send();
};

wps.client.prototype.getGroupedProcesses = function(serverID, callback) {
  var context = new Jsonix.Context([XLink_1_0, OWS_1_1_0, WPS_1_0_0]);
  var unmarshaller = context.createUnmarshaller();
  var server = this.servers[serverID];
  var xmlhttp = new XMLHttpRequest();
  var url = server.url + '?service=WPS&VERSION=' + server.version + '&request=GetCapabilities';
  var me = this;
  var errorText  = 'There was an error loading the WPS GetCapabilities document from: ' + server.url;
  xmlhttp.open("GET", url, true);
  xmlhttp.onload = function() {
    if (this.responseXML !== null) {
      var info = unmarshaller.unmarshalDocument(this.responseXML).value;
      if (info && info.exception) {
        alert(errorText + ' (' + wps.client.getExceptionText(info) + ')');
      } else if (info && info.processOfferings && info.processOfferings.process) {
        var groups = {};
        for (var i=0, ii=info.processOfferings.process.length; i<ii; ++i) {
          var key = info.processOfferings.process[i].identifier.value;
          var names = key.split(':');
          var group = names[0];
          if (!groups[group]) {
            groups[group] = [];
          }
          groups[group].push({name: names[1], value: info.processOfferings.process[i]});
        }
        callback.call(me, groups);
      }
    } else {
      alert(errorText);
    }
  };
  xmlhttp.send();
};

wps.client.prototype.describeProcess = function(serverID, processID, callback, scope) {
  var server = this.servers[serverID];
  if (!server.processDescription[processID]) {
    // TODO see if we can prevent multiple calls to the same DescribeProcess identifier
    // see: https://github.com/boundlessgeo/wps-gui/issues/211 for details and test case
    var xmlhttp = new XMLHttpRequest();
    var url = server.url + '?service=WPS&VERSION=' + server.version + '&request=DescribeProcess&identifier=' + processID;
    xmlhttp.open("GET", url, true);
    var me = this;
    xmlhttp.onload = function() {
      server.processDescription[processID] = this.responseText;
      callback.call(scope, this.responseText);
    };
    xmlhttp.send();
  } else {
    window.setTimeout(function() {
      callback.call(scope, server.processDescription[processID]);
    }, 0);
  }
};

