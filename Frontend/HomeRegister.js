import { Alert } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import HomeNav from "./HomeNav";
import Footer from "./FooterHome";
export default function Register() {
	const [timer, setTimer] = useState(false);
	const [message, setmessage] = useState("");
	const [confirme, setConfirme] = useState({
		email: "",
		password: "",
	});
	const [data, setData] = useState({
		nom: "",
		prenom: "",
		tel: "",
		adresse: "",
		email: "",
		password: "",
	});
	const handleChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};
	const handleChangeConfirm = (e) => {
		setConfirme({ ...confirme, [e.target.name]: e.target.value });
	};
	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};
	const Register = async (e) => {
		console.log("/***register***/");
		e.preventDefault();
		if (!validateEmail(data.email)) {
			setmessage("Email non valide");
			setTimer(true);
			setTimeout(() => {
				setTimer(false);
			}, 3000);
		} else if (
			data.email === confirme.email &&
			data.password === confirme.password
		) {
			await axios
				.post(`http://localhost:3000/api/user/register`, data)
				.then((response) => {
					console.log(response);
					console.log(data);
					setTimer(true);
					setmessage(response.data.message);
					setTimeout(() => {
						setTimer(false);
					}, 3000);
				})
				.catch((err) => {
					setmessage(err.response.data.message || err.message);
					setTimer(true);
					setTimeout(() => {
						setTimer(false);
					}, 3000);
				});
		} else {
			if (data.email !== confirme.email) {
				setmessage("email not confirm");
				setTimer(true);
				setTimeout(() => {
					setTimer(false);
				}, 3000);
			}
			if (data.password !== confirme.password) {
				setmessage("password not confirm ");
				setTimer(true);
				setTimeout(() => {
					setTimer(false);
				}, 3000);
			}
		}
	};
	return (
		<div>
			<HomeNav />
			<section
				className="login-page"
				style={{
					display: "block",
					minHeight: "100vh",
					paddingBottom: " 100px",
					height: "auto",
				}}
			>
				<div
					className="warp"
					style={{
						maxWidth: "1540px",
						marginLeft: "9rem",
						marginLight: " 50px",
						paddingLeft: "40px",
						paddingLight: "20px",
						marginRight: "13rem",
					}}
				>
					<div
						class="intro"
						style={{
							paddingTop: "8rem",
							paddingRight: " 50px",
							paddingBottom: "50px",
							paddingLeft: "0.1rem",
						}}
					>
						<h1>S'inscrire</h1>
					</div>
					{message && timer && (
						<div
							class="alert alert-outline-success "
							role="alert"
							style={{ borderColor: "#ff7900" }}
						>
							{message}
						</div>
					)}
					<div
						className="panels cfx"
						style={{ width: " 100%", display: "flex", flexWrap: "wrap" }}
					>
						<div
							className="panel"
							style={{
								width: "50%",
								marginRight: "10px",
								minWidth: "300px",
								flex: 1,
							}}
						>
							<div
								className="panel__inr"
								style={{ backgroundColor: "white", padding: "28px" }}
							>
								<form onSubmit={Register}>
									<div className="form-group">
										<label className="form-label">Nom</label>
										<span class="req-star"> *</span>
										<input
											type="text"
											className="form-control"
											name="nom"
											value={data.nom}
											onChange={handleChange}
											required
										/>
									</div>
									<div className="form-group">
										<label className="form-label">Prénom</label>
										<span class="req-star"> *</span>
										<input
											type="text"
											className="form-control"
											name="prenom"
											value={data.prenom}
											onChange={handleChange}
											required
										/>
									</div>
									<div className="form-group">
										<label className="form-label">Profil</label>
										<span class="req-star"> *</span>
										<input
											type="text"
											className="form-control"
											name="profile"
											value={data.profile}
											onChange={handleChange}
											required
										/>
									</div>
									<div className="form-group">
										<label className="form-label">E-mail</label>
										<span class="req-star"> *</span>
										<input
											type="email"
											className="form-control"
											name="email"
											value={data.email}
											onChange={handleChange}
											required
										/>
									</div>
									<div className="form-group">
										<label className="form-label">Confirmer e-mail</label>
										<span class="req-star"> *</span>
										<input
											type="email"
											className="form-control"
											name="email"
											value={confirme.email}
											// onChange={(e) => setConfirme(e.target.value)}
											onChange={handleChangeConfirm}
											required
										/>
									</div>
									<div className="form-group">
										<label className="form-label">Mot de passe</label>
										<span class="req-star"> *</span>
										<input
											type="password"
											className="form-control"
											name="password"
											value={data.password}
											onChange={handleChange}
											required
										/>
									</div>
									<div className="form-group">
										<label className="form-label">Confirmer mot de passe</label>
										<span class="req-star"> *</span>
										<input
											type="password"
											className="form-control"
											name="password"
											value={confirme.password}
											onChange={handleChangeConfirm}
											required
										/>
									</div>
									<div className="form-group">
										<label className="form-label">Téléphone</label>
										<span class="req-star"> *</span>
										<input
											type="text"
											className="form-control"
											name="tel"
											value={data.tel}
											onChange={handleChange}
											required
										/>
									</div>
									<div className="form-group">
										<label className="form-label">Adresse</label>
										<span class="req-star"> *</span>
										<input
											type="text"
											className="form-control"
											name="adresse"
											value={data.adresse}
											onChange={handleChange}
											required
										/>
									</div>
									<button type="submit" className="btn btn-primary">
										S'inscrire
									</button>
									<br />
								</form>
							</div>
						</div>

						<div
							className="panel"
							style={{ width: "50%", minWidth: 300, flex: 1 }}
						>
							<div
								className="panel__inr"
								style={{ backgroundColor: "white", padding: "28px" }}
							>
								<h3 style={{ color: "#ff7900" }}>
									{" "}
									Vous avez déjà un compte ?{" "}
								</h3>
								<p>Cliquez sur le bouton ci-dessous pour se connecter</p>
								<Link to="/home" type="button" class="btn btn-secondary">
									S'identifier
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>{" "}
			<nav aria-label="Back to top" class="back-to-top">
				<a
					href="#top"
					class="back-to-top-link btn btn-icon btn-secondary"
					title="Back to top"
				>
					<span class="visually-hidden">Back to top</span>
				</a>
			</nav>
			<Footer />
		</div>
	);
}
