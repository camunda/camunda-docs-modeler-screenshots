# camunda-docs-modeler-screenshots

[![CI](https://github.com/camunda/camunda-docs-modeler-screenshots/actions/workflows/CI.yml/badge.svg)](https://github.com/camunda/camunda-docs-modeler-screenshots/actions/workflows/CI.yml) [![Generate Screenshots](https://github.com/camunda/camunda-docs-modeler-screenshots/actions/workflows/CREATE_SCREENSHOTS.yml/badge.svg)](https://github.com/camunda/camunda-docs-modeler-screenshots/actions/workflows/CREATE_SCREENSHOTS.yml)

Update screenshots of the [Camunda Modeler](https://github.com/camunda/camunda-modeler)
used in the [docs](https://docs.camunda.org/manual/latest/modeler/).

## Usage

Use this repo to update the screenshots of the Camunda Modeler used in the
[docs](https://docs.camunda.org/manual/latest/modeler/). This is handy once there
have been basic UX / Style changes in the Modeler.

### Use a workflow

Run the [Generate Screenshots](https://github.com/camunda/camunda-docs-modeler-screenshots/actions/workflows/CREATE_SCREENSHOTS.yml) workflow.

Once it's completed, download the generated artifacts and upload them to the respective `camunda-docs-*` repos.
The optional `version` input selects a Desktop Modeler version; leave it empty to
use the latest release. Push-triggered runs continue to use the latest release.

### Publish review PRs without local downloads

The separate **Publish Screenshots** workflow is manually dispatched from the
default branch. It calls **Generate Screenshots** as a reusable workflow instead
of dispatching it or searching for the "latest successful" artifacts. Existing
push and manual generation remain available.

The latest stable Desktop Modeler version is resolved once, passed as `VERSION`,
and checked against the installed Modeler manifest. Generation must succeed in
full before a subsequent job can publish. When called with `record_provenance`,
generation requires the pinned version and records a SHA-256 inventory before
uploading artifacts. The inventory records the version, source commit, run ID and
attempt. The publishing job downloads only this workflow run's artifacts and
validates all three inventories before preparing any target repository.

For `camunda-docs`, generated `docs/` paths update Next and their existing
counterparts in every active version in `versions.json`, following
[camunda/camunda-docs#10641](https://github.com/camunda/camunda-docs/issues/10641).
Missing versioned paths are listed in the run summary and PR description, not
created. Archived versions are untouched. The other two repositories retain their
generated paths. Only generated PNGs are copied; no pages or other assets are
published.

All three target repositories are prepared before any push. The workflow opens
separate **draft** PRs, never merges them, and preserves each target's PR template
when present. A changed or ambiguous template fails preparation rather than being
silently replaced. Reviewers must check image diffs and decide whether the latest
Modeler UI is appropriate for each documentation version; successful generation
is not visual approval.

#### Maintainer setup

Create the `screenshot-publishing` GitHub environment, ideally with required
reviewers, and add its `DOCS_PUBLISH_TOKEN` secret. Use a fine-grained PAT (or
equivalent organization-approved bot credential) with **Contents: read/write** and
**Pull requests: read/write** on `camunda/camunda-docs`,
`camunda/camunda-docs-static` and `camunda/camunda-docs-manual`, authorized for any
organization SSO/policies. The source repository's `GITHUB_TOKEN` cannot write
across repositories. The credential needs access to target templates and labels;
`camunda-docs` must have its `low prio` label. Repository rules must permit the bot
to push automation branches and create PRs. Do not grant the publishing credential
to the generation job.

Configure the same repository-level cluster secrets used by **Generate
Screenshots**: `CAMUNDA_CONSOLE_CLIENT_ID`, `CAMUNDA_CONSOLE_CLIENT_SECRET`,
`CAMUNDA_CLUSTER_ID`, `CLUSTER_URL`, `CLIENT_ID`, `CLIENT_SECRET`, and `OAUTH_URL`.
The publishing workflow passes the cluster secrets explicitly to the reusable
generation workflow. Allow the workflow's existing setup actions plus
`peter-evans/create-pull-request@v7`. The source token needs only Contents: read and,
in the publishing job, Actions: read.

`camunda-docs` and `camunda-docs-static` target their current default branches,
resolved at preparation time (currently `main` and `master`). The
`camunda-docs-manual` PR targets `master`, regardless of its default branch,
following recent screenshot PRs. If `master` is unavailable, preparation fails.
It does not automatically update `7.24` or other release branches. The manual's
native 7.24 Stage publishing uses the separate `7.24` branch; updating `master`
alone therefore does not update that published release.

Run **Actions > Publish Screenshots > Run workflow** on the default branch. Each
target uses the reserved bot-owned branch
`automation/modeler-screenshots-<modeler-version>`. Repeated runs update the same
open PR for that version; unchanged targets produce no empty PR. Do not edit those
branches manually. Repository-wide concurrency serializes publishers without
cancelling the running one; GitHub may replace an older pending run when another
dispatch arrives. Original generation runs remain independent and never publish.

Cross-repository PR creation is **not atomic**: a credential/API failure after the
first PR may leave a subset open and fails the run visibly. Inspect the publishing
steps and rerun the workflow after fixing the failure; deterministic branches
allow recovery without duplicate open PRs. Artifacts expire according to repository
retention, and a later dispatch may select a newer release. Use a new dispatch for
retries: generation and publication must share the same run attempt, and re-runs
may encounter existing immutable artifact names. This workflow does not trigger on
releases or schedules and has not been live-tested against the docs repositories.
A supervised first dispatch is required after merging and configuring credentials.

#### Offline publisher checks

```sh
npm run test:publishing
npm run lint
```

The publisher unit tests use temporary directories and do not download Modeler,
use cluster credentials, push branches, or create documentation PRs.
They also run as part of `npm test` and the existing CI suite.
To check GitHub Actions syntax and reusable workflow references separately, run
`actionlint .github/workflows/CREATE_SCREENSHOTS.yml .github/workflows/PUBLISH_SCREENSHOTS.yml`
if actionlint is installed. It does not execute the workflows or verify their
end-to-end behavior.

### Use locally

Alternatively, you can run the screenshots generation locally.

First, you need to clone this repository and install the dependencies:

```sh
git clone git@github.com:camunda/camunda-docs-modeler-screenshots.git
cd camunda-docs-modeler-screenshots
npm install
```

To create the respective screenshots run

```sh
npm run start
```

This will checkout the [camunda-modeler](https://github.com/camunda/camunda-modeler)
into a directory `camunda-modeler` and the [camunda-docs-manual](https://github.com/camunda/camunda-docs-manual)
into a directory `camunda-docs-manual`. It will build the Camunda Modeler (ensuring that you
  use the latest version), and then start taking the screenshots.

If you want to skip the setup steps (checkout / pull of the repositories and building
  the Camunda Modeler), you can also directly run
```
$ npm run screenshots
```

The screenshots will automatically be taken and stored within the `camunda-docs-manual`
directory structure. To update the screenshots, switch into that directory, manually review the changes,
and then potentially commit and push them.


### Script new screenshots

#### Add new screenshot repo

To add a GitHub documentation repository, which contains screenshots to be automatically updated, follow these steps:

1. Edit the `package.json` file
2. Add a new script in the following format
    * `"pull:docs-<shortName>": "git -C <repo-name> pull || git clone <repo ssh URI> <repo-name>"`
    * Example: `"pull:docs-manual": "git -C camunda-docs-manual pull || git clone git@github.com:camunda/camunda-docs-manual.git camunda-docs-manual`

#### Add new screenshot

To add a script for automated capture of a new screenshot, follow these steps:

1. Open the `takeScreenshots.js` file
2. (optional), create and save the `.bpmn` or `.dmn` file to be showcased in the `lib/fixtures/bpmn` or `lib/fixtures/dmn` directory
3. (optional), create and save a Camunda Modeler config file to be used in the `lib/fixtures/user-data` directory
    * The config file determines the window size, property-panel toggle status, property-panel width, ... state of the Camunda Modeler
    * There are various pre-defined options available already which you can re-use
    * An example looks like this:
  ```json
  {
    "workspace": {
      "endpoints": [],
      "layout": {
        "dmnOverview": {
          "open": false
        },
        "log": {
          "open": false
        },
        "propertiesPanel": {
          "open": false,
          "width": 420
        }
      }
    },
    "window": {
      "fullScreen": false,
      "maximize": false,
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 1300,
        "height": 900
      }
    }
  }
```
4. Add a new call of the `triggerScreenshots()` function to the `takeScreenshots.js` file
    * Format:
  ```js
  await triggerScreenshot('<screenshotFilePath>', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, '<diagramPath>') ],
          config = path.join(__dirname, '<configFilePath');

    modeler = await createModeler(diagramPaths, config);

    // Modeler interactions
    await modeler.click('[data-element-id="invoiceValidGateway"]');

    await modeler.takeScreenshot(filepath,  {
      x: 0,
      y: 0,
      width: 300,
      height: 150
    });
  });
  ```
5. Use CSS selectors to perform Modeler interactions (e.g., `await modeler.click('[data-element-id="invoiceValidGateway"]');`).
    * You can use the Dev Console in the Camunda Modeler to inspect elements and find out which selector to use in order to select them.
    * Various interactions (e.g., `.click`, `.doubleClick`) are available. Check out `lib/helper/createModeler` to find out more.

## Tips

### only / skip

You can use `only` to run specific screenshot tasks or `skip` to skip tasks if they are part of a batch task by wrapping them:

```js
  return [
    () => triggerScreenshot( ... ),
    {
      only: () => triggerScreenshot( ... )
    },
    {
      skip: () => triggerScreenshot( ... )
    }
  ]
```

### Error aggregation

By default, if a screenshot task fails, the process continues and an aggregated error is thrown at the end of the run.

If you want to stop the execution immediately when an error occurs, you can set the `STOP_ON_ERROR` environment variable to `true`:

```sh
export STOP_ON_ERROR=true
npm run screenshots
```

## License

MIT
