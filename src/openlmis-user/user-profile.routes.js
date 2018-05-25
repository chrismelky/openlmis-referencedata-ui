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

    angular
        .module('openlmis-user')
        .config(routes);

    routes.$inject = ['$stateProvider', 'ROLE_TYPES'];

    function routes($stateProvider, ROLE_TYPES) {

        $stateProvider.state('openlmis.profile', {
            url: '/profile',
            label: 'openlmisUser.profile',
            templateUrl: 'openlmis-user/user-profile.html',
            controller: 'UserProfileController',
            controllerAs: 'vm',
            resolve: {
                roles: function(referencedataRoleFactory) {
                    return referencedataRoleFactory.getAllWithType();
                },
                programs: function(programService) {
                    return programService.getAll();
                },
                supervisoryNodes: function(supervisoryNodeFactory) {
                    return supervisoryNodeFactory.getAllSupervisoryNodesWithDisplay();
                },
                warehouses: function(facilityService) {
                    return facilityService.getAllMinimal();
                },
                user: function(userRoleAssignmentFactory, userId, roles, programs, supervisoryNodes, warehouses) {
                    return userRoleAssignmentFactory.getUser(userId, roles, programs, supervisoryNodes, warehouses);
                },
                userId: function (currentUserService) {
                    return currentUserService.getUserInfo()
                    .then(function(user) {
                        return user.id;
                    });
                },
                homeFacility: function (user, facilityService) {
                    if (user.homeFacilityId) {
                        facilityService.getMinimal(user.homeFacilityId);
                    }
                }
            }
        });

        addStateForRoleType(ROLE_TYPES.ORDER_FULFILLMENT, '/fulfillment', 'user-profile-roles-fulfillment.html');
        addStateForRoleType(ROLE_TYPES.SUPERVISION, '/supervision', 'user-profile-roles-supervision.html');
        addStateForRoleType(ROLE_TYPES.GENERAL_ADMIN, '/admin', 'user-profile-roles-tab.html');
        addStateForRoleType(ROLE_TYPES.REPORTS, '/reports', 'user-profile-roles-tab.html');

        function addStateForRoleType(type, url, templateFile) {
            $stateProvider.state('openlmis.profile.' + type, {
                url: url,
                controller: 'UserProfileRolesTabController',
                templateUrl: 'openlmis-user/' + templateFile,
                controllerAs: 'vm',
                resolve: {
                    tab: function() {
                        return type;
                    },
                    roleAssignments: getRoleAssignments
                }
            });
        }

        function getRoleAssignments(paginationService, $stateParams, user, tab) {
            return paginationService.registerList(null, $stateParams, function() {
                var filtered = user.roleAssignments.filter(function(role) {
                    return role.type === tab;
                });

                return filtered.sort(function(a, b) {
                    return (a.roleName > b.roleName) ? 1 : ((b.roleName > a.roleName) ? -1 : 0);
                });
            });
        }

    }

})();