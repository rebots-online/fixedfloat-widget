(function() {
  // Previous code remains the same...

  class CryptoWidget {
    // Previous methods remain the same...

    handleDestinationCurrencyChange() {
      const fromSelect = this.element.querySelector('#fromCurrency');
      const toSelect = this.element.querySelector('#toCurrency');
      
      // If destination is changed to BTC
      if (toSelect.value === 'BTC') {
        // Always set source to BTCLN when destination is BTC
        if (fromSelect.value === 'BTC') {
          fromSelect.value = 'BTCLN';
        }
      }
      // If destination is changed to BTCLN
      else if (toSelect.value === 'BTCLN') {
        // Always set source to BTC when destination is BTCLN
        if (fromSelect.value === 'BTCLN') {
          fromSelect.value = 'BTC';
        }
      }
      // For other destination currencies
      else {
        // If source matches destination, default to BTC
        if (fromSelect.value === toSelect.value) {
          fromSelect.value = 'BTC';
        }
      }

      this.updateLightningInputVisibility();
      this.updateConversion();
    }

    handleSourceCurrencyChange() {
      const fromSelect = this.element.querySelector('#fromCurrency');
      const toSelect = this.element.querySelector('#toCurrency');
      
      // If source is changed to BTC
      if (fromSelect.value === 'BTC') {
        // If destination is also BTC, change it to BTCLN
        if (toSelect.value === 'BTC') {
          toSelect.value = 'BTCLN';
        }
      }
      // If source is changed to BTCLN
      else if (fromSelect.value === 'BTCLN') {
        // If destination is also BTCLN, change it to BTC
        if (toSelect.value === 'BTCLN') {
          toSelect.value = 'BTC';
        }
      }
      // For other source currencies
      else {
        // If destination matches source, default to BTC
        if (fromSelect.value === toSelect.value) {
          toSelect.value = 'BTC';
        }
      }

      this.updateConversion();
    }

    swapCurrencies() {
      const fromSelect = this.element.querySelector('#fromCurrency');
      const toSelect = this.element.querySelector('#toCurrency');
      
      const fromValue = fromSelect.value;
      const toValue = toSelect.value;
      
      // Perform the swap
      fromSelect.value = toValue;
      toSelect.value = fromValue;
      
      // Check if we need to adjust for BTC/BTCLN pairs
      if (fromSelect.value === toSelect.value) {
        if (fromSelect.value === 'BTC') {
          fromSelect.value = 'BTCLN';
        } else if (fromSelect.value === 'BTCLN') {
          fromSelect.value = 'BTC';
        }
      }

      this.updateSatsToggleVisibility();
      this.updateLightningInputVisibility();
      this.updateConversion();
    }

    // Rest of the code remains the same...
  }

  // Rest of the code remains the same...
})();
