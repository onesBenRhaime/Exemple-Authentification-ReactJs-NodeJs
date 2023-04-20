// model data form shema
const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
	nom: {
		type: String,
		require: true,
	},
	prenom: {
		type: String,
		require: true,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	role: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		require: true,
	},
	adresse: {
		type: "string",
	},
	tel: {
		type: "string",
		default: "",
	},
	profile: {
		type: "string",
		default: "",
	},
});

module.exports = mongoose.model("users", userModel);
