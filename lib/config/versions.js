/**
 * Version configuration for generating screenshots across different documentation versions.
 *
 * This configuration controls what versions are displayed in the Camunda Modeler footer.
 *
 * Note: The display-version flag (Modeler version) should remain unchanged and show the actual
 * Modeler version being used. The engine version flags control what engine version is shown.
 *
 * For camunda-docs (Camunda 8):
 * - Generate screenshots for each documented Camunda 8 version
 * - Use c8-engine-version flag to set the engine version (e.g., "8.6", "8.7", "8.9 (alpha)")
 * - Screenshots go to version-specific directories (docs/ and versioned_docs/version-X.Y/)
 *
 * For camunda-docs-static and camunda-docs-manual (Camunda 7):
 * - Use c7-engine-version flag set to "7.24"
 * - No versioned directories needed
 */

/**
 * Camunda 8 documentation versions configuration.
 * Each version should have:
 * - version: The documentation version (e.g., "8.7")
 * - c8EngineVersion: The Camunda 8 engine version to display (e.g., "8.7", "8.9 (alpha)")
 * - path: The path prefix in camunda-docs repository (e.g., "versioned_docs/version-8.7" or "docs")
 * - isLatest: Whether this is the latest/unreleased version (goes in docs/ instead of versioned_docs/)
 */
const CAMUNDA_DOCS_VERSIONS = [
  {
    version: '8.9',
    c8EngineVersion: '8.9 (alpha)',
    path: 'docs',
    isLatest: true
  },
  {
    version: '8.7',
    c8EngineVersion: '8.7',
    path: 'versioned_docs/version-8.7',
    isLatest: false
  },
  {
    version: '8.6',
    c8EngineVersion: '8.6',
    path: 'versioned_docs/version-8.6',
    isLatest: false
  },
  {
    version: '8.5',
    c8EngineVersion: '8.5',
    path: 'versioned_docs/version-8.5',
    isLatest: false
  }
];

/**
 * Camunda 7 engine version (for camunda-docs-manual and camunda-docs-static).
 * Per requirements, these should always use "7.24".
 */
const CAMUNDA_7_ENGINE_VERSION = '7.24';

module.exports = {
  CAMUNDA_DOCS_VERSIONS,
  CAMUNDA_7_ENGINE_VERSION
};

