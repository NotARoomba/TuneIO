import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageButton from "../components/buttons/PageButton";
import Title from "../components/misc/Title";
import {
  callAPI,
  setCookie,
  checkIfLogin,
  deleteCookies,
} from "../utils/Functions";
import { SpotifyAlbum, STATUS_CODES } from "../utils/Types";
import ModalButton from "../components/buttons/ModalButton";
import LoadingScreen from "../components/misc/LoadingScreen";
import AlertModal from "../components/modals/AlertModal";
import VerificationModal from "../components/modals/VerificationModal";
import SearchOption from "../components/misc/SearchOption";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState([]);
  const [album, setAlbum] = useState<SpotifyAlbum | null>();
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
    if (doesExist.status !== STATUS_CODES.GENERIC_ERROR) {
      setLoading(false);
      if (doesExist.status === STATUS_CODES.EMAIL_IN_USE)
        return setAlert("The email is already in use!");
      else if (doesExist.status === STATUS_CODES.USERNAME_IN_USE)
        return setAlert("The username is already in use!");
      const res = await callAPI("/verify/send", "POST", {
        email,
        service: "TuneIO Verification",
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
      album,
      dateJoined: Date.now(),
      avatar: album?.images[0].url,
    });
    if (res.status === STATUS_CODES.SUCCESS) {
      deleteCookies();
      setCookie("userID", res.id);
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
      if (searchQuery.length == 0 || album?.name == searchQuery) {
        setLoading(false);
        setSearch([]);
        return;
      }
      setAlbum(null);
      const res = await callAPI("/music/search", "POST", {
        query: searchQuery,
        type: "album",
      });
      console.log(res);
      if (res.status !== STATUS_CODES.SUCCESS) {
        setLoading(false);
        return setAlert("There was an error fetching the albums!");
      }
      setSearch(res.search);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  return (
    <div className="flex flex-col w-screen h-[100dvh]">
      <Title text="Signup" reverse />
      <div className="text-2xl justify-center mx-auto flex flex-col">
        <p className="mx-auto">Username</p>
        <input
          value={username}
          maxLength={24}
          onChange={(e) => setUsername(e.currentTarget.value)}
          className="mx-auto my-2 bg-transparent text-center px-2 outline rounded outline-primary"
        />
        <p className="mx-auto">Email</p>
        <input
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value.toLocaleLowerCase())}
          className="mx-auto my-2 bg-transparent text-center px-2 outline rounded outline-primary"
        />
        <p className="mx-auto">Favorite SpotifyAlbum</p>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          className="mx-auto my-2 bg-transparent text-center px-2 outline rounded outline-primary"
        />
        {search.length !== 0 && searchQuery !== album?.name ? (
          <p className="mx-auto animate-show">Search Results</p>
        ) : (
          <Link
            to="/login"
            className={
              "text-secondary text-center text-lg hover:underline transition-all duration-300 w-fit mx-auto mb-2 " +
              (search.length !== 0 && searchQuery == album?.name
                ? "animate-hide"
                : "animate-show")
            }
          >
            Need to login?
          </Link>
        )}
        {!album && (
          <div
            className={
              "flex w-72 gap-2 my-2 flex-col max-h-24 overflow-scroll min-w-72 mx-auto " +
              (!album ? "animate-show" : "animate-hide")
            }
          >
            {search
              .filter((v: SpotifyAlbum) => v.images.length !== 0)
              .map((v: SpotifyAlbum, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setAlbum(v);
                    setSearchQuery(v.name);
                  }}
                  className=" cursor-pointer"
                >
                  <SearchOption title={v.name} img={v.images[0].url} />
                </div>
              ))}
          </div>
        )}
        {album && (
          <ModalButton disabled={loading} text="Submit" action={parseSignup} />
        )}
      </div>
      <div className="flex mx-auto mt-auto mb-20">
        <PageButton link="/" title="Home" color="bg-ash_gray" />
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
  );
}
