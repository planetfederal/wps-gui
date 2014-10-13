var GML_2_1_2_Module_Factory = function () {
  var GML_2_1_2 = {
    name: 'GML_2_1_2',
    defaultElementNamespaceURI: 'http:\/\/www.opengis.net\/gml',
    defaultAttributeNamespaceURI: 'http:\/\/www.w3.org\/1999\/xlink',
    typeInfos: [{
        type: 'classInfo',
        localName: 'MultiPointType',
        baseTypeInfo: 'GML_2_1_2.GeometryCollectionType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'AbstractGeometryType',
        propertyInfos: [{
            name: 'gid',
            typeInfo: 'ID',
            attributeName: {
              localPart: 'gid'
            },
            type: 'attribute'
          }, {
            name: 'srsName',
            typeInfo: 'String',
            attributeName: {
              localPart: 'srsName'
            },
            type: 'attribute'
          }]
      }, {
        type: 'classInfo',
        localName: 'MultiLineStringType',
        baseTypeInfo: 'GML_2_1_2.GeometryCollectionType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'LinearRingMemberType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'GeometryAssociationType',
        propertyInfos: [{
            name: 'geometry',
            elementName: '_Geometry',
            typeInfo: 'GML_2_1_2.AbstractGeometryType',
            type: 'elementRef'
          }, {
            name: 'remoteSchema',
            typeInfo: 'String',
            attributeName: {
              localPart: 'remoteSchema',
              namespaceURI: 'http:\/\/www.opengis.net\/gml'
            },
            type: 'attribute'
          }, {
            name: 'type',
            typeInfo: 'XLink_1_0.TypeType',
            attributeName: 'type',
            type: 'attribute'
          }, {
            name: 'href',
            typeInfo: 'String',
            attributeName: 'href',
            type: 'attribute'
          }, {
            name: 'role',
            typeInfo: 'String',
            attributeName: 'role',
            type: 'attribute'
          }, {
            name: 'arcrole',
            typeInfo: 'String',
            attributeName: 'arcrole',
            type: 'attribute'
          }, {
            name: 'title',
            typeInfo: 'String',
            attributeName: 'title',
            type: 'attribute'
          }, {
            name: 'show',
            typeInfo: 'XLink_1_0.ShowType',
            attributeName: 'show',
            type: 'attribute'
          }, {
            name: 'actuate',
            typeInfo: 'XLink_1_0.ActuateType',
            attributeName: 'actuate',
            type: 'attribute'
          }]
      }, {
        type: 'classInfo',
        localName: 'LineStringMemberType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'AbstractFeatureCollectionType',
        baseTypeInfo: 'GML_2_1_2.AbstractFeatureCollectionBaseType',
        propertyInfos: [{
            type: 'element',
            name: 'featureMember',
            collection: true,
            elementName: 'featureMember',
            typeInfo: 'GML_2_1_2.FeatureAssociationType'
          }]
      }, {
        type: 'classInfo',
        localName: 'AbstractFeatureType',
        propertyInfos: [{
            type: 'element',
            name: 'description',
            elementName: 'description',
            typeInfo: 'String'
          }, {
            type: 'element',
            name: 'name',
            elementName: 'name',
            typeInfo: 'String'
          }, {
            type: 'element',
            name: 'boundedBy',
            elementName: 'boundedBy',
            typeInfo: 'GML_2_1_2.BoundingShapeType'
          }, {
            name: 'fid',
            typeInfo: 'ID',
            attributeName: {
              localPart: 'fid'
            },
            type: 'attribute'
          }]
      }, {
        type: 'classInfo',
        localName: 'CoordType',
        propertyInfos: [{
            type: 'element',
            name: 'x',
            elementName: 'X',
            typeInfo: 'Decimal'
          }, {
            type: 'element',
            name: 'y',
            elementName: 'Y',
            typeInfo: 'Decimal'
          }, {
            type: 'element',
            name: 'z',
            elementName: 'Z',
            typeInfo: 'Decimal'
          }]
      }, {
        type: 'classInfo',
        localName: 'GeometryCollectionType',
        baseTypeInfo: 'GML_2_1_2.AbstractGeometryCollectionBaseType',
        propertyInfos: [{
            name: 'geometryMember',
            collection: true,
            elementName: 'geometryMember',
            typeInfo: 'GML_2_1_2.GeometryAssociationType',
            type: 'elementRef'
          }]
      }, {
        type: 'classInfo',
        localName: 'PolygonPropertyType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'MultiLineStringPropertyType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'MultiPolygonPropertyType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'PolygonType',
        baseTypeInfo: 'GML_2_1_2.AbstractGeometryType',
        propertyInfos: [{
            type: 'element',
            name: 'outerBoundaryIs',
            elementName: 'outerBoundaryIs',
            typeInfo: 'GML_2_1_2.LinearRingMemberType'
          }, {
            type: 'element',
            name: 'innerBoundaryIs',
            collection: true,
            elementName: 'innerBoundaryIs',
            typeInfo: 'GML_2_1_2.LinearRingMemberType'
          }]
      }, {
        type: 'classInfo',
        localName: 'MultiPointPropertyType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'PointPropertyType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'MultiGeometryPropertyType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'LineStringPropertyType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'BoundingShapeType',
        propertyInfos: [{
            type: 'element',
            name: 'box',
            elementName: 'Box',
            typeInfo: 'GML_2_1_2.BoxType'
          }, {
            type: 'element',
            name: '_null',
            elementName: 'null',
            typeInfo: 'String'
          }]
      }, {
        type: 'classInfo',
        localName: 'CoordinatesType',
        propertyInfos: [{
            name: 'value',
            typeInfo: 'String',
            type: 'value'
          }, {
            name: 'decimal',
            typeInfo: 'String',
            attributeName: {
              localPart: 'decimal'
            },
            type: 'attribute'
          }, {
            name: 'cs',
            typeInfo: 'String',
            attributeName: {
              localPart: 'cs'
            },
            type: 'attribute'
          }, {
            name: 'ts',
            typeInfo: 'String',
            attributeName: {
              localPart: 'ts'
            },
            type: 'attribute'
          }]
      }, {
        type: 'classInfo',
        localName: 'BoxType',
        baseTypeInfo: 'GML_2_1_2.AbstractGeometryType',
        propertyInfos: [{
            type: 'element',
            name: 'coord',
            collection: true,
            elementName: 'coord',
            typeInfo: 'GML_2_1_2.CoordType'
          }, {
            type: 'element',
            name: 'coordinates',
            elementName: 'coordinates',
            typeInfo: 'GML_2_1_2.CoordinatesType'
          }]
      }, {
        type: 'classInfo',
        localName: 'PointType',
        baseTypeInfo: 'GML_2_1_2.AbstractGeometryType',
        propertyInfos: [{
            type: 'element',
            name: 'coord',
            elementName: 'coord',
            typeInfo: 'GML_2_1_2.CoordType'
          }, {
            type: 'element',
            name: 'coordinates',
            elementName: 'coordinates',
            typeInfo: 'GML_2_1_2.CoordinatesType'
          }]
      }, {
        type: 'classInfo',
        localName: 'FeatureAssociationType',
        propertyInfos: [{
            name: 'feature',
            elementName: '_Feature',
            typeInfo: 'GML_2_1_2.AbstractFeatureType',
            type: 'elementRef'
          }, {
            name: 'remoteSchema',
            typeInfo: 'String',
            attributeName: {
              localPart: 'remoteSchema',
              namespaceURI: 'http:\/\/www.opengis.net\/gml'
            },
            type: 'attribute'
          }, {
            name: 'type',
            typeInfo: 'XLink_1_0.TypeType',
            attributeName: 'type',
            type: 'attribute'
          }, {
            name: 'href',
            typeInfo: 'String',
            attributeName: 'href',
            type: 'attribute'
          }, {
            name: 'role',
            typeInfo: 'String',
            attributeName: 'role',
            type: 'attribute'
          }, {
            name: 'arcrole',
            typeInfo: 'String',
            attributeName: 'arcrole',
            type: 'attribute'
          }, {
            name: 'title',
            typeInfo: 'String',
            attributeName: 'title',
            type: 'attribute'
          }, {
            name: 'show',
            typeInfo: 'XLink_1_0.ShowType',
            attributeName: 'show',
            type: 'attribute'
          }, {
            name: 'actuate',
            typeInfo: 'XLink_1_0.ActuateType',
            attributeName: 'actuate',
            type: 'attribute'
          }]
      }, {
        type: 'classInfo',
        localName: 'LineStringType',
        baseTypeInfo: 'GML_2_1_2.AbstractGeometryType',
        propertyInfos: [{
            type: 'element',
            name: 'coord',
            collection: true,
            elementName: 'coord',
            typeInfo: 'GML_2_1_2.CoordType'
          }, {
            type: 'element',
            name: 'coordinates',
            elementName: 'coordinates',
            typeInfo: 'GML_2_1_2.CoordinatesType'
          }]
      }, {
        type: 'classInfo',
        localName: 'MultiPolygonType',
        baseTypeInfo: 'GML_2_1_2.GeometryCollectionType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'PointMemberType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'LinearRingType',
        baseTypeInfo: 'GML_2_1_2.AbstractGeometryType',
        propertyInfos: [{
            type: 'element',
            name: 'coord',
            collection: true,
            elementName: 'coord',
            typeInfo: 'GML_2_1_2.CoordType'
          }, {
            type: 'element',
            name: 'coordinates',
            elementName: 'coordinates',
            typeInfo: 'GML_2_1_2.CoordinatesType'
          }]
      }, {
        type: 'classInfo',
        localName: 'PolygonMemberType',
        baseTypeInfo: 'GML_2_1_2.GeometryAssociationType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'AbstractFeatureCollectionBaseType',
        baseTypeInfo: 'GML_2_1_2.AbstractFeatureType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'AbstractGeometryCollectionBaseType',
        baseTypeInfo: 'GML_2_1_2.AbstractGeometryType',
        propertyInfos: []
      }, {
        type: 'classInfo',
        localName: 'GeometryPropertyType',
        propertyInfos: [{
            name: 'geometry',
            elementName: '_Geometry',
            typeInfo: 'GML_2_1_2.AbstractGeometryType',
            type: 'elementRef'
          }, {
            name: 'remoteSchema',
            typeInfo: 'String',
            attributeName: {
              localPart: 'remoteSchema',
              namespaceURI: 'http:\/\/www.opengis.net\/gml'
            },
            type: 'attribute'
          }, {
            name: 'type',
            typeInfo: 'XLink_1_0.TypeType',
            attributeName: 'type',
            type: 'attribute'
          }, {
            name: 'href',
            typeInfo: 'String',
            attributeName: 'href',
            type: 'attribute'
          }, {
            name: 'role',
            typeInfo: 'String',
            attributeName: 'role',
            type: 'attribute'
          }, {
            name: 'arcrole',
            typeInfo: 'String',
            attributeName: 'arcrole',
            type: 'attribute'
          }, {
            name: 'title',
            typeInfo: 'String',
            attributeName: 'title',
            type: 'attribute'
          }, {
            name: 'show',
            typeInfo: 'XLink_1_0.ShowType',
            attributeName: 'show',
            type: 'attribute'
          }, {
            name: 'actuate',
            typeInfo: 'XLink_1_0.ActuateType',
            attributeName: 'actuate',
            type: 'attribute'
          }]
      }, {
        type: 'enumInfo',
        localName: 'NullType',
        baseTypeInfo: 'String',
        values: ['inapplicable', 'unknown', 'unavailable', 'missing']
      }],
    elementInfos: [{
        elementName: 'multiPointProperty',
        typeInfo: 'GML_2_1_2.MultiPointPropertyType',
        substitutionHead: '_geometryProperty'
      }, {
        elementName: 'coverage',
        typeInfo: 'GML_2_1_2.PolygonPropertyType',
        substitutionHead: 'polygonProperty'
      }, {
        elementName: 'geometryMember',
        typeInfo: 'GML_2_1_2.GeometryAssociationType'
      }, {
        elementName: 'pointProperty',
        typeInfo: 'GML_2_1_2.PointPropertyType',
        substitutionHead: '_geometryProperty'
      }, {
        elementName: 'multiGeometryProperty',
        typeInfo: 'GML_2_1_2.MultiGeometryPropertyType',
        substitutionHead: '_geometryProperty'
      }, {
        elementName: 'boundedBy',
        typeInfo: 'GML_2_1_2.BoundingShapeType'
      }, {
        elementName: 'multiCenterLineOf',
        typeInfo: 'GML_2_1_2.MultiLineStringPropertyType',
        substitutionHead: 'multiLineStringProperty'
      }, {
        elementName: 'centerLineOf',
        typeInfo: 'GML_2_1_2.LineStringPropertyType',
        substitutionHead: 'lineStringProperty'
      }, {
        elementName: 'coordinates',
        typeInfo: 'GML_2_1_2.CoordinatesType'
      }, {
        elementName: 'Point',
        typeInfo: 'GML_2_1_2.PointType',
        substitutionHead: '_Geometry'
      }, {
        elementName: 'Box',
        typeInfo: 'GML_2_1_2.BoxType'
      }, {
        elementName: '_geometryProperty',
        typeInfo: 'GML_2_1_2.GeometryAssociationType'
      }, {
        elementName: 'multiCoverage',
        typeInfo: 'GML_2_1_2.MultiPolygonPropertyType',
        substitutionHead: 'multiPolygonProperty'
      }, {
        elementName: 'featureMember',
        typeInfo: 'GML_2_1_2.FeatureAssociationType'
      }, {
        elementName: 'multiPolygonProperty',
        typeInfo: 'GML_2_1_2.MultiPolygonPropertyType',
        substitutionHead: '_geometryProperty'
      }, {
        elementName: 'LineString',
        typeInfo: 'GML_2_1_2.LineStringType',
        substitutionHead: '_Geometry'
      }, {
        elementName: 'MultiPolygon',
        typeInfo: 'GML_2_1_2.MultiPolygonType',
        substitutionHead: '_Geometry'
      }, {
        elementName: '_Geometry',
        typeInfo: 'GML_2_1_2.AbstractGeometryType'
      }, {
        elementName: 'multiLocation',
        typeInfo: 'GML_2_1_2.MultiPointPropertyType',
        substitutionHead: 'multiPointProperty'
      }, {
        elementName: 'pointMember',
        typeInfo: 'GML_2_1_2.PointMemberType',
        substitutionHead: 'geometryMember'
      }, {
        elementName: 'multiPosition',
        typeInfo: 'GML_2_1_2.MultiPointPropertyType',
        substitutionHead: 'multiPointProperty'
      }, {
        elementName: 'name',
        typeInfo: 'String'
      }, {
        elementName: 'MultiGeometry',
        typeInfo: 'GML_2_1_2.GeometryCollectionType',
        substitutionHead: '_Geometry'
      }, {
        elementName: 'position',
        typeInfo: 'GML_2_1_2.PointPropertyType',
        substitutionHead: 'pointProperty'
      }, {
        elementName: 'multiEdgeOf',
        typeInfo: 'GML_2_1_2.MultiLineStringPropertyType',
        substitutionHead: 'multiLineStringProperty'
      }, {
        elementName: 'location',
        typeInfo: 'GML_2_1_2.PointPropertyType',
        substitutionHead: 'pointProperty'
      }, {
        elementName: '_Feature',
        typeInfo: 'GML_2_1_2.AbstractFeatureType'
      }, {
        elementName: 'polygonProperty',
        typeInfo: 'GML_2_1_2.PolygonPropertyType',
        substitutionHead: '_geometryProperty'
      }, {
        elementName: 'centerOf',
        typeInfo: 'GML_2_1_2.PointPropertyType',
        substitutionHead: 'pointProperty'
      }, {
        elementName: 'LinearRing',
        typeInfo: 'GML_2_1_2.LinearRingType',
        substitutionHead: '_Geometry'
      }, {
        elementName: 'lineStringProperty',
        typeInfo: 'GML_2_1_2.LineStringPropertyType',
        substitutionHead: '_geometryProperty'
      }, {
        elementName: 'polygonMember',
        typeInfo: 'GML_2_1_2.PolygonMemberType',
        substitutionHead: 'geometryMember'
      }, {
        elementName: 'outerBoundaryIs',
        typeInfo: 'GML_2_1_2.LinearRingMemberType'
      }, {
        elementName: 'multiCenterOf',
        typeInfo: 'GML_2_1_2.MultiPointPropertyType',
        substitutionHead: 'multiPointProperty'
      }, {
        elementName: 'edgeOf',
        typeInfo: 'GML_2_1_2.LineStringPropertyType',
        substitutionHead: 'lineStringProperty'
      }, {
        elementName: 'MultiLineString',
        typeInfo: 'GML_2_1_2.MultiLineStringType',
        substitutionHead: '_Geometry'
      }, {
        elementName: 'MultiPoint',
        typeInfo: 'GML_2_1_2.MultiPointType',
        substitutionHead: '_Geometry'
      }, {
        elementName: 'innerBoundaryIs',
        typeInfo: 'GML_2_1_2.LinearRingMemberType'
      }, {
        elementName: 'geometryProperty',
        typeInfo: 'GML_2_1_2.GeometryAssociationType'
      }, {
        elementName: 'description',
        typeInfo: 'String'
      }, {
        elementName: 'lineStringMember',
        typeInfo: 'GML_2_1_2.LineStringMemberType',
        substitutionHead: 'geometryMember'
      }, {
        elementName: '_FeatureCollection',
        typeInfo: 'GML_2_1_2.AbstractFeatureCollectionType',
        substitutionHead: '_Feature'
      }, {
        elementName: 'coord',
        typeInfo: 'GML_2_1_2.CoordType'
      }, {
        elementName: '_GeometryCollection',
        typeInfo: 'GML_2_1_2.GeometryCollectionType',
        substitutionHead: '_Geometry'
      }, {
        elementName: 'multiLineStringProperty',
        typeInfo: 'GML_2_1_2.MultiLineStringPropertyType',
        substitutionHead: '_geometryProperty'
      }, {
        elementName: 'extentOf',
        typeInfo: 'GML_2_1_2.PolygonPropertyType',
        substitutionHead: 'polygonProperty'
      }, {
        elementName: 'multiExtentOf',
        typeInfo: 'GML_2_1_2.MultiPolygonPropertyType',
        substitutionHead: 'multiPolygonProperty'
      }, {
        elementName: 'Polygon',
        typeInfo: 'GML_2_1_2.PolygonType',
        substitutionHead: '_Geometry'
      }]
  };
  return {
    GML_2_1_2: GML_2_1_2
  };
};
if (typeof define === 'function' && define.amd) {
  define([], GML_2_1_2_Module_Factory);
}
else {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.GML_2_1_2 = GML_2_1_2_Module_Factory().GML_2_1_2;
  }
  else {
    var GML_2_1_2 = GML_2_1_2_Module_Factory().GML_2_1_2;
  }
}