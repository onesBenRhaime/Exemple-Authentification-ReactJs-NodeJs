import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HomeNav from "./HomeNav";
import odc from "./ODC-1.svg";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { sessionService } from "redux-react-session";
import Footer from "./FooterHome";
export default function Home() {
	const [user, setUser] = useState({
		password: "",
		email: "",
	});
	const [timer, setTimer] = useState(false);
	const [message, setmessage] = useState("");
	const { email, password } = user;
	const navigate = useNavigate();
	const handleChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};
	const Login = async (e) => {
		e.preventDefault();
		axios
			.post(`http://localhost:3000/api/user/login`, {
				email,
				password,
			})
			.then((response) => {
				console.log(response.data);
				const token = response.data;
				console.log(token);
				if (typeof token === "string") {
					localStorage.setItem("jwt", token);
					const decoded = jwt_decode(token);
					console.log(decoded);
					//decodage
					sessionService.saveSession(token).then(() => {
						sessionService.saveUser(decoded).then(() => {
							if (decoded.role.toLowerCase() === "collaborateur") {
								navigate("/dashboard/collaborateur");
							} else if (decoded.role.toLowerCase() === "admin") {
								navigate("/dashboard");
							} else {
								navigate("/home");
							}
						});
					});
				} else {
					setmessage(response.data.message);
					setTimer(true);
					setTimeout(() => {
						setTimer(false);
					}, 3000);
				}
			})
			.catch((err) => {
				console.log(err.response?.data || err.message);
				setmessage(err.response?.data?.message || "Erreur au niveau de server");
				setTimer(true);
				setTimeout(() => {
					setTimer(false);
				}, 3000);
			});
	};
	return (
		<div>
			<HomeNav />
			<main
				role="main"
				class="container"
				className="login-page"
				style={{
					display: "block",
					minHeight: "100vh",
					backgroundColor: "#dee2e657",
				}}
			>
				<div
					className="warp"
					style={{
						maxWidth: "1540px",
						marginLeft: "40px",
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
							paddingLeft: "0.1rem",
						}}
					>
						{" "}
						<img
							id="obs"
							src={odc}
							alt=""
							width={"50%"}
							height={"30%"}
							aria-hidden="true"
							loading="lazy"
						/>
						<h3 style={{ lineHeight: "2.6rem", fontWeight: "700" }}>
							Vous êtes au bon endroit pour automatiser tout le processus de
							recrutement !
						</h3>
					</div>{" "}
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
								<h3 className="heading--orange" style={{ color: " #f16e00" }}>
									Vous avez déjà un compte ?
								</h3>
								<form onSubmit={Login}>
									<div className="mb-3">
										<label className="form-label">Addresse E-mail</label>
										<input
											type="email"
											className="form-control"
											value={email}
											onChange={handleChange}
											name="email"
										/>
									</div>

									<div className="mb-3">
										<label className="form-label">Mot de passe</label>
										<input
											type="password"
											className="form-control"
											value={password}
											onChange={handleChange}
											name="password"
										/>
									</div>
									<Link to="/Forget">Mot de passe oublié ?</Link>
									<div style={{ marginTop: "12px" }}>
										<button type="submit" className="btn btn-primary">
											Se connecter
										</button>
									</div>
								</form>
							</div>
						</div>
						{/* inscription */}
						<div
							className="panel"
							style={{ width: "50%", minWidth: 300, flex: 1 }}
						>
							<div
								className="panel__inr"
								style={{ backgroundColor: "white", padding: "28px" }}
							>
								<h3 style={{ color: "#ff7900" }}>Première visite ?</h3>

								<p>
									Veuillez compléter un court formulaire d'inscription pour
									créer un compte et obtenir l'accès à ce site.
								</p>
								<Link to="/register" type="button" class="btn btn-secondary">
									S'inscrire
								</Link>
							</div>
						</div>
					</div>
				</div>
			</main>
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
