# Anonymous Chat App

Anonymous-Chat-App with node.js

## Prerequisites

Set mongodb url inside config folder or set env variable ```process.env.MONGODB_URL="MONGO_URL"```

#####Why mongoDb ?
To persist user presence not chats logs.
## Installing

DEV install both server and client dependencies



```
#curren dir ./ :- npm install
#inside client ./client :- npm install
npm run dev
```

PROD build the client bundle and start the server
```
npm run prod
```

#Demo

Demo will work two or more user connected at the same time

[Anon Chat In Node](http://anon-chat-in-node.herokuapp.com/) - Anon Chat In Node


#Todo

- [ ] Add Redis alternative to MongoDb
- [ ] Add Picture Sending Support