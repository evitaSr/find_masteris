import ReactDOM from 'react-dom/client';
import CustomHeader from './components/header';
import CustomFooter from './components/footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
// Components:
import App from './App';
import Login from './screens/auth/login';
import Profile from './screens/profile/profile';
import ProfileSettings from './screens/profile/profileSettings';
import Unauthorized from './screens/auth/unauthorized';
import WriteReviewScreen from './screens/profile/writeReview';
// css:
// import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style/customBootstrap.scss';
import './assets/style/index.css';
import './assets/style/headerFooter.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<AuthProvider>
			<CustomHeader />
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/login" element={<Login />} />
				<Route path="/user/:id/" element={<Profile />} />
				<Route path="/user/:id/change/" element={<ProfileSettings />} />
				<Route
					path="/user/:id/review/"
					element={<WriteReviewScreen />}
				/>
				<Route path="unauthorized/" element={<Unauthorized />} />
			</Routes>
			<CustomFooter />
		</AuthProvider>
	</BrowserRouter>
);
