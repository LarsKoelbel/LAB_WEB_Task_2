import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 500,
        match: new RegExp("^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$")
    },
    description: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100000,
        match: new RegExp("^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$")
    },
    date: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 10,
        match: new RegExp("^\\d{4}-\\d{2}-\\d{2}$")
    },
    time: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 500,
        match: new RegExp("^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$")
    },
    location: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 500,
        match: new RegExp("^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$")
    },
    deadline: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 500,
        match: new RegExp("^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$")
    },
    visibility: {
        type: String,
        required: true,
        match: RegExp("^(private|unlisted|public)$")
    },
    owner: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 500,
        match: new RegExp("^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$")
    },
    id: {
        type: String,
        required: true,
        match: new RegExp("^[A-Za-z]{25}$")
    },
    max_attending: {
        type: Number,
        required: true
    },
    attending: [
        {
            email: {
                type: String,
                required: true,
                minLength: 1,
                maxLength: 500,
                match: new RegExp("^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$")
            },
            first_name: {
                type: String,
                required: true,
                minLength: 1,
                maxLength: 500,
                match: new RegExp("^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$")
            },
            last_name: {
                type: String,
                required: true,
                minLength: 1,
                maxLength: 500,
                match: new RegExp("^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$")
            }
        }
    ]
});

// Erstelle und exportiere das Modell
export default mongoose.model('Appointment', appointmentSchema);