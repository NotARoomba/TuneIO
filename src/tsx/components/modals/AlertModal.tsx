import Modal from "react-modal";
import { AlertModalProps } from "../../utils/Types";
import { AlertCircle, CheckCircle, Info, XCircle } from "react-feather";

export default function AlertModal({
  title,
  text,
  isOpen,
  action,
  cancel = false,
  setIsOpen,
}: AlertModalProps) {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      className={
        " w-1/6 rounded-xl h-1/3 min-h-80 min-w-80 bg-rich_black text-beige absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-2 outline outline-air_force_blue-200 " +
        (isOpen ? "animate-show" : "animate-hide")
      }
      overlayClassName={
        "src/tsx/components/modals/ResultsModal.tsx absolute w-full h-full top-0 left-0 " +
        (isOpen ? "animate-show" : "animate-hide")
      }
      closeTimeoutMS={300}
    >
      <div className="w-full h-full flex flex-col">
        {title.toLocaleLowerCase() == "error" ? (
          <XCircle size={100} className="mx-auto mt-8 mb-4" color="#D7263D" />
        ) : title.toLocaleLowerCase() == "warning" ? (
          <AlertCircle
            size={100}
            className="mx-auto mt-8 mb-4"
            color="#F46036"
          />
        ) : title.toLocaleLowerCase() == "success" ? (
          <CheckCircle
            size={100}
            className="mx-auto mt-8 mb-4"
            color="#1B998B"
          />
        ) : (
          <Info size={100} className="mx-auto mt-8 mb-4" color="#8f8f8f" />
        )}
        <p className="text-4xl mx-auto font-bold">{title}</p>
        <p className="text-xl mx-auto px-2 text-center">{text}</p>
        <div className="flex mx-auto justify-center gap-6">
          {cancel && (
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 w-32 mt-4 rounded-xl hover:bg-beige-500 text-rich_black bg-beige hover:shadow-md transition-all duration-300 text-2xl py-2 mx-auto"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              setIsOpen(false);
              action ? action() : 0;
            }}
            className="px-4 w-32 mt-4 rounded-xl hover:bg-beige-500 text-rich_black bg-beige hover:shadow-md transition-all duration-300 text-2xl py-2 mx-auto"
          >
            Ok
          </button>
        </div>
      </div>
    </Modal>
  );
}
