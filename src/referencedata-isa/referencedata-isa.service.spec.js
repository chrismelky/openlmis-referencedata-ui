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

describe('isaService', function() {

    var referencedataUrlFactory, $httpBackend, isaService;

    beforeEach(function() {
        module('referencedata-isa', function($provide) {
            referencedataUrlFactory = jasmine.createSpy().andCallFake(function(value) {
                return value;
            });
            $provide.factory('referencedataUrlFactory', function() {
                return referencedataUrlFactory;
            });
        });

        inject(function($injector) {
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            isaService = $injector.get('isaService');
            $httpBackend = $injector.get('$httpBackend');
        });
    });

    describe('getDownloadUrl', function() {

        it('should expose getDownloadUrl method', function() {
            expect(angular.isFunction(isaService.getDownloadUrl)).toBe(true);
        });

        it('should call referencedataUrlFactory', function(){
            var result = isaService.getDownloadUrl();

            expect(result).toEqual('/api/idealStockAmounts?format=csv');
            expect(referencedataUrlFactory).toHaveBeenCalledWith('/api/idealStockAmounts?format=csv');
        });
    });

    describe('upload', function() {

        var file;

        beforeEach(function() {
            file = 'file-content';
            $httpBackend.when('POST', referencedataUrlFactory('/api/idealStockAmounts?format=csv')).respond(200, {
                content: file
            });
        });

        it('should return promise', function() {
            var result = isaService.upload(file);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to catalog items', function() {
            var result;

            isaService.upload(file).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result.content)).toEqual(angular.toJson(file));
        });

        it('should make a proper request', function() {
            $httpBackend.expect('POST', referencedataUrlFactory('/api/idealStockAmounts?format=csv'));

            isaService.upload(file);
            $httpBackend.flush();
        });
    });
});
