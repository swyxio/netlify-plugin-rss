const fs = require('fs');
const path = require('path');

// resolve all files
const fileToRead = path.join(__dirname, 'blog1.html');

// debug
// console.log({ publishDirPath, manifest });

// actual test
const pluginCore = require('../../pluginCore.js');
test('extractMetadataFromFile works', async () => {
  const metadata = await pluginCore.extractMetadataFromFile({
    fileToRead,
    debugMode: false, // to future readers - turn this true to make pluginCore log out more stuff
    testMode: true
  });
  expect(metadata).toMatchSnapshot();
});
