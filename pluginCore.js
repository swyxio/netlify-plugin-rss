const path = require('path');
const urljoin = require('url-join');
const fs = require('fs');
const cheerio = require('cheerio');
const RSS = require('rss');
const { promisify } = require('util');
const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const chalk = require('chalk');

exports.generateRSS = async function(opts) {
  // combines scanDir and extractMetadataFromFile
  // returns RSS
  const PUBLISH_DIR = opts.PUBLISH_DIR; // eg 'publish'
  const dirToScan = opts.dirToScan; // eg '/blog'
  const authorName = opts.authorName; // eg 'myname'
  const site_url = opts.site_url; // eg 'https://swyx.io',
  const feed_url = `${site_url}/rss.xml`; // may want to make this configurable in future
  const {
    title,
    description = opts.rssDescription || 'RSS Feed for ' + site_url,
    image_url = opts.rssFaviconUrl,
    docs,
    managingEditor = authorName,
    webMaster = authorName,
    copyright = new Date().getFullYear() + ' ' + authorName,
    language,
    categories,
    pubDate = new Date().toUTCString(),
    ttl // at most refresh every hour http://www.therssweblog.com/?guid=20070529130637
  } = opts;
  const feed = new RSS({
    title,
    description,
    feed_url,
    site_url,
    image_url,
    docs,
    managingEditor,
    webMaster,
    copyright,
    language,
    categories,
    pubDate,
    ttl
  });
  const filesToScan = await exports.scanDir({ dirToScan, PUBLISH_DIR });
  if (!opts.testMode) {
    console.log(
      `Found ${chalk.yellow(filesToScan.length)} files in ${chalk.blue(
        'dirToScan'
      )}: ${chalk.yellow(dirToScan)}`
    );
  }
  const outputs = await Promise.all(
    filesToScan
      .map(async (filepath) => {
        const res = await exports.extractMetadataFromFile({
          fileToRead: path.join(PUBLISH_DIR, dirToScan, filepath),
          ...opts
        });
        res.filepath = filepath;
        return res;
      })
      .sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate))
  );

  outputs.forEach((item) => {
    feed.item({
      title: item.title,
      url: urljoin(
        site_url,
        opts.prefix || '', // optional! TODO: document!
        // path.relative(item.filepath, dirToScan)
        path.join(dirToScan, item.filepath)
      ),
      description: item.description,
      date: item.publishDate,
      // todo: enclosure?
      custom_elements: item.contents && [
        {
          'content:encoded': {
            _cdata: item.contents
          }
        }
      ]
    });
  });
  return feed.xml();
};

exports.extractMetadataFromFile = async function({
  fileToRead,
  contentSelector, // any css selector works
  publishDateSelector, // if null, use date created
  // probably wont change these
  descriptionSelector,
  titleSelector,
  testMode = false, // if true, silence warnings that would normally be logged, for test running aesthetics
  debugMode // if true, log more things for plugin debugging
}) {
  const readHTML = await readFile(fileToRead);
  const $ = cheerio.load(readHTML);
  let publishDate;
  if (publishDateSelector) {
    publishDate = $(publishDateSelector).html();
  } else {
    // no publishDate specified, use file created date
    const {
      birthtime // created time
      // mtime // modified time
    } = fs.statSync(fileToRead);
    publishDate = birthtime;
  }
  // // not as reliable?
  const title = $(titleSelector).text();
  const contents = $(contentSelector).html();
  const output = {
    title,
    contents,
    description: $(descriptionSelector).attr('content'),
    publishDate
    // URL is also important but we expect you to insert that elsewhere
  };
  if (debugMode) console.log({ output });
  return output;
};

exports.scanDir = async function({
  PUBLISH_DIR,
  dirToScan,
  testMode = false, // if true, silence warnings that would normally be logged, for test running aesthetics
  debugMode = false // if true, log more things for plugin debugging
}) {
  let allHtmlFiles = await walk(path.join(PUBLISH_DIR, dirToScan));
  return allHtmlFiles.map((filepath) =>
    path.relative(path.join(PUBLISH_DIR, dirToScan), filepath)
  );
};

// recursive crawl to get a list of filepaths
// https://gist.github.com/kethinov/6658166
var walk = async function(dir, filelist) {
  var files = await readDir(dir);
  filelist = filelist || [];
  await Promise.all(
    files.map(async function(file) {
      const dirfile = path.join(dir, file);
      if (fs.statSync(dirfile).isDirectory()) {
        filelist = await walk(dirfile + '/', filelist);
      } else {
        // swyx modified
        if (dirfile.endsWith('.html')) filelist.push(dirfile);
      }
    })
  );
  return filelist;
};
