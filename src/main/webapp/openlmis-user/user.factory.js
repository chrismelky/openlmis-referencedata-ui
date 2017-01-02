(function() {
  
    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-user.UserFactory
     *
     * @description
     * 
     * Allows user to perform actions on user resource
     * 
     */
    angular.module('openlmis-user').factory('UserFactory', userFactory);

    userFactory.$inject = ['OpenlmisURL', '$resource'];

    function userFactory(OpenlmisURL, $resource) {

        var resource = $resource(OpenlmisURL('/api/users/:id'), {}, {
            'update': {
                url: OpenlmisURL('/api/users/update/:id'),
                method: 'POST'
            }
        });

        var service = {
            get: get
        };
        return service;


        /**
         * @ngdoc function
         * @name  get
         * @methodOf openlmis-user.UserFactory
         * @param {String} id User id 
         * @returns {Resource} User info
         * 
         * @description
         *
         * Get user by id
         */
        function get(id) {
            return resource.get({id: id});
        }
    }

})();