# takoyaki_api

## /api/auth
|기능|http method|uri|req_body|req_params/decodes|
|:---:|:---:|:---:|:---:|:---:|
|회원가입|post| /signup|id(user),password, name|x|
|아이디 중복확인|get|/checkId|id(user)|x|
|로그인|post| /login|id(user), password|x|
|로그아웃|post| /logout|x|x|

## /api/type
|기능|http method|uri|req_body|req_params/decoded|
|:---:|:---:|:---:|:---:|:---:|
|음식종류보여주기|get|/|x|x|
|음식종류추가하기|post|/|name, number|x|

## /api/user
|기능|http method|uri|req_body|req_params/decoded|
|:---:|:---:|:---:|:---:|:---:|
|내가좋아하는가게  보여주기|get|/like|x|id(user)|
|내가좋아하는가게  등록|post|/like|storeId|id(user)|
|내가게보여주기|get|/store|x|id(user)|
|내정보수정|put|/|password, name|id(user)|
|내가좋아하는가게  수정(삭제)|delete| /like/:storeId|x|userId, storeId|
|회원탈퇴|delete|/|x|userId|


## /api/store
|기능|http method|uri|req_body|req_params/decoded|
|:---:|:---:|:---:|:---:|:---:|
|가게등록|post|/|title,  type,  location: {address,  latitude,  longitude},  time,  description|id(user)  (내가게등록위해)|
|메뉴등록|patch|/:storeId/item|menu, price, photo|storeId|
|가게보여주기(거리)|get| /:latitude/:longtitude/:latitudeDelta/:longitudeDelta|x|latitude, longtitude, latitudeDelta, longitudeDelta|
|가게보여주기(거리+음식종류)|get| /:latitude/:longtitude/:latitudeDelta/:longitudeDelta/:typeNumber|x|latitude, longtitude, latitudeDelta, longitudeDelta, typeNumber|
|가게정보수정|put|/:storeId|title, type, location:{address, latitude,  longitude}, time, description|storeId|
|메뉴수정|patch|/:storeId/item/:itemIndex|menu, price, photo|storeId, itemIndex|
|내가게삭제(가게삭제)|delete|/:storeId|x|storeId,id(userId)|
|메뉴삭제|delete| /:storeId/item/:itemIndex|x|storeId, itemIndex|
