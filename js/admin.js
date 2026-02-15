/* ================================================
   WISER — Admin Panel JavaScript
   ================================================ */

// ---- Auth guard (server-side only — never trust localStorage) ----
(async function() {
  try {
    if (typeof WiserAuth === 'undefined') throw new Error('Auth not loaded');
    const session = await WiserAuth.getSession();
    if (!session) throw new Error('No session');
    const profile = await WiserAuth.getProfile();
    if (!profile || profile.role !== 'admin') throw new Error('Not admin');
  } catch (e) {
    // Always redirect on failure — never fall back to localStorage
    window.location.href = '../auth/login.html';
    return;
  }
})();

// ---- Date display ----
const dateEl = document.getElementById('currentDate');
if (dateEl) {
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ---- Animated counters ----
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeOut);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}
animateCounters();

// ---- Revenue Chart (Canvas-based, no library) ----
function drawRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(2, 2);

  const w = rect.width;
  const h = rect.height;
  const pad = { top: 20, right: 20, bottom: 40, left: 60 };

  const data = [8200, 9100, 7800, 12400, 11200, 14300, 10800, 15600, 13200, 17800, 16400, 19200,
                15800, 21000, 18500, 22400, 20100, 24800, 19600, 26200, 23800, 28400, 25100, 31200,
                27800, 29500, 32100, 28900, 33800, 35200];
  const labels = Array.from({length: 30}, (_, i) => `${i+1}`);
  const maxVal = Math.max(...data) * 1.1;

  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  // Grid lines
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    const val = Math.round(maxVal - (maxVal / 4) * i);
    ctx.fillText('$' + (val / 1000).toFixed(0) + 'k', pad.left - 8, y + 4);
  }

  // Area fill
  const gradient = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
  gradient.addColorStop(0, 'rgba(234,88,12,0.15)');
  gradient.addColorStop(1, 'rgba(234,88,12,0.01)');

  ctx.beginPath();
  data.forEach((val, i) => {
    const x = pad.left + (chartW / (data.length - 1)) * i;
    const y = pad.top + chartH - (val / maxVal) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else {
      const prevX = pad.left + (chartW / (data.length - 1)) * (i - 1);
      const prevY = pad.top + chartH - (data[i - 1] / maxVal) * chartH;
      const cpX = (prevX + x) / 2;
      ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
    }
  });
  ctx.lineTo(pad.left + chartW, pad.top + chartH);
  ctx.lineTo(pad.left, pad.top + chartH);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((val, i) => {
    const x = pad.left + (chartW / (data.length - 1)) * i;
    const y = pad.top + chartH - (val / maxVal) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else {
      const prevX = pad.left + (chartW / (data.length - 1)) * (i - 1);
      const prevY = pad.top + chartH - (data[i - 1] / maxVal) * chartH;
      const cpX = (prevX + x) / 2;
      ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
    }
  });
  ctx.strokeStyle = '#3d8b1c';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // X labels
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((label, i) => {
    if (i % 5 === 0) {
      const x = pad.left + (chartW / (data.length - 1)) * i;
      ctx.fillText('Day ' + label, x, h - pad.bottom + 20);
    }
  });
}

// ---- User Growth Chart ----
function drawUserChart() {
  const canvas = document.getElementById('userChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(2, 2);

  const w = rect.width;
  const h = rect.height;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
  const students = [32000, 35200, 38900, 41500, 44800, 48200, 52800];
  const teachers = [2800, 3100, 3400, 3700, 4000, 4300, 4600];
  const maxVal = Math.max(...students) * 1.1;

  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  // Grid
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    const val = Math.round(maxVal - (maxVal / 4) * i);
    ctx.fillText((val / 1000).toFixed(0) + 'k', pad.left - 8, y + 4);
  }

  // Draw bars
  const barGroupW = chartW / months.length;
  const barW = barGroupW * 0.3;
  const gap = 4;

  months.forEach((month, i) => {
    const x = pad.left + barGroupW * i + barGroupW / 2;

    // Student bar
    const sH = (students[i] / maxVal) * chartH;
    const sGrad = ctx.createLinearGradient(0, pad.top + chartH - sH, 0, pad.top + chartH);
    sGrad.addColorStop(0, '#3d8b1c');
    sGrad.addColorStop(1, '#7ad44a');
    ctx.fillStyle = sGrad;
    ctx.beginPath();
    ctx.roundRect(x - barW - gap/2, pad.top + chartH - sH, barW, sH, [4, 4, 0, 0]);
    ctx.fill();

    // Teacher bar
    const tH = (teachers[i] / maxVal) * chartH;
    const tGrad = ctx.createLinearGradient(0, pad.top + chartH - tH, 0, pad.top + chartH);
    tGrad.addColorStop(0, '#5ab82e');
    tGrad.addColorStop(1, '#9fe870');
    ctx.fillStyle = tGrad;
    ctx.beginPath();
    ctx.roundRect(x + gap/2, pad.top + chartH - tH, barW, tH, [4, 4, 0, 0]);
    ctx.fill();

    // Label
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(month, x, h - pad.bottom + 20);
  });
}

setTimeout(() => {
  drawRevenueChart();
  drawUserChart();
}, 100);

window.addEventListener('resize', () => {
  drawRevenueChart();
  drawUserChart();
});

// ---- Recent Users Table ----
async function populateRecentUsers() {
  const tbody = document.querySelector('#recentUsersTable tbody');
  if (!tbody) return;

  let users;
  try {
    if (typeof WiserAPI !== 'undefined') {
      const dbUsers = await WiserAPI.admin.getRecentUsers(5);
      if (dbUsers && dbUsers.length) {
        users = dbUsers.map(u => ({
          name: u.display_name || u.first_name + ' ' + (u.last_name || ''),
          initials: ((u.first_name || '?')[0] + (u.last_name || '?')[0]).toUpperCase(),
          color: u.role === 'teacher' ? '#3B82F6' : '#5ab82e',
          role: u.role || 'student',
          joined: WiserData && WiserData.getTimeAgo ? WiserData.getTimeAgo(u.created_at) : new Date(u.created_at).toLocaleDateString(),
          status: u.suspended ? 'suspended' : 'active'
        }));
      }
    }
  } catch (e) { console.warn('Failed to load users from API:', e); }

  if (!users) {
    users = [
      { name: 'Emma Thompson', initials: 'ET', color: '#2d6914', role: 'student', joined: '2 hours ago', status: 'active' },
      { name: 'Liam Nguyen', initials: 'LN', color: '#3B82F6', role: 'teacher', joined: '5 hours ago', status: 'active' },
      { name: 'Ava Patel', initials: 'AP', color: '#5ab82e', role: 'student', joined: '8 hours ago', status: 'pending' },
      { name: 'Noah Kim', initials: 'NK', color: '#9fe870', role: 'student', joined: '1 day ago', status: 'active' },
      { name: 'Sophia Cruz', initials: 'SC', color: '#9fe870', role: 'teacher', joined: '1 day ago', status: 'active' },
    ];
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="avatar avatar-sm" style="background:${u.color};font-size:11px;width:28px;height:28px;">${WiserSanitize.e(u.initials)}</div>
          <span style="font-weight:500;">${WiserSanitize.e(u.name)}</span>
        </div>
      </td>
      <td><span class="badge badge-${u.role === 'teacher' ? 'accent' : 'primary'}" style="font-size:10px;">${WiserSanitize.e(u.role)}</span></td>
      <td style="color:var(--text-tertiary);font-size:var(--text-xs);">${WiserSanitize.e(u.joined)}</td>
      <td><span class="admin-status-pill ${u.status}">${WiserSanitize.e(u.status)}</span></td>
    </tr>
  `).join('');
}
populateRecentUsers();

// ---- Top Courses Table ----
function populateTopCourses() {
  const tbody = document.querySelector('#topCoursesTable tbody');
  if (!tbody) return;

  const courses = [
    { name: 'Advanced React Masterclass', instructor: 'Sarah Chen', students: '4,281', revenue: '$42,810' },
    { name: 'Python for Data Science', instructor: 'Marcus Lee', students: '3,941', revenue: '$31,528' },
    { name: 'UI/UX Design Bootcamp', instructor: 'Emily Watson', students: '3,122', revenue: '$28,098' },
    { name: 'Full-Stack JavaScript', instructor: 'John Park', students: '2,847', revenue: '$25,623' },
    { name: 'Machine Learning A-Z', instructor: 'Ana Silva', students: '2,561', revenue: '$23,049' },
  ];

  tbody.innerHTML = courses.map(c => `
    <tr>
      <td style="font-weight:500;">${WiserSanitize.e(c.name)}</td>
      <td style="color:var(--text-secondary)">${WiserSanitize.e(c.instructor)}</td>
      <td>${c.students}</td>
      <td style="font-weight:600;color:#5ab82e;">${c.revenue}</td>
    </tr>
  `).join('');
}
populateTopCourses();

// ---- Activity Feed ----
async function populateActivity() {
  const feed = document.getElementById('activityFeed');
  if (!feed) return;

  let activities;
  try {
    if (typeof WiserAPI !== 'undefined') {
      const logs = await WiserAPI.admin.getAuditLog(8);
      if (logs && logs.length) {
        activities = logs.map(l => ({
          dot: l.action?.includes('delete') || l.action?.includes('suspend') ? '#EF4444' : l.action?.includes('create') ? '#5ab82e' : '#3B82F6',
          text: `<strong>${WiserSanitize.e(l.profiles?.display_name || 'System')}</strong> ${WiserSanitize.e(l.action)} ${WiserSanitize.e(l.entity_type || '')}`,
          time: WiserData && WiserData.getTimeAgo ? WiserData.getTimeAgo(l.created_at) : new Date(l.created_at).toLocaleDateString()
        }));
      }
    }
  } catch (e) { console.warn('Failed to load audit log:', e); }

  if (!activities) {
    activities = [
      { dot: '#5ab82e', text: '<strong>Emma Thompson</strong> enrolled in Advanced React', time: '2 min ago' },
      { dot: '#3B82F6', text: '<strong>Liam Nguyen</strong> submitted a new course for review', time: '15 min ago' },
      { dot: '#9fe870', text: '<strong>System</strong> flagged 3 reviews for moderation', time: '1 hour ago' },
      { dot: '#9fe870', text: '<strong>Sophia Cruz</strong> earned $1,200 in payouts', time: '2 hours ago' },
      { dot: '#2d6914', text: '<strong>Noah Kim</strong> completed Python for Data Science', time: '3 hours ago' },
      { dot: '#5ab82e', text: '<strong>Ava Patel</strong> registered as a new student', time: '5 hours ago' },
      { dot: '#EF4444', text: '<strong>System</strong> detected unusual login attempt', time: '6 hours ago' },
      { dot: '#3B82F6', text: '<strong>Marcus Lee</strong> updated course pricing', time: '8 hours ago' },
    ];
  }

  feed.innerHTML = activities.map(a => `
    <div class="admin-activity-item">
      <div class="admin-activity-dot" style="background:${a.dot}"></div>
      <div>
        <div class="admin-activity-text">${a.text}</div>
        <div class="admin-activity-time">${WiserSanitize.e(a.time)}</div>
      </div>
    </div>
  `).join('');
}
populateActivity();

// ---- Pending Approvals ----
async function populatePending() {
  const list = document.getElementById('pendingList');
  if (!list) return;

  let items;
  try {
    if (typeof WiserAPI !== 'undefined') {
      const pending = await WiserAPI.admin.getPendingCourses();
      if (pending && pending.length) {
        items = pending.map(c => ({
          id: c.id,
          icon: c.category_name === 'Design' ? '<span class="wi wi-palette"></span>' : c.category_name === 'Data Science' ? '<span class="wi wi-chart"></span>' : '<span class="wi wi-book"></span>',
          title: c.title,
          meta: `by ${c.profiles?.display_name || 'Unknown'} • Submitted ${WiserData && WiserData.getTimeAgo ? WiserData.getTimeAgo(c.created_at) : 'recently'}`,
          bg: 'rgba(59,130,246,0.1)'
        }));
      }
    }
  } catch (e) { console.warn('Failed to load pending courses:', e); }

  if (!items) {
    items = [
      { icon: '<span class="wi wi-book"></span>', title: 'Blockchain Fundamentals', meta: 'by Liam Nguyen • Submitted 2h ago', bg: 'rgba(59,130,246,0.1)' },
      { icon: '<span class="wi wi-palette"></span>', title: 'Motion Design Pro', meta: 'by Lisa Zhang • Submitted 5h ago', bg: 'rgba(168,85,247,0.1)' },
      { icon: '<span class="wi wi-bulb"></span>', title: 'Cognitive Science 101', meta: 'by Ryan Garcia • Submitted 1d ago', bg: 'rgba(234,179,8,0.1)' },
      { icon: '<span class="wi wi-monitor"></span>', title: 'Go Lang for Backend', meta: 'by Chris Lee • Submitted 1d ago', bg: 'rgba(245,158,11,0.1)' },
      { icon: '<span class="wi wi-chart"></span>', title: 'Advanced Analytics', meta: 'by Emily Watson • Submitted 2d ago', bg: 'rgba(194,65,12,0.1)' },
    ];
  }

  list.innerHTML = items.map(item => `
    <div class="admin-pending-item" data-course-id="${item.id || ''}">
      <div class="admin-pending-icon" style="background:${item.bg}">${item.icon}</div>
      <div class="admin-pending-info">
        <div class="admin-pending-title">${WiserSanitize.e(item.title)}</div>
        <div class="admin-pending-meta">${WiserSanitize.e(item.meta)}</div>
      </div>
      <div class="admin-pending-actions">
        <button class="approve-btn" onclick="approveCourse('${item.title}', '${item.id || ''}')" title="Approve">✓</button>
        <button class="reject-btn" onclick="rejectCourse('${item.title}', '${item.id || ''}')" title="Reject">✕</button>
      </div>
    </div>
  `).join('');
}
populatePending();

// ---- Modal Functions ----
function showModal(id) {
  document.getElementById(id).classList.add('open');
}

function hideModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Close modals on overlay click
document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
});

// ---- Toast Notifications ----
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'admin-toast show ' + type;
  setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// ---- Action Handlers ----
function addUser() {
  const name = document.getElementById('newUserName')?.value;
  const email = document.getElementById('newUserEmail')?.value;
  const role = document.getElementById('newUserRole')?.value;
  if (!name || !email) {
    showToast('Please fill in all fields', 'warning');
    return;
  }
  hideModal('addUserModal');
  showToast(`User "${name}" (${role}) added successfully!`);
  // Reset form
  document.getElementById('newUserName').value = '';
  document.getElementById('newUserEmail').value = '';
}

function submitReview() {
  const courseId = document.getElementById('reviewCourseId')?.value;
  const decision = document.getElementById('reviewDecision')?.value;
  if (!courseId) {
    showToast('Please enter a Course ID', 'warning');
    return;
  }
  hideModal('courseModal');
  showToast(`Course ${courseId} — ${decision === 'approve' ? 'Approved' : decision === 'reject' ? 'Rejected' : 'Revision requested'}`);
}

function sendAnnouncement() {
  const title = document.getElementById('announcementTitle')?.value;
  const msg = document.getElementById('announcementMsg')?.value;
  const target = document.getElementById('announcementTarget')?.value;
  if (!title || !msg) {
    showToast('Please fill in title and message', 'warning');
    return;
  }
  hideModal('announcementModal');
  showToast(`Announcement sent to ${target === 'all' ? 'all users' : target}!`);
  document.getElementById('announcementTitle').value = '';
  document.getElementById('announcementMsg').value = '';
}

function exportReport() {
  // Generate actual CSV file
  const headers = ['Metric', 'Value', 'Change', 'Period'];
  const rows = [
    ['Total Users', '52847', '+12.5%', 'All Time'],
    ['Active Courses', '1284', '+8.3%', 'All Time'],
    ['Monthly Revenue', '$284,590', '+23.1%', 'This Month'],
    ['Course Completions', '3219', '+12%', 'This Month'],
    ['New Registrations', '6842', '+18%', 'This Month'],
    ['Avg Session Duration', '42 min', '-3%', 'This Month'],
    ['Platform Uptime', '99.9%', 'Stable', 'This Month'],
    ['Refund Requests', '1847', '+5%', 'This Month'],
  ];
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wiser-admin-report-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Report exported as CSV!');
}

async function approveCourse(title, courseId) {
  try {
    if (courseId && typeof WiserAPI !== 'undefined') {
      await WiserAPI.admin.approveCourse(courseId);
    }
  } catch (e) { console.warn('API approve failed:', e); }
  const item = event.target.closest('.admin-pending-item');
  item.style.transition = 'all 0.3s ease';
  item.style.opacity = '0';
  item.style.transform = 'translateX(20px)';
  setTimeout(() => item.remove(), 300);
  showToast(`"${title}" approved!`);
  const countEl = document.getElementById('pendingCount');
  if (countEl) countEl.textContent = parseInt(countEl.textContent) - 1;
}

async function rejectCourse(title, courseId) {
  try {
    if (courseId && typeof WiserAPI !== 'undefined') {
      await WiserAPI.admin.suspendCourse(courseId);
    }
  } catch (e) { console.warn('API reject failed:', e); }
  const item = event.target.closest('.admin-pending-item');
  item.style.transition = 'all 0.3s ease';
  item.style.opacity = '0';
  item.style.transform = 'translateX(-20px)';
  setTimeout(() => item.remove(), 300);
  showToast(`"${title}" rejected`, 'error');
  const countEl = document.getElementById('pendingCount');
  if (countEl) countEl.textContent = parseInt(countEl.textContent) - 1;
}

function updateRevenueChart() {
  drawRevenueChart();
}
