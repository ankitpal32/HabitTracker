import { FiActivity, FiBookOpen, FiBriefcase, FiCompass } from "react-icons/fi";

export const getHabitIcon = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("code") || lower.includes("program") || lower.includes("dev")) {
    return <FiActivity />;
  }
  if (lower.includes("read") || lower.includes("book")) {
    return <FiBookOpen />;
  }
  if (lower.includes("work") || lower.includes("study") || lower.includes("office") || lower.includes("task")) {
    return <FiBriefcase />;
  }
  return <FiCompass />;
};
