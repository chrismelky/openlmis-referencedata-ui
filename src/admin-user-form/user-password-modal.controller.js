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
     * @ngdoc controller
     * @name admin-user-form.controller:UserPasswordModalController
     *
     * @description
     * Manages user password modal.
     */
    angular
        .module('admin-user-form')
        .controller('UserPasswordModalController', controller);

    controller.$inject = [
        'user', 'title', 'hideCancel', 'modalDeferred', 'authUserService', 'loadingModalService',
        'notificationService'
    ];

    function controller(user, title, hideCancel, modalDeferred, authUserService,
                        loadingModalService, notificationService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.updatePassword = updatePassword;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserPasswordModalController
         * @name user
         * @type {Object}
         *
         * @description
         * User object with username, which will be updated with new password.
         */
        vm.user = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserPasswordModalController
         * @name title
         * @type {boolean}
         *
         * @description
         * The modal title.
         */
        vm.title = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserPasswordModalController
         * @name hideCancel
         * @type {boolean}
         *
         * @description
         * True if cancel button should be hidden; otherwise false.
         */
        vm.hideCancel = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserPasswordModalController
         * @name isEmailResetSelected
         * @type {Boolean}
         *
         * @description
         * true if user selects sending email reset mail; otherwise false.
         */
        vm.isEmailResetSelected = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserPasswordModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserPasswordModalController.
         */
        function onInit() {
            vm.user = user;
            vm.title = title;
            vm.hideCancel = hideCancel;
            vm.isEmailResetSelected = !!vm.user.email;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserPasswordModalController
         * @name updatePassword
         *
         * @description
         * submit user password modal. Depends on the selected option other actions are taken.
         */
        function updatePassword() {
            var actionPromise;

            loadingModalService.open();

            if (vm.isEmailResetSelected) {
                actionPromise = sendResetEmail();
            } else {
                actionPromise = resetPassword();
            }

            return actionPromise
                .finally(loadingModalService.close);
        }

        function resetPassword() {
            return authUserService.resetPassword(vm.user.username, vm.user.newPassword)
                .then(function() {
                    notificationService.success('adminUserForm.passwordSetSuccessfully');
                    modalDeferred.resolve();
                });
        }

        function sendResetEmail() {
            loadingModalService.open();

            return authUserService.sendResetEmail(vm.user.email)
                .then(function() {
                    notificationService.success('adminUserForm.passwordResetSuccessfully');
                    modalDeferred.resolve();
                });
        }
    }
})();
