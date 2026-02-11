import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    console.log("Payment verification request:", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("Missing payment verification data");
      return NextResponse.json(
        { success: false, error: "Missing payment data" },
        { status: 400 },
      );
    }

    // Verify signature
    const body_string = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body_string)
      .digest("hex");

    console.log("Signature verification:", {
      expected: expectedSignature,
      received: razorpay_signature,
      match: expectedSignature === razorpay_signature,
    });

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      console.error("Signature mismatch - payment verification failed");
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
