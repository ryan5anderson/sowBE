const mongoose = require('mongoose');

const sowSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Lift and shift', 'Arc as a Service'],
        required: true
    },
    vms: {
        type: Number,
        required: function() {
            return this.type === 'Lift and shift';
        }
    },
    landing_zones: {
        type: Number,
        required: function() {
            return this.type === 'Lift and shift';
        }
    },
    engineer_hourly: {
        type: Number,
        required: function() {
            return this.type === 'Lift and shift';
        }
    },
    architect_hourly: {
        type: Number,
        required: function() {
            return this.type === 'Lift and shift';
        }
    },
    pm_hourly: {
        type: Number,
        required: function() {
            return this.type === 'Lift and shift';
        }
    },
    hours: {
        type: Number,
        required: function() {
            return this.type === 'Arc as a Service';
        }
    },
    months: {
        type: Number,
        required: function() {
            return this.type === 'Arc as a Service';
        }
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('SoW', sowSchema);
