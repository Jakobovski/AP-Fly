angular.module('apfly').factory('APFly', function($http, $q, AppConfig) {

    var BaseModelPrototype = function() {
        this.baseUrl = "";
        this.errorTransformer = function(response, method){return $q.reject(response);};
        this.responseExtractor = function(response){return response;};
        this._children = {};

        this.setBaseUrl = function(url){
            this.__proto__.baseUrl = url;
        };
        this.setErrorTransformer = function(errorTransformer){
            this.__proto__.errorTransformer = errorTransformer;
        };
        this.setResponseExtractor = function(responseExtractor){
            this.__proto__.responseExtractor = responseExtractor;
        };
        this.setPostDeliver = function(new_function){
            this.__proto__.postDeliver = new_function;
        };

        this._assign = function(destination, source){
            // Remove all properties from this object
            _.forOwn(destination, function(value, key) {
                delete destination[key]
            });
           
           return _.assign(destination, source);
        }

        this.resourceUrl = function() {
            if (this.__proto__ && this.__proto__.resourceUrl) {
                if (this.hasOwnProperty('resource')){
                    return this.resourceUrl.call(this.__proto__) + "/" + this.resource;
                }
                else if (this.hasOwnProperty('id')){
                    return this.resourceUrl.call(this.__proto__) + "/" + this.id;
                }
                else {
                    return this.resourceUrl.call(this.__proto__);
                }
            } else {
                return this.baseUrl
            }
        };


        this.resourceBase = function() {
            return this.__proto__.resourceUrl();
        };


        // Functions for pre and post processing api data
        this.preDeliver = function(data) {
            return data;
        };
        this.postDeliver = function(data) {
            return data;
        };

        this.plain = function(){
            var plainObject = {};
            for (var property in this) {
                if (this.hasOwnProperty(property)) {
                        plainObject[property] = this[property]
                }
            }
            return plainObject;
        };

        this.restangularize = function(item) {
            item.__proto__ = this.__proto__;
            var self = this;

            // Restangularize the _children objects
            for (var property in item) {
                if (item.hasOwnProperty(property)) {
                    if (this._children[property]){
                        // If the property contains an array then restangularize all the items
                        if (Array.isArray(item[property])){
                            angular.forEach(item[property], function(arrayItem){
                                if (self._children[property].isInstanceOf){
                                    arrayItem = self.child(property).restangularize(arrayItem);
                                }
                                else {
                                   arrayItem = self.child(property, item).restangularize(arrayItem)
                                }
                            });
                        }
                        else {
                            if (property !== 'constructor'){
                                if (self._children[property].isInstanceOf){
                                    item[property] = this.child(property).restangularize(item[property])
                                }
                                else {
                                    item[property] = this.child(property, item).restangularize(item[property])
                                }
                            }
                        }
                    }
                }
            }

            return item;
        };

        this.child = function(child_resource, parent_instance){
            child = this._children[child_resource];

            if (parent_instance){
                return this.child.call(parent_instance, child_resource)
            }
            else {
                return this.instantiate_child(child)
            }
        };

        this.instantiate_child = function(child){

            if (!child || (!child.prototypeConstructor && !child.isInstanceOf)){
                console.error("You need to include the child service in your controller's dependencies.")
            }

            var ChildToReturn;

            if (child.isInstanceOf){
                ChildToReturn =  child.isInstanceOf;    
            }
            else {
                ChildModelPrototype = child.prototypeConstructor;
                ChildModelPrototype.prototype = this;
                ChildModelPrototype.prototype.constructor = ChildModelPrototype;

                ChildModel = function(){}
                ChildModel.prototype = new ChildModelPrototype(child.resource);
                ChildModel.prototype.constructor = ChildModel();
                ChildToReturn = new ChildModel();
            }
            return ChildToReturn
        };

        this.instantiate_service = function(service, parent){
            if (!service || (!service.prototypeConstructor && !service.isInstanceOf)){
                console.error("You need to include the parent service in your controller's dependencies.")
            }

            if (!parent){
                console.error("You need to include a parent when calling instantiate service.")
            }

            var ServiceToReturn;

            if (service.isInstanceOf){
                ServiceToReturn =  service.isInstanceOf;    
            }
            else {
                ServiceModelPrototype = service.prototypeConstructor;
                ServiceModelPrototype.prototype = parent;
                ServiceModelPrototype.prototype.constructor = ServiceModelPrototype;

                ServiceModel = function(){}
                ServiceModel.prototype = new ServiceModelPrototype(service.resource);
                ServiceModel.prototype.constructor = ServiceModel();
                ServiceToReturn = new ServiceModel();
            }

            return ServiceToReturn
        };

        // This will return a service object
        // The service is an object or array with all the restangular properties
        // Parameters: 
        //     - resource: ''  (is both resource name and path) (required)
        //     - customPrototypeConstructor: function(resource){}
        //     - namesOnParentObject: []
        //     - isInstanceOf: Object
        this.createService = function(params){
            var service = {};

            if (params.customPrototypeConstructor){
                service.prototypeConstructor = params.customPrototypeConstructor;
            }
            else if (params.resource){
                service.resource = params.resource;
                service.prototypeConstructor = function(resource) { this.resource = resource; this._children = {};};
            }
            else if (params.isInstanceOf){
                service.isInstanceOf = params.isInstanceOf;
            }
            else {
                throw 'Missing required parameters for creating a service';
            }

            // Add the child to the parent object
            if (params.parent){
                if (params.namesOnParentObject){
                    angular.forEach(params.namesOnParentObject, function(name) {
                        params.parent['_children'][name] = service;
                    });

                    if (params.resource){
                        params.parent['_children'][params.resource] = service;
                    }
                }
                else {
                    params.parent['_children'][params.resource] = service;
                }
            }
            parent = params.parent ? params.parent : this;
            return this.instantiate_service(service, parent)
        };

        this.addChild = function(params) {
            params.parent = this;
            return this.createService(params)
        };
         
        // ---------------------------------------------------------------------------
        // BASIC HTTP METHODS 
        // ---------------------------------------------------------------------------
        this.$http_getList = function(params) {
            return $http.get(this.resourceBase(), {
                params: params
            })
        };

        this.$http_get = function(id, params) {
            return $http.get(this.resourceBase() + "/" + id, {
                params: params
            });
        };

        this.$http_put = function(item) {
            return $http.put(this.resourceBase() + "/" + item.id, item);
        };

        this.$http_post = function(item) {
            return $http.post(this.resourceBase(), item);
        };

        this.$http_delete = function(id) {
            return $http.delete(this.resourceBase() + "/" + id);
        };

        // ---------------------------------------------------------------------------
        // 'Restangularized' methods
        // ---------------------------------------------------------------------------

        // Optionally return with metadata
        this.getList = function(params) {
            var self = this;
            return this.$http_getList(params).then(function(response) {
                data = self.responseExtractor(response)

                // Restangularize all the items
                angular.forEach(data, function(item) {
                   self.postDeliver(self.restangularize(item));
                });


                data.plain = function(){
                    var plainArray = [];
                    for (var property in this) {
                        if (this.hasOwnProperty(property)) {
                            if (this[property].plain){
                                plainArray[property] = this[property].plain();
                            }
                            else {
                                plainArray[property] = this[property]
                            }
                        }
                    }
                    delete plainArray.plain;
                    return plainArray;
                };
                return data
            }, function(response){
                return self.errorTransformer(response, 'GET');
            });
        };


        this.post = function(item) {
            var self = this;
            item = this.preDeliver(item);
            return this.$http_post(item).then(function(response) {
                return self.restangularize(self.postDeliver(self.responseExtractor(response)));
            },function(response){
                return self.errorTransformer(response, 'POST')
            });
        };

        this.put = function(item) {
            var self = this;
            item = this.preDeliver(item);
            return this.$http_put(item).then(function(response) {
                return self.restangularize(self.postDeliver(self.responseExtractor(response)));
            },function(response){
                return self.errorTransformer(response, 'PUT')
            });
        };


        this.getId = function(id) {
            var self = this;
            var item = {
                id: id
            };
            item = this.preDeliver(item);
            return this.$http_get(item.id).then(function(response) {
                return self.restangularize(self.postDeliver(self.responseExtractor(response)));
            },function(response){
                return self.errorTransformer(response, 'GET')
            });
        };


        this.refresh = function() {
            var self = this;
            if (self.id) {
                return self.getId(self.id).then(function(response){
                    return  self._assign(self, response);
                },function(response){
                    return self.errorTransformer(response, 'GET')
                });
            }
        };

        this.save = function() {
            var self = this;
            item = this.preDeliver(this);
            if (item.hasOwnProperty('id') && item.id) {
                return this.$http_put(item).then(function(response) {
                    return self._assign(self, self.restangularize(self.postDeliver(self.responseExtractor(response))));
                },function(response){
                    return self.errorTransformer(response, 'PUT')
                });
            } else {
                return this.$http_post(item).then(function(response) {
                    return self._assign(self, self.restangularize(self.postDeliver(self.responseExtractor(response))));
                },function(response){
                    return self.errorTransformer(response, 'POST')
                });
            }
        };

        // Accepts an ID, a object with an id, or nothing.
        this.delete = function(itemOrID) {
            var self = this;
            idToDelete = this.id;
            
            if (itemOrID){
                if (itemOrID.hasOwnProperty('id')){
                    idToDelete = itemOrID.id;
                    itemOrID = this.preDeliver(itemOrID);
                }
                else{
                    idToDelete = itemOrID;
                }
            }
            return this.$http_delete(idToDelete).then(function(response) {
                return self.restangularize(self.postDeliver(self.responseExtractor(response)));
            },function(response){
                return self.errorTransformer(response, 'DELETE')
            });
        };

        this.new = function(item){
            if (!item){
                item = {};
            }
            return this.restangularize(item)
        };
    };


    BaseModel = function(){
        this._children = {};
    };
    BaseModel.prototype = new BaseModelPrototype()
    BaseModel.prototype.constructor = BaseModel();
    return new BaseModel();
});