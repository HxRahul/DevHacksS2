

import { auth, db } from "../../assets/js/firebase_config.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

function clearProfileDisplay() {
	const root = document.getElementById('profile-info-root');
	if (root) root.innerHTML = '';
}

async function displayProfile(user) {
	const root = document.getElementById('profile-info-root');
	clearProfileDisplay();
	if (!user) {
		const msg = document.createElement('p');
		msg.textContent = 'Please sign in to view your profile.';
		root.appendChild(msg);
		document.getElementById('edit-profile-btn').style.display = 'none';
		return;
	}
	document.getElementById('edit-profile-btn').style.display = '';
	// Fetch bio from Firestore
	let bio = '';
	try {
		const userDocRef = doc(db, "users", user.uid);
		const userDoc = await getDoc(userDocRef);
		if (userDoc.exists() && userDoc.data().bio) {
			bio = userDoc.data().bio;
		}
	} catch (e) { bio = ''; }
	const container = document.createElement('div');
	container.className = 'profile-info';
	container.innerHTML = `
		<div><span class="profile-label">Email:</span> ${user.email || 'N/A'}</div>
		<div class="profile-bio"><span class="profile-label">Bio:</span> <span id="profile-bio-text">${bio ? bio : 'No bio set.'}</span></div>
	`;
	root.appendChild(container);
}

function showEditForm(user, currentBio) {
	const formContainer = document.getElementById('edit-profile-form-container');
	formContainer.innerHTML = `
		<form class="profile-edit-form">
			<label for="bio">Edit Bio:</label>
			<textarea id="bio" name="bio">${currentBio || ''}</textarea>
			<button type="submit">Save</button>
			<button type="button" id="cancel-edit-btn">Cancel</button>
		</form>
	`;
	formContainer.style.display = '';
	document.getElementById('edit-profile-btn').style.display = 'none';

	document.getElementById('cancel-edit-btn').onclick = (e) => {
		e.preventDefault();
		formContainer.style.display = 'none';
		document.getElementById('edit-profile-btn').style.display = '';
	};

	formContainer.querySelector('form').onsubmit = async (e) => {
		e.preventDefault();
		const newBio = formContainer.querySelector('#bio').value;
		const userDocRef = doc(db, "users", user.uid);
		await setDoc(userDocRef, { bio: newBio }, { merge: true });
		formContainer.style.display = 'none';
		document.getElementById('edit-profile-btn').style.display = '';
		displayProfile(user);
	};
}

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
	onAuthStateChanged(auth, async user => {
		currentUser = user;
		await displayProfile(user);
	});
	document.getElementById('edit-profile-btn').onclick = async () => {
		if (!currentUser) return;
		// Fetch current bio
		let bio = '';
		try {
			const userDocRef = doc(db, "users", currentUser.uid);
			const userDoc = await getDoc(userDocRef);
			if (userDoc.exists() && userDoc.data().bio) {
				bio = userDoc.data().bio;
			}
		} catch (e) { bio = ''; }
		showEditForm(currentUser, bio);
	};
});
