import Home from '@/pages/Home';
import AceDemo from '@/pages/AceDemo';
const routerConfig = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/ace',
    exact: true,
    component: AceDemo,
  },
];

export default routerConfig;
