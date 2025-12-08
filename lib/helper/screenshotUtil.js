
async function triggerScreenshot(name, func) {
  console.log('Creating Modeler screenshot');

  console.log(`- Taking screenshot: ${name}`);

  const modeler = await func(name).catch(err => {
    console.log(`- Failed: ${name}`);
    err.failureName = name;

    // re-throw error to allow customizable error aggregation
    throw err;
  });

  await modeler.close();

  console.log(`- Done: ${name}`);
}

module.exports.triggerScreenshot = triggerScreenshot;