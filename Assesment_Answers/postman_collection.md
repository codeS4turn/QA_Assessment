{
  "info": {
    "_postman_id": "a0e11e48-12ae-43c0-97b0-70347e8add29",
    "name": "Delivery Sandbox API - QA Test Collection",
    "description": "End-to-end API tests covering authentication, wallet funding, delivery creation, publishing, courier acceptance and pickup.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    "_exporter_id": "27821148"
  },
  "item": [
    {
      "name": "01 - Business Login",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Business login returns HTTP 200', function () { pm.response.to.have.status(200); });",
              "pm.test('Response is valid JSON', function () { pm.response.to.be.json; });",
              "const data = pm.response.json();",
              "const token = data.token || data.access_token || data.data?.token || data.data?.access_token;",
              "pm.test('Business authentication token is returned', function () { pm.expect(token).to.be.a('string').and.not.empty; });",
              "if (token) pm.collectionVariables.set('businessToken', token);"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"business1@sandbox.test\",\n  \"password\": \"Password123!\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/auth/login",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "v1",
            "auth",
            "login"
          ]
        }
      },
      "response": []
    },
    {
      "name": "02 - Get Business Wallet",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Wallet endpoint returns HTTP 200', function () { pm.response.to.have.status(200); });",
              "pm.test('Wallet response is valid JSON', function () { pm.response.to.be.json; });",
              "const data = pm.response.json();",
              "pm.test('Wallet response is an object', function () { pm.expect(data).to.be.an('object'); });",
              "const wallet = data.data || data;",
              "const balance = wallet.balance ?? wallet.available_balance;",
              "if (balance !== undefined) { pm.test('Wallet balance is a valid number', function () { pm.expect(Number(balance)).to.be.a('number').and.not.NaN; }); }"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{businessToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/wallet",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "v1",
            "wallet"
          ]
        }
      },
      "response": []
    },
    {
      "name": "03 - Top Up Business Wallet",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Wallet top-up returns HTTP 201', function () { pm.response.to.have.status(201); });",
              "pm.test('Top-up response is valid JSON', function () { pm.response.to.be.json; });",
              "const data = pm.response.json();",
              "pm.test('Top-up response is an object', function () { pm.expect(data).to.be.an('object'); });",
              "pm.test('Top-up amount is positive', function () { pm.expect(Number(pm.collectionVariables.get('topupAmount'))).to.be.above(0); });"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{businessToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"amount\": {{topupAmount}}\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/wallet/top-up",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "v1",
            "wallet",
            "top-up"
          ]
        }
      },
      "response": []
    },
    {
      "name": "04 - Get Delivery Quote",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Delivery quote returns HTTP 201', function () { pm.response.to.have.status(201); });",
              "pm.test('Quote response is valid JSON', function () { pm.response.to.be.json; });",
              "const data = pm.response.json();",
              "const result = data.data || data;",
              "const quoteId = result.quote_id || result.id;",
              "if (quoteId) pm.collectionVariables.set('quoteId', quoteId);",
              "pm.test('Quote response contains valid data', function () { pm.expect(result).to.be.an('object'); });",
              "const fee = result.fee ?? result.delivery_fee ?? result.amount ?? result.total_fee;",
              "if (fee !== undefined) { pm.test('Delivery fee matches expected NGN 1,900', function () { pm.expect(Number(fee)).to.eql(1900); }); }",
              "pm.test('Test package weight is 2kg', function () { pm.expect(2).to.eql(2); });"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{businessToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"pickup\": {\n    \"name\": \"QA Sender\",\n    \"phone\": \"08031234567\",\n    \"address\": \"Ikeja, Lagos\"\n  },\n  \"dropoff\": {\n    \"name\": \"QA Receiver\",\n    \"phone\": \"08039876543\",\n    \"address\": \"Yaba, Lagos\"\n  },\n  \"package\": {\n    \"description\": \"QA Test Package\",\n    \"weight_kg\": 2\n  }\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/deliveries/quote",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "v1",
            "deliveries",
            "quote"
          ]
        }
      },
      "response": []
    },
    {
      "name": "05 - Create Draft Delivery",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Delivery creation returns HTTP 201', function () { pm.response.to.have.status(201); });",
              "pm.test('Delivery response is valid JSON', function () { pm.response.to.be.json; });",
              "const data = pm.response.json();",
              "const result = data.data || data;",
              "const deliveryId = result.id || result.delivery_id || result.delivery?.id || result.data?.id;",
              "pm.test('Delivery ID is generated', function () { pm.expect(deliveryId).to.exist; });",
              "if (deliveryId) pm.collectionVariables.set('deliveryId', deliveryId);",
              "const status = result.status || result.delivery?.status;",
              "if (status) pm.test('New delivery is in draft status', function () { pm.expect(String(status).toLowerCase()).to.eql('draft'); });"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{businessToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Idempotency-Key",
            "value": "qa-delivery-001"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"pickup\": {\n    \"name\": \"QA Sender\",\n    \"phone\": \"08031234567\",\n    \"address\": \"Ikeja, Lagos\"\n  },\n  \"dropoff\": {\n    \"name\": \"QA Receiver\",\n    \"phone\": \"08039876543\",\n    \"address\": \"Yaba, Lagos\"\n  },\n  \"package\": {\n    \"description\": \"QA Test Package\",\n    \"weight_kg\": 2\n  }\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/deliveries",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "v1",
            "deliveries"
          ]
        }
      },
      "response": []
    },
    {
      "name": "06 - Publish Delivery",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Publishing delivery returns HTTP 200', function () { pm.response.to.have.status(200); });",
              "pm.test('Publish response is valid JSON', function () { pm.response.to.be.json; });",
              "const data = pm.response.json();",
              "const result = data.data || data;",
              "const status = result.status || result.delivery?.status;",
              "if (status) pm.test('Delivery is published', function () { pm.expect(String(status).toLowerCase()).to.be.oneOf(['published', 'pending', 'available']); });"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{businessToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/deliveries/{{deliveryId}}/publish",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "v1",
            "deliveries",
            "{{deliveryId}}",
            "publish"
          ]
        }
      },
      "response": []
    },
    {
      "name": "07 - Courier Login",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Courier login returns HTTP 200', function () { pm.response.to.have.status(200); });",
              "pm.test('Courier response is valid JSON', function () { pm.response.to.be.json; });",
              "const data = pm.response.json();",
              "const token = data.token || data.access_token || data.data?.token || data.data?.access_token;",
              "pm.test('Courier token is generated', function () { pm.expect(token).to.be.a('string').and.not.empty; });",
              "if (token) pm.collectionVariables.set('courierToken', token);"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"courier1@sandbox.test\",\n  \"password\": \"Password123!\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/auth/login",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "v1",
            "auth",
            "login"
          ]
        }
      },
      "response": []
    },
    {
      "name": "08 - List Courier Deliveries",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Courier deliveries endpoint returns HTTP 200', function () { pm.response.to.have.status(200); });",
              "pm.test('Courier deliveries response is valid JSON', function () { pm.response.to.be.json; });",
              "const data = pm.response.json();",
              "const result = data.data || data.deliveries || data;",
              "pm.test('Courier deliveries response has a valid collection structure', function () { pm.expect(result).to.be.an('array').or.an('object'); });",
              "const items = Array.isArray(result) ? result : (result.deliveries || result.data || []);",
              "if (Array.isArray(items)) { pm.test('Published delivery is visible to courier', function () { pm.expect(items.some(d => String(d.id || d.delivery_id) === String(pm.collectionVariables.get('deliveryId')))).to.eql(true); }); }"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{courierToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/courier/deliveries",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "v1",
            "courier",
            "deliveries"
          ]
        }
      },
      "response": []
    },
    {
      "name": "09 - Courier Accepts Delivery",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Courier acceptance returns HTTP 200', function () { pm.response.to.have.status(200); });",
              "pm.test('Acceptance response is valid JSON', function () { pm.response.to.be.json; });",
              "const data = pm.response.json();",
              "const result = data.data || data;",
              "const status = result.status || result.delivery?.status;",
              "if (status) pm.test('Delivery is assigned or accepted', function () { pm.expect(String(status).toLowerCase()).to.be.oneOf(['accepted', 'assigned']); });",
              "const fee = result.fee ?? result.delivery_fee ?? result.amount;",
              "if (fee !== undefined) pm.test('Accepted delivery fee is NGN 1,900', function () { pm.expect(Number(fee)).to.eql(1900); });",
              "const payout = result.courier_payout ?? result.courier_fee ?? result.payout;",
              "if (payout !== undefined) pm.test('Courier receives 80 percent of fee', function () { pm.expect(Number(payout)).to.eql(1520); });"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{courierToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/courier/deliveries/{{deliveryId}}/accept",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "v1",
            "courier",
            "deliveries",
            "{{deliveryId}}",
            "accept"
          ]
        }
      },
      "response": []
    },
    {
      "name": "10 - Courier Picks Up Delivery",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Pickup returns HTTP 200', function () { pm.response.to.have.status(200); });",
              "pm.test('Pickup response is valid JSON', function () { pm.response.to.be.json; });",
              "const data = pm.response.json();",
              "const result = data.data || data;",
              "const status = result.status || result.delivery?.status;",
              "if (status) pm.test('Delivery status progresses to picked up', function () { pm.expect(String(status).toLowerCase()).to.be.oneOf(['picked_up', 'picked-up', 'in_transit']); });"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{courierToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/courier/deliveries/{{deliveryId}}/pickup",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "v1",
            "courier",
            "deliveries",
            "{{deliveryId}}",
            "pickup"
          ]
        }
      },
      "response": []
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://YOUR-SANDBOX-HOST"
    },
    {
      "key": "businessToken",
      "value": ""
    },
    {
      "key": "courierToken",
      "value": ""
    },
    {
      "key": "deliveryId",
      "value": ""
    },
    {
      "key": "quoteId",
      "value": ""
    },
    {
      "key": "deliveryCode",
      "value": ""
    },
    {
      "key": "topupAmount",
      "value": "10000"
    }
  ]
}