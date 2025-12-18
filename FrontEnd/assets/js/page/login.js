import { login } from "../core/auth.js";

document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("login-form");
	const errorMessage = document.getElementById("login-error");

	if (!form) return;
	errorMessage.style.display = "none";

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;

		try {
			const response = await fetch(
				"http://localhost:5678/api/users/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				}
			);

			if (!response.ok) throw new Error();

			const data = await response.json();
			login(data.token, data.userId);

			window.location.href = "index.html";
		} catch {
			errorMessage.style.display = "block";
		}
	});
});
