import Rx from 'rx/dist/rx.all'

import templateUrl from './visualization.html';

export const visualizationComponent = {
  templateUrl: templateUrl,
  bindings: {
    visualization: '<',
    dim: '<'
  }}
