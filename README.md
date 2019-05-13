# Documentation of RocketBase cloud functions

## Functions

### getAvailableModels

**Use**: Returns all available models for the given "username/modelName/label" query string.

**URL**: [https://europe-west1-rockethub.cloudfunctions.net/getAvailableModels](https://europe-west1-rockethub.cloudfunctions.net/getAvailableModels)

**Method**: GET

#### Required query parameters:

1. username - publisher of the uploaded model
   - type: string
2. modelName - name of the uploaded model
   - type: string

#### Optional query parameters:

1. label - unique version number of the published model
   - type: string

**Possible responses**:

1. Query method not allowed
   - status code: 405
   - type: text
   - data: error message stating incorrectly used query method
2. Required request parameters missing
   - status code: 400
   - type: text
   - data: "Required request parameters missing."
3. Database error
   - status code: 500
   - type: text
   - data: "Internal database error."
4. Successfully return fetched models
   - status code: 200
   - type: json []
   - data: an array with one or zero fetched models

```javascript
[
  {
    private: false,
    isPrivate: false,
    folderName: "RETINANET",
    isDefaultVersion: true,
    modelFilePath:
      "https://storage.googleapis.com/rockets-hangar/retinanet_v1b.tar",
    framework: "PyTorch",
    author: "igor",
    publicationDate: {
      _seconds: 1555505824,
      _nanoseconds: 254000000,
    },
    name: "RETINANET",
    model: "retinanet",
    version: "v1b",
  },
];
```

### getUploadCredentials

**Use**: Returns Google Storage upload credentials in json format for uploading new files.

**URL**: [https://europe-west1-rockethub.cloudfunctions.net/getUploadCredentials](https://europe-west1-rockethub.cloudfunctions.net/getUploadCredentials)

**Method**: GET

#### Required query parameters:

1. token - token of the authenticated user
   - type: string

#### Optional query parameters:

**Possible responses**:

1. Query method not allowed
   - status code: 405
   - type: text
   - data: error message stating incorrectly used query method
2. Authentication token missing
   - status code: 400
   - type: text
   - data: "Authentication token missing."
3. Successfully return fetched models
   - status code: 200
   - type: json {}
   - data: an object containing all required credentials for uploading files to Google Storage bucket
   - example:

```javascript
{
  type: "service_account",
  project_id: "rockethub",
  private_key_id: "469ccc12c6185253bff9dcc07b5e4adedb310d32",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq+x0xCWXv61fU\n4x0/xxztYapOPNn5NY+HDPekLqS85NFmyZWu7C4FaIJiv6Ln5XmQdyyay1rqk80t\n+z9T6hUzkT2RhwCpE7061xPXUBESIOU4pMbrDIYx3mFLvE6jGXScuQ2WhQJLHoXp\nHVmG3OkBD2Yqarx9938DGkq0IAU93HHbDTZIeneWKL/Gz0PLmy0T98vAFIZdXX4c\no/xPdxpjPKJX0p4M99X8Nn+I58p1rXJDzfRuJQdy4Lp+mpqWXFxFuoHFusK+fLop\ntcaVLk7I7Dvi181uczeCmRWTkCvIf+9odVPJARowT+I+c/3JdIsz8rgZZEy8td/J\nO/CLajLLAgMBAAECggEAQjARfOqEyBumVdTTPE+9mi/UZM1HKKcpkoTYjGqHBJ3/\nTdCiVO8511QkxePs4x0ELOkkq0V0inavaLBImj5pUmkqyn8YdIeW2agTcqae6FhT\nuKzRSwvwEMPu7AJStCZLbonBhhBZIQer+InH2fEHwMCxqmj+Rw0bvaf+OtZ6I34W\ndc9BSvqUQMB+XhUpSrlQySNJVh0i8pugjsE6vxdlIppyWyOoiHi8y8qBAVgBCSqI\n7imQDRanLSOkGO3GF9vy6vCr/ts8BA7C9/gG5mrJACGU0cddSrbkNpSC1cE8Y0Z4\n+Nrs2g3tenw8B/e0ANat/stX983YJyCSxrw0vzqH4QKBgQD4E01JcfrwNoOG+ie+\nvJrZ+gdo5EN8ZTyT08SkBNcSPdTgwsmDnFl6SDQXngTDMadACdqZ5KAH7pdFzM6N\nZjHJRdFQhBpa/C2HHlgK0CYQHSrIXOSI+a7VpSmYIlpqrEr8KAv+F51mMvmp255h\nznmg6ORRtu14B3KB8Aw8l8lYlwKBgQDyfLqOj6nAy7FwEY5mYnMLyWTJPT7NSYZU\nCQ5AtjWwshYW0c3dTwp0RQVj7PsR5mUF5Sfo5S0Si9jxYtXiLN18cDDD356XJC18\ngYivFptrEB92QA3LqpJcr4z7KgoRl4kKjxI4nMVk/iUmE+cHFoMdB2sN3UCi023x\nMJFW7yUp7QKBgA5fZ+nqbaR/NA2c7rKRUNNyNf2ww+wwHVtfOJRcJ23KIUxIXM6A\nP3rjNglsQVBhzxPZvk2OPmtXOnJz1D/C/P1xSxhEHxbIZ4bdjjJKLvpeBj2HjEIX\nXTbJk+hZjS2C//EuDMvS6G6kY2yg6cM26DsXYysM0yNSIyM+Gidkj+jPAoGBANoj\nMoBE5OS3WSwD3yJjtjMIPU57dh+e4OSAMP4t7CbETfLBUnygOjtWS/8UlNgJdx/S\nghCU+fMRM1wTGW2aBrWHB5dtd3Fn7jNvI9K+d5ncqzDpdn+dNoWCt0TLELu6omGJ\nS076WOj9Z9XVWaOasOBQaBHU0+ymXuT2WAjooXoRAoGAMA3q8EhqGStALcfT08dF\nCZNgZjSjc3VFBBUWv0Rs9qD8UNG2N1fOH3sN82jtmzh+pHavJd6Oo0uIna4cCYy6\navT3zwQLa9XaauGnWqe2ymXku96MoxU5xgUFWIccU+L9wEbCzVehIsQtqUfOVgg6\neKjeyPJxtOUjQne3uqNjFNo=\n-----END PRIVATE KEY-----\n",
  client_email: "rocket-upload@rockethub.iam.gserviceaccount.com",
  client_id: "100128676803279512043",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/rocket-upload%40rockethub.iam.gserviceaccount.com",
}
```

### saveNewModel

**Use**: Adds a new pre-trained rocket into the Firestore database so that it could be deployed later.

**URL**: [https://europe-west1-rockethub.cloudfunctions.net/saveNewModel](https://europe-west1-rockethub.cloudfunctions.net/saveNewModel)

**Method**: POST

#### Required query parameters:

1. modelName - name of the uploaded model
    - type: string
2. username - publisher of the uploaded model
    - type: string
3. family - indicates what category of ML tasks the model belongs to
    - type: string
4. trainingDataset - shows which academic dataset the model has been trained on
    - type: string
5. isTrainable - indicated whether the rocket is ready to be easily retrained
    - type: boolean
6. rocketRepoUrl - where the source code for the rocket came from
    - type: string
7. paperUrl - academic paper on which the architecture is built upon
    - type: string
8. originRepoUrl - where the source code of the rocket came from
    - type: string
9. description - describes what the model is used for
    - type: string
10. downloadUrl - download url to Google Storage .tar file
    - type: string
11. hash - unique hash string of the published model
    - type: string

#### Optional query parameters:

**Possible responses**:

1. Query method not allowed
   - status code: 405
   - type: text
   - data: error message stating incorrectly used query method
2. Required request parameters missing
   - status code: 400
   - type: text
   - data: "Required request parameters missing."
3. Database error
   - status code: 500
   - type: text
   - data: "Internal database error."
4. Successfully return fetched models
   - status code: 201
   - type: json {}
   - data: json object containing newly created model id
   - example:

```javascript
{ "id": "4TIHWk78j7tQ8yIVRoyI" }
```
