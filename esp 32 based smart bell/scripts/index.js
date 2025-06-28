const firebaseConfig = {
  apiKey: "AIzaSyDinvWHwLtRFGSY5_IBzJzbrhhDs4lOJeo",
  authDomain: "electric-bell.firebaseapp.com",
  projectId: "electric-bell",
  storageBucket: "electric-bell.firebasestorage.app",
  messagingSenderId: "871235935211",
  appId: "1:871235935211:web:fc4d97fd75a9020bae57ae",
  measurementId: "G-L6CD8YBYPT"
};

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    function updateEsp32Collection() {
      const todayDate = new Date().toISOString().split('T')[0];
      const todayDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

      db.collection("normalEvents")
        .where("days", "array-contains", todayDay)
        .where("active", "==", true)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const event = doc.data();
            db.collection("esp32").doc(`normal_${doc.id}`).set({
              time: event.time,
              tone: event.tone,
              delay: event.delay || 0,
              d: event.title || "Unnamed Event"
            });
          });
        });

      db.collection("specialEvents")
        .where("date", "==", todayDate)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const event = doc.data();
            db.collection("esp32").doc(`special_${doc.id}`).set({
              time: event.time,
              tone: event.tone,
              delay: 10,
              d: event.description || "No Description"
            });
          });
        });
    }

    function renderEvents() {
      document.getElementById('normal-events-list').innerHTML = '';
      document.getElementById('special-events-list').innerHTML = '';

      db.collection("normalEvents")
        .orderBy("createdAt", "desc")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            createEventCard(doc.id, doc.data(), 'normal');
          });
          updateEsp32Collection();
        });

      db.collection("specialEvents")
        .orderBy("date")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            createEventCard(doc.id, doc.data(), 'special');
          });
          updateEsp32Collection();
          checkPastSpecialEvents();
        });
    }

    function createEventCard(id, event, type) {
      const listElement = document.getElementById(type === 'normal' ? 'normal-events-list' : 'special-events-list');
      const eventItem = document.createElement('div');
      eventItem.className = `event-item ${type}-event`;
      eventItem.id = `event-${id}`;

      let detailsHTML = '';

      if (type === 'normal') {
        detailsHTML = `
          <div class="event-details">
            <h3>${event.title || 'No Title'}</h3>
            <p><strong>Time:</strong> ${event.time} (Delay: ${event.delay || 0}s)</p>
            <p><strong>Days:</strong> ${event.days?.join(', ') || ''}</p>
            <p><strong>Tone:</strong> ${event.tone}</p>
          </div>
        `;
      } else {
        const eventDate = new Date(event.date);
        detailsHTML = `
          <div class="event-details">
            <h3>${event.description || 'No Description'}</h3>
            <p><strong>Date:</strong> ${eventDate.toDateString()}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Tone:</strong> ${event.tone}</p>
          </div>
        `;
      }

      eventItem.innerHTML = detailsHTML + `
        <div class="event-actions">
          <button class="action-btn edit-btn" data-id="${id}" data-type="${type}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" data-id="${id}" data-type="${type}">
            <i class="fas fa-trash"></i>
          </button>
          ${
            type === 'normal'
              ? `<label class="toggle-switch">
                  <input type="checkbox" ${event.active ? 'checked' : ''} data-id="${id}">
                  <span class="slider"></span>
                 </label>`
              : ''
          }
        </div>
      `;

      listElement.appendChild(eventItem);
    }

    function checkPastSpecialEvents() {
      const today = new Date().toISOString().split('T')[0];
      db.collection("specialEvents")
        .where("date", "<", today)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            db.collection("specialEvents").doc(doc.id).delete();
            db.collection("esp32").doc(`special_${doc.id}`).delete();
          });
        });
    }

    function editEvent(id, type) {
      window.location.href = `edit_event.html?id=${id}&type=${type}`;
    }

    function deleteEvent(id, type) {
      const collection = type === 'normal' ? 'normalEvents' : 'specialEvents';
      db.collection(collection).doc(id).delete().then(() => {
        db.collection("esp32").doc(`${type}_${id}`).delete();
      });
    }

    function updateEventStatus(id, isActive) {
      db.collection("normalEvents").doc(id).update({
        active: isActive
      }).then(updateEsp32Collection);
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('.edit-btn')) {
        const btn = e.target.closest('.edit-btn');
        editEvent(btn.dataset.id, btn.dataset.type);
      }

      if (e.target.closest('.delete-btn')) {
        const btn = e.target.closest('.delete-btn');
        if (confirm('Are you sure you want to delete this event?')) {
          deleteEvent(btn.dataset.id, btn.dataset.type);
        }
      }

      if (e.target.closest('.toggle-switch input')) {
        const checkbox = e.target.closest('.toggle-switch input');
        updateEventStatus(checkbox.dataset.id, checkbox.checked);
      }
    });

    // 🚀 Launch everything on load
    document.addEventListener('DOMContentLoaded', () => {
      renderEvents();
      setInterval(updateEsp32Collection, 60000);      // Every 1 minute
      setInterval(checkPastSpecialEvents, 3600000);   // Every hour
    });
