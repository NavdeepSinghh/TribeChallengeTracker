import { useState } from "react";

export default function useAppShellState() {
  const [tab, setTab] = useState("home");
  const [showLog, setShowLog] = useState(false);
  const [toast, setToast] = useState(null);
  const [badgeCat, setBadgeCat] = useState("all");
  const [showProfile, setShowProfile] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return {
    badgeCat,
    selectedDay,
    setBadgeCat,
    setSelectedDay,
    setShowLog,
    setShowProfile,
    setTab,
    showLog,
    showProfile,
    showToast,
    tab,
    toast,
  };
}
