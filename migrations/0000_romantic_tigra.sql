CREATE TABLE "channels" (
	"id" serial PRIMARY KEY NOT NULL,
	"manager_first_name" text NOT NULL,
	"manager_last_name" text NOT NULL,
	"manager_address" text,
	"manager_city" text,
	"manager_phone" text,
	"manager_additional_phone" text,
	"manager_email" text,
	"channel_name" text NOT NULL,
	"channel_nickname" text,
	"channel_id_number" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "channels_channel_id_number_unique" UNIQUE("channel_id_number")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial_number" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"city" text NOT NULL,
	"address" text,
	"status" text DEFAULT 'regular' NOT NULL,
	"payment_status" text DEFAULT 'paid' NOT NULL,
	"last_activity_date" date,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "clients_serial_number_unique" UNIQUE("serial_number")
);
--> statement-breakpoint
CREATE TABLE "dispatchers" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"address" text NOT NULL,
	"city" text,
	"phone" text NOT NULL,
	"additional_phone" text NOT NULL,
	"email" text NOT NULL,
	"notes" text,
	"username" text,
	"id_number" text,
	"password" text,
	"random_username" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "driver_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"driver_id" text NOT NULL,
	"driver_name" text NOT NULL,
	"serial_number" text NOT NULL,
	"fixed_amount" numeric(10, 2),
	"mandatory_variables" numeric(10, 2),
	"optional_variables" numeric(10, 2),
	"previous_balance" numeric(10, 2) DEFAULT '0',
	"trip_count" integer,
	"total_amount" numeric(10, 2),
	"is_selected" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"id_number" text NOT NULL,
	"phone" text NOT NULL,
	"additional_phone" text,
	"email" text,
	"address" text NOT NULL,
	"residence_area" text NOT NULL,
	"channel_id" text,
	"license_number" text,
	"vehicle_type" text,
	"vehicle_license" text,
	"vehicle_seats" integer,
	"vehicle_condition" text,
	"vehicle_category" text,
	"status" text DEFAULT 'inactive' NOT NULL,
	"rating" numeric(2, 1) DEFAULT '0',
	"total_trips" integer DEFAULT 0,
	"join_date" date,
	"fixed_charge" numeric(10, 2),
	"variable_charge_percentage" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"channel_assignment" text,
	"assigned_driver_id" text,
	"assigned_driver_name" text,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"notes" text,
	"urgency_level" text DEFAULT 'medium' NOT NULL,
	"scheduled_date" date,
	"scheduled_time" text,
	"is_scheduled" boolean DEFAULT false,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_number" text,
	"driver_id" text NOT NULL,
	"driver_name" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_type" text DEFAULT 'transfer' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_date" timestamp,
	"due_date" timestamp,
	"phone" text,
	"description" text,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin" text NOT NULL,
	"destination" text NOT NULL,
	"one_way_price" numeric(10, 2),
	"return_price" numeric(10, 2),
	"round_trip_price" numeric(10, 2),
	"status" text DEFAULT 'active' NOT NULL,
	"channel_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pricing" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin" text NOT NULL,
	"destination" text NOT NULL,
	"one_way_price" numeric(10, 2),
	"return_price" numeric(10, 2),
	"round_trip_price" numeric(10, 2),
	"status" text DEFAULT 'active' NOT NULL,
	"channel_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tenders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"service_type" text NOT NULL,
	"origin" text NOT NULL,
	"destination" text NOT NULL,
	"publication_time" timestamp,
	"status" text DEFAULT 'available' NOT NULL,
	"assigned_driver_id" text,
	"assigned_driver_name" text,
	"assigned_driver_phone" text,
	"client_id" text,
	"client_name" text,
	"contact_phone" text,
	"estimated_price" numeric(10, 2),
	"actual_price" numeric(10, 2),
	"distance_km" numeric(8, 2),
	"notes" text,
	"completion_time" timestamp,
	"channel_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin" text NOT NULL,
	"destination" text NOT NULL,
	"client_name" text NOT NULL,
	"trip_type" text NOT NULL,
	"status" text DEFAULT 'waiting' NOT NULL,
	"driver_id" text,
	"driver_name" text,
	"scheduled_time" timestamp,
	"actual_start_time" timestamp,
	"completion_time" timestamp,
	"price" numeric(10, 2),
	"distance_km" numeric(8, 2),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
