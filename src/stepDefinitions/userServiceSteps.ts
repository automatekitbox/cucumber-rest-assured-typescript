import {DataTable, Then, When} from "@cucumber/cucumber";
import {
  isValidJson,
  prettyPrintJSON,
  readJsonToString,
  restRequest, sendRequestBodyAsJsonFile,
  validateJsonResponse, validateJsonResponseFile
} from "rest-assured-ts";
import {UserServiceUtils} from "../utils/userserviceutils";


const chai = require('chai');
const expect = chai.expect;

let response: any;

Then(/^GET api end point "([^"]*)"$/, {timeout: 6 * 5000}, async (url: string) => {


  const headerOptions = JSON.stringify({ "Authorization": "accessTokenConstants.authToken",
    "Content-Type": "application/json"});
  response = await restRequest("https://gorest.co.in/public-api/users", {
    headerOptions: JSON.parse(headerOptions),
    httpMethod: "GET", timeOut: 20000
  });
  console.log("GET User response " + Object.keys(response));
  console.log("GET User response " + prettyPrintJSON(JSON.parse(response.body)) );

});


Then(/^verify status code "([^"]*)"$/, {timeout: 6 * 5000}, async (expectedStatusCode: string) => {

  expect(response.statusCode.toString()).to.be.equal(expectedStatusCode,
    `Expected statusCode: ${expectedStatusCode} but actual status code: ${response.statusCode.toString()} `);


});



When(/^POST api end point "([^"]*)" is sent to create user for user-service as a file "([^"]*)"$/,
  {timeout: 2 * 5000}, async (url: string, jsonFilepath: string) => {



    console.log("POST URL " + url);
    const requestBodyAsJsonString: string = await readJsonToString(jsonFilepath);
    console.log( `REQUEST Body  ${prettyPrintJSON(JSON.parse(requestBodyAsJsonString))}`);
    const headerOptions = JSON.stringify({"Authorization": "accessTokenConstants.authToken"});
    response = await restRequest(url, {
      headerOptions: JSON.parse(headerOptions),
      httpMethod: "POST", inputBody: requestBodyAsJsonString, timeOut: 20000
    });
    const responseBody = JSON.parse(response.body);
    console.log(`Post Response: ${prettyPrintJSON(responseBody)}`);
    console.log(response.statusCode.toString());

  });


Then(/^validate user-service response includes$/, {timeout: 6 * 5000}, async (dt: DataTable) => {

  //Use util file to read DataTable , it helps for huge response or request body

  const readFeatureDataTable: string[][] = dt.rows();
  const expectedMap: Map<string, any> = new Map<string, any>();
  for (let [key, value] of readFeatureDataTable) {
    expectedMap.set(key, value);
  }
  validateJsonResponse(JSON.parse(response.body), expectedMap);
});

Then(/^validate user-service response against json response file "([^"]*)"$/, {timeout: 6 * 5000}, async (jsonResponseFilePath: string) => {

  //Use util file to read DataTable , it helps for huge response or request body
  await validateJsonResponseFile(jsonResponseFilePath, JSON.parse(response.body));
});

Then(/^validate user-service response against json response file with dynamic values "([^"]*)"$/, {timeout: 6 * 5000},
  async (jsonResponseFilePath: string, dataTable: DataTable) => {

  const expectedValuesFromResponseMap: Map<string, any> = await UserServiceUtils.readOrReplaceExpectedValuesFromResponse(dataTable);
  await validateJsonResponseFile(jsonResponseFilePath, JSON.parse(response.body), expectedValuesFromResponseMap);
});


When(/^POST api end point "([^"]*)" is sent to create user for user-service as a json file "([^"]*)"$/,
  {timeout: 2 * 5000}, async (url: string, jsonFilepath: string, dataTable: DataTable) => {



    console.log("POST URL " + url);
    const replaceKeyValueMap: Map<string, any> = await UserServiceUtils.replaceKeyValuePairFromDataTable(dataTable);
    const requestBodyAsJsonString: string = await sendRequestBodyAsJsonFile(jsonFilepath, replaceKeyValueMap);
    //Note: Cross check request body whether values replaced for specified keys(json path)
    //Note: request json file never gets changed as working on JSON object
    console.log( `Replaced REQUEST Body  ${prettyPrintJSON(JSON.parse(requestBodyAsJsonString))}`);
    const headerOptions = JSON.stringify({"Authorization": "accessTokenConstants.authToken"});
    response = await restRequest(url, {
      headerOptions: JSON.parse(headerOptions),
      httpMethod: "POST", inputBody: requestBodyAsJsonString, timeOut: 10000
    });
    const responseBody = JSON.parse(response.body);
    console.log(`Post Response: ${prettyPrintJSON(responseBody)}`);
    console.log(response.statusCode.toString());

  });



When(/^POST api endpoint is sent with the url "([^"]*)" for user service$/,
  {timeout: 2 * 5000}, async (url: string, inputRequestBody: string) => {


    const requestBody: string = inputRequestBody.replace("{expected_first_name}", "replaceMyName");
    console.log("RequestBody as string" + inputRequestBody);
    const headerOptions = JSON.stringify({"Authorization": "accessTokenConstants.authToken"});
    response = await restRequest(url, {
      headerOptions: JSON.parse(headerOptions),
      httpMethod: "POST", inputBody: requestBody, timeOut: 10000
    });
    const responseBody = JSON.parse(response.body);
    console.log(`Post Response: ${prettyPrintJSON(responseBody)}`);
    console.log(response.statusCode.toString());
  });


When(/^PUT api endpoint is sent with the url "([^"]*)" for user service$/,
  {timeout: 2 * 5000}, async (url: string, inputRequestBody: string) => {


    const requestBody: string = inputRequestBody.replace("{expected_first_name}", "replaceMyName");
    console.log("Update RequestBody as string" + inputRequestBody);
    const headerOptions = JSON.stringify({"Authorization": "accessTokenConstants.authToken"});
    if( await isValidJson(response.body)) {
      response = await restRequest(url, {
        headerOptions: JSON.parse(headerOptions),
        httpMethod: "PUT", inputBody: requestBody, timeOut: 10000
      });
      const responseBody = JSON.parse(response.body);
      console.log(`PUT Response: ${prettyPrintJSON(responseBody)}`);
    } else {
      console.log(`PUT Response: ${response.body}`);
    }
    console.log(response.statusCode.toString());
  });

When(/^DELETE api endpoint is sent with the url "([^"]*)" for user service$/,
  {timeout: 2 * 5000}, async (url: string) => {

    const headerOptions = JSON.stringify({"Authorization": "accessTokenConstants.authToken"});
    response = await restRequest(url, {
      headerOptions: JSON.parse(headerOptions),
      httpMethod: "DELETE", timeOut: 10000
    });

    if( await isValidJson(response.body)) {
      const responseBody = JSON.parse(response.body);
      console.log(`DELETE Response: ${prettyPrintJSON(responseBody)}`);
    } else {
      console.log(`DELETE Response: ${response.body}`);
    }


    console.log("STATUS CODE " + response.statusCode.toString());
  });