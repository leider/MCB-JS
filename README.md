# MCB-JS

Small Project based on vueJS and an express server. Creates E-Mails and PDFs.

To have it run locally, create two folders `MCB/config` and `MCB/data` inside your home directory.
Copy `config.json` from `configAndDataTemplates` to `config`.
Copy `addresses.json` and `treffen.json` from `configAndDataTemplates` to `data`.

In `server/views` rename `mixins-example.pug` to `mixins.pug` and update the content as you like to. 
Adapt the files' contents.



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
