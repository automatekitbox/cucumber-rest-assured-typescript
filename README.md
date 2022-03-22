# cucumber-rest-assured-typescript
cucumber-rest-assured-typescript for rest api automation

## Build
npm run clean-build
or
npm run build

## Run feature files
npm run service-test  src/features/*.features

- single file

npm run service-test  src/features/user-service.feature

## NOTE if you are using WINDOWS , change below target in package.json

"service-test": "cucumber-js --publish stepDefinitions --require build/src/support/hooks.js --require src/stepDefinitions/*.ts -f json:./report/cucumber_report.json --require-module ts-node/register --exit"

## To Generate Cucumber Report

npm run report


## Rest-Assured Documentation

Please refer docs folder, clone repo and open index.html from Doc folder for rest api documentation

Refer: npm package that is used

https://www.npmjs.com/package/rest-assured-ts



