import EmberRouter from 'ember-router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('grid');

  this.route('docs', function() {
    this.route('index', { path: '/' });
    this.route('layout-elements');
    this.route('layout-components');
    this.route('overview');
    this.route('sustain');
    this.route('layout-attributes');
    this.route('layout-service');
    this.route('installation');
    this.route('blueprints');
    this.route('grids');
    this.route('settings');
    this.route('layouts-overview');
    this.route('media-css');
    this.route('container-css');
  });
});

export default Router;
