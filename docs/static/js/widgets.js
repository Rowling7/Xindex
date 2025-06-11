// 基础组件类
class BaseWidget {
  constructor(options = {}, defaultOptions = {}) {
    this.options = { ...defaultOptions, ...options };
    this.widgetClass = this.options.widgetClass || 'widget-' + Math.random().toString(36).substr(2, 9);
    this.width = this.options.width || 240;
    this.height = this.options.height || 240;

    // 确保字体已注入
    this.injectBaseStyles();
  }

  injectBaseStyles() {
    const styleId = 'baseWidgetStyles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @font-face {
        font-family: 'CustomSans';
        src: url('static/fonts/NotoSansSC-Regular.woff2') format('woff2');
        font-weight: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'CustomSans';
        src: url('static/fonts/NotoSansSC-Bold.woff2') format('woff2');
        font-weight: bold;
        font-display: swap;
      }
      
      /* 基础widget样式 */
      .widget-container {
        width: ${this.width}px;
        height: ${this.height}px;
        border-radius: 16px;
        padding: 19px;
        background: var(--card-bg) !important;
        color: var(--text-color);
        font-family: 'CustomSans', sans-serif;
        box-shadow: 0 8px 10px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-sizing: border-box;
        overflow: hidden;
        margin: 20px;
      }
      
      /* 按钮基础样式 */
      .widget-btn {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        color: inherit;
        font-family: inherit;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .widget-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      /* 输入框基础样式 */
      .widget-input {
        padding: 5px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.1);
        color: inherit;
        font-family: inherit;
      }
    `;
    document.head.appendChild(style);
  }
}

// 时钟组件
class ClockWidget extends BaseWidget {
  constructor(options = {}) {
    super(options, {
      containerId: 'clockContainer',
      use24HourFormat: true,
      highlightColor: "#9c27b0"
    });

    this.init();
  }

  init() {
    this.createContainer();
    this.render();
    this.updateTime();
    this.interval = setInterval(() => this.updateTime(), 1000);
  }

  createContainer() {
    this.container = document.getElementById(this.options.containerId) ||
      document.createElement('div');
    this.container.id = this.options.containerId;
    this.container.className = 'widget-container';
    document.body.appendChild(this.container);
  }

  render() {
    this.container.innerHTML = `
      <div class="clock-display">
        <div class="clock-time">
          <span class="clock-hours">00</span>
          <span class="clock-colon">:</span>
          <span class="clock-minutes">00</span>
        </div>
        <div class="clock-seconds">00</div>
      </div>
      <button class="widget-btn clock-toggle">
        切换12/24小时制
      </button>
    `;

    this.injectStyles();
    this.bindEvents();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .clock-display {
        height: calc(${this.height}px - 60px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .clock-time {
        display: flex;
        align-items: baseline;
        font-size: 3rem;
        font-weight: bold;
      }
      
      .clock-colon {
        animation: clock-blink 1s infinite;
        padding: 0 5px;
      }
      
      .clock-seconds {
        font-size: 1.5rem;
        margin-top: 10px;
      }
      
      .highlight-seven {
        color: ${this.options.highlightColor} !important;
      }
      
      @keyframes clock-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  }

  bindEvents() {
    this.container.querySelector('.clock-toggle').addEventListener('click', () => {
      this.options.use24HourFormat = !this.options.use24HourFormat;
      this.updateTime();
    });
  }

  updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    if (this.options.use24HourFormat) {
      this.container.querySelector('.clock-hours').textContent =
        hours.toString().padStart(2, '0');
    } else {
      hours = hours % 12;
      hours = hours ? hours : 12;
      this.container.querySelector('.clock-hours').textContent =
        hours.toString().padStart(2, '0');
    }

    this.container.querySelector('.clock-minutes').textContent = minutes;
    this.container.querySelector('.clock-seconds').textContent = seconds;
    this.highlightNumber('clock-hours');
    this.highlightNumber('clock-minutes');
    this.highlightNumber('clock-seconds');
  }

  highlightNumber(elementClass) {
    const element = this.container.querySelector(`.${elementClass}`);
    Array.from(element.children).forEach(child => {
      if (child.classList.contains('highlight-seven')) {
        child.classList.remove('highlight-seven');
      }
    });

    const digits = element.textContent.split('');
    element.innerHTML = digits.map(digit => {
      return digit === '7'
        ? `<span class="highlight-seven">${digit}</span>`
        : digit;
    }).join('');
  }
}

// 工作时间组件
class WorkTimeWidget extends BaseWidget {
  constructor(options = {}) {
    super(options, {
      containerId: 'workTimeContainer',
      workHours: {
        start: '07:50',
        lunch: '11:20',
        end: '17:30',
        dailySalary: 250
      }
    });

    this.currentPage = 'display';
    this.loadConfig();
    this.init();
  }

  loadConfig() {
    const savedConfig = localStorage.getItem('workTimeWidgetConfig');
    if (savedConfig) {
      try {
        this.options.workHours = JSON.parse(savedConfig);
      } catch (e) {
        console.error('Failed to parse saved config', e);
      }
    }
  }

  saveConfig() {
    localStorage.setItem(
      'workTimeWidgetConfig',
      JSON.stringify(this.options.workHours)
    );
  }

  init() {
    this.createContainer();
    this.render();
    this.updateDisplay();
    this.interval = setInterval(() => this.updateDisplay(), 200);
  }

  createContainer() {
    this.container = document.getElementById(this.options.containerId) ||
      document.createElement('div');
    this.container.id = this.options.containerId;
    this.container.className = 'widget-container';
    document.body.appendChild(this.container);
  }

  render() {
    this.container.innerHTML = `
      ${this.currentPage === 'display' ? this.renderDisplayPage() : this.renderSettingsPage()}
      <button class="widget-btn widget-toggle">
        ${this.currentPage === 'display' ? '设置' : '返回'}
      </button>
    `;

    this.injectStyles();
    this.bindEvents();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .countdown-container {
        display: flex;
        flex-direction: column;
        height: calc(${this.height}px - 60px);
        justify-content: center;
      }
      
      .countdown-item {
        margin: 8px 0;
        text-align: center;
      }
      
      .countdown-label {
        font-size: 0.875rem;
        opacity: 0.8;
      }
      
      .countdown-value {
        font-size: 1.5rem;
        font-weight: bold;
      }
      
      .salary-display {
        margin-top: 15px;
        text-align: center;
      }
      
      .salary-value {
        color: var(--success);
        font-weight: bold;
      }
      
      .settings-form {
        padding: 10px;
        height: calc(${this.height}px - 60px);
        overflow-y: auto;
      }
      
      .settings-row {
        margin-bottom: 10px;
      }
      
      .settings-label {
        font-size: 0.875rem;
        display: block;
        margin-bottom: 5px;
      }
      
      .off-duty {
        border: 2px solid var(--danger) !important;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.3) !important;
        animation: breathing 1.5s ease-in-out infinite;
      }
      
      @keyframes breathing {
        0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.1); }
        50% { box-shadow: 0 0 10px 5px rgba(255, 0, 0, 0.2); }
        100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.3); }
      }
    `;
    document.head.appendChild(style);
  }

  renderDisplayPage() {
    return `
      <div class="countdown-container">
        <div class="countdown-item">
          <div class="countdown-label">吃！吃！吃！</div>
          <div class="countdown-value" id="lunchCountdown">--:--:--</div>
        </div>
        <div class="countdown-item">
          <div class="countdown-label">撤！撤！撤！</div>
          <div class="countdown-value" id="endCountdown">--:--:--</div>
        </div>
        <div class="salary-display">
          <div class="countdown-label">窝囊费</div>
          <div class="salary-value" id="salaryEarned">¥0.000</div>
        </div>
      </div>
    `;
  }

  renderSettingsPage() {
    return `
      <div class="settings-form">
        <div class="settings-row">
          <label class="settings-label">上班时间</label>
          <input type="time" class="widget-input" 
                 id="startTime" value="${this.options.workHours.start}">
        </div>
        <div class="settings-row">
          <label class="settings-label">午饭时间</label>
          <input type="time" class="widget-input" 
                 id="lunchTime" value="${this.options.workHours.lunch}">
        </div>
        <div class="settings-row">
          <label class="settings-label">下班时间</label>
          <input type="time" class="widget-input" 
                 id="endTime" value="${this.options.workHours.end}">
        </div>
        <div class="settings-row">
          <label class="settings-label">日薪(元)</label>
          <input type="number" class="widget-input" 
                 id="dailySalary" value="${this.options.workHours.dailySalary}">
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelector('.widget-toggle').addEventListener('click', () => {
      this.currentPage = this.currentPage === 'display' ? 'settings' : 'display';
      this.render();
    });

    if (this.currentPage === 'settings') {
      const saveBtn = document.createElement('button');
      saveBtn.className = 'widget-btn';
      saveBtn.textContent = '保存设置';
      saveBtn.addEventListener('click', () => this.saveSettings());
      this.container.appendChild(saveBtn);
    }
  }

  saveSettings() {
    this.options.workHours = {
      start: this.container.querySelector('#startTime').value,
      lunch: this.container.querySelector('#lunchTime').value,
      end: this.container.querySelector('#endTime').value,
      dailySalary: parseFloat(this.container.querySelector('#dailySalary').value)
    };

    this.saveConfig();
    this.currentPage = 'display';
    this.render();
  }

  updateDisplay() {
    if (this.currentPage !== 'display') return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const startTime = new Date(`${today}T${this.options.workHours.start}:00`);
    const lunchTime = new Date(`${today}T${this.options.workHours.lunch}:00`);
    const endTime = new Date(`${today}T${this.options.workHours.end}:00`);

    let lunchDiff = Math.max(lunchTime - now, 0);
    let endDiff = Math.max(endTime - now, 0);

    const formatTime = (ms) => {
      const seconds = Math.floor((ms / 1000) % 60);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    if (this.container.querySelector('#lunchCountdown')) {
      this.container.querySelector('#lunchCountdown').textContent = formatTime(lunchDiff);
    }
    if (this.container.querySelector('#endCountdown')) {
      this.container.querySelector('#endCountdown').textContent = formatTime(endDiff);
    }

    if (endDiff <= 0) {
      this.container.classList.add('off-duty');
    } else {
      this.container.classList.remove('off-duty');
    }

    if (now >= startTime && now <= endTime) {
      const workDayDuration = endTime - startTime;
      const workedTime = now - startTime;
      const salaryEarned = (workedTime / workDayDuration) * this.options.workHours.dailySalary;
      this.container.querySelector('#salaryEarned').textContent = `¥${salaryEarned.toFixed(3)}`;
    } else if (now < startTime) {
      this.container.querySelector('#salaryEarned').textContent = '¥0.000';
    } else {
      this.container.querySelector('#salaryEarned').textContent = `¥${this.options.workHours.dailySalary.toFixed(3)}`;
    }
  }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ClockWidget, WorkTimeWidget };
} else {
  window.ClockWidget = ClockWidget;
  window.WorkTimeWidget = WorkTimeWidget;
}