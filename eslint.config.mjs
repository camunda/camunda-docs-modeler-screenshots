import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  test: [
    'test/**/*.js',
    'test/**/*.mjs'
  ],
  ignored: [
    '*.json',
    '.nyc_output',
    'coverage',
    'camunda-modeler/',
    'camunda-docs-manual/',
    'camunda-docs-static/',
    'camunda-docs/'
  ]
};

export default [
  {
    'ignores': files.ignored
  },

  // lib + test
  ...bpmnIoPlugin.configs.node,

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {

    return {
      ...config,
      files: files.test
    };
  })
];