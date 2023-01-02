export default {
    schema: {
        title: 'DepartmentValidationSchema',
        type: 'object',
        properties: {
            data: {
                title: 'Data',
                description: 'Data of the departments.',
                type: 'array',
                items: {
                    $ref: '#/definitions/_Department'
                }
            }
        },
        required: ['data'],
        definitions: {
            _Department: {
                title: '_Department',
                type: 'object',
                properties: {
                    name: {
                        title: 'Name',
                        description: 'Name of the deplartment.',
                        type: 'string'
                    },
                    slug: {
                        title: 'Slug',
                        description:
                            'Slug of the department. Required to perform update operation.',
                        type: 'string',
                        enum: [
                            '14nov-deparment',
                            'anil',
                            'automobile',
                            'baby-care',
                            'beauty-personal-care',
                            'books',
                            'car-motorbike',
                            'dec22department',
                            'demoril',
                            'dep-53',
                            'departjjkkk',
                            'department-52',
                            'departmentnov24',
                            'dept1',
                            'dept10',
                            'dept12',
                            'dept2',
                            'dept3',
                            'dept4',
                            'dept5',
                            'dept6dec',
                            'donvsv',
                            'electricals',
                            'electronics',
                            'elex',
                            'fashion',
                            'food-beverage',
                            'footwear',
                            'ggbhghghgh',
                            'gift-cards-vouchers',
                            'home-kitchen-appliances',
                            'home-living',
                            'industrial-supplies',
                            'jack',
                            'jkl',
                            'kt-department',
                            'medicine',
                            'mens-fashion',
                            'metaverse',
                            'new-department',
                            'office-stationery',
                            'others',
                            'resq',
                            'sdhvb',
                            'swadesh-department',
                            'swadesh-department-vaibhav',
                            'test-18th-oct-updated',
                            'test-2',
                            'test-aj',
                            'test-bulk-department',
                            'test-department',
                            'test-department-1',
                            'test-departments',
                            'test0001',
                            'test20dec',
                            'test21dec',
                            'test22dec',
                            'test23dec',
                            'test24dec',
                            'test25dec',
                            'test26dec',
                            'test27dec',
                            'test28dec',
                            'test29dec',
                            'test30dec',
                            'test31dec',
                            'testdepartment',
                            'testdepartment17773',
                            'testdepartment17ss3',
                            'testdepartment17sss3',
                            'testdepartmentkafka',
                            'testing-department',
                            'testingdepartment',
                            'testingtestdepartment',
                            'toys',
                            'vaibhav-created',
                            'vaibhav-created2',
                            'vs-dept-1',
                            'women',
                            'ys-games',
                            'ys-toy',
                            'ys-toy-and-games'
                        ]
                    },
                    uid: {
                        title: 'UID',
                        description:
                            'Uique identifier for department. Required to perform update operation.',
                        type: 'integer'
                    },
                    logo: {
                        title: 'Logo',
                        description: 'URL of logo for department.',
                        minLength: 1,
                        maxLength: 2083,
                        format: 'uri',
                        type: 'string'
                    },
                    is_active: {
                        title: 'Active',
                        description:
                            'Boolean(True, False) value to track weather the department is active or not',
                        enum: [true, false],
                        type: 'boolean'
                    },
                    priority_order: {
                        title: 'Priority',
                        description:
                            'Priority(Ex.: 1, 2, 3) of the department in listing.',
                        type: 'string'
                    },
                    synonyms: {
                        title: 'Synonyms',
                        description:
                            'Synonyms of the departments. Multiple Synonyms can be added pipe seprated.(Ex.: Synonym1|Synonym2|Synonym3)',
                        type: 'string'
                    }
                },
                required: ['name', 'logo', 'is_active', 'priority_order']
            }
        }
    },
    userData: {
        user: {
            debug: {
                source: 'grimlock',
                platform: '000000000000000000000001'
            },
            _id: 'b527aad94fad6eaca32aea5a',
            username: 'aniljainapur_fynd_external_com_18038',
            emails: [
                {
                    email: 'aniljainapur@fynd-external.com',
                    active: true,
                    primary: true,
                    verified: true
                }
            ],
            gender: null,
            roles: [],
            active: true,
            uid: '415',
            consent: true,
            first_name: 'Anil',
            last_name: 'MJ',
            phone_numbers: [
                {
                    phone: '9632709583',
                    active: true,
                    primary: true,
                    verified: true,
                    country_code: 91
                }
            ],
            account_type: 'user',
            created_at: '2022-05-13T10:05:54.333Z',
            updated_at: '2022-05-13T10:05:54.333Z'
        }
    },
    importHistory: [
        {
            stage: 'completed',
            stats: {
                total: 1,
                failed: 0,
                succeed: 1,
                cancelled: 0
            },
            created_on: '2022-12-14 10:42:48.032000',
            notification_emails: ['aniljainapur@fynd-external.com'],
            modified_on: '2022-12-14T10:42:51.759138',
            file_type: 'excel',
            failed_records: [],
            created_by: {
                user_id: 'b527aad94fad6eaca32aea5a',
                username: 'aniljainapur_fynd_external_com_18038'
            },
            tracking_url:
                'https://cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyndnp/wrkr/x0/test/general/free/original/FTlBMTMSI-attribute_import_13.xlsx',
            is_active: true,
            cancelled_records: [],
            job_type: 'attribute',
            modified_by: {
                user_id: 'b527aad94fad6eaca32aea5a',
                username: 'aniljainapur_fynd_external_com_18038'
            },
            completed_on: '2022-12-14T10:42:51.759138',
            id: '6399a8a8978825d37bd7b212'
        },
        {
            notification_emails: ['aniljainapur@fynd-external.com'],
            created_on: '2022-12-14 10:39:44.296000',
            cancelled_records: [],
            stage: 'failed',
            failed_records: [
                {
                    message: "{'slug': 'slug(name) must be unique'}",
                    name: 'attribute_101',
                    uid: null,
                    slug: 'attribute-101'
                }
            ],
            created_by: {
                user_id: 'b527aad94fad6eaca32aea5a',
                username: 'aniljainapur_fynd_external_com_18038'
            },
            stats: {
                failed: 1,
                total: 1,
                cancelled: 0,
                succeed: 0
            },
            is_active: true,
            job_type: 'attribute',
            tracking_url:
                'https://cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyndnp/wrkr/x0/test/general/free/original/tze1cvFFr-attrbute_last.xlsx',
            modified_by: {
                user_id: 'b527aad94fad6eaca32aea5a',
                username: 'aniljainapur_fynd_external_com_18038'
            },
            file_type: 'excel',
            modified_on: '2022-12-14T10:39:48.467674',
            completed_on: '2022-12-14T10:39:48.467674',
            id: '6399a7f002602b03b21c38b6'
        }
    ],
    exportHistory: [
        {
            stage: 'completed',
            filters: {
                departments: ['fashion']
            },
            created_on: '2022-12-14 17:37:51.929000',
            notification_emails: ['mithalikamble@gofynd.com'],
            modified_on: '2022-12-14T17:37:55.490312',
            file_type: 'excel',
            created_by: {
                user_id: '5f2ba5a8ffb60e372568eaaf',
                username: '919768080981_76188'
            },
            is_active: true,
            job_type: 'attribute',
            modified_by: {
                user_id: '5f2ba5a8ffb60e372568eaaf',
                username: '919768080981_76188'
            },
            completed_on: '2022-12-14T17:37:55.490312',
            tracking_url:
                'https://regrowth.s3.amazonaws.com/slingshot-catalogues/bulk-admin/attribute/639a09ef978825d37bd7b217/639a09ef978825d37bd7b217.zip',
            id: '639a09ef978825d37bd7b217'
        },
        {
            stage: 'completed',
            filters: {
                departments: ['fashion']
            },
            created_on: '2022-12-14 17:31:09.922000',
            notification_emails: ['mithalikamble@gofynd.com'],
            modified_on: '2022-12-14T17:31:13.492257',
            file_type: 'excel',
            created_by: {
                user_id: '5f2ba5a8ffb60e372568eaaf',
                username: '919768080981_76188'
            },
            is_active: true,
            job_type: 'attribute',
            modified_by: {
                user_id: '5f2ba5a8ffb60e372568eaaf',
                username: '919768080981_76188'
            },
            completed_on: '2022-12-14T17:31:13.492257',
            tracking_url:
                'https://regrowth.s3.amazonaws.com/slingshot-catalogues/bulk-admin/attribute/639a085d978825d37bd7b216/639a085d978825d37bd7b216.zip',
            id: '639a085d978825d37bd7b216'
        }
    ]
};
