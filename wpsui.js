if (!window.wps) {
  window.wps = {};
}
var wps = window.wps;

wps.editor = function(ui) {
  this.ui_ = ui;
};

wps.editor.DRAW = "_DRAW_";

wps.editor.prototype.setValue = function() {
  var me = this, ui = this.ui_;
  var name = me.editingNode_._info.identifier.value;
  var processId = me.editingNode_._parent;
  var formField = $('#node-input-' + name);
  var value;
  if (formField.length > 0) {
    if (me.editingNode_._info.literalData &&
      me.editingNode_._info.literalData.dataType &&
      me.editingNode_._info.literalData.dataType.value === 'xs:boolean') {
        value = formField.is(':checked');
    } else {
      value = $('#node-input-' + name).val();
    }
    if (value !== wps.editor.DRAW) {
      me.editingNode_.value = value;
    }
  }
  ui.locked_ = false;
  me.editingNode_.dirty = true;
  me.editingNode_.complete = true;
  // check if the process is complete as well
  var process = ui.processes[processId], parentNode;
  var values = {};
  for (var i=0, ii=ui.nodes.length; i<ii; ++i) {
    var node = ui.nodes[i];
    if (node.type === "input" && node.value !== undefined) {
      values[node._info.identifier.value] = node.value;
    }
    if (node.id === processId) {
      parentNode = node;
    }

  }
  var old = parentNode.complete;
  parentNode.complete = process.isComplete(values);
  parentNode.dirty = (old !== parentNode.complete);
  ui.redraw();
};

wps.editor.prototype.attachPropertyChangeHandler = function(editor, name, node) {
  $('#' + 'node-input-' + name).change(function() {
    var valid = node.valid;
    node.valid = node._info.complexData || editor.validateNodeProperty(node._info, this.value);
    if (valid !== node.valid) {
      node.dirty = true;
      editor.ui_.redraw();
    }
    if (!node.valid) {
      $(this).addClass("input-error");
    } else {
      $(this).removeClass("input-error");
      editor.setValue();
    }
  });
};

wps.editor.prototype.validateNodeProperty = function(info, value) {
  var dataType = info.literalData.dataType.value;
  if (dataType === 'xs:double') {
    return (!isNaN(parseFloat(value)));
  } else if (dataType === 'xs:int') {
    return Math.floor(value) == value;
  } else {
    return true;
  }
};

wps.editor.prototype.showEditForm = function(node) {
  if (node['type'] !== 'input') {
    return;
  }
  this.ui_.locked_ = true;
  this.editingNode_ = node;
  var html = '<form id="dialog-form" class="form-horizontal">';
  var hasMap = false, i, ii, pIds = [];
  // simple input
  var name = node._info.identifier.value;
  var pId;
  html += '<div class="form-row-abstract">' + node._info._abstract.value + '</div>';
  if (node._info.literalData) {
    html += '<div class="form-row">';
    html += '<label for="node-input-' + name + '">' + name + '</label>';
    if (node._info.literalData.allowedValues) {
      html += '<select style="width: 60%;" id="node-input-' + name + '">';
      for (i=0, ii=node._info.literalData.allowedValues.valueOrRange.length; i<ii; ++i) {
        var key = node._info.literalData.allowedValues.valueOrRange[i].value;
        if (node.value === key) {
          html += '<option selected value="'+key+'">'+key+'</option>';
        } else {
          html += '<option value="'+key+'">'+key+'</option>';
        }
      }
      html += '</select>';
    } else if (node._info.literalData.dataType && node._info.literalData.dataType.value === 'xs:boolean') {
      if (node.value === true) {
        html += '<input type="checkbox" id="node-input-' + name + '" checked>';
      } else {
        html += '<input type="checkbox" id="node-input-' + name + '">';
      }
    } else {
      var value = node.value;
      value = (value === undefined) ? '' : value;
      html += '<input type="text" id="node-input-' + name + '" value="' + value + '">';
    }
    html += '</div>';
  } else if (node._info.complexData) {
    // check if there are any processes with geometry output that can serve as input here
    for (pId in this.ui_.processes) {
      if (pId !== node._parent) {
        var description = this.ui_.processes[pId].description;
        if (description.processOutputs && description.processOutputs.output) {
          for (i=0, ii=description.processOutputs.output.length; i<ii; ++i) {
            var output = description.processOutputs.output[i];
            if (output.complexOutput) {
              pIds.push(pId);
            }
          }
        }
      }
    }
    // check for text/xml; subtype=wfs-collection/1.0 or text/xml; subtype=wfs-collection/1.1
    var vectorLayer = false, rasterLayer = false;
    for (i=0, ii=node._info.complexData.supported.format.length; i<ii; ++i) {
      var mime = node._info.complexData.supported.format[i].mimeType;
      if (mime.indexOf('subtype=wfs-collection') !== -1) {
        vectorLayer = true;
      }
      if (mime.indexOf('image/tiff') !== -1) {
        rasterLayer = true;
      }
    }
    var prefix, selected;
    if (rasterLayer === true) {
      html += '<select style="width: 60%;" id="node-input-' + name + '">';
      prefix = 'raster|';
      for (i=0, ii=this.ui_.coverages.length; i<ii; ++i) {
        var coverage = this.ui_.coverages[i].name;
        selected = (node.value === prefix + coverage) ? 'selected' : '';
        html += '<option ' + selected + ' value="' + prefix + coverage + '">' + coverage + "</option>";
      }
      html += "</select>";
    }
    else if (pIds.length > 0 || vectorLayer === true) {
      html += '<select style="width: 60%;" id="node-input-' + name + '">';
      html += '<option value="' + wps.editor.DRAW + '">Draw geometry</option>';
      prefix = 'process|';
      for (i=0, ii=pIds.length; i<ii; ++i) {
        pId = pIds[i];
        selected = (node.value === prefix + pId) ? 'selected' : '';
        html += '<option ' + selected + ' value="' + prefix + pId + '">' + pId + "</option>";
      }
      if (vectorLayer === true) {
        prefix = 'vector|';
        for (i=0, ii=this.ui_.featureTypes.length; i<ii; ++i) {
          var featureType = this.ui_.featureTypes[i];
          selected = (node.value === prefix + featureType) ? 'selected' : '';
          html += '<option ' + selected + ' value="' + prefix + featureType + '">' + featureType + "</option>";
        }
      }
      html += "</select>";
    }
    if (rasterLayer !== true) {
      hasMap = true;
      var id = "input-map-" + node._parent;
      html += '<div id="' + id + '" style="width:400px;height:200px;border:1px black solid"></div>';
    }
  }
  html += '</form>';
  $('#tab-inputs').html(html);
  this.ui_.activateTab('tab-inputs');
  if (hasMap === false || pIds.length > 0 || vectorLayer === true) {
    this.attachPropertyChangeHandler(this, name, node);
  }
  if (hasMap === true) {
    var map;
    var mapId = node._parent;
    if (!this.ui_.inputMaps[mapId]) {
      this.ui_.inputMaps[mapId] = {};
      this.ui_.inputMaps[mapId].source = new ol.source.Vector();
      this.ui_.inputMaps[mapId].vector = new ol.layer.Vector({source: this.ui_.inputMaps[mapId].source, style: function(feature) {
        var selection = d3.selectAll(".node_selected");
        if (selection[0].length > 0) {
          var node = selection.datum();
          if (feature.get('node') === node.id) {
            return [
              new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: 'orange',
                  width: 1
                })
              })
            ];
          } else {
            return [
              new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: 'gray',
                  width: 1
                })
              })
            ];
          }
        }
      }});
      this.ui_.inputMaps[mapId].map = new ol.Map({
        target: 'input-map-' + mapId,
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          this.ui_.inputMaps[mapId].vector
        ],
        view: new ol.View({
          center: [0, 0],
          zoom: 1
        })
      });
      this.ui_.inputMaps[mapId].draw = new ol.interaction.Draw({
        source: this.ui_.inputMaps[mapId].source,
        type: 'Polygon'
      });
      this.ui_.inputMaps[mapId].map.addInteraction(this.ui_.inputMaps[mapId].draw);
      this.ui_.inputMaps[mapId].draw.on('drawend', function(evt) {
        var selection = d3.selectAll(".node_selected");
        if (selection[0].length > 0) {
          var node = selection.datum();
          evt.feature.set('node', node.id);
          // TODO should we consider adding to any existing features here?
          node.value = new ol.format.WKT().writeFeatures([evt.feature]);
          node.valid = evt.feature;
          if (node.valid) {
            this.setValue();
          }
        }
      }, this);
      if (node.value) {
        this.ui_.inputMaps[mapId].source.addFeatures(new ol.format.WKT().readFeatures(node.value));
      } 
      map = this.ui_.inputMaps[mapId].map;
      window.setTimeout(function() {
        map.updateSize();
      }, 0);
    } else {
      map = this.ui_.inputMaps[mapId].map;
      map.set('target', 'input-map-' + mapId);
      window.setTimeout(function() {
        map.updateSize();
      }, 0);
    }
  }
};

wps.ui = function(options) {
  var me = this;
  this.parentContainer_ = options.parentContainer;
  this.dropZone_ = options.dropZone;
  this.client_ = options.client;
  if (options.getVectorLayers === true) {
    // TODO do not hardcode serverID
    this.client_.getFeatureTypes('wpsgui', function(featureTypes) {
      me.featureTypes = featureTypes;
    });
    this.client_.getCoverages('wpsgui', function(coverages) {
      me.coverages = coverages;
    });
  }
  this.spaceWidth = options.spaceWidth || 5000;
  this.spaceHeight = options.spaceHeight || 5000;
  this.scaleFactor = options.scaleFactor || 1;
  this.nodeWidth = options.nodeWidth || 70;
  this.nodeHeight = options.nodeHeight || 30;
  this.lineCurveScale = options.lineCurveScale || 0.75;
  this.nodes = [];
  this.clickElapsed = 0;
  this.clickTime = 0;
  this.movingSet = [];
  this.mouseOffset = [0,0];
  this.mouseMode = 0;
  this.mousePosition = null;
  this.selectedLink = null;
  this.mousedownNode = null;
  this.createSearch();
  this.createCanvas();
  this.createDropTarget();
  this.createZoomToolbar();
  this.editor_ = new wps.editor(this);
  this.processes = {};
  this.inputMaps = {};
  this.localStorageKey = 'wps-gui';
  this.outputStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      stroke: new ol.style.Stroke({
        color: 'black'
      }),
      fill: new ol.style.Fill({
        color: 'red'
      })
    }),
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 1 
    })
  });
  $('#btn-run-process').click($.proxy(this.execute, null, this));
  d3.select(window).on("keydown",function() {
    if (me.locked_ !== true && d3.event.target == document.body) {
      if (d3.event.keyCode === 46 || d3.event.keyCode === 8) {
        try {
          me.deleteSelection();
        } catch(err) {
          if (window.console) {
            window.console.error(err);
          }
        } finally {
          d3.event.preventDefault();
        }
      }
    }
  });
  this.initializeTabs();
  this.initializeSplitter();
  $('#file-open').click($.proxy(wps.ui.load, null, this));
  $('#file-save').click($.proxy(this.save, null, this));
  $('#export-clipboard').click($.proxy(this.exportClipboard, null, this));
  $('#import-clipboard').click($.proxy(this.importClipboard, null, this));
  $( "#dialog" ).dialog({
    modal: true,
    autoOpen: false,
    closeOnEscape: false,
    width: 500,
    buttons: [{
      text: "Ok",
      click: function() {
        var nodes = $("#node-input-import").val();
        if (nodes) {
          wps.ui.load(me, null, nodes);
        }
        $("#node-input-import").val("");
        $(this).dialog("close");
      }
    }, {
      text: "Cancel",
      click: function() {
        $("#node-input-import").val("");
        $(this).dialog("close");
      }
    }]
  });
};

wps.ui.link = function(options) {
  this.source = options.source;
  this.target = options.target;
  this._parent = options._parent;
};

wps.ui.link.prototype.getState = function() {
  // TODO see if there is need to serialize the links or they can be recreated
  return {
    source: this.source,
    target: this.target,
    _parent: this._parent
  };
};

// TODO maybe have separate node classes per type?
wps.ui.node = function(options) {
  // generate an identifier
  this.id = options.id || (1+Math.random()*4294967295).toString(16);
  this.w = options.w;
  this.x = options.x;
  this.y = options.y;
  this.z = 0;
  // type can be 'process', 'input' or 'output'
  this.type = options.type;
  // is the node dirty so does it need a redraw or not
  this.dirty = options.dirty;
  // information about the node coming from WPS DescribeProcess
  this._info = options._info;
  // number of inputs
  this.inputs = options.inputs;
  // number of outputs
  this.outputs = options.outputs;
  // label to use for display
  this.label = options.label;
  // the parent node's id
  this._parent = options._parent;
  // is the input required or not
  this.required = options.required;
  // is the node complete or not
  this.complete = options.complete;
};

wps.ui.node.prototype.getState = function() {
  return {
    id: this.id,
    w: this.w,
    x: this.x,
    y: this.y,
    z: this.z,
    type: this.type,
    _info: this._info,
    inputs: this.inputs,
    outputs: this.outputs,
    label: this.label,
    _parent: this._parent,
    required: this.required,
    complete: this.complete,
    dirty: true,
    value: this.value
  };
};

wps.ui.load = function(ui, evt, nodes) {
  if (!nodes) {
    nodes = localStorage.getItem(ui.localStorageKey);
  }
  if (nodes !== null) {
    ui.nodes = JSON.parse(nodes);
    // recreate process state
    for (var i=0, ii=ui.nodes.length; i<ii; ++i) {
      var config = ui.nodes[i];
      if (config.source && config.target) {
        ui.nodes[i] = new wps.ui.link(config);
      } else {
        ui.nodes[i] = new wps.ui.node(config);
      }
      var node = ui.nodes[i];
      if (node.type === "process") {
        var process = ui.client_.getProcess('wpsgui', node._info.identifier.value, {callback: function(info) {
          ui.processes[node.id] = process;
        }});
      }
    }
    ui.redraw();
  }
};

wps.ui.prototype.exportClipboard = function(ui) {
  var nodes = [];
  for (var i=0, ii=ui.nodes.length; i<ii; ++i) {
    nodes.push(ui.nodes[i].getState());
  }
  var html = '<div class="form-row">';
  html += '<label for="node-input-export" style="width:100%"><i class="glyphicon glyphicon-share"> Nodes:</i></label>';
  html += '<textarea readonly class="form-control" id="node-input-export" rows="5"></textarea>';
  html += '</div>';
  html += '<div class="form-tips"> Select the text above and copy to the clipboard with Ctrl-A Ctrl-C.</div>';
  $("#dialog-form").html(html);
  $("#dialog").dialog("option", "title", "Export nodes to clipboard").dialog( "open" );
  // bootstrap's hide class has important, so we need to remove it
  $("#dialog").removeClass('hide');
  $("#node-input-export").val(JSON.stringify(nodes));
  $("#node-input-export").focus();
};

wps.ui.prototype.importClipboard = function(ui) {
  var html = '<div class="form-row">';
  html += '<label for="node-input-import" style="width:100%"><i class="glyphicon glyphicon-share"> Nodes:</i></label>';
  html += '<textarea placeholder="Paste nodes here" class="form-control" id="node-input-import" rows="5"></textarea>';
  html += '</div>';
  $("#dialog-form").html(html);
  $("#node-input-import").val("");
  $("#dialog").dialog("option", "title", "Import nodes from clipboard").dialog( "open" );
  // bootstrap's hide class has important, so we need to remove it
  $("#dialog").removeClass('hide');
};

wps.ui.prototype.save = function(ui) {
  var nodes = [];
  for (var i=0, ii=ui.nodes.length; i<ii; ++i) {
    nodes.push(ui.nodes[i].getState());
  }
  localStorage.setItem(ui.localStorageKey, JSON.stringify(nodes));
};

wps.ui.prototype.resizeTabs = function() {
  var ul = $('#sidebar-tabs');
  var tabs = ul.find("li.red-ui-tab");
  var width = ul.width();
  var tabCount = tabs.size();
  var tabWidth = (width-6-(tabCount*7))/tabCount;
  var pct = 100*tabWidth/width;
  tabs.css({width:pct+"%"});
};

wps.ui.prototype.initializeSplitter = function() {
  var sidebarSeparator =  {};
  var me = this;
  $("#sidebar-separator").draggable({
    axis: "x",
    start:function(event,ui) {
      var winWidth = $(window).width();
      sidebarSeparator.start = ui.position.left;
      sidebarSeparator.chartWidth = $("#workspace").width();
      sidebarSeparator.chartRight = winWidth-$("#workspace").width()-$("#workspace").offset().left-2;
      sidebarSeparator.width = $("#sidebar").width();
    },
    drag: function(event,ui) {
      var d = ui.position.left-sidebarSeparator.start;
      var newSidebarWidth = sidebarSeparator.width-d;
      var newChartRight = sidebarSeparator.chartRight-d;
      $("#workspace").css("right",newChartRight);
      $("#chart-zoom-controls").css("right",newChartRight+20);
      $("#sidebar").width(newSidebarWidth);
      me.resizeTabs();
    },
    stop:function(event,ui) {
      $("#sidebar-separator").css("left","auto");
      $("#sidebar-separator").css("right",($("#sidebar").width()+13)+"px");
    }
  });
};

wps.ui.prototype.activateTab = function(link) {
  var ul = $('#sidebar-tabs');
  if (typeof link === "string") {
    link = ul.find("a[href='#"+link+"']");
  }
  if (!link.parent().hasClass("active")) {
    ul.children().removeClass("active");
    link.parent().addClass("active");
  }
  $('#sidebar-content').children().hide();
  var tab = link.attr('href');
  $(tab).show();
};

wps.ui.prototype.initializeTabs = function() {
  var ul = $('#sidebar-tabs');
  var me = this;
  var onTabClick = function() {
    me.activateTab($(this));
    return false;
  };
  ul.find("li.red-ui-tab a").on("click", onTabClick);
};

wps.ui.prototype.execute = function(ui) {
  var hasSelected = false;
  var selection = d3.selectAll(".node_selected");
  if (selection[0].length > 0) {
    var node = selection.datum();
    if (node.type === 'process') {
      hasSelected = true;
      var processId = node.id, process = ui.processes[processId];
      var values = {};
      for (var i=0, ii=ui.nodes.length; i<ii; ++i) {
        var n = ui.nodes[i];
        if (n.type === 'input' && n._parent === processId) {
          values[n._info.identifier.value] = n.value;
        }
      }
      if (values && process.isComplete(values)) {
        var srsName = 'EPSG:3857';
        if (process.identifier.indexOf('ras:') === 0) {
          srsName = 'EPSG:4326';
        }
        var features = [];
        var inputs = {};
        var coverage, c, cc, lowerCorner, upperCorner;
        for (var key in values) {
          // vector or subprocess
          if ((typeof values[key] === 'string') && (values[key].indexOf('raster|') !== -1 || values[key].indexOf('vector|') !== -1 || values[key].indexOf('process|') !== -1)) {
            if (values[key].indexOf('process|') !== -1) {
              var subId = values[key].substring(values[key].indexOf('process|') + 8);
              var subInputs = {};
              for (var j=0, jj=ui.nodes.length; j<jj; ++j) {
                if (ui.nodes[j].type === "input" && ui.nodes[j]._parent === subId) {
                  if (ui.nodes[j].value.indexOf('vector|') !== -1) {
                    subInputs[ui.nodes[j]._info.identifier.value] = new wps.process.localWFS({
                      srsName: srsName,
                      typeName: ui.nodes[j].value.substring(ui.nodes[j].value.indexOf('vector|')+7)
                    });
                  } else if (ui.nodes[j].value.indexOf('raster|') !== -1) {
                    coverage = ui.nodes[j].value.substring(ui.nodes[j].value.indexOf('raster|')+7);
                    for (c=0, cc=ui.coverages.length; c<cc; ++c) {
                      if (ui.coverages[c].name === coverage) {
                        lowerCorner = ui.coverages[c].lowerCorner;
                        upperCorner = ui.coverages[c].upperCorner;
                        break;
                      }
                    }
                    subInputs[ui.nodes[j]._info.identifier.value] = new wps.process.localWCS({
                      lowerCorner: lowerCorner,
                      upperCorner: upperCorner,
                      identifier: coverage
                    });
                  } else {
                    subInputs[ui.nodes[j]._info.identifier.value] = ui.nodes[j].value;
                  }
                }
              }
              ui.processes[subId].configure({
                inputs: subInputs
              });
              inputs[key] = ui.processes[subId].output();
            } else if (values[key].indexOf('vector|') !== -1) {
              inputs[key] = new wps.process.localWFS({
                srsName: srsName,
                typeName: values[key].substring(values[key].indexOf('vector|')+7)
              });
            } else {
              coverage = values[key].substring(values[key].indexOf('raster|')+7);
              for (c=0, cc=ui.coverages.length; c<cc; ++c) {
                if (ui.coverages[c].name === coverage) {
                  lowerCorner = ui.coverages[c].lowerCorner;
                  upperCorner = ui.coverages[c].upperCorner;
                  break;
                }
              }
              inputs[key] = new wps.process.localWCS({
                lowerCorner: lowerCorner,
                upperCorner: upperCorner,
                identifier: coverage
              });
            }
          } else {
            inputs[key] = '' + values[key];
          }
        }
        process.execute({
          inputs: inputs,
          failure: function(exception) {
            // TODO show this in the debug tab instead
            $('#tab-results').html(exception);
            ui.activateTab('tab-results');
          },
          success: function(output) {
            if ($.isArray(output.result)) {
              $('#tab-results').html('<div id="map" style="width: 300px; height: 300px"></div>');
              ui.activateTab('tab-results');
              var source = new ol.source.Vector();
              var vector = new ol.layer.Vector({source: source, style: ui.outputStyle});
              var map = new ol.Map({
                target: 'map',
                layers: [
                  new ol.layer.Tile({
                    source: new ol.source.OSM()
                  }),
                  vector
                ],
                view: new ol.View({
                  center: [0, 0],
                  zoom: 1
                })
              });
              source.addFeatures(output.result);
              var view = map.getView();
              var extent = source.getExtent();
              if (extent[0] === extent[2]) {
                view.setCenter([extent[0], extent[1]]);
                view.setZoom(8);
              } else {
                view.fitExtent(
                  source.getExtent(), map.getSize());
              }
            } else {
              $('#tab-results').html(String(output.result));
              ui.activateTab('tab-results');
            }
          }
        });
      }
    }
  }
  if (!hasSelected) {
    // TODO replace with proper dialog
    alert('Please select a process node you want to execute');
  }
};

wps.ui.prototype.deleteSelection = function() {
  var selection = d3.selectAll(".node_selected");
  if (selection[0].length > 0) {
    var node = selection.datum();
    if (node.type === 'process') {
      if (this.inputMaps && this.inputMaps[node.id] && this.inputMaps[node.id].map) {
        this.inputMaps[node.id].map.setTarget(null);
        delete this.inputMaps[node.id].vector;
        delete this.inputMaps[node.id].source;
        delete this.inputMaps[node.id].draw;
        delete this.inputMaps[node.id].map;
      }
      $('#tab-inputs').html('');
      $('#tab-results').html('');
      this.nodes.splice(this.nodes.indexOf(node), 1);
      for (var i=this.nodes.length-1; i>=0; --i) {
        if (this.nodes[i]._parent === node.id) {
          this.nodes.splice(i, 1);
        }
      }
    }
    this.redraw();
  }
};

wps.ui.prototype.zoomIn = function(evt) {
  var me = evt.data;
  if (me.scaleFactor < 2) {
    me.scaleFactor += 0.1;
    me.redraw();
  }
};

wps.ui.prototype.zoomOut = function(evt) {
  var me = evt.data;
  if (me.scaleFactor > 0.3) {
    me.scaleFactor -= 0.1;
    me.redraw();
  }
};

wps.ui.prototype.resetZoom = function(evt) {
  var me = evt.data;
  me.scaleFactor = 1;
  me.redraw();
};

wps.ui.prototype.createZoomToolbar = function() {
  $('#btn-zoom-out').click(this, this.zoomOut);
  $('#btn-zoom-zero').click(this, this.resetZoom);
  $('#btn-zoom-in').click(this, this.zoomIn);
};

wps.ui.canvasMouseMove = function(ui) {
  var me = ui;
  me.mousePosition = d3.touches(this)[0]||d3.mouse(this);
  // MOVING
  if (me.mouseMode == 1) {
    var m = me.mousePosition;
    var d = (me.mouseOffset[0]-m[0])*(me.mouseOffset[0]-m[0]) + (me.mouseOffset[1]-m[1])*(me.mouseOffset[1]-m[1]);
    if (d > 2) {
      // MOVING_ACTIVE
      me.mouseMode = 3;
      me.clickElapsed = 0;
    }
  } else if (me.mouseMode == 3) {
    var mousePos = me.mousePosition;
    var minX = 0;
    var minY = 0;
    var n, node;
    for (n = 0; n<me.movingSet.length; n++) {
      node = me.movingSet[n];
      node.n.x = mousePos[0]+node.dx;
      node.n.y = mousePos[1]+node.dy;
      node.n.dirty = true;
      minX = Math.min(node.n.x-node.n.w/2-5,minX);
      minY = Math.min(node.n.y-node.n.h/2-5,minY);
    }
    if (minX !== 0 || minY !== 0) {
      for (n = 0; n<me.movingSet.length; n++) {
        node = me.movingSet[n];
        node.n.x -= minX;
        node.n.y -= minY;
      }
    }
  }
  me.redraw();
};

wps.ui.canvasMouseUp = function(ui) {
  var me = ui;
  if (me.mouseMode === 0 && me.mousedownLink === null) {
    me.clearSelection();
    me.updateSelection();
  }
  if (me.mouseMode == 3) {
    for (var i=0;i<me.movingSet.length;i++) {
      delete me.movingSet[i].ox;
      delete me.movingSet[i].oy;
    }
  }
  me.redraw();
  me.resetMouseVars();
};

wps.ui.canvasMouseDown = function(ui) {
  var me = ui;
  if (!me.mousedownNode && !me.mousedownLink) {
    me.selectedLink = null;
    me.updateSelection();
  }
};

wps.ui.prototype.resetMouseVars = function() {
  this.mousedownNode = null;
  this.mouseupNode = null;
  this.mousedownLink = null;
  this.mouseMode = 0;
  this.mousedownPortType = 0;
};

wps.ui.prototype.createCanvas = function() {
  this.outer = d3.select("#chart").
    append("svg:svg").
    attr("width", this.spaceWidth).
    attr("height", this.spaceHeight).
    attr("pointer-events", "all").
    style("cursor","crosshair");
  this.vis = this.outer.
    append('svg:g').
    on("dblclick.zoom", null).
    append('svg:g').
    on("mousedown", $.proxy(wps.ui.canvasMouseDown, null, this)).
    on("mouseup", $.proxy(wps.ui.canvasMouseUp, null, this)).
    on("mousemove", $.proxy(wps.ui.canvasMouseMove, null, this));
  var outer_background = this.vis.append('svg:rect').
    attr('width', this.spaceWidth).
    attr('height', this.spaceHeight).
    attr('fill','#fff');
};

wps.ui.prototype.createDropTarget = function() {
  var me = this;
  this.dropZone_.droppable({
    accept:".palette_node",
    drop: function( event, ui ) {
      d3.event = event;
      var selected_tool = $(ui.draggable[0]).data('type');
      var process = me.client_.getProcess('wpsgui', selected_tool, {callback: function(info) { 
        var mousePos = d3.touches(this)[0]||d3.mouse(this);
        mousePos[1] += this.scrollTop;
        mousePos[0] += this.scrollLeft;
        mousePos[1] /= me.scaleFactor;
        mousePos[0] /= me.scaleFactor;
        /* TODO no workspaces as yet, so z is 0 */
        var config = {
          x: mousePos[0],
          y:mousePos[1],
          w: this.nodeWidth,
          type: 'process',
          dirty: true,
          _info: info,
          inputs: info.dataInputs.input.length,
          outputs: info.processOutputs.output.length,
          label: selected_tool 
        };
        var nn = new wps.ui.node(config);
        // TODO maybe cache per process type?
        me.processes[nn.id] = process;
        var link, i, ii, delta = 50, span = delta * nn.inputs, deltaY = (span-delta)/2;
        for (i=0, ii=nn.inputs; i<ii; ++i) {
          var inputConfig = {
            x: mousePos[0]-200,
            y: mousePos[1]-deltaY,
            w: this.nodeWidth,
            outputs: 1,
            _parent: nn.id,
            dirty: true,
            type: 'input',
            _info: info.dataInputs.input[i],
            required: !(info.dataInputs.input[i].minOccurs === 0 && info.dataInputs.input[i].maxOccurs === 1),
            complete: false,
            label: info.dataInputs.input[i].title.value
          };
          var input = new wps.ui.node(inputConfig);
          deltaY -= delta;
          me.nodes.push(input);
          // create a link as well between input and process
          link = new wps.ui.link({
            source: input.id,
            target: nn.id,
            _parent: nn.id
          });
          me.nodes.push(link);
        }
        for (i=0, ii=nn.outputs; i<ii; ++i) {
          var outputConfig = {
            x: mousePos[0]+200,
            y: mousePos[1],
            w: this.nodeWidth,
            inputs: 1,
            dirty: true,
            type: 'output',
            _parent: nn.id,
            _info: info.processOutputs.output[i],
            label: info.processOutputs.output[i].title.value
          };
          var output = new wps.ui.node(outputConfig);
          me.nodes.push(output);
          // create a link as well between process and output
          link = new wps.ui.link({
            source: nn.id,
            _parent: nn.id,
            target: output.id
          });
          me.nodes.push(link);
        }
        me.nodes.push(nn);
        me.redraw();
      }, scope: this});
    }
  });
};

wps.ui.prototype.createLinkPaths = function() {
  var me = this;
  var link = this.vis.selectAll(".link").data(this.nodes.filter(function(d) { return d.source && d.target; }), function(d) { return d.source+":"+d.target;});
  var linkEnter = link.enter().insert("g",".node").attr("class","link");
  linkEnter.each(function(d,i) {
    var l = d3.select(this);
    l.append("svg:path").attr("class","link_background link_path");
    l.append("svg:path").attr("class","link_outline link_path");
    l.append("svg:path").attr("class","link_line link_path");
  });
  link.exit().remove();
  var links = this.vis.selectAll(".link_path");
  links.attr("d",function(d) {
    if (!d.source || !d.target) {
      return null;
    }
    var source, target;
    for (var i=0, ii=me.nodes.length; i<ii; ++i) {
      if (d.source === me.nodes[i].id) {
        source = me.nodes[i];
      }
      if (d.target === me.nodes[i].id) {
        target = me.nodes[i];
      }
    }
    var numOutputs = source.outputs || 1;
    var sourcePort = 0;
    var y = -((numOutputs-1)/2)*13 +13*sourcePort;
    var dy = target.y-(source.y+y);
    var dx = (target.x-target.w/2)-(source.x+source.w/2);
    var delta = Math.sqrt(dy*dy+dx*dx);
    var scale = me.lineCurveScale;
    var scaleY = 0;
    if (delta < me.nodeWidth) {
      scale = 0.75-0.75*((me.nodeWidth-delta)/me.nodeWidth);
    }
    if (dx < 0) {
      scale += 2*(Math.min(5*me.nodeWidth,Math.abs(dx))/(5*me.nodeWidth));
      if (Math.abs(dy) < 3*me.nodeHeight) {
        scaleY = ((dy>0)?0.5:-0.5)*(((3*me.nodeHeight)-Math.abs(dy))/(3*me.nodeHeight))*(Math.min(me.nodeWidth,Math.abs(dx))/(me.nodeWidth)) ;
      }
    }
    d.x1 = source.x+source.w/2;
    d.y1 = source.y+y;
    d.x2 = target.x-target.w/2;
    d.y2 = target.y;
    return "M "+(source.x+source.w/2)+" "+(source.y+y)+
      " C "+(source.x+source.w/2+scale*me.nodeWidth)+" "+(source.y+y+scaleY*me.nodeHeight)+" "+
      (target.x-target.w/2-scale*me.nodeWidth)+" "+(target.y-scaleY*me.nodeHeight)+" "+
      (target.x-target.w/2)+" "+target.y;
  });
};

wps.ui.prototype.redraw = function() {
  this.vis.attr("transform","scale(" + this.scaleFactor + ")");
  this.outer.attr("width", this.spaceWidth*this.scaleFactor).attr("height", this.spaceHeight*this.scaleFactor);
  var node = this.vis.selectAll(".nodegroup").data(this.nodes, function(d){ return d.id; });
  node.exit().remove();
  var nodeEnter = node.enter().insert("svg:g").attr("class", "node nodegroup");
  var me = this;
  nodeEnter.each(function(d,i) {
    if (d.label) {
      var node = d3.select(this);
      node.attr("id",d.id);
      var l = d.label;
      l = (typeof l === "function" ? l.call(d) : l)||"";
      d.w = Math.max(me.nodeWidth,me.calculateTextWidth(l)+(d.inputs>0?7:0) );
      d.h = Math.max(me.nodeHeight,(d.outputs||0) * 15);
      me.createProcessRect(node);
      var text = me.createProcessText(node, d);
      me.createInputLink(node, d, text);
    }
  });
  node.each(function(d,i) {
    me.updateNode.call(this, d);
  });
  this.createLinkPaths();
};

wps.ui.prototype.createInputLink = function(node, d, text) {
  if (d.inputs > 0) {
    text.attr("x",8);
    node.append("rect").attr("class","port port_input").attr("rx",3).attr("ry",3).attr("x",-5).attr("width",10).attr("height",10).
      attr("y", 10);
  }
};

wps.ui.prototype.calculateTextWidth = function(str) {
  var sp = document.createElement("span");
  sp.className = "node_label";
  sp.style.position = "absolute";
  sp.style.top = "-1000px";
  sp.innerHTML = (str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  document.body.appendChild(sp);
  var w = sp.offsetWidth;
  document.body.removeChild(sp);
  return 20+w;
};

wps.ui.prototype.updateNode = function(d) {
  // TODO check in what cases d.w or d.h are undefined
  if (d.dirty && d.w && d.h) {
    var thisNode = d3.select(this);
    thisNode.attr("transform", function(d) { return "translate(" + (d.x-d.w/2) + "," + (d.y-d.h/2) + ")"; });
    thisNode.selectAll(".node").
      attr("width",function(d){return d.w;}).
      attr("height",function(d){return d.h;}).
      classed("node_invalid", function(d) { return d.valid === false; }).
      classed("node_incomplete", function(d) { return !d.complete; }).
      classed("node_selected",function(d) { return d.selected; });
      thisNode.selectAll('text.node_label').text(function(d,i){
        return d.label || "";
      }).
        attr('y', function(d){return (d.h/2)-1;}).
        attr('class',function(d){
          return 'node_label'+
            (d.required === false ? ' node_label_italic' : '');
        });
      var numOutputs = d.outputs;
      var y = (d.h/2)-((numOutputs-1)/2)*13;
      d.ports = d.ports || d3.range(numOutputs);
      d._ports = thisNode.selectAll(".port_output").data(d.ports);
      d._ports.enter().append("rect").attr("class","port port_output").attr("rx",3).attr("ry",3).attr("width",10).attr("height",10);
      d._ports.exit().remove();
      if (d._ports) {
        numOutputs = d.outputs || 1;
        y = (d.h/2)-((numOutputs-1)/2)*13;
        var x = d.w - 5;
        d._ports.each(function(d,i) {
          var port = d3.select(this);
          port.attr("y",(y+13*i)-5).attr("x",x);
        });
      }
      d.dirty = false;
    }
};

wps.ui.prototype.clearSelection = function() {
  for (var i in this.movingSet) {
    var n = this.movingSet[i];
    n.n.dirty = true;
    n.n.selected = false;
  }
  this.movingSet = [];
  this.selectedLink = null;
};

wps.ui.nodeMouseUp = function(ui, d) {
  var me = ui;
  if (me.mousedownNode == d) {
    me.editor_.showEditForm(d);
    me.mouseMode = 5; // EDITING
    me.clickElapsed = 0;
    d3.event.stopPropagation();
    return;
  }
};

wps.ui.prototype.updateSelection = function() {
  if (this.mousedownNode) {
    if (this.inputMaps[this.mousedownNode._parent]) {
      this.inputMaps[this.mousedownNode._parent].vector.changed();
    }
  }
  // TODO?
};

wps.ui.nodeMouseDown = function(ui, d) {
  var me = ui;
  me.mousedownNode = d;
  var now = Date.now();
  me.clickElapsed = now-me.clickTime;
  me.clickTime = now;
  if (!d.selected) {
    me.clearSelection();
  }
  me.mousedownNode.selected = true;
  me.movingSet.push({n:me.mousedownNode});
  me.selectedLink = null;
  if (d3.event.button != 2) {
    // MOVING
    me.mouseMode = 1;
    var mouse = d3.touches(this)[0]||d3.mouse(this);
    mouse[0] += d.x-d.w/2;
    mouse[1] += d.y-d.h/2;
    for (var i in me.movingSet) {
      me.movingSet[i].ox = me.movingSet[i].n.x;
      me.movingSet[i].oy = me.movingSet[i].n.y;
      me.movingSet[i].dx = me.movingSet[i].n.x-mouse[0];
      me.movingSet[i].dy = me.movingSet[i].n.y-mouse[1];
    }
    me.mouseOffset = d3.mouse(document.body);
    if (isNaN(me.mouseOffset[0])) {
      me.mouseOffset = d3.touches(document.body)[0];
    }
  }
  d.dirty = true;
  me.updateSelection();
  me.redraw();
  d3.event.stopPropagation();
};

wps.ui.prototype.createProcessRect = function(node) {
  var mainRect = node.append("rect").
    attr("class", function(d) {
      return "node node_" + d.type + (!d.complete ? " node_incomplete" : "") + (d.required ? " node_required" : "");
    }).
    attr("rx", 6).
    attr("ry", 6).
    on("mouseup", $.proxy(wps.ui.nodeMouseUp, null, this)).
    on("mousedown", $.proxy(wps.ui.nodeMouseDown, null, this));
};

wps.ui.prototype.createProcessText = function(node, d) {
  var text = node.append('svg:text').attr('class','node_label').attr('x', 8).attr('dy', '.35em').attr('text-anchor','start');
  return text;
};

wps.ui.prototype.createSearch = function() {
  var filterChange = function() {
    var val = $("#palette-search-input").val();
    if (val === "") {
      $("#palette-search-clear").hide();
    } else {
      $("#palette-search-clear").show();
    }
    var re = new RegExp(val, 'i');
    $(".palette_node").each(function(i,el) {
      if (val === "" || re.test(el.innerHTML)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  };
  $("#palette-search-clear").on("click",function(e) {
    e.preventDefault();
    $("#palette-search-input").val("");
    filterChange();
    $("#palette-search-input").focus();
  });
  $("#palette-search-input").val("");
  $("#palette-search-input").on("keyup",function() {
    filterChange();
  });
  $("#palette-search-input").on("focus",function() {
    $("body").one("mousedown",function() {
      $("#palette-search-input").blur();
    });
  });
};

wps.ui.prototype.createProcessCategory = function(group) {
  var category = $('<div class="palette-category"><div class="palette-header">' +
    '<i class="glyphicon glyphicon-chevron-down expanded"></i><span>' +
    group + '</span></div></div>');
  this.parentContainer_.append(category);
  var content = $('<div class="palette-content"></div>');
  $(category).append(content);
  $(category).children('.palette-header').click(function(e) {
    $(this).next().slideToggle();
    $(this).children("i").toggleClass("expanded");
  });
  return content;
};

wps.ui.prototype.createProcess = function(process) {
  var offering = process.value;
  var summary = offering._abstract.value;
  var title = offering.title.value;
  var id = offering.identifier.value;
  var d = $('<div class="palette_node ui-draggable">' + id.split(':')[1] + '</div>');
  $(d).data('type', id);
  $(d).popover({
    title: title,
    placement:"right",
    trigger: "hover",
    delay: { show: 750, hide: 50 },
    html: true,
    container:'body',
    content: summary
  });
  $(d).draggable({
    helper: 'clone',
    appendTo: 'body',
    revert: true,
    revertDuration: 50
  });
  return d;
};

