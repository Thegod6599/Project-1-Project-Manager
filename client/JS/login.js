const errorMessage = document.getElementById('errorMessage')
function showError(message) {
  errorMessage.textContent = message
  errorMessage.classList.remove('hidden')
}
function hideError() {
  errorMessage.classList.add('hidden')
  errorMessage.textContent = ''
}



document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password) {
      showError('Please enter both username and password.');
      return;
    }

    const response = await fetch('/auth/login', {
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
      hideError()
    } else {
      showError(data.message);
    }
  } catch (err) {
    console.error('Error:', err);
    showError('An error occurred. Please try again.');
  }
});