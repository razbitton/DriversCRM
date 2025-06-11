import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertTripSchema, type InsertTrip } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function NewDeliveryModal({ setOpen, onDeliveryCreated }: {
  setOpen: (open: boolean) => void;
  onDeliveryCreated?: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertTrip>({
    resolver: zodResolver(insertTripSchema),
    defaultValues: {
      trip_number: `DL${Date.now()}`,
      origin: "",
      destination: "",
      client_name: "",
      client_phone: "",
      trip_type: "delivery",
      status: "scheduled",
      scheduled_time: new Date(),
      notes: "",
    },
  });

  const createDeliveryMutation = useMutation({
    mutationFn: async (data: InsertTrip) => {
      const response = await apiRequest("POST", "/api/trips", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      toast({
        title: "שליחות נוצרה בהצלחה",
        description: "השליחות החדשה נוספה למערכת",
      });
      setOpen(false);
      onDeliveryCreated?.();
    },
    onError: () => {
      toast({
        title: "שגיאה ביצירת שליחות",
        description: "אנא נסה שנית",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTrip) => {
    createDeliveryMutation.mutate(data);
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
                  <FormLabel>נקודת איסוף</FormLabel>
                  <FormControl>
                    <Input placeholder="הכנס כתובת איסוף" {...field} />
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
                  <FormLabel>נקודת משלוח</FormLabel>
                  <FormControl>
                    <Input placeholder="הכנס כתובת משלוח" {...field} />
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
                  <FormLabel>שם שולח</FormLabel>
                  <FormControl>
                    <Input placeholder="שם השולח" {...field} />
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
                  <FormLabel>טלפון שולח</FormLabel>
                  <FormControl>
                    <Input placeholder="מספר טלפון שולח" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="scheduled_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>זמן מתוכנן לאיסוף</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : new Date())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>פרטי החבילה והערות</FormLabel>
                <FormControl>
                  <Textarea placeholder="תאור החבילה והערות נוספות..." rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              ביטול
            </Button>
            <Button type="submit" disabled={createDeliveryMutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800">
              {createDeliveryMutation.isPending ? "יוצר..." : "יצירת שליחות"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
