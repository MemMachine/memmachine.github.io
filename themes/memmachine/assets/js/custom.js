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

const chatList = document.getElementById("chatList");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// Check if chatList exists before proceeding
if (chatList) {
  const messages = [
    {
      sender: "You",
      time: "1:17 PM",
      text: "What are your thoughts on the latest AI chip manufacturer earnings reports that came out this week?",
    },
    {
      sender: "MemMachine Agent",
      time: "1:17 PM",
      text: "The reports show strong growth, particularly in the data center segment. However, I recall you mentioned last month that you're looking to decrease your exposure to hardware manufacturers and focus more on AI software and platform companies. Do you want me to filter these insights based on that strategy?",
    },
    {
      sender: "You",
      time: "1:18 PM",
      text: "Wow, good memory. Yes, please. Focus on the implications for software companies.",
    },
    {
      sender: "MemMachine Agent",
      time: "1:18 PM",
      text: "Understood. The strong hardware sales signal a surge in demand for advanced AI models, which is a bullish indicator for AI platform companies that leverage this new hardware.",
    },
  ];

  // Function to add initial messages to the chat
  function loadInitialMessages() {
    messages.forEach((message) => addMessage(message));
  }

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
    chatItem.classList.add("fade-in"); // Add fade-in class for animation
    chatList.scrollTop = chatList.scrollHeight; // Scroll to the bottom
  }

  // Load initial messages on page load
  loadInitialMessages();

  sendButton.addEventListener("click", () => {
    submitMessage();
  });

  // Allow submitting message with Enter key
  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      submitMessage();
    }
  });

  function submitMessage() {
    const userMessage = userInput.value;
    if (userMessage) {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      addMessage({
        sender: "You",
        time: currentTime,
        text: userMessage,
      });
      userInput.value = ""; // Clear input

      // Simulate the agent response
      setTimeout(() => {
        addMessage({
          sender: "MemMachine Agent",
          time: currentTime,
          text: "Free quote limit reached. Please upgrade for unlimited access.",
        });
      }, 500); // Delay for agent response
    }
  }
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
