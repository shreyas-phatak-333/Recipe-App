document.addEventListener('DOMContentLoaded', function() {
    // Signup form submission
    document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      const response = await fetch(`http://localhost:5000/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
  
      if (response.ok) {
        alert('Signup successful');
        window.location.href = 'signin.html';
      } else {
        alert('Signup failed');
      }
    });
  
    // Signin form submission
    document.getElementById('signinForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('signinEmail').value;
      const password = document.getElementById('signinPassword').value;
      
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem('authToken', data.token); // Store token
        localStorage.setItem('userId', data.user._id);
        window.location.href = 'index.html';
      } else {
        alert('Signin failed');
      }
    });
  
    // Logout functionality
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = 'signin.html';
    });
  });
  