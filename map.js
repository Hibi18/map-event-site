var mapContainer = document.createElement('div');
mapContainer.id = 'map';
document.body.appendChild(mapContainer);

// banner
var banner = document.createElement('div');
banner.id = 'banner';
banner.className = 'hidden';
banner.innerHTML = '<p id="banner-content"></p>';
document.body.appendChild(banner);

// leaflet
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
document.head.appendChild(link);

// map.css
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'map.css';
document.head.appendChild(link);

// leaflet
var script = document.createElement('script');
script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
script.onload = function() {

  // マップの初期状態
  var map = L.map('map').setView([35.682839, 139.759455], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // マーカーの設定
  var markers = [
    {
      position: [35.71366835962503, 139.77613130188482],
      content: '上野駅',
      content_detail: '上野駅は東京都台東区にある駅です。',
      suggestion: [
        '上野駅の最寄りの避難所は確認しましたか？',
        '備蓄品のチェックをしましたか？'
      ],
    },
    {
      position: [35.612805966761215, 140.11372769961613],
      content: '千葉駅',
      content_detail: '千葉駅は、千葉県千葉市中央区新千葉一丁目にあります。',
      suggestion: [
        '千葉駅の消火器などの防災設備を探してみましょう。',
        '近くの防災公園の位置を確認しましょう'
      ],
    }
  ];

  // マーカーの追加とポップアップ設定
  markers.forEach(marker => {
    const encodedSuggestion = encodeURIComponent(JSON.stringify(marker.suggestion));

    const popupContent = `
      <div>
        <h3>${marker.content}</h3>
        <p>${marker.content_detail}</p>
        <button onclick="handleCheckIn('${marker.content}', '${encodedSuggestion}')">チェックイン</button>
      </div>
    `;

    const mapMarker = L.marker(marker.position).addTo(map)
      .bindPopup(popupContent);
  });
};
document.head.appendChild(script);

// 「チェックイン」ボタンの動作
function handleCheckIn(placeName, encodedSuggestion) {
    const suggestion = JSON.parse(decodeURIComponent(encodedSuggestion));
    console.log('Check-in:', placeName, suggestion); // デバッグ用

    // 同心円アニメーションを作成
    const overlay = document.createElement('div');
    overlay.className = 'circle-overlay';
    document.body.appendChild(overlay);

    // 中心をピンの座標に合わせて計算
    const mapCenter = document.getElementById('map').getBoundingClientRect();
    const mapWidth = mapCenter.width;
    const mapHeight = mapCenter.height;
    const circleX = mapCenter.left + mapWidth / 2; // 中心のX座標
    const circleY = mapCenter.top + mapHeight / 2; // 中心のY座標

    overlay.style.left = `${circleX}px`;
    overlay.style.top = `${circleY}px`;

    // メッセージ表示の準備
    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';

    // 提案リストを生成
    const suggestionsHTML = suggestion
        .map((item, index) => `
            <div>
                <label>
                    <input type="checkbox" class="suggestion-checkbox" data-index="${index}">
                    ${item}
                </label>
            </div>
        `)
        .join('');

    // メッセージボックスの内容
    messageBox.innerHTML = `
        <h2>${placeName} で防災チェックイン</h2>
        ${suggestionsHTML}
        <button onclick="closeCheckIn()">閉じる</button>
        <button id="completeButton" style="display: none;" onclick="completeCheckIn('${placeName}')">完了</button>
    `;
    document.body.appendChild(messageBox);

    // アニメーション開始後1秒でメッセージを表示
    setTimeout(() => {
        messageBox.style.display = 'block'; // メッセージを表示
    }, 1000); // 1秒後

    // チェックボックスの状態を監視
    const checkboxes = document.querySelectorAll('.suggestion-checkbox');
    const completeButton = document.getElementById('completeButton');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            completeButton.style.display = allChecked ? 'inline-block' : 'none';
        });
    });
}

// バッジ状態を保存・取得
function saveBadge(placeName) {
    const badges = JSON.parse(localStorage.getItem('badges')) || [];
    if (!badges.includes(placeName)) {
        badges.push(placeName);
        localStorage.setItem('badges', JSON.stringify(badges));
    }
}

function getBadges() {
    return JSON.parse(localStorage.getItem('badges')) || [];
}

function displayBadges() {
    const badgeContainer = document.getElementById('badge-container');
    badgeContainer.innerHTML = ''; // 一度クリア
    const badges = getBadges();

    badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge';
        badgeElement.textContent = badge;
        badgeContainer.appendChild(badgeElement);
    });
}

// 初回ロード時にバッジを表示
document.addEventListener('DOMContentLoaded', () => {
    const badgeContainer = document.createElement('div');
    badgeContainer.id = 'badge-container';
    badgeContainer.style.display = 'flex';
    badgeContainer.style.flexWrap = 'wrap';
    badgeContainer.style.margin = '10px';
    document.body.appendChild(badgeContainer);

    displayBadges(); // 既存バッジを表示
});

function closeCheckIn() {
    // チェックイン画面を閉じる
    document.querySelector('.circle-overlay').remove();
    document.querySelector('.message-box').remove();
}

function completeCheckIn(placeName) {
    // 特別な演出
    const overlay = document.querySelector('.circle-overlay');
    overlay.style.transition = 'opacity 1s ease-out';
    overlay.style.opacity = '0'; // フェードアウト

    setTimeout(() => {
        overlay.remove();
        document.querySelector('.message-box').remove();

        // バッジ保存と表示
        saveBadge(placeName);
        displayBadges();

        alert(`おめでとうございます！「${placeName}」のバッジを獲得しました！`);
    }, 1000); // 1秒後に削除
}
