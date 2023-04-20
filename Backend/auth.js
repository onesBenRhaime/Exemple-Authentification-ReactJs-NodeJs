const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const candidatModel = require("../models/candidat");
const sessionModel = require("../models/session");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const GMAIL_USER = "youremail@gmail.com";
const GMAIL_PSW = "Your password";

function formatDate(date) {
	var d = new Date(date),
		month = "" + (d.getMonth() + 1),
		day = "" + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [year, month, day].join("-");
}
//Register User
router.post("/register", async (req, res) => {
	//crypt password
	//const psw = Math.random().toString(36).slice(-8);
	try {
		let user = await userModel.findOne({ email: req.body.email });
		if (user) {
			return res
				.status(404)
				.json({ message: "Cet utilisateur est dége existe!" });
		}
		const hash = await bcrypt.hash(req.body.password, 10);

		//user model
		const newUser = new userModel({
			nom: req.body.nom,
			prenom: req.body.prenom,
			email: req.body.email,
			password: hash,
			role: "collaborateur",
			profile: req.body.profile,
			tel: req.body.tel,
			adresse: req.adresse,
		});
		const saveUser = await newUser.save();
		console.log(saveUser);
		// Url
		var url = `http://localhost:3000/api/user/verification?email=${newUser.email}`;
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: GMAIL_USER,
				pass: GMAIL_PSW,
			},
		});
		let info = await transporter.sendMail({
			from: GMAIL_USER,
			to: req.body.email,
			subject: "<Orange Test >Verification de compte",
			attachments: [
				{
					filename: "logoP.png",
					path: __dirname + "/logoP.png",
					cid: "logo@",
				},
			],
			html: `
				<p>
				<b>Bonjour </b> <br/>
			     vérifier votre  adresse mail en cliquant ici :${url}
			   </p>
				`,
		});

		return res.status(200).json({
			message: "Votre compte a été créé, vérifiez votre adresse e-mail ",
		});
	} catch (err) {
		console.log(err);
		return res.status(404).json({ message: err.message });
	}
});

// verification de compte user
router.get("/verification", async (req, res) => {
	/*const email = req.body.email;

	userModel
		.findOne(email)
		.then((user) => {
			user.verified = "true";
			user
				.save()
				.then(() => {
					res.status(200).json({ msg: " user verified" });
				})
				.catch((err) => {
					res.status(404).json({ msg: err });
				});
		})
		.catch((err) => {
			res.status(500).json({ msg: err });
		});*/
	const user = await userModel.findOne({ email: req.body.email });
	if (user) {
		user.verified = "true";
		await user.save();
		res.status(200).json({ msg: " user verified" });
	} else {
		res.status(200).json({ msg: " user not found " });
	}
});

//Login User
/*si  user exist ===>  generate Token else  return not found*/
router.post("/login", async (req, res) => {
	try {
		const user = await userModel.findOne({ email: req.body.email });
		if (!user) {
			return res
				.status(200)
				.json({ message: " Cet utilisateur n'existe pas !" });
		}
		//compare passwords (body / db)
		const isMatch = await bcrypt.compare(req.body.password, user.password);
		console.log("isMatch:  ", isMatch);
		if (isMatch === false) {
			return res.status(200).json({ message: "Mot de passe incorrect " });
		}
		if (user.verified) {
			console.log(user.verified);
			//token
			var token = jwt.sign(
				{
					//_payload
					id: user._id,
					role: user.role,
					nom: user.nom,
					prenom: user.prenom,
					email: user.email,
				},
				"hGKhsdkKl",
				{ expiresIn: "3h" } //date d'expération de token
			);

			return res.status(200).json(token);
			//==>correct psw && verified :  authorization  JSON WEB Token  Cet utilisateur n'est pas vérifié, veuillez vérifier votre adresse e-mail.
		} else {
			return res.status(200).json({
				message:
					"Cet utilisateur n'est pas vérifié, veuillez vérifier votre adresse e-mail.",
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			message: err.message,
		});
	}
});
///Login candidat
router.post("/candidat/login", async (req, res) => {
	try {
		const dateToday = formatDate(new Date());
		console.log(dateToday);
		const candidat = await candidatModel.findOne({ email: req.body.email });
		console.log(candidat.idSession);
		console.log(candidat);
		if (candidat.idSession !== "0") {
			const session = await sessionModel.findById({ _id: candidat.idSession });
			console.log(session);
			console.log(session.dateF > dateToday, dateToday, session.dateF);
			//	console.log(dateToday);
			if (session.dateF < dateToday) {
				console.log(1);
				return res.status(200).json({
					message:
						" Le session de recrutement est fermer , votre compte est invalable , merci pour votre particicpation",
				});
			}
		}
		const isMatch = await bcrypt.compare(req.body.password, candidat.password);
		console.log(isMatch);
		if (isMatch === false) {
			return res.status(200).json({
				message: " Please enter the password receiver in the mail",
			});
		}
		//token
		var token = jwt.sign(
			{
				//_payload
				id: candidat._id,
				email: candidat.email,
				nom: candidat.nom,
				prenom: candidat.prenom,
				profile: candidat.profile,
				role: "candidat",
				idSession: candidat.idSession,
			},
			"hGKhsdkKl"
		);
		return res.status(200).json(token);
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});
//Edit by ID profile
//1
router.post("/editUser/:id", async (req, res) => {
	// find the user profile
	const user_id = req.params.id.toString();
	userModel
		.findByIdAndUpdate(user_id, req.body)
		.then((user) => {
			return res.send({
				msg: "user profile edit with success",
				adresse: user.adresse,
			});
		})
		.catch((err) => {
			return res.send({ err });
		});
});
//2

//3
router.post("/editProfile", async (req, res) => {
	try {
		const { email, tel, adresse } = req.body;
		console.log(email, tel, adresse);
		await userModel
			.updateOne({ email: email }, { tel, adresse })
			.then(() => {
				return res.send({
					message: "votre profile a été modifié avec succès",
				});
			})
			.catch((error) => {
				console.log(error);
				return res.send({ message: error.message });
			});
	} catch (error) {
		return res.send(error.message);
	}
});
//change password
router.post("/editPassword", async (req, res) => {
	try {
		// send and hashed the new psw
		const newPsw = req.body.newP;
		const oldP = req.body.oldP;
		const user = await userModel.findOne({ email: req.body.email });
		const salt = await bcrypt.genSalt(10);
		const hashedpassword = await bcrypt.hash(newPsw, salt);
		//  get  the old PSW && Compared to the new
		console.log(oldP, user.password);
		const similar = await bcrypt.compare(oldP, user.password);
		if (!similar) {
			return res.status(400).json({
				message:
					"Le mot de passe que vous avez entré ne correspond pas à celui actuel",
			});
		} else {
			password = hashedpassword;
			await userModel
				.updateOne({ email: req.body.email }, { password })
				.then(() => {
					return res.send({
						message: "Votre mot de passe a été modifié avec succès",
					});
				})
				.catch((error) => {
					console.log(error);
					return res.send({ message: error.message });
				});
		}
	} catch (error) {
		console.log(error);
		return res.send({ message: error.message });
	}
});

//forget password
router.post("/forgetPssword", async (req, res) => {
	try {
		const user = await userModel.findOne({ email: req.body.email });
		if (!user) {
			return res
				.status(400)
				.json({ message: "Cet utilisateur n'existe pas !" });
		}
		const psw = Math.random().toString(36).slice(-8); // gvenerate Random password
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(psw, salt); //hashed password
		user.password = hash;

		/**Send Email */
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: GMAIL_USER,
				pass: GMAIL_PSW,
			},
		});
		let info = await transporter.sendMail({
			from: GMAIL_USER,
			to: req.body.email,
			subject: "Rénitialiser votre mot de passe",
			html: `
					<p>
					<h5>Bonjour  ${user.nom}  ${user.prenom}  </h5> <br/>
					votre mot de passe a été modifié avec succeés , <br/>
			         	Nouvelle mot de passe est : <b>${psw}<b>
				    </p>

					`,
			attachments: [
				{
					filename: "logoP.png",
					path: __dirname + "/logoP.png",
					cid: "logo@",
				},
			],
		});
		if (info) {
			console.log(info);
		} else {
			console.log(error);
		}
		console.log(psw);
		//save and send res
		user.save().then(() => {
			return res.status(200).send({
				message:
					"  Un email vous a été envoyé avec votre nouveau mot de passe ",
			});
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

// get user connected
router.get("/getUserConnected", async (req, res) => {
	try {
		const data = await userModel.findOne({
			email: req.query.email,
		});
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({ msg: "user not found " });
		}
	} catch (error) {
		res.status(404).json({ error: error });
	}
});

module.exports = router;
