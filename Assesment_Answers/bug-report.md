Bug Report 1: Unauthorized use of another business's quote ID
Critical severity
High priority
Title: Business A can create a draft delivery using Business B's quote ID.
Field
Details
Environment
Delivery Sandbox API – Local (http://localhost:4000), API testing via Postman
Preconditions
Business A and Business B have separate authenticated accounts. Business B has successfully generated a delivery quote. Business A knows Business B's quote ID.
Steps to reproduce
1. Authenticate using Business A's credentials.
2. Generate a delivery quote using Business B's account and obtain its quote ID.
3. Authenticate using Business A's credentials.
4. Submit a create-draft-delivery request using Business B's quote ID.
5. Inspect the API response and verify whether a draft delivery is created.
6. Retrieve the draft delivery details and verify the associated business and quote IDs.
Expected result
The API must verify that the supplied quote ID belongs to the authenticated business. Business A must not be allowed to create a draft delivery using Business B's quote. The API should reject the request with an appropriate authorization error, such as 403 Forbidden or a suitably non-disclosing 404 Not Found.
Actual result
Business A can successfully create a draft delivery using Business B's quote ID. The API returns 200 OK, indicating that the ownership of the quote is not being properly enforced.
Severity
Critical
Priority
High
Evidence
Request A
curl --location 'http://localhost:4000/api/v1/deliveries' \
--header 'Authorization: Bearer efb05beea34b73e6436c98672b9af3a3' \
--header 'Content-Type: application/json' \
--header 'Idempotency-Key: qa-delivery-001' \
--data '{
  "pickup": {
    "name": "string",
    "phone": "08031234567",
    "address": "string"
  },
  "dropoff": {
    "name": "string",
    "phone": "08031234567",
    "address": "string"
  },
  "package": {
    "description": "string",
    "weight_kg": 0.1
  },
  "quote_id": "quo_4540af365e0e"
}'

Response:
{
    "id": "del_04ed26b066a1",
    "business_id": "biz_1",
    "status": "draft",
    "fee": 1520,
    "currency": "NGN",
    "pickup": {
        "name": "string",
        "phone": "08031234567",
        "address": "string"
    },
    "dropoff": {
        "name": "string",
        "phone": "08031234567",
        "address": "string"
    },
    "package": {
        "description": "string",
        "weight_kg": 0.1
    },
    "courier_id": null,
    "created_at": "2026-11-16T13:02:27.715Z",
    "history": [
        {
            "at": "2026-11-16T13:02:27.715Z",
            "status": "draft"
        },
        {
            "at": "2026-11-16T13:02:48.951Z",
            "status": "pending"
        },
        {
            "at": "2026-11-16T13:03:45.553Z",
            "status": "assigned"
        },
        {
            "at": "2026-11-16T13:04:00.672Z",
            "status": "picked_up"
        }
    ]
}

curl --location 'http://localhost:4000/api/v1/deliveries' \
--header 'Authorization: Bearer efb05beea34b73e6436c98672b9af3a3' \
--header 'Content-Type: application/json' \
--header 'Idempotency-Key: qa-delivery-001' \
--data '{
  "pickup": {
    "name": "string",
    "phone": "08031234567",
    "address": "string"
  },
  "dropoff": {
    "name": "string",
    "phone": "08031234567",
    "address": "string"
  },
  "package": {
    "description": "string",
    "weight_kg": 0.1
  },
  "quote_id": "quo_4540af365e0e"
}'


Response:
{
    "id": "del_04ed26b066a1",
    "business_id": "biz_1",
    "status": "draft",
    "fee": 1520,
    "currency": "NGN",
    "pickup": {
        "name": "string",
        "phone": "08031234567",
        "address": "string"
    },
    "dropoff": {
        "name": "string",
        "phone": "08031234567",
        "address": "string"
    },
    "package": {
        "description": "string",
        "weight_kg": 0.1
    },
    "courier_id": null,
    "created_at": "2026-11-16T13:02:27.715Z",
    "history": [
        {
            "at": "2026-11-16T13:02:27.715Z",
            "status": "draft"
        },
        {
            "at": "2026-11-16T13:02:48.951Z",
            "status": "pending"
        },
        {
            "at": "2026-11-16T13:03:45.553Z",
            "status": "assigned"
        },
        {
            "at": "2026-11-16T13:04:00.672Z",
            "status": "picked_up"
        }
    ]
}

Severity justification: Critical because one business can access and use another business's quote, potentially compromising data ownership and delivery transaction integrity.
Priority justification: High because this is an authorization vulnerability in the core delivery creation workflow and should be fixed before production release.


Bug report 2: Improper Error Message for malformed or missing package weight 

Details:

Environment
Delivery Sandbox API – Local (http://localhost:4000), tested via Postman

Preconditions
An authenticated business account is available.
Steps to reproduce
1. Authenticate as a business.
2. Submit a quote request without the weight field.
3. Repeat with weight set to null.
4. Repeat with a text value such as "heavy".
5. Repeat with another invalid non-numeric value.
6. Inspect the API response and validation error message.

Expected result
The API should reject invalid weight values and return a clear, meaningful validation message explaining the accepted weight range, for example: "Weight must be between 0.1kg and 50kg."
Actual result
The API rejects the invalid weight input, but the returned or displayed validation error message is incorrect, unclear, or does not properly explain the validation requirement.
Severity
Medium
Priority
Medium

Evidence:
Screen Shot in Test Report

Severity justification: Medium because validation works, but poor error feedback affects usability and makes it difficult for users to understand and correct invalid input.
Priority justification: Medium because the issue does not prevent backend validation but should be fixed to improve error handling and user experience.

Bug report 3: Quote API accepts invalid pickup or drop-off address details
High severity
High priority
Field
Details
Title
Quote API fails to validate missing or invalid pickup and drop-off address details.
Environment
Delivery Sandbox API – Local (http://localhost:4000), API testing via Postman
Preconditions
An authenticated business account is available.
Steps to reproduce
1. Authenticate as a business.
2. Send a quote request without the pickup address.
3. Submit invalid coordinates or address identifiers.
4. Inspect the API responses and generated quote details.
Expected result
The API should reject missing or invalid pickup and drop-off location details with clear validation errors. It must not generate a quote using incomplete or invalid location data.
Actual result
The API fails to properly reject invalid or incomplete location details, allowing quote requests to proceed.
Severity
High
Priority
High
Evidence
ScreenShot in Bug report
Severity justification: High because invalid location data can result in incorrect delivery routes, failed deliveries, and operational losses.
Priority justification: High because delivery location accuracy is essential to the core delivery workflow.

