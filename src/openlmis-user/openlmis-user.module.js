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
     * @module openlmis-user
     *
     * @description
     * Responsible for managing user profile screen and retrieve user detailed info.
     */
    angular.module('openlmis-user', [
        'ngResource',
        'openlmis-local-storage',
        'openlmis-offline',
        'openlmis-urls',
        'referencedata-user',
        'referencedata-facility',
        'referencedata-supervisory-node',
        'referencedata-facilities-cache',
        'admin-user-roles',
        'openlmis-templates',
        'ui.router',
        'openlmis-modal',
        'auth-user'
    ]);

})();
