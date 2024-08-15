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

export default function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [search, setSearch] = useState("");
    const [album, setAlbum] = useState("");
    const [alertModal, setAlertModal] = useState(false);
    const [alertMsg, setAlertMsg] = useState(["Error", "An error occured!"]);
    const [loading, setLoading] = useState(false);
    const [verification, setVerification] = useState(false);
    const setAlert = (msg: string, title?: string) => {
      title ? setAlertMsg([title, msg]) : setAlertMsg(["Error", msg]);
      setAlertModal(true);
    };
    const parseSignup = async () => {
      setLoading(true);
      const doesExist = await callAPI("/users/check", "POST", {
        username,
        email,
      });
      console.log(doesExist);
      if (doesExist.status !== STATUS_CODES.GENERIC_ERROR) {
        setLoading(false);
        if (doesExist.status === STATUS_CODES.EMAIL_IN_USE)
          return setAlert("The email is already in use!");
        else if (doesExist.status === STATUS_CODES.USERNAME_IN_USE)
          return setAlert("The username is already in use!");
        const res = await callAPI("/verify/send", "POST", {
          email,
          service: "Makinator Verification",
        });
        if (res.status === STATUS_CODES.INVALID_EMAIL)
          return setAlert("That email is invalid!");
        else if (res.status === STATUS_CODES.EMAIL_NOT_EXIST)
          return setAlert("That email does not exist!");
        else if (res.status === STATUS_CODES.ERROR_SENDING_CODE)
          return setAlert("There was an error sending the code!");
        else setVerification(true);
      }
    };
    const checkSignup = async (v: boolean) => {
      if (!v) return setAlert("The verification code is incorrect!");
      setVerification(false);
      setAlert("You are now registered!", "Success");
      const res = await callAPI("/users/update", "POST", {
        username,
        email,
        dateJoined: Date.now(),
        avatar: "",
      });
      if (res.status === STATUS_CODES.SUCCESS) {
        localStorage.clear();
        localStorage.setItem("userID", res.id);
        return navigate("/");
      }
    };
    useEffect(() => {
      setLoading(true);
      checkIfLogin().then((l) => {
        if (l) {
          return navigate("/profile");
        }
      });
      setLoading(false);
    }, [navigate]);
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
          if (searchQuery.length == 0) return;
          const res = await callAPI("/music/search", "POST", {
            query: searchQuery,
            type: "album",
          });
          console.log(res)
          setSearch(res.search);
          setLoading(false);
        }, 3000)
    
        return () => clearTimeout(delayDebounceFn)
      }, [searchQuery])
    return <div className="flex flex-col w-screen h-[100dvh]">
      <Title text="Signup" reverse />
      <div className="text-2xl justify-center mx-auto flex flex-col">
            <p className="mx-auto">Username</p>
            <input
              value={username}
              maxLength={24}
              onChange={(e) => setUsername(e.currentTarget.value)}
              className="mx-auto my-2 bg-transparent text-center outline rounded outline-primary"
            />
            <p className="mx-auto">Email</p>
            <input
              value={email}
              onChange={(e) =>
                setEmail(e.currentTarget.value.toLocaleLowerCase())
              }
              className="mx-auto my-2 bg-transparent text-center outline rounded outline-primary"
            />
            <p className="mx-auto">Favorite Album</p>
            <input
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.currentTarget.value)
              }
              className="mx-auto my-2 bg-transparent text-center outline rounded outline-primary"
            />
            <Link
              to="/login"
              className={"text-secondary text-center text-lg hover:underline transition-all duration-300 w-fit mx-auto mb-2 " + (searchQuery.length > 0?"animate-hide":"animate-show")}
            >
              Need to login?
            </Link>
            <div className="flex flex-col">

            </div>
              {album &&<LinkButton disabled={loading} text="Submit" action={parseSignup} />}
            </div>
            <div className="flex mx-auto mt-auto mb-20">
      <PageButton link="/" title="Home" color="bg-ash_gray"/>

            </div>
            <LoadingScreen loading={loading} />
            <VerificationModal
          setIsOpen={setVerification}
          isOpen={verification}
          email={email}
          action={checkSignup}
        />
        <AlertModal
          title={alertMsg[0]}
          text={alertMsg[1]}
          isOpen={alertModal}
          setIsOpen={setAlertModal}
        />
  </div>
}