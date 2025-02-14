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

// フィルター選択ボタンのクリックイベント（プルダウンを表示する）

document.getElementById('location-button').addEventListener('click', function () {
  toggleDropdown('location-filter');
});

document.getElementById('season-button').addEventListener('click', function () {
  toggleDropdown('season-filter');
});

document.getElementById('theme-button').addEventListener('click', function () {
  toggleDropdown('theme-filter');
});

// 指定されたプルダウンを開閉する関数
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  
  // 他のプルダウンを閉じる
  document.querySelectorAll('.filter-dropdown').forEach(el => {
    if (el.id !== dropdownId) {
      el.style.display = 'none';
    }
  });

  // 現在のプルダウンを開閉
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// プルダウンで選択されたときにフィルタリングを実行

// 都道府県の選択
document.getElementById('location-filter').addEventListener('change', function() {
  const selectedLocation = this.value; // 選択された都道府県
  if (selectedLocation) {
    fetchPlansByLocation(selectedLocation); // 絞り込み関数を実行
  }
  this.style.display = 'none'; // 選択後にプルダウンを閉じる
});

// 季節の選択
document.getElementById('season-filter').addEventListener('change', function() {
  const selectedSeason = this.value; // 選択された季節
  if (selectedSeason) {
    fetchPlansBySeason(selectedSeason); // 絞り込み関数を実行
  }
  this.style.display = 'none'; // 選択後にプルダウンを閉じる
});

// 旅行プランデータ

const plans = [
  { name: "広島旅行プラン", url: "page1.html", location: "広島", season: "夏" },
  { name: "栃木旅行プラン", url: "page2.html", location: "栃木", season: "秋" },
  { name: "東京旅行プラン", url: "page3.html", location: "東京", season: "冬" },
  { name: "京都旅行プラン", url: "page4.html", location: "春", season: "京都" }
];

// フィルタリング関数

// 都道府県で絞り込む
function fetchPlansByLocation(location) {
  const filteredPlans = plans.filter(plan => plan.location === location);
  displayPlans(filteredPlans);
}

// 季節で絞り込む
function fetchPlansBySeason(season) {
  const filteredPlans = plans.filter(plan => plan.season === season);
  displayPlans(filteredPlans);
}

// 絞り込まれたプランを表示する

function displayPlans(filteredPlans) {
  const planContainer = document.querySelector('.plan-container');
  planContainer.innerHTML = ""; // 既存のコンテンツをクリア

  if (filteredPlans.length > 0) {
    filteredPlans.forEach(plan => {
      const planElement = document.createElement('div');
      planElement.className = 'plan';
      planElement.innerHTML = `
        <a href="${plan.url}">
          <h2>${plan.name}</h2>
          <p>都道府県: ${plan.location || ''} / 季節: ${plan.season || ''}</p>
        </a>
      `;
      planContainer.appendChild(planElement);
    });
  } else {
    planContainer.innerHTML = "<p>該当するプランが見つかりませんでした。</p>";
  }
}

