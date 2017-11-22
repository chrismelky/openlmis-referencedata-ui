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
     * @name referencedata-role.User
     *
     * @description
     * Decorates User class with helper methods for role assignments.
     */
    angular
        .module('referencedata-role')
        .config(config);

    config.$inject = ['$provide'];

    function config($provide) {
        $provide.decorator('User', decorator);
    }

    decorator.$inject = ['$delegate', 'RoleAssignment'];
    function decorator($delegate, RoleAssignment) {

        $delegate.prototype.addRoleAssignment = addRoleAssignment;
        $delegate.prototype.removeRoleAssignment = removeRoleAssignment;

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf referencedata-role.User
         * @name addRoleAssignment
         *
         * @description
         * Adds new role assignment to the User.
         *
         * @param {String} roleId              the UUID of the role that will be assigned
         * @param {String} roleName            the name of the role that will be assigned
         * @param {String} roleType            the type of the role that will be assigned
         * @param {String} programId           the UUID of the program that will be assigned with role
         * @param {String} programName         the name of the program that will be assigned with role
         * @param {String} supervisoryNodeId   the UUID of the supervisory node that will be assigned with role
         * @param {String} supervisoryNodeName the name of the supervisory node that will be assigned with role
         * @param {String} warehouseId         the UUID of the warehouse that will be assigned with role
         * @param {String} warehouseName       the name of the warehouse that will be assigned with role
         */
        function addRoleAssignment(roleId, roleName, roleType, programId, programName,
                                    supervisoryNodeId, supervisoryNodeName, warehouseId, warehouseName) {
            validateNewRoleAssignment(this.roleAssignments, roleId, roleName, roleType, programId, programName,
                                        supervisoryNodeId, supervisoryNodeName, warehouseId, warehouseName);
            this.roleAssignments.push(
                new RoleAssignment(
                    roleId,
                    warehouseId,
                    supervisoryNodeId,
                    programId,
                    roleName,
                    roleType,
                    programName,
                    supervisoryNodeName,
                    warehouseName
                ));
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-role.User
         * @name removeRoleAssignment
         *
         * @description
         * Deletes user role assignment.
         *
         * @param {String} roleAssignment the role that will be removed
         */
        function removeRoleAssignment(roleAssignment) {
            var index = this.roleAssignments.indexOf(roleAssignment);
            if (index < 0) return;
            this.roleAssignments.splice(index, 1);
        }

        function validateNewRoleAssignment(roleAssignments, roleId, roleName, roleType, programId, programName,
                                            supervisoryNodeId, supervisoryNodeName, warehouseId, warehouseName) {
            if (((programId || supervisoryNodeId) && (warehouseId)) ||
                (!programId && supervisoryNodeId)) {
                throw new Error('Role assignment invalid');
            } else if (isRoleAlreadyAssigned(roleAssignments, roleId, programId, supervisoryNodeId, warehouseId)) {
                throw new Error('Role already assigned');
            }
        }

        function isRoleAlreadyAssigned(roleAssignments, roleId, programId, supervisoryNodeId, warehouseId) {
            var alreadyExist = false;
            roleAssignments.forEach(function(existingRoleAssignment) {
                alreadyExist = alreadyExist ||
                    (existingRoleAssignment.roleId === roleId &&
                        (!programId || existingRoleAssignment.programId === programId) &&
                        (!supervisoryNodeId || existingRoleAssignment.supervisoryNodeId === supervisoryNodeId) &&
                        (!warehouseId || existingRoleAssignment.warehouseId === warehouseId));
            });
            return alreadyExist;
        }
    }
})();
