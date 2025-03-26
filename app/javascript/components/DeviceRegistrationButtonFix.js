// Direct button handlers for device registration
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the account already exists page
  function checkForButtons() {
    const accountExistsElement = document.querySelector('h1');
    if (accountExistsElement && accountExistsElement.textContent.includes("Account Already Exists")) {
      console.log("Found Account Already Exists page - initializing direct button handlers");
      
      // Wait a short moment for the buttons to be fully rendered
      setTimeout(attachDirectHandlers, 200);
    }
  }
  
  function attachDirectHandlers() {
    const yesButton = document.querySelector('#yes-account-btn');
    const noButton = document.querySelector('#no-account-btn');
    
    if (yesButton) {
      console.log("Found YES button - attaching direct handler");
      
      // Clone the button to remove all existing listeners
      const newYesButton = yesButton.cloneNode(true);
      yesButton.parentNode.replaceChild(newYesButton, yesButton);
      
      // Add our direct handler
      newYesButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("YES button clicked - sending device registration request");
        
        // Show loading state
        newYesButton.innerHTML = '<div class="flex items-center justify-center"><div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div><span>Processing...</span></div>';
        newYesButton.disabled = true;
        
        // Get CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        // Get handle from page text
        let identifier = '';
        const paragraphText = document.querySelector('.text-center p')?.textContent || '';
        const handleMatch = paragraphText.match(/@[\w]+/);
        const phoneMatch = paragraphText.match(/phone number/i);
        
        if (handleMatch) {
          identifier = handleMatch[0];
        } else if (phoneMatch && sessionStorage.getItem('current_phone')) {
          identifier = sessionStorage.getItem('current_phone');
        } else {
          identifier = sessionStorage.getItem('current_handle') || '';
        }
        
        console.log("Using identifier for device registration:", identifier);
        
        // Send direct fetch request
        fetch('/api/v1/verify_login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
            'Accept': 'application/json',
            'X-Device-Key': sessionStorage.getItem('device_key') || ''
          },
          body: JSON.stringify({
            identifier: identifier,
            device_registration: true,
            auth: {
              identifier: identifier,
              device_registration: true
            }
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log("Device registration response:", data);
          if (data.status === 'verification_needed') {
            // Store data for verification page
            sessionStorage.setItem('current_handle', data.handle);
            sessionStorage.setItem('verification_in_progress', 'true');
            if (data.masked_phone) {
              sessionStorage.setItem('masked_phone', data.masked_phone);
            }
            
            // Go to verification
            window.location.reload();
          } else {
            alert('Error: ' + (data.message || 'Unknown error'));
            newYesButton.innerHTML = 'Yes, this is my account';
            newYesButton.disabled = false;
          }
        })
        .catch(error => {
          console.error("Device registration error:", error);
          alert('Network error, please try again');
          newYesButton.innerHTML = 'Yes, this is my account';
          newYesButton.disabled = false;
        });
      }, true);
    }
    
    if (noButton) {
      console.log("Found NO button - attaching direct handler");
      
      // Clone the button to remove all existing listeners
      const newNoButton = noButton.cloneNode(true);
      noButton.parentNode.replaceChild(newNoButton, noButton);
      
      // Add our direct handler
      newNoButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("NO button clicked - returning to login options");
        
        // Clear any pending device info
        sessionStorage.removeItem('pending_handle');
        sessionStorage.removeItem('verification_in_progress');
        
        // Go back to login options
        window.location.href = '/';
      }, true);
    }
  }
  
  // First check when DOM is loaded
  checkForButtons();
  
  // Also check periodically because React might render after DOMContentLoaded
  const checkInterval = setInterval(function() {
    checkForButtons();
  }, 500);
  
  // Stop checking after 10 seconds
  setTimeout(function() {
    clearInterval(checkInterval);
  }, 10000);
});
