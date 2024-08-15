import Modal from "react-modal";
import { BaseModalProps, STATUS_CODES } from "../../utils/Types";
import AlertModal from "./AlertModal";
import { ChangeEvent, createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callAPI, checkIfLogin, convertToBase64 } from "../../utils/Functions";
import VerificationModal from "./VerificationModal";
import { Edit2, User } from "react-feather";
import LinkButton from "../buttons/LinkButton";
import LoadingScreen from "../misc/LoadingScreen";

export default function EditModal({ isOpen, setIsOpen }: BaseModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [alertModal, setAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string[]>(["", ""]);
  const [verification, setVerification] = useState(false);
  const inputRef = createRef<HTMLInputElement>();
  const setAlert = (msg: string, title?: string) => {
    title ? setAlertMsg([title, msg]) : setAlertMsg(["Error", msg]);
    setAlertModal(true);
  };
  useEffect(() => {
    setLoading(true);
    checkIfLogin().then((user) => {
      if (!user) {
        navigate("/login");
        return navigate(0);
      }
      setUserID(user._id);
      setAvatar(user.avatar);
      setUsername(user.username);
      setEmail(user.email);
      setOldEmail(user.email);
      setLoading(false);
    });
  }, [navigate]);
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (
        ![
          "jpg",
          "jpeg",
          "png",
          "bmp",
          "gif",
          "svg",
          "webp",
          "jfif",
          "avif",
          "apng",
        ].includes(file.name.split(".").reverse()[0].toLowerCase())
      )
        return setAlert("That is not a valid image file!");
      const base64 = await convertToBase64(file);
      setAvatar(base64);
    }
  };
  const updateUser = async (v: boolean) => {
    if (!v) return setAlert("The verification code is incorrect!");
    const res = await callAPI("/users/update", "POST", {
      _id: userID,
      email,
      username,
      avatar,
    });
    if (res.status === STATUS_CODES.SUCCESS) {
      return setIsOpen(false);
    } else {
      return setAlert("An error occurred updating your profile!");
    }
  };
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      className={
        " w-4/12 p-10 rounded-xl h-7/12 min-h-96 min-w-96 bg-background text-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 " +
        (isOpen ? "animate-show" : "animate-hide")
      }
      overlayClassName={
        "bg-text-800/80 absolute w-full h-full top-0 left-0 " +
        (isOpen ? "animate-show" : "animate-hide")
      }
      closeTimeoutMS={300}
    >
      <div className="w-full h-full flex flex-col text-center ">
        <p className="text-5xl font-bold mb-4">Edit Profile</p>
        <div
          className="relative text-center mx-auto cursor-pointer group"
          onClick={() => inputRef.current?.click()}
        >
          {avatar !== "" ? (
            <img
              src={avatar}
              className="rounded-xl max-w-fit max-h-32 h-fit group"
            />
          ) : (
            <User size={125} />
          )}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:animate-show animate-hide bg-background/60 w-full h-full flex">
            <Edit2 size={25} className="m-auto" />
          </div>
        </div>
        <div className="mx-auto mt-4">
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
        </div>
        <div className="flex gap-2 mx-auto justify-center mt-4">
          <LinkButton text="Cancel" action={() => setIsOpen(false)} />
          <LinkButton
            text="Submit"
            action={() =>
              email == oldEmail ? updateUser(true) : setVerification(true)
            }
          />
        </div>
      </div>
      <input
        type="file"
        ref={inputRef}
        name="avatar"
        accept="image/*"
        onChange={(e) => handleFileUpload(e)}
        className="hidden"
      />
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
