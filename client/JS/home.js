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

const todayString = new Date().toISOString().split('T')[0];
document.getElementById('projectDueDate').setAttribute('min', todayString);
document.getElementById('editProjectDueDate').setAttribute('min', todayString);

let projectIdToEdit = null
function openEditProjectForm(projectId) {
  projectIdToEdit = projectId
  const editDisplay = document.getElementById('editProjectForm')
  editDisplay.classList.remove('hidden')
}
function closeEditProjectForm() {
  const editDisplay = document.getElementById('editProjectForm')
  editDisplay.classList.add('hidden')
}

document.getElementById('editProjectFormElement').addEventListener('submit', async (event) => {
  event.preventDefault()
  const projectName = document.getElementById('editProjectName').value
  const projectDescription = document.getElementById('editProjectDescription').value
  const projectDeadline = document.getElementById('editProjectDueDate').value

  if (!projectName || !projectDeadline) {
    alert('Project Name and Deadline are required')
    return
  }

  try {
    const response = await fetch(`/projects/${projectIdToEdit}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectName, projectDescription, projectDeadline }),
      credentials: 'include'
    })
    const data = await response.json();
    if (response.ok) {
      alert('Project updated successfully!')
      projectIdToEdit = null
      loadProjects()
      closeEditProjectForm()
    }
  } catch (err) {
    console.error('Error:', err)
  }
})

let projectIdToDelete = null
function openDeleteProjectForm(projectId) {
  projectIdToDelete = projectId
  const deleteDisplay = document.getElementById('deleteProjectForm')
  deleteDisplay.classList.remove('hidden')
}
function closeDeleteProjectForm() {
  const deleteDisplay = document.getElementById('deleteProjectForm')
  deleteDisplay.classList.add('hidden')
}
document.getElementById('confirmDelete').addEventListener('click', async () => {
  if (!projectIdToDelete) {return}

  try {
    const response = await fetch(`/projects/${projectIdToDelete}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    const data = await response.json();
    
    if (response.ok) {
      alert('Project deleted successfully!')
      projectIdToDelete = null
      loadProjects()
      closeDeleteProjectForm()
    } else {
      alert(data.message)
    }
  } catch (err) {
    console.error('Error:', err);
  }
})

async function loadProjects() {
  const projectsList = document.getElementById('projectsList');
  try {
    const response = await fetch('/projects', {
      method: 'GET',
      credentials: 'include'
    })
    const data = await response.json();

    if (response.ok) {
      const projects = data.projects;
      projectsList.innerHTML = ''
      projects.forEach(project => {
        const li = document.createElement('li');
        const deleteButton = document.createElement('button');
        const nameSpan = document.createElement('span');
        const editButton = document.createElement('button')
        editButton.textContent = 'Edit'
        editButton.addEventListener('click', () => openEditProjectForm(project._id))
        nameSpan.textContent = project.projectName
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => openDeleteProjectForm(project._id));
        li.appendChild(nameSpan)
        li.appendChild(document.createTextNode(' '))
        li.appendChild(deleteButton);
        li.appendChild(document.createTextNode(' '))
        li.appendChild(editButton)
        projectsList.appendChild(li);
      });
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
loadProjects()

function displayProjectCreationForm() {
  const projectCreationForm = document.getElementById('projectCreationForm');
  projectCreationForm.classList.remove('hidden')
}
function closeProjectCreationForm() {
  const projectCreationForm = document.getElementById('projectCreationForm');
  projectCreationForm.classList.add('hidden')
}

document.getElementById('createProjectForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const projectName = document.getElementById('projectName').value;
  const projectDescription = document.getElementById('projectDescription').value;
  const projectDeadline = document.getElementById('projectDueDate').value;

  if (!projectName || !projectDeadline) {
    alert('Project Name and Deadline are required');
    return;
  }
  
  try {
    const response = await fetch('/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectName, projectDescription, projectDeadline }),
      credentials: 'include'
    })
      const data = await response.json();
      if (response.ok) {
        alert('Project created successfully!')
        loadProjects()
        closeProjectCreationForm()
        document.getElementById('createProjectForm').reset();
      } else {
        alert(data.message)
      }
  } catch (err) {
    console.error('Error:', err);
  }
});