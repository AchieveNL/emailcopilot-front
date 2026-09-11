import { AccountStatus } from "@/lib/types";

function EmailAccountStatus({ status }: { status: AccountStatus }) {
  const handleStatusChange = (newStatus: AccountStatus) => {
    switch (newStatus) {
      case "active":
        return { bg: "bg-success/10 text-success", label: "Verified" };

      case "inactive":
        return { bg: "bg-orange-50 text-orange-600", label: "Unverified" };

      case "error":
        return { bg: "bg-error/10 text-error", label: "Error" };
      default:
        return { bg: "bg-blue-50 text-blue-600", label: "Unknown" };
    }
  };

  return (
    <span
      className={`inline-block rounded-md px-2.5 py-1 text-xs capitalize font-medium ${
        handleStatusChange(status).bg
      }`}
    >
      {handleStatusChange(status).label}
    </span>
  );
}

export default EmailAccountStatus;
