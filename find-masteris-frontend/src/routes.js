import { route, index } from '@react-router/dev/routes';

const routes = [
	index('./index.js'),
	route('login', './screens/auth/login.js'),
	route('profile', './screens/profile.js'),
];

export default routes;
