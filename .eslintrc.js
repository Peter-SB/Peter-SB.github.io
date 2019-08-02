module.exports = { "extends": "airbnb-base" };
/*
module.exports = {
  extends: [
    'airbnb-base/legacy',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  rules: {
    // Permit anonymous functions - at ES6 we'll be able to use => functions
    'func-names': 'off',

    // We prohibit assigning to parameters but allow assigning to their properties
    'no-param-reassign': ['error', {
      props: false
    }],

    // Permit ++ and --
    'no-plusplus': 'off',

    // These two rules are disabled because conforming to them would require extensive changes
    // making merging difficult.
    'no-use-before-define': 'off',
    'vars-on-top': 'off',

    // Disabled to allow for..of loops
    'no-restricted-syntax': 'off',

    // Allow await in for..of loops
    'no-await-in-loop': 'off',

    'no-trailing-spaces': [ 'error', { ignoreComments: true }],

    'import/order': 'off',

    // whitelist any import in to /libs/..
    'import/no-unresolved': [ 'error', { ignore: [ '/libs/' ] }]
  },
  parser: 'babel-eslint',
  parserOptions: { 'ecmaVersion': 7, 'sourceType': 'module' },
  globals: {
    KeyLines: true,
    Map: true
  }
};*/