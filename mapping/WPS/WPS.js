var WPS = {
  name: 'WPS',
  defaultElementNamespaceURI: 'http:\/\/www.opengis.net\/wps\/1.0.0',
  typeInfos: [{
      type: 'classInfo',
      localName: 'ExecuteResponse',
      baseTypeInfo: 'WPS.ResponseBaseType',
      propertyInfos: [{
          type: 'element',
          name: 'process',
          elementName: 'Process',
          typeInfo: 'WPS.ProcessBriefType'
        }, {
          type: 'element',
          name: 'status',
          elementName: 'Status',
          typeInfo: 'WPS.StatusType'
        }, {
          type: 'element',
          name: 'dataInputs',
          elementName: 'DataInputs',
          typeInfo: 'WPS.DataInputsType'
        }, {
          type: 'element',
          name: 'outputDefinitions',
          elementName: 'OutputDefinitions',
          typeInfo: 'WPS.OutputDefinitionsType'
        }, {
          type: 'element',
          name: 'processOutputs',
          elementName: 'ProcessOutputs',
          typeInfo: 'WPS.ExecuteResponse.ProcessOutputs'
        }, {
          name: 'serviceInstance',
          typeInfo: 'String',
          attributeName: 'serviceInstance',
          type: 'attribute'
        }, {
          name: 'statusLocation',
          typeInfo: 'String',
          attributeName: 'statusLocation',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'ResponseBaseType',
      propertyInfos: [{
          name: 'service',
          typeInfo: 'String',
          attributeName: 'service',
          type: 'attribute'
        }, {
          name: 'version',
          typeInfo: 'String',
          attributeName: 'version',
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
      localName: 'ProcessBriefType',
      baseTypeInfo: 'WPS.DescriptionType',
      propertyInfos: [{
          type: 'element',
          name: 'profile',
          collection: true,
          elementName: 'Profile',
          typeInfo: 'String'
        }, {
          type: 'element',
          name: 'wsdl',
          elementName: 'WSDL',
          typeInfo: 'WPS.WSDL'
        }, {
          name: 'processVersion',
          typeInfo: 'String',
          attributeName: {
            localPart: 'processVersion',
            namespaceURI: 'http:\/\/www.opengis.net\/wps\/1.0.0'
          },
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'StatusType',
      propertyInfos: [{
          type: 'element',
          name: 'processAccepted',
          elementName: 'ProcessAccepted',
          typeInfo: 'String'
        }, {
          type: 'element',
          name: 'processStarted',
          elementName: 'ProcessStarted',
          typeInfo: 'WPS.ProcessStartedType'
        }, {
          type: 'element',
          name: 'processPaused',
          elementName: 'ProcessPaused',
          typeInfo: 'WPS.ProcessStartedType'
        }, {
          type: 'element',
          name: 'processSucceeded',
          elementName: 'ProcessSucceeded',
          typeInfo: 'String'
        }, {
          type: 'element',
          name: 'processFailed',
          elementName: 'ProcessFailed',
          typeInfo: 'WPS.ProcessFailedType'
        }, {
          name: 'creationTime',
          typeInfo: 'Calendar',
          attributeName: 'creationTime',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'DataInputsType',
      propertyInfos: [{
          type: 'element',
          name: 'input',
          collection: true,
          elementName: 'Input',
          typeInfo: 'WPS.InputType'
        }]
    }, {
      type: 'classInfo',
      localName: 'OutputDefinitionsType',
      propertyInfos: [{
          type: 'element',
          name: 'output',
          collection: true,
          elementName: 'Output',
          typeInfo: 'WPS.DocumentOutputDefinitionType'
        }]
    }, {
      type: 'classInfo',
      localName: 'ExecuteResponse.ProcessOutputs',
      propertyInfos: [{
          type: 'element',
          name: 'output',
          collection: true,
          elementName: 'Output',
          typeInfo: 'WPS.OutputDataType'
        }]
    }, {
      type: 'classInfo',
      localName: 'ProcessOfferings',
      propertyInfos: [{
          type: 'element',
          name: 'process',
          collection: true,
          elementName: 'Process',
          typeInfo: 'WPS.ProcessBriefType'
        }]
    }, {
      type: 'classInfo',
      localName: 'GetCapabilities',
      propertyInfos: [{
          type: 'element',
          name: 'acceptVersions',
          elementName: 'AcceptVersions',
          typeInfo: 'OWS.AcceptVersionsType'
        }, {
          name: 'service',
          typeInfo: 'String',
          attributeName: 'service',
          type: 'attribute'
        }, {
          name: 'language',
          typeInfo: 'String',
          attributeName: 'language',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'DescribeProcess',
      baseTypeInfo: 'WPS.RequestBaseType',
      propertyInfos: [{
          type: 'element',
          name: 'identifier',
          collection: true,
          elementName: {
            localPart: 'Identifier',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.CodeType'
        }]
    }, {
      type: 'classInfo',
      localName: 'RequestBaseType',
      propertyInfos: [{
          name: 'service',
          typeInfo: 'String',
          attributeName: 'service',
          type: 'attribute'
        }, {
          name: 'version',
          typeInfo: 'String',
          attributeName: 'version',
          type: 'attribute'
        }, {
          name: 'language',
          typeInfo: 'String',
          attributeName: 'language',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'WSDL',
      propertyInfos: [{
          name: 'href',
          typeInfo: 'String',
          attributeName: {
            localPart: 'href',
            namespaceURI: 'http:\/\/www.w3.org\/1999\/xlink'
          },
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'Execute',
      baseTypeInfo: 'WPS.RequestBaseType',
      propertyInfos: [{
          type: 'element',
          name: 'identifier',
          elementName: {
            localPart: 'Identifier',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.CodeType'
        }, {
          type: 'element',
          name: 'dataInputs',
          elementName: 'DataInputs',
          typeInfo: 'WPS.DataInputsType'
        }, {
          type: 'element',
          name: 'responseForm',
          elementName: 'ResponseForm',
          typeInfo: 'WPS.ResponseFormType'
        }]
    }, {
      type: 'classInfo',
      localName: 'ResponseFormType',
      propertyInfos: [{
          type: 'element',
          name: 'responseDocument',
          elementName: 'ResponseDocument',
          typeInfo: 'WPS.ResponseDocumentType'
        }, {
          type: 'element',
          name: 'rawDataOutput',
          elementName: 'RawDataOutput',
          typeInfo: 'WPS.OutputDefinitionType'
        }]
    }, {
      type: 'classInfo',
      localName: 'WPSCapabilitiesType',
      baseTypeInfo: 'OWS.CapabilitiesBaseType',
      propertyInfos: [{
          type: 'element',
          name: 'processOfferings',
          elementName: 'ProcessOfferings',
          typeInfo: 'WPS.ProcessOfferings'
        }, {
          type: 'element',
          name: 'languages',
          elementName: 'Languages',
          typeInfo: 'WPS.Languages'
        }, {
          type: 'element',
          name: 'wsdl',
          elementName: 'WSDL',
          typeInfo: 'WPS.WSDL'
        }, {
          name: 'service',
          typeInfo: 'String',
          attributeName: 'service',
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
      localName: 'ProcessDescriptions',
      baseTypeInfo: 'WPS.ResponseBaseType',
      propertyInfos: [{
          type: 'element',
          name: 'processDescription',
          collection: true,
          elementName: {
            localPart: 'ProcessDescription'
          },
          typeInfo: 'WPS.ProcessDescriptionType'
        }]
    }, {
      type: 'classInfo',
      localName: 'ProcessDescriptionType',
      baseTypeInfo: 'WPS.ProcessBriefType',
      propertyInfos: [{
          type: 'element',
          name: 'dataInputs',
          elementName: {
            localPart: 'DataInputs'
          },
          typeInfo: 'WPS.ProcessDescriptionType.DataInputs'
        }, {
          type: 'element',
          name: 'processOutputs',
          elementName: {
            localPart: 'ProcessOutputs'
          },
          typeInfo: 'WPS.ProcessDescriptionType.ProcessOutputs'
        }, {
          name: 'storeSupported',
          typeInfo: 'Boolean',
          attributeName: 'storeSupported',
          type: 'attribute'
        }, {
          name: 'statusSupported',
          typeInfo: 'Boolean',
          attributeName: 'statusSupported',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'Languages',
      propertyInfos: [{
          type: 'element',
          name: '_default',
          elementName: 'Default',
          typeInfo: 'WPS.Languages.Default'
        }, {
          type: 'element',
          name: 'supported',
          elementName: 'Supported',
          typeInfo: 'WPS.LanguagesType'
        }]
    }, {
      type: 'classInfo',
      localName: 'Languages.Default',
      propertyInfos: [{
          type: 'element',
          name: 'language',
          elementName: {
            localPart: 'Language',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'String'
        }]
    }, {
      type: 'classInfo',
      localName: 'LanguagesType',
      propertyInfos: [{
          type: 'element',
          name: 'language',
          collection: true,
          elementName: {
            localPart: 'Language',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'String'
        }]
    }, {
      type: 'classInfo',
      localName: 'OutputReferenceType',
      propertyInfos: [{
          name: 'href',
          typeInfo: 'String',
          attributeName: 'href',
          type: 'attribute'
        }, {
          name: 'mimeType',
          typeInfo: 'String',
          attributeName: 'mimeType',
          type: 'attribute'
        }, {
          name: 'encoding',
          typeInfo: 'String',
          attributeName: 'encoding',
          type: 'attribute'
        }, {
          name: 'schema',
          typeInfo: 'String',
          attributeName: 'schema',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'DataType',
      propertyInfos: [{
          type: 'element',
          name: 'complexData',
          elementName: 'ComplexData',
          typeInfo: 'WPS.ComplexDataType'
        }, {
          type: 'element',
          name: 'literalData',
          elementName: 'LiteralData',
          typeInfo: 'WPS.LiteralDataType'
        }, {
          type: 'element',
          name: 'boundingBoxData',
          elementName: 'BoundingBoxData',
          typeInfo: 'OWS.BoundingBoxType'
        }]
    }, {
      type: 'classInfo',
      localName: 'ComplexDataCombinationType',
      propertyInfos: [{
          type: 'element',
          name: 'format',
          elementName: {
            localPart: 'Format'
          },
          typeInfo: 'WPS.ComplexDataDescriptionType'
        }]
    }, {
      type: 'classInfo',
      localName: 'OutputDataType',
      baseTypeInfo: 'WPS.DescriptionType',
      propertyInfos: [{
          type: 'element',
          name: 'reference',
          elementName: 'Reference',
          typeInfo: 'WPS.OutputReferenceType'
        }, {
          type: 'element',
          name: 'data',
          elementName: 'Data',
          typeInfo: 'WPS.DataType'
        }]
    }, {
      type: 'classInfo',
      localName: 'ValuesReferenceType',
      propertyInfos: [{
          name: 'reference',
          typeInfo: 'String',
          attributeName: {
            localPart: 'reference',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          type: 'attribute'
        }, {
          name: 'valuesForm',
          typeInfo: 'String',
          attributeName: 'valuesForm',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'InputDescriptionType',
      baseTypeInfo: 'WPS.DescriptionType',
      propertyInfos: [{
          type: 'element',
          name: 'complexData',
          elementName: {
            localPart: 'ComplexData'
          },
          typeInfo: 'WPS.SupportedComplexDataInputType'
        }, {
          type: 'element',
          name: 'literalData',
          elementName: {
            localPart: 'LiteralData'
          },
          typeInfo: 'WPS.LiteralInputType'
        }, {
          type: 'element',
          name: 'boundingBoxData',
          elementName: {
            localPart: 'BoundingBoxData'
          },
          typeInfo: 'WPS.SupportedCRSsType'
        }, {
          name: 'minOccurs',
          typeInfo: 'Integer',
          attributeName: 'minOccurs',
          type: 'attribute'
        }, {
          name: 'maxOccurs',
          typeInfo: 'Integer',
          attributeName: 'maxOccurs',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'DescriptionType',
      propertyInfos: [{
          type: 'element',
          name: 'identifier',
          elementName: {
            localPart: 'Identifier',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.CodeType'
        }, {
          type: 'element',
          name: 'title',
          elementName: {
            localPart: 'Title',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.LanguageStringType'
        }, {
          type: 'element',
          name: '_abstract',
          elementName: {
            localPart: 'Abstract',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.LanguageStringType'
        }, {
          type: 'element',
          name: 'metadata',
          collection: true,
          elementName: {
            localPart: 'Metadata',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.MetadataType'
        }]
    }, {
      type: 'classInfo',
      localName: 'ProcessFailedType',
      propertyInfos: [{
          type: 'element',
          name: 'exceptionReport',
          elementName: {
            localPart: 'ExceptionReport',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.ExceptionReport'
        }]
    }, {
      type: 'classInfo',
      localName: 'SupportedCRSsType',
      propertyInfos: [{
          type: 'element',
          name: '_default',
          elementName: {
            localPart: 'Default'
          },
          typeInfo: 'WPS.SupportedCRSsType.Default'
        }, {
          type: 'element',
          name: 'supported',
          elementName: {
            localPart: 'Supported'
          },
          typeInfo: 'WPS.CRSsType'
        }]
    }, {
      type: 'classInfo',
      localName: 'SupportedUOMsType',
      propertyInfos: [{
          type: 'element',
          name: '_default',
          elementName: {
            localPart: 'Default'
          },
          typeInfo: 'WPS.SupportedUOMsType.Default'
        }, {
          type: 'element',
          name: 'supported',
          elementName: {
            localPart: 'Supported'
          },
          typeInfo: 'WPS.UOMsType'
        }]
    }, {
      type: 'classInfo',
      localName: 'DocumentOutputDefinitionType',
      baseTypeInfo: 'WPS.OutputDefinitionType',
      propertyInfos: [{
          type: 'element',
          name: 'title',
          elementName: {
            localPart: 'Title',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.LanguageStringType'
        }, {
          type: 'element',
          name: '_abstract',
          elementName: {
            localPart: 'Abstract',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.LanguageStringType'
        }, {
          name: 'asReference',
          typeInfo: 'Boolean',
          attributeName: 'asReference',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'ComplexDataType',
      propertyInfos: [{
          name: 'otherAttributes',
          type: 'anyAttribute'
        }, {
          name: 'any',
          collection: true,
          domAllowed: true,
          type: 'anyElement'
        }, {
          name: 'mimeType',
          typeInfo: 'String',
          attributeName: 'mimeType',
          type: 'attribute'
        }, {
          name: 'encoding',
          typeInfo: 'String',
          attributeName: 'encoding',
          type: 'attribute'
        }, {
          name: 'schema',
          typeInfo: 'String',
          attributeName: 'schema',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'InputType',
      propertyInfos: [{
          type: 'element',
          name: 'identifier',
          elementName: {
            localPart: 'Identifier',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.CodeType'
        }, {
          type: 'element',
          name: 'title',
          elementName: {
            localPart: 'Title',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.LanguageStringType'
        }, {
          type: 'element',
          name: '_abstract',
          elementName: {
            localPart: 'Abstract',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.LanguageStringType'
        }, {
          type: 'element',
          name: 'reference',
          elementName: 'Reference',
          typeInfo: 'WPS.InputReferenceType'
        }, {
          type: 'element',
          name: 'data',
          elementName: 'Data',
          typeInfo: 'WPS.DataType'
        }]
    }, {
      type: 'classInfo',
      localName: 'OutputDescriptionType',
      baseTypeInfo: 'WPS.DescriptionType',
      propertyInfos: [{
          type: 'element',
          name: 'complexOutput',
          elementName: {
            localPart: 'ComplexOutput'
          },
          typeInfo: 'WPS.SupportedComplexDataType'
        }, {
          type: 'element',
          name: 'literalOutput',
          elementName: {
            localPart: 'LiteralOutput'
          },
          typeInfo: 'WPS.LiteralOutputType'
        }, {
          type: 'element',
          name: 'boundingBoxOutput',
          elementName: {
            localPart: 'BoundingBoxOutput'
          },
          typeInfo: 'WPS.SupportedCRSsType'
        }]
    }, {
      type: 'classInfo',
      localName: 'SupportedComplexDataType',
      propertyInfos: [{
          type: 'element',
          name: '_default',
          elementName: {
            localPart: 'Default'
          },
          typeInfo: 'WPS.ComplexDataCombinationType'
        }, {
          type: 'element',
          name: 'supported',
          elementName: {
            localPart: 'Supported'
          },
          typeInfo: 'WPS.ComplexDataCombinationsType'
        }]
    }, {
      type: 'classInfo',
      localName: 'ComplexDataCombinationsType',
      propertyInfos: [{
          type: 'element',
          name: 'format',
          collection: true,
          elementName: {
            localPart: 'Format'
          },
          typeInfo: 'WPS.ComplexDataDescriptionType'
        }]
    }, {
      type: 'classInfo',
      localName: 'OutputDefinitionType',
      propertyInfos: [{
          type: 'element',
          name: 'identifier',
          elementName: {
            localPart: 'Identifier',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.CodeType'
        }, {
          name: 'uom',
          typeInfo: 'String',
          attributeName: 'uom',
          type: 'attribute'
        }, {
          name: 'mimeType',
          typeInfo: 'String',
          attributeName: 'mimeType',
          type: 'attribute'
        }, {
          name: 'encoding',
          typeInfo: 'String',
          attributeName: 'encoding',
          type: 'attribute'
        }, {
          name: 'schema',
          typeInfo: 'String',
          attributeName: 'schema',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'LiteralInputType',
      baseTypeInfo: 'WPS.LiteralOutputType',
      propertyInfos: [{
          type: 'element',
          name: 'allowedValues',
          elementName: {
            localPart: 'AllowedValues',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.AllowedValues'
        }, {
          type: 'element',
          name: 'anyValue',
          elementName: {
            localPart: 'AnyValue',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.AnyValue'
        }, {
          type: 'element',
          name: 'valuesReference',
          elementName: {
            localPart: 'ValuesReference'
          },
          typeInfo: 'WPS.ValuesReferenceType'
        }, {
          type: 'element',
          name: 'defaultValue',
          elementName: {
            localPart: 'DefaultValue'
          },
          typeInfo: 'String'
        }]
    }, {
      type: 'classInfo',
      localName: 'LiteralOutputType',
      propertyInfos: [{
          type: 'element',
          name: 'dataType',
          elementName: {
            localPart: 'DataType',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.DomainMetadataType'
        }, {
          type: 'element',
          name: 'uoMs',
          elementName: {
            localPart: 'UOMs'
          },
          typeInfo: 'WPS.SupportedUOMsType'
        }]
    }, {
      type: 'classInfo',
      localName: 'InputReferenceType',
      propertyInfos: [{
          type: 'element',
          name: 'header',
          collection: true,
          elementName: 'Header',
          typeInfo: 'WPS.InputReferenceType.Header'
        }, {
          type: 'element',
          name: 'body',
          elementName: 'Body',
          typeInfo: 'AnyType'
        }, {
          type: 'element',
          name: 'bodyReference',
          elementName: 'BodyReference',
          typeInfo: 'WPS.InputReferenceType.BodyReference'
        }, {
          name: 'href',
          typeInfo: 'String',
          attributeName: {
            localPart: 'href',
            namespaceURI: 'http:\/\/www.w3.org\/1999\/xlink'
          },
          type: 'attribute'
        }, {
          name: 'method',
          typeInfo: 'String',
          attributeName: 'method',
          type: 'attribute'
        }, {
          name: 'mimeType',
          typeInfo: 'String',
          attributeName: 'mimeType',
          type: 'attribute'
        }, {
          name: 'encoding',
          typeInfo: 'String',
          attributeName: 'encoding',
          type: 'attribute'
        }, {
          name: 'schema',
          typeInfo: 'String',
          attributeName: 'schema',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'LiteralDataType',
      propertyInfos: [{
          name: 'value',
          typeInfo: 'String',
          type: 'value'
        }, {
          name: 'dataType',
          typeInfo: 'String',
          attributeName: 'dataType',
          type: 'attribute'
        }, {
          name: 'uom',
          typeInfo: 'String',
          attributeName: 'uom',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'ResponseDocumentType',
      propertyInfos: [{
          type: 'element',
          name: 'output',
          collection: true,
          elementName: 'Output',
          typeInfo: 'WPS.DocumentOutputDefinitionType'
        }, {
          name: 'storeExecuteResponse',
          typeInfo: 'Boolean',
          attributeName: 'storeExecuteResponse',
          type: 'attribute'
        }, {
          name: 'lineage',
          typeInfo: 'Boolean',
          attributeName: 'lineage',
          type: 'attribute'
        }, {
          name: 'status',
          typeInfo: 'Boolean',
          attributeName: 'status',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'CRSsType',
      propertyInfos: [{
          type: 'element',
          name: 'crs',
          collection: true,
          elementName: {
            localPart: 'CRS'
          },
          typeInfo: 'String'
        }]
    }, {
      type: 'classInfo',
      localName: 'UOMsType',
      propertyInfos: [{
          type: 'element',
          name: 'uom',
          collection: true,
          elementName: {
            localPart: 'UOM',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.DomainMetadataType'
        }]
    }, {
      type: 'classInfo',
      localName: 'ComplexDataDescriptionType',
      propertyInfos: [{
          type: 'element',
          name: 'mimeType',
          elementName: {
            localPart: 'MimeType'
          },
          typeInfo: 'String'
        }, {
          type: 'element',
          name: 'encoding',
          elementName: {
            localPart: 'Encoding'
          },
          typeInfo: 'String'
        }, {
          type: 'element',
          name: 'schema',
          elementName: {
            localPart: 'Schema'
          },
          typeInfo: 'String'
        }]
    }, {
      type: 'classInfo',
      localName: 'ProcessStartedType',
      propertyInfos: [{
          name: 'value',
          typeInfo: 'String',
          type: 'value'
        }, {
          name: 'percentCompleted',
          typeInfo: 'Int',
          attributeName: 'percentCompleted',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'SupportedComplexDataInputType',
      baseTypeInfo: 'WPS.SupportedComplexDataType',
      propertyInfos: [{
          type: 'element',
          name: 'defaultValue',
          elementName: {
            localPart: 'DefaultValue'
          },
          typeInfo: 'WPS.ComplexDataType'
        }, {
          name: 'maximumMegabytes',
          typeInfo: 'Integer',
          attributeName: 'maximumMegabytes',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'InputReferenceType.Header',
      propertyInfos: [{
          name: 'key',
          typeInfo: 'String',
          attributeName: 'key',
          type: 'attribute'
        }, {
          name: 'value',
          typeInfo: 'String',
          attributeName: 'value',
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'InputReferenceType.BodyReference',
      propertyInfos: [{
          name: 'href',
          typeInfo: 'String',
          attributeName: {
            localPart: 'href',
            namespaceURI: 'http:\/\/www.w3.org\/1999\/xlink'
          },
          type: 'attribute'
        }]
    }, {
      type: 'classInfo',
      localName: 'SupportedUOMsType.Default',
      propertyInfos: [{
          type: 'element',
          name: 'uom',
          elementName: {
            localPart: 'UOM',
            namespaceURI: 'http:\/\/www.opengis.net\/ows\/1.1'
          },
          typeInfo: 'OWS.DomainMetadataType'
        }]
    }, {
      type: 'classInfo',
      localName: 'SupportedCRSsType.Default',
      propertyInfos: [{
          type: 'element',
          name: 'crs',
          elementName: {
            localPart: 'CRS'
          },
          typeInfo: 'String'
        }]
    }, {
      type: 'classInfo',
      localName: 'ProcessDescriptionType.DataInputs',
      propertyInfos: [{
          type: 'element',
          name: 'input',
          collection: true,
          elementName: {
            localPart: 'Input'
          },
          typeInfo: 'WPS.InputDescriptionType'
        }]
    }, {
      type: 'classInfo',
      localName: 'ProcessDescriptionType.ProcessOutputs',
      propertyInfos: [{
          type: 'element',
          name: 'output',
          collection: true,
          elementName: {
            localPart: 'Output'
          },
          typeInfo: 'WPS.OutputDescriptionType'
        }]
    }],
  elementInfos: [{
      elementName: 'ExecuteResponse',
      typeInfo: 'WPS.ExecuteResponse'
    }, {
      elementName: 'ProcessOfferings',
      typeInfo: 'WPS.ProcessOfferings'
    }, {
      elementName: 'GetCapabilities',
      typeInfo: 'WPS.GetCapabilities'
    }, {
      elementName: 'DescribeProcess',
      typeInfo: 'WPS.DescribeProcess'
    }, {
      elementName: 'WSDL',
      typeInfo: 'WPS.WSDL'
    }, {
      elementName: 'Execute',
      typeInfo: 'WPS.Execute'
    }, {
      elementName: 'ProcessDescriptions',
      typeInfo: 'WPS.ProcessDescriptions'
    }, {
      elementName: 'Languages',
      typeInfo: 'WPS.Languages'
    }, {
      elementName: 'Capabilities',
      typeInfo: 'WPS.WPSCapabilitiesType'
    }]
};
if (typeof require === 'function') {
  module.exports.WPS = WPS;
}