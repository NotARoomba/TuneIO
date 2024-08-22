import Modal from "react-modal";
import { SpotifyAlbum, BaseModalProps, STATUS_CODES } from "../../utils/Types";
import AlertModal from "./AlertModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callAPI, checkIfLogin } from "../../utils/Functions";
import VerificationModal from "./VerificationModal";
import ModalButton from "../buttons/ModalButton";
import LoadingScreen from "../misc/LoadingScreen";
import SearchOption from "../misc/SearchOption";

export default function EditModal({ isOpen, setIsOpen }: BaseModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState([]);
  const [album, setAlbum] = useState<SpotifyAlbum | null>();
  const [oldEmail, setOldEmail] = useState("");
  const [alertModal, setAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string[]>(["", ""]);
  const [verification, setVerification] = useState(false);
  const setAlert = (msg: string, title?: string) => {
    title ? setAlertMsg([title, msg]) : setAlertMsg(["Error", msg]);
    setAlertModal(true);
  };
  useEffect(() => {
    setLoading(true);
    checkIfLogin().then((user) => {
      if (!user) {
        return navigate("/login");
      }
      setUserID(user._id);
      setAvatar(user.avatar);
      setUsername(user.username);
      setEmail(user.email);
      setOldEmail(user.email);
      setLoading(false);
    });
  }, [navigate]);
  const updateUser = async (v: boolean) => {
    if (!v) return setAlert("The verification code is incorrect!");
    const res = await callAPI("/users/update", "POST", {
      _id: userID,
      email,
      username,
      album,
      avatar: album?.images[0].url,
    });
    if (res.status === STATUS_CODES.SUCCESS) {
      return setIsOpen(false);
    } else {
      return setAlert("An error occurred updating your profile!");
    }
  };
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
      setSearch(res.search);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      className={
        " w-4/12 p-10 rounded-xl h-7/12 min-h-96 min-w-96 bg-rich_black text-beige absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  outline-2 outline outline-air_force_blue-200 " +
        (isOpen ? "animate-show" : "animate-hide")
      }
      overlayClassName={
        "bg-rich_black/80 absolute w-full h-full top-0 left-0 " +
        (isOpen ? "animate-show" : "animate-hide")
      }
      closeTimeoutMS={300}
    >
      <div className="w-full h-full flex flex-col text-center ">
        <p className="text-4xl 3xs:text-5xl font-bold mb-3">Edit Profile</p>
        <img
          src={album?.images[0].url ?? avatar}
          className="rounded-xl max-w-fit mx-auto max-h-32 h-fit group"
        />
        <div className="mx-auto mt-3">
          <p className="text-2xl font-bold ">Username</p>
          <input
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            className="mx-auto my-2 bg-transparent text-center outline rounded outline-primary"
          />
          <p className="text-2xl font-bold ">Email</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            className="mx-auto my-2  bg-transparent text-center outline rounded outline-primary"
          />
          <p className="text-2xl font-bold ">Favorite SpotifyAlbum</p>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="mx-auto my-2 bg-transparent text-center px-2 outline rounded outline-primary"
          />
          <p className="text-2xl font-bold ">Search Results</p>
          {!album && (
            <div
              className={
                "flex w-72 gap-2 my-2 flex-col max-h-20 overflow-scroll " +
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
        </div>
        <div className="flex gap-2 mx-auto justify-center mt-4">
          <ModalButton text="Cancel" action={() => setIsOpen(false)} />
          <ModalButton
            text="Submit"
            action={() =>
              email == oldEmail ? updateUser(true) : setVerification(true)
            }
          />
        </div>
      </div>
      <LoadingScreen loading={loading} />
      <VerificationModal
        setIsOpen={setVerification}
        isOpen={verification}
        email={email}
        action={updateUser}
      />
      <AlertModal
        title={alertMsg[0]}
        text={alertMsg[1]}
        isOpen={alertModal}
        setIsOpen={setAlertModal}
      />
    </Modal>
  );
}
