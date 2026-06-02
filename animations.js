// Canvas based weather animations
export class WeatherAnimations {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.particles = [];
    this.animationId = null;
    this.currentCondition = null;
    this.isDay = null;

    window.addEventListener('resize', () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    });
  }

  setCondition(condition, isDay) {
    if (this.currentCondition === condition && this.isDay === isDay) return;
    this.currentCondition = condition;
    this.isDay = isDay;
    this.particles = [];
    this.stop();

    // Update overlay background based on condition
    const overlay = document.getElementById('background-overlay');
    if (overlay) {
      if (condition === 'clear') {
        overlay.style.background = isDay 
          ? 'linear-gradient(to bottom, #4facfe, #00f2fe)'
          : 'linear-gradient(to bottom, #09203f, #537895)';
      } else if (condition === 'clouds') {
        overlay.style.background = isDay
          ? 'linear-gradient(to bottom, #8e9eab, #eef2f3)'
          : 'linear-gradient(to bottom, #2c3e50, #3498db)';
      } else if (condition === 'rain' || condition === 'thunderstorm') {
        overlay.style.background = 'linear-gradient(to bottom, #2b5876, #4e4376)';
      } else if (condition === 'snow') {
        overlay.style.background = isDay
          ? 'linear-gradient(to bottom, #e0eafc, #cfdef3)'
          : 'linear-gradient(to bottom, #1d2b64, #f8cdda)';
      }
    }

    if (condition === 'rain' || condition === 'snow' || condition === 'clouds' || (!isDay && condition === 'clear')) {
      this.initParticles(condition, isDay);
      this.animate();
    }
  }

  initParticles(condition, isDay) {
    let count = 0;
    if (condition === 'rain') count = 100;
    if (condition === 'snow') count = 50;
    if (condition === 'clouds') count = 10;
    if (!isDay && condition === 'clear') count = 100; // stars

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(condition, isDay));
    }
  }

  createParticle(condition, isDay) {
    if (condition === 'rain') {
      return {
        x: Math.random() * this.width,
        y: Math.random() * this.height - this.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 10 + 10,
        opacity: Math.random() * 0.5 + 0.1
      };
    } else if (condition === 'snow') {
      return {
        x: Math.random() * this.width,
        y: Math.random() * this.height - this.height,
        radius: Math.random() * 3 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2
      };
    } else if (condition === 'clouds') {
      return {
        x: Math.random() * this.width * 2 - this.width,
        y: Math.random() * (this.height / 2),
        radius: Math.random() * 60 + 40,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.3 + 0.1
      };
    } else if (!isDay && condition === 'clear') {
      return { // stars
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random()
      };
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.currentCondition === 'rain') {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      for (let p of this.particles) {
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x, p.y + p.length);
        p.y += p.speed;
        if (p.y > this.height) {
          p.y = -p.length;
          p.x = Math.random() * this.width;
        }
      }
      this.ctx.stroke();
    } 
    else if (this.currentCondition === 'snow') {
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      for (let p of this.particles) {
        this.ctx.moveTo(p.x, p.y);
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }
      }
      this.ctx.fill();
    }
    else if (this.currentCondition === 'clouds') {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      for (let p of this.particles) {
        this.ctx.globalAlpha = p.opacity;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.arc(p.x + p.radius * 0.5, p.y - p.radius * 0.3, p.radius * 0.7, 0, Math.PI * 2);
        this.ctx.arc(p.x + p.radius, p.y, p.radius * 0.8, 0, Math.PI * 2);
        this.ctx.fill();
        p.x += p.speed;
        if (p.x > this.width + p.radius * 2) {
          p.x = -p.radius * 2;
        }
      }
      this.ctx.globalAlpha = 1; // reset
    }
    else if (this.currentCondition === 'clear') {
      // Stars for night
      this.ctx.fillStyle = 'white';
      for (let p of this.particles) {
        this.ctx.globalAlpha = p.opacity;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        p.opacity += p.twinkleSpeed;
        if (p.opacity > 1 || p.opacity < 0.1) {
          p.twinkleSpeed = -p.twinkleSpeed;
        }
      }
      this.ctx.globalAlpha = 1;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
