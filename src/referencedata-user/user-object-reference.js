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
     * @name referencedata-user.UserObjectReference
     *
     * @description
     * Represents a single UserObjectReference.
     */
    angular
        .module('referencedata-user')
        .factory('UserObjectReference', UserObjectReference);

    function UserObjectReference() {

        return UserObjectReference;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.UserObjectReference
         * @name UserObjectReference
         *
         * @description
         * Creates a new instance of the UserObjectReference class.
         *
         * @param  {String}  id         the UUID of the UserObjectReference to be created
         * @param  {String}  href       the href of the UserObjectReference to be created
         * @param  {String}  firstName  the first name of the UserObjectReference to be created
         * @param  {String}  lastName   the last name of the UserObjectReference to be created
         */
        function UserObjectReference(id, href, firstName, lastName) {
            this.id = id;
            this.href = href;
            this.firstName = firstName;
            this.lastName = lastName;
        }

    }

})();
