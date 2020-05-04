const path = require('path');
const fs = require('fs');
const pluginCore = require('./pluginCore');
const { promisify } = require('util');
const chalk = require('chalk');

module.exports = function netlifyPlugin(conf) {
  return {
    /* index html files preDeploy */
    onPostBuild: async ({
      constants: { BUILD_DIR },
      inputs: {
        dirToScan,
        rssFeedPath = path.join(BUILD_DIR, '/rss.xml'),
        ...rest
      }
      // utils: { build }
    }) => {
      console.log(`Scanning ${chalk.yellow(rssFeedPath)} for RSS Feed`);
      const rss = await pluginCore.generateRSS({
        dirToScan,
        BUILD_DIR,
        ...rest
      });
      console.log(
        `attempting to write RSS feed to ${chalk.yellow(rssFeedPath)}...`
      );
      fs.writeFileSync(rssFeedPath, rss);
      console.log(
        `Successfully wrote RSS feed to ${chalk.yellow(rssFeedPath)}`
      );
    }
  };
};
