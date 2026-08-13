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
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId



## UserRouter
- GET /user/requests
- GET /user/connections
- GET /user/feed - Get you the profiles of the other user on the platform



status: ignore, interested, accpeted, rejected
