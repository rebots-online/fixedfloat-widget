import { CryptoWidget } from './widget';
import './styles.css';

window.CryptoWidget = CryptoWidget;

// Initialize widget if element exists
document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById('crypto-converter-widget');
  if (element) {
    new CryptoWidget(element);
  }
});
