import "./bootstrap.bundle.min.js";
import "./lenis.min.js";

// Mobile Menu
const mobileMenuOpenIcon = document.querySelector(".mobile-menu-open-icon");
const mobileMenuCloseIcon = document.querySelector(".mobile-menu-close-icon");
const mobileMenu = document.querySelector(".mobile-menu");

// Only add event listeners if all the mobile menu elements exist
if (mobileMenuOpenIcon && mobileMenuCloseIcon && mobileMenu) {
  function toggleMobileMenu() {
    mobileMenu.classList.toggle('show-menu');
  }
  mobileMenuOpenIcon.addEventListener('click', toggleMobileMenu);
  mobileMenuCloseIcon.addEventListener('click', toggleMobileMenu);
}


document.addEventListener('DOMContentLoaded', () => {
  const pricingTab = document.querySelector('.pricing-tab');
  if (!pricingTab) return; // Exit if the toggle doesn't exist

  const buttons = pricingTab.querySelectorAll('button');
  const pricingItems = document.querySelectorAll('.pricing-item');

  const updatePricing = (period) => {
    // Update the active state on the buttons
    buttons.forEach(button => {
      button.classList.toggle('active', button.dataset.period === period);
    });

    // Loop through each pricing card
    pricingItems.forEach(item => {
      const monthlyPrice = item.getAttribute('data-monthly-price');
      
      // *** THE KEY CHANGE IS HERE ***
      // Only update cards that have a valid, numeric price.
      // This will automatically skip "Custom" and "$0" (or any non-number).
      if (monthlyPrice && !isNaN(monthlyPrice)) {
        const yearlyPrice = item.getAttribute('data-yearly-price');
        const spanElement = item.querySelector('h4 span');
        const subElement = item.querySelector('h4 sub');
        
        // Don't change the $0 'forever' plan
        if (parseInt(monthlyPrice) === 0) return;

        if (period === 'yearly') {
          spanElement.textContent = '$' + yearlyPrice;
          subElement.textContent = '/yr';
        } else {
          spanElement.textContent = '$' + monthlyPrice;
          subElement.textContent = '/mo';
        }
      }
    });
  };

  // Add a single event listener to the parent container
  pricingTab.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const period = event.target.dataset.period;
      updatePricing(period);
    }
  });

  // Set initial state on page load
  updatePricing('monthly');
});

document.addEventListener("DOMContentLoaded", function () {
  const searchIcon = document.getElementById("toggleSearch");
  const searchBar = document.getElementById("searchBar");

  searchIcon.addEventListener("click", function (event) {
    event.preventDefault();
    searchBar.classList.toggle("hidden");
  });

  // Hide the search bar when clicking outside of it
  document.addEventListener("click", function (event) {
    const isClickInside =
      searchBar.contains(event.target) || searchIcon.contains(event.target);

    if (!isClickInside) {
      searchBar.classList.add("hidden");
    }
  });
});

// Chat Widget
const chatList = document.getElementById("chatList");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatInputContainer = document.getElementById("chatInputContainer");

// Check if chatList exists before proceeding
if (chatList) {
  // Chat state to manage the conversation flow
  let chatState = 0; 
  
  // Pre-scripted messages for the chat flow
  const scriptedMessages = [
    {
      sender: "You",
      text: "How can I manage user-specific data without retraining my model for every user?",
    },
    {
      sender: "MemMachine Agent",
      text: "That's a key challenge for building personalized agents. MemMachine addresses this with its Personalization memory layer, which stores user-specific data independently of your core model. I recall you were building a financial advice agent for small businesses last month—this is a perfect use case for that.",
    },
    {
      sender: "You",
      text: "Wow, you remember that? That's exactly what I'm working on. How does that work under the hood?",
    },
    {
      sender: "MemMachine Agent",
      text: "The core of our memory system is designed to be model-agnostic, giving your agents stateful, context-aware conversations and the ability to recall user-specific facts over time. This is the foundation for building the next generation of AI solutions.",
    },
    {
      sender: "You",
      text: "Okay, that's exactly what I need.",
    },
    {
      sender: "MemMachine Agent",
      text: "You're welcome! Would you like to know how to get started with this kind of memory system? (Yes/No)",
    },
  ];

  function addMessage(message) {
    const chatItem = document.createElement("div");
    chatItem.className = "hero-chat-item";
    chatItem.innerHTML = `
            <i class="${
              message.sender === "You" ? "fa-solid fa-circle-user" : "fa-solid fa-robot"
            }"></i>
            <div class="hero-chat-item-content">
              <h3>${message.sender} <span>${message.time}</span></h3>
              <p>${message.text}</p>
            </div>
          `;
    chatList.appendChild(chatItem);
    chatItem.classList.add("fade-in");
    chatList.scrollTop = chatList.scrollHeight;
  }
  
  // New function to load the entire conversation history
  function loadConversationHistory() {
    let delay = 0;
    for (let i = 0; i < scriptedMessages.length; i++) {
      setTimeout(() => {
        const currentTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        addMessage({
          sender: scriptedMessages[i].sender,
          time: currentTime,
          text: scriptedMessages[i].text,
        });
      }, delay);
      delay += 500; // Reduced delay for a faster feel
    }
    // Set the state to 1 after the initial conversation loads,
    // so the next message from the user is a response to the question.
    chatState = 1;
  }

  function submitMessage() {
    const userMessage = userInput.value.trim().toLowerCase();
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    // The chat widget is only active for the final response
    if (chatState === 1) {
      // Post the user's message
      addMessage({
        sender: "You",
        time: currentTime,
        text: userInput.value,
      });
      userInput.value = "";

      const positiveResponses = ["yes", "y", "sure", "ok", "of course", "please"];
      const negativeResponses = ["no", "n", "nope", "nah"];
      const isPositive = positiveResponses.some(response => userMessage.includes(response));
      const isNegative = negativeResponses.some(response => userMessage.includes(response));

      setTimeout(() => {
        if (isPositive) {
          addMessage({
            sender: "MemMachine Agent",
            time: currentTime,
            text: `Great! The best way to get started is with our comprehensive <a href="https://docs.memmachine.ai" target="_blank">documentation</a>. You can also <a href="https://discord.memmachine.ai" target="_blank">join our Discord server</a> to collaborate with other developers, or <a href="https://playground.memmachine.ai" target="_blank">try the Playground</a> to see a live demo.`,
          });
        } else if (isNegative) {
          addMessage({
            sender: "MemMachine Agent",
            time: currentTime,
            text: "No problem. If you change your mind, you can find our resources at any time in the navigation bar. We're here to help when you're ready!",
          });
        } else {
          addMessage({
            sender: "MemMachine Agent",
            time: currentTime,
            text: "That's a great question, but I'm not a full-fledged chat bot! If you're looking for more information, you can find our resources at any time in the navigation bar. We're here to help when you're ready!",
          });
        }
        chatState = 2; // End of the conversation flow
        disableChatInput();
        addRestartButton();
      }, 500); // Reduced delay
    } else {
      // Default message for any interaction after the conversation is over
      addMessage({
        sender: "You",
        time: currentTime,
        text: userInput.value,
      });
      userInput.value = "";

      setTimeout(() => {
        addMessage({
          sender: "MemMachine Agent",
          time: currentTime,
          text: "Thanks for visiting! Please use the links above to learn more about MemMachine."
        });
      }, 500); // Reduced delay
    }
  }

  function disableChatInput() {
    userInput.disabled = true;
    sendButton.style.display = "none";
    userInput.placeholder = "Chat is complete.";
  }
  
  function addRestartButton() {
    const restartButton = document.createElement("button");
    restartButton.id = "restartButton";
    restartButton.className = "hero-chat-input-btn";
    restartButton.innerHTML = `
      <i class="fa-solid fa-rotate-right"></i>
    `;
    restartButton.addEventListener("click", () => {
      chatList.innerHTML = ""; // Clear the chat messages
      loadConversationHistory();
      enableChatInput();
    });
    // Append the restart button to the chat input container
    chatInputContainer.appendChild(restartButton);
  }

  function enableChatInput() {
    userInput.disabled = false;
    sendButton.style.display = "block";
    userInput.placeholder = "Type your message";
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
      restartButton.remove();
    }
  }

  sendButton.addEventListener("click", () => {
    submitMessage();
  });

  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      submitMessage();
    }
  });

  // Start the conversation history when the page loads
  loadConversationHistory();
}






// Initialize Lenis for smooth scrolling
const lenis = new Lenis();

// Update Lenis on scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Percentage Bar
const percentageBar = document.querySelector(".percentage-bar");

function updateScrollPercentage() {
  if (percentageBar) {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const percentage =
      Math.floor((scrollTop / (documentHeight - windowHeight)) * 100) + "%";

    percentageBar.style.width = percentage;
  }
}
window.addEventListener("scroll", updateScrollPercentage);
window.addEventListener("load", updateScrollPercentage);

// Wait for the entire page to load before initializing AOS
window.addEventListener('load', () => {
  AOS.init({
    duration: 600,
    offset: 200,
    easing: 'ease-in-out',
    delay: 100,
    once: false,
    mirror: false,
    anchorPlacement: 'top-center',
  });
});
