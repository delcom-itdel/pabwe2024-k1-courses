import { useDispatch } from "react-redux";
import LoginInput from "../components/LoginInput";
import { asyncSetAuthLogin } from "../states/authLogin/action";

function LoginPage() {
  const dispatch = useDispatch();

  const onAuthLogin = ({ email, password }) => {
    dispatch(asyncSetAuthLogin({ email, password }));
  };

  
  
}

export default LoginPage;
