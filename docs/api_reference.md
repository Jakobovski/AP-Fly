# 2.0. API Reference

## 2.1. CRUD Methods

### GET(id, parameters)
Performs a HTTP GET operation to the URL associated with the given service. 
> `id:`  *Integer or String (optional)*.
>> If an `id` is passed to the function then it will perform a get to `/api/users/:id` if no id is passed a GET is performed to `/api/users`.

>`parameters` *key, value object (optional)*
>> Parameters should be an object with key values that will be used as query parameters.

> `returns` A promise that resolves into an instantiated ap-fly object or array.

>**Examples:**
```javascript
// GET all users
$scope.allUsers = UserService.getList().$object;

// GET user with id == 33
$scope.oneUser = UserService.getId(33).$object; 

// GET all users aged 99
$scope.oldUsers = UserService.getList{age:99}}).$object;  

// GET all users aged 99 or 98
// GET /api/users?age=99&age=98
$scope.oldUsers = UserService.getList({age:[99,98]}).$object;  


// Use promises
UserService.getId(33).then(function(user){
    $scope.oneUser = user;
}, function(error){
    alert('Something went wrong');
});
```


### POST(resource)
Performs an HTTP POST to the URL associated with the given service. 
>`resource` (required). Can be an ap-fly object or plain json. If plain json the object will be instantiated as an ap-fly object. No need to return the object as the object itself is updated.

> `returns` A promise that resolves into an instantiated ap-fly object.

>**Examples:**
```javascript
// Create a new user
$scope.newUser = {name:"John Doe", age:54};
UserService.post($scope.newUser);

// Use promises
UserService.post($scope.newUser).then(function(user){
    // Do something
}, function(error){
    alert('Something went wrong');
});
```


### PUT(resource)
Performs an HTTP PUT to the URL associated with the given service. 
>`resource` (required). Can be an ap-fly object or plain json. The object must have an id. If plain json the object will be instantiated as an ap-fly object. No need to return the object as the object itself is updated.

> `returns` A promise that resolves into an instantiated ap-fly object.

>**Examples:**
```javascript
// Create a new user
$scope.existingUser = {id: 23, name:"John Doe", age:54};
UserService.put($scope.existingUser);

// Use promises
UserService.put($scope.existingUser).then(function(user){
    // Do something
}, function(error){
    alert('Something went wrong');
});
```



### DELETE(id, resource)
Performs an HTTP DELETE to the URL associated with the given service. 
> `id:`  *Integer or String (optional)*.
>> If an `id` is passed to the function then it will perform a DELETE to `/api/users/:id`

>`resource:` *object (optional)* 
>> Object must have an id property. If an object is passed with an id property than a delete will be performed to `api/users/:resource.id`
> `returns` A promise.

> If no arguments are passed than a DELETE will be performed to self. if the object has an ID then it will be performed to that id, or to the resource url.

>**Examples:**
```javascript
// Performs DELETE to /api/users/33
UserService.delete(33);

// Performs DELETE to /api/users/33
UserService.delete({id:33, name:'john'});

// GET user with id == 33
$scope.oneUser = UserService.getId(33).$object; 
// Performs DELETE to /api/users/33
$scope.oneUser.delete();

// Use promises
UserService.delete(33).then(function(response){
    // Do something
}, function(error){
    alert('Something went wrong');
});
```



### SAVE(resource)
Performs an HTTP DELETE to the URL associated with the given service. 
>`resource:` *object (optional)* 
>> If an object is passed with an id property than a PUT will be performed to `api/users/:resource.id` otherwise a POST will be performed to `/api/users`

> `returns` A promise that resolves into an instantiated ap-fly object.

> If no arguments are passed than a PUT or POST will be performed to self. if the object has an id then it will be performed to that id, or to the resource url.

>**Examples:**
```javascript
// Performs POST to /api/users
UserService.save({name:'john'});

// Performs PUT to /api/users/33
UserService.save({id:33, name:'john'});

// GET user with id == 33
$scope.oneUser = UserService.getId(33).$object; 
// Performs PUT to /api/users/33
$scope.oneUser.save();

// Use promises
$scope.oneUser.save(33).then(function(response){
    // Do something
}, function(error){
    alert('Something went wrong');
});
```



### refresh()
Performs an HTTP get to the URL associated with the given service. Overwrites current object with data from the API.
> `returns` A promise that resolves into an instantiated ap-fly object. 

> If no arguments are passed than a PUT or POST will be performed to self. if the object has an id then it will be performed to that id, or to the resource url.

>**Examples:**
```javascript
$scope.oneUser = UserService.getId(33).$object; 
// Refresh a user with the latest data from the server. This will overwrite any properties on the user object.
$scope.oneUser.refresh();

// Use promises
$scope.oneUser.refresh().then(function(response){
    // Do something
}, function(error){
    alert('Something went wrong');
});
```

## 2.2. Utility Methods

### plain()
Returns a plain JSON object that is a copy of the resource striped of ap-fly methods. 

### new(object)
Creates a new apfly object of the given resource type or instantiates the passed object as a apfly resource of the given type.
>`object:` *object (optional)* 
>> If a resource is passed it will instantiate that resource as an apfly object, otherwise returns a new apfly object of the given service

>**Examples:**
```javascript
var newUser = UserService.new();
newUser.name = "John Doe";
newUser.age = 54;
// POST /api/users/
newUser.save();

// or
var newUser = {name:"John Doe", age:54};
UserService.new(newUser);
newUser.save(); 
```


## 2.2. Global Configuration Methods
### ApflyProvider.setBaseUrl(string)
### ApflyProvider.setResponseExtractor(function(response, httpMethod)){})
### ApflyProvider.setErrorTransformer(function(response, httpMethod){})


## 2.3 Resource level configuration methods
### setPostDeliver
### setPreDeliver
### addChild()


























