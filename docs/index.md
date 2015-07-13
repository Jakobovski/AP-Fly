# AP-Fly Docs

## About
AP-Fly is an AngularJS service that greatly simplifies handling RESTful resources. It is the Model(from MVC) that Angular is missing. It is a very powerful, simple and intuitive. AP-fly gives you wings. 

##Pronunciation
Like API but with 'fly' at the end.

## Repository
Check out the [Github Repository](https://github.com/jakobovski/apfly)


## AP-Fly vs. Restangular
*AP-fly was inspired by Mgonto's awesome [Restangular](https://github.com/mgonto/restangular). AP-Fly has some significant differences which are intended to make working with a RESTful API even easier.*

* You must define all your resources before using them, [this provides many benefits](faq.md).
* Child and related resource are auto-magically instantiated as AP-Fly objects allowing you to use all the AP-Fly methods on them.
* Built in support for validation that works with all the major Angular validation libraries.
* Requires much less code in your controllers, making them cleaner and simpler.
* AP-Fly makes it clean and easy to define custom methods, validation, transformers and resource relationships on a per resource basis.
* AP-Fly methods and properties are placed on the `prototype` of the resource, leaving your resource pristine and seamlessly integrability with with 3rd party libraries..
