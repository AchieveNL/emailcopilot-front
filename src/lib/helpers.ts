export const handlePlanNameChange = (planName: string): string => {
  switch (planName) {
    case "starter":
      return "Economy";
    case "growth":
      return "Business Class";
    case "scale":
      return "First Class";
    default:
      return "Unknown Plan";
  }
};
