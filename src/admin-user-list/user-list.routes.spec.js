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

describe('openlmis.administration.users state', function() {

    var $state, $q, UserRepository, paginationService, ADMINISTRATION_RIGHTS, userRepositoryMock, state, users, params,
        usersPage, $rootScope;

    beforeEach(function() {
        module('openlmis-main-state');
        module('openlmis-admin');
        module('admin-user-list', function($provide) {
            userRepositoryMock = jasmine.createSpyObj('userRepository', ['query']);
            $provide.factory('UserRepository', function() {
                return function() {
                    return userRepositoryMock;
                };
            });
        });

        inject(function($injector) {
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            ADMINISTRATION_RIGHTS = $injector.get('ADMINISTRATION_RIGHTS');
            UserRepository = $injector.get('UserRepository');
            paginationService = $injector.get('paginationService');
        });

        params = {
            param: 'param',
            page: 0,
            size: 10,
            sort: 'username'
        };

        users = [
            {
                username: 'admin'
            }, {
                username: 'user'
            }
        ];

        usersPage = {
            content: users,
            last: true,
            totalElements: 2,
            totalPages: 1,
            sort: 'username',
            first: true,
            numberOfElements: 2,
            size: 10,
            number: 0
        };

        userRepositoryMock.query.andReturn($q.when({
            content: users,
            last: true,
            totalElements: 2,
            totalPages: 1,
            sort: 'username',
            first: true,
            numberOfElements: 2,
            size: 10,
            number: 0
        }));

        state = $state.get('openlmis.administration.users');
    });

    it('should fetch a list of users', function() {
        var result;

        spyOn(paginationService, 'registerUrl').andCallFake(function(givenParams, method) {
            if (givenParams === params && angular.isFunction(method)) {
                return method(givenParams);
            }
        });

        state.resolve.users(paginationService, UserRepository, params).then(function(userList) {
            result = userList;
        });
        $rootScope.$apply();

        expect(result).toEqual(usersPage);
        expect(result.content).toEqual(users);
        expect(userRepositoryMock.query).toHaveBeenCalledWith(params);
        expect(paginationService.registerUrl).toHaveBeenCalled();
    });

    it('should require USERS_MANAGE right to enter', function() {
        expect(state.accessRights).toEqual([ADMINISTRATION_RIGHTS.USERS_MANAGE]);
    });

});
