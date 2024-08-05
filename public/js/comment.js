document.addEventListener('DOMContentLoaded', function() {
  const commentForms = document.querySelectorAll('.comment-form');
  commentForms.forEach(form => {
      form.addEventListener('submit', handleCommentSubmission);
  });
});
//Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  });
}

async function handleCommentSubmission(e) {
  e.preventDefault();
  const form = e.target;
  const postId = form.getAttribute('data-post-id');
  const commentText = form.querySelector('.comment-text').value;
  
  console.log('Attempting to submit comment:', { postId, commentText });

  try {
      const response = await fetch('/home', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ postId, commentText }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit comment');
      }

      const newComment = await response.json();
      console.log('Comment submitted successfully:', newComment);
      
      // Add the new comment to the DOM
      addCommentToDOM(postId, newComment);
      
      // Clear the comment input
      form.querySelector('.comment-text').value = '';

  } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to submit comment. Please try again.');
  }
}

function addCommentToDOM(postId, comment) {
  const commentSection = document.getElementById(`comments-${postId}`);
  if (commentSection) {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment mb-2';
      
      const formattedDate = formatDate(comment.createdAt);
      
      commentElement.innerHTML = `
          ${comment.content} -By  <strong>${comment.user.username}:</strong> - <strong>On</strong> ${formattedDate}
      `;
      
      commentSection.insertBefore(commentElement, commentSection.firstChild);
  }
}