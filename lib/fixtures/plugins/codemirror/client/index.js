/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { registerClientExtension } from 'camunda-modeler-plugin-helpers';

import { EditorView } from 'codemirror';

registerClientExtension(() => {
  // eslint-disable-next-line no-undef
  window.EditorView = EditorView;

  // Client extensions must be React components
  return null;
});
