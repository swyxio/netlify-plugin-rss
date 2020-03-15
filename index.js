const path = require('path');
const fs = require('fs');
const pluginCore = require('./pluginCore');
const { promisify } = require('util');
const chalk = require('chalk');

module.exports = function netlifyPlugin(conf) {
  return {
    name: 'netlify-plugin-rss',
    /* index html files preDeploy */
    onPostBuild: async ({
      pluginConfig: {
        dirToScan,
        rssFeedPath = path.join(dirToScan, '/rss.xml'),
        ...rest
      },
      constants
      // utils: { build }
    }) => {
      const { BUILD_DIR } = constants; // from netlify build or testing fixture
      dirToScan = dirToScan ? path.join(BUILD_DIR, dirToScan) : BUILD_DIR;
      console.log(`Scanning ${chalk.yellow(rssFeedPath)} for RSS Feed`);
      const rss = await pluginCore.generateRSS({
        dirToScan,
        ...rest
      });
      console.log(
        `attempting to write RSS feed to ${chalk.yellow(rssFeedPath)}...`
      );
      fs.writeFileSync(path.join(BUILD_DIR, rssFeedPath), rss);
      console.log(
        `Successfully wrote RSS feed to ${chalk.yellow(rssFeedPath)}`
      );
    }
  };
};
