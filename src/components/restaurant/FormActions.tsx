
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

const FormActions = ({ onCancel, isSubmitting = false }: FormActionsProps) => {
  return (
    <div className="flex gap-2 justify-end">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Annulla
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        Salva
      </Button>
    </div>
  );
};

export default FormActions;
