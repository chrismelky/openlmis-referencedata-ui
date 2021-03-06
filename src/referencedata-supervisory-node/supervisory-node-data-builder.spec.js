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
        .module('referencedata-supervisory-node')
        .factory('SupervisoryNodeDataBuilder', SupervisoryNodeDataBuilder);

    SupervisoryNodeDataBuilder.$inject = ['SupervisoryNode', 'FacilityDataBuilder'];

    function SupervisoryNodeDataBuilder(SupervisoryNode, FacilityDataBuilder) {

        SupervisoryNodeDataBuilder.prototype.build = build;
        SupervisoryNodeDataBuilder.prototype.buildWithoutFacility = buildWithoutFacility;
        SupervisoryNodeDataBuilder.prototype.addChildNode = addChildNode;
        SupervisoryNodeDataBuilder.prototype.withFacility = withFacility;

        return SupervisoryNodeDataBuilder;

        function SupervisoryNodeDataBuilder() {
            SupervisoryNodeDataBuilder.instanceNumber = (SupervisoryNodeDataBuilder.instanceNumber || 0) + 1;

            this.id = 'node-id-' + SupervisoryNodeDataBuilder.instanceNumber;
            this.name = 'node-' + SupervisoryNodeDataBuilder.instanceNumber;
            this.code = 'SN' + SupervisoryNodeDataBuilder.instanceNumber;
            this.facility = new FacilityDataBuilder().build();
            this.childNodes = [];
        }

        function build() {
            return new SupervisoryNode(
                this.id,
                this.name,
                this.code,
                this.facility,
                this.childNodes
            );
        }

        function buildWithoutFacility() {
            return new SupervisoryNode(
                this.id,
                this.name,
                this.code,
                null,
                this.childNodes
            );
        }

        function addChildNode(node) {
            this.childNodes.push(node);
            return this;
        }

        function withFacility(facility) {
            this.facility = facility;
            return this;
        }
    }
})();
