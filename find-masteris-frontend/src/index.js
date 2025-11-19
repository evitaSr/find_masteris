import ReactDOM from 'react-dom/client';
import CustomHeader from './components/header';
import CustomFooter from './components/footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
// Components:
import App from './App';
import Login from './screens/auth/login';

// css:
import './assets/style/index.css';
import './assets/style/headerFooter.css';
import Profile from './screens/profile';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<AuthProvider>
			<CustomHeader />
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/login" element={<Login />} />
				<Route path="/user/:id/" element={<Profile />} />
			</Routes>
			<CustomFooter />
		</AuthProvider>
	</BrowserRouter>
);
