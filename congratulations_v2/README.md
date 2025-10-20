# Congratulations V2 - Phiên bản nâng cấp 💖✨

Phiên bản nâng cấp của trang web chúc mừng với **hiệu ứng trái tim particle mới** được tích hợp từ test/3_heart_beat_and_letter.html.

## 🎯 Điểm nổi bật

### ⭐ Hiệu ứng trái tim mới (Nâng cấp chính)

- **Trái tim đập (Heart Beat)**: Trái tim lớn ở giữa màn hình với hiệu ứng đập theo nhịp (1.3s)
- **Particle Hearts**: Hàng nghìn hạt trái tim bay ra từ trung tâm theo công thức toán học
- **Hiệu ứng vật lý**: Particle có velocity, acceleration và fade out tự nhiên
- **Tối ưu mobile**: Tự động giảm số lượng particle (2000 → 1000) trên mobile

### 🎨 Giữ nguyên các hiệu ứng khác

- ✨ Particles background (80 particles, giảm xuống 30 trên mobile)
- 🎆 Fireworks system (60 particles mỗi lần nổ, giảm xuống 30 trên mobile)
- 🌸 Flowers animation (bay từ 4 cạnh màn hình)
- 🦋 Butterflies animation (8 pattern chuyển động)
- ✨ Sparkles effect
- 🌈 Gradient background động
- 💡 Light rays pulsing

### 📱 Tối ưu hóa Mobile

- Tự động phát hiện mobile device
- Giảm số lượng effects:
  - Particles: 80 → 30
  - Heart particles: 2000 → 1000
  - Firework particles: 60 → 30
  - Max flowers: 8 → 2
  - Max butterflies: 6 → 2
- Tắt light rays trên mobile
- Kích thước phù hợp với màn hình nhỏ
- Performance optimization với requestAnimationFrame

## 🚀 Cách sử dụng

### Chạy trực tiếp

1. Mở file `index.html` trong trình duyệt
2. Tận hưởng hiệu ứng tự động chạy

### Chạy với server

```bash
# Di chuyển vào thư mục
cd congratulations_v2

# Chạy server Python
python3 -m http.server 8000

# Mở trình duyệt
# http://localhost:8000
```

## 📂 Cấu trúc file

```
congratulations_v2/
├── index.html          # HTML structure
├── style.css           # Styling với heart effect mới
├── script.js           # JavaScript với heart particle system
└── README.md          # Tài liệu này
```

## 🎨 Công nghệ sử dụng

- **HTML5 Canvas**: Cho particles, fireworks và heart effects
- **CSS3 Animations**: Cho gradient background, light rays, flower/butterfly animations
- **GSAP 3.12.2**: Cho smooth animations và easing
- **Vanilla JavaScript**: Core logic và particle systems
- **Responsive Design**: Media queries cho mobile optimization

## 💡 So sánh với phiên bản cũ

| Tính năng          | Congratulations (cũ)      | Congratulations V2 (mới)           |
| ------------------ | ------------------------- | ---------------------------------- |
| Hiệu ứng trái tim  | CSS-only, bay từ các cạnh | **Particle system + Heart beat**   |
| Số lượng trái tim  | 3-8 trái tim CSS          | **2000 particles (1000 mobile)**   |
| Animation type     | GSAP translate            | **Canvas particle physics**        |
| Heart beat         | Không có                  | **✅ Có (1.3s pulse)**             |
| Toán học           | Đơn giản                  | **✅ Công thức tham số phức tạp**  |
| Visual impact      | Đẹp                       | **✅ Rất đẹp và ấn tượng**         |
| Mobile performance | Tốt                       | **✅ Tối ưu (giảm 50% particles)** |

## ⚙️ Tuỳ chỉnh

### Thay đổi số lượng heart particles

```javascript
// Trong script.js, dòng ~348
const heartSettings = {
  particles: {
    length: isMobile ? 1000 : 2000, // Thay đổi số này
    duration: 2,
    velocity: isMobile ? 80 : 100,
    effect: -1.3,
    size: isMobile ? 10 : 13,
  },
};
```

### Thay đổi màu heart particles

```javascript
// Trong script.js, dòng ~531
context.fillStyle = "#FF5CA4"; // Thay đổi màu này
```

### Thay đổi tốc độ heart beat

```css
/* Trong style.css, dòng ~130 */
#heartBeat {
  animation: heartPulse 1.3s infinite; /* Thay đổi 1.3s */
}
```

## 🎯 Tương thích

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Tablet devices

## 📝 Credits

- Hiệu ứng trái tim particle được lấy cảm hứng từ `test/3_heart_beat_and_letter.html`
- Framework GSAP cho smooth animations
- Canvas API cho particle rendering

## 🐛 Known Issues

Không có issue nghiêm trọng. Nếu gặp vấn đề:

1. Thử refresh trang (Ctrl+F5 / Cmd+Shift+R)
2. Kiểm tra console (F12) để xem lỗi
3. Đảm bảo trình duyệt hỗ trợ Canvas API

## 📱 Performance Tips

Trên thiết bị yếu:

- Giảm `heartSettings.particles.length` xuống 500-800
- Tăng `heartSettings.particles.duration` lên 3-4
- Giảm `particleCount` xuống 20-40

---

Made with 💖 by AI Assistant | Phiên bản nâng cấp cho 20/10
