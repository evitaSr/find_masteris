import ReactDOM from 'react-dom/client';
import CustomHeader from './components/header';
import CustomFooter from './components/footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';

import App from './screens/App';
// auth screens:
import Login from './screens/auth/login';
import Signup from './screens/auth/signup';
// profile screens:
import Profile from './screens/profile/profile';
import ProfileSettings from './screens/profile/profileSettings';
import Unauthorized from './screens/auth/unauthorized';
import WriteReviewScreen from './screens/profile/writeReview';
import ReviewList from './screens/profile/reviewList';
import EditReviewScreen from './screens/profile/editReview';
// css:
import './assets/style/customBootstrap.scss';
import './assets/style/index.css';
import './assets/style/headerFooter.css';
import './assets/style/auth.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<AuthProvider>
			<div className="main-content">
				<CustomHeader />
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/user/:id/" element={<Profile />} />
					<Route
						path="/user/:id/change/"
						element={<ProfileSettings />}
					/>
					<Route
						path="/user/:id/review/add/"
						element={<WriteReviewScreen />}
					/>
					<Route path="/user/:id/review/" element={<ReviewList />} />
					<Route
						path="/user/:id/category/:categoryId/service/:serviceId/review/:reviewId/"
						element={<EditReviewScreen />}
					/>
					<Route path="unauthorized/" element={<Unauthorized />} />
				</Routes>
			</div>
			<CustomFooter />
		</AuthProvider>
	</BrowserRouter>
);
