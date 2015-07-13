# 2.0. API Reference
---------------------------------------

## 2.1. CRUD Methods
---------------------------------------
### getId(id, parameters)
Performs a HTTP GET operation to the URL associated with the given service. 
> `id`  *Integer or String (required)*. If an `id` is passed to the function then it will perform a get to `/api/users/:id`.

>`parameters` *key, value object (optional)*. Parameters should be an object with key values that will be used as query parameters.

> `returns` A promise that resolves into an instantiated apfly object.

**Examples:**
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

---------------------------------------
### get(resource, parameters)
Same as `getId()` except that it performs a GET to `resource.id`. Will throw an error if `resource` does not have its own `id` property.

---------------------------------------
### getList(paramaters)
Same as `getId()` except that it performs a GET to the resource route without an `id` and returns an array. 

**Examples:**
```javascript
// GET all users
// GET /api/users
$scope.allUsers = UserService.getList().$object;

// Use promises
// GET /api/users?name=john
UserService.getList({name:'john'}).then(function(user){
    $scope.oneUser = user;
}, function(error){
    alert('Something went wrong');
});
```

---------------------------------------
### post(resource)
Performs an HTTP POST to the URL associated with the given service. 
>`resource` (required). Can be an AP-Fly object or plain Javascript object. The returned object will be instantiated as an apfly object. The response needs to be returned as the object passed is not updated. Use `save(resource)` to automatically update the passed object.

> `returns` A promise that resolves into an instantiated apfly object.

**Examples:**
```javascript
// Create a new user
$scope.newUser = {name:"John Doe", age:54};
UserService.post($scope.newUser);

// Use promises
UserService.post($scope.newUser).then(function(response){
    $scope.newUser = response;
}, function(response){
    alert('Error: Something went wrong');
});

// Use magic

$scope.newUser = UserService.post($scope.newUser).$object;
```

---------------------------------------
### put(resource)
Performs an HTTP PUT to the URL associated with the given service. 
>`resource` (required). Can be an apfly object or a plain Javascript object. The object must have an id. The returned object will be instantiated as an apfly object. The response needs to be returned as the object passed is not updated. Use `save(resource)` to automatically update the passed object.

> `returns` A promise that resolves into an instantiated apfly object.

**Examples:**
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


---------------------------------------
### delete(resourceOrId)
Performs an HTTP DELETE to the URL associated with the given service. 
> `resourceOrId:`   *Integer, String or Object (optional)*. If `resourceOrId` is an Integer or String then a `DELETE` will be performed to `/api/users/:resourceOrId`. If `resourceOrId` is an object then a `DELETE` will be performed to `/api/users/:resourceOrId.id`. If nothing is passed then a `DELETE` will be performed to the `id` of the object that the method is being called on.

> `returns` A promise that resolves into an instantiated apfly object.

**Examples:**
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


---------------------------------------
### save(resource)
Performs an HTTP POST or PUT to the URL associated with the given service. 
>`resource` (required). Can be an apfly object or a plain Javascript object. If the object has an `id` then a `PUT` will be performed, else `POST`. The returned object will be instantiated as an apfly object. 

> `returns` A promise that resolves into an instantiated apfly object.

*WARNING:* The object passed (or the object the method is being called on) is automatically updated from the API's response. There is no need to assign the returned value.

**Examples:**
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


---------------------------------------
### refresh()
Performs an HTTP get to the URL associated with the given service. Overwrites all the properties on the object.
> `returns` A promise that resolves into an instantiated apfly object. 

**Examples:**
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
---------------------------------------
## 2.2. Utility Methods
---------------------------------------

### plain()
Returns a plain Javascript object that is stripped of all apfly methods and properties.

---------------------------------------
### new(object)
Creates a new apfly object of the given resource type or instantiates the passed object as a apfly resource of the given type.
>`object:` *object (optional)* 
>> If a resource is passed it will instantiate that resource as an apfly object, otherwise returns a new apfly object of the given service
>> **Note:** This method does not make an calls to the API.

**Examples:**
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
---------------------------------------


## 2.2. Configuration: Global
---------------------------------------
### Apfly.setBaseUrl(string)
Accepts a string to use as the base URL of all requests.

**Examples:**
```javascript
// Configuring your API URL.
// So that all request start with '/api'
angular.module('my-app').run(function(Apfly) {
    Apfly.setBaseUrl("/api")
)};
```
---------------------------------------
### Apfly.setResponseExtractor(function(response, httpMethod)){})
This is an optional configuration option. This allows you to transform every response from the API. This is often used for dealing with pagination.
>`method` will be either 'POST', 'PUT', 'DELETE' or 'GET'

**Examples:**
```javascript
/*
    In this example every response from the server has a data, metadata and a message property. 
    Like this:  {data:{}, metadata:{color:'blue'}, message: 'Success'}
    This function will place the metadata and message values onto the data. 
    This will work for arrays and individual resources.
*/
Apfly.setResponseExtractor(function(response, httpMethod) {
    if (response.data){
        var data = response.data.data;
        data._metadata = response.data.metadata;
        data._message = response.data.message;
        return data;
    }
});


$scope.user = UserService.getId(33).$object;

console.log($scope.user._metadata);
// {color: 'blue'}
console.log($scope.user.message);
// Success
```
---------------------------------------
### Apfly.setErrorTransformer(function(response, httpMethod){})
This is an optional configuration option. This allows you to transform every response from the API that fails in an error in a specified way.
>`method` will be either 'POST', 'PUT', 'DELETE' or 'GET'

**Examples:**
```javascript
/*
    This will return a user friendly message that can be displayed.
*/
Apfly.setErrorTransformer(function(response, httpMethod){
    var error = {};
    error.source = httpMethod + " " + this.resourceUrl();
    error.errorText = response.data.message;

    var method_friendly = "getting";
    if (httpMethod === 'PUT' || httpMethod === 'POST'){
        method_friendly = 'saving';
    }
    else if (httpMethod === 'DELETE'){
        method_friendly = 'deleting'
    }
    error.userText = "Error " + method_friendly + " " + this.resource + ".";
    response._error = error;
    return $q.reject(response);
});
```

---------------------------------------
## 2.3 Configuration: Resource Level
---------------------------------------
### createService(options)
// The service is an object or array with all the restangular properties
// Parameters: 
//     - resource: ''  (is both resource name and path) (required)
//     - customPrototypeConstructor: function(resource){}
//     - namesOnParentObject: []
//     - isInstanceOf: Object


### setPostDeliver(function(object, httpMethod))
This is an optional configuration option. The function passed will be called after every call to the API and passed the response from the API. This is a way to transform resources that are returned from the API. The function must return the transformed object.

**Examples:**
```javascript
angular.module('my-app').factory('UserService', function(Apfly) {
    UserService = Apfly.createService({resource: 'users'})

    UserService.setPostDeliver(function(resource, httpMethod) {
        resource.fullName = resource.firstName + " " + resource.lastName;
        return resource;
    });

    return UserService;
});
```

---------------------------------------
### setPreDeliver(function(object, httpMethod))
This is an optional configuration option. The function passed will be called after before each call to the API and passed the value of the resource being sent to the API. This is a way to transform resources before the are `POST` or `PUT`  to the API. The function must return the transformed object.

**Examples:**
```javascript
angular.module('my-app').factory('UserService', function(Apfly) {
    UserService = Apfly.createService({resource: 'users'})

    UserService.setPreDeliver(function(resource, httpMethod) {
        resource.fullName = resource.firstName + " " + resource.lastName;
        return resource;
    });

    return UserService;
});
```
---------------------------------------

## 2.4 Relationship Methods
### addChild()

### child()

---------------------------------------


























