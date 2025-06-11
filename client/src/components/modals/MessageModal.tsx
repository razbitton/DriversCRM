import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

type MessageFormData = {
  message: string;
  sendToAll: boolean;
  selectedDrivers: string[];
};

export default function MessageModal({ setOpen }: {
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  
  const form = useForm<MessageFormData>({
    defaultValues: {
      message: "",
      sendToAll: true,
      selectedDrivers: [],
    },
  });

  const onSubmit = (data: MessageFormData) => {
    // Mock sending message
    toast({
      title: "הודעה נשלחה בהצלחה",
      description: `ההודעה נשלחה ${data.sendToAll ? "לכל הנהגים" : `ל-${data.selectedDrivers.length} נהגים`}`,
    });
    setOpen(false);
  };

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="sendToAll"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    שלח לכל הנהגים
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>תוכן ההודעה</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="כתוב את תוכן ההודעה כאן..." 
                    rows={6} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              ביטול
            </Button>
            <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-gray-800">
              שלח הודעה
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
