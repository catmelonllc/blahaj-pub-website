document.addEventListener("DOMContentLoaded", function() {
  fetch('/navbar.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
    })
    .catch(error => console.error('Error fetching navbar:', error));
})
