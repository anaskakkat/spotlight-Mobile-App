import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();



http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    // console.log("Clerk Webhook Secret:", process.env.CLERK_WEBHOOK_SECRET);

    if (!webhookSecret) {
    //   console.log("Missing Clerk Webhook Secret");

      throw new Error(
        "Missing Clerk Webhook Secret. Please set CLERK_WEBHOOK_SECRET in your environment variables."
      );
    }

    // Retrieve headers required for signature verification
    const svixId = req.headers.get("svix-id");
    const svixSignature = req.headers.get("svix-signature");
    const svixTimestamp = req.headers.get("svix-timestamp");
    if (!svixId || !svixSignature || !svixTimestamp) {
      return new Response(
        "Missing required headers for webhook verification.",
        { status: 400 }
      );
    }

    // Read the request body
    const payload = await req.json();
    const body = JSON.stringify(payload);
    // console.log("payload-body->", body);

    // Verify the webhook signature
    const headers = {
      "svix-id": svixId,
      "svix-signature": svixSignature,
      "svix-timestamp": svixTimestamp,
    };
    const wh = new Webhook(webhookSecret);
    let evt: any;
    try {
      evt = wh.verify(body, headers);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response("Invalid webhook signature.", { status: 400 });
    }
    // console.log("Webhook triggered: ", evt);

    // Handle the webhook event
    const eventType = evt.type;
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, profile_image_url } =
        evt.data;
      const email = email_addresses[0]?.email_address || "";
      const name = `${first_name || ""} ${last_name || ""}`.trim();
      try {
        await ctx.runMutation(api.users.createUser, {
          email: email,
          fullname: name,
          image: profile_image_url,
          clerkId: id,
          username: email.split("@")[0],
        });
      } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Error processing webhook event.", { status: 500 });
      }
    }

    return new Response("Webhook received successfully.", { status: 200 });
  }),
});

export default http;
