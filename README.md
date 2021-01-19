# camunda-docs-modeler-screenshots

Update screenshots of the [Camunda Modeler](https://github.com/camunda/camunda-modeler)
used in the [docs](https://docs.camunda.org/manual/latest/modeler/).

## Usage

Use this repo to update the screenshots of the Camunda Modeler used in the
[docs](https://docs.camunda.org/manual/latest/modeler/). This is handy once there
have been basic UX / Style changes in the Modeler.

To create the respective screenshots run
```
$ npm run start
```

This will checkout the [camunda-modeler](https://github.com/camunda/camunda-modeler)
into a directory `camunda-modeler` and the [camunda-docs-manual](https://github.com/camunda/camunda-docs-manual)
into a directory `camunda-docs-manual`.

The screenshots will automatically be taken and stored within the `camunda-docs-manual`
directory structure. To update the screenshots, switch into that directory, manually review the changes,
and then potentially commit and push them.

## License

MIT
