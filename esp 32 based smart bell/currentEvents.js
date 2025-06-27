console.log("ready");
    const firebaseConfig = {
      apiKey: "AIzaSyAn8Niz8Trv7_ynFYoSgRSg-qc41imBp4M",
      authDomain: "sellers-and-buyers-app.firebaseapp.com",
      projectId: "sellers-and-buyers-app",
      storageBucket: "sellers-and-buyers-app.appspot.com",
      messagingSenderId: "963493817350",
      appId: "1:963493817350:web:78c16d24a8c7dd57582787"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    db.collection("esp32")
    const event=doc.data();
    console.log(event.time);