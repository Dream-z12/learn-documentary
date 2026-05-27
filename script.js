// 设置你的考试目标日期
const examDate = new Date("2026-12-25T00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = examDate - now;

    // 计算天、小时、分钟
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const countdownElement = document.getElementById("countdown");
    
    if (distance < 0) {
        countdownElement.innerHTML = "考试已经结束啦！";
    } else {
        countdownElement.innerHTML = `距离考试还有 ${days} 天 ${hours} 小时`;
    }
}

// 每秒刷新一次倒计时
setInterval(updateCountdown, 1000);
updateCountdown(); // 首次加载执行一次
