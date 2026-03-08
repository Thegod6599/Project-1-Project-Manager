async function loadUserInfo() {
  try {
    const response = await fetch('/auth/me', {
      method: 'GET',
      credentials: 'include'
    });

    const userInfoDiv = document.getElementById('userInfo');

    if (response.ok) {
      const user = await response.json();
      userInfoDiv.innerHTML = `
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
      `;
    } else {
      userInfoDiv.innerHTML = '<p class="error">Failed to load user information. Please <a href="/login">login</a> again.</p>';
    }
  } catch (err) {
    console.error('Error loading user info:', err);
    document.getElementById('userInfo').innerHTML = '<p class="error">Error loading user information.</p>';
  }
}

function logout() {
  fetch('/auth/logout', {
    method: 'POST',
    credentials: 'include'
  }).then(() => {
    window.location.href = '/';
  }).catch(err => {
    console.error('Error logging out:', err);
    alert('Error logging out');
  });
}

loadUserInfo();
