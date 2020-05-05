const fs = require('fs');
const path = require('path');

// resolve all files
const PUBLISH_DIR = path.join(__dirname, 'publishDir');
const dirToScan = '/blog';
// debug
// console.log({ publishDirPath, manifest });

// actual test
const pluginCore = require('../../pluginCore.js');
test('generateRSS works', async () => {
  const rssFeed = await pluginCore.generateRSS({
    dirToScan,
    PUBLISH_DIR,
    authorName: 'swyx',
    site_url: 'https://swyx.io',
    feed_url: 'https://swyx.io/rss.xml',
    rssFaviconUrl: 'https://swyx.io/favicon.png',
    title: 'swyx RSS Feed',
    rssDescription: 'swyx.io RSS Feed',
    // docs: 'http://example.com/rss/docs.html'
    // managingEditor = authorName,
    // webMaster = authorName,
    // copyright = new Date().getFullYear() + ' ' + authorName,
    // language = 'en',
    categories: ['Technology', 'JavaScript', 'React', 'Svelte'],
    // pubDate = new Date().toUTCString(),
    // ttl = '60' // at most refresh every hour http://www.therssweblog.com/?guid=20070529130637

    // // options for extractMetadataFromFile
    contentSelector: '.singlePost',
    publishDateSelector: '.postDate'

    // debugMode: false, // to future readers - turn this true to make pluginCore log out more stuff
    // testMode: true
  });
  expect(rssFeed).toMatchSnapshot();
});
