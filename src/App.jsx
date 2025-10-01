// App.jsx
import { motion } from "framer-motion";
import { useState } from "react";

const questionContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      when: "beforeChildren", // 자식이 다 끝난 후 다음 실행
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, type: "tween" },
  },
};

const mainContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 2, // "너가누구?" 끝난 뒤 시작할 딜레이
      staggerChildren: 0.05,
    },
  },
};




export default function App() {
  const [step, setStep] = useState(1);
  const [rotation, setRotation] = useState(0);
  const question = ["너", "가", "누", "구", "?"];
  const mainText =
    "강원대최고의아웃풋건강보험공단구미지사자격부과팀장영서주임!!!";

  return (
    <div className="h-screen w-full bg-stone-300 flex flex-col justify-center items-center overflow-x-hidden relative">
      {step === 1 && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center flex items-center w-full h-[30vh] text-[5vh] bg-sky-900 text-white cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setStep(2)}
        >
          장영서는 보아라..
          <div className="text-white text-[2vh] absolute bottom-1">click</div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          className="flex justify-center items-center h-screen  w-full text-3xl bg-sky-900 text-white cursor-pointer"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          onClick={() => setStep(3)}
        >
          회사생활이 힘든가요?
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          className="h-screen flex flex-col items-center justify-start pt-20"
          initial={{ y: -200 }}
          animate={{ y: 0 }}
        >
          <motion.h1
            className="text-[7vh] font-bold"
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            너가 누구?
          </motion.h1>
          <motion.div
            className="mt-10 text-[10vh] cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => setStep(4)}
          >
            ▼
          </motion.div>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div className="h-screen flex flex-wrap  justify-center items-center">
          {[...mainText].map((char, i) => (
            <motion.span
              key={i}
              className="text-red-600 text-[15vh] inline-blockblock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {char}
            </motion.span>
          ))}
          <div className="w-full h-1/2  items-center flex flex-col">
            <div className="pb-20">초록색 누르기 ▼</div>
            <motion.div className="w-3/5 h-1/7 bg-green-500 flex-wrap text-2xl"
              animate={{ rotate: rotation }}
              transition={{ duration: 1, type: "spring" }}
              onClick={() => setRotation((prev) => prev + 1080)}
            >빙글빙글돌아가는 영서의회사생활
            </motion.div>
          </div>


        </motion.div>
      )}



    </div>
  );
}
