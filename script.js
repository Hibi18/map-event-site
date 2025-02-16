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

    // メニューボタン、閉じるボタン、オーバーレイを取得
    const menuButton = document.getElementById('menu-button');
    const sideMenu = document.getElementById('side-menu');
    const closeButton = document.getElementById('close-button');
    const overlay = document.getElementById('overlay');

    if (menuButton && sideMenu && closeButton && overlay) {
      // メニューボタンを押したときの動作
      menuButton.addEventListener('click', () => {
        sideMenu.classList.add('open'); // メニューを開く
        overlay.classList.add('active'); // オーバーレイを表示
      });

      // 閉じるボタンを押したときの動作
      closeButton.addEventListener('click', () => {
        sideMenu.classList.remove('open'); // メニューを閉じる
        overlay.classList.remove('active'); // オーバーレイを非表示
      });

      // オーバーレイを押したときの動作
      overlay.addEventListener('click', () => {
        sideMenu.classList.remove('open'); // メニューを閉じる
        overlay.classList.remove('active'); // オーバーレイを非表示
      });
    }
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });

// Swiper.js の初期化
document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper-container', {
    loop: true, // 無限ループ
    autoplay: {
      delay: 3000, // 自動再生（3秒ごと）
    },
    pagination: {
      el: '.swiper-pagination', // ページネーション
      clickable: true, // ページネーションをクリック可能に
    },
  });
});

// =============================
// フィルター選択ボタンのクリックイベント（プルダウンを表示する）
// =============================
document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', function () {
    const filterId = this.nextElementSibling.id;
    toggleDropdown(filterId, this);
  });
});

// 指定されたプルダウンを開閉する関数
function toggleDropdown(filterId, button) {
  const dropdown = document.getElementById(filterId);

  // 他のドロップダウンを閉じる
  document.querySelectorAll('.filter-dropdown').forEach(el => {
    if (el !== dropdown) el.style.display = 'none';
  });

  // 開閉処理
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';

  // 選択肢クリック時にボタンのテキストを更新
  dropdown.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', function () {
      const selectedValue = item.getAttribute('data-value');
      if (selectedValue === "reset") {
        resetFilter(button); // 選択を解除
      } else {
        button.querySelector('.selected-option').textContent = item.textContent;
      }
      dropdown.style.display = 'none';
    });
  });
}

// =============================
// 選択を解除する関数
// =============================
function resetFilter(button) {
  if (button.id === "location-button") {
    button.querySelector('.selected-option').textContent = "都道府県から選ぶ";
  } else if (button.id === "season-button") {
    button.querySelector('.selected-option').textContent = "季節から選ぶ";
  } else if (button.id === "theme-button") {
    button.querySelector('.selected-option').textContent = "テーマから選ぶ";
  }
}

// =============================
// 検索ボタンの処理
// =============================
document.getElementById('search-button').addEventListener('click', function () {
  const selectedLocation = document.getElementById('location-button').querySelector('.selected-option').textContent;
  const selectedSeason = document.getElementById('season-button').querySelector('.selected-option').textContent;
  const selectedTheme = document.getElementById('theme-button').querySelector('.selected-option').textContent;

  const filters = { location: selectedLocation, season: selectedSeason, theme: selectedTheme };
  fetchPlans(filters);
});

// =============================
// 旅行プランデータ
// =============================
const plans = [
  { name: "広島旅行", url: "page1.html", location: "広島", season: "夏", theme: "歴史" },
  { name: "栃木旅行", url: "page2.html", location: "栃木", season: "秋", theme: "自然" },
  { name: "東京旅行", url: "page3.html", location: "東京", season: "冬", theme: "グルメ" },
  { name: "京都旅行", url: "page4.html", location: "京都", season: "春", theme: "自然" }
];

// =============================
// フィルター検索処理
// =============================
function fetchPlans(filters) {
  const filteredPlans = plans.filter(plan =>
    (filters.location === "都道府県から選ぶ" || plan.location === filters.location) &&
    (filters.season === "季節から選ぶ" || plan.season === filters.season) &&
    (filters.theme === "テーマから選ぶ" || plan.theme === filters.theme)
  );

  displayPlans(filteredPlans);
}

// =============================
// 絞り込まれたプランを表示
// =============================
function displayPlans(filteredPlans) {
  const searchResults = document.getElementById('search-results');
  const planList = document.getElementById('plan-list');

  planList.innerHTML = ""; // 既存のプランをクリア
  searchResults.classList.remove('hidden'); // 検索結果を表示

  if (filteredPlans.length > 0) {
    filteredPlans.forEach(plan => {
      const planElement = document.createElement('div');
      planElement.className = 'plan';
      planElement.innerHTML = `
        <a href="${plan.url}">
          <h2>${plan.name}</h2>
          <p>都道府県: ${plan.location || ''} / 季節: ${plan.season || ''} / テーマ: ${plan.theme || ''}</p>
        </a>
      `;
      planList.appendChild(planElement);
    });
  } else {
    planList.innerHTML = "<p>該当するプランが見つかりませんでした。</p>";
  }
}


