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


describe('UserProfileController', function() {

    var vm, user, homeFacility, $controller, ROLE_TYPES, $q, UserDataBuilder, userPasswordModalFactory, $state,
        MinimalFacilityDataBuilder, loadingModalService, loginService, notificationService, saveUserDeferred,
        $rootScope, alertService, authUserService, pendingVerificationEmail;

    beforeEach(function() {
        module('openlmis-user');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            ROLE_TYPES = $injector.get('ROLE_TYPES');
            UserDataBuilder = $injector.get('UserDataBuilder');
            MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
            userPasswordModalFactory = $injector.get('userPasswordModalFactory');
            alertService = $injector.get('alertService');
            loginService = $injector.get('loginService');
            $state = $injector.get('$state');
            authUserService = $injector.get('authUserService');
        });

        user = new UserDataBuilder().build();
        homeFacility = new MinimalFacilityDataBuilder().build();

        pendingVerificationEmail = {
            email: 'example@test.org'
        };

        saveUserDeferred = $q.defer();

        spyOn(loadingModalService, 'open').andReturn(true);
        spyOn(loadingModalService, 'close').andReturn(true);
        spyOn(user, 'save').andReturn(saveUserDeferred.promise);
        spyOn(notificationService, 'success');
        spyOn(notificationService, 'error');
        spyOn(userPasswordModalFactory, 'resetPassword');
        spyOn($rootScope, '$emit');
        spyOn(loginService, 'logout');
        spyOn($state, 'go');
        spyOn($state, 'reload').andReturn();
        spyOn(alertService, 'info');
        spyOn(authUserService, 'sendVerificationEmail').andReturn($q.when(true));

        vm = $controller('UserProfileController', {
            user: user,
            homeFacility: homeFacility,
            pendingVerificationEmail: pendingVerificationEmail
        });
    });

    describe('onInit', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should set user profile', function() {
            expect(user).toEqual(vm.user);
        });

        it('should set home facility profile', function() {
            expect(homeFacility).toEqual(vm.homeFacility);
        });

        it('should expose role types', function() {
            expect(vm.roleTypes).toEqual(ROLE_TYPES.getRoleTypes());
        });

        it('should expose pendingVerificationEmail', function() {
            expect(vm.pendingVerificationEmail).toEqual(pendingVerificationEmail);
        });

    });

    describe('updateProfile', function() {

        beforeEach(function() {
            vm.$onInit();
            vm.updateProfile();
        });

        it('should update profile and display notification', function() {
            saveUserDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith('openlmisUser.updateProfile.updateSuccessful');
            expect(notificationService.error).not.toHaveBeenCalled();
        });

        it('should not update profile and inform about error', function() {
            saveUserDeferred.reject();
            $rootScope.$apply();

            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).toHaveBeenCalledWith('openlmisUser.updateProfile.updateFailed');
            expect(loadingModalService.close).toHaveBeenCalled();
        });

        afterEach(function() {
            expect(loadingModalService.open).toHaveBeenCalled();
            expect(user.save).toHaveBeenCalledWith();
        });

    });

    describe('restoreProfile', function() {

        beforeEach(function() {
            vm.$onInit();
            vm.restoreProfile();
        });

        it('should open loading modal', function() {
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should reload the state', function() {
            expect($state.reload).toHaveBeenCalled();
        });

        it('should show a notification', function() {
            expect(notificationService.success).toHaveBeenCalledWith('openlmisUser.cancel.restoreSuccessful');
        });

    });

    describe('changePassword', function() {

        beforeEach(function() {
            userPasswordModalFactory.resetPassword.andReturn($q.resolve());
            loginService.logout.andReturn($q.resolve());
            alertService.info.andReturn($q.resolve());
        });

        it('should do nothing if modal was dismissed', function() {
            userPasswordModalFactory.resetPassword.andReturn($q.reject());

            vm.changePassword();
            $rootScope.$apply();

            expect(userPasswordModalFactory.resetPassword).toHaveBeenCalledWith(user);
            expect(alertService.info).not.toHaveBeenCalled();
            expect($rootScope.$emit).not.toHaveBeenCalled();
            expect(loginService.logout).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
        });

        it('should do nothing if logout failed', function() {
            loginService.logout.andReturn($q.reject());

            vm.changePassword();
            $rootScope.$apply();

            expect(userPasswordModalFactory.resetPassword).toHaveBeenCalledWith(user);
            expect(loginService.logout).toHaveBeenCalled();
            expect(alertService.info).not.toHaveBeenCalled();
            expect($rootScope.$emit).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
        });

        it('should show alert after changing password ', function() {
            alertService.info.andReturn($q.reject());

            vm.changePassword();
            $rootScope.$apply();

            expect(userPasswordModalFactory.resetPassword).toHaveBeenCalledWith(user);
            expect(loginService.logout).toHaveBeenCalled();
            expect(alertService.info).toHaveBeenCalledWith({
                title: 'openlmisUser.passwordResetAlert.title',
                message: 'openlmisUser.passwordResetAlert.message',
                buttonLabel: 'openlmisUser.passwordResetAlert.label'
            });
            expect($rootScope.$emit).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
            
        });

        it('should log user out after successfully changing password', function() {
            vm.changePassword();
            $rootScope.$apply();

            expect(userPasswordModalFactory.resetPassword).toHaveBeenCalledWith(user);
            expect(loginService.logout).toHaveBeenCalled();
            expect(alertService.info).toHaveBeenCalledWith({
                title: 'openlmisUser.passwordResetAlert.title',
                message: 'openlmisUser.passwordResetAlert.message',
                buttonLabel: 'openlmisUser.passwordResetAlert.label'
            });
            expect($rootScope.$emit).toHaveBeenCalledWith('openlmis-auth.logout');
            expect($state.go).toHaveBeenCalledWith('auth.login');
        });

    });

    describe('sendVerificationEmail', function() {

        beforeEach(function() {
            vm.$onInit();
            vm.sendVerificationEmail();
            $rootScope.$apply();
        });

        it('should send verification email', function () {
            expect(authUserService.sendVerificationEmail).toHaveBeenCalledWith(vm.user.id);
            expect(notificationService.success).toHaveBeenCalledWith('openlmisUser.sendVerificationEmail.success');
        });

    });

});
