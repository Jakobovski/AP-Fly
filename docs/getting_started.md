# 1.0.  Installation
1. Using bower:  `bower install ap-fly`
2. Include `ap-fly.min.js` into your application's HTML.
3. Add `apfly` as a dependency in your Angular application.


# 1.1.  Configuration
You need to set your base API URL, so that AP-Fly knows where your RESTful resources are located.
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


### GET
```javascript
// Get all the users (GET /api/users)
$scope.users = UserService.GET();

// Get all users named John (GET /api/users?name=john)
$scope.user = UserService.GET({name:"John"});

// Get a single user id=4  (GET /api/users/5)
UserService.GET(5);

// Refresh a user with the latest data from the server. This will overwrite any properties on the user object.
$scope.user.refresh();
```


### POST and PUT
```javascript

// Save JSON object
var newUser = {name:"John Doe", age:54};
// POST /api/users/
UserService.save(newUser)

// or you can explicitly specify that you want to POST.
$scope.newUser = UserService.POST(newUser);

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
UserService.PUT(newUser);


// Or like this
var oldUser = UserService.new(oldUser);
// PUT /api/users/31
oldUser.save();
```


### DELETE
```javascript
// Delete a user
// DELETE /api/users/5
UserService.DELETE(5);
// or
UserService.DELETE(newUser);
// or
oldUser.DELETE();
```


### Other utility methods
```javascript
// Strips all AP-fly methods and properties and returns a plain JSON object.
newUser.plain();

// Refresh a user with the latest data from the server. This will overwrite any properties on the user object.
$scope.user.refresh();
```


### Use Promises or Magic
```javascript

// Use Magic
$scope.users = UserService.GET();

// Or use Promises
UserService.GET().then(function(users){
    $scope.users = users;
}, function(response){
    alert("Oops error from server");
});
```


### Relationships
Relationship are highly configurable, with sensible defaults. Here are some examples to get you started, read the reference for more information.
```javascript
$scope.user = UserService.GET(5);

// Get all the user's addresses. (GET /api/users/5/addresses)
$scope.user.child('addresses').GET();


// Edit the zipcode of the address.
$scope.user.addresses[0].zipcode = 10001;

// Now save the changes (PUT /api/users/5/addresses/1)
$scope.user.addresses[0].save();


// Create a new address.
$scope.newAddress = {street: "123 fake st.", zipcode: 10001, country: "usa"};
$scope.user.child('addresses').POST($scope.newAddress);

// Or depending on your routes (POST /api/addresses)
$scope.newAddress.userId = 5;
$scope.address = AddressService.POST(newAddress);

var user = $scope.newAddress.user;
// {name:"John Doe", age:54};

// Now lets change his age
user.age = 24;
// PUT /api/users/5
user.save();


```

** [And much much more...]()**
