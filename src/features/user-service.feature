Feature: Sample feature file implementation

  #Note: BaseURLs use in env file(dotenv package) and in feature file only path ex: /public-api/users
  #Not do not use property files or inside code for urls since, then it helps you to understand cucumber report for failure
  # or pass scenarios for which endpoint
  #cucmber feature file nothing but text files , so you can use for test data and urls, in case request bod is huge ,
  # use external json files
  #Note reponse can be validated with direct key names(without complete jsonpath) but i recommand better to use complete json path
  #Try to avoid using index 0 , 1 example data[0] data[1] uses data[*], depends on requirement

  Scenario Outline: Create item with SKU using store item service
    Given GET api end point "<url>"
    Then verify status code "<status_code>"
    And validate user-service response includes
      | json_path_parameter | json_parameter_value             |
      | name                | Enakshi Tandon                   |
      | email               | naik_chandra@lockman-wiegand.net |
    #multiple values validation
    # |data[*].name         |name1; name2                       |

    Examples:
      | url                                   | status_code |
      | https://gorest.co.in/public-api/users | 200         |


  Scenario Outline: Make GET call and validate actual response against JSon response file (In case json response always static)
    Given GET api end point "<url>"
    Then verify status code "<status_code>"
    And validate user-service response against json response file "<json_response_file_path>"


    Examples:
      | url                                   | status_code | json_response_file_path    |
      | https://gorest.co.in/public-api/users | 200         | testData/userresponse.json |

    #if we use data[*], values replaces in multiple places, use * when retrieving multiple records(ex: Get users, GET Transactions
  #Suppose if I make POST request code as 400 then I expect 400 in actual response , but JSon response file is template with any code
  # different situations we create different codes and validates based on what we created
  Scenario Outline: Make GET call and validate actual response against JSon response file with replacing values that are changing
    Given GET api end point "<url>"
    Then verify status code "<status_code>"
    And validate user-service response against json response file with dynamic values "<json_response_file_path>"
      | json_path_parameter | json_path_parameter_value |
      | code                | 400                       |
      | data[*].id          | 900                       |
      | data[0].name        | {expected_first_name}     |

    Examples:
      | url                                   | status_code | json_response_file_path    |
      | https://gorest.co.in/public-api/users | 200         | testData/userresponse.json |



#Where request bosy sending as JSon file (static values), below scenario changing few key
  Scenario Outline: Send request body as a json file to create a user
    Given POST api end point "<url>" is sent to create user for user-service as a file "<json_file>"
    Then validate user-service response includes
      | json_path_parameter | json_parameter_value  |
      | code                | 401                   |
      | data.message        | Authentication failed |

    Examples:
      | url                                   | json_file          |
      | https://gorest.co.in/public-api/users | testData/user.json |

#Note request Json file consider as template , file converted to json object then replacing values on it,
# so object mutations not changing file values
  #{expected_first_name} going to replace this value inside code (random or hardcoded)
  #phone number replacing in feature file , actual json file phone number is  "0123-4567-8910" but replacing to 34567
  Scenario Outline: Send request body as a json file with replacing values for specified keys
    Given POST api end point "<url>" is sent to create user for user-service as a json file "<json_file>"
      | json_path_parameter    | json_path_parameter_value |
      | firstName              | {expected_first_name}     |
      | phoneNumbers[1].number | 34567                     |
    Then validate user-service response includes
      | json_path_parameter | json_parameter_value  |
      | code                | 401                   |
      | data.message        | Authentication failed |

    Examples:
      | url                                   | json_file          |
      | https://gorest.co.in/public-api/users | testData/user.json |


    #Sending json string as request body without changing any values
  Scenario Outline: Create a user
    Given POST api endpoint is sent with the url "<url>" for user service
      """
      {
        "firstName": "John",
         "lastName" : "doe",
         "age"      : 26,
         "address"  : {
         "streetAddress": "naist street",
         "city"         : "Nara",
         "postalCode"   : "630-0192"
       },
      "phoneNumbers": [
        {
          "type"  : "iPhone",
          "number": "0123-4567-8888"
        },
        {
          "type"  : "home",
          "number": "0123-4567-8910"
        }
      ]
    }
      """
    Then validate user-service response includes
      | json_path_parameter | json_parameter_value  |
      | code                | 401                   |
      | data.message        | Authentication failed |

    Examples:
      | url                                   |
      | https://gorest.co.in/public-api/users |



    #Sending json string as request body with replacing firstName inside code
  #{expected_first_name} replacing value before making rest request
  Scenario Outline: Create a user
    Given POST api endpoint is sent with the url "<url>" for user service
      """
      {
        "firstName": "{expected_first_name}",
         "lastName" : "doe",
         "age"      : 26,
         "address"  : {
         "streetAddress": "naist street",
         "city"         : "Nara",
         "postalCode"   : "630-0192"
       },
      "phoneNumbers": [
        {
          "type"  : "iPhone",
          "number": "0123-4567-8888"
        },
        {
          "type"  : "home",
          "number": "0123-4567-8910"
        }
      ]
    }
      """
    Then validate user-service response includes
      | json_path_parameter | json_parameter_value  |
      | code                | 401                   |
      | data.message        | Authentication failed |

    Examples:
      | url                                   |
      | https://gorest.co.in/public-api/users |


      #Sending json string as request body with replacing firstName inside code
  #{expected_first_name} replacing value before making rest request
  Scenario Outline: Create a user
    Given PUT api endpoint is sent with the url "<url>" for user service
      """
      {
        "firstName": "updateName"
        }
      """
    Then validate user-service response includes
      | json_path_parameter | json_parameter_value  |
      | code                | 401                   |
      | data.message        | Authentication failed |

    Examples:
      | url                                   |
      | https://gorest.co.in/public-api/users |

  Scenario: Create a user
    Given DELETE api endpoint is sent with the url "https://gorest.co.in/public-api/users" for user service