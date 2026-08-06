/**
 * ColdBox ESP32 Dual DHT22 Dashboard Logic
 * Dedicated Separate Charts for Box #1 (GPIO 4) & Box #2 (GPIO 16)
 * Powered by Supabase Realtime & PostgREST API
 */

// -------------------------------------------------------------
// 1. SUPABASE CLIENT CONFIGURATION
// -------------------------------------------------------------
const PROJECT_REF = 'vxzbgfrdrzdsifmqnvdl';
const DEFAULT_URL = `https://${PROJECT_REF}.supabase.co`;
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4emJnZnJkcnpkc2lmbXFudmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mzk3NTEsImV4cCI6MjEwMTUxNTc1MX0._lQrHVitWHD1fiPUivOAMBeEY-69Msedab7l3_bTc5I';

// Initialize Supabase Client via CDN
const supabaseClient = window.supabase.createClient(DEFAULT_URL, DEFAULT_ANON_KEY);

// State store & Chart Instances
let chartBox1 = null;
let chartBox2 = null;
let chartCompare = null;
let localLogs = [];
let currentActiveTab = 'box1';

// -------------------------------------------------------------
// 2. CHART INITIALIZATION (Separate Charts per Box)
// -------------------------------------------------------------

// Helper for Common Single Box Chart Config
function createBoxChart(ctxId, tempColor, humiColor, labelPrefix) {
  const ctx = document.getElementById(ctxId).getContext('2d');
  
  // Create Gradients
  const gradTemp = ctx.createLinearGradient(0, 0, 0, 200);
  gradTemp.addColorStop(0, tempColor.replace('1)', '0.25)'));
  gradTemp.addColorStop(1, tempColor.replace('1)', '0.0)'));

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: `${labelPrefix} อุณหภูมิ (°C)`,
          data: [],
          borderColor: tempColor,
          backgroundColor: gradTemp,
          borderWidth: 2.5,
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          yAxisID: 'yTemp'
        },
        {
          label: `${labelPrefix} ความชื้น (%RH)`,
          data: [],
          borderColor: humiColor,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.3,
          fill: false,
          pointRadius: 2,
          yAxisID: 'yHumi'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Prompt', size: 10 } }
        }
      },
      scales: {
        x: {
          ticks: { font: { family: 'Prompt', size: 10 } },
          grid: { display: false }
        },
        yTemp: {
          type: 'linear',
          position: 'left',
          suggestedMin: 15,
          suggestedMax: 35,
          title: { display: true, text: '°C', font: { family: 'Prompt', size: 10 } },
          ticks: { font: { family: 'Prompt', size: 10 } },
          grid: { color: '#F1F5F9' }
        },
        yHumi: {
          type: 'linear',
          position: 'right',
          suggestedMin: 40,
          suggestedMax: 90,
          title: { display: true, text: '%RH', font: { family: 'Prompt', size: 10 } },
          ticks: { font: { family: 'Prompt', size: 10 } },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

function initCharts() {
  // 1. Chart for Box #1 (DHT22 #1 - GPIO 4) -> Emerald Green Accent
  chartBox1 = createBoxChart('chartBox1', 'rgba(16, 185, 129, 1)', 'rgba(37, 99, 235, 1)', 'กล่องที่ 1 (GPIO 4)');

  // 2. Chart for Box #2 (DHT22 #2 - GPIO 16) -> Sapphire Blue Accent
  chartBox2 = createBoxChart('chartBox2', 'rgba(59, 130, 246, 1)', 'rgba(239, 68, 68, 1)', 'กล่องที่ 2 (GPIO 16)');

  // 3. Comparison Chart (Box #1 vs Box #2 Temperatures AND Humidities)
  const ctxCompare = document.getElementById('chartCompare').getContext('2d');
  chartCompare = new Chart(ctxCompare, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: '📦 กล่องที่ 1 อุณหภูมิ (°C)',
          data: [],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          borderWidth: 2.5,
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          yAxisID: 'yTemp'
        },
        {
          label: '📦 กล่องที่ 2 อุณหภูมิ (°C)',
          data: [],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          borderWidth: 2.5,
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          yAxisID: 'yTemp'
        },
        {
          label: '💧 กล่องที่ 1 ความชื้น (%RH)',
          data: [],
          borderColor: '#059669',
          borderDash: [4, 4],
          borderWidth: 1.5,
          tension: 0.3,
          fill: false,
          pointRadius: 2,
          yAxisID: 'yHumi'
        },
        {
          label: '💧 กล่องที่ 2 ความชื้น (%RH)',
          data: [],
          borderColor: '#1D4ED8',
          borderDash: [4, 4],
          borderWidth: 1.5,
          tension: 0.3,
          fill: false,
          pointRadius: 2,
          yAxisID: 'yHumi'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { family: 'Prompt', size: 10 } } }
      },
      scales: {
        x: { ticks: { font: { family: 'Prompt', size: 10 } }, grid: { display: false } },
        yTemp: {
          type: 'linear',
          position: 'left',
          suggestedMin: 15,
          suggestedMax: 35,
          title: { display: true, text: '°C', font: { family: 'Prompt', size: 10 } },
          ticks: { font: { family: 'Prompt', size: 10 } },
          grid: { color: '#F1F5F9' }
        },
        yHumi: {
          type: 'linear',
          position: 'right',
          suggestedMin: 40,
          suggestedMax: 90,
          title: { display: true, text: '%RH', font: { family: 'Prompt', size: 10 } },
          ticks: { font: { family: 'Prompt', size: 10 } },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

// -------------------------------------------------------------
// 3. TAB SWITCHER FUNCTION
// -------------------------------------------------------------
function switchChartTab(tabName) {
  currentActiveTab = tabName;

  // Update Button Active States
  document.getElementById('tabBtnBox1').classList.toggle('active', tabName === 'box1');
  document.getElementById('tabBtnBox2').classList.toggle('active', tabName === 'box2');
  document.getElementById('tabBtnCompare').classList.toggle('active', tabName === 'compare');

  // Toggle Visibility of Chart Cards
  document.getElementById('chartCardBox1').classList.toggle('hidden-chart', tabName !== 'box1');
  document.getElementById('chartCardBox2').classList.toggle('hidden-chart', tabName !== 'box2');
  document.getElementById('chartCardCompare').classList.toggle('hidden-chart', tabName !== 'compare');

  // Trigger chart resize/update for smooth rendering
  if (tabName === 'box1' && chartBox1) chartBox1.update();
  if (tabName === 'box2' && chartBox2) chartBox2.update();
  if (tabName === 'compare' && chartCompare) chartCompare.update();
}

// Make globally accessible for onclick in HTML
window.switchChartTab = switchChartTab;

// -------------------------------------------------------------
// 4. UI UPDATE RENDERING (Dedicated Box 1 & Box 2 Displays)
// -------------------------------------------------------------
function updateUI(logs) {
  if (!logs || logs.length === 0) return;

  const latest = logs[0];
  const timeStr = new Date(latest.recorded_at).toLocaleTimeString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  // Update Last Sync Header Time
  document.getElementById('lastUpdateText').innerText = `อัปเดตล่าสุด: ${timeStr} น.`;

  // Parse Sensor 1 (GPIO 4) & Sensor 2 (GPIO 16) Values
  const t1 = parseFloat(latest.temp_1);
  const h1 = parseFloat(latest.humi_1);
  const t2 = parseFloat(latest.temp_2 !== null && latest.temp_2 !== undefined ? latest.temp_2 : latest.temp_1);
  const h2 = parseFloat(latest.humi_2 !== null && latest.humi_2 !== undefined ? latest.humi_2 : latest.humi_1);

  // Update Card #1 (DHT22 #1 - GPIO 4)
  document.getElementById('dht1Temp').innerText = t1.toFixed(1);
  document.getElementById('dht1Humi').innerText = h1.toFixed(0);

  // Update Card #2 (DHT22 #2 - GPIO 16)
  document.getElementById('dht2Temp').innerText = t2.toFixed(1);
  document.getElementById('dht2Humi').innerText = h2.toFixed(0);

  // Calculate Temperature Difference (Δ Temp)
  const diffTemp = Math.abs(t1 - t2).toFixed(1);

  // Update Summary Cards Grid
  document.getElementById('statB1Val').innerText = `${t1.toFixed(1)} °C`;
  document.getElementById('statB1Humi').innerText = `${h1.toFixed(0)} %RH`;

  document.getElementById('statB2Val').innerText = `${t2.toFixed(1)} °C`;
  document.getElementById('statB2Humi').innerText = `${h2.toFixed(0)} %RH`;

  document.getElementById('statDiffVal').innerText = `${diffTemp} °C`;

  // Update Telemetry Logs Table (Top 10 Recent Records)
  const tableBody = document.getElementById('logsTableBody');
  tableBody.innerHTML = logs.slice(0, 10).map(r => {
    const time = new Date(r.recorded_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const s1T = parseFloat(r.temp_1).toFixed(1);
    const s1H = parseFloat(r.humi_1).toFixed(0);
    const s2T = parseFloat(r.temp_2 !== null ? r.temp_2 : r.temp_1).toFixed(1);
    const s2H = parseFloat(r.humi_2 !== null ? r.humi_2 : r.humi_1).toFixed(0);
    const diff = Math.abs(parseFloat(s1T) - parseFloat(s2T)).toFixed(1);

    return `
      <tr>
        <td><strong>${time}</strong></td>
        <td><span style="color:#10B981; font-weight:700;">${s1T}°C</span> / <span style="color:#2563EB;">${s1H}%</span></td>
        <td><span style="color:#3B82F6; font-weight:700;">${s2T}°C</span> / <span style="color:#2563EB;">${s2H}%</span></td>
        <td><strong style="color:#8B5CF6;">${diff} °C</strong></td>
      </tr>
    `;
  }).join('');

  // Prepare Chronological Series for Charts
  const chronolog = [...logs].reverse().slice(-15);
  const labels = chronolog.map(l => new Date(l.recorded_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));
  
  const temp1Series = chronolog.map(l => parseFloat(l.temp_1));
  const humi1Series = chronolog.map(l => parseFloat(l.humi_1));
  
  const temp2Series = chronolog.map(l => parseFloat(l.temp_2 !== null ? l.temp_2 : l.temp_1));
  const humi2Series = chronolog.map(l => parseFloat(l.humi_2 !== null ? l.humi_2 : l.humi_1));

  // 1. Update Box #1 Chart
  if (chartBox1) {
    chartBox1.data.labels = labels;
    chartBox1.data.datasets[0].data = temp1Series;
    chartBox1.data.datasets[1].data = humi1Series;
    chartBox1.update();
  }

  // 2. Update Box #2 Chart
  if (chartBox2) {
    chartBox2.data.labels = labels;
    chartBox2.data.datasets[0].data = temp2Series;
    chartBox2.data.datasets[1].data = humi2Series;
    chartBox2.update();
  }

  // 3. Update Comparison Chart (Both Temp & Humi)
  if (chartCompare) {
    chartCompare.data.labels = labels;
    chartCompare.data.datasets[0].data = temp1Series;
    chartCompare.data.datasets[1].data = temp2Series;
    chartCompare.data.datasets[2].data = humi1Series;
    chartCompare.data.datasets[3].data = humi2Series;
    chartCompare.update();
  }
}

// -------------------------------------------------------------
// 5. EXPORT TABLE FUNCTIONALITY (CSV & PDF)
// -------------------------------------------------------------

// Export to CSV / Excel File
function exportTelemetryCSV() {
  if (!localLogs || localLogs.length === 0) {
    alert('ยังไม่มีข้อมูลสำหรับส่งออก');
    return;
  }

  // UTF-8 BOM for Excel Thai language support
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  
  // Title Metadata
  csvContent += "รายงานข้อมูลการบันทึกอุณหภูมิและความชื้น ESP32 ColdBox (Dual DHT22)\n";
  csvContent += `วันที่ออกรายงาน: ${new Date().toLocaleString('th-TH')}\n`;
  csvContent += `รหัสอุปกรณ์: box-1 (Project Ref: vxzbgfrdrzdsifmqnvdl)\n\n`;

  // Column Headers
  csvContent += "ลำดับ,วันที่-เวลา,อุณหภูมิ กล่องที่ 1 (°C),ความชื้น กล่องที่ 1 (%RH),อุณหภูมิ กล่องที่ 2 (°C),ความชื้น กล่องที่ 2 (%RH),ผลต่างอุณหภูมิ (°C),สถานะ\n";

  // Data Rows
  localLogs.forEach((row, index) => {
    const dateTime = new Date(row.recorded_at).toLocaleString('th-TH');
    const t1 = parseFloat(row.temp_1).toFixed(1);
    const h1 = parseFloat(row.humi_1).toFixed(0);
    const t2 = parseFloat(row.temp_2 !== null ? row.temp_2 : row.temp_1).toFixed(1);
    const h2 = parseFloat(row.humi_2 !== null ? row.humi_2 : row.humi_1).toFixed(0);
    const diff = Math.abs(parseFloat(t1) - parseFloat(t2)).toFixed(1);
    const isAlert = parseFloat(t1) > 30 || parseFloat(t2) > 30;
    const status = isAlert ? "แจ้งเตือนอุณหภูมิสูง" : "ปกติ";

    csvContent += `${index + 1},${dateTime},${t1},${h1},${t2},${h2},${diff},${status}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `ColdBox_Telemetry_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export / Print PDF Summary Report
function exportTelemetryPDF() {
  if (!localLogs || localLogs.length === 0) {
    alert('ยังไม่มีข้อมูลสำหรับออกรายงาน');
    return;
  }

  const printWin = window.open('', '_blank');
  printWin.document.write(`
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>รายงานสรุปอุณหภูมิและความชื้น - ColdBox</title>
      <style>
        body { font-family: 'Prompt', sans-serif; padding: 25px; color: #1E293B; }
        .report-header { border-bottom: 2px solid #1E6BFF; padding-bottom: 12px; margin-bottom: 20px; }
        h1 { color: #1E6BFF; font-size: 20px; margin-bottom: 4px; }
        .meta-info { font-size: 12px; color: #64748B; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #CBD5E1; padding: 8px 12px; font-size: 11px; text-align: left; }
        th { background-color: #F1F5F9; font-weight: bold; }
        .badge { padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .badge-normal { background: #D1FAE5; color: #047857; }
        .badge-alert { background: #FEE2E2; color: #DC2626; }
      </style>
    </head>
    <body>
      <div class="report-header">
        <h1>📦 รายงานสรุปการบันทึกอุณหภูมิและความชื้น ColdBox ESP32</h1>
        <div class="meta-info">
          <div>ระบบ: <strong>ColdBox Dual DHT22 Monitoring System</strong> (Supabase Ref: vxzbgfrdrzdsifmqnvdl)</div>
          <div>วันที่ออกรายงาน: ${new Date().toLocaleString('th-TH')}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>วันที่-เวลา</th>
            <th>📦 กล่องที่ 1 (GPIO 4)</th>
            <th>📦 กล่องที่ 2 (GPIO 16)</th>
            <th>ผลต่าง (°C)</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          ${localLogs.map((r, i) => {
            const time = new Date(r.recorded_at).toLocaleString('th-TH');
            const s1T = parseFloat(r.temp_1).toFixed(1);
            const s1H = parseFloat(r.humi_1).toFixed(0);
            const s2T = parseFloat(r.temp_2 !== null ? r.temp_2 : r.temp_1).toFixed(1);
            const s2H = parseFloat(r.humi_2 !== null ? r.humi_2 : r.humi_1).toFixed(0);
            const diff = Math.abs(parseFloat(s1T) - parseFloat(s2T)).toFixed(1);
            const isAlert = parseFloat(s1T) > 30 || parseFloat(s2T) > 30;
            return `
              <tr>
                <td>${i + 1}</td>
                <td>${time}</td>
                <td>${s1T} °C / ${s1H} %RH</td>
                <td>${s2T} °C / ${s2H} %RH</td>
                <td>${diff} °C</td>
                <td><span class="badge ${isAlert ? 'badge-alert' : 'badge-normal'}">${isAlert ? 'แจ้งเตือน' : 'ปกติ'}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      <script>window.print();</script>
    </body>
    </html>
  `);
  printWin.document.close();
}

// -------------------------------------------------------------
// 6. SUPABASE DATA FETCHING
// -------------------------------------------------------------
async function fetchTelemetry() {
  const refreshBtn = document.getElementById('btnRefresh');
  if (refreshBtn) {
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>โหลด...</span>`;
  }

  try {
    const { data, error } = await supabaseClient
      .from('telemetry_logs')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(30);

    if (error) throw error;

    if (data && data.length > 0) {
      localLogs = data;
      updateUI(localLogs);
    } else {
      document.getElementById('logsTableBody').innerHTML = `
        <tr><td colspan="4" style="text-align:center; color:var(--text-muted);">ยังไม่มีข้อมูลในระบบ (กรุณาเปิดบอร์ด ESP32 เพื่อส่งข้อมูล)</td></tr>
      `;
    }
  } catch (err) {
    console.error('⚠️ Error fetching telemetry from Supabase:', err);
  } finally {
    if (refreshBtn) {
      refreshBtn.disabled = false;
      refreshBtn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> <span>รีเฟรช</span>`;
    }
  }
}

// -------------------------------------------------------------
// 7. SUPABASE REALTIME WEBSOCKET LISTENER
// -------------------------------------------------------------
function setupRealtime() {
  supabaseClient
    .channel('public:telemetry_logs')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'telemetry_logs' },
      (payload) => {
        console.log('📡 Live ESP32 Telemetry Received:', payload.new);
        localLogs.unshift(payload.new);
        updateUI(localLogs);
      }
    )
    .subscribe((status) => {
      const badge = document.getElementById('statusBadge');
      const text = document.getElementById('statusText');
      if (status === 'SUBSCRIBED') {
        console.log('✅ Connected to Supabase Realtime WebSocket');
        badge.style.background = '#D1FAE5';
        badge.style.color = '#047857';
        text.innerText = 'เชื่อมต่อเรียลไทม์';
      } else {
        badge.style.background = '#FEF3C7';
        badge.style.color = '#D97706';
        text.innerText = 'กำลังเชื่อมต่อ...';
      }
    });
}

// -------------------------------------------------------------
// 8. APP INITIALIZATION & EVENT LISTENERS
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  fetchTelemetry();
  setupRealtime();

  // Header Refresh Button
  const refreshBtn = document.getElementById('btnRefresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', fetchTelemetry);
  }

  // Export Buttons
  const csvBtn = document.getElementById('btnExportCSV');
  if (csvBtn) {
    csvBtn.addEventListener('click', exportTelemetryCSV);
  }

  const pdfBtn = document.getElementById('btnExportPDF');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', exportTelemetryPDF);
  }
});
