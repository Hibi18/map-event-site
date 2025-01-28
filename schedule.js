function openTab(event, tabId) {
  // すべてのタブ内容を非表示にする
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => content.classList.remove('active'));

  // すべてのタブリンクを非アクティブにする
  const tabLinks = document.querySelectorAll('.tab-link');
  tabLinks.forEach(link => link.classList.remove('active'));

  // クリックされたタブ内容を表示
  document.getElementById(tabId).classList.add('active');

  // クリックされたタブリンクをアクティブにする
  event.currentTarget.classList.add('active');
}

