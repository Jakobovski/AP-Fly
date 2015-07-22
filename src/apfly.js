angular.module('apfly').factory('APFly', function($http, $q, AppConfig) {
    var BaseModelPrototype = function() {
        this.baseUrl = "";
        this.errorTransformer = function(response, method) {
            return $q.reject(response);
        };
        this.responseExtractor = function(response) {
            return response.data;
        };
        this._children = {};

        this.setBaseUrl = function(url) {
            this.__proto__.baseUrl = url;
        };
        this.setErrorTransformer = function(errorTransformer) {
            this.__proto__.errorTransformer = errorTransformer;
        };
        this.setResponseExtractor = function(responseExtractor) {
            this.__proto__.responseExtractor = responseExtractor;
        };
        this.setPostDeliver = function(new_function) {
            this.__proto__.postDeliver = new_function;
        };

        this._assign = function(destination, source) {
            // Remove all properties from this object
            _.forOwn(destination, function(value, key) {
                delete destination[key];
            });
            return _.assign(destination, source);
        };

        this._returnHelper = function(response, objToReturn) {
            var new_item = this.restangularize(this.postDeliver(this.responseExtractor(response)));
            this._assign(objToReturn.$object, new_item);
            return objToReturn.$object;
        };

        this._checkHasOwnId = function(resource) {
            return (resource.hasOwnProperty('id') && resource.id);
        };


        this.resourceUrl = function() {
            if (this.__proto__ && this.__proto__.resourceUrl) {
                if (this.hasOwnProperty('resource')) {
                    return this.resourceUrl.call(this.__proto__) + "/" + this.resource;
                } else if (this.hasOwnProperty('id')) {
                    return this.resourceUrl.call(this.__proto__) + "/" + this.id;
                } else {
                    return this.resourceUrl.call(this.__proto__);
                }
            } else {
                return this.baseUrl;
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

        this.plain = function() {
            var plainObject = {};
            for (var property in this) {
                if (this.hasOwnProperty(property)) {
                    plainObject[property] = this[property];
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
                    if (this._children[property]) {
                        // If the property contains an array then restangularize all the items
                        if (Array.isArray(item[property])) {
                            angular.forEach(item[property], function(arrayItem) {
                                if (self._children[property].isInstanceOf) {
                                    arrayItem = self.child(property).restangularize(arrayItem);
                                } else {
                                    arrayItem = self.child(property, item).restangularize(arrayItem);
                                }
                            });
                        } else {
                            if (property !== 'constructor') {
                                if (self._children[property].isInstanceOf) {
                                    item[property] = this.child(property).restangularize(item[property]);
                                } else {
                                    item[property] = this.child(property, item).restangularize(item[property]);
                                }
                            }
                        }
                    }
                }
            }

            return item;
        };

        this.child = function(child_resource, parent_instance) {
            var child = this._children[child_resource];
            if (parent_instance) {
                return this.child.call(parent_instance, child_resource);
            } else {
                return this.instantiate_child(child);
            }
        };

        this.instantiate_child = function(child) {
            if (!child || (!child.prototypeConstructor && !child.isInstanceOf)) {
                console.error("You need to include the child service in your controller's dependencies.");
            }

            var ChildToReturn;
            if (child.isInstanceOf) {
                ChildToReturn = child.isInstanceOf;
            } else {
                var ChildModelPrototype = child.prototypeConstructor;
                ChildModelPrototype.prototype = this;
                ChildModelPrototype.prototype.constructor = ChildModelPrototype;

                var ChildModel = function() {};
                ChildModel.prototype = new ChildModelPrototype(child.resource);
                ChildModel.prototype.constructor = ChildModel();
                ChildToReturn = new ChildModel();
            }
            return ChildToReturn;
        };

        this.instantiate_service = function(service, parent) {
            if (!service || (!service.prototypeConstructor && !service.isInstanceOf)) {
                console.error("You need to include the parent service in your controller's dependencies.");
            }

            if (!parent) {
                console.error("You need to include a parent when calling instantiate service.");
            }

            var ServiceToReturn;

            if (service.isInstanceOf) {
                ServiceToReturn = service.isInstanceOf;
            } else {
                var ServiceModelPrototype = service.prototypeConstructor;
                ServiceModelPrototype.prototype = parent;
                ServiceModelPrototype.prototype.constructor = ServiceModelPrototype;

                var ServiceModel = function() {};
                ServiceModel.prototype = new ServiceModelPrototype(service.resource);
                ServiceModel.prototype.constructor = ServiceModel();
                ServiceToReturn = new ServiceModel();
            }
            return ServiceToReturn;
        };

        // This will return a service object
        // The service is an object or array with all the restangular properties
        // Parameters: 
        //     - resource: ''  (is both resource name and path) (required)
        //     - customPrototypeConstructor: function(resource){}
        //     - namesOnParentObject: []
        //     - isInstanceOf: Object
        this.createService = function(params) {
            var service = {};

            if (params.customPrototypeConstructor) {
                service.prototypeConstructor = params.customPrototypeConstructor;
            } else if (params.resource) {
                service.resource = params.resource;
                service.prototypeConstructor = function(resource) {
                    this.resource = resource;
                    this._children = {};
                };
            } else if (params.isInstanceOf) {
                service.isInstanceOf = params.isInstanceOf;
            } else {
                throw 'Missing required parameters for creating a service';
            }

            // Add the child to the parent object
            if (params.parent) {
                if (params.namesOnParentObject) {
                    angular.forEach(params.namesOnParentObject, function(name) {
                        params.parent._children[name] = service;
                    });

                    if (params.resource) {
                        params.parent._children[params.resource] = service;
                    }
                } else {
                    params.parent._children[params.resource] = service;
                }
            }
            var parent = params.parent ? params.parent : this;
            return this.instantiate_service(service, parent);
        };

        this.addChild = function(params) {
            params.parent = this;
            return this.createService(params);
        };

        // ---------------------------------------------------------------------------
        // BASIC HTTP METHODS 
        // ---------------------------------------------------------------------------
        this.$http_getList = function(params) {
            return $http.get(this.resourceBase(), {
                params: params
            });
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
            var objToReturn = this.$http_getList(params).then(function(response) {
                var data = self.responseExtractor(response);

                // Restangularize all the items
                angular.forEach(data, function(item) {
                    self.postDeliver(self.restangularize(item));
                });

                // Copy over all the items
                // We don't want to do this in the loop above because we don't know what the user defined response extractor 
                // is going to do to our object.
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        objToReturn.$object[key] = data[key];
                    }
                }

                return objToReturn.$object;
            }, function(response) {
                return self.errorTransformer(response, 'GET');
            });


            objToReturn.$object = [];
            objToReturn.$object.plain = function() {
                var plainArray = [];
                for (var property in this) {
                    if (this.hasOwnProperty(property)) {
                        if (this[property] && this[property].plain) {
                            plainArray[property] = this[property].plain();
                        } else {
                            plainArray[property] = this[property];
                        }
                    }
                }
                delete plainArray.plain;
                return plainArray;
            };
            return objToReturn;
        };


        this.post = function(item) {
            var self = this;
            item = this.preDeliver(item);
            var objToReturn = this.$http_post(item).then(function(response) {
                return self._returnHelper(response, objToReturn);
            }, function(response) {
                return self.errorTransformer(response, 'POST');
            });
            objToReturn.$object = self.new();
            return objToReturn;
        };


        this.put = function(item) {
            var self = this;
            item = this.preDeliver(item);

            if (!this._checkHasOwnId(item)) {
                console.error('Object must have its own id.');
                return;
            }

            var objToReturn = this.$http_put(item).then(function(response) {
                return self._returnHelper(response, objToReturn);
            }, function(response) {
                return self.errorTransformer(response, 'PUT');
            });
            objToReturn.$object = self.new();
            return objToReturn;
        };


        this.getId = function(id, params) {
            var self = this;
            var objToReturn = this.$http_get(id, params).then(function(response) {
                return self._returnHelper(response, objToReturn);
            }, function(response) {
                return self.errorTransformer(response, 'GET');
            });
            objToReturn.$object = self.new();
            return objToReturn;
        };

        this.get = function(objectToGet, params) {
            if (!this._checkHasOwnId(objectToGet)) {
                console.error('Object must have its own id.');
                return;
            }

            return this.getId(objectToGet.id, params);

        };

        this.refresh = function() {
            var self = this;
            if (this._checkHasOwnId(self)) {
                console.error('Object must have its own id.');
                return;
            }

            return self.getId(self.id).then(function(response) {
                return self._assign(self, response);
            }, function(response) {
                return self.errorTransformer(response, 'GET');
            });
        };

        // This can either save itself, or an object passed
        this.save = function(objToSave) {
            var self = this;
            var item = objToSave ? this.preDeliver(objToSave) : this.preDeliver(this);
            var objToReturn = {};

            if (item.hasOwnProperty('id') && item.id) {
                objToReturn = this.$http_put(item).then(function(response) {
                    return self._returnHelper(response, objToReturn);
                }, function(response) {
                    return self.errorTransformer(response, 'PUT');
                });
            } else {
                objToReturn = this.$http_post(item).then(function(response) {
                    return self._returnHelper(response, objToReturn);
                }, function(response) {
                    return self.errorTransformer(response, 'POST');
                });
            }
            objToReturn.$object = objToSave ? objToSave : this;
            return objToReturn;
        };

        // Accepts an ID, a object with an id, or nothing.
        this.delete = function(itemOrID) {
            var self = this;

            // Figure out what to id to delete
            var idToDelete = this.id;
            if (itemOrID) {
                if (itemOrID.hasOwnProperty('id')) {
                    idToDelete = itemOrID.id;
                    itemOrID = this.preDeliver(itemOrID);
                } else {
                    idToDelete = itemOrID;
                }
            }

            var objToReturn = this.$http_delete(idToDelete).then(function(response) {
                return self._returnHelper(response, objToReturn);
            }, function(response) {
                return self.errorTransformer(response, 'DELETE');
            });

            // Figure out what to assign to $object
            objToReturn.$object = this;
            if (itemOrID) {
                if (itemOrID.hasOwnProperty('id')) {
                    objToReturn.$object = itemOrID;
                } else {
                    idToDelete = this.new();
                }
            }
            return objToReturn;
        };


        this.new = function(item) {
            if (!item) {
                item = {};
            }
            return this.restangularize(item);
        };
    };


    var BaseModel = function() {
        this._children = {};
    };
    BaseModel.prototype = new BaseModelPrototype();
    BaseModel.prototype.constructor = newBaseModel();
    return new BaseModel();
});