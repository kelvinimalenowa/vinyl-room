console.log('Vinyl Room JavaScript loaded');
document.querySelectorAll('form[action*="/upvote"]').forEach(form => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = form.querySelector('.card-upvote-btn');
    if (!button || button.disabled) return;

    button.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      if (!response.ok) {
        throw new Error('Could not update upvote');
      }

      const data = await response.json();

      button.querySelector('.upvote-count').textContent = data.upvotes;
      button.classList.toggle('upvoted', data.upvoted);
      button.setAttribute(
        'aria-pressed',
        String(data.upvoted)
      );
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      button.disabled = false;
    }
  });
});
