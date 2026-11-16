import { AccountStatus } from "@/lib/types";

function EmailAccountStatus({ status }: { status: AccountStatus }) {
  const handleStatusChange = (newStatus: AccountStatus) => {
    switch (newStatus) {
      case "active":
        return { bg: "bg-[#E3FCEF] text-success", label: "Verified" };

      case "inactive":
        return { bg: "bg-[#FFF4E9] text-warning", label: "Unverified" };

      case "error":
        return { bg: "bg-[#FFF6F7] text-error", label: "Error" };
      default:
        return { bg: "bg-blue-50 text-blue-600", label: "Unknown" };
    }
  };

  return (
    <span
      className={`inline-block rounded-md px-3 py-2 text-[12px] capitalize font-medium ${
        handleStatusChange(status).bg
      }`}
    >
      {handleStatusChange(status).label}
    </span>
  );
}

export default EmailAccountStatus;
