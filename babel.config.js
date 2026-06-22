/** @type {import('@babel/core').Options} */
export default {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current' // Target current Node.js version
      },
      useBuiltIns: false,
      corejs: 3
    }]
  ]
}
