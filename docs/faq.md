# FAQ

### On asynchronous methods when does the object get updated, and when does it not?
If an object is passed to a method then a new object is always returned. If nothing is passed then the object that the method is being called on is updated. For example
` UserService.post({id:3})` returns a new object, but `person.save()` will simply update the person object.


### Why are the advantages of requiring the creation of services for each resource?
>**TLDR:**  Your controllers are much cleaner and you can write less code.

1.    **DRY**. By defining resources in one location you are saved from having resource URLs scattered throughout your code. If you ever want to change a resource URL it only needs be done in one place.
2.    **Relationship magic**. By defining how resources are related to one another in services it allow AP-Fly to knows what URL to request and how to cast the responses. It also allows AP-Fly to add transformers and utility methods to child resources automatically, even if the request comes from the parent.
3.    **Validation**. Its trivial to add custom validation to any service that interacts seamlessly with the popular Angular validation libraries. No need to define validation on per form, per field basis. 
4.    **Custom methods**. Often we need to write utility or transformer methods for our resources. A common scenario is transforming dates from an API. Maybe we need to convert an epoch time string to a Javascript Date, or change timezones from UTC to local. By placing the transformer methods in the service, we can automatically transform our resource and keep our controllers clean.
5.    **Testing**.   Its much easier to test a slew of controllers, resources, utility methods and their various interactions when they are all in the same place and their relationships and interactions are pre-defined.
