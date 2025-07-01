import { toast as sonnerToast } from "sonner";

export function useToast() {
  return {
    toast: ({ title, description, variant }) => {
      sonnerToast(title, {description, style: variant === "destructive" ? { backgroundColor: "#fee2e2", color: "#b91c1c" } : {}});
    },
  };
}
