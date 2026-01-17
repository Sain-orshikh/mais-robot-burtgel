import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema({
    organisationId: {
        type: String,
        unique: true,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['company', 'school', 'individual'],
    },
    typeDetail: {
        type: String,
        required: true,
    },
    aimag: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    ner: {
        type: String,
        required: true,
    },
    ovog: {
        type: String,
        required: true,
    },
    registriinDugaar: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    resetPasswordOTP: {
        type: String,
    },
    resetPasswordOTPExpire: {
        type: Date,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    contestantIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contestant',
    }],
    coachIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach',
    }],
}, { timestamps: true });

const Organisation = mongoose.model("Organisation", organisationSchema);

export default Organisation;
