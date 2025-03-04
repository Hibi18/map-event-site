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
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });

document.addEventListener("DOMContentLoaded", function() {
  console.log("✅ schedule.js: IntersectionObserver 初期化開始");

  const fadeSections = document.querySelectorAll(".fade-in-section");

  console.log(`fade-in-section の数: ${fadeSections.length}`);

  if (fadeSections.length === 0) {
    console.warn("⚠ `fade-in-section` が見つかりません。HTML の読み込み順を確認してください。");
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(`アニメーション開始: ${entry.target.id}`);
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0 });

  fadeSections.forEach(section => observer.observe(section));

  // 最初から表示されている要素に `.show` を適用
  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
  }

  fadeSections.forEach(section => {
    if (isVisible(section)) {
      console.log(`最初から表示されているため、アニメーション適用: ${section.id}`);
      section.classList.add("show");
    }
  });
});
