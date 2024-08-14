import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
const animationConfiguration = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
export default function Transitions(props: React.PropsWithChildren) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      className="h-full"
      variants={animationConfiguration}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 5, type: "spring", stiffness: 50, mass: 5 }}
    >
      {props.children}
    </motion.div>
  );
}
