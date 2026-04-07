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
    showErrorMessage('Project Name and Deadline are required', 'errorMessageEdit')
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
      projectIdToEdit = null
      loadProjects()
      hideErrorMessage('errorMessageEdit')
      closeEditProjectForm()
    }
  } catch (err) {
    console.error('Error:', err)
    showErrorMessage('An error occurred. Please try again.', 'errorMessageEdit')
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
      hideErrorMessage('errorMessageDelete')
      closeDeleteProjectForm()
    } else {
      showErrorMessage(data.message, 'errorMessageDelete')
    }
  } catch (err) {
    console.error('Error:', err);
    showErrorMessage('An error occurred. Please try again.', 'errorMessageDelete')
  }
})


function showErrorMessage(message, elementId) {
  const errorMessage = document.getElementById(elementId);
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}
function hideErrorMessage(elementId) {
  const errorMessage = document.getElementById(elementId);
  errorMessage.textContent = ''
  errorMessage.classList.add('hidden');
}


function openProjectPopup(project) {
  const projectPopup = document.getElementById('projectPopup')
  const projectNamePopup = document.getElementById('projectNamePopup')
  const projectDescriptionPopup = document.getElementById('projectDescriptionPopup')
  const projectDeadlinePopup = document.getElementById('projectDeadlinePopup')

  projectNamePopup.textContent = project.projectName
  projectDescriptionPopup.textContent = project.projectDescription
  projectDeadlinePopup.textContent = new Date(project.deadline).toISOString().split('T')[0];
  
  projectPopup.classList.remove('hidden')
}
function closeProjectPopup() {
  const projectPopup = document.getElementById('projectPopup')
  const projectNamePopup = document.getElementById('projectNamePopup')
  const projectDescriptionPopup = document.getElementById('projectDescriptionPopup')
  const projectDeadlinePopup = document.getElementById('projectDeadlinePopup')

  projectNamePopup.textContent = ''
  projectDescriptionPopup.textContent = ''
  projectDeadlinePopup.textContent = ''
  
  projectPopup.classList.add('hidden')
}

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
        const buttonGroup = document.createElement('div')


        nameSpan.classList.add('projectName')
        editButton.classList.add('editButton')
        deleteButton.classList.add('deleteButton')
        editButton.textContent = 'Edit'
        editButton.addEventListener('click', () => openEditProjectForm(project._id))
        nameSpan.textContent = project.projectName
        nameSpan.addEventListener('click', () => openProjectPopup(project))
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => openDeleteProjectForm(project._id));

        buttonGroup.classList.add('buttonGroup')
        buttonGroup.appendChild(editButton)
        buttonGroup.appendChild(deleteButton)
        
        li.appendChild(nameSpan)
        li.appendChild(buttonGroup);
        projectsList.appendChild(li);
        
        hideErrorMessage('errorMessageLoad')
      });
    } else {
      showErrorMessage(data.message, 'errorMessageLoad');
    }
  } catch (err) {
    console.error('Error:', err);
    showErrorMessage('An error occurred. Please try again.', 'errorMessageLoad')
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
    showErrorMessage('Project Name and Deadline are required', 'errorMessageCreate');
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
        hideErrorMessage('errorMessageCreate')
      } else {
        showErrorMessage(data.message, 'errorMessageCreate')
      }
  } catch (err) {
    console.error('Error:', err);
    showErrorMessage('An error occurred. Please try again.', 'errorMessageCreate')
  }
});