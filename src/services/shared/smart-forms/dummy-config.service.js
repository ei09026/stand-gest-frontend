export default {
    configurations: {
        retrieve (slug) {
            // requestService.retrieve(API_V2_URL + '/smart-forms/', {slug: slug})

            if (slug === 'CREATE_PARTNER') {
                return {
                    slug: 'CREATE_PARTNER',
                    wizard: {
                        finishableFrom: 0,
                        steps: [
                            {
                                title: 'Dados Gerais',
                                icon: 'fa fa-user',
                                fields: ['partnerType', 'partnerGroup', 'title', 'academicTitle', 'firstName', 'lastName', 'nationality', 'gender', 'maritalStatus', 'birthdate', 'birthplace', 'legalOrganization', 'countryName',
                                    'originCountry', 'partnerKind', 'source', 'organizationName1', 'organizationName2', 'sectorialSystem', 'industrialSector', 'legalEntity', 'searchItem1', 'searchItem2', 'vip', 'validPartner',
                                    'countryIsoCode', 'countryIsoCode2', 'correspondenceLanguage', 'correspondenceLanguageIso', 'partnerLanguage', 'partnerLanguageIso', 'applicationLanguage']
                            },
                            {
                                title: 'Contactos',
                                icon: 'fa fa-phone',
                                fields: ['phoneNumber', 'mobileNumber', 'email']
                            },
                            {
                                title: 'Morada',
                                icon: 'fa fa-map-marker',
                                fields: ['addressCountry', 'region', 'city', 'neighborhood', 'street', 'doorNumber', 'floor', 'postalCode', 'landmark', 'standardAddress', 'addressPhoneNumber', 'faxNumber']
                            },
                            {
                                title: 'Documentos',
                                icon: 'fa fa-address-card-o',
                                fields: ['type', 'number', 'institute', 'entryDate', 'fromDate', 'toDate', 'documentCountry', 'IsoCode']
                            }
                        ]
                    },

                    fieldValidations: [
                        {
                            field: 'birthdate',
                            expression: 'ofAge'
                        },
                        {
                            field: 'email',
                            expression: 'email|max:241'
                        },
                        {
                            field: 'firstName',
                            expression: 'max:40|min:3'
                        },
                        {
                            field: 'lastName',
                            expression: 'max:40'
                        },
                        {
                            field: 'organizationName1',
                            expression: 'max:40|min:3'
                        },
                        {
                            field: 'organizationName2',
                            expression: 'max:40'
                        },
                        {
                            field: 'birthplace',
                            expression: 'max:40'
                        },
                        {
                            field: 'phoneNumber',
                            expression: 'max:30|min:9|phone'
                        },
                        {
                            field: 'mobileNumber',
                            expression: 'max:30|min:9|phone'
                        },
                        {
                            field: 'street',
                            expression: 'max:60'
                        },
                        {
                            field: 'doorNumber',
                            expression: 'max:10'
                        },
                        {
                            field: 'floor',
                            expression: 'max:10'
                        },
                        {
                            field: 'landmark',
                            expression: 'max:40'
                        },
                        {
                            field: 'addressPhoneNumber',
                            expression: 'max:30|min:9|phone'
                        },
                        {
                            field: 'faxNumber',
                            expression: 'max:30|min:9'
                        },
                        {
                            field: 'number',
                            expression: 'max:60'
                        },
                        {
                            field: 'institute',
                            expression: 'max:40'
                        },
                        {
                            field: 'toDate',
                            expression: 'gETDate:#fromDate'
                        },
                        {
                            field: 'fromDate',
                            expression: 'lETDate:#toDate|lEToday'
                        }
                    ],

                    fieldConfigurations: [
                        {
                            // apply this configuration to these fields
                            fields: ['partnerType'],

                            visible: {
                                default: true
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['searchItem1', 'searchItem2'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: true
                            },

                            value: {
                                default: null
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['partnerGroup'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'ZBP'
                            }
                        },
                        {
                            // apply this configuration to these fields
                            fields: ['title', 'type', 'number', 'street', 'doorNumber', 'fromDate', 'toDate'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            fields: ['vip', 'email', 'floor', 'landmark', 'addressPhoneNumber', 'faxNumber', 'institute'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Nullable partner type',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            fields: ['documentCountry'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Nullable partner type',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: 'AO'
                            }
                        },

                        {
                            fields: ['entryDate'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: ''
                            }
                        },
                        {
                            fields: ['organizationName1', 'legalOrganization', 'legalEntity', 'sectorialSystem'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Organization visible fields',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'If partner type is organization',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },
                        {
                            fields: ['organizationName2'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Organization visible fields',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },
                        {
                            fields: ['industrialSector'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Organization visible fields',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'If partner type is organization',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            readOnly: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'If sectorial system is not null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'sectorialSystem',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            value: {
                                default: ''
                            }
                        },
                        {
                            fields: ['firstName', 'lastName', 'gender', 'birthdate', 'nationality'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Individual visible fields',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '1'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'If partner type is organization',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },
                        {
                            fields: ['academicTitle', 'birthplace', 'maritalStatus'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Individual visible fields',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '1'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },
                        {
                            fields: ['validPartner'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: '',
                                rules: [
                                    {
                                        value: 'X',
                                        description: 'Checked if type partner individual',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '1'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            // apply this configuration to these fields
                            fields: ['partnerKind'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'ISU1'
                            }
                        },
                        {
                            // apply this configuration to these fields
                            fields: ['source'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: '0008'
                            }
                        },
                        {
                            // apply this configuration to these fields
                            fields: ['IsoCode'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'AO'
                            }
                        },
                        {
                            // apply this configuration to these fields
                            fields: ['countryIsoCode', 'countryIsoCode2', 'originCountry', 'countryName'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'AO',
                                rules: [
                                    {
                                        value: '',
                                        description: 'Empty if partner type organization',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            fields: ['correspondenceLanguage', 'correspondenceLanguageIso', 'partnerLanguage', 'partnerLanguageIso'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'P',
                                rules: [
                                    {
                                        value: '',
                                        description: 'Empty if partner type organization',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            fields: ['postalCode'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: '10001-001'
                            }
                        },
                        {
                            fields: ['applicationLanguage'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'P'
                            }
                        },
                        {
                            fields: ['standardAddress'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'X'
                            }
                        },

                        {
                            fields: ['region'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'Address Country is not null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'addressCountry',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            fields: ['city'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'Region is not null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'region',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            fields: ['neighborhood'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'City is not null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'city',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['phoneNumber'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'Mandatory if mobile number is null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'mobileNumber',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: ''
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['mobileNumber'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'Mandatory if phone number is null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'phoneNumber',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: ''
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['addressCountry'],

                            visible: {
                                default: false
                                // rules: [
                                //     {
                                //         value: true,
                                //         description: 'Visible if partner type is not empty',
                                //         conditionSet: [
                                //             {
                                //                 aggregator: 'and',
                                //                 condition: {
                                //                     field: 'partnerType',
                                //                     operator: '!=',
                                //                     target: [
                                //                         {
                                //                             type: 'value', // value|field
                                //                             value: null
                                //                         }
                                //                     ]
                                //                 }
                                //             }
                                //         ]
                                //     }
                                // ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'AO'
                            }
                        }
                    ]
                }
            }
            if (slug === 'EDIT_PARTNER') {
                return {
                    id: 1,
                    slug: 'EDIT_PARTNER',

                    // Each array index is a step
                    wizard: {
                        finishableFrom: 0,
                        steps: [
                            {
                                title: 'Dados Gerais',
                                icon: 'fa fa-user',
                                fields: ['partnerType', 'partnerGroup', 'title', 'academicTitle', 'firstName', 'lastName', 'nationality', 'gender', 'maritalStatus', 'birthdate', 'birthplace', 'legalOrganization', 'countryName',
                                    'originCountry', 'partnerKind', 'source', 'organizationName1', 'organizationName2', 'sectorialSystem', 'industrialSector', 'legalEntity', 'searchItem1', 'searchItem2', 'vip', 'validPartner',
                                    'countryIsoCode', 'countryIsoCode2', 'correspondenceLanguage', 'correspondenceLanguageIso', 'partnerLanguage', 'partnerLanguageIso', 'applicationLanguage']
                            },
                            {
                                title: 'Contactos',
                                icon: 'fa fa-phone',
                                fields: ['phoneNumber', 'mobileNumber', 'email']
                            },
                            {
                                title: 'Morada',
                                icon: 'fa fa-map-marker',
                                fields: ['addressCountry', 'region', 'city', 'neighborhood', 'street', 'doorNumber', 'floor', 'postalCode', 'landmark', 'standardAddress', 'addressPhoneNumber', 'faxNumber']
                            },
                            {
                                title: 'Documentos',
                                icon: 'fa fa-address-card-o',
                                fields: ['type', 'number', 'institute', 'entryDate', 'fromDate', 'toDate', 'documentCountry', 'IsoCode']
                            }
                        ]
                    },

                    fieldValidations: [
                        {
                            field: 'birthdate',
                            expression: 'ofAge'
                        },
                        {
                            field: 'email',
                            expression: 'email|max:241'
                        },
                        {
                            field: 'firstName',
                            expression: 'max:40|min:3'
                        },
                        {
                            field: 'lastName',
                            expression: 'max:40'
                        },
                        {
                            field: 'organizationName1',
                            expression: 'max:40|min:3'
                        },
                        {
                            field: 'organizationName2',
                            expression: 'max:40'
                        },
                        {
                            field: 'birthplace',
                            expression: 'max:40'
                        },
                        {
                            field: 'phoneNumber',
                            expression: 'max:30|min:9|phone'
                        },
                        {
                            field: 'mobileNumber',
                            expression: 'max:30|min:9|phone'
                        },
                        {
                            field: 'street',
                            expression: 'max:60'
                        },
                        {
                            field: 'doorNumber',
                            expression: 'max:10'
                        },
                        {
                            field: 'floor',
                            expression: 'max:10'
                        },
                        {
                            field: 'landmark',
                            expression: 'max:40'
                        },
                        {
                            field: 'addressPhoneNumber',
                            expression: 'max:30|min:9|phone'
                        },
                        {
                            field: 'faxNumber',
                            expression: 'max:30|min:9'
                        },
                        {
                            field: 'number',
                            expression: 'max:60'
                        },
                        {
                            field: 'institute',
                            expression: 'max:40'
                        },
                        {
                            field: 'toDate',
                            expression: 'gETDate:#fromDate'
                        },
                        {
                            field: 'fromDate',
                            expression: 'lETDate:#toDate|lEToday'
                        }
                    ],

                    fieldConfigurations: [
                        {
                            // apply this configuration to these fields
                            fields: ['partnerType'],

                            visible: {
                                default: true
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: true
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['partnerGroup'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'ZBP'
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['searchItem1', 'searchItem2'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: true
                            },

                            value: {
                                default: null
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['title', 'type', 'number', 'street', 'doorNumber', 'fromDate', 'toDate'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            fields: ['vip', 'email', 'floor', 'landmark', 'addressPhoneNumber', 'faxNumber', 'institute'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Nullable partner type',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            fields: ['documentCountry'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Nullable partner type',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: 'AO'
                            }
                        },

                        {
                            fields: ['entryDate'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: ''
                            }
                        },

                        {
                            fields: ['organizationName1', 'legalOrganization', 'legalEntity', 'sectorialSystem'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Organization visible fields',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'If partner type is organization',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            fields: ['organizationName2'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Organization visible fields',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            fields: ['industrialSector'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Organization visible fields',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'If partner type is organization',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            readOnly: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'If sectorial system is not null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'sectorialSystem',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            value: {
                                default: ''
                            }
                        },
                        {
                            fields: ['firstName', 'lastName', 'gender', 'birthdate', 'nationality'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Individual visible fields',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '1'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'If partner type is organization',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },
                        {
                            fields: ['academicTitle', 'birthplace', 'maritalStatus'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Individual visible fields',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '1'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },
                        {
                            fields: ['validPartner'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: '',
                                rules: [
                                    {
                                        value: 'X',
                                        description: 'Checked if type partner individual',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '1'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            // apply this configuration to these fields
                            fields: ['partnerKind'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'ISU1'
                            }
                        },
                        {
                            // apply this configuration to these fields
                            fields: ['source'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: '0008'
                            }
                        },
                        {
                            // apply this configuration to these fields
                            fields: ['IsoCode'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'AO'
                            }
                        },
                        {
                            // apply this configuration to these fields
                            fields: ['countryIsoCode', 'countryIsoCode2', 'originCountry', 'countryName'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'AO',
                                rules: [
                                    {
                                        value: '',
                                        description: 'Empty if partner type organization',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            fields: ['correspondenceLanguage', 'correspondenceLanguageIso', 'partnerLanguage', 'partnerLanguageIso'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'P',
                                rules: [
                                    {
                                        value: '',
                                        description: 'Empty if partner type organization',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '==',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: '2'
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            fields: ['postalCode'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: '10001-001'
                            }
                        },
                        {
                            fields: ['applicationLanguage'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'P'
                            }
                        },
                        {
                            fields: ['standardAddress'],

                            visible: {
                                default: false
                            },

                            mandatory: {
                                default: false
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'X'
                            }
                        },

                        {
                            fields: ['region'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'Address Country is not null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'addressCountry',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            fields: ['city'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'Region is not null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'region',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            fields: ['neighborhood'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'City is not null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'city',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            value: {
                                // We must define some dynamic tags, like:
                                // [TODAY], [START_OF_MONTH], [END_OF_MONTH]
                                default: ''
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['phoneNumber'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'Mandatory if mobile number is null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'mobileNumber',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: ''
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['mobileNumber'],

                            visible: {
                                default: false,
                                rules: [
                                    {
                                        value: true,
                                        description: 'Visible if partner type is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'partnerType',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            mandatory: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'Mandatory if phone number is null',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'phoneNumber',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value', // value|field
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: ''
                            }
                        },

                        {
                            // apply this configuration to these fields
                            fields: ['addressCountry'],

                            visible: {
                                default: false
                                // rules: [
                                //     {
                                //         value: true,
                                //         description: 'Visible if partner type is not empty',
                                //         conditionSet: [
                                //             {
                                //                 aggregator: 'and',
                                //                 condition: {
                                //                     field: 'partnerType',
                                //                     operator: '!=',
                                //                     target: [
                                //                         {
                                //                             type: 'value', // value|field
                                //                             value: null
                                //                         }
                                //                     ]
                                //                 }
                                //             }
                                //         ]
                                //     }
                                // ]
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: 'AO'
                            }
                        }
                    ]
                }
            }
            if (slug === 'CREATE_PARTNER_CONTRACT_ACCOUNT') {
                return {
                    slug: 'PARTNER_CONTRACT_ACCOUNT_CREATE',
                    wizard: {
                        finishableFrom: 1,
                        steps: [
                            {
                                title: '',
                                icon: '',
                                fields: ['divisionCode', 'validationGroup', 'accountCode']
                            }
                        ]
                    },
                    fieldConfigurations: [
                        {
                            // apply this configuration to these fields
                            fields: ['divisionCode', 'validationGroup'],

                            visible: {
                                default: true
                            },

                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: false
                            },

                            value: {
                                default: ''
                            }
                        },
                        {
                            fields: ['accountCode'],

                            visible: {
                                default: true
                            },
                            mandatory: {
                                default: true
                            },

                            readOnly: {
                                default: true,
                                rules: [
                                    {
                                        value: false,
                                        description: 'Visible if validation group is not empty',
                                        conditionSet: [
                                            {
                                                aggregator: 'and',
                                                condition: {
                                                    field: 'validationGroup',
                                                    operator: '!=',
                                                    target: [
                                                        {
                                                            type: 'value',
                                                            value: null
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            value: {
                                default: ''
                            }
                        }
                    ]
                }
            }
        }
    }
}
