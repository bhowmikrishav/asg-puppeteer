### API based Puppeteer implmentation to crawl tigerdirect.com review

**By, Rishav Bhowmik**

This project is build on typescript, So you may require to execute commands below to start the server.

I have deveploded this in my windows 10 machine, so please review scripts in package.json file if you are on diffrent enviroment.

```sh
npm i
npm run build
npm run start
```

No need to install typescript globaly.

#### Deploying on production

```sh
npm i
npm run build
npm prune --production 
npm run start
```

#### Overview

The TS source is in `src/` folder.

###### `src/crawler.ts`

Puppeteer implmentation to crawl tigerdirect.com review

###### `src/server.ts`

Node JS HTTP server to handle API requests and access the crawler.


On running `npm run build` or `tsc` compiled JS is available in `dist/` folder.

#### Testing

To execute the functional test, run `npm run test`.

No need to install mocha globally.
