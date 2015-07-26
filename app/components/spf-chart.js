/* global d3, Em */
function Graph(conf) {
  Em.BOB = this;
  this.conf = conf;
  this.nodes = this.conf.get('content.nodes');
  this.links = this.conf.get('content.links');
  this.id = this.conf.get('elementId');
  this.svg = d3.select('#' + this.id);
  this.linksG = this.svg.select(".links");
  this.nodesG = this.svg.select(".nodes");
  var self = this;

  this.svg.select('defs marker').attr({
      markerWidth: this.conf.get('markerSize'),
      markerHeight: this.conf.get('markerSize'),
      refX: (this.conf.get('radius') / this.conf.get('strokeWidth')) + (this.conf.get('markerSize') / 2),
      refY: this.conf.get('markerSize') / 2,
    });

  this.svg.select('defs marker path').attr({
      d: 'M0,0 V' + this.conf.get('markerSize') + ' L' + this.conf.get('markerSize') / 2 + ',' + this.conf.get('markerSize') / 2 + ' Z'
    });

  this.force = d3.layout.force()
    .size([this.conf.get('width'), this.conf.get('height')])
    .nodes(this.nodes)
    .links(this.links)
    .charge(this.conf.get("charge"))
    .gravity(this.conf.get("gravity"))
    .linkDistance(this.conf.get("linkDistance"))
    .on('tick', function() {
      self.tick();
    });
}

Graph.prototype.tick = function() {
  this.linksG.selectAll('.link').attr({
    d: function(d) {
      var x1 = d.source.x;
      var y1 = d.source.y;
      var x2 = d.target.x;
      var y2 = d.target.y;
      return "M" + x1 + "," + y1 + " " +
        x2 + "," + y2;
    }
  });
  this.nodesG.selectAll('.node').attr({
    transform: function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }
  });
};

Graph.prototype.start = function() {
  var links = this.linksG.selectAll('.link').data(this.force.links());
  links.enter().insert('path').attr({
    'class': function() { console.log("inserting link"); return 'link'; },
    'stroke-width': this.conf.get('strokeWidth')
  });
  links.exit().remove();

  var nodes = this.nodesG.selectAll('.node').data(this.force.nodes());
  var g = nodes.enter().append('g').attr('class', 'node').call(this.force.drag);
  g.append('circle')
    .attr({
      'class': function(_, i) { console.log("appending circle"); return i === 0 && 'head' || 'nohead'; },
      'r': this.conf.get('radius'),
      'stroke-width': this.conf.get('strokeWidth')
    });
  g.append('text').attr({'font-size': this.conf.get('fontSize'), 'y': this.conf.get('radius') / 10});
  nodes.exit().remove();
  nodes.select('text').text(function(d) { return d.id; });

  this.force.start();
};

import Ember from "ember";
export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height'.w(),
  graph: null,
  charge: -800,
  gravity: 0.05,
  radiusRatio: 12,

  radius: function() {
    return Math.min(this.get('width'), this.get('height')) / this.get('radiusRatio');
  }.property('width', 'height'),

  /**
   * this is multiplied by stroke width
   */
  markerSize: function() {
    return Math.sqrt(this.get('radius'));
  }.property('radius'),

  strokeWidth: function() {
    return this.get('radius') / 20;
  }.property('radius'),

  linkDistance: function() {
    return this.get('radius') * 3;
  }.property('radius'),

  fontSize: function() {
    return (this.get('radius') / 7) + "pt";
  }.property('radius'),

  startGraph: function() {
    this.graph = new Graph(this);
  }.on('didInsertElement'),

	transform: function() {
    return 'translate(0,0)';
	}.property('width', 'height'),

  update: function() {
    if (this.graph) {
      this.get('graph').start();
    }
  }.observes('content.links.[]')
});
