# AP-Fly Docs

## About
AP-Fly is an AngularJS service that greatly simplifies handling RESTful resources. It is the Model(from MVC) that Angular is missing. It is a very powerful, simple and intuitive and may give you wings. 

##Pronunciation
Like API but with 'fly' at the end.

## Repository
Check out the [Github Repository](https://github.com/jakobovski/apfly)


## AP-Fly vs. Restangular
*AP-fly was inspired by the awesome [Restangular](https://github.com/mgonto/restangular). AP-Fly has some significant differences which are intended to make working with a RESTful API even easier.*

* You must define all your resources before using them, [this provides many benefits...]().
* Child and related resource are auto-magically instantiated as AP-Fly objects allowing you to use all the AP-Fly methods on them.
* Built in support for validation that works with all the major Angular validation libraries.
* Requires less code in your controllers, making them cleaner and simpler.
* AP-Fly is intended to allow simpler customization on a per resource basis. Its easy to define custom methods, transformers and resource relationships on a per resource basis.
* AP-Fly methods and properties are placed on the `prototype` of the resource, leaving your resource clean and easier to integrate with 3rd party tools.
