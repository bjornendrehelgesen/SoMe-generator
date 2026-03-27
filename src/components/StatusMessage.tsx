type StatusMessageProps = {
  message: string;
  tone?: "error" | "info" | "success";
};

const styles = {
  error:
    "border-[#F2C5BF] bg-[linear-gradient(180deg,rgba(254,242,240,1),rgba(255,255,255,0.96))] text-[#A52019] shadow-[0_14px_35px_-24px_rgba(169,32,25,0.3)]",
  info:
    "border-[#CDE7F3] bg-[linear-gradient(180deg,rgba(240,249,252,1),rgba(255,255,255,0.96))] text-[#002B56] shadow-[0_14px_35px_-24px_rgba(0,155,208,0.18)]",
  success:
    "border-[#D6E4B5] bg-[linear-gradient(180deg,rgba(248,251,239,1),rgba(255,255,255,0.96))] text-[#516307] shadow-[0_14px_35px_-24px_rgba(136,161,40,0.24)]"
};

export function StatusMessage({
  message,
  tone = "info"
}: StatusMessageProps) {
  return (
    <div
      className={`rounded-[1.25rem] border px-4 py-3.5 text-sm font-medium ${styles[tone]}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}
