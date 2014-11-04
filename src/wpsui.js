if (!window.wps) {
  window.wps = {};
}
var wps = window.wps;

wps.editor = function(ui) {
  this.ui_ = ui;
  this.WKT_ = new ol.format.WKT();
};

var extent = [-180, -90, 180, 90];

wps.backgroundLayer = new ol.layer.Tile({
  extent: extent,
  source: new ol.source.TileWMS({
    url: "/geoserver/wms",
    params: {
      'TILED': 'true',
      'VERSION': '1.1.1',
      'LAYERS': 'sf:NE2_HR_LC_SR_W',
      'FORMAT': 'image/png'
    }
  })
});

// apparently axis order is not what we expect when using WPS
var projection = new ol.proj.Projection({
  code: 'http://www.opengis.net/gml/srs/epsg.xml#4326',
  extent: extent,
  units: 'degrees',
  axisOrientation: 'enu'
});
ol.proj.addProjection(projection);

wps.mapSettings = {
  projection: 'EPSG:4326',
  center: [0, 0],
  extent: extent,
  zoom: 1,
  minZoom: 1
};

wps.editor.EMPTYTEXT = '<option value="" selected disabled>Select a value...</option>';
wps.editor.PREFIX = "node-input-";
wps.SUBPROCESS = 'process|';
wps.VECTORLAYER = 'vector|';
wps.RASTERLAYER = 'raster|';

wps.editor.prototype.addRasterLayer = function(id, node, value) {
  var mapId = node._parent;
  var values = value.split('|');
  var layer = values[1];
  var extent = new Array(4);
  for (var i=0, ii=this.ui_.coverages.length; i<ii; ++i) {
    var c = this.ui_.coverages[i];
    if (c.name === layer) {
      extent[0] = c.lowerCorner[0];
      extent[1] = c.lowerCorner[1];
      extent[2] = c.upperCorner[0];
      extent[3] = c.upperCorner[1];
      break;
    }
  }
  var map;
  if (this.ui_.inputMaps[mapId]) {
    map = this.ui_.inputMaps[mapId].map;
  } else {
    return;
  }
  if (!this.ui_.inputMaps[mapId].rasterWMS[id]) {
    this.ui_.inputMaps[mapId].rasterWMS[id] = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: '/geoserver/wms',
        params: {'LAYERS': layer},
        serverType: 'geoserver'
      })
    });
    map.getLayers().insertAt(map.getLayers().getLength()-1, this.ui_.inputMaps[mapId].rasterWMS[id]);
  } else {
    this.ui_.inputMaps[mapId].rasterWMS[id].getSource().updateParams({'LAYERS': layer});
  }
  map.getView().fitExtent(extent, map.getSize());
};

wps.editor.prototype.addVectorLayer = function(id, node, value) {
  var mapId = node._parent;
  var values = value.split('|');
  var layer = values[1];
  var extent = new Array(4);
  for (var i=0, ii=this.ui_.featureTypes.length; i<ii; ++i) {
    var ft = this.ui_.featureTypes[i];
    if (ft.name === layer) {
      extent[0] = ft.lowerCorner[0];
      extent[1] = ft.lowerCorner[1];
      extent[2] = ft.upperCorner[0];
      extent[3] = ft.upperCorner[1];
      break;
    }
  }
  var map = this.ui_.inputMaps[mapId].map;
  if (!this.ui_.inputMaps[mapId].vectorWMS[id]) {
    this.ui_.inputMaps[mapId].vectorWMS[id] = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: '/geoserver/wms',
        params: {'LAYERS': layer},
        serverType: 'geoserver'
      })
    });
    map.getLayers().insertAt(map.getLayers().getLength()-1, this.ui_.inputMaps[mapId].vectorWMS[id]);
  } else {
    this.ui_.inputMaps[mapId].vectorWMS[id].getSource().updateParams({'LAYERS': layer});
  }
  map.getView().fitExtent(extent, map.getSize());
};

wps.editor.prototype.setValue = function(geom, id, val, node) {
  var me = this, ui = this.ui_;
  if (node === undefined) {
    node = me.editingNode_;
  }
  var processId = node._parent;
  if (typeof id === "string" && id.indexOf('-txt') !== -1) {
    if (ui.inputMaps && ui.inputMaps[processId] && ui.inputMaps[processId].source) {
      var remove;
      ui.inputMaps[processId].source.forEachFeature(function(f) {
        if (f.get('node') === node.id) {
          remove = f;
        }
      });
      if (remove !== undefined) {
        ui.inputMaps[processId].source.removeFeature(remove);
      }
    }
  }
  var name = node._info.identifier.value;
  var formField;
  if (id) {
    formField = $('#' + id);
  } else {
    formField = $('#' + wps.editor.PREFIX + processId + '-' + name);
  }
  var value;
  node._geom = geom;
  if (geom !== true && formField.length > 0) {
    value = formField.val();
    if (typeof value === "string" && (value.indexOf(wps.VECTORLAYER) !== -1 || value.indexOf(wps.RASTERLAYER) !== -1)) {
      $('#bbox-filter-clear').parent().removeClass('disabled');
      $('#bbox-filter').parent().removeClass('disabled');
    } else {
      $('#bbox-filter-clear').parent().addClass('disabled');
      $('#bbox-filter').parent().addClass('disabled');
    }
    if (typeof value === "string" && value.indexOf(wps.VECTORLAYER) !== -1) {
      this.addVectorLayer(id, node, value);
    }
    if (typeof value === "string" && value.indexOf(wps.RASTERLAYER) !== -1) {
      this.addRasterLayer(id, node, value);
    }
    if (typeof id === "string" && id.indexOf('-txt') !== -1) {
      if (typeof value === "string" && value.indexOf('>') !== -1) {
        value = $.parseXML(value);
      }
    }
    if (typeof value === "string" && value.indexOf(wps.VECTORLAYER) !== -1) {
      // check if node has a BBOX filter on it
      if (node.value && node.value.split('|').length === 3) {
        node.value = value + '|' + node.value.split('|')[2];
      }  else {
        node.value = value;
      }
    } else {
      node.value = value;
    }
  } else if (node._info.boundingBoxData) {
    node.value = val;
  } else if (id === false) {
    node.value = val;
  }
  ui.afterSetValue(node);
};

wps.editor.prototype.validateNodeProperty = function(info, value) {
  if (info.literalData) {
    if (info.literalData.dataType) {
      var dataType = info.literalData.dataType.value;
      if (dataType === 'xs:double') {
        return (value.match(/^-?\d*(\.\d+)?$/) !== null);
      } else if (dataType === 'xs:int') {
        return value.length > 0 && (Math.floor(value) == value);
      } else if (dataType === 'xs:boolean') {
        return (value === "true" || value === "false");
      } else {
        return true;
      }
    } else if (info.literalData.anyValue) {
      return value.length > 0;
    } else if (info.literalData.allowedValues) {
      return value !== null;
    }
  } else if (info.boundingBoxData) {
    var valid = false;
    valid = value.length === 4 && !isNaN(parseFloat(value[0])) &&
      !isNaN(parseFloat(value[1])) && !isNaN(parseFloat(value[2])) &&
      !isNaN(parseFloat(value[3])) && parseFloat(value[0]) < parseFloat(value[2]) &&
      parseFloat(value[1]) < parseFloat(value[3]);
    return valid;
  }
  return true;
};

wps.editor.prototype.showEditForm = function(node) {
  if (node['type'] !== 'input' || (typeof node.value === "string" && node.value.indexOf(wps.SUBPROCESS) !== -1)) {
    return;
  }
  this.editingNode_ = node;

  // begin form
  var html = '<form class="form-horizontal">';
  var hasMap = false, bboxTool = false, i, ii;
  // simple input
  var name = node._info.identifier.value;
  var nameText = name;
  if (node.required !== true) {
    nameText += ' (optional)';
  }
  var pId, id = wps.editor.PREFIX + node._parent + '-' + name.replace(/ /g, '_');
  var saveButton = '<div class="form-row input-validate"><button type="button" class="btn btn-success btn-sm" id="input-save" onclick="window.wpsui.checkInput(\'' + node.id + '\',\'' + name + '\',\'' + id + '\')">Save</button>';
  var selected;

  html += '<div class="form-row-abstract">' + node._info._abstract.value + '</div>';
  if (node._info.literalData) {
    html += '<div class="form-row">';
    html += '<label for="' + id + '">' + nameText + '</label></div>';

    if (node._info.literalData.allowedValues) {
      html += '<select class="form-control input-sm" style="width: 70%;" id="' + id + '">';
      html += wps.editor.EMPTYTEXT;

      for (i=0, ii=node._info.literalData.allowedValues.valueOrRange.length; i<ii; ++i) {
        var key = node._info.literalData.allowedValues.valueOrRange[i].value;
        selected = (node.value === key) ? 'selected' : '';
        html += '<option ' + selected + ' value="'+key+'">'+key+'</option>';
      }
      html += '</select>';
    } else if (node._info.literalData.dataType && node._info.literalData.dataType.value === 'xs:boolean') {
      html += '<select  class="form-control input-sm" style="width: 70% !important;" id="' + id + '">';
      html += wps.editor.EMPTYTEXT;
      selected = (node.value === "false") ? 'selected' : '';
      html += '<option ' + selected + ' value="'+false+'">False</option>';
      selected = (node.value === "true") ? 'selected' : '';
      html += '<option ' + selected + ' value="'+true+'">True</option>';
      html += '</select>';
    } else {
      var value = node.value;
      value = (value === undefined) ? '' : value;
      html += '<div class="form-row" id="' + name + '-field">';
      html += '<input type="text" id="' + id + '" value="' + value + '" class="form-control input-sm"></div>';
    }
    html += saveButton;
    if (node._info.maxOccurs > 1 && node._info.maxOccurs > node._info.minOccurs) {
      html += '<button type="button" class="btn btn-default btn-sm" id="add-geoms" onclick="window.wpsui.createExtraInputNode()">+ 1 ' + name +'</button>';
    }
    html += '</div>'; // saveButton's div
  } else if (node._info.complexData) {
    // create input fields for geoms

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

    // Tabs for WKT/GML text vs. map
    if (rasterLayer === false) {
      html += '<ul class="nav nav-pills nav-justified text-or-map" role="tablist"><li class="active"><a href="#map-input" role="tab" data-toggle="tab">via Map</a></li><li><a href="#text-input" role="tab" data-toggle="tab">via Text</a></li></ul>';
      html += '<div class="tab-content"><div class="tab-pane fade in" id="text-input">';
    }
    html += '<div class="form-row"><label for="' + id + '">' + nameText + '</label>';
    if (rasterLayer === false) {
      // Optional: add more inputs if process allows
      if (node._info.maxOccurs > 1 && node._info.maxOccurs > node._info.minOccurs) {
        html += '<button type="button" class="btn btn-default btn-sm" id="add-geoms" onclick="window.wpsui.createExtraInputNode()">+ 1 geom</button>';
      }
    }
    html += '</div>';

    value = (node._geom === true || node.value === undefined || (typeof node.value === "string" && node.value.indexOf(wps.VECTORLAYER) !== -1)) ? '' : node.value;
    if (rasterLayer === false) {
      html += '<div class="form-row" id="' + name + '-field">';
      if ($.isXMLDoc(value)) {
        value = wps.htmlEncode((new XMLSerializer()).serializeToString(value));
      }
      html += '<input type="text" placeholder="WKT or GML" id="' + id + '-txt" value="' + value + '" class="form-control input-sm"></div>';
      // update the id with '-txt'
      saveButton = '<div class="form-row input-validate"><button type="button" class="btn btn-success btn-sm" id="input-save" onclick="window.wpsui.checkInput(\'' + node.id + '\',\'' + name + '\',\'' + id + '-txt' + '\')">Save</button></div>';
      html += saveButton;
      // end tab-pane, begin map-pane
      html += '</div><div class="tab-pane active" id="map-input">';
      html += '<div class="form-row"><label for="' + id + '">' + nameText + '</label>';
      if (node._info.maxOccurs > 1  && node._info.maxOccurs > node._info.minOccurs) {
        html += '<button type="button" class="btn btn-default btn-sm" id="add-geoms" onclick="window.wpsui.createExtraInputNode()">+ 1 geom</button>';
      }
      html += '</div>';
    }
    var prefix, values;
    if (rasterLayer === true) {
      html += '<p class="form-row"><p><small>Select from existing:</small></p>';
      html += '<select class="form-control input-sm" style="width: 60%;margin-bottom: 5px;" id="' + id + '">';
      html += wps.editor.EMPTYTEXT;
      prefix = wps.RASTERLAYER;
      values = node.value ? node.value.split('|') : [];
      for (i=0, ii=this.ui_.coverages.length; i<ii; ++i) {
        var coverage = this.ui_.coverages[i].name;
        selected = (values.length > 1 && values[1] === coverage) ? 'selected' : '';
        html += '<option ' + selected + ' value="' + prefix + coverage + '">' + coverage + "</option>";
      }
      html += "</select>";
      html += saveButton;
      if (node._info.maxOccurs > 1  && node._info.maxOccurs > node._info.minOccurs) {
        html += '<button type="button" class="btn btn-default btn-sm" id="add-geoms" onclick="window.wpsui.createExtraInputNode()">+ 1 ' + name +'</button>';
      }
      html += '</div>'; // saveButton's div
    }
    else if (vectorLayer === true && this.ui_.featureTypes) {
      html += '<p class="form-row"><small>Select from existing:</small></p>';
      html += '<select class="form-control input-sm" style="width: 60%;margin-bottom: 5px;" id="' + id + '-map">';
      html += wps.editor.EMPTYTEXT;
      prefix = wps.VECTORLAYER;
      values = node.value ? node.value.split('|') : [];
      for (i=0, ii=this.ui_.featureTypes.length; i<ii; ++i) {
        var featureType = this.ui_.featureTypes[i].name;
        selected = (values.length > 1 && values[1] === featureType) ? 'selected' : '';
        html += '<option ' + selected + ' value="' + prefix + featureType + '">' + featureType + "</option>";
      }
      html += "</select>";
      // update the id with '-map'
      saveButton = '<div class="form-row input-validate"><button type="button" class="btn btn-success btn-sm" id="input-save" onclick="window.wpsui.checkInput(\'' + node.id + '\',\'' + name + '\',\'' + id + '-map' + '\')">Save</button></div>';
      html += saveButton;
    }
    hasMap = true;
    id = "input-map-" + node._parent;
    html += '<div id="' + id + '" class="input-map"></div>';
    if (!rasterLayer && !vectorLayer) {
      html += '<div class="btn-group btn-group-map">';
      html += '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">';
      html += 'Draw <span class="caret"></span>';
      html += '</button>';
      html += '<ul class="dropdown-menu" role="menu">';
      if (rasterLayer !== true) {
        html += '<li role="presentation"><a id="draw-polygon" href="#">Draw Polygon</a></li>';
        html += '<li role="presentation"><a id="draw-line" href="#">Draw LineString</a></li>';
        html += '<li role="presentation"><a id="draw-point" href="#">Draw Point</a></li>';
      }
      html += '</ul>';
      html += '</div>';
    } else {
      html += '<p class="form-row"><p><small>For Filter by BBOX, use the SHIFT key to draw a box.</small></p>';
      html += '<p class="form-row"><p><small>You first need to pick a layer and press Save.</small></p>';
      html += '<div class="btn-group btn-group-map">';
      html += '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">';
      html += 'Filter <span class="caret"></span>';
      html += '</button>';
      html += '<ul class="dropdown-menu" role="menu">';
      var disabled = '';
      if (!(typeof node.value === 'string' && node.value.split('|').length >= 2)) {
        disabled = 'class="disabled"';
      }
      html += '<li role="presentation" ' + disabled + '><a id="bbox-filter" href="#">Filter by BBOX</a></li>';
      html += '<li role="presentation" ' + disabled + '><a id="bbox-filter-clear" href="#">Clear BBOX filter</a></li>';
      html += '</ul>';
      html += '</div>';
    }
    html += '</div></div>'; // end map-pane, tab-content
  } else if (node._info.boundingBoxData) {

    bboxTool = true;
    hasMap = true;
    id = "input-map-" + node._parent;

    html += '<ul class="nav nav-pills nav-justified text-or-map" role="tablist"><li class="active"><a href="#map-input" role="tab" data-toggle="tab">via Map</a></li><li><a href="#text-input" role="tab" data-toggle="tab">via Text</a></li></ul>';
    html += '<div class="tab-content"><div class="tab-pane fade in" id="text-input">';
    html += '<div class="form-row"><label for="' + id + '">' + nameText + '</label>';
    html += '</div>';
    html += '<p class="form-row"><small>Provide bounding box in <b>EPSG:4326</b></small></p>';
    html += '<div class="form-row" id="' + name + '-field">';
    var pref = wps.editor.PREFIX + node.id + '-' + name;
    html += '<label for="' + pref + '-minx' + '">min x</label>';
    var minx = '', miny = '', maxx = '', maxy = '';
    if (node._geom !== true && node.value) {
      minx = node.value[0];
      miny = node.value[1];
      maxx = node.value[2];
      maxy = node.value[3];
    }
    html += '<input type="text" value="' + minx + '" id="' + pref + '-minx' +'" class="form-control input-sm">';
    html += '<label for="' + pref + '-miny' + '">min y</label>';
    html += '<input type="text" value="' + miny + '" id="' + pref + '-miny' +'" class="form-control input-sm">';
    html += '<label for="' + pref + '-maxx' + '">max x</label>';
    html += '<input type="text" value="' + maxx +  '" id="' + pref + '-maxx' +'" class="form-control input-sm">';
    html += '<label for="' + pref + '-maxy' + '">max y</label>';
    html += '<input type="text" value="' + maxy + '" id="' + pref + '-maxy' +'" class="form-control input-sm">';
    html += '</div>';
    // update the id with '-txt'
    saveButton = '<div class="form-row input-validate"><button type="button" class="btn btn-success btn-sm" id="input-save" onclick="window.wpsui.checkInput(\'' + node.id + '\',\'' + name + '\',\'' + id + '-txt' + '\')">Save</button>';
    html += saveButton;
    html += '</div>'; // saveButton's div

    html += '</div><div class="tab-pane active" id="map-input">';
    html += '<div class="form-row"><label for="' + id + '">' + nameText + '</label></div>';
    html += '<p class="form-row"><p><small>Use the SHIFT key to draw a box.</small></p>';
    html += '<div class="input-map" id="' + id + '"></div>';
    html += '</div></div>';

  }
  html += '</form>';
  // we need to remove any input map div if we had one before, otherwise the map won't render again
  $('.input-map').detach();
  $('#tab-inputs').html(html);
  this.ui_.activateTab('tab-inputs');
  var me = this;
  if (hasMap === true) {
    var map;
    var mapId = node._parent;
    if (!this.ui_.inputMaps[mapId]) {
      this.ui_.inputMaps[mapId] = {};
      this.ui_.inputMaps[mapId].vectorWMS = {};
      this.ui_.inputMaps[mapId].rasterWMS = {};
      this.ui_.inputMaps[mapId].source = new ol.source.Vector();
      this.ui_.inputMaps[mapId].vector = new ol.layer.Vector({source: this.ui_.inputMaps[mapId].source, style: function(feature) {
        var selection = d3.selectAll(".node_selected");
        if (selection[0].length > 0) {
          var node = selection.datum();
          if (feature.get('node') === node.id) {
            return [
              new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 5,
                  fill: new ol.style.Fill({
                    color: 'orange'
                  })
                }),
                stroke: new ol.style.Stroke({
                  color: 'orange',
                  width: 1
                })
              })
            ];
          } else {
            return [
              new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 5,
                  fill: new ol.style.Fill({
                    color: 'gray'
                  })
                }),
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
          wps.backgroundLayer,
          this.ui_.inputMaps[mapId].vector
        ],
        view: new ol.View(wps.mapSettings)
      });
      this.ui_.inputMaps[mapId].dragBox = new ol.interaction.DragBox({
        condition: ol.events.condition.shiftKeyOnly,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: [0, 0, 255, 1]
          })
        })
      });
      this.ui_.inputMaps[mapId].map.addInteraction(this.ui_.inputMaps[mapId].dragBox);
      this.ui_.inputMaps[mapId].dragBox.on('boxend', function(e) {
        me.ui_.inputMaps[mapId].source.clear();
        var f = new ol.Feature();
        f.set('node', node.id);
        var name = node._info.identifier.value;
        $('.form-row.input-validate').children('span').remove();
        $('#' + wps.editor.PREFIX + node.id + '-' + name + '-minx').val('');
        $('#' + wps.editor.PREFIX + node.id + '-' + name + '-miny').val('');
        $('#' + wps.editor.PREFIX + node.id + '-' + name + '-maxx').val('');
        $('#' + wps.editor.PREFIX + node.id + '-' + name + '-maxy').val('');
        var geom = me.ui_.inputMaps[mapId].dragBox.getGeometry();
        f.setGeometry(geom);
        me.ui_.inputMaps[mapId].source.addFeatures([f]);
        me.editingNode_.value = geom.getExtent();
        me.ui_.afterSetValue(me.editingNode_);
        node._geom = true;
      });
      map = this.ui_.inputMaps[mapId].map;
    } else {
      map = this.ui_.inputMaps[mapId].map;
      map.set('target', 'input-map-' + mapId);
    }
    if (typeof node.value === "string" && node.value.indexOf('|') === -1 && node._geom !== false) {
      var hasFeature = false;
      this.ui_.inputMaps[mapId].source.forEachFeature(function(f) {
        if (f.get('node') === node.id) {
          hasFeature = true;
        }
      });
      if (hasFeature === false) {
        var features = this.WKT_.readFeatures(node.value);
        for (var j=0, jj=features.length; j<jj; ++j) {
          features[j].set('node', node.id);
        }
        this.ui_.inputMaps[mapId].source.addFeatures(features);
      }
    }
    if (typeof node.value === "string" && (node.value.indexOf(wps.VECTORLAYER) !== -1 || node.value.indexOf(wps.RASTERLAYER) !== -1)) {
      values = node.value.split('|');
      if (node.value.indexOf(wps.VECTORLAYER) !== -1) {
        me.addVectorLayer('node-input-' + node._parent + '-features-map', node, node.value);
      }
      if (node.value.indexOf(wps.RASTERLAYER) !== -1) {
        me.addRasterLayer('node-input-' + node._parent + '-features-map', node, node.value);
      }
      if (values.length === 3) {
        var bbox = values[2].split(',').map(parseFloat);
        var f = new ol.Feature();
        f.set('node', node.id);
        var geom = new ol.geom.Polygon([[[bbox[0], bbox[1]], [bbox[0], bbox[3]], [bbox[2], bbox[3]], [bbox[2], bbox[1]], [bbox[0], bbox[1]]]]);
        f.setGeometry(geom);
        me.ui_.inputMaps[mapId].source.addFeatures([f]);
      }
    }
    var drawEnd = function(evt) {
      var selection = d3.selectAll(".node_selected");
      if (selection[0].length > 0) {
        var node = selection.datum();
        // check if there is a WKT/GML input
        var name = node._info.identifier.value;
        var id = wps.editor.PREFIX + node._parent + '-' + name.replace(/ /g, '_');
        $('#' + id + '-txt').val('');
        var remove;
        this.ui_.inputMaps[mapId].source.forEachFeature(function(f) {
          if (f.get('node') === node.id) {
            remove = f;
          }
        });
        if (remove !== undefined) {
          this.ui_.inputMaps[mapId].source.removeFeature(remove);
        }
        evt.feature.set('node', node.id);
        node.value = this.WKT_.writeFeatures([evt.feature]);
        node.valid = evt.feature;
        if (node.valid) {
          this.setValue(true);
        }
      }
    };
    var drawStart = function(evt) {
      var selection = d3.selectAll(".node_selected");
      if (selection[0].length > 0) {
        var node = selection.datum();
        var deletes = [];
        this.ui_.inputMaps[mapId].source.forEachFeature(function(f) {
          if (f.get('node') === node.id) {
            deletes.push(f);
          }
        }, this);
        for (var i=0, ii=deletes.length; i<ii; ++i) {
          this.ui_.inputMaps[mapId].source.removeFeature(deletes[i]);
        }
      }
    };
    var addInteraction = function(geomType) {
      if (me.ui_.inputMaps[mapId].draw) {
        me.ui_.inputMaps[mapId].map.removeInteraction(me.ui_.inputMaps[mapId].draw);
      }
      if (geomType !== 'BBOX') {
        me.ui_.inputMaps[mapId].draw = new ol.interaction.Draw({
          source: me.ui_.inputMaps[mapId].source,
          type: geomType
        });
      } else {
        me.ui_.inputMaps[mapId].draw = new ol.interaction.DragBox({
          condition: ol.events.condition.shiftKeyOnly,
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: [0, 0, 255, 1]
            })
          })
        });
      }
      me.ui_.inputMaps[mapId].map.addInteraction(me.ui_.inputMaps[mapId].draw);
      if (geomType !== 'BBOX') {
        if (geomType !== 'Point') {
          me.ui_.inputMaps[mapId].draw.on('drawstart', drawStart, me);
        }
        me.ui_.inputMaps[mapId].draw.on('drawend', drawEnd, me);
      } else {
        me.ui_.inputMaps[mapId].draw.on('boxend', function(e) {
          var deletes = [];
          me.ui_.inputMaps[mapId].source.forEachFeature(function(f) {
            if (f.get('node') === node.id) {
              deletes.push(f);
            }
          }, this);
          for (var i=0, ii=deletes.length; i<ii; ++i) {
            me.ui_.inputMaps[mapId].source.removeFeature(deletes[i]);
          }
          var f = new ol.Feature();
          f.set('node', node.id);
          var geom = me.ui_.inputMaps[mapId].draw.getGeometry();
          f.setGeometry(geom);
          me.ui_.inputMaps[mapId].source.addFeatures([f]);
          var values = node.value.split('|');
          node.value = values[0] + '|' + values[1] + '|' + geom.getExtent().toString(',');
        });
      }
    };
    $('#draw-polygon').click(function() {
      addInteraction('Polygon');
    });
    $('#draw-line').click(function() {
      addInteraction('LineString');
    });
    $('#draw-point').click(function() {
      addInteraction('Point');
    });
    $('#bbox-filter').click(function() {
      addInteraction('BBOX');
    });
    $('#bbox-filter-clear').click(function() {
     var selection = d3.selectAll(".node_selected");
      if (selection[0].length > 0) {
        var node = selection.datum();
        var deletes = [];
        me.ui_.inputMaps[mapId].source.forEachFeature(function(f) {
          if (f.get('node') === node.id) {
            deletes.push(f);
          }
        }, this);
        for (var i=0, ii=deletes.length; i<ii; ++i) {
          me.ui_.inputMaps[mapId].source.removeFeature(deletes[i]);
        }
        var values = node.value.split('|');
        node.value = values[0] + '|' + values[1];
      }
    });
    this.ui_.inputMaps[mapId].dragBox.setActive(bboxTool);
    if (this.ui_.inputMaps[mapId].draw) {
      this.ui_.inputMaps[mapId].draw.setActive(!bboxTool && !rasterLayer && !vectorLayer);
    }
  }
};

wps.ui = function(options) {
  $(document).ready(function() {
    $('#btn-run-process').css('right', $(document).width()-$('#sidebar').position().left);
    $('#btn-run-process').css('display', 'block');
  });
  var me = this;
  this.parentContainer_ = options.parentContainer;
  this.dropZone_ = options.dropZone;
  this.client_ = options.client;
  this.defaultServer_ = options.defaultServer;
  if (options.getVectorLayers === true) {
    this.client_.getFeatureTypes(this.defaultServer_, function(featureTypes) {
      me.featureTypes = featureTypes;
    });
    this.client_.getCoverages(this.defaultServer_, function(coverages) {
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
  this.mousedownLink = null;
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
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 1
    })
  });
  $('#btn-help').click(this.showHelp);
  $('#btn-clear').click($.proxy(this.clear, null, this));
  $('#btn-run-process').click($.proxy(this.execute, null, this));
  d3.select(window).on("keydown",function() {
    if (d3.event.target == document.body || d3.event.target instanceof SVGElement) {
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
  this.subprocess = (options.subprocess !== undefined) ? options.subprocess : false;
};

wps.ui.link.prototype.getState = function() {
  return {
    source: this.source,
    target: this.target,
    _parent: this._parent,
    subprocess: this.subprocess
  };
};

wps.ui.node = function(options) {
  // generate an identifier
  this.id = options.id || (1+Math.random()*4294967295).toString(16).replace('.', '_');
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
  this.complete = options.complete === undefined ? false : options.complete;
  var value;
  if (typeof options.value === "string" && options.value.indexOf('<') !== -1) {
    value = $.parseXML(options.value);
  } else {
    value = options.value;
  }
  this.value = value;
  // was this node created by drawing or by text?
  this._geom = options._geom;
};

wps.ui.node.prototype.getState = function() {
  var value;
  if ($.isXMLDoc(this.value)) {
    value = new XMLSerializer().serializeToString(this.value);
  } else {
    value = this.value;
  }
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
    _geom: this._geom,
    required: this.required,
    complete: this.complete,
    dirty: true,
    value: value
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
        var process = ui.client_.getProcess(ui.defaultServer_, node._info.identifier.value, {callback: $.proxy(function(id) {
          ui.processes[id] = this;
        }, null, node.id)});
      }
    }
    ui.redraw();
  }
};

wps.ui.prototype.findNodeById = function(id) {
  var node = null;
  for (var i=0, ii=this.nodes.length; i<ii; ++i) {
   var n = this.nodes[i];
   if (n.id === id) {
     node = n;
     break;
   }
  }
  return node;
};

wps.ui.prototype.recurse = function(node) {
  var values = [], i, ii;
  for (i=0, ii=this.nodes.length; i<ii; ++i) {
    var n = this.nodes[i];
    if (n.value === wps.SUBPROCESS + node.id) {
      var value = this.findNodeById(n._parent);
      if (value !== null) { 
        values.push(value);
      }
      n.complete = node.complete;
      n.dirty = true;
      this.parentComplete(n);
    }
  }
  for (i=0, ii=values.length; i<ii; ++i) {
    this.recurse(values[i]);
  }
};

wps.ui.prototype.parentComplete = function(node) {
  var processId = node._parent;
  var process = this.processes[processId], parentNode;
  var values = {};
  for (var i=0, ii=this.nodes.length; i<ii; ++i) {
    var n = this.nodes[i];
    if (n.type === "input" && n.value !== undefined && n._parent === processId) {
      if (typeof n.value === "string" && n.value.indexOf(wps.SUBPROCESS) !== -1) {
        values[n._info.identifier.value] = n.complete ? n.value : undefined;
      } else {
        values[n._info.identifier.value] = n.value;
      }
    }
    if (n.id === processId) {
      parentNode = n;
    }
  }
  var old = parentNode.complete;
  parentNode.complete = process.isComplete(values);
  parentNode.dirty = (old !== parentNode.complete);
  return parentNode;
};

wps.ui.prototype.afterSetValue = function(node) {
  var processId = node._parent;
  node.dirty = true;
  var i, ii, n;
  if (typeof node.value === "string" && node.value.indexOf(wps.SUBPROCESS) !== -1) {
    var id = node.value.substring(node.value.indexOf(wps.SUBPROCESS)+8);
    for (i=0, ii=this.nodes.length; i<ii; ++i) {
      n = this.nodes[i];
      if (n.id === id) {
        node.complete = n.complete;
      }
    }
  } else {
    node.complete = (node.value !== undefined);
  }
  // check if the process is complete as well
  var parentNode = this.parentComplete(node);
  if (parentNode.dirty) {
    this.recurse(parentNode);
  }
  this.redraw();
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
  html += '<div class="form-tips"> Select the text above and copy to the clipboard.</div>';
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

wps.ui.prototype.checkInput = function(nodeId, name, id) {
  var i, ii;
  var node = this.findNodeById(nodeId);
  var valid = node.valid;
  var value;
  var nodeEl = $('#' + id);
  if (node._info.boundingBoxData) {
    value = [
      $('#' + wps.editor.PREFIX + node.id + '-' + name + '-minx').val(),
      $('#' + wps.editor.PREFIX + node.id + '-' + name + '-miny').val(),
      $('#' + wps.editor.PREFIX + node.id + '-' + name + '-maxx').val(),
      $('#' + wps.editor.PREFIX + node.id + '-' + name + '-maxy').val()
    ];    
  } else {
    value = nodeEl.val();
  }
  if (node._info.complexData !== undefined) {
    node.valid = (value !== null);
  } else {
    node.valid = this.editor_.validateNodeProperty(node._info, value);
  }
  if (valid !== node.valid) {
    node.dirty = true;
    this.redraw();
  }
  if (!node.valid) {
    $('.form-row.input-validate').children('span').remove();
    $(".input-validate").prepend('<span><span class="glyphicon glyphicon-remove"></span> Invalid input</span>');
    $("#" + name + "-field").removeClass("has-success");
    $("#" + name + "-field").addClass("has-error");
    // find parent node and mark it as not complete
    for (i=0, ii=this.nodes.length; i<ii; ++i) {
      if (this.nodes[i].id === node._parent) {
        this.nodes[i].complete = false;
        this.nodes[i].dirty = true;
        this.redraw();
        break;
      }
    }
  } else {
    $('.form-row.input-validate').children('span').remove();
    $(".input-validate").prepend('<span><span class="glyphicon glyphicon-ok"></span> Valid input</span>');
    $("#" + name + "-field").removeClass("has-error");
    $("#" + name + "-field").addClass("has-success");
    this.editor_.setValue(false, id, value);
  }

  // Finally add listeners in case field changes
  var _this = this;
  nodeEl.keyup(function(event) {
    $('.form-row.input-validate').children('span').remove();
    // find node and mark it as not complete
    for (i=0, ii=_this.nodes.length; i<ii; ++i) {
      if (_this.nodes[i].id === node.id) {
        _this.nodes[i].complete = false;
        _this.nodes[i].dirty = true;
        _this.redraw();
        break;
      }
    }
  });
  // try select dropdown
  nodeEl.change(function() {
    $('.form-row.input-validate').children('span').remove();
    // find node and mark it as not complete
    for (i=0, ii=_this.nodes.length; i<ii; ++i) {
      if (_this.nodes[i].id === node.id) {
        _this.nodes[i].complete = false;
        _this.nodes[i].dirty = true;
        _this.redraw();
        break;
      }
    }
  });


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

wps.ui.prototype.resizeMaps = function() {
  var me = this;
  for (var key in me.inputMaps) {
    me.inputMaps[key].map.updateSize();
  }
  if (me.outputMap && me.outputMap.map) {
    me.outputMap.map.updateSize();
  }
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
      me.resizeMaps();
      me.resizeTabs();
      $('#btn-run-process').css('right', $(document).width()-$('#sidebar').position().left);
    },
    stop:function(event,ui) {
      $("#sidebar-separator").css("left","auto");
      $("#sidebar-separator").css("right",($("#sidebar").width()+13)+"px");
    }
  });
};

wps.ui.prototype.activateTab = function(link, ul, contentDiv) {
  if (ul === undefined) {
    ul = $('#sidebar-tabs');
  }
  if (contentDiv === undefined) {
    contentDiv = $('#sidebar-content');
  }
  if (contentDiv.get(0).id === 'workspace-content') {
    if (link.html() === 'XML') {
      $('#chart-zoom-controls').hide();
    } else {
      $('#chart-zoom-controls').show();
    }
  }
  if (typeof link === "string") {
    link = ul.find("a[href='#"+link+"']");
  }
  if (!link.parent().hasClass("active")) {
    ul.children().removeClass("active");
    link.parent().addClass("active");
  }
  contentDiv.children().hide();
  var tab = link.attr('href');
  $(tab).show();
};

wps.ui.prototype.initializeTabs = function() {
  var ul = $('#sidebar-tabs');
  var me = this;
  var onTabClick = function(ul, contentDiv) {
    me.activateTab($(this), ul, contentDiv);
    return false;
  };
  ul.find("li.red-ui-tab a").on("click", $.proxy(onTabClick, null, ul, $('#sidebar-content')));
  ul = $('#workspace-tabs');
  ul.find("li.red-ui-tab a").on("click", $.proxy(onTabClick, null, ul, $('#workspace-content')));
};

// get the input values for a process
wps.ui.prototype.getInputs = function(processId) {
  var values = {};
  for (var i=0, ii=this.nodes.length; i<ii; ++i) {
    var n = this.nodes[i];
    if (n.type === 'input' && n._parent === processId) {
      if (n._info.maxOccurs > 1) {
        if (values[n._info.identifier.value] === undefined) {
          values[n._info.identifier.value] = [];
        }
        values[n._info.identifier.value].push(n.value);
      } else {
        values[n._info.identifier.value] = n.value;
      }
    }
  }
  return values;
};

wps.ui.prototype.getInputNodes = function(processId) {
  var result = [];
  for (var i=0, ii=this.nodes.length; i<ii; ++i) {
    var n = this.nodes[i];
    if (n.type === 'input' && n._parent === processId) {
      result.push(n);
    }
  }
  return result;
};

wps.ui.prototype.getOutputNodes = function(processId) {
  var result = [];
  for (var i=0, ii=this.nodes.length; i<ii; ++i) {
    var n = this.nodes[i];
    if (n.type === 'output' && n._parent === processId) {
      result.push(n);
    }
  }
  return result;
};

wps.ui.prototype.getAllNodes = function(processId) {
  var result = [];
  for (var i=0, ii=this.nodes.length; i<ii; ++i) {
    var n = this.nodes[i];
    if ((n.type === 'output' || n.type === 'input') && n._parent === processId) {
      result.push(n);
    }
  }
  return result;
};

// get a list of processes that this process depends on
wps.ui.prototype.getDependsOnAlgorithms = function(processId, deps) {
  if (!deps) {
    deps = [];
  }
  var values = this.getInputs(processId);
  for (var key in values) {
    if (typeof values[key] === 'string' && values[key].indexOf(wps.SUBPROCESS) !== -1) {
      var subId = values[key].substring(values[key].indexOf(wps.SUBPROCESS) + 8);
      deps.push(subId);
      this.getDependsOnAlgorithms(subId, deps);
    }
  }
  return deps;
};

wps.ui.prototype.handleLocal = function(value) {
  var values, bbox;
  if (typeof value === "string" && value.indexOf(wps.VECTORLAYER) !== -1) {
    values = value.split('|');
    var typeName = values[1];
    bbox = values.length === 3 ? values[2] : undefined;
    return new wps.process.localWFS({
      srsName: 'EPSG:4326',
      typeName: typeName,
      bbox: bbox
    });
  } else if (typeof value === "string" && value.indexOf(wps.RASTERLAYER) !== -1) {
    values = value.split('|');
    var coverage = values[1];
    for (var i=0, ii=this.coverages.length; i<ii; ++i) {
      if (this.coverages[i].name === coverage) {
        lowerCorner = this.coverages[i].lowerCorner;
        upperCorner = this.coverages[i].upperCorner;
        break;
      }
    }
    bbox = values.length === 3 ? values[2].split(',').map(parseFloat) : undefined;
    return new wps.process.localWCS({
      lowerCorner: bbox ? [bbox[0], bbox[1]] : lowerCorner,
      upperCorner: bbox ? [bbox[2], bbox[3]] : upperCorner,
      identifier: coverage
    });
  } else {
    return value;
  }
};

// brute force
wps.ui.prototype.processAlgorithm = function(processId) {
  var executed = [];
  var toExecute = this.getDependsOnAlgorithms(processId);
  while (executed.length < toExecute.length) {
    for (var i=0, ii=toExecute.length; i<ii; ++i) {
      if (executed.indexOf(toExecute[i]) === -1) {
        var canExecute = true;
        var required = this.getDependsOnAlgorithms(toExecute[i]);
        for (var j=0, jj=required.length; j<jj; ++j) {
          var requiredAlg = required[j];
          if (requiredAlg !== toExecute[i] && executed.indexOf(requiredAlg) === -1) {
            canExecute = false;
            break;
          }
        }
        if (canExecute) {
          var values = this.getInputs(toExecute[i]);
          for (var key in values) {
            if (typeof values[key] === "string" && values[key].indexOf(wps.SUBPROCESS) !== -1) {
              // replace value with a chainlink
              values[key] = this.processes[values[key].substring(values[key].indexOf(wps.SUBPROCESS) + 8)].output();
            } else {
              values[key] = this.handleLocal(values[key]);
            }
          }
          this.processes[toExecute[i]].configure({
            inputs: values
          });
          executed.push(toExecute[i]);
        }
      }
    }
  }
};

wps.ui.prototype.showHelp = function() {
  window.open('docs/build/html/', 'help');
};

wps.ui.prototype.deleteInputMap = function(mapId) {
  if (this.inputMaps && this.inputMaps[mapId]) {
    if (this.inputMaps[mapId].map) {
      this.inputMaps[mapId].map.setTarget(null);
    }
    delete this.inputMaps[mapId].vector;
    delete this.inputMaps[mapId].source;
    delete this.inputMaps[mapId].dragBox;
    delete this.inputMaps[mapId].draw;
    delete this.inputMaps[mapId].map;
    delete this.inputMaps[mapId].vectorWMS;
    delete this.inputMaps[mapId].rasterWMS;
    delete this.inputMaps[mapId];
  }
};

wps.ui.prototype.clear = function(ui) {
  var i, ii, node;
  for (i=0, ii=ui.nodes.length; i<ii; ++i) {
    node = ui.nodes[i];
    if (node.type === 'process') {
      ui.deleteInputMap(node.id);
    }
  }
  ui.nodes = [];
  $('.input-map').detach();
  $('.output-map').detach();
  $('#tab-inputs').html('');
  $('#tab-results').html('');
  $('#tab-xml pre code').html('');
  $("#palette-search-input").val("");
  wps.ui.filterChange();
  ui.redraw();
};

wps.ui.prototype.execute = function(ui) {
  var hasSelected = false;
  var selection = d3.selectAll(".node_selected");
  if (selection[0].length > 0) {
    var node = selection.datum();
    if (node.complete !== true) {
      return;
    }
    if (node.type === 'process') {
      hasSelected = true;
      var processId = node.id, process = ui.processes[processId];
      var values = ui.getInputs(processId);
      if (values && process.isComplete(values)) {
        var inputs = {};

        var hasSubProcess = function(values) {
          var result = false;
          for (var key in values) {
            if (typeof values[key] === 'string' && values[key].indexOf(wps.SUBPROCESS) !== -1) {
              result = true;
              break;
            }
          }
          return result;
        };

        // make sure we configure all subprocesses
        ui.processAlgorithm(processId);

        var recurse = function(inputs, ui, values) {
          for (var key in values) {
            if (typeof values[key] === 'string' && (values[key].indexOf(wps.RASTERLAYER) !== -1 || values[key].indexOf(wps.VECTORLAYER) !== -1 || values[key].indexOf(wps.SUBPROCESS) !== -1)) {
              if (values[key].indexOf(wps.SUBPROCESS) !== -1) {
                var subId = values[key].substring(values[key].indexOf(wps.SUBPROCESS) + 8);
                var subInputs = ui.getInputs(subId);
                inputs[key] = ui.processes[subId].output();
                // only recurse if subInputs has subprocesses
                if (hasSubProcess(subInputs)) {
                  recurse(inputs[key], ui, subInputs);
                }
              } else {
                inputs[key] = ui.handleLocal(values[key]);
              }
            } else {
              if ($.isArray(values[key])) {
                for (i=0, ii=values[key].length; i<ii; ++i) { 
                  values[key][i] = ui.handleLocal(values[key][i]);
                } 
                inputs[key] = values[key];
              } else if ($.isXMLDoc(values[key])) { 
                inputs[key] = values[key];
              } else { 
                if (values[key] !== undefined) {
                  inputs[key] = '' + values[key];
                }
              }
            }
          }
        };

        recurse(inputs, ui, values);

        var prettyXML = function(body) {
          var code = $('#tab-xml pre code').get(0);
          $(code).html(document.createTextNode(vkbeautify.xml(body, 2)));
          hljs.highlightBlock(code);
        };

        var markOutputComplete = function(ui, complete) {
            var outputs = ui.getOutputNodes(node.id);
            for (var i=0, ii=outputs.length; i<ii; ++i) {
              var oldComplete = outputs[i].complete;
              outputs[i].complete = complete;
              outputs[i].dirty = (oldComplete !== complete);
            }
            ui.redraw();
        };

        $('#workspace').append('<i id="progress-indicator" class="fa fa-spinner fa-spin fa-5x"></i>');

        process.execute({
          inputs: inputs,
          startdownload: function() {
            $('#progress-indicator').remove();
            $("#dialog-form").html('<p>The TIFF download will now be requested on the server, the browser will notify you when it is done</p>');
            $("#dialog").dialog("option", "title", "Download TIFF").dialog( "open" );
            // bootstrap's hide class has important, so we need to remove it
            $("#dialog").removeClass('hide');
          },
          failure: function(exception, body) {
            $('#progress-indicator').remove();
            markOutputComplete(ui, false);
            prettyXML(body);
            $('.output-map').detach();
            $('#tab-results').html(exception);
            ui.activateTab('tab-results');
          },
          success: function(output, body, responseText) {
            $('#progress-indicator').remove();
            markOutputComplete(ui, true);
            prettyXML(body);
            if ($.isArray(output.result)) {
              var html = '<button id="btn-download" type="button" class="btn btn-default">';
              html += '<i class="fa fa-download fa-fw"></i>Download</button>';
              html += '<div id="map" class="output-map"></div>';
              $('.output-map').detach();
              $('#tab-results').html(html);
              $('#btn-download').click(function() {
                var html = '<div class="form-row">';
                html += '<label for="features-download" style="width:100%"><i class="glyphicon glyphicon-share"> Features:</i></label>';
                html += '<textarea readonly class="form-control" id="features-download" rows="5"></textarea>';
                html += '</div>';
                html += '<div class="form-tips"> Select the text above and copy to the clipboard.</div>';
                $("#dialog-form").html(html);
                $("#dialog").dialog("option", "title", "Download Features").dialog( "open" );
                // bootstrap's hide class has important, so we need to remove it
                $("#dialog").removeClass('hide');
                $("#features-download").val(responseText);
                $("#features-download").focus();
              });
              ui.activateTab('tab-results');
              if (!ui.outputMap) {
                ui.outputMap = {};
                ui.outputMap.source = new ol.source.Vector();
                ui.outputMap.vector = new ol.layer.Vector({source: ui.outputMap.source, style: ui.outputStyle});
                ui.outputMap.map = new ol.Map({
                  target: 'map',
                  layers: [
                    wps.backgroundLayer,
                    ui.outputMap.vector
                  ],
                  view: new ol.View(wps.mapSettings)
                });
              } else {
                ui.outputMap.map.setTarget('map');
              }
              ui.outputMap.source.clear();
              ui.outputMap.source.addFeatures(output.result);
              var view = ui.outputMap.map.getView();
              var extent = ui.outputMap.source.getExtent();
              if (extent[0] === extent[2]) {
                view.setCenter([extent[0], extent[1]]);
                view.setZoom(8);
              } else {
                view.fitExtent(
                  ui.outputMap.source.getExtent(), ui.outputMap.map.getSize());
              }
            } else {
              if ((typeof output.result === 'string') && output.result.indexOf('<?xml') !== -1) {
                $('.output-map').detach();
                $('#tab-results').html('<pre><code class="xml"></code></pre>');
                var code = $('#tab-results pre code').get(0);
                $(code).html(document.createTextNode(vkbeautify.xml(output.result, 4)));
                hljs.highlightBlock(code);
              } else {
                $('.output-map').detach();
                $('#tab-results').html(String(output.result));
              }
              ui.activateTab('tab-results');
            }
          }
        });
      }
    }
  }
  if (!hasSelected) {
    alert('Please select a process node you want to execute');
  }
};

wps.ui.prototype.checkSubLinkForDelete = function(link, process) { 
  var nodes = this.getAllNodes(process);
  var result = false;
  for (var i=0, ii=nodes.length; i<ii; ++i) { 
    if (nodes[i].id === link.source || nodes[i].id === link.target) { 
      result = true;
      break;
    }
  }
  return result;
};

wps.ui.prototype.deleteSelection = function() {
  var redraw = false;
  if (this.selectedLink !== null) {
    var src = this.findNodeById(this.selectedLink.source);
    var dst = this.findNodeById(this.selectedLink.target);
    var input = src.type === 'input' ? src : dst;
    this.editor_.setValue(false, false, undefined, input);
    this.nodes.splice(this.nodes.indexOf(this.selectedLink), 1);
    this.selectedLink = null;
    redraw = true;
  }
  var selection = d3.selectAll(".node_selected");
  if (selection[0].length > 0) {
    var node = selection.datum();
    if (node.type === 'process') {
      this.deleteInputMap(node.id);
      $('.input-map').detach();
      $('.output-map').detach();
      $('#tab-inputs').html('');
      $('#tab-results').html('');
      this.nodes.splice(this.nodes.indexOf(node), 1);
      for (var i=this.nodes.length-1; i>=0; --i) {
        if (this.nodes[i] instanceof wps.ui.link && this.checkSubLinkForDelete(this.nodes[i], node.id)) {
          this.nodes.splice(i, 1);
        } else if (this.nodes[i]._parent === node.id) {
          this.nodes.splice(i, 1);
        }
      }
    }
    redraw = true;
  }
  if (redraw) {
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
  var mousePos = me.mousePosition;
  // JOINING
  if (me.mouseMode == 2) {
    // update drag line
    me.dragLine.attr("class", "drag_line");
    var numOutputs = (me.mousedownPortType === 0)?(me.mousedownNode.outputs || 1):1;
    var sourcePort = me.mousedownPortIndex;
    var y = -((numOutputs-1)/2)*13 +13*sourcePort;
    var sc = (me.mousedownPortType === 0)?1:-1;
    var dy = mousePos[1]-(me.mousedownNode.y+y);
    var dx = mousePos[0]-(me.mousedownNode.x+sc*me.mousedownNode.w/2);
    var delta = Math.sqrt(dy*dy+dx*dx);
    var scale = me.lineCurveScale;
    var scaleY = 0;
    if (delta < me.nodeWidth) {
      scale = 0.75-0.75*((me.nodeWidth-delta)/me.nodeWidth);
    }
    if (dx*sc < 0) {
      scale += 2*(Math.min(5*me.nodeWidth,Math.abs(dx))/(5*me.nodeWidth));
      if (Math.abs(dy) < 3*me.nodeHeight) {
        scaleY = ((dy>0)?0.5:-0.5)*(((3*me.nodeHeight)-Math.abs(dy))/(3*me.nodeHeight))*(Math.min(me.nodeWidth,Math.abs(dx))/(me.nodeWidth)) ;
      }
    }
    me.dragLine.attr("d",
      "M "+(me.mousedownNode.x+sc*me.mousedownNode.w/2)+" "+(me.mousedownNode.y+y)+
        " C "+(me.mousedownNode.x+sc*(me.mousedownNode.w/2+me.nodeWidth*scale))+" "+(me.mousedownNode.y+y+scaleY*me.nodeHeight)+" "+
        (mousePos[0]-sc*(scale)*me.nodeWidth)+" "+(mousePos[1]-scaleY*me.nodeHeight)+" "+
        mousePos[0]+" "+mousePos[1]);
    d3.event.preventDefault();
  }
  // MOVING
  else if (me.mouseMode == 1) {
    var d = (me.mouseOffset[0]-mousePos[0])*(me.mouseOffset[0]-mousePos[0]) + (me.mouseOffset[1]-mousePos[1])*(me.mouseOffset[1]-mousePos[1]);
    if (d > 5) {
      // MOVING_ACTIVE
      me.mouseMode = 3;
      me.clickElapsed = 0;
    }
  } else if (me.mouseMode == 3) {
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
  if (me.mousedownNode && me.mouseMode === 2) {
    me.dragLine.attr("class", "drag_line_hidden");
  }
  if ((me.mouseMode === 0 || me.mouseMode === 5) && me.mousedownLink === null) {
    $('.input-map').detach();
    $('#tab-inputs').html('');
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
  this.dragLine = this.vis.append("svg:path").attr("class", "drag_line");
};

wps.ui.prototype.createDropTarget = function() {
  var me = this;
  this.dropZone_.droppable({
    accept:".palette_node",
    drop: function( event, ui ) {
      d3.event = event;
      var selected_tool = $(ui.draggable[0]).data('type');
      var process = me.client_.getProcess(me.defaultServer_, selected_tool, {callback: function(info) {
        var mousePos = d3.touches(this)[0]||d3.mouse(this);
        mousePos[1] += this.scrollTop;
        mousePos[0] += this.scrollLeft;
        mousePos[1] /= me.scaleFactor;
        mousePos[0] /= me.scaleFactor;
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
        me.processes[nn.id] = process;
        var link, i, ii, delta = 50, span = delta * nn.inputs, deltaY = (span-delta)/2;
        var startY = mousePos[1];
        for (i=0, ii=nn.inputs; i<ii; ++i) {
          for (var j=0, jj=Math.max(info.dataInputs.input[i].minOccurs, 1); j<jj; ++j) {
            var inputConfig = {
              x: mousePos[0]-200,
              y: startY-deltaY,
              w: this.nodeWidth,
              inputs: 1,
              outputs: 1,
              _parent: nn.id,
              dirty: true,
              type: 'input',
              _info: info.dataInputs.input[i],
              required: (info.dataInputs.input[i].minOccurs > 0),
              complete: false,
              label: info.dataInputs.input[i].title.value
            };
            if (inputConfig.y < 15) {
              startY = 100 + deltaY;
              inputConfig.y = startY-deltaY;
            }
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
        }
        for (i=0, ii=nn.outputs; i<ii; ++i) {
          var outputConfig = {
            x: mousePos[0]+200,
            y: mousePos[1],
            w: this.nodeWidth,
            inputs: 1,
            outputs: 1,
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
    l.append("svg:path").attr("class","link_background link_path").
    on("mousedown",function(d) {
      if (!d.subprocess) {
        return;
      }
      me.mousedownLink = d;
      me.clearSelection();
      me.selectedLink = me.mousedownLink;
      me.updateSelection();
      me.redraw();
      d3.event.stopPropagation();
    });
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
  link.classed("link_selected", function(d) { return d === me.selectedLink || d.selected; });
};

wps.ui.prototype.createExtraInputNode = function() {
  var selected_node = this.editor_.editingNode_;
  var inputs = [], maxY = 0;
  var i;
  // find lowest input node for process being edited
  for (i in this.nodes) {
    var node = this.nodes[i];
    if (node.target && node.target == selected_node._parent) {
      var y = node.y1;
      if (maxY < y) {
        maxY = y;
      }
    }
  }
  var link, delta = 50;
  var inputConfig = {
    x: selected_node.x,
    y: maxY + delta,
    w: selected_node.w,
    inputs: 0,
    outputs: 1,
    _parent: selected_node._parent,
    dirty: true,
    type: 'input',
    _info: selected_node._info,
    complete: false,
    label: selected_node._info.identifier.value
  };
  var input = new wps.ui.node(inputConfig);
  this.nodes.push(input);
  // create a link as well between input and process
  link = new wps.ui.link({
    source: input.id,
    target: selected_node._parent,
    _parent: selected_node._parent
  });
  this.nodes.push(link);
  this.redraw();
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
    me.updateNode.call(this, d, me);
  });
  this.createLinkPaths();
};

wps.ui.portMouseDown = function(ui, portType, portIndex, d) {
  ui.mousedownNode = d;
  ui.selectedLink = null;
  ui.mouseMode = 2;  // JOINING
  ui.mousedownPortType = portType;
  ui.mousedownPortIndex = portIndex || 0;
  document.body.style.cursor = "crosshair";
  d3.event.preventDefault();
};

wps.ui.portMouseUp = function(ui, portType, portIndex, d) {
  document.body.style.cursor = "";
  if (ui.mouseMode === 2 && ui.mousedownNode) {
    ui.mouseupNode = d;
    if (portType == ui.mousedownPortType || ui.mouseupNode === ui.mousedownNode) {
      ui.dragLine.attr("class", "drag_line_hidden");
      ui.resetMouseVars();
      return;
    }
    var src, dst;
    if (ui.mousedownPortType === 0) {
      src = ui.mousedownNode;
      dst = ui.mouseupNode;
    } else if (ui.mousedownPortType === 1) {
      src = ui.mouseupNode;
      dst = ui.mousedownNode;
    }
    if (src.type === dst.type) {
      return;
    }
    var existingLink = false;
    for (var i=0, ii=ui.nodes.length; i<ii; ++i) {
      var node = ui.nodes[i];
      existingLink = existingLink || (node.source === src && node.target === dst);
    }
    if (!existingLink) {
      var checkMatch = function(input, output) {
        var match = false;
        if (input._info.complexData && output._info.complexOutput) {
          for (var f=0, ff=input._info.complexData.supported.format.length; f<ff; ++f) {
            for (var g=0, gg=output._info.complexOutput.supported.format.length; g<gg; ++g) {
              if (input._info.complexData.supported.format[f].mimeType === output._info.complexOutput.supported.format[g].mimeType) {
                match = true;
                break;
              }
            }
          }
        }
        return match;
      };
      var isCircular = function(output, input) {
        var result = false;
        var processId = output._parent;
        var list = ui.getDependsOnAlgorithms(processId);
        for (var i=0, ii=list.length; i<ii; ++i) {
          var pid = list[i];
          var nodes = ui.getInputNodes(pid);
          for (var j=0, jj=nodes.length; j<jj; ++j) {
            var node = nodes[j];
            if (node === input) {
              result = true;
              break;
            }
          }
        }
        return result;
      };
      if (src._parent === dst._parent) {
        return;
      }
      if (src.type === 'input') {
        if (isCircular(dst, src) || !checkMatch(src, dst)) {
          return;
        }
        src.value = wps.SUBPROCESS + dst._parent;
        ui.afterSetValue(src);
      } else if (dst.type === 'input') {
        if (isCircular(src, dst) || !checkMatch(dst, src)) {
          return;
        }
        dst.value = wps.SUBPROCESS + src._parent;
        ui.afterSetValue(dst);
      }
      var link = new wps.ui.link({
        source: src.id,
        target: dst.id,
        subprocess: true,
        _parent: dst.id
      });
      ui.nodes.push(link);
    }
    ui.selectedLink = null;
    ui.redraw();
  }
};

wps.ui.prototype.createInputLink = function(node, d, text) {
  if (d.inputs > 0) {
    var me = this;
    text.attr("x",8);
    node.append("rect").attr("class","port port_input").attr("rx",3).attr("ry",3).attr("x",-5).attr("width",10).attr("height",10).
      attr("y", 10).
      on("mouseup", $.proxy(wps.ui.portMouseUp, null, this, 1, 0)).
      on("mousedown",$.proxy(wps.ui.portMouseDown, null, this, 1, 0)).
      on("mouseout",function(d) { var port = d3.select(this); port.classed("port_hovered",false);}).
      on("mouseover",function(d,i) { var port = d3.select(this); port.classed("port_hovered",(me.mouseMode!=2 || me.mousedownPortType !== 1 ));});
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

wps.ui.prototype.updateNode = function(d, ui) {
  var me = ui;
  if (d.dirty && d.w && d.h) {
    var thisNode = d3.select(this);
    thisNode.attr("transform", function(d) { return "translate(" + (d.x-d.w/2) + "," + (d.y-d.h/2) + ")"; });
    thisNode.selectAll(".node").
      attr("width",function(d){return d.w;}).
      attr("height",function(d){return d.h;}).
      classed("node_invalid", function(d) { return d.valid === false; }).
      classed("node_incomplete", function(d) { return !d.complete; }).
      classed("node_required", function(d) { return d.required; }).
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
      var mouseMode = this.mouseMode;
      d._ports.enter().append("rect").attr("class","port port_output").
        attr("rx",3).attr("ry",3).attr("width",10).attr("height",10).
        on("mouseout",function(d) {
          var port = d3.select(this);
          port.classed("port_hovered",false);
        }).
        on("mouseover",function(d,i) {
          var port = d3.select(this);
          port.classed("port_hovered",(me.mouseMode!=2 || me.mousedownPortType !== 0 ));
        }).
        on("mouseup", function() { return wps.ui.portMouseUp.call(null, me, 0, 0, d); }).
        on("mousedown", function() { return wps.ui.portMouseDown.call(null, me, 0, 0, d); });
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
  $('.input-map').detach();
  $('#tab-inputs').html('');
  if (me.mouseMode !== 3 && me.mousedownNode == d) {
    me.editor_.showEditForm(d);
    me.mouseMode = 5; // EDITING
    me.clickElapsed = 0;
    d3.event.stopPropagation();
    return;
  }
  wps.ui.portMouseUp(d, d.inputs > 0 ? 1 : 0, 0);
};

wps.ui.prototype.updateSelection = function() {
  if (this.mousedownNode) {
    if (this.inputMaps[this.mousedownNode._parent]) {
      if (this.inputMaps[this.mousedownNode._parent].vector) {
        this.inputMaps[this.mousedownNode._parent].vector.changed();
      }
    }
  }
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
  if (me.mousedownNode.type !== 'input') {
    $('.input-map').detach();
    $('#tab-inputs').html('');
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

wps.ui.filterChange = function() {
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

wps.ui.prototype.createSearch = function() {
  $("#palette-search-clear").on("click",function(e) {
    e.preventDefault();
    $("#palette-search-input").val("");
    wps.ui.filterChange();
    $("#palette-search-input").focus();
  });
  $("#palette-search-input").val("");
  $("#palette-search-input").on("keyup",function() {
    wps.ui.filterChange();
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

