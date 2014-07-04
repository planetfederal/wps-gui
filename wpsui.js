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

wps.ui = function(options) {
  this.parentContainer_ = options.parentContainer;
  this.sideBar_ = options.sideBar;
  this.dropZone_ = options.dropZone;
  this.spaceWidth = options.spaceWidth || 5000;
  this.spaceHeight = options.spaceHeight || 5000;
  this.scaleFactor = options.scaleFactor || 1;
  this.nodeWidth = options.nodeWidth || 100;
  this.nodeHeight = options.nodeHeight || 30;
  this.nodes = [];
  this.createSearch();
  this.createCanvas();
  this.createDropTarget();
  this.createZoomToolbar();
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
    append('svg:g');
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
      var mousePos = d3.touches(this)[0]||d3.mouse(this);
      mousePos[1] += this.scrollTop;
      mousePos[0] += this.scrollLeft;
      mousePos[1] /= me.scaleFactor;
      mousePos[0] /= me.scaleFactor;
      /* TODO no workspaces as yet, so z is 0 */
      var nn = { id:(1+Math.random()*4294967295).toString(16),x: mousePos[0],y:mousePos[1],w:this.nodeWidth,z:0};
      nn.type = selected_tool;
      // TODO make dynamic
      nn._def = {
        category: "process",
        color: "rgb(231, 231, 74)",
        label: selected_tool,
        inputs: 0,
        outputs: 0,
        button: {}
      };
      me.nodes.push(nn);
      // here we should probably do a DescribeProcess action
      me.redraw();
    }
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
    var node = d3.select(this);
    node.attr("id",d.id);
    var l = d._def.label;
    l = (typeof l === "function" ? l.call(d) : l)||"";
    d.w = Math.max(me.nodeWidth,me.calculateTextWidth(l)+(d._def.inputs>0?7:0) );
    d.h = Math.max(me.nodeHeight,(d.outputs||0) * 15);
    if (d._def.button) {
      me.createButton(node);
    }
    me.createProcessRect(node);
    me.createProcessText(node, d);
    node.each(function(d,i) {
      me.updateNode.call(this, d);
    });
  });
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
  return 50+w;
};

wps.ui.prototype.updateNode = function(d) {
  // TODO decide when dirty
  d.dirty = true;
  if (d.dirty) {
    var thisNode = d3.select(this);
    thisNode.attr("transform", function(d) { return "translate(" + (d.x-d.w/2) + "," + (d.y-d.h/2) + ")"; });
    thisNode.selectAll(".node").
      attr("width",function(d){return d.w;}).
      attr("height",function(d){return d.h;}).
      classed("node_selected",function(d) { return d.selected; }).
      classed("node_highlighted",function(d) { return d.highlighted; });
      thisNode.selectAll('text.node_label').text(function(d,i){
        return d._def.label || "";
      }).
        attr('y', function(d){return (d.h/2)-1;}).
        attr('class',function(d){
          return 'node_label'+
            (d._def.align?' node_label_'+d._def.align:'')+
            (d._def.label?' '+(typeof d._def.labelStyle == "function" ? d._def.labelStyle.call(d):d._def.labelStyle):'');
        });
      d.dirty = false;
    }
};

wps.ui.prototype.createProcessRect = function(node) {
  var mainRect = node.append("rect").
    attr("class", "node").
    classed("node_unknown",function(d) { return d.type == "unknown"; }).
    attr("rx", 6).
    attr("ry", 6).
    attr("fill",function(d) { return d._def.color;});
};

wps.ui.prototype.createProcessText = function(node, d) {
  var text = node.append('svg:text').attr('class','node_label').attr('x', 38).attr('dy', '.35em').attr('text-anchor','start');
  if (d._def.align) {
    text.attr('class','node_label node_label_'+d._def.align);
    text.attr('text-anchor','end');
  }
};

wps.ui.prototype.createButton = function(node) {
  var nodeButtonGroup = node.append('svg:g').
    attr("transform",function(d) { return "translate("+((d._def.align == "right") ? 94 : -25)+",2)"; }).
    attr("class",function(d) { return "node_button "+((d._def.align == "right") ? "node_right_button" : "node_left_button"); });
  nodeButtonGroup.append('rect').
    attr("rx",8).
    attr("ry",8).
    attr("width",32).
    attr("height",this.nodeHeight-4).
    attr("fill","#eee");
  nodeButtonGroup.append('rect').
    attr("x",function(d) { return d._def.align == "right"? 10:5;}).
    attr("y",4).
    attr("rx",5).
    attr("ry",5).
    attr("width",16).
    attr("height",this.nodeHeight-12).
    attr("fill",function(d) { return d._def.color;}).
    attr("cursor","pointer");
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
  $(".palette-header").click(function(e) {
    $(this).next().slideToggle();
    $(this).children("i").toggleClass("expanded");
  });
  return content;
};

wps.ui.prototype.createProcess = function(offering) {
  var summary = offering['abstract'];
  var title = offering.title;
  var id = offering.identifier;
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
  var sidebar = this.sideBar_;
  $(d).click(summary, function(evt) {
    var help = '<div class="node-help">' + evt.data + "</div>";
    sidebar.html(help);
  });
  $(d).draggable({
    helper: 'clone',
    appendTo: 'body',
    revert: true,
    revertDuration: 50
  });
  return d;
};

