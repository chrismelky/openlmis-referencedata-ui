/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name referencedata-supervisory-node.supervisoryNodeFactory
     *
     * @description
     * Allows the user to retrieve roles with additional info.
     */
    angular
        .module('referencedata-supervisory-node')
        .factory('supervisoryNodeFactory', factory);

    factory.$inject = ['$q', 'supervisoryNodeService'];

    function factory($q, supervisoryNodeService) {

        return {
            getAllSupervisoryNodesWithDisplay: getAllSupervisoryNodesWithDisplay
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.supervisoryNodeFactory
         * @name getAllSupervisoryNodesWithDisplay
         *
         * @description
         * Returns list of the supervisory nodes with display property.
         *
         * @return {Promise} roleAssignments array of role assignments
         */
        function getAllSupervisoryNodesWithDisplay() {
            var deferred = $q.defer();

            supervisoryNodeService.getAll().then(function(supervisoryNodes) {
                angular.forEach(supervisoryNodes, function(node) {
                    node.$display = node.name + ' (' + node.facility.name + ')';
                });
                deferred.resolve(supervisoryNodes);
            }, deferred.reject);

            return deferred.promise;
        }
    }
})();