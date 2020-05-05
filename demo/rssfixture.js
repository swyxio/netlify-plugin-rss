const fs = require('fs');
const path = require('path');

const netlifyPlugin = require('../index.js');

// actual test
// you can run this or you can run `npm run build`
(async () => {
  const initPlugin = netlifyPlugin();
  console.log(`running ${initPlugin.name}`);
  // mock everything from netlify build
  await initPlugin.onPostBuild({
    // from netlify.yml
    pluginConfig: {
      dirToScan: '/blog',
      rssFeedPath: '/rss.xml',
      authorName: 'swyx',
      site_url: 'https://swyx.io',
      feed_url: 'https://swyx.io/rss.xml',
      rssFaviconUrl: 'https://swyx.io/favicon.png',
      title: 'swyx RSS Feed',
      rssDescription: 'swyx.io RSS Feed',
      categories: ['Technology', 'JavaScript', 'React', 'Svelte'],

      // // options for extractMetadataFromFile
      contentSelector: '.singlePost',
      publishDateSelector: '.postDate'
    },
    constants: {
      // have to mock this too
      PUBLISH_DIR: 'demo/publishDir'
    }
  });
})();
