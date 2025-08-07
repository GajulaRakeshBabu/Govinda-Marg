document.addEventListener('DOMContentLoaded', () => {
  // Create toggle button for chatbot
  const toggleButton = document.createElement('button');
  toggleButton.id = 'chatbotToggleButton';
  toggleButton.textContent = 'Help Chatbot';
  toggleButton.style.position = 'fixed';
  toggleButton.style.bottom = '20px';
  toggleButton.style.right = '20px';
  toggleButton.style.padding = '10px 15px';
  toggleButton.style.backgroundColor = '#007bff';
  toggleButton.style.color = 'white';
  toggleButton.style.border = 'none';
  toggleButton.style.borderRadius = '8px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.zIndex = '10000';

  // Create chat container
  const chatContainer = document.createElement('div');
  chatContainer.id = 'chatbotContainer';
  chatContainer.style.position = 'fixed';
  chatContainer.style.bottom = '20px';
  chatContainer.style.right = '20px';
  chatContainer.style.width = '300px';
  chatContainer.style.height = '400px';
  chatContainer.style.backgroundColor = 'white';
  chatContainer.style.border = '1px solid #ccc';
  chatContainer.style.borderRadius = '8px';
  chatContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  chatContainer.style.display = 'none'; // Initially hidden
  chatContainer.style.flexDirection = 'column';
  chatContainer.style.zIndex = '10000';

  // Chat header with close button
  const chatHeader = document.createElement('div');
  chatHeader.style.backgroundColor = '#007bff';
  chatHeader.style.color = 'white';
  chatHeader.style.padding = '10px';
  chatHeader.style.fontWeight = 'bold';
  chatHeader.style.textAlign = 'center';
  chatHeader.style.display = 'flex';
  chatHeader.style.justifyContent = 'space-between';
  chatHeader.style.alignItems = 'center';

  const headerTitle = document.createElement('span');
  headerTitle.textContent = 'Help Chatbot';

  const closeButton = document.createElement('button');
  closeButton.textContent = '✖';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.fontSize = '1.2rem';
  closeButton.style.cursor = 'pointer';

  chatHeader.appendChild(headerTitle);
  chatHeader.appendChild(closeButton);

  const chatMessages = document.createElement('div');
  chatMessages.style.flex = '1';
  chatMessages.style.padding = '10px';
  chatMessages.style.overflowY = 'auto';
  chatMessages.style.fontSize = '0.9rem';

  // Default questions container
  const defaultQuestions = document.createElement('div');
  defaultQuestions.style.padding = '10px';
  defaultQuestions.style.borderBottom = '1px solid #ccc';
  defaultQuestions.style.backgroundColor = '#f9f9f9';

  const questions = [
    'View ticket bookings',
    'How to book ticket for Tirupati to Tirumala',
    'How to book ticket for Tirumala to Tirupati'
  ];

  questions.forEach(q => {
    const btn = document.createElement('button');
    btn.textContent = q;
    btn.style.margin = '5px 5px 5px 0';
    btn.style.padding = '3px 8px';
    btn.style.border = '1px solid #007bff';
    btn.style.borderRadius = '4px';
    btn.style.backgroundColor = 'white';
    btn.style.color = '#007bff';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '0.8rem'; // smaller font size for default questions
    btn.addEventListener('click', () => {
      addMessage(q, true);
      stepByStepAnswer(q);
    });
    defaultQuestions.appendChild(btn);
  });

  const chatInputContainer = document.createElement('div');
  chatInputContainer.style.display = 'flex';
  chatInputContainer.style.borderTop = '1px solid #ccc';

  const chatInput = document.createElement('input');
  chatInput.type = 'text';
  chatInput.placeholder = 'Ask me...';
  chatInput.style.flex = '1';
  chatInput.style.padding = '10px';
  chatInput.style.border = 'none';
  chatInput.style.outline = 'none';

  const sendButton = document.createElement('button');
  sendButton.textContent = 'Send';
  sendButton.style.backgroundColor = '#007bff';
  sendButton.style.color = 'white';
  sendButton.style.border = 'none';
  sendButton.style.padding = '10px 15px';
  sendButton.style.cursor = 'pointer';

  chatInputContainer.appendChild(chatInput);
  chatInputContainer.appendChild(sendButton);

  chatContainer.appendChild(chatHeader);
  chatContainer.appendChild(defaultQuestions);
  chatContainer.appendChild(chatMessages);
  chatContainer.appendChild(chatInputContainer);

  document.body.appendChild(toggleButton);
  document.body.appendChild(chatContainer);

  // Toggle chat panel visibility
  toggleButton.addEventListener('click', () => {
    chatContainer.style.display = 'flex';
    toggleButton.style.display = 'none';
  });

  closeButton.addEventListener('click', () => {
    chatContainer.style.display = 'none';
    toggleButton.style.display = 'block';
  });

  // Increase chatMessages height and font size for better readability
  chatMessages.style.height = '250px';
  chatMessages.style.fontSize = '1.1rem';

  function addMessage(message, fromUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.style.marginBottom = '10px';
    msgDiv.style.padding = '8px';
    msgDiv.style.borderRadius = '5px';
    msgDiv.style.backgroundColor = fromUser ? '#dcf8c6' : '#f1f0f0';
    msgDiv.style.alignSelf = fromUser ? 'flex-end' : 'flex-start';

    // Add click event to read message aloud and stop previous speech
    msgDiv.addEventListener('click', () => {
      window.speechSynthesis.cancel();
      speak(message);
    });

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function stepByStepAnswer(query) {
    const q = query.toLowerCase();
    let steps = [];

    if (q.includes('book') && q.includes('tirupati') && q.includes('tirumala')) {
      steps = [
        'Go to the "Book Tickets: Tirupati → Tirumala" section on the home page.',
        'Select the number of tickets you want to book.',
        'Click the "Book Ticket" button to complete your booking.'
      ];
    } else if (q.includes('book') && q.includes('tirumala') && q.includes('tirupati')) {
      steps = [
        'Go to the "Book Tickets: Tirumala → Tirupati" section on the home page.',
        'Select the number of tickets you want to book.',
        'Click the "Book Ticket" button to complete your booking.'
      ];
    } else if (q.includes('view') && q.includes('ticket')) {
      steps = [
        'Click on the " Bookings" button on the home page.',
        'You will see a list of your booked tickets with details and QR codes.'
      ];
    } else {
      addMessage("Sorry, I can only answer questions about booking tickets from Tirupati to Tirumala, from Tirumala to Tirupati, and viewing booked tickets.");
      return;
    }

    let i = 0;
    function showNextStep() {
      if (i < steps.length) {
        addMessage(steps[i], false);
        i++;
        setTimeout(showNextStep, 3000);
      }
    }
    showNextStep();
  }

  function getResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('book') && q.includes('tirupati') && q.includes('tirumala')) {
      return 'To book tickets from Tirupati to Tirumala, go to the "Book Tickets: Tirupati → Tirumala" section on the home page, select the number of tickets, and click "Book Ticket".';
    }
    if (q.includes('book') && q.includes('tirumala') && q.includes('tirupati')) {
      return 'To book tickets from Tirumala to Tirupati, go to the "Book Tickets: Tirumala → Tirupati" section on the home page, select the number of tickets, and click "Book Ticket".';
    }
    if (q.includes('view') && q.includes('booking')) {
      return 'To view your booked tickets, click on the "My Booked Tickets" button on the home page.';
    }
    return "Sorry, I can only answer questions about booking tickets from Tirupati to Tirumala, from Tirumala to Tirupati, and viewing booked tickets.";
  }

  sendButton.addEventListener('click', () => {
    const userInput = chatInput.value.trim();
    if (!userInput) return;
    addMessage(userInput, true);
    chatInput.value = '';
    const response = getResponse(userInput);
    setTimeout(() => addMessage(response, false), 500);
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendButton.click();
    }
  });
});