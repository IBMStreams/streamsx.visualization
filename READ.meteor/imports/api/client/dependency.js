import cytoscape from "cytoscape";
import angular from 'angular';
import _ from 'underscore';

export class Dependency {
  constructor() {
    this.graph = cytoscape({
      elements: []
    });
  }

  addNode(nodeId) {
    this.graph.add({
      group: 'nodes',
      data: {
        id: nodeId
      }
    });
  }

  addParents(sourceIds, targetId) { // sourceIds is array of parent ids
    sourceIds.forEach(sourceId => {
      this.graph.add({
        group: 'edges',
        data: {
          source: sourceId,
          target: targetId
        }
      });
    });
  };

  removeNode(nodeId) {
    let selector = 'node[id = "nodeId"]'.replace('nodeId', nodeId);
    this.graph.remove(selector); // this also removes edges -- hopefully !
  }

  removeParents(nodeId) {
    let selector = 'edge[target = "nodeId"]'.replace('nodeId', nodeId);
    this.graph.remove(selector);
  }

  getDerived(nodeIdOrIdArray) {
    if (! _.isArray(nodeIdOrIdArray)) {
      let nodeId = nodeIdOrIdArray;
      let selector = 'node[id = "nodeId"]'.replace('nodeId', nodeId);
      return this.graph.filter(selector).outgoers().nodes().map(e => e.data());
    } else {
      let nodeIds = nodeIdOrIdArray;
      if (nodeIds.length > 0) {
        let compoundSelector = nodeIds.map(nodeId => 'node[id = "nodeId"]'.replace('nodeId', nodeId)).join();
        return this.graph.elements(compoundSelector).outgoers().nodes().map(e => e.data());
      } else return [];
    }
  }
}
