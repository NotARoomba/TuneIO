import { STATUS_CODES, VerificationModalProps } from "../../utils/Types";
import Modal from "react-modal";
import { callAPI } from "../../utils/Functions";
import { useState } from "react";
import AlertModal from "./AlertModal";
import LinkButton from "../buttons/LinkButton";
import LoadingScreen from "../misc/LoadingScreen";

export default function VerificationModal({
  email,
  isOpen,
  action,
  setIsOpen,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [codeModal, setCodeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const verifyCode = async () => {
    const check = await callAPI("/verify/check", "POST", { email, code });
    if (check.status !== STATUS_CODES.SUCCESS) return action(false);
    else action(true);
  };
  const sendCode = async () => {
    setLoading(true);
    await callAPI("/verify/send", "POST", {
      email,
      service: "Makinator Verification",
    });
    setLoading(false);
    setCodeModal(true);
  };
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      className={
        " w-4/12 p-10 rounded-xl h-1/3 min-h-80 min-w-96 bg-background text-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 " +
        (isOpen ? "animate-show" : "animate-hide")
      }
      overlayClassName={
        "bg-text-800/80 absolute w-full h-full top-0 left-0 " +
        (isOpen ? "animate-show" : "animate-hide")
      }
      closeTimeoutMS={300}
    >
      <div className="w-full h-full flex flex-col text-center justify-around">
        <p className="text-5xl font-bold mt-2">Verification</p>
        <p className="text-xl  mt-2">
          Enter the verification code that was sent to{" "}
          <p className="font-bold">{email}</p>
        </p>
        <input
          type="tel"
          value={code}
          onChange={(e) => setCode(e.currentTarget.value)}
          className="mx-auto my-2 mt-5 bg-transparent text-center outline rounded outline-primary"
        />
        <p
          className="text-secondary text-center text-lg hover:underline transition-all duration-300 w-fit mx-auto cursor-pointer mb-2 "
          onClick={sendCode}
        >
          Resend code
        </p>
        <div className="flex gap-2 mx-auto justify-center">
          <LinkButton text="Cancel" action={() => setIsOpen(false)} />
          <LinkButton text="Submit" action={verifyCode} />
        </div>
      </div>
      <LoadingScreen loading={loading} />
      <AlertModal
        title={"Success"}
        text={"The code has been resent!"}
        isOpen={codeModal}
        setIsOpen={setCodeModal}
      />
    </Modal>
  );
}
