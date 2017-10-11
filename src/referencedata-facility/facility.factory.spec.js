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

describe('facilityFactory', function() {

    var $rootScope, $q, facility1, facility2, userPrograms, programService, facilityService,
        authorizationService, referencedataUserService, facilityFactory, REQUISITION_RIGHTS, FULFILLMENT_RIGHTS;

    beforeEach(function() {
        module('referencedata-facility', function($provide){
            programService = jasmine.createSpyObj('programService', ['getUserPrograms', 'getAllUserPrograms']);
            $provide.factory('programService', function() {
                return programService;
            });

            facilityService = jasmine.createSpyObj('facilityService', [
                'getUserSupervisedFacilities',
                'getFulfillmentFacilities',
                'get',
                'getAllMinimal'
            ]);
            $provide.factory('facilityService', function() {
                return facilityService;
            });

            authorizationService = jasmine.createSpyObj('authorizationService', ['getUser', 'getRightByName', 'isAuthenticated']);
            authorizationService.isAuthenticated.andReturn(true);
            $provide.factory('authorizationService', function() {
                return authorizationService;
            });
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            facilityFactory = $injector.get('facilityFactory');
            REQUISITION_RIGHTS = $injector.get('REQUISITION_RIGHTS');
            FULFILLMENT_RIGHTS = $injector.get('FULFILLMENT_RIGHTS');
        });

        facility1 = {
            id: '1',
            name: 'facility1'
        };
        facility2 = {
            id: '2',
            name: 'facility2'
        };

        userPrograms = [
            {
                name: 'program1',
                id: '1'
            },
            {
                name: 'program2',
                id: '2'
            }
        ];
    });

    it('should get all facilities and save them to storage', function() {
        var data,
            userId = '1';

        authorizationService.getRightByName.andReturn({id: '1'});
        programService.getUserPrograms.andCallFake(function() {
            return $q.when(userPrograms);
        });
        facilityService.getUserSupervisedFacilities.andCallFake(function() {
            return $q.when([facility1, facility2]);
        });

        facilityFactory.getUserFacilities(userId, REQUISITION_RIGHTS.REQUISITION_VIEW).then(function(response) {
            data = response;
        });
        $rootScope.$apply();

        expect(data.length).toBe(2);
        expect(data[0].id).toBe(facility1.id);
        expect(data[1].id).toBe(facility2.id);
        expect(facilityService.getUserSupervisedFacilities.callCount).toEqual(2);
    });

    describe('getSupplyingFacilities', function() {

        var userId, ordersViewFacilities, podsManageFacilities, ordersViewRight, podsManageRight;

        beforeEach(function() {
            userId = 'user-id';
            ordersViewRight = {id: 'orders-view-id'};
            podsManageRight = {id: 'pods-manage-id'};

            ordersViewFacilities = [
                createFacility('facility-one', 'facilityOne'),
                createFacility('facility-two', 'facilityTwo')
            ];

            podsManageFacilities = [
                createFacility('facility-two', 'facilityTwo'),
                createFacility('facility-three', 'facilityThree')
            ];

            authorizationService.getRightByName.andCallFake(function(name) {
                if (name === FULFILLMENT_RIGHTS.ORDERS_VIEW) return ordersViewRight;
                if (name === FULFILLMENT_RIGHTS.PODS_MANAGE) return podsManageRight;
            });

            facilityService.getFulfillmentFacilities.andCallFake(function(params) {
                if (params.rightId === 'orders-view-id') return $q.when(ordersViewFacilities);
                if (params.rightId === 'pods-manage-id') return $q.when(podsManageFacilities);
            });
        });

        // it('should fetch facilities for ORDERS_VIEW right', function() {
        //     facilityFactory.getSupplyingFacilities(userId);

        //     expect(facilityService.getFulfillmentFacilities).toHaveBeenCalledWith({
        //         userId: userId,
        //         rightId: 'orders-view-id'
        //     });
        // });

        it('should not fetch facilities for ORDERS_VIEW if user does not have this right', function() {
            ordersViewRight = undefined;

            facilityFactory.getSupplyingFacilities(userId);

            expect(facilityService.getFulfillmentFacilities).not.toHaveBeenCalledWith({
                userId: userId,
                rightId: 'orders-view-id'
            });
        });

        // it('should fetch facilities for PODS_MANAGE right', function() {
        //     facilityFactory.getSupplyingFacilities(userId);

        //     expect(facilityService.getFulfillmentFacilities).toHaveBeenCalledWith({
        //         userId: userId,
        //         rightId: 'pods-manage-id'
        //     });
        // });

        it('should not fetch facilities for PODS_MANAGE if user does not have this right', function() {
            podsManageRight = undefined;

            facilityFactory.getSupplyingFacilities(userId);

            expect(facilityService.getFulfillmentFacilities).not.toHaveBeenCalledWith({
                userId: userId,
                rightId: 'pods-manage-id'
            });
        });

        // it('should resolve to set of facilities', function() {
        //     var result;

        //     facilityFactory.getSupplyingFacilities(userId).then(function(facilities) {
        //         result = facilities;
        //     });
        //     $rootScope.$apply();

        //     expect(result.length).toBe(3);
        //     expect(result[0]).toEqual(ordersViewFacilities[0]);
        //     expect(result[1]).toEqual(podsManageFacilities[0]);
        //     expect(result[2]).toEqual(podsManageFacilities[1]);
        // });

        // it('should resolve to set of ORDERS_VIEW facilities when no PODS_MANAGE right', function() {
        //     var result;
        //     podsManageRight = undefined;

        //     facilityFactory.getSupplyingFacilities(userId).then(function(facilities) {
        //         result = facilities;
        //     });
        //     $rootScope.$apply();

        //     expect(result.length).toBe(2);
        //     expect(result[0]).toEqual(ordersViewFacilities[0]);
        //     expect(result[1]).toEqual(ordersViewFacilities[1]);
        // });

        // it('should resolve to set of PODS_MANAGE facilities when no ORDERS_VIEW right', function() {
        //     var result;
        //     ordersViewRight = undefined;

        //     facilityFactory.getSupplyingFacilities(userId).then(function(facilities) {
        //         result = facilities;
        //     });
        //     $rootScope.$apply();

        //     expect(result.length).toBe(2);
        //     expect(result[0]).toEqual(podsManageFacilities[0]);
        //     expect(result[1]).toEqual(podsManageFacilities[1]);
        // });

    });

    describe('getUserHomeFacility', function() {

        beforeEach(inject(function(_referencedataUserService_) {
            referencedataUserService = _referencedataUserService_;
            spyOn(referencedataUserService, 'get');
            referencedataUserService.get.andReturn($q.resolve({
                homeFacilityId: 'home-facility-id'
            }));

            authorizationService.getUser.andReturn({
                user_id: '1234'
            });
        }));

        it('should fetch home facility for the current user', function() {
            facilityService.get.andCallFake(function() {
                return { name: 'Home Facility'};
            });

            var homeFacility;
            facilityFactory.getUserHomeFacility().then(function (result) {
                homeFacility = result;
            });
            $rootScope.$apply();

            expect(referencedataUserService.get).toHaveBeenCalled();
            expect(facilityService.get).toHaveBeenCalledWith('home-facility-id');
            expect(homeFacility.name).toEqual('Home Facility');
        });
    });

    describe('getUserSupervisedFacilities', function() {
        var userId ='user-id',
            rightId = 'right-id';

        beforeEach(function() {
            authorizationService.getRightByName.andCallFake(function(rightName) {
                if (rightName === REQUISITION_RIGHTS.REQUISITION_CREATE) {
                    return {id: rightId};
                }
            });
        });

        it('should fetch supervised facilities for the current user', function() {
            facilityFactory.getUserSupervisedFacilities(
                userId,
                userPrograms[0],
                REQUISITION_RIGHTS.REQUISITION_CREATE);

            expect(facilityService.getUserSupervisedFacilities)
                .toHaveBeenCalledWith(userId, userPrograms[0], rightId);
        });
    });

    describe('getRequestingFacilities', function() {

        var userId, requisitionCreateFacilities, requisitionAuthorizeFacilities;

        beforeEach(function() {
            userId = 'user-id';

            requisitionCreateFacilities = [
                createFacility('facility-one', 'facilityOne'),
                createFacility('facility-two', 'facilityTwo')
            ];

            requisitionAuthorizeFacilities = [
                createFacility('facility-two', 'facilityTwo'),
                createFacility('facility-three', 'facilityThree')
            ];

            spyOn(facilityFactory, 'getUserFacilities').andCallFake(function(userId, rightName) {
                if (rightName === REQUISITION_RIGHTS.REQUISITION_CREATE) {
                    return $q.when(requisitionCreateFacilities);
                }
                if (rightName === REQUISITION_RIGHTS.REQUISITION_AUTHORIZE) {
                    return $q.when(requisitionAuthorizeFacilities);
                }
            });
        });

        it('should fetch facilities for REQUISITION_CREATE right', function() {
            facilityFactory.getRequestingFacilities(userId);

            expect(facilityFactory.getUserFacilities)
                .toHaveBeenCalledWith(userId, REQUISITION_RIGHTS.REQUISITION_CREATE);
        });

        it('should fetch facilities for REQUISITION_AUTHORIZE right', function() {
            facilityFactory.getRequestingFacilities(userId);

            expect(facilityFactory.getUserFacilities)
                .toHaveBeenCalledWith(userId, REQUISITION_RIGHTS.REQUISITION_AUTHORIZE);
        });

        it('should resolve to set of facilities', function() {
            var result;

            facilityFactory.getRequestingFacilities(userId).then(function(facilities) {
                result = facilities;
            });
            $rootScope.$apply();

            expect(result.length).toBe(3);
            expect(result[0]).toEqual(requisitionCreateFacilities[0]);
            expect(result[1]).toEqual(requisitionAuthorizeFacilities[0]);
            expect(result[2]).toEqual(requisitionAuthorizeFacilities[1]);
        });

    });

    describe('getAllUserFacilities', function() {

        var userId, requisitionViewFacilities, permissionService;

        beforeEach(inject(function(_permissionService_) {
            userId = 'user-id';

            facilityService.getAllMinimal.andReturn($q.resolve([
                createFacility('facility-one', 'Facility'),
                createFacility('facility-two', 'Another Facility'),
                createFacility('example', 'Example Facility')                
            ]));

            programService.getAllUserPrograms.andReturn($q.resolve([{
                id: 'program1',
                name: 'A Program'
            }]));

            var permissions = [
                {
                    right: REQUISITION_RIGHTS.REQUISITION_VIEW,
                    facilityId: 'facility-one',
                    programId: 'program1'
                },
                {
                    right: REQUISITION_RIGHTS.REQUISITION_VIEW,
                    facilityId: 'facility-two',
                    programId: 'program1'
                },
                {
                    right: 'bad-example',
                    facilityId: 'example'
                }
            ];

            permissionService = _permissionService_;
            spyOn(permissionService, 'load').andReturn($q.resolve(permissions))

        }));

        it('returns only facilities with a REQUISITION_VIEW right permission', function() {
            var returnedFacilities;
            facilityFactory.getAllUserFacilities(userId)
            .then(function(facilities) {
                returnedFacilities = facilities;
            });
            $rootScope.$apply();

            returnedFacilities.forEach(function(facility) {
                expect(facility.id).not.toBe('example');
            });
        });

        it('should resolve to set of facilities, ordered alphebetically', function() {
            var returnedFacilities;

            facilityFactory.getAllUserFacilities(userId)
            .then(function(facilities) {
                returnedFacilities = facilities;
            });

            $rootScope.$apply();

            expect(returnedFacilities.length).toBe(2);
            expect(returnedFacilities[0].id).toBe('facility-two');
            expect(returnedFacilities[0].name).toBe('Another Facility');
        });

        it('will resolve facilities with full supported programs', function() {
            var returnedFacilities;

            facilityFactory.getAllUserFacilities(userId)
            .then(function(facilities) {
                returnedFacilities = facilities;
            });

            $rootScope.$apply();

            expect(Array.isArray(returnedFacilities[0].supportedPrograms)).toBe(true);
            expect(returnedFacilities[0].supportedPrograms.length).toBe(1);
            expect(returnedFacilities[0].supportedPrograms[0].id).toBe('program1');
            expect(returnedFacilities[0].supportedPrograms[0].name).toBe('A Program');           
        });
    });

    describe('searchAndOrderFacilities', function() {

        it('should order by name', function() {
            var result = facilityFactory.searchAndOrderFacilities([facility2, facility1], null, 'name');

            expect(result.length).toEqual(2);
            expect(result[0].name).toEqual(facility1.name);
            expect(result[1].name).toEqual(facility2.name);
        });

        it('should filter name by given value', function() {
            var result = facilityFactory.searchAndOrderFacilities([facility2, facility1], '1', 'name');

            expect(result.length).toEqual(1);
            expect(result[0].name).toEqual(facility1.name);
        });
    });

    function createFacility(id, name) {
        return {
            id: id,
            name: name
        };
    }

});
