async function triggerScreenshot(name, func) {
  console.log('Creating Modeler screenshot');

  console.log(`- Taking screenshot: ${name}`);

  const modeler = await func(name);

  await modeler.close();

  console.log(`- Done: ${name}`);
}

module.exports.triggerScreenshot = triggerScreenshot;