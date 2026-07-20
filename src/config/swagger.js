const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Patterson Cheney CRM API',
            version: '1.0.0',
            description:
                'REST API for the Patterson Cheney Automotive Group AI-powered Outbound Customer Engagement Platform. Built by OmniSuiteAI.',
            contact: {
                name: 'OmniSuiteAI',
                // email: 'info@omnisuiteai.com',
                url: 'https://www.omnisuiteai.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:4030',
                description: 'Local Development',
            },
            {
                url: 'https://api.pattersoncheney-crm.com',
                description: 'Production',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token. Get it from POST /api/auth/login',
                },
            },
            schemas: {
                // ── Auth ──────────────────────────────────────────────
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'alex.harrison@pattersoncheney.com.au' },
                        password: { type: 'string', example: 'Patterson2026!' },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        data: { $ref: '#/components/schemas/User' },
                    },
                },

                // ── Campaign ──────────────────────────────────────────
                Campaign: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
                        name: { type: 'string', example: 'Toyota HiLux Service Reminder Q2 2026' },
                        type: {
                            type: 'string',
                            enum: ['service_reminder', 'upgrade_offer', 'reengagement', 'finance_renewal', 'parts_upsell'],
                            example: 'service_reminder',
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'paused', 'completed', 'scheduled', 'draft', 'failed'],
                            example: 'active',
                        },
                        brand: { type: 'string', example: 'Toyota' },
                        location: { type: 'string', example: 'Keysborough' },
                        totalContacts: { type: 'integer', example: 1240 },
                        contactsAttempted: { type: 'integer', example: 876 },
                        contactsReached: { type: 'integer', example: 612 },
                        bookings: { type: 'integer', example: 134 },
                        conversions: { type: 'integer', example: 98 },
                        conversionRate: { type: 'number', example: 15.9 },
                        answerRate: { type: 'number', example: 69.9 },
                        startDate: { type: 'string', example: '2026-06-01' },
                        endDate: { type: 'string', example: '2026-06-30' },
                        scheduledTime: { type: 'string', example: '10:00 AM - 6:00 PM' },
                        maxAttempts: { type: 'integer', example: 3 },
                        attemptsCompleted: { type: 'integer', example: 876 },
                        revenueImpact: { type: 'number', example: 294000 },
                        aiAgentName: { type: 'string', example: 'Aria' },
                        script: { type: 'string', example: 'Hi, this is Aria calling from Patterson Cheney Toyota...' },
                        tags: { type: 'array', items: { type: 'string' }, example: ['high-value', 'service', 'Q2'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CampaignCreate: {
                    type: 'object',
                    required: ['name', 'type', 'brand', 'location'],
                    properties: {
                        name: { type: 'string', example: 'Toyota HiLux Service Reminder Q2 2026' },
                        type: { type: 'string', enum: ['service_reminder', 'upgrade_offer', 'reengagement', 'finance_renewal', 'parts_upsell'] },
                        status: { type: 'string', enum: ['active', 'paused', 'completed', 'scheduled', 'draft', 'failed'], default: 'draft' },
                        brand: { type: 'string', example: 'Toyota' },
                        location: { type: 'string', example: 'Keysborough' },
                        totalContacts: { type: 'integer', example: 0 },
                        startDate: { type: 'string', example: '2026-07-01' },
                        endDate: { type: 'string', example: '2026-07-31' },
                        scheduledTime: { type: 'string', example: '09:00 AM - 05:00 PM' },
                        maxAttempts: { type: 'integer', example: 3 },
                        aiAgentName: { type: 'string', example: 'Aria' },
                        script: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } },
                    },
                },
                CampaignStatusUpdate: {
                    type: 'object',
                    required: ['status'],
                    properties: {
                        status: { type: 'string', enum: ['active', 'paused', 'completed', 'scheduled', 'draft', 'failed'] },
                    },
                },

                // ── Vehicle ───────────────────────────────────────────
                Vehicle: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        make: { type: 'string', example: 'Toyota' },
                        model: { type: 'string', example: 'HiLux' },
                        year: { type: 'integer', example: 2021 },
                        variant: { type: 'string', example: 'SR5 4x4 Double Cab' },
                        color: { type: 'string', example: 'Graphite' },
                        vin: { type: 'string', example: 'MR0FR8CD9M0123456' },
                        regPlate: { type: 'string', example: 'ABC-123' },
                        odometer: { type: 'integer', example: 68200 },
                        purchaseDate: { type: 'string', example: '2021-04-15' },
                        lastServiceDate: { type: 'string', example: '2025-10-20' },
                        nextServiceDue: { type: 'string', example: '2026-04-20' },
                        financeEndDate: { type: 'string', example: '2026-10-15' },
                        warrantyExpiry: { type: 'string', example: '2027-04-15' },
                    },
                },

                // ── Customer ──────────────────────────────────────────
                Customer: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0e' },
                        firstName: { type: 'string', example: 'James' },
                        lastName: { type: 'string', example: 'Nguyen' },
                        fullName: { type: 'string', example: 'James Nguyen' },
                        email: { type: 'string', format: 'email', example: 'james.nguyen@gmail.com' },
                        phone: { type: 'string', example: '(03) 9789 2341' },
                        mobilePhone: { type: 'string', example: '0412 345 678' },
                        address: { type: 'string', example: '14 Acacia Court' },
                        suburb: { type: 'string', example: 'Keysborough' },
                        state: { type: 'string', example: 'VIC' },
                        postcode: { type: 'string', example: '3173' },
                        status: { type: 'string', enum: ['active', 'inactive', 'prospect', 'churned'], example: 'active' },
                        upgradeScore: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                        vehicle: { $ref: '#/components/schemas/Vehicle' },
                        previousVehicles: { type: 'array', items: { $ref: '#/components/schemas/Vehicle' } },
                        assignedDealership: { type: 'string', example: 'Patterson Cheney Toyota Keysborough' },
                        brand: { type: 'string', example: 'Toyota' },
                        totalSpend: { type: 'number', example: 72400 },
                        lifetimeValue: { type: 'number', example: 98000 },
                        campaignHistory: { type: 'array', items: { type: 'string' } },
                        lastContactDate: { type: 'string', example: '2026-06-22' },
                        preferredContactTime: { type: 'string', example: 'Morning' },
                        notes: { type: 'string' },
                        doNotCall: { type: 'boolean', example: false },
                        tags: { type: 'array', items: { type: 'string' }, example: ['high-value', 'upgrade-ready'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CustomerCreate: {
                    type: 'object',
                    required: ['firstName', 'lastName'],
                    properties: {
                        firstName: { type: 'string', example: 'James' },
                        lastName: { type: 'string', example: 'Nguyen' },
                        email: { type: 'string', format: 'email' },
                        phone: { type: 'string' },
                        mobilePhone: { type: 'string' },
                        address: { type: 'string' },
                        suburb: { type: 'string' },
                        state: { type: 'string', default: 'VIC' },
                        postcode: { type: 'string' },
                        status: { type: 'string', enum: ['active', 'inactive', 'prospect', 'churned'], default: 'active' },
                        upgradeScore: { type: 'integer', minimum: 1, maximum: 5, default: 3 },
                        brand: { type: 'string' },
                        assignedDealership: { type: 'string' },
                        doNotCall: { type: 'boolean', default: false },
                        notes: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } },
                        vehicle: { $ref: '#/components/schemas/Vehicle' },
                    },
                },

                // ── Call ──────────────────────────────────────────────
                TranscriptSegment: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        speaker: { type: 'string', enum: ['agent', 'customer'] },
                        speakerName: { type: 'string', example: 'Aria (AI Agent)' },
                        text: { type: 'string', example: 'Good morning, may I speak with James Nguyen?' },
                        timestamp: { type: 'number', example: 0 },
                        sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
                        confidence: { type: 'number', example: 0.98 },
                    },
                },
                Call: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0f' },
                        customerId: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0e' },
                        customerName: { type: 'string', example: 'James Nguyen' },
                        customerPhone: { type: 'string', example: '0412 345 678' },
                        campaignId: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
                        campaignName: { type: 'string', example: 'Toyota HiLux Service Reminder Q2 2026' },
                        direction: { type: 'string', enum: ['outbound', 'inbound'], example: 'outbound' },
                        outcome: {
                            type: 'string',
                            enum: ['booked', 'not_interested', 'callback_requested', 'no_answer', 'voicemail', 'wrong_number', 'busy', 'converted'],
                            example: 'booked',
                        },
                        sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'], example: 'positive' },
                        duration: { type: 'integer', description: 'Duration in seconds', example: 68 },
                        startTime: { type: 'string', format: 'date-time' },
                        endTime: { type: 'string', format: 'date-time' },
                        recording: {
                            type: 'object',
                            properties: {
                                url: { type: 'string', example: '/recordings/call-001.mp3' },
                                duration: { type: 'integer', example: 68 },
                                fileSize: { type: 'integer', example: 1024000 },
                            },
                        },
                        transcript: { type: 'array', items: { $ref: '#/components/schemas/TranscriptSegment' } },
                        aiSummary: { type: 'string', example: 'Customer confirmed service booking for Thursday 4th April at 10am.' },
                        keyExtractions: {
                            type: 'object',
                            properties: {
                                bookingDate: { type: 'string', example: '2026-04-04' },
                                bookingTime: { type: 'string', example: '10:00 AM' },
                                vehicleInterest: { type: 'string', example: '2021 Toyota HiLux SR5' },
                                objections: { type: 'array', items: { type: 'string' } },
                                nextSteps: { type: 'array', items: { type: 'string' } },
                                dealValue: { type: 'number', example: 1800 },
                            },
                        },
                        confidenceScore: { type: 'number', example: 0.97 },
                        agentName: { type: 'string', example: 'Aria' },
                        dealershipLocation: { type: 'string', example: 'Keysborough' },
                        brand: { type: 'string', example: 'Toyota' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                CallStats: {
                    type: 'object',
                    properties: {
                        total: { type: 'integer', example: 1704 },
                        booked: { type: 'integer', example: 292 },
                        noAnswer: { type: 'integer', example: 480 },
                        voicemail: { type: 'integer', example: 210 },
                        avgDuration: { type: 'integer', description: 'Average call duration in seconds', example: 68 },
                    },
                },

                // ── User ──────────────────────────────────────────────
                Permission: {
                    type: 'object',
                    properties: {
                        resource: {
                            type: 'string',
                            enum: ['campaigns', 'customers', 'calls', 'analytics', 'users', 'roles', 'audit_logs', 'settings', 'integrations', 'simulation'],
                        },
                        actions: {
                            type: 'array',
                            items: { type: 'string', enum: ['view', 'create', 'edit', 'delete', 'export'] },
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c10' },
                        firstName: { type: 'string', example: 'Alex' },
                        lastName: { type: 'string', example: 'Harrison' },
                        fullName: { type: 'string', example: 'Alex Harrison' },
                        email: { type: 'string', format: 'email', example: 'alex.harrison@pattersoncheney.com.au' },
                        role: { type: 'string', enum: ['super_admin', 'admin', 'manager', 'agent', 'viewer', 'finance'], example: 'super_admin' },
                        status: { type: 'string', enum: ['active', 'inactive', 'pending', 'suspended'], example: 'active' },
                        avatar: { type: 'string' },
                        dealership: { type: 'string', example: 'Group HQ' },
                        brand: { type: 'string', example: 'All Brands' },
                        lastLogin: { type: 'string', format: 'date-time' },
                        permissions: { type: 'array', items: { $ref: '#/components/schemas/Permission' } },
                        activityCount: { type: 'integer', example: 1842 },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                UserCreate: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'password', 'role'],
                    properties: {
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 8 },
                        role: { type: 'string', enum: ['super_admin', 'admin', 'manager', 'agent', 'viewer', 'finance'] },
                        dealership: { type: 'string' },
                        brand: { type: 'string' },
                        status: { type: 'string', enum: ['active', 'inactive', 'pending', 'suspended'], default: 'active' },
                    },
                },

                // ── Notification ──────────────────────────────────────
                Notification: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        type: {
                            type: 'string',
                            enum: ['booking', 'upgrade_alert', 'campaign_complete', 'error', 'info', 'warning', 'failure'],
                        },
                        title: { type: 'string', example: 'New Booking — James Nguyen' },
                        message: { type: 'string', example: 'Service booking confirmed for 4 Apr 2026 at 10:00am.' },
                        read: { type: 'boolean', example: false },
                        actionUrl: { type: 'string', example: '/calls/665f1a2b3c4d5e6f7a8b9c0f' },
                        relatedId: { type: 'string' },
                        metadata: { type: 'object' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                // ── Audit Log ─────────────────────────────────────────
                AuditLog: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        userName: { type: 'string', example: 'Alex Harrison' },
                        action: {
                            type: 'string',
                            enum: ['created', 'updated', 'deleted', 'viewed', 'exported', 'login', 'logout', 'permission_changed', 'campaign_started', 'campaign_paused'],
                        },
                        resource: { type: 'string', example: 'Campaign' },
                        resourceId: { type: 'string' },
                        resourceName: { type: 'string', example: 'Toyota HiLux Service Reminder Q2 2026' },
                        details: { type: 'string', example: 'Campaign started with 1,240 contacts.' },
                        ipAddress: { type: 'string', example: '203.24.188.14' },
                        userAgent: { type: 'string', example: 'Chrome 126 / macOS' },
                        severity: { type: 'string', enum: ['info', 'warning', 'critical'], example: 'info' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                // ── Integration ───────────────────────────────────────
                Integration: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string', example: 'Google Sheets' },
                        description: { type: 'string' },
                        logo: { type: 'string', example: 'sheets' },
                        status: { type: 'string', enum: ['connected', 'disconnected', 'error', 'pending'] },
                        lastSync: { type: 'string', format: 'date-time' },
                        config: { type: 'object' },
                    },
                },

                // ── Analytics ─────────────────────────────────────────
                DashboardStats: {
                    type: 'object',
                    properties: {
                        totalCampaigns: { type: 'integer', example: 6 },
                        activeCampaigns: { type: 'integer', example: 2 },
                        totalCustomers: { type: 'integer', example: 3160 },
                        totalCalls: { type: 'integer', example: 1704 },
                        bookedCalls: { type: 'integer', example: 292 },
                        totalRevenue: { type: 'number', example: 2163000 },
                        answerRate: { type: 'string', example: '67.4' },
                        conversionRate: { type: 'string', example: '17.1' },
                    },
                },
                FunnelStage: {
                    type: 'object',
                    properties: {
                        stage: { type: 'string', example: 'Total Contacts' },
                        count: { type: 'integer', example: 3160 },
                        percentage: { type: 'number', example: 100 },
                    },
                },

                // ── Simulation ────────────────────────────────────────
                SimulationRequest: {
                    type: 'object',
                    required: ['scenario'],
                    properties: {
                        scenario: {
                            type: 'string',
                            enum: ['service_due', 'upgrade_opportunity', 'finance_renewal', 'objection_handling', 'callback_follow_up'],
                            example: 'service_due',
                        },
                        customerData: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'James Nguyen' },
                                vehicle: { type: 'string', example: '2021 Toyota HiLux SR5' },
                                suburb: { type: 'string', example: 'Keysborough' },
                                lastService: { type: 'string', example: '2025-10-20' },
                                upgradeScore: { type: 'integer', example: 5 },
                            },
                        },
                        script: { type: 'string', example: 'Hi, this is Aria calling from Patterson Cheney Toyota...' },
                    },
                },

                // ── Shared ────────────────────────────────────────────
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Operation completed successfully' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Error description' },
                    },
                },
                PaginatedMeta: {
                    type: 'object',
                    properties: {
                        total: { type: 'integer', example: 120 },
                        page: { type: 'integer', example: 1 },
                        totalPages: { type: 'integer', example: 12 },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js'],  // JSDoc annotations will live in route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;