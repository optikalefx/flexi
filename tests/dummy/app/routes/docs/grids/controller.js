import Controller from 'ember-controller';

export default Controller.extend({

  componentName: 'docs/grids/example-grid',
  snippetName: 'grid-example-grid.hbs',

  actions: {
    showExample(name) {
      this.set('snippetName', `grid-example-${name}.hbs`);
      this.set('componentName', `docs/grids/example-${name}`);
    }
  }

});
