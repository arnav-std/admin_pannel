const firebaseConfig = {
  apiKey: "AIzaSyAwkibqUpHYu_V52kyqsw4I-up96GpqJtc",
  authDomain: "loginapp-47943.firebaseapp.com",
  projectId: "loginapp-47943",
  storageBucket: "loginapp-47943.appspot.com",
  messagingSenderId: "210937720299",
  appId: "1:210937720299:web:c65b4412d87f7469fa7dae",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let allApplications = [];

function loadApplications() {
  const list = document.getElementById("applicationsList");
  list.innerHTML = "Loading...";

  db.collection("users")
    .get()
    .then((snapshot) => {
      allApplications = [];
      const promises = [];

      snapshot.forEach((userDoc) => {
        const userId = userDoc.id;
        const cardsRef = db.collection("users").doc(userId).collection("card");

        promises.push(
          cardsRef.get().then((cardsSnap) => {
            cardsSnap.forEach((cardDoc) => {
              const data = cardDoc.data();
              allApplications.push({
                userId,
                cardId: cardDoc.id,
                data,
              });
            });
          })
        );
      });

      Promise.all(promises).then(() => {
        displayApplications("all");
      });
    })
    .catch((err) => {
      console.error("Firestore error:", err);
      document.getElementById("applicationsList").innerHTML =
        "<p style='color:red;'>Failed to load applications. Check permissions.</p>";
    });
}

function displayApplications(filter) {
  const list = document.getElementById("applicationsList");
  list.innerHTML = "";

  const filtered = allApplications.filter((app) => {
    if (filter === "all") return true;
    return (app.data.status || "in progress").toLowerCase() === filter;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<p>No ${filter} applications found.</p>`;
    return;
  }

  filtered.forEach((app) => {
    const { data } = app;

    const cardEl = document.createElement("div");
    cardEl.className = "application-card";

    let familyHtml = "";
    if (data.familyMembers && data.familyMembers.length > 0) {
      familyHtml = "<p><strong>Family Members:</strong></p><ul>";
      data.familyMembers.forEach((member) => {
        familyHtml += `<li><p><strong>Aadhar Number: </strong>${member.aadhar}</p><p><strong>Name: </strong> ${member.name}</p><p><strong>Relation: </strong>${member.relation}</p></li>`;
      });
      familyHtml += "</ul>";
    }

    cardEl.innerHTML = `
      <h3>${data.fullName}</h3>
      <p><strong>DOB:</strong> ${data.dob}</p>
      <p><strong>Gender:</strong> ${data.gender}</p>
      <p><strong>Mobile:</strong> ${data.mobileNumber}</p>
      <p><strong>PAN:</strong> ${data.panCardNumber}</p>
      <p><strong>Address:</strong> ${data.address}, ${data.village}, ${data.district}, ${data.state}, ${data.pincode}</p>
      ${familyHtml}
      <p><strong>Status:</strong> ${data.status || "In Progress"}</p>
      <div class="actions">
        <button class="approve" ${data.status?.toLowerCase() !== "in progress" ? "disabled" : ""} onclick="updateStatus('${app.userId}', '${app.cardId}', 'accepted')">Approve</button>
        <button class="reject" ${data.status?.toLowerCase() !== "in progress" ? "disabled" : ""} onclick="updateStatus('${app.userId}', '${app.cardId}', 'rejected')">Reject</button>
      </div>
    `;

    list.appendChild(cardEl);
  });
}

function filterStatus(status) {
  displayApplications(status);
}

function updateStatus(userId, cardId, status) {
  const cardRef = db.collection("users").doc(userId).collection("card").doc(cardId);
  cardRef
    .update({ status })
    .then(() => {
      alert(`Application ${status}`);
      loadApplications();
    })
    .catch((err) => {
      console.error("Error updating status:", err);
    });
}

loadApplications();
