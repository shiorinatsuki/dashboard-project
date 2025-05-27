let cryptoChart = null;

async function fetchCryptoData() {
  try {
    // Fetch top 10 coins by market cap from CoinGecko API
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
    const data = await response.json();

    displayCryptoList(data);
    drawChart(data);
  } catch (error) {
    document.getElementById('cryptoList').innerHTML = `<p class="text-red-600">Error fetching crypto data.</p>`;
  }
}

function displayCryptoList(coins) {
  const container = document.getElementById('cryptoList');

  // Search input
  container.innerHTML = `
    <input
      type="text"
      id="cryptoSearch"
      placeholder="Search cryptocurrencies..."
      class="p-2 mb-4 border border-pink-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
      aria-label="Search cryptocurrencies"
      oninput="filterCryptoList()"
    />
    <ul id="cryptoItems" class="max-h-64 overflow-auto"></ul>
  `;

  const listEl = document.getElementById('cryptoItems');
  listEl.innerHTML = coins.map(coin => `
    <li class="py-2 border-b border-pink-200 flex justify-between items-center text-pink-700">
      <div>
        <span class="font-semibold">${coin.name}</span> (${coin.symbol.toUpperCase()})
      </div>
      <div>$${coin.current_price.toLocaleString()}</div>
    </li>
  `).join('');
}

function filterCryptoList() {
  const searchTerm = document.getElementById('cryptoSearch').value.toLowerCase();
  const items = document.querySelectorAll('#cryptoItems li');

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? '' : 'none';
  });
}

function drawChart(coins) {
  if (cryptoChart) {
    cryptoChart.destroy();
  }

  const ctx = document.getElementById('cryptoChart').getContext('2d');

  cryptoChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: coins.map(coin => coin.symbol.toUpperCase()),
      datasets: [{
        label: 'Price in USD',
        data: coins.map(coin => coin.current_price),
        backgroundColor: 'rgba(244, 114, 182, 0.7)',    // pink with opacity
        borderColor: 'rgba(236, 72, 153, 1)',            // deeper pink border
        borderWidth: 2,
        borderRadius: 5,
        hoverBackgroundColor: 'rgba(244, 114, 182, 1)',
        hoverBorderColor: 'rgba(236, 72, 153, 1)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#be185d',    // pink y-axis labels
            callback: value => '$' + value.toLocaleString()
          },
          grid: {
            color: 'rgba(244, 114, 182, 0.3)'   // pink grid lines
          }
        },
        x: {
          ticks: {
            color: '#be185d'     // pink x-axis labels
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#db2777',  // pink legend text
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        tooltip: {
          backgroundColor: '#f9a8d4',  // lighter pink tooltip background
          titleColor: '#831843',
          bodyColor: '#831843',
          borderColor: '#db2777',
          borderWidth: 1,
          callbacks: {
            label: ctx => `$${ctx.parsed.y.toLocaleString()}`
          }
        }
      }
    }
  });
}

// Initialize on page load
window.onload = fetchCryptoData;
