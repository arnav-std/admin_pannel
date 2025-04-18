// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAwkibqUpHYu_V52kyqsw4I-up96GpqJtc",
  authDomain: "loginapp-47943.firebaseapp.com",
  projectId: "loginapp-47943",
  storageBucket: "loginapp-47943.appspot.com",
  messagingSenderId: "210937720299",
  appId: "1:210937720299:web:c65b4412d87f7469fa7dae",
  measurementId: "G-W4VSHZ1WKM"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById("uploadReportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = document.getElementById("userId").value.trim();
  const reportOf = document.getElementById("reportOf").value;
  const doctor = document.getElementById("doctor").value;
  const bookedOn = document.getElementById("bookedOn").value;
  const appointmentDate = document.getElementById("appointmentDate").value;
  const status = document.getElementById("status").value;
  const reportLink = document.getElementById("reportLink").value;

  const statusMessage = document.getElementById("uploadStatus");
  statusMessage.textContent = "";

  if (!userId) {
    alert("Patient Firebase User ID is required.");
    return;
  }

  try {
    await db.collection("users")
            .doc(userId)
            .collection("reports")
            .add({
              reportOf,
              doctor,
              bookedOn,
              appointmentDate,
              status,
              reportLink,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

    statusMessage.textContent = "✅ Report uploaded successfully.";
    statusMessage.style.color = "green";
    document.getElementById("uploadReportForm").reset();
  } catch (error) {
    console.error("Upload error:", error);
    statusMessage.textContent = "❌ Error uploading report.";
    statusMessage.style.color = "red";
  }
});
