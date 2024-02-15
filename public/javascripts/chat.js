const socket = io();
const chatModal = document.getElementById('chatModal');

// Add event listener to toggle the chat box
document.getElementById('toggleChatButton').addEventListener('click', () => {
  if (chatModal.style.display === 'block') {
    chatModal.style.display = 'none';
  } else {
    chatModal.style.display = 'block';
    // Scroll to the bottom of the chat messages when the chat opens
    scrollToBottom();
  }
});

// Add event listener to send messages on button click
document.getElementById('sendButton').addEventListener('click', () => {
  sendMessage(); // Pass true to indicate that this is a user message
});

// Add event listener to send messages on 'Enter' key press
document.getElementById('chatInput').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Listen for incoming messages
socket.on('chatMessage', (message, user) => {
  // Assuming you have a variable 'currentUserUsername' that stores the current user's username
  const isUser = user === username;

  const chatMessages = document.getElementById('chatMessages');

  // Create a timestamp using Moment.js
  const timestamp = moment().format('h:mm A');

  // Create a new message container element
  const messageContainer = document.createElement('div');
  messageContainer.className = isUser ? 'message-container user-message' : 'message-container other-message';


  const usernameElement = document.createElement('p');
  usernameElement.textContent = user;
  usernameElement.className = 'username'; // Add a class for styling if needed

  // Create a new message element with timestamp
  const messageElement = document.createElement('p');
  messageElement.textContent = message;

  // Create a timestamp element with lower font size
  const timestampElement = document.createElement('p');
  timestampElement.textContent = timestamp;
  timestampElement.className = 'timestamp';

  // Append the message and timestamp to the container
  if(!isUser){
    messageContainer.appendChild(usernameElement);
  }
  messageContainer.appendChild(messageElement);
  messageContainer.appendChild(timestampElement);

  // Append the container to the chat messages
  chatMessages.appendChild(messageContainer);

  // Scroll to the bottom of the chat messages
  scrollToBottom();
});

// Function to scroll to the bottom of the chat messages
function scrollToBottom() {
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send a message
function sendMessage() {
  const messageInput = document.getElementById('chatInput');
  const message = messageInput.value.trim(); // Trim spaces

  if (message) {
    // Get the JWT token from wherever you store it (e.g., cookies)
    const user = username;

    // Only emit the message if it's not empty
    socket.emit('chatMessage', message, user);
    messageInput.value = ''; // Clear input field
  }
}