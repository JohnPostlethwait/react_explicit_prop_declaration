# React Explicit Prop Declaration Mixin

A ReactJS Mixin to ensure that components explicitly define the properties they
allow in their `propTypes`. If a property passed in to the React component is
not found in `propTypes` then an error will be thrown.

This is useful for ensuring that all component property interfaces be
explicitly defined, which helps when reasoning about what properties a component
will accept.

**Let's keep our interfaces clean and well documented!**

## Example

Let's define a very basic React component.

```javascript
var ExplicitPropDeclarationMixin = require('react_explicit_prop_declaration');

var MyComponent = React.createClass({

  mixins: [ExplicitPropDeclarationMixin],

  propTypes: {
    defined: React.PropTypes.bool
  },

  render: function () {
    // ...
  }

});
```

And now let's render that component with the property we defined in `propTypes`:

```javascript
React.render(<MyComponent defined={true}} />
```

> <MyComponent Instance>

Cool, so let's do the same, but this time, with a property we did not define in
`propTypes`.

```javascript
React.render(<MyComponent notDefined={false} defined={true}} />
```

Eeek! An error was thrown telling us what went wrong!

> ExplicitPropDeclarationError: The properties "notDefined" were set on the MyComponent, which were not declared in MyComponent.propTypes. Only properties defined in MyComponent.propTypes are allowed to be set on MyComponent.

Looks like, we, as developers need to decide to _explicitly_ define another
`propType` we allow on this component, or fix our `render` call to not pass in
unexpected properties.

## Contributing

If you would like to contribute code, please do the following:

1. Fork this repository and make your changes.
2. Write tests for any new functionality. If you are fixing a bug that tests did not cover, please make a test that reproduces the bug.
3. Add your name to the "contributors" section in the package.json file.
4. Squash all of your commits into a single commit via git rebase -i.
5. Run the tests by running npm install && make test from the source directory.
6. Assuming those pass, send the Pull Request off to me for review!

Please do not iterate the package.json version number – I will do that myself
when I publish it to NPM.
