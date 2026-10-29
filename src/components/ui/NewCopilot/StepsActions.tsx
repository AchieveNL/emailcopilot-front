import { ArrowRight } from "lucide-react";

function StepsActions({
  canContinue,
  onPress,
  isLoading = false,
  inline = false,
}: {
  canContinue: boolean;
  isLoading?: boolean;
  inline?: boolean;
  onPress: () => void;
}) {
  return (
    <div
      className={
        inline
          ? "mt-4 flex justify-end w-full"
          : "pt-5 flex justify-end w-full border-t border-gray-200 mt-12 mb-4"
      }
    >
      <button
        type="button"
        onClick={() => {
          if (!canContinue) return;
          onPress();
        }}
        disabled={!canContinue || isLoading}
        className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary-hover active:bg-primary-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            Saving...
          </span>
        ) : (
          <>
            Save &amp; Continue <ArrowRight size={15} />
          </>
        )}
      </button>
    </div>
  );
}

export default StepsActions;
