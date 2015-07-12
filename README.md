## TEMPORARY STAGING AREA FOR THIS REPO THIS REPO WILL BE DELETED AND REPLACED WITH CLEAN HISTORY WHEN READY.


# AP-Fly
*(pronounced: API with 'fly' at the end)*

AP-Fly is an AngularJS service that greatly simplifies handling RESTful resources. It provides a customizable scaffolding for defining, accessing and modifying RESTful resources. As they say at the energy drink company: AP-Fly gives you wings.


## Documentation
[Read the docs](http://ap-fly.readthedocs.org/en/latest/) for detailed information on using AP-fly.

## Quick Overview
**Use promises or magic**
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


**CRUD**
```javascript
// Get all the users (GET /api/users)
$scope.users = UserService.getList().$object;

// Get all users named John (GET /api/users?name=john)
$scope.user = UserService.getList({name:"John"}).$object;

// Get a single user id=4  (GET /api/users/5)
$scope.user = UserService.getId(5).$object;

// Save a new user
var newUser = {name:"John Doe", age:54};
$scope.newUser = UserService.post(newUser).$object;

// Delete a user
UserService.delete(5);
// or
UserService.delete(newUser);
// or
newUser.delete();

// Update a user
newUser.age = 23;
newUser.save();
// or
UserService.put(newUser);

// Reloads the object from the API
newUser.refresh();

// Strips all AP-fly methods and properties and returns plain JSON object.
newUser.plain();
```


**Relationships**
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

**[And so much more...]()**



## Installation
1. Using bower:  `bower install ap-fly`
2. Include `ap-fly.min.js` into your application's HTML.
3. Add `apfly` as a dependency in your Angular application.


## Differences between AP-Fly and Restangular
*AP-Fly was inspired by the awesome [Restangular](https://github.com/mgonto/restangular). AP-Fly has some significant differences which are intended to make working with a RESTful API even easier.*

* You must define all your resources before using them, [this provides many benefits]().
* Child and related resource are auto-magically instantiated as AP-Fly objects allowing you to use all the AP-Fly methods on them.
* Simpler and cleaner methods.
* AP-fly is intended to allow simpler customization on a per resource basis. Its easy to define custom methods, transformers and resource relationships on a per resource basis.
* AP-fly methods and properties are placed on the `prototype` of the resource, leaving your resource clean and easier to integrate with 3rd party tools.



## Feedback
Love the project? Give it a star! Need a feature, found a bug? Create an issue, or better yet create a pull request.


## CONTRIBUTING
See CONTRIBUTING.md

## License
MIT
