module.exports = {
  "env": {
    "es6": true,
    "node": true,
    "jest": true,
  },
  "extends": "airbnb",
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
      "modules": true,
    },
    "sourceType": "module",
  },
  "plugins": [
    "react",
  ],
  "globals": {
    "navigator": true,
    "jasmine": true,
    "device": true,
    "element": true,
    "by": true,
  },
  "rules": {
    "indent": [
      "error",
      2,
    ],
    "linebreak-style": [
      "error",
      "unix",
    ],
    "quotes": [
      "error",
      "single",
    ],
    "semi": [
      "error",
      "never",
    ],
    "no-restricted-properties": ["error", {
      object: "arguments",
      property: "callee",
      message: "arguments.callee is deprecated",
    }, {
      property: "__defineGetter__",
      message: "Please use Object.defineProperty instead.",
    }, {
      property: "__defineSetter__",
      message: "Please use Object.defineProperty instead.",
    }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }], // Allow to use jsx in js file
    "react/require-extension": "off",
    "arrow-parens": ["error", "as-needed"],
    "quote-props": ["error", "consistent"],
    "object-shorthand": ["error", "consistent"],
    "class-methods-use-this": ["error", {
      "exceptMethods": [
        "componentWillUnMount",
      ],
    }],
  },
}
