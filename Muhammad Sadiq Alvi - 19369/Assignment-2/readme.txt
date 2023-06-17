Run 'npm start'

For Signup:
- POST Request
- url: http://localhost:3000/signup
- sample body request: {"username": "afi", "password": "hello", "firstName": "afi", "lastName": "alvi", "email": "a@a.com"}

For Login:
- POST Request
- url: http://localhost:3000/login
- sample body request: {"username": "afi", "password": "hello"}

For Update:
- PUT Request
- url: http://localhost:3000/update
- sample body request: {"username": "afi", "password": "hello", "firstName": "afi1", "lastName": "alvi", "email": "a@a.com"}
- Request Headers: {"x-access-token" : `JW TOKEN`}

For Delete:
- DELETE Request
- url: http://localhost:3000/delete
- sample body request: {"username": "afi"}
- Request Headers: {"x-access-token" : `JW TOKEN`}