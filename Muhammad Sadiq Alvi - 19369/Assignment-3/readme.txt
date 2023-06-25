How to Run:
"npm start"
APIs list:
- (POST) http://localhost:3000/signup
  Sample Request:
  For Creating admin:
  {"username": "msalviadmin", "password": "hello", "firstName": "afi", "lastName": "alvi", "email": "sadiq.alvi@systemsltd.com", "isAdmin": true}
  For Creating Non-Admin:
  {"username": "msalvi", "password": "hello", "firstName": "afi", "lastName": "alvi", "email": "sadiq.alvi@systemsltd.com", "isAdmin": false}

- (POST) http://localhost:3000/login
  Sample Request:
  {"username": "msalvi", "password": "hello"}

- (PUT) http://localhost:3000/update (update user -- Only Admin can perform this operation)
  Sample Request:
  {"username": "afi4", "password": "hello", "firstName": "afi3", "lastName": "alvi1", "email": "a@a.com"}
  Headers:
  {"x-access-token": "Admin User Token"}

- (DELETE) http://localhost:3000/delete (delete user -- Only Admin can perform this operation)
  Sample Request:
  {"username": "afi4"}
  Headers:
  {"x-access-token": "Admin User Token"}

- (POST) http://localhost:3000/create-category (Create category -- Only Admin can perform this operation)
  Sample Request:
  { "categoryTitle": "New Cat3"}
  Headers:
  {"x-access-token": "Admin User Token"}

- (POST) http://localhost:3000/create-update-product (Create category -- Only Admin can perform this operation)
  Sample Request:
  { "productTitle": "New Product 2", "categoryTitle": "New Cat", "totalInStock": 2000}
  Headers:
  {"x-access-token": "Admin User Token"}

- (POST) http://localhost:3000/add-product-to-cart (For adding products to cart)
  Sample Request:
  { "productTitle": "New Product", "quantity": 2}
  Headers:
  {"x-access-token": "Loggedin User Token"}

- (GET) http://localhost:3000/checkout (For adding products to cart)
  Headers:
  {"x-access-token": "Loggedin User Token"}

For successfully Sending Email to the user in the .env file.
Set the sender email in "TEST_EMAIL" and Sender Gmail "APPs Password (Generated from security settings)" in "TEST_EMAIL_PASSWORD"


Test Admin Account:
username: "msalviadmin"
password: "hello"

Test Normal User Account:
username: "msalvi"
password: "hello"