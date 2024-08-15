import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageButton from "../components/buttons/PageButton";
import Title from "../components/misc/Title";
import { callAPI, setCookie, checkIfLogin } from "../utils/Functions";
import { STATUS_CODES } from "../utils/Types";
import LinkButton from "../components/buttons/LinkButton";
import LoadingScreen from "../components/misc/LoadingScreen";
import AlertModal from "../components/modals/AlertModal";
import VerificationModal from "../components/modals/VerificationModal";

export default function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [alertModal, setAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState(["Error", "An error occured!"]);
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(false);
  const setAlert = (msg: string, title?: string) => {
    title ? setAlertMsg([title, msg]) : setAlertMsg(["Error", msg]);
    setAlertModal(true);
  };
  const parseLogin = async () => {
    setLoading(true);
    const doesExist = await callAPI("/users/check", "POST", {
      email,
    });
    if (doesExist.status !== STATUS_CODES.GENERIC_ERROR) {
      setLoading(false);
      if (doesExist.status !== STATUS_CODES.EMAIL_IN_USE)
        return setAlert("There is no account with that email!");
      const res = await callAPI("/verify/send", "POST", {
        email,
        service: "TuneIO Verification",
      });
      if (res.status === STATUS_CODES.ERROR_SENDING_CODE)
        return setAlert("There was an error sending the code!");
      else setVerification(true);
    }
  };
  const checkLogin = async (v: boolean) => {
    if (!v) return setAlert("The verification code is incorrect!");
    setVerification(false);
    setAlert("You are now logged in!", "Success");
    const res = await callAPI(`/users/${email}`, "GET");
    if (res.status === STATUS_CODES.SUCCESS) {
      setCookie("userID", res.user._id);
      navigate("/");
      navigate(0);
    } else {
      setAlert("There was an error logging you in!", "Error");
    }
  };
  useEffect(() => {
    setLoading(true);
    checkIfLogin().then((l) => {
      if (l) {
        return navigate("/profile");
      }
      setLoading(false);
    });
  }, [navigate]);
    return <div className="flex flex-col w-screen h-[100dvh]">
      <Title text="Login" reverse />
      <div className="text-2xl justify-center mx-auto flex flex-col">
              <p className="text-center">Email</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  parseLogin();
                }}
              >
                <input
                  value={email}
                  onChange={(e) =>
                    setEmail(e.currentTarget.value.toLocaleLowerCase())
                  }
                  className="mx-auto my-2 bg-transparent text-center outline rounded outline-beige"
                />
              </form>
              <Link
                to="/signup"
                className="text-air_force_blue text-center text-lg hover:underline transition-all duration-300 w-fit mx-auto mb-2 "
              >
                Need to sign up?
              </Link>
              <LinkButton disabled={loading} text="Submit" action={parseLogin} />
            </div>
            <div className="flex mx-auto mt-auto mb-20">
      <PageButton link="/" title="Home" color="bg-ash_gray"/>

            </div>
            <LoadingScreen loading={loading} />
          <VerificationModal
            setIsOpen={setVerification}
            isOpen={verification}
            email={email}
            action={checkLogin}
          />
          <AlertModal
            title={alertMsg[0]}
            text={alertMsg[1]}
            isOpen={alertModal}
            setIsOpen={setAlertModal}
          />
  </div>
}