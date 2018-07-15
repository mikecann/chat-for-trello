const utils = require('nps-utils');
const concurrent = utils.concurrent;
const series = utils.series;
const open = utils.open;

// const config = require("./package.json");
// const {local,staging,prod} = config.chatfortrello;
// const setEnv = (target) => `cross-env PARSE_URL='${target.server}parse' BASE_URL='${target.web}' NODE_ENV=production`;
// const setLocalEnv = () => `cross-env PARSE_URL='${local.server}parse' BASE_URL='${local.server}'`;

const prod = {}
const staging = {}
const setEnv = () => `cross-env NODE_ENV=development`
const setProdEnv = () => `cross-env NODE_ENV=production`
const setLocalEnv = () => `cross-env NODE_ENV=development`
const getManifestVersion = () => require("./src/resources/manifest.json").version;

module.exports = {
  scripts: {
    clean: {
      dist: 'rimraf -f dist',
      built: 'rimraf -f built',
      node: 'rimraf node_modules'
    },
    build: {
      local: `${setLocalEnv()} nps build`,
      prod: `${setProdEnv()} nps build`,
      staging: `${setEnv(staging)} nps build`,
      default: {
        script: series.nps("clean.dist", "build.scripts", "build.resources"),
        hidden: true
      },
      scripts: 'webpack --config ./webpack.config.js',
      resources: 'cpx ./src/resources/**/*.* ./dist'
    },
    watch: {
      default: concurrent.nps('watch.resources', 'watch.scripts'),
      scripts: 'nps "build.scripts --watch"',
      resources: series('nps build.resources', 'onchange src/resources/**/*.* -- nps build.resources')      
    },
    deploy: {
      default: "nps deploy.prod",      
      prod: series('nps build.prod', `nps wait`, `mkdirp built && cd dist && bestzip ../built/chat-for-trello-v${getManifestVersion()}.zip .`),
      staging: series('nps build.staging', `nps wait`, `mkdirp built && cd dist && bestzip ../built/chat-for-trello-staging-v${getManifestVersion()}.zip .`),
    },
    // test: {
    //   default: 'jest',
    //   watch: "jest --watch"
    // },
    wait: "await time 5",
    dev: {
      default: `${setLocalEnv()} nps watch`,
      local: `${setLocalEnv()} nps watch`,
      prod: `${setEnv(prod)} nps watch`,
      staging: `${setEnv(staging)} nps watch`,
    }
  }
};
