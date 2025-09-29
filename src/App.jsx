// App.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const nameVariants = {
  hidden: {
    x: "100vw",
    opacity: 0,
  },
  visible: {
    opacity: 1,
    x: 0,
  }
}

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // 자식 순차 등장
    },
  },
};

export default function App() {
  const moonName = ['서', '민', '정', '화', '이', '팅'];

  return (
    <motion.div
      className="flex justify-baseline items-center h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {moonName.map((nameItem, i) => (
        <motion.div
          key={i}
          className="text-6xl m-1 p-10"
          variants={nameVariants}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {nameItem}
        </motion.div>
      ))}
    </motion.div>
  );
}
