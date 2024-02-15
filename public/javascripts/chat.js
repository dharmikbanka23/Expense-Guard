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

// Add event listener to send messages
document.getElementById('sendButton').addEventListener('click', () => {
  const messageInput = document.getElementById('chatInput');
  const message = messageInput.value.trim(); // Trim whitespaces

  if (message) {
    // Only emit the message if it's not empty
    socket.emit('chatMessage', message);
    messageInput.value = ''; // Clear input field
  }
  
});

// Listen for incoming messages
socket.on('chatMessage', (message) => {
  const chatMessages = document.getElementById('chatMessages');

  // Create a timestamp using Moment.js
  const timestamp = moment().format('h:mm A');

  // Create a new message container element
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container';

  // Create a new message element with timestamp
  const messageElement = document.createElement('p');
  messageElement.textContent = message;

  // Create a timestamp element with lower font size
  const timestampElement = document.createElement('p');
  timestampElement.textContent = timestamp;
  timestampElement.className = 'timestamp';

  // Append the message and timestamp to the container
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