const fs = require('fs');
const path = require('path');

// resolve all files
const PUBLISH_DIR = path.join(__dirname, 'publishDir');

// debug
// console.log({ publishDirPath, manifest });

// actual test
const pluginCore = require('../../pluginCore.js');
test('scanDir works', async () => {
  const allHtml = await pluginCore.scanDir({
    dirToScan: '/',
    PUBLISH_DIR,
    debugMode: false, // to future readers - turn this true to make pluginCore log out more stuff
    testMode: true
  });
  expect(allHtml).toMatchSnapshot();
});
