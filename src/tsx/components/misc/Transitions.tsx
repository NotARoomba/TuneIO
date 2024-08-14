import { AnimationProps, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
const animationConfiguration: AnimationProps["variants"] = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
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
      transition={{ duration: 5, type: "spring", stiffness: 50, mass: 1 }}
    >
      {props.children}
    </motion.div>
  );
}
