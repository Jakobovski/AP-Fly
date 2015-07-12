# 1.0.  Installation
1. Using bower:  `bower install ap-fly`
2. Include `ap-fly.min.js` into your application's HTML.
3. Add `apfly` as a dependency in your Angular application.


# 1.1.  Configuration
You need to set your base API URL so that AP-Fly knows where your RESTful resources are located.
```javascript
angular.module('my-app').config(function(ApflyProvider) {
    ApflyProvider.setBaseUrl("/api")
)};
```


# 1.2.  Basic Usage
### Registering a Resource
Before you can use a resource you need to create a service that represents it. This may at first seem like unnecessary work but there are [many good reasons for it]().
```javascript
angular.module('my-app').factory('UserService', function(Apfly) {
    UserService = Apfly.createService({resource: 'users'})
    return UserService;
});
```


### 1.2.1. GET
```javascript
// Get all the users (GET /api/users)
UserService.getList();

// Get all users named John (GET /api/users?name=john)
UserService.getList({name:"John"});

// Get a single user id=5  (GET /api/users/5)
$scope.user = UserService.getId(5).$object;

// Refresh a user with the latest data from the server. This will overwrite any properties on the user object.
$scope.user.refresh();
```


### 1.2.2. POST and PUT
```javascript
// Save JSON object
$scope.newUser = {name:"John Doe", age:54};
// POST /api/users/
UserService.save(newUser);

// or you can explicitly specify that you want to POST.
UserService.post(newUser);

// You can also do it like this:
// Instantiate a blank user resource
var newUser = UserService.new();
newUser.name = "John Doe";
newUser.age = 54;
// POST /api/users/
newUser.save();


// PUTing

// Once the user has been saved on server, you can update the object and simply call .save() 
// PUT /api/users/31  (where newUser.id == 31)
newUser.age = 23;
newUser.save();

// Or like this.
var oldUser = {id: 31, name:'John Old', age:25};
// PUT /api/users/123
UserService.put(newUser);


// Or like this
var oldUser = UserService.new(oldUser);
// PUT /api/users/31
oldUser.save();
```


### 1.2.3. DELETE
```javascript
// Delete a user
// DELETE /api/users/5
UserService.delete(5);
// or
UserService.delete(newUser);
// or
oldUser.delete();
```


### 1.2.4. Use Promises or Magic
```javascript
// Use Magic
$scope.users = UserService.getList().$object;

// Or use Promises
UserService.getList().then(function(users){
    $scope.users = users;
}, function(response){
    alert("Oops error from server");
});
```



### 1.2.4. Some utility methods
```javascript
// Strips all AP-fly methods and properties and returns a plain JSON object.
newUser.plain();

// Refresh a user with the latest data from the server. This will overwrite any properties on the user object.
$scope.user.refresh();
```



### 1.2.5. Relationships
Relationship are highly configurable, with sensible defaults. Here are some examples to get you started, read the reference for more information.
```javascript
// Relationship are highly configurable, with sensible defaults.
// Here are some examples.
$scope.user = UserService.getId(5).$object;

// Get all the user's addresses. (GET /api/users/5/addresses)
$scope.user.child('addresses').getList();


// Edit the zipcode of the address.
$scope.user.addresses[0].zipcode = 10001;

// Now save the changes (PUT /api/users/5/addresses/1)
$scope.user.addresses[0].save();

// Create a new address.
$scope.newAddress = {street: "123 fake st.", zipcode: 10001, country: "usa"};
$scope.user.child('addresses').post($scope.newAddress);

// Or depending on your routes (POST /api/addresses)
newAddress.userId = 5;
$scope.address = AddressService.post(newAddress).$object

console.log($scope.newAddress.user)
// {name:"John Doe", age:54};

// Now lets change his age
$scope.newAddress.user.age =24;
$scope.newAddress.user.save();
```

** [And much much more...]()**

