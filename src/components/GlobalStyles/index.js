import 'react-toastify/dist/ReactToastify.min.css';
import 'swiper/css/bundle';
import './GlobalStyles.scss';
import { ConfigProvider } from 'antd';
// import 'antd/dist/reset.css';
import viVN from 'antd/lib/locale/vi_VN';

function GlobalStyles({ children }) {
    return <ConfigProvider locale={viVN}>{children}</ConfigProvider>;
}

export default GlobalStyles;
