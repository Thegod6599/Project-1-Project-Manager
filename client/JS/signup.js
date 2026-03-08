document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    const data = await response.json();
    if (response.ok) {
      usernameInput.value = '';
      passwordInput.value = '';
      window.location.href = '/home';
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('An error occurred. Please try again.');
  }
});