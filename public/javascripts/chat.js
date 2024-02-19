const socket = io({
  query: {
    username: username,
  }
});
const chatModal = document.getElementById('chatModal');
let currentChatMode;

// On default
window.onload = () => {
  currentChatMode = 'ExpenseGPT';
  updateChatMode();
}

// Add event listener to toggle the chat box
document.getElementById('toggleChatButton').addEventListener('click', () => {
  if (chatModal.style.display === 'block') {
    chatModal.style.display = 'none';
  } else {
    chatModal.style.display = 'block';
    // Scroll to the bottom of the chat messages when the chat opens
    scrollGPTChat();
    scrollUniversalChat();
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


// Add event listener to toggle between ExpenseGPT and Universal Chat
document.querySelector('.left-toggle').addEventListener('click', () => {
  currentChatMode = 'ExpenseGPT';
  updateChatMode();
});

document.querySelector('.right-toggle').addEventListener('click', () => {
  currentChatMode = 'UniversalChat';
  updateChatMode();
});

// Function to update the chat mode
function updateChatMode() {
  const chatHeading = document.getElementById('chat-heading');
  const chatHeadingDescription = document.getElementById('chat-heading-description');
  const chatFooter = document.querySelector('.chat-footer');
  const leftToggle = document.querySelector('.left-toggle');
  const rightToggle = document.querySelector('.right-toggle');
  const gptMessage = document.getElementById('gptMessages');
  const chatMessage = document.getElementById('chatMessages');

  // Reset toggled class for both left and right toggles
  leftToggle.classList.remove('toggled');
  rightToggle.classList.remove('toggled');

  // Toggle the class based on the current mode
  if (currentChatMode === 'ExpenseGPT') {
    leftToggle.classList.add('toggled');
    chatHeading.innerHTML = 'ExpenseGPT';
    chatHeadingDescription.innerHTML = '(ExpenseGPT is a conversational assistant)';
  } 
  else {
    rightToggle.classList.add('toggled');
    chatHeading.innerHTML = 'Universal Chat';
    chatHeadingDescription.innerHTML = '(Please be respectful and professional)';
  }

  // Implement logic to switch between different chat modes here
  // For example, hide/show different chat content based on the current mode
  if (currentChatMode === 'ExpenseGPT') {
    gptMessage.style.display = 'block';
    chatMessage.style.display = 'none';
  }
  else {
    // Show Universal Chat content, hide ExpenseGPT content
    gptMessage.style.display = 'none';
    chatMessage.style.display = 'block';
  }
}


// Listen for incoming messages
socket.on('chatMessage', (message, user, room) => {

  // Assuming you have a variable 'currentUserUsername' that stores the current user's username
  const isUser = user === username;

  const chatMessages = document.getElementById('chatMessages');
  const gptMessages = document.getElementById('gptMessages');

  // Create a timestamp using Moment.js
  const timestamp = moment().format('h:mm A');

  // Check for server messages
  if (user ==='server-message') {
    if (!message.startsWith(username)) {
      // Append the message to the chat window
      const messageElement = document.createElement('p');
      messageElement.className ='server-message';
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
    }
  }
  else{
    // Create a new message container element
    const messageContainer = document.createElement('div');
    messageContainer.className = isUser ? 'message-container user-message' : 'message-container other-message';
  
    // Check if it is ExpenseGPT message
    if (user === 'ExpenseGPT') {
      messageContainer.className += ' expenseGPT-message';
    }
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
    if (!isUser) {
      messageContainer.appendChild(usernameElement);
    }
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(timestampElement);
  
    // Check the room it is coming from and append message accordingly
    if (room === 'global') {
      chatMessages.appendChild(messageContainer);
      scrollUniversalChat();
    }
    else if (room.replace('expenseGPT-', '') === username) {
      gptMessages.appendChild(messageContainer);
      scrollGPTChat();
    }
  }
});

// Function to scroll to the bottom of the chat messages
function scrollUniversalChat() {
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to scroll to the bottom of the gpt messages
function scrollGPTChat() {
  const gptMessages = document.getElementById('gptMessages');
  gptMessages.scrollTop = gptMessages.scrollHeight;
}

// Function to send a message
function sendMessage() {
  const messageInput = document.getElementById('chatInput');
  const message = messageInput.value.trim(); // Trim spaces

  if (message) {
    // Get the JWT token from wherever you store it (e.g., cookies)
    const user = username;

    // Get the room name based on the toggle
    const room = currentChatMode === 'ExpenseGPT' ? `expenseGPT-${user}` : 'global';
    
    // Only emit the message if it's not empty
    socket.emit('chatMessage', message, user, room);
    messageInput.value = ''; // Clear input field
  }
}