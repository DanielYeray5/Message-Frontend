const loginForm = document.getElementById('loginForm');
const messageForm = document.getElementById('messageForm');
const receiverSelect = document.getElementById('receiverSelect');
const chat = document.getElementById('chat');
let currentUser;

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const nombre = formData.get('Nombre');
    const password = formData.get('Password');
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Nombre: nombre, Password: password })
        });
        const data = await response.json();
        if (data.ID) {
            currentUser = data;
            loginForm.style.display = 'none';
            messageForm.style.display = 'block';
            loadUsers();
            loadMessages();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
    }
});

async function loadUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        receiverSelect.innerHTML = ''; // Limpiar el select
        users.forEach(user => {
            if (user.ID !== currentUser.ID) {
                const option = document.createElement('option');
                option.value = user.ID;
                option.textContent = user.Nombre;
                receiverSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(messageForm);
    const message = formData.get('Mensaje');
    const receiverID = receiverSelect.value;
    try {
        const response = await fetch('http://localhost:3000/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ senderID: currentUser.ID, receiverID: receiverID, message: message })
        });
        const data = await response.json();
        console.log(data);
        loadMessages();
    } catch (error) {
        console.error(error);
    }
});

async function loadMessages() {
    const receiverID = receiverSelect.value;
    try {
        const response = await fetch(`http://localhost:3000/messages?senderID=${currentUser.ID}&receiverID=${receiverID}`);
        const data = await response.json();
        renderMessages(data);
    } catch (error) {
        console.error(error);
    }
}

function renderMessages(messages) {
    chat.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.textContent = `${msg.senderID === currentUser.ID ? 'Tú' : 'Otro'}: ${msg.message}`;
        chat.appendChild(div);
    });
}
