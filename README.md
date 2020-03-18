# Netlify Plugin RSS

Generate an RSS feed from your static html files, agnostic of static site generator!

## Demo

This is a file generated from the repo in `/demo`: https://netlify-plugin-rss.netlify.com/rss.xml

- note that it doesn't index anything outside of `/posts`: in [our plugin inputs](./netlify.toml) we specified `dirToScan` of `/posts` so only html files in that tree of folders is scanned.

## How it works

You define a folder, the plugin recursively scans everything inside, sorts by publish date, and generates the appropriate XML.

This plugin uses [Cheerio](https://github.com/cheeriojs/cheerio) to extract data from your HTML, so you can use jQuery/CSS selectors to customize how to extract your content, title, publish date, and description metadata per item.

See our [Demo](/demo/publishDir) for example of generated RSS from a `/posts` folder with nested html files.

## Usage

To install, add the following lines to your `netlify.toml` file. For best results, we recommend customizing `publishDateSelector` and `publishDateSelector`:

```toml
[[plugins]]
package = "netlify-plugin-rss"
  [plugins.inputs]
  # required configs, customize as needed
  dirToScan = "/posts" # a subfolder to scan. "/" to scan all
  authorName = "swyx"
  site_url = "https://swyx.io"
  feed_url = "https://swyx.io/rss.xml"
  title = "swyx RSS Feed"
  rssDescription = "swyx.io RSS Feed"
  categories = ['Technology', 'JAMstack', 'Web Development']

  # # optional configs, defaults shown
  # rssFaviconUrl = "https://swyx.io/favicon.png"
  # docs = "http://example.com/rss/docs.html"
  # managingEditor = "authorName"
  # webMaster = "authorName"
  # copyright = "2020 ${authorName}"
  # language = "en"
  # pubDate = "new Date().toUTCString(),"
  # ttl = "60" # aka refresh every hour

  # # cheerio selectors for extractMetadataFromFile
  # # defaults shown
  # contentSelector = "main"
  # publishDateSelector = # if not specified, we use the date of file creation
  # descriptionSelector = "meta[name=description]" # probably no need to change
  # titleSelector = "title" # probably no need to change

  # # developer configs
  # debugMode = false # (for development) turn true for extra diagnostic logging
```


### Future plans

WE ARE SEEKING MAINTAINERS. 

- limit RSS length to last X posts?
- other feature requests?
