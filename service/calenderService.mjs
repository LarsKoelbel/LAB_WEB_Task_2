import AppointmentModel from '../models/calenderModel.mjs';

async function getAppointments(){
    try {
        return await AppointmentModel.find({} );
    } catch (error) {
        throw error;
    }
}

async function getPublicAppointments(){
    try {
        return AppointmentModel.find({ visibility: 'public' }).exec();
    } catch (error) {
        throw error;
    }
}

async function getPublicAndOwnAppointments(username) {
    try {
        return await AppointmentModel.find({
            $or: [
                { visibility: 'public' },
                { owner: username }
            ]
        }).exec();
    } catch (error) {
        throw error;
    }
}


async function createAppointment(new_data){
    // Create a new unique id for the appointment
    let idExists = true;
    let generatedId;

    while (idExists) {
        generatedId = generateId();
        idExists = await AppointmentModel.exists({ id: generatedId });
    }

    new_data["id"] = generatedId;

    // Add missing blocks from creation
    new_data["attending"] = [];

    const new_appo = new AppointmentModel(new_data);
    try {
        return await new_appo.save();
    } catch (error) {
        throw error;
    }
}

function generateId(length = 25) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function signOn(appointmentID, email, first_name, last_name) {
    try {
        // Find the appointment by its ID
        const appointment = await AppointmentModel.findOne({ id: appointmentID }).exec();

        if (!appointment) {
            throw new Error(`Appointment with ID ${appointmentID} not found`);
        }

        // Check if this email is already signed on
        const alreadySignedOn = appointment.attending.some(
            attendee => attendee.email === email
        );

        if (alreadySignedOn) {
            return { message: 'User already signed on', appointment };
        }

        // Add the new attendee
        appointment.attending.push({ email, first_name, last_name });

        // Save the updated appointment
        return await appointment.save();

    } catch (error) {
        console.error(error);
        throw new Error(`Failed to sign on: ${error.message}`);
    }
}

async function changeVis(appointmentID, vis, user) {
    try {
        // Find the appointment by its ID
        const appointment = await AppointmentModel.findOne({ id: appointmentID }).exec();

        if (!appointment) {
            throw new Error(`Appointment with ID ${appointmentID} not found`);
        }

        if (appointment.owner === user) appointment.visibility = vis;
        else throw new Error(`Appointment with ID ${appointmentID} not found`);

        // Save the updated appointment
        return await appointment.save();

    } catch (error) {
        console.error(error);
        throw new Error(`Failed to sign on: ${error.message}`);
    }
}

async function getAttending(appointmentID, username){
    try {
    // Find the appointment by its ID
    const appointment = await AppointmentModel.findOne({ id: appointmentID }).exec();

    if (!appointment || appointment.owner !== username) {
        throw new Error(`Appointment with ID ${appointmentID} not found or user lacks privilege`);
    }

    return appointment.attending;

} catch (error) {
    console.error(error);
    throw new Error(`Failed to sign on: ${error.message}`);
}
}

export {getAppointments, createAppointment, getPublicAppointments, getPublicAndOwnAppointments, signOn, getAttending, changeVis}