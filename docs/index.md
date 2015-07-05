# AP-Fly Docs

## About
AP-Fly is an AngularJS service that greatly simplifies handling RESTful resources. AP-Fly give you wings.

## Repository
[Github Repository](https://github.com/jakobovski/ap-fly)


## Pronunciation
Like API but with 'fly' at the end.


## Differences between AP-Fly and Restangular
*AP-Fly was inspired by the awesome [Restangular](https://github.com/mgonto/restangular). AP-Fly has some significant differences which are intended to make working with a RESTful API even easier.*

* You must define all your resources before using them, [this provides many of benefits...]().
* Child and related resource are auto-magically instantiated as AP-Fly objects allowing you to use all the AP-Fly methods on them.
* Simpler and cleaner methods.
* AP-fly is intended to allow simpler customization on a per resource basis. Its easy to define custom methods, transformers and resource relationships on a per resource basis.
* AP-fly methods and properties are placed on the `prototype` of the resource, leaving your resource clean and easier to integrate with 3rd party tools.
