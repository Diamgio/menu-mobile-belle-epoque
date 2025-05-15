
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RestaurantInfo } from "@/types/menu";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import LogoUploader from "./restaurant/LogoUploader";
import BasicInfoFields from "./restaurant/BasicInfoFields";
import SocialMediaFields from "./restaurant/SocialMediaFields";
import FormActions from "./restaurant/FormActions";
import { restaurantFormSchema, type RestaurantFormValues } from "./restaurant/restaurantFormSchema";

interface RestaurantInfoFormProps {
  info: RestaurantInfo;
  onSave: (info: RestaurantInfo) => void;
  onCancel: () => void;
}

const RestaurantInfoForm = ({
  info,
  onSave,
  onCancel,
}: RestaurantInfoFormProps) => {
  const [logoUrl, setLogoUrl] = useState<string>(info.logo || "");

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: info.name,
      openingHours: info.openingHours,
      phone: info.phone,
      address: info.address,
      facebook: info.socialLinks.facebook || "",
      instagram: info.socialLinks.instagram || "",
      logo: info.logo || "",
    },
  });

  const onSubmit = (values: RestaurantFormValues) => {
    onSave({
      name: values.name,
      openingHours: values.openingHours,
      phone: values.phone,
      address: values.address,
      socialLinks: {
        facebook: values.facebook || undefined,
        instagram: values.instagram || undefined,
      },
      logo: logoUrl,
    });
  };

  const handleLogoUploaded = (url: string) => {
    setLogoUrl(url);
    form.setValue("logo", url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        
        <LogoUploader 
          logoUrl={logoUrl} 
          onLogoUploaded={handleLogoUploaded} 
        />

        <SocialMediaFields form={form} />

        <FormActions onCancel={onCancel} isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};

export default RestaurantInfoForm;
