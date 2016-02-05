/* jshint node:true */
/**
 An HTMLBars AST transformation that converts instances of
 layout elements to their corresponding layout-component
 */
var LayoutElements = ['page', 'screen', 'grid', 'hbox', 'vbox', 'grid', 'box', 'centered', 'container'];
var JustifyValues = ['start', 'end', 'center', 'between', 'around'];
var AlignValues = ['start', 'end', 'stretch', 'center', 'baseline'];
var LayoutSizes = ['xs', 'sm', 'md', 'lg'];

function AttributeConversionSupport() {
  this.syntax = null;
}

AttributeConversionSupport.prototype.transform = function AttributeConversionSupport_transform(ast) {
  var pluginContext = this;
  var walker = new pluginContext.syntax.Walker();

  walker.visit(ast, function(node) {
    if (pluginContext.validate(node)) {
      var classNames = [];
      var classAttr = elementAttribute(node, 'class');
      if (classAttr && classAttr.value.chars) {
        classNames.push(classAttr.value.chars);
      }

      var prop = elementAttribute(node, 'justify');
      var value;

      if (prop) {
        value = prop.value.chars;
        if (JustifyValues.indexOf(value) !== -1) {
          classNames.push('justify-' + value);
          removeAttribute(node, prop);
        } else {
          throw new Error('Flexi#attribute-conversion:: \'' + value + '\' is not a valid value for justify.');
        }
      }

      prop = elementAttribute(node, 'align');
      if (prop) {
        value = prop.value.chars;
        if (AlignValues.indexOf(value) !== -1) {
          classNames.push('align-' + value);
          removeAttribute(node, prop);
        } else {
          throw new Error('Flexi#attribute-conversion:: \'' + value + '\' is not a valid value for align.');
        }
      }

      LayoutSizes.forEach(function(size) {
        prop = elementAttribute(node, size);
        if (prop) {
          value = prop.value.chars;
          var int = parseInt(value);
          if (int >= 1 && int <= 12) {
            classNames.push('col-' + size + '-' + value);
            removeAttribute(node, prop);
          } else {
            throw new Error('Flexi#attribute-conversion:: \'' + value + '\' is not a valid value for ' + size + '.');
          }
        }
      });

      if (!classAttr) {
        if (!classNames.length) {
          return;
        }
        classAttr = {
          type: 'AttrNode',
          name: 'class',
          value: { type: 'TextNode', chars: '' }
        };
        node.attributes.push(classAttr);
      }
      classAttr.value.chars = classNames.join(' ');
    }
  });

  return ast;
};

function removeAttribute(node, attr) {
  var index = node.attributes.indexOf(attr);
  node.attributes.splice(index, 1);
}

function elementAttribute(node, path) {
  var attributes = node.attributes;
  for (var i = 0, l = attributes.length; i < l; i++) {
    if (attributes[i].name === path) {
      return attributes[i];
    }
  }
  return false;
}

AttributeConversionSupport.prototype.validate = function AttributeConversionSupport_validate(node) {
  var isElement = node.type === 'ElementNode';
  // is a component we convert attributes for
  return isElement && LayoutElements.indexOf(node.tag) !== -1;
};

module.exports = AttributeConversionSupport;