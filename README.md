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
## License

MIT
