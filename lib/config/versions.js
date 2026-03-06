/**
 * Version configuration for generating screenshots across different documentation versions.
 *
 * This maps documentation versions to their corresponding Modeler display versions.
 * The Modeler version shown in the footer will match the documentation version.
 *
 * For camunda-docs:
 * - Generate screenshots for each documented Camunda 8 version
 * - Screenshots go to version-specific directories (docs/ and versioned_docs/version-X.Y/)
 *
 * For camunda-docs-static and camunda-docs-manual (Camunda 7):
 * - Keep using Camunda 8.7 as the display version
 * - No versioned directories needed
 */

/**
 * Camunda 8 documentation versions configuration.
 * Each version should have:
 * - version: The documentation version (e.g., "8.7")
 * - modelerVersion: The Modeler version to display in footer (e.g., "8.7.0")
 * - path: The path prefix in camunda-docs repository (e.g., "versioned_docs/version-8.7" or "docs")
 * - isLatest: Whether this is the latest/unreleased version (goes in docs/ instead of versioned_docs/)
 */
const CAMUNDA_DOCS_VERSIONS = [
  {
    version: '8.8',
    modelerVersion: '8.8.0',
    path: 'docs',
    isLatest: true
  },
  {
    version: '8.7',
    modelerVersion: '8.7.0',
    path: 'versioned_docs/version-8.7',
    isLatest: false
  },
  {
    version: '8.6',
    modelerVersion: '8.6.0',
    path: 'versioned_docs/version-8.6',
    isLatest: false
  },
  {
    version: '8.5',
    modelerVersion: '8.5.0',
    path: 'versioned_docs/version-8.5',
    isLatest: false
  }
];

/**
 * Camunda 7 documentation version (for camunda-docs-manual and camunda-docs-static).
 * Per requirements, these should keep using Camunda 8.7.
 */
const CAMUNDA_7_MODELER_VERSION = '8.7.0';

module.exports = {
  CAMUNDA_DOCS_VERSIONS,
  CAMUNDA_7_MODELER_VERSION
};
