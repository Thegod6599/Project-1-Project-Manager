async function checkAuth() {
  try {
    const welcome = document.getElementById('welcome')
    
    const response = await fetch('/auth/me',{
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      window.location.href = '/login';
      return;
    }
    const data = await response.json();
    console.log(data);
    welcome.innerHTML = `Welcome ${data.username}`
  
  } catch (err) {
    console.error('Error:', err);
  }
}

checkAuth()

async function logout() {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    const data = await response.json();
    if (response.ok) {
      window.location.href = '/login';
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}