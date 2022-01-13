import {generateCucumberReport} from "typelearn1";

const {AfterAll, BeforeAll } = require('@cucumber/cucumber');




BeforeAll(async () => {
  console.log("BEFORE ALL T")
});

AfterAll(async () => {
  console.log("AFTER ALL T")
  const metaData =  {
    "App Version":"0.3.2",
    "Test Environment": "STAGING",
    "Browser": "Chrome  54.0.2840.98",
    "Platform": "Windows 10",
    "Parallel": "Scenarios",
    "Executed": "Remote"
  };
  const jsonFile: string = "report/cucumber_report.json";
  const jsonOutPutHtml: string = "report/cucumber_report.html";
  await generateCucumberReport("hierarchy", jsonFile, jsonOutPutHtml, metaData );
});