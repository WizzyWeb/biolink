CREATE TABLE "profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"username" text NOT NULL,
	"display_name" text NOT NULL,
	"bio" text NOT NULL,
	"profile_image_url" text,
	"profile_views" integer DEFAULT 0,
	"link_clicks" integer DEFAULT 0,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar NOT NULL,
	"platform" text NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true,
	"clicks" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT false,
	"colors" jsonb NOT NULL,
	"gradients" jsonb NOT NULL,
	"fonts" jsonb NOT NULL,
	"layout" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"is_email_verified" boolean DEFAULT false,
	"email_verification_token" varchar,
	"email_verification_expires" timestamp,
	"password_reset_token" varchar,
	"password_reset_expires" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "themes" ADD CONSTRAINT "themes_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");