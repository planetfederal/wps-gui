var XLink_1_0_Module_Factory = function () {
  var XLink_1_0 = {
    name: 'XLink_1_0',
    defaultElementNamespaceURI: 'http:\/\/www.w3.org\/1999\/xlink',
    defaultAttributeNamespaceURI: 'http:\/\/www.w3.org\/1999\/xlink',
    typeInfos: [{
        type: 'classInfo',
        localName: 'LocatorType',
        propertyInfos: [{
            type: 'element',
            name: 'locatorTitle',
            collection: true,
            elementName: 'title',
            typeInfo: 'XLink_1_0.TitleEltType'
          }, {
            name: 'type',
            typeInfo: 'String',
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
            name: 'title',
            typeInfo: 'String',
            attributeName: 'title',
            type: 'attribute'
          }, {
            name: 'label',
            typeInfo: 'String',
            attributeName: 'label',
            type: 'attribute'
          }]
      }, {
        type: 'classInfo',
        localName: 'TitleEltType',
        propertyInfos: [{
            name: 'content',
            collection: true,
            allowDom: true,
            allowTypedObject: true,
            mixed: true,
            type: 'anyElement'
          }, {
            name: 'type',
            typeInfo: 'String',
            attributeName: 'type',
            type: 'attribute'
          }, {
            name: 'lang',
            typeInfo: 'String',
            attributeName: {
              localPart: 'lang',
              namespaceURI: 'http:\/\/www.w3.org\/XML\/1998\/namespace'
            },
            type: 'attribute'
          }]
      }, {
        type: 'classInfo',
        localName: 'ArcType',
        propertyInfos: [{
            type: 'element',
            name: 'locatorTitle',
            collection: true,
            elementName: 'title',
            typeInfo: 'XLink_1_0.TitleEltType'
          }, {
            name: 'type',
            typeInfo: 'String',
            attributeName: 'type',
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
            typeInfo: 'String',
            attributeName: 'show',
            type: 'attribute'
          }, {
            name: 'actuate',
            typeInfo: 'String',
            attributeName: 'actuate',
            type: 'attribute'
          }, {
            name: 'from',
            typeInfo: 'String',
            attributeName: 'from',
            type: 'attribute'
          }, {
            name: 'to',
            typeInfo: 'String',
            attributeName: 'to',
            type: 'attribute'
          }]
      }, {
        type: 'classInfo',
        localName: 'ResourceType',
        propertyInfos: [{
            name: 'content',
            collection: true,
            allowDom: true,
            allowTypedObject: true,
            mixed: true,
            type: 'anyElement'
          }, {
            name: 'type',
            typeInfo: 'String',
            attributeName: 'type',
            type: 'attribute'
          }, {
            name: 'role',
            typeInfo: 'String',
            attributeName: 'role',
            type: 'attribute'
          }, {
            name: 'title',
            typeInfo: 'String',
            attributeName: 'title',
            type: 'attribute'
          }, {
            name: 'label',
            typeInfo: 'String',
            attributeName: 'label',
            type: 'attribute'
          }]
      }, {
        type: 'classInfo',
        localName: 'Simple',
        propertyInfos: [{
            name: 'content',
            collection: true,
            allowDom: true,
            allowTypedObject: true,
            mixed: true,
            type: 'anyElement'
          }, {
            name: 'type',
            typeInfo: 'String',
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
            typeInfo: 'String',
            attributeName: 'show',
            type: 'attribute'
          }, {
            name: 'actuate',
            typeInfo: 'String',
            attributeName: 'actuate',
            type: 'attribute'
          }]
      }, {
        type: 'classInfo',
        localName: 'Extended',
        propertyInfos: [{
            name: 'extendedModel',
            collection: true,
            elementTypeInfos: [{
                elementName: 'title',
                typeInfo: 'XLink_1_0.TitleEltType'
              }, {
                elementName: 'resource',
                typeInfo: 'XLink_1_0.ResourceType'
              }, {
                elementName: 'locator',
                typeInfo: 'XLink_1_0.LocatorType'
              }, {
                elementName: 'arc',
                typeInfo: 'XLink_1_0.ArcType'
              }],
            type: 'elements'
          }, {
            name: 'type',
            typeInfo: 'String',
            attributeName: 'type',
            type: 'attribute'
          }, {
            name: 'role',
            typeInfo: 'String',
            attributeName: 'role',
            type: 'attribute'
          }, {
            name: 'title',
            typeInfo: 'String',
            attributeName: 'title',
            type: 'attribute'
          }]
      }, {
        type: 'enumInfo',
        localName: 'TypeType',
        baseTypeInfo: 'String',
        values: ['simple', 'extended', 'title', 'resource', 'locator', 'arc']
      }, {
        type: 'enumInfo',
        localName: 'ShowType',
        baseTypeInfo: 'String',
        values: ['new', 'replace', 'embed', 'other', 'none']
      }, {
        type: 'enumInfo',
        localName: 'ActuateType',
        baseTypeInfo: 'String',
        values: ['onLoad', 'onRequest', 'other', 'none']
      }],
    elementInfos: [{
        elementName: 'resource',
        typeInfo: 'XLink_1_0.ResourceType'
      }, {
        elementName: 'arc',
        typeInfo: 'XLink_1_0.ArcType'
      }, {
        elementName: 'title',
        typeInfo: 'XLink_1_0.TitleEltType'
      }, {
        elementName: 'locator',
        typeInfo: 'XLink_1_0.LocatorType'
      }]
  };
  return {
    XLink_1_0: XLink_1_0
  };
};
if (typeof define === 'function' && define.amd) {
  define([], XLink_1_0_Module_Factory);
}
else {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.XLink_1_0 = XLink_1_0_Module_Factory().XLink_1_0;
  }
  else {
    var XLink_1_0 = XLink_1_0_Module_Factory().XLink_1_0;
  }
}