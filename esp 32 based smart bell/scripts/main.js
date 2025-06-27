    const firebaseConfig = {
        apiKey: "AIzaSyDaOVJUtbGLJGfgN0WGuuvTRldnlot3VBA",
        authDomain: "esp32bell-5a9f4.firebaseapp.com",
        projectId: "esp32bell-5a9f4",
        storageBucket: "esp32bell-5a9f4.appspot.com",
        messagingSenderId: "180892066628",
        appId: "1:180892066628:web:854f635cc3c01cd587ad11",
        measurementId: "G-VZY3RR3P5H"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    async function ensureCollectionsExist() {
        const collections = ['normalEvents', 'specialEvents', 'esp32'];
        for (const colName of collections) {
            try {
                const snapshot = await db.collection(colName).limit(1).get();
            } catch (error) {
                alert(`Error accessing ${colName}:`, error);
            }
        }
    }

    async function saveEvent() {
        await ensureCollectionsExist();     
        const eventType = document.getElementById("type_of_event").value;
        
        try {
            if(eventType === "NORMAL EVENT") {          
                const eventData = {
                    title: document.getElementById("tile").value,
                    time: document.getElementById("time").value,
                    delay: Number(document.getElementById("delay").value) || 0,
                    tone: document.getElementById("tone").value,
                    active: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                const frequency = document.getElementById("days").value;
                if(frequency === "Weekdays") {
                    eventData.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
                } else if(frequency === "Weekends") {
                    eventData.days = ["Saturday", "Sunday"];
                } else
                if(frequency === "All days") {
                    eventData.days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday"];
                } else if(frequency === "Some days") {
                    const daysInput = prompt("Enter days separated by commas (e.g., Monday, Wednesday)");
                    if(!daysInput) {
                        alert("You must specify the days for this event");
                        return;
                    }
                    eventData.days = daysInput.split(',').map(day => day.trim());
                }
                await db.collection("normalEvents").add(eventData);
                
            } else if(eventType === "SPECIAL EVENT") {
                const eventData = {
                    date: document.getElementById("specialDate").value,
                    time: document.getElementById("specialTime").value,
                    description: document.getElementById("specialDescription").value,
                    tone: document.getElementById("specialTone").value,
                    completed: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                await db.collection("specialEvents").add(eventData);
            }
            
            alert("Event created successfully!");
            
        } catch (error) {
            console.error("Error saving event:", error);
            alert("Failed to create event. Please check console for details.");
        }
    }

    function leaveSite() {
        window.location.href = "index.html";
    } document.addEventListener('DOMContentLoaded', ensureCollectionsExist);
