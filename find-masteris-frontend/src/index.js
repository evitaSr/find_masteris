import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/style/index.css';
import App from './App';
import CustomHeader from './components/header';
import CustomFooter from './components/footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<CustomHeader />
		<App />
		<CustomFooter />
	</React.StrictMode>
);
