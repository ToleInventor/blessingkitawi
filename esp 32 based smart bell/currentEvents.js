console.log("ready");
    const firebaseConfig = {
      apiKey: "AIzaSyDinvWHwLtRFGSY5_IBzJzbrhhDs4lOJeo",
      authDomain: "electric-bell.firebaseapp.com",
      projectId: "electric-bell",
      storageBucket: "electric-bell.appspot.com",
      messagingSenderId: "871235935211",
      appId: "1:871235935211:web:fc4d97fd75a9020bae57ae",
      measurementId: "G-L6CD8YBYPT"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    db.collection("esp32")
    const event=doc.data();
    console.log(event.time);
