import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertTenderSchema, type InsertTender } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertTenderSchema.extend({
  scheduled_time: insertTenderSchema.shape.scheduled_time.optional(),
});

export default function NewTenderModal({ setOpen, onTenderCreated }: {
  setOpen: (open: boolean) => void;
  onTenderCreated?: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertTender>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tender_number: `T${Date.now()}`,
      origin: "",
      destination: "",
      client_name: "",
      client_phone: "",
      service_type: "delivery",
      status: "active",
      notes: "",
    },
  });

  const createTenderMutation = useMutation({
    mutationFn: async (data: InsertTender) => {
      const response = await apiRequest("POST", "/api/tenders", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "מכרז נוצר בהצלחה",
        description: "המכרז החדש נוסף למערכת",
      });
      setOpen(false);
      onTenderCreated?.();
    },
    onError: () => {
      toast({
        title: "שגיאה ביצירת מכרז",
        description: "אנא נסה שנית",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTender) => {
    createTenderMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>נקודת מוצא</FormLabel>
                  <FormControl>
                    <Input placeholder="הכנס כתובת מוצא" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>יעד</FormLabel>
                  <FormControl>
                    <Input placeholder="הכנס כתובת יעד" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם לקוח</FormLabel>
                  <FormControl>
                    <Input placeholder="שם הלקוח" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>טלפון</FormLabel>
                  <FormControl>
                    <Input placeholder="מספר טלפון" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>סוג שירות</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר סוג שירות" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="delivery">משלוח</SelectItem>
                      <SelectItem value="ride">הסעה</SelectItem>
                      <SelectItem value="special">מיוחד</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduled_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>זמן רצוי</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>הערות</FormLabel>
                <FormControl>
                  <Textarea placeholder="הערות נוספות..." rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              ביטול
            </Button>
            <Button type="submit" disabled={createTenderMutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800">
              {createTenderMutation.isPending ? "יוצר..." : "יצירת מכרז"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
