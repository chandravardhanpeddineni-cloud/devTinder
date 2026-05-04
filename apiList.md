# DevTinder API'S

## AuthRouter
- POST /signup
- POST /login
- POST /logout

## ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password     

## ConnectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored /:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId


## UserRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Get you the profiles of the other user on the platform



status: ignore, interested, accpeted, rejected
