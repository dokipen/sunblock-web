/* globals $, _ */
import Ember from "ember";
export default Ember.Controller.extend({
  queryTxt: function(domain) {
    return $.getJSON("http://sunblock.doki-pen.org/1/txt", {name: domain});
  },
  querySpf: function(domain) {
    var lines = this.queryTxt(domain)
        .then(function(res) {
          if (res.error) {
            throw new Error("Txt query " + domain + " failed with " + res.error_message);
          }
          var lines = _(res.response)
            .filter(function(line) {
              return line.startsWith("v=spf1 ");
            })
            .value();
          return lines;
        });
    return lines;
  },
  parseSpfIncludes: function(lines) {
    var domains = _(lines)
      .map(function(line) {
        return line.split(" ");
      })
      .flatten()
      .filter(function(part) {
        return part.startsWith("include:");
      })
      .map(function(part) {
        return part.split(":")[1];
      })
      .value();
    return domains;
  },
  querySpfIncludes: function(domain) {
    var self = this;
    var domains = this.querySpf(domain)
      .then(function(lines) {
        return self.parseSpfIncludes(lines);
      });
    return domains;
  },
  indexOfNode: function(nodes, domain) {
    var idx = _(nodes)
      .findIndex(function(i) {
        return i.id === domain;
      });
    return idx;
  },
  makeNodesAndLinks: function() {
    console.log("updating");
    var self = this;
    var mdomain = self.model.domain;
    var work = Ember.A([]);
    var visited = Ember.A([]);
    var nodes = Ember.A([]);
    var links = Ember.A([]);
    Ember.set(self.model,'ready', false);

    function walkTree(domain) {
      if (self.indexOfNode(nodes, domain) === -1) {
        nodes.addObject({id: domain});
      }
      if (visited.indexOf(domain) === -1) {
        visited.addObject(domain);
        work.addObject(domain);
        self.querySpfIncludes(domain)
          .then(function(domains) {
            domains.forEach(function(child) {
              walkTree(child);
              links.addObject({
                source: self.indexOfNode(nodes, domain),
                target: self.indexOfNode(nodes, child)
              });
            });
          })
          .always(function() {
            work.removeObject(domain);
            if (work.length === 0) {
              self.model.nodes.clear();
              self.model.nodes.addObjects(nodes);
              self.model.links.clear();
              self.model.links.addObjects(links);
            }
          })
          .done();
      }
    }
    walkTree(mdomain);
  }.observes('model.domain'),
  model: {
    domain: '',
    nodes: [],
    links: []
  }
});

