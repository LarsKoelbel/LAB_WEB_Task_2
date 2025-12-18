

// All AJV shemas generated from mongoose shema by chatGPT


const appointmentAjvSchema = {
    type: "object",
    additionalProperties: false,
    required: [
        "title",
        "description",
        "date",
        "time",
        "location",
        "deadline",
        "visibility",
        "max_attending"
    ],
    properties: {
        title: {
            type: "string",
            minLength: 1,
            maxLength: 500,
            pattern: "^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$"
        },
        description: {
            type: "string",
            minLength: 1,
            maxLength: 10000,
            pattern: "^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$"
        },
        date: {
            type: "string",
            pattern: "^\\d{4}-\\d{2}-\\d{2}$"
        },
        time: {
            type: "string",
            minLength: 1,
            maxLength: 500,
            pattern: "^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$"
        },
        location: {
            type: "string",
            minLength: 1,
            maxLength: 500,
            pattern: "^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$"
        },
        deadline: {
            type: "string",
            minLength: 1,
            maxLength: 500,
            pattern: "^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$"
        },
        visibility: {
            type: "string",
            enum: ["private", "unlisted", "public"]
        },
        max_attending: {
            type: "number"
        }
    }
};

const signOnAjvSchema = {
    type: "object",
    additionalProperties: false,
    required: ["appointmentID", "email", "first_name", "last_name"],
    properties: {
        appointmentID: {
            type: "string",
            minLength: 25,
            maxLength: 25,
            pattern: "^[A-Za-z]{25}$",
            description: "The unique ID of the appointment to sign on to"
        },
        email: {
            type: "string",
            minLength: 1,
            maxLength: 500,
            pattern: "^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$",
            description: "Email of the attendee"
        },
        first_name: {
            type: "string",
            minLength: 1,
            maxLength: 500,
            pattern: "^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$",
            description: "First name of the attendee"
        },
        last_name: {
            type: "string",
            minLength: 1,
            maxLength: 500,
            pattern: "^[a-zA-Z0-9äöüÄÖÜß .,!?;:'\"()\\-–—…/&%$€@]+$",
            description: "Last name of the attendee"
        }
    }
};

const getAttendeesAjvSchema = {
    type: "object",
    additionalProperties: false,
    required: ["appointmentID"],
    properties: {
        appointmentID: {
            type: "string",
            minLength: 25,
            maxLength: 25,
            pattern: "^[A-Za-z]{25}$",
            description: "The unique ID of the appointment"
        }
    }
};

const getAppointmentAjvSchema = {
    type: "object",
    additionalProperties: false,
    required: ["appointmentID"],
    properties: {
        appointmentID: {
            type: "string",
            minLength: 25,
            maxLength: 25,
            pattern: "^[A-Za-z]{25}$",
            description: "The unique ID of the appointment to fetch"
        }
    }
};

const changeVisibilityAjvSchema = {
    type: "object",
    additionalProperties: false,
    required: ["appointmentID", "visibility"],
    properties: {
        appointmentID: {
            type: "string",
            minLength: 25,
            maxLength: 25,
            pattern: "^[A-Za-z]{25}$",
            description: "The unique ID of the appointment"
        },
        visibility: {
            type: "string",
            enum: ["private", "unlisted", "public"],
            description: "New visibility level for the appointment"
        }
    }
};

export {appointmentAjvSchema, signOnAjvSchema, getAttendeesAjvSchema, getAppointmentAjvSchema, changeVisibilityAjvSchema};