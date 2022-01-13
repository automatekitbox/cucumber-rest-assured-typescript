import {DataTable} from "@cucumber/cucumber";

export class UserServiceUtils {

  //Request body replacement
  public static async replaceKeyValuePairFromDataTable(responseFields: DataTable): Promise<Map<string, string>> {

    const readFeatureDataTable: string[][] = responseFields.rows();
    const responseMap: Map<string, string> = new Map();
    for (let [key, value] of readFeatureDataTable) {
      if (value.toString().includes("{expected_first_name}")) {
        value = "replaceName"; //Generate random depends upon your requirement
      }
      responseMap.set(key, value);
    }

    return responseMap;
  }

  //Response validation and replacement of expected values Do not mix request and response validations together into single method
  public static async readOrReplaceExpectedValuesFromResponse(responseFields: DataTable): Promise<Map<string, string>> {

    //Expected values nothing but data that used to create or update and you can store data in world variables if needed
    const readFeatureDataTable: string[][] = responseFields.rows();
    const responseMap: Map<string, string> = new Map();
    for (let [key, value] of readFeatureDataTable) {
      if (value.toString().includes("{expected_first_name}")) {
        value = "replaceName"; //Generate random depends upon your requirement
      }
      responseMap.set(key, value);
    }

    return responseMap;
  }


}