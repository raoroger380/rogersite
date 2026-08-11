"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BIRTH_YEAR = 2011;
const BIRTH_MONTH = 8;
const BIRTH_DAY = 11;
const BIRTH_DATE_LABEL = "8 月 11 日";

function getAgeData(now: Date) {
  const monthIndex = BIRTH_MONTH - 1;
  const currentBirthday = new Date(now.getFullYear(), monthIndex, BIRTH_DAY);
  const hasBirthdayPassed = now.getTime() >= currentBirthday.getTime();
  const wholeYears =
    now.getFullYear() - BIRTH_YEAR - (hasBirthdayPassed ? 0 : 1);
  const yearStart = hasBirthdayPassed
    ? currentBirthday
    : new Date(now.getFullYear() - 1, monthIndex, BIRTH_DAY);
  const yearEnd = hasBirthdayPassed
    ? new Date(now.getFullYear() + 1, monthIndex, BIRTH_DAY)
    : currentBirthday;
  const fraction = Math.min(
    1,
    Math.max(
      0,
      (now.getTime() - yearStart.getTime()) /
        (yearEnd.getTime() - yearStart.getTime()),
    ),
  );

  return {
    age: wholeYears + fraction,
    isBirthday:
      now.getMonth() === monthIndex && now.getDate() === BIRTH_DAY,
  };
}

function RollingDigit({ digit }: { digit: string }) {
  return (
    <span className="age-digit-slot" aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          className="age-digit"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function RollingDigits({ value }: { value: string }) {
  return (
    <span className="age-roll" aria-label={`当前年龄：${value}`}>
      {value.split("").map((char, index) =>
        char === "." ? (
          <span key={`dot-${index}`} className="age-point" aria-hidden="true">
            .
          </span>
        ) : (
          <RollingDigit key={`digit-${index}`} digit={char} />
        ),
      )}
    </span>
  );
}

export default function AgePage() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 40);
    return () => window.clearInterval(timer);
  }, []);

  const ageData = now ? getAgeData(now) : null;
  const displayAge = ageData ? ageData.age.toFixed(9) : "00.000000000";

  return (
    <section id="age" className="age-section">
      <div className="age-board">
        <p className="age-eyebrow">我的年龄</p>
        <div className="age-rule" aria-hidden="true" />
        <div className="age-number-line">
          <RollingDigits value={displayAge} />
        </div>
        <div className="age-rule age-rule-bottom" aria-hidden="true" />
        <p className="age-birthday-label">我的生日</p>
        <p className="age-birthday-date">{BIRTH_DATE_LABEL}</p>
        {ageData?.isBirthday && (
          <p className="age-happy-birthday">生日快乐！</p>
        )}
      </div>
    </section>
  );
}
