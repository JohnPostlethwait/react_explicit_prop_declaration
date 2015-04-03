'use strict';

var React           = require('react'),
    ReactAddons     = require('react/addons'),
    ReactTestUtils  = React.addons.TestUtils;

jest.dontMock('../index');
var ExplicitPropDeclaration = require('../index');

var DummyTestComponentWithPropTypes = React.createClass({
  mixins: [ExplicitPropDeclaration],
  propTypes: {
    test: React.PropTypes.bool
  },
  render: function () {
    return (<div>I am a dummy component with propTypes!</div>);
  }
});

var DummyTestComponentWithoutPropTypes = React.createClass({
  mixins: [ExplicitPropDeclaration],
  render: function () {
    return (<div>I am a dummy component without propTypes!</div>);
  }
});

describe("ExplicitPropDeclaration Mixin:", function () {

  describe('a component that has `propTypes` declared', function () {
    describe('with properties that match the defined `propTypes`', function () {
      describe('provided on component instantiation', function () {
        it('should return a React DIV component, and not throw an error', function () {
          function renderWithPropsThatAreInPropTypes () {
            return ReactTestUtils.renderIntoDocument(<DummyTestComponentWithPropTypes test={true} />);
          }

          expect(renderWithPropsThatAreInPropTypes).not.toThrow();
          expect(ReactTestUtils.isCompositeComponentWithType(renderWithPropsThatAreInPropTypes(), DummyTestComponentWithPropTypes)).toBeTruthy();
        });
      });

      describe('provided after component instantiation', function () {
        it('should not throw an error', function () {
          var ValidComponentAtInstantiation = ReactTestUtils.renderIntoDocument(<DummyTestComponentWithPropTypes test={true} />);

          function setValidPropsAfterInstantiation () {
            return ValidComponentAtInstantiation.setProps({ test: false });
          }

          expect(setValidPropsAfterInstantiation).not.toThrow();
        });
      });
    });

    describe('with a single property that does not map to the properties defined in `propTypes`', function () {
      // NOTE (johnp): I am typiclly against string-matching-assertions, as they
      // can be hard to maintain,but in this case, we to not watch to pass the
      // test on ANY exception, only this specific exception...
      var expectedErrorMessage = ('ExplicitPropDeclarationError: The ' +
                                  'properties "iDontExist" were set on the ' +
                                  'DummyTestComponentWithPropTypes, which ' +
                                  'were not declared in ' +
                                  'DummyTestComponentWithPropTypes.propTypes. ' +
                                  'Only properties defined in ' +
                                  'DummyTestComponentWithPropTypes.propTypes ' +
                                  'are allowed to be set on ' +
                                  'DummyTestComponentWithPropTypes.');

      describe('provided on component instantiation', function () {
        it('should throw an error', function () {
          function renderWithPropsThatAreNotInPropTypes () {
            return ReactTestUtils.renderIntoDocument(<DummyTestComponentWithPropTypes iDontExist='pleaseThrow!' />);
          }

          expect(renderWithPropsThatAreNotInPropTypes).toThrow(expectedErrorMessage);
        });
      });

      describe('provided after component instantiation', function () {
        it('should throw an error', function () {
          var ValidComponentAtInstantiation = ReactTestUtils.renderIntoDocument(<DummyTestComponentWithPropTypes test={true} />);

          function setInvalidPropsAfterInstantiation () {
            return ValidComponentAtInstantiation.setProps({ iDontExist: 'pleaseThrow!' });
          }

          expect(setInvalidPropsAfterInstantiation).toThrow(expectedErrorMessage);
        });
      });
    });

    describe('with multiple properties that do not map to the properties defined in `propTypes`', function () {
      // NOTE (johnp): I am typically against string-matching-assertions, as
      // they can be hard to maintain,but in this case, we to not watch to pass
      // the test on ANY exception, only this specific exception...
      var expectedErrorMessage = ('ExplicitPropDeclarationError: The ' +
                                  'properties "iDontExist, iAlsoDoNotExist" were set on the ' +
                                  'DummyTestComponentWithPropTypes, which ' +
                                  'were not declared in ' +
                                  'DummyTestComponentWithPropTypes.propTypes. ' +
                                  'Only properties defined in ' +
                                  'DummyTestComponentWithPropTypes.propTypes ' +
                                  'are allowed to be set on ' +
                                  'DummyTestComponentWithPropTypes.');

      describe('provided on component instantiation', function () {
        it('should throw an error', function () {
          function renderWithPropsThatAreNotInPropTypes () {
            return ReactTestUtils.renderIntoDocument(<DummyTestComponentWithPropTypes iDontExist='pleaseThrow!' iAlsoDoNotExist='Find Me Too!' />);
          }

          expect(renderWithPropsThatAreNotInPropTypes).toThrow(expectedErrorMessage);
        });
      });

      describe('provided after component instantiation', function () {
        it('should throw an error', function () {
          var ValidComponentAtInstantiation = ReactTestUtils.renderIntoDocument(<DummyTestComponentWithPropTypes test={true} />);

          function setInvalidPropsAfterInstantiation () {
            return ValidComponentAtInstantiation.setProps({ iDontExist: 'pleaseThrow!', iAlsoDoNotExist: 'Find Me Too!' });
          }

          expect(setInvalidPropsAfterInstantiation).toThrow(expectedErrorMessage);
        });
      });
    });
  });

  describe('a component without `propTypes` declared', function () {
    var expectedErrorMessage = ('ExplicitPropDeclarationError: Component "' +
                                'DummyTestComponentWithoutPropTypes" does not ' +
                                'have `propTypes` defined. All components ' +
                                'must have defined `propTypes`.');

    it('when instantiated, it should throw an error', function () {
      function renderComponentWithoutPropTypesDeclared () {
        return ReactTestUtils.renderIntoDocument(<DummyTestComponentWithoutPropTypes iDontExist='pleaseThrow!' />);
      }

      expect(renderComponentWithoutPropTypesDeclared).toThrow(expectedErrorMessage);
    });
  });

});
