import { ApiClient } from './api';

export class CryptoWidget {
  constructor(element) {
    this.element = element;
    this.api = new ApiClient();
    this.currencies = [
      { value: 'BTC', label: 'Bitcoin (BTC)' },
      { value: 'BTCLN', label: 'Bitcoin Lightning (BTCLN)' },
      { value: 'ETH', label: 'Ethereum (ETH)' },
      { value: 'USDT', label: 'Tether (USDT)' }
    ];
    
    // Set default pair
    this.defaultPair = {
      from: 'BTC',
      to: 'BTCLN'
    };
    
    this.render();
    this.attachEventListeners();
    this.initializeDefaultPair();
  }

  initializeDefaultPair() {
    const fromSelect = this.element.querySelector('#fromCurrency');
    const toSelect = this.element.querySelector('#toCurrency');
    
    fromSelect.value = this.defaultPair.from;
    toSelect.value = this.defaultPair.to;
  }

  render() {
    this.element.innerHTML = `
      <div class="crypto-widget">
        <div class="widget-header">
          <h2>Crypto Converter</h2>
          <div class="progress-indicator">
            <div class="step active">Select</div>
            <div class="step">Convert</div>
            <div class="step">Complete</div>
          </div>
        </div>
        
        <div class="conversion-form">
          <div class="input-group">
            <label>From
              <div class="tooltip" data-tip="Choose your source currency">ℹ️</div>
            </label>
            <select id="fromCurrency">
              ${this.currencies.map(curr => 
                `<option value="${curr.value}">${curr.label}</option>`
              ).join('')}
            </select>
            <input type="number" id="fromAmount" placeholder="Amount" />
          </div>

          <div class="swap-button">⇅</div>

          <div class="input-group">
            <label>To
              <div class="tooltip" data-tip="Choose your target currency">ℹ️</div>
            </label>
            <select id="toCurrency">
              ${this.currencies.map(curr => 
                `<option value="${curr.value}">${curr.label}</option>`
              ).join('')}
            </select>
            <input type="number" id="toAmount" placeholder="You'll receive" readonly />
          </div>

          <div class="fee-info">
            <span>Network Fee: <span id="networkFee">-</span></span>
            <span>Exchange Rate: <span id="exchangeRate">-</span></span>
          </div>

          <button class="convert-button">Get Exchange Address</button>
        </div>

        <div class="lightning-info">
          <h3>Why Lightning Network? ⚡</h3>
          <p>Instant transactions, minimal fees, and scalable Bitcoin payments.</p>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const fromAmount = this.element.querySelector('#fromAmount');
    const fromCurrency = this.element.querySelector('#fromCurrency');
    const toCurrency = this.element.querySelector('#toCurrency');
    const swapButton = this.element.querySelector('.swap-button');
    const convertButton = this.element.querySelector('.convert-button');

    fromAmount.addEventListener('input', () => this.updateConversion());
    fromCurrency.addEventListener('change', () => this.handleSourceCurrencyChange());
    toCurrency.addEventListener('change', () => this.handleDestinationCurrencyChange());
    swapButton.addEventListener('click', () => this.swapCurrencies());
    convertButton.addEventListener('click', () => this.startConversion());
  }

  handleSourceCurrencyChange() {
    const fromSelect = this.element.querySelector('#fromCurrency');
    const toSelect = this.element.querySelector('#toCurrency');
    
    // If new source is Lightning BTC, set destination to regular BTC
    if (fromSelect.value === 'BTCLN') {
      toSelect.value = 'BTC';
    }
    // If both are regular BTC, change destination to Lightning BTC
    else if (fromSelect.value === 'BTC' && toSelect.value === 'BTC') {
      toSelect.value = 'BTCLN';
    }

    this.updateConversion();
  }

  handleDestinationCurrencyChange() {
    const fromSelect = this.element.querySelector('#fromCurrency');
    const toSelect = this.element.querySelector('#toCurrency');
    
    // If both would be Lightning BTC, change source to regular BTC
    if (fromSelect.value === 'BTCLN' && toSelect.value === 'BTCLN') {
      fromSelect.value = 'BTC';
    }

    this.updateConversion();
  }

  swapCurrencies() {
    const fromSelect = this.element.querySelector('#fromCurrency');
    const toSelect = this.element.querySelector('#toCurrency');
    
    // Store current values
    const fromValue = fromSelect.value;
    const toValue = toSelect.value;
    
    // If swapping would create invalid Lightning pair, use default pair instead
    if (fromValue === 'BTCLN' && toValue === 'BTCLN') {
      fromSelect.value = this.defaultPair.from;
      toSelect.value = this.defaultPair.to;
    } else {
      // Regular swap
      fromSelect.value = toValue;
      toSelect.value = fromValue;
    }

    this.updateConversion();
  }

  async updateConversion() {
    const fromAmount = this.element.querySelector('#fromAmount').value;
    const fromCurrency = this.element.querySelector('#fromCurrency').value;
    const toCurrency = this.element.querySelector('#toCurrency').value;

    if (!fromAmount) return;

    try {
      const rate = await this.api.getExchangeRate(fromCurrency, toCurrency, fromAmount);
      this.element.querySelector('#toAmount').value = rate.toAmount;
      this.element.querySelector('#networkFee').textContent = rate.networkFee;
      this.element.querySelector('#exchangeRate').textContent = rate.exchangeRate;
    } catch (error) {
      console.error('Error fetching rate:', error);
    }
  }

  async startConversion() {
    const steps = this.element.querySelectorAll('.step');
    steps[1].classList.add('active');
  }
}
