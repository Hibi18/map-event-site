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

// フィルター選択ボタンのクリックイベント
document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', event => {
    const filterType = event.currentTarget.textContent.trim(); // ボタンのテキストを取得

    if (filterType === "都道府県から選ぶ") {
      // 都道府県を指定するダイアログ（例: プロンプトで入力を受け付ける）
      const location = prompt("都道府県を入力してください (例: 東京, 北海道):");

      if (location) {
        fetchPlansByLocation(location); // 都道府県で絞り込む
      }
    } else if (filterType === "季節から選ぶ") {
      const season = prompt("季節を入力してください (例: 8月, 12月):");

      if (season) {
        fetchPlansBySeason(season); // 季節で絞り込む
      }
    }
  });
});

// 都道府県で絞り込む関数
function fetchPlansByLocation(location) {
  const plans = [
    { name: "沖縄旅行プラン", url: "page1.html", location: "沖縄" },
    { name: "北海道旅行プラン", url: "page2.html", location: "北海道" },
    { name: "東京旅行プラン", url: "page3.html", location: "東京" }
  ];

  // 一致するプランをフィルタリング
  const filteredPlans = plans.filter(plan => plan.location === location);

  // 一致するプランを表示
  displayPlans(filteredPlans);
}

// 季節で絞り込む関数
function fetchPlansBySeason(season) {
  const plans = [
    { name: "沖縄旅行プラン", url: "page1.html", season: "8月" },
    { name: "北海道旅行プラン", url: "page2.html", season: "12月" },
    { name: "東京旅行プラン", url: "page3.html", season: "7月" }
  ];

  const filteredPlans = plans.filter(plan => plan.season === season);

  displayPlans(filteredPlans);
}

// フィルタリング結果を表示する関数
function displayPlans(filteredPlans) {
  const planContainer = document.querySelector('.plan-container');
  planContainer.innerHTML = ""; // 既存コンテンツをクリア

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
