import './styles.css';
import { startApp } from './app/App.js';

const root = document.getElementById('root');
if (!root) {
  throw new Error('#root não encontrado no index.html');
}

startApp(root);
