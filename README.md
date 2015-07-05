# AP-Fly
*(pronounced: API with 'fly' at the end)*

AP-Fly is an AngularJS service that simplifies modeling and communicating with RESTful APIs and resources.

## Inspiration
AP-Fly was inspired by [Restangular](https://github.com/mgonto/restangular) but has some significant differences which are intended to make working with a RESTful API even easier. These differences fall into two categories, functional and design. The functional differences make using AP-Fly require fewer lines of code and more intuitive and cleaner code. The design changes are intended to encourage best practices be requiring developers to define their models, and routes in one location instead of littering it over the code base. 


## 30 Second Docs
```
// Get all the users (GET /api/users)
UserService.GET();

// Get all users named john (GET /api/users?name=john)
UserService.GET({name:"john"});

// Get a single user id=4  (GET /api/users/5
UserService.GET(5);

// Save a new user
var newUser = {name:"John Doe", age:54};
newUser = UserService.POST(newUser);

// Delete a user
UserService.DELETE(5);
// or
UserService.DELETE(newUser);
// or
newUser.DELETE();

// Update a user
newUser.age = 23;
newUser.save();
// or
UserService.PUT(newUser);


// Use promises or magic
$scope.user = UserService.GET(5);
// or
UserService.GET(5).then(function(response){
    $scope.user = response;
}, function(response){
    //Handle the error
});




```


## Installation
1. Using bower:  `bower install ap-fly`
2. Include `ap-fly.min.js` into your application's HTML
3. Add `apfly` as a dependency of your Angular module


## Documentation
[Read the docs]()

## Demo
[Check out the demo!](http://plnkr.co/edit/XbDYKrM2QUf8g1ubTHma?p=preview)


## Features



## Why?
Despite Angular's awesomeness, dealing with RESTFul APIs and resources is rather annoying. This library effectively wraps your API and does a lot of magic behind the scene allowing you to write clean, concise and consistent code. 


## Feedback
Love the project? Give it a star! Need a feature, found a bug? Create an issue, or better yet create a pull request.



## CONTRIBUTING
See CONTRIBUTING.md

## License
MIT
