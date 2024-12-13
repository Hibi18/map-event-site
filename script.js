// header.html を動的に読み込むスクリプト
fetch('header.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch header.html');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('header-container').innerHTML = data;

    // メニューボタンのスクリプトをここで設定
    const menuButton = document.getElementById('menu-button');
    const sideMenu = document.getElementById('side-menu');

    if (menuButton && sideMenu) {
      menuButton.addEventListener('click', () => {
        sideMenu.classList.toggle('open'); // メニューの開閉
      });
    }
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });
