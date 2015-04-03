'use strict';

var Lang = require("thicket").c("lang");

var ExplicitPropDeclarationError            = Lang.makeErrorClass('ExplicitPropDeclarationError'),
    ExplicitPropDeclarationDependencyError  = Lang.makeErrorClass('ExplicitPropDeclarationDependencyError');


/*
 * This Mixin will validate the props on a ReactJS component both during
 * `componentWillMount` (the first life-cycle method we have available in a
 * component's lifecycle), as well as during `componentWillRecieveProps.` If
 * there are any props set in the component at either of these times that are
 * not explicitly defined in the component's `propTypes` object, it will throw
 * a validation error.
 *
 * The reason for this mixin is to enforce explicit interface definitions ONLY
 * for all of our new components. This ensures one can more-easily reason-about
 * a component, and the properties that it can interact with.
 */


/*
 * Ensures the component we are mixed in to actually has a `propTypes`
 * definition. Will throw if `componentPropTypes` is falsy for this component.
 *
 * @param componentName {String} - The string name of the component. Used for
 *                                 the error message.
 * @param componentPropTypes {Object} - The propTypes object for this component.
 *                                      Used to ensure there are properties
 *                                      defined for this component.
 */
function ensureComponentHasPropTypesDeclared (componentName, componentPropTypes) {
  var errorMessage = ('Component "' + componentName + '" does not have ' +
                      '`propTypes` defined. All components must have ' +
                      'defined `propTypes`.')

  if (!componentPropTypes) {
    throw new ExplicitPropDeclarationError(errorMessage);
  }
}

/*
 * Does a shallow traversal of the supplied `propsToCheck` and ensures each
 * property name also exists in the supplied `componentPropTypes`. Throws if
 * there are properties in `propsToCheck` which do not exist in `propTypes`.
 *
 * @param componentName {String} - Used for the error message thrown.
 * @param componentPropTypes {Object} - The `propTypes` declaration for this
 *                                      component.
 * @param propsToCheck {Object} - The props object to check against
 *                                `componentPropTypes`, if any keys exist in
 *                                this object that are not in
 *                                `componentPropTypes`, this will throw.
 */
function ensurePropsMatchComponentPropTypes (componentName, componentPropTypes, propsToCheck) {
  var invalidProperties = [],
      invalidPropertiesString,
      errorMessage;

  Object.keys(propsToCheck).forEach(function (propName) {
    if (!componentPropTypes[propName]) {
      invalidProperties.push(propName);
    }
  });

  if (invalidProperties.length) {
    invalidPropertiesString = invalidProperties.join(', ');
    errorMessage = ('The properties "' + invalidPropertiesString + '" were ' +
                    'set on the ' + componentName + ', which were not ' +
                    'declared in ' + componentName + '.propTypes. Only ' +
                    'properties defined in ' + componentName + '.propTypes ' +
                    'are allowed to be set on ' + componentName + '.');

    throw new ExplicitPropDeclarationError(errorMessage);
  }
}

/*
 * Ensures the React instance we are working with has the required dependency
 * properties that this mixin requires to do its checks. If not, it will throw
 * with a leading error message to track down the source of the problem. This is
 * likely only to be hit upon a version upgrade/downgrade to the React package
 * itself. At the time of writing this, React is at version 0.13.0.
 *
 * @param reactComponentInstance {Object} - A React component instance.
 */
function ensureInternalPropertyValidityInReact (reactComponentInstance) {
  var errorMessage;

  if (!reactComponentInstance._reactInternalInstance ||
      !reactComponentInstance._reactInternalInstance._currentElement) {
    errorMessage = ('This React mixin depends on an instance of a React ' +
                    'component to have a `_reactInternalInstance` property ' +
                    'as well as a `_reactInternalInstance._currentElement` ' +
                    'property. This instance does not. Was React updated ' +
                    'recently?');

    throw new ExplicitPropDeclarationDependencyError(errorMessage)
  }
}


var ExplicitPropDeclarationMixin = {

  // Validate the props after initial instantiation. Since we have no sort of
  // `beforeInstantiation` lifecycle method, this is the first time we can hook
  // into the component lifecycle, so we must validate the props after they are
  // already set on this component (as this.props).
  componentWillMount: function () {
    ensureInternalPropertyValidityInReact(this);

    var componentType = this._reactInternalInstance._currentElement.type;

    ensureComponentHasPropTypesDeclared(componentType.displayName, componentType.propTypes);
    ensurePropsMatchComponentPropTypes(componentType.displayName, componentType.propTypes, this.props);
  },

  // After initial instantiation, we can now hook into the component lifecycle
  // right before the props are set on this component (as this.props). In this
  // lifecycle method, we have access to the old props (this.props) and the ones
  // about to be set (first argument of `componentWillReceiveProps`). We will
  // now validate the newProps about to be set here...
  componentWillReceiveProps: function (newProps) {
    ensureInternalPropertyValidityInReact(this);

    var componentType = this._reactInternalInstance._currentElement.type;

    ensurePropsMatchComponentPropTypes(componentType.displayName, componentType.propTypes, newProps);
  }

};

module.exports = ExplicitPropDeclarationMixin;
