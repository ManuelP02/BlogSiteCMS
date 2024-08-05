
//Create a post
document.addEventListener('DOMContentLoaded', function() {
    const createPostForm = document.getElementById('create-post-form');
    const errorMessage = document.getElementById('error-message');

    if (createPostForm) {
        createPostForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const title = document.getElementById('post-title').value.trim();
            const description = document.getElementById('post-description').value.trim();

            try {
                console.log('Sending post data:', { title, description });

                const response = await fetch('/dashboard', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, description }),
                });

                const data = await response.json();
                console.log('Server response:', data);

                if (response.ok) {
                    alert(data.message); 
                    window.location.href = '/dashboard'; 
                } else {
                    throw new Error(data.message || 'Failed to create post');
                }
            } catch (error) {
                console.error('Error:', error);
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('d-none');
            }
        });
    } else {
        console.error('Create post form not found');
    }
});


document.addEventListener('DOMContentLoaded', function() {


    const deleteButtons = document.querySelectorAll('.delete-post');
    deleteButtons.forEach(button => {
        console.log('Registering delete button:', button);
        button.addEventListener('click', handleDeletePost);
    });

    const editButtons = document.querySelectorAll('.edit-post-btn');
    editButtons.forEach(button => {

        button.addEventListener('click', toggleEditForm);
    });

    const editForms = document.querySelectorAll('.edit-post-form');
    editForms.forEach(form => {
        form.addEventListener('submit', handleEditPost);
    });

    const cancelEditButtons = document.querySelectorAll('.cancel-edit');
    cancelEditButtons.forEach(button => {
        console.log('Registering cancel edit button:', button);
        button.addEventListener('click', toggleEditForm);
    });
});

function toggleEditForm(e) {
    e.preventDefault();
    const postId = e.target.getAttribute('data-post-id');
    const card = e.target.closest('.card');
    const cardBody = card.querySelector('.card-body');
    const editForm = cardBody.querySelector('.edit-post-form');
    const cardTitle = card.querySelector('.card-title');
    const cardText = cardBody.querySelector('.card-text');

    if (editForm.style.display === 'none' || editForm.style.display === '') {
        editForm.style.display = 'block';
        cardTitle.style.display = 'none';
        cardText.style.display = 'none';
        card.querySelector('.edit-post-btn').style.display = 'none';
    } else {
        editForm.style.display = 'none';
        cardTitle.style.display = 'block';
        cardText.style.display = 'block';
        card.querySelector('.edit-post-btn').style.display = 'inline-block'; 
    }
}

async function handleEditPost(e) {
    e.preventDefault();
    const form = e.target;
    const postId = form.getAttribute('data-post-id');
    const title = form.querySelector('.post-title').value;
    const description = form.querySelector('.post-content').value;

    try {
        const response = await fetch('/dashboard/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ postId, title, description }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to edit post');
        }

        console.log('Post edited successfully');
        
        // Update the post content in the DOM
        const card = form.closest('.card');
        card.querySelector('.card-title').textContent = title;
        card.querySelector('.card-text').textContent = description;
        
        // Hide the edit form and show the updated content
        toggleEditForm({ target: form.querySelector('.cancel-edit'), preventDefault: () => {} });

    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to edit post. Please try again.');
    }
}

async function handleDeletePost(e) {
    e.preventDefault();
    console.log('Handle delete post triggered');
    if (!confirm('Are you sure you want to delete this post?')) return;

    const postId = e.target.getAttribute('data-post-id');

    try {
        const response = await fetch('/dashboard/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ postId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete post');
        }

        console.log('Post deleted successfully');
        e.target.closest('.card').remove();

    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to delete post. Please try again.');
    }
}


