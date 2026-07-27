const Customer = require('../models/Customer');
const AuditLog = require('../models/AuditLog');
const csv = require('csv-parser');
const { Readable } = require('stream');
const mongoose = require('mongoose');

// GET /api/customers
exports.getCustomers = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10, doNotCall } = req.query;
        // Always scope to the logged-in user's branch
        const filter = {};
        if (req.user && req.user.branch) {
            filter.branch = req.user.branch;
        }
        if (status && status !== 'all') filter.status = status;
        if (doNotCall !== undefined) filter.doNotCall = doNotCall === 'true';
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobilePhone: { $regex: search, $options: 'i' } },
                { suburb: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [customers, total] = await Promise.all([
            Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Customer.countDocuments(filter)
        ]);
        res.json({ success: true, data: customers, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/customers/:id
exports.getCustomerById = async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        if (req.user && req.user.branch) {
            filter.branch = req.user.branch;
        }
        const customer = await Customer.findOne(filter);
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, data: customer });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/customers
exports.createCustomer = async (req, res) => {
    try {
        // Clean up invalid _id to prevent Mongoose CastError
        if (req.body.vehicle && req.body.vehicle._id && !mongoose.Types.ObjectId.isValid(req.body.vehicle._id)) {
            delete req.body.vehicle._id;
        }

        // Automatically assign the logged-in user's branch — never accept branch from client
        const customerData = {
            ...req.body,
            branch: req.user?.branch || req.body.branch,
        };
        delete customerData.branch; // remove any client-supplied branch
        customerData.branch = req.user?.branch; // always use server-side branch

        const customer = await Customer.create(customerData);
        res.status(201).json({ success: true, data: customer });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// PUT /api/customers/:id
exports.updateCustomer = async (req, res) => {
    try {
        // Clean up invalid _id to prevent Mongoose CastError
        if (req.body.vehicle && req.body.vehicle._id && !mongoose.Types.ObjectId.isValid(req.body.vehicle._id)) {
            delete req.body.vehicle._id;
        }

        // Never allow branch to be changed via update
        delete req.body.branch;

        // Recompute fullName if name fields changed
        if (req.body.firstName || req.body.lastName) {
            const current = await Customer.findById(req.params.id);
            req.body.fullName = `${req.body.firstName || current.firstName} ${req.body.lastName || current.lastName}`;
        }

        const filter = { _id: req.params.id };
        if (req.user && req.user.branch) {
            filter.branch = req.user.branch;
        }
        const customer = await Customer.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, data: customer });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// DELETE /api/customers/:id
exports.deleteCustomer = async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        if (req.user && req.user.branch) {
            filter.branch = req.user.branch;
        }
        const customer = await Customer.findOneAndDelete(filter);
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        await AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.fullName || 'System',
            action: 'deleted',
            resource: 'Customer',
            resourceId: req.params.id,
            resourceName: customer.fullName,
            details: 'Customer record deleted.',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            severity: 'warning'
        });
        res.json({ success: true, message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/customers/import — CSV bulk import
exports.importCustomers = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
        const userBranch = req.user?.branch;
        const results = [];
        const stream = Readable.from(req.file.buffer.toString());
        stream.pipe(csv())
            .on('data', (row) => {
                results.push({
                    firstName: row.firstName || (row.fullName?.split(' ')[0] || 'Unknown'),
                    lastName:  row.lastName  || (row.fullName?.split(' ').slice(1).join(' ') || 'Unknown'),
                    fullName:  row.fullName  || `${row.firstName || ''} ${row.lastName || ''}`.trim(),
                    email:         row.email         || '',
                    phone:         row.phone         || row.mobilePhone || '',
                    mobilePhone:   row.mobilePhone   || row.phone || '',
                    suburb:        row.suburb        || '',
                    state:         row.state         || 'VIC',
                    postcode:      row.postcode      || '',
                    brand:         row.brand         || row.make || 'Toyota',
                    assignedDealership: row.assignedDealership || 'Imported',
                    upgradeScore:  parseInt(row.upgradeScore) || 3,
                    doNotCall:     row.doNotCall === 'true',
                    status:        'active',
                    notes:         row.notes || 'Imported via CSV',
                    tags:          ['imported'],
                    branch:        userBranch, // always assign from logged-in user
                    vehicle: {
                        make:            row.make            || '',
                        model:           row.model           || '',
                        year:            parseInt(row.year)  || 2020,
                        variant:         row.variant         || '',
                        vin:             row.vin             || '',
                        regPlate:        row.regPlate        || '',
                        odometer:        parseInt(row.odometer) || 0,
                        lastServiceDate: row.lastServiceDate || '',
                        nextServiceDue:  row.nextServiceDue  || '',
                        financeEndDate:  row.financeEndDate  || '',
                        warrantyExpiry:  row.warrantyExpiry  || '',
                    },
                });
            })
            .on('end', async () => {
                const inserted = await Customer.insertMany(results, { ordered: false });
                await AuditLog.create({
                    userId: req.user?._id,
                    userName: req.user?.fullName || 'System',
                    action: 'created',
                    resource: 'Customer',
                    resourceId: 'bulk-import',
                    resourceName: `Bulk Import — ${inserted.length} customers`,
                    details: `Imported ${inserted.length} customer records from CSV.`,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                    severity: 'info'
                });
                res.json({ success: true, message: `${inserted.length} customers imported`, data: inserted });
            });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/customers/export — CSV export
exports.exportCustomers = async (req, res) => {
    try {
        const filter = {};
        if (req.user && req.user.branch) {
            filter.branch = req.user.branch;
        }
        const customers = await Customer.find(filter);
        const header = 'id,fullName,email,mobilePhone,suburb,make,model,year,nextServiceDue,status,upgradeScore,doNotCall,branch\n';
        const rows = customers.map(c =>
            `"${c._id}","${c.fullName}","${c.email}","${c.mobilePhone}","${c.suburb}","${c.vehicle?.make || ''}","${c.vehicle?.model || ''}","${c.vehicle?.year || ''}","${c.vehicle?.nextServiceDue || ''}","${c.status}","${c.upgradeScore}","${c.doNotCall}","${c.branch || ''}"`
        ).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="customers.csv"');
        res.send(header + rows);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};