// header.html を読み込んで挿入
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;
  })
  .catch(error => console.error('Error loading header:', error));
