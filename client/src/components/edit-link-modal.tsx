import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertSocialLinkSchema, type SocialLink } from "@shared/schema";

const formSchema = insertSocialLinkSchema.extend({
  platform: z.string().min(1, "Platform is required"),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: SocialLink | null;
}

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "github", label: "GitHub" },
  { value: "website", label: "Website" },
  { value: "newsletter", label: "Newsletter" },
  { value: "custom", label: "Custom Link" },
];

export default function EditLinkModal({ isOpen, onClose, link }: EditLinkModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileId: link?.profileId || "",
      platform: link?.platform || "",
      title: link?.title || "",
      url: link?.url || "",
      description: link?.description || "",
      order: link?.order || 0,
    },
  });

  useEffect(() => {
    if (link) {
      form.reset({
        profileId: link.profileId,
        platform: link.platform,
        title: link.title,
        url: link.url,
        description: link.description || "",
        order: link.order,
      });
    }
  }, [link, form]);

  const editLinkMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!link) throw new Error("No link to edit");
      const response = await apiRequest("PATCH", `/api/links/${link.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Link updated",
        description: "Your link has been successfully updated.",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update the link. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating link:", error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    editLinkMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-charcoal">
            Edit Link
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-sans font-medium text-charcoal">
                    Platform
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-platform-edit">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem 
                          key={platform.value} 
                          value={platform.value}
                          data-testid={`option-edit-${platform.value}`}
                        >
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-sans font-medium text-charcoal">
                    Link Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., My Instagram"
                      {...field}
                      data-testid="input-title-edit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-sans font-medium text-charcoal">
                    URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://"
                      {...field}
                      data-testid="input-url-edit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-sans font-medium text-charcoal">
                    Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Short description"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-description-edit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-charcoal px-6 py-3 rounded-card font-sans font-semibold"
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-card font-sans font-semibold"
                data-testid="button-submit-edit"
              >
                {isSubmitting ? "Updating..." : "Update Link"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
